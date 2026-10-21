import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { execFile } from 'node:child_process';
import path from 'node:path';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';

// Phase 2b contract §8 acceptance tests. Synthetic data only (D-116).
const key = 'test-internal-api-key-with-at-least-thirty-two-characters';
const ownerOrigin = 'https://admin.estateos.localhost';
const superOrigin = 'https://control.estateos.localhost';
const password = 'Orchid!Harbor!72?Sky';
const reason = 'Repeated complaints about fake listings from buyers.';
type Portal = 'OWNER' | 'SUPER_ADMIN';

let mongo: MongoMemoryReplSet;
let app: Awaited<typeof import('../src/app.js')>['app'];
let models: typeof import('../src/models.js');
let restriction: typeof import('../src/restriction.js');
let validation: typeof import('../src/validation.js');
let superToken = '';
let ipCounter = 10;
const nextIp = () => `10.1.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`;

function base(portal: Portal, ip: string) {
  return { 'x-internal-api-key': key, 'x-portal': portal, 'x-client-ip': ip };
}
async function csrfFor(portal: Portal, ip: string, token?: string) {
  const request = supertest(app).get('/api/v1/auth/csrf').set(base(portal, ip));
  if (token) request.set('x-session-token', token);
  const response = await request;
  assert.equal(response.status, 200);
  return { token: response.body.data.csrfToken as string, nonce: response.body.internal?.preauthNonce as string | undefined };
}
async function preAuthPost(portal: Portal, url: string, body: object) {
  const ip = nextIp();
  const pre = await csrfFor(portal, ip);
  return supertest(app).post(url).set({ ...base(portal, ip), origin: portal === 'OWNER' ? ownerOrigin : superOrigin, 'x-csrf-token': pre.token, 'x-preauth-nonce': pre.nonce! }).send(body);
}
async function authedPost(portal: Portal, token: string, url: string, body: object) {
  const ip = nextIp();
  const pre = await csrfFor(portal, ip, token);
  return supertest(app).post(url).set({ ...base(portal, ip), origin: portal === 'OWNER' ? ownerOrigin : superOrigin, 'x-csrf-token': pre.token, 'x-session-token': token }).send(body);
}
function authedGet(portal: Portal, token: string, url: string) {
  return supertest(app).get(url).set({ ...base(portal, nextIp()), 'x-session-token': token });
}
const ownerLogin = (email: string, secret = password) => preAuthPost('OWNER', '/api/v1/owner/sessions', { email, password: secret });
async function newOwner(label: string) {
  const email = `${label}@example.test`;
  const created = await preAuthPost('OWNER', '/api/v1/owner/registrations', {
    ownerName: `Owner ${label}`, agencyName: `Agency ${label}`, mobile: '03001234567', whatsapp: '03001234567', email, password,
  });
  assert.equal(created.status, 201, JSON.stringify(created.body));
  const login = await ownerLogin(email);
  assert.equal(login.status, 200);
  return { email, agencyId: created.body.data.agency.id as string, token: login.body.internal.sessionToken as string };
}
const restrict = (agencyId: string, body: object) => authedPost('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${agencyId}/restrictions`, body);
const decide = (agencyId: string, body: object) => authedPost('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${agencyId}/review-decisions`, body);
const agencyOf = (agencyId: string) => models.Agency.findById(agencyId).lean();
const restrictionAudits = (agencyId: string) => models.AgencyAudit.find({ agencyId, axis: 'RESTRICTION' }).sort({ at: 1 }).lean();
const ownerView = (owner: { agencyId: string; token: string }) => authedGet('OWNER', owner.token, `/api/v1/owner/agencies/${owner.agencyId}`);

before(async () => {
  process.env.INTERNAL_API_KEY = key;
  process.env.CSRF_SIGNING_KEY = 'test-csrf-signing-key-with-at-least-thirty-two-characters';
  process.env.OWNER_ORIGIN = ownerOrigin;
  process.env.SUPER_ADMIN_ORIGIN = superOrigin;
  app = (await import('../src/app.js')).app;
  models = await import('../src/models.js');
  restriction = await import('../src/restriction.js');
  validation = await import('../src/validation.js');
  const security = await import('../src/security.js');
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongo.getUri());
  await Promise.all([models.Agency.init(), models.User.init(), models.AuthSession.init(), models.AuthRateLimit.init(), models.AgencyAudit.init()]);
  await models.User.create({ role: 'SUPER_ADMIN', name: 'Restriction Operator', emailNormalized: 'operator@example.test', passwordHash: await security.hashPassword(password), bootstrapKey: 'TEST_ONLY' });
  const login = await preAuthPost('SUPER_ADMIN', '/api/v1/super-admin/sessions', { email: 'operator@example.test', password });
  assert.equal(login.status, 200);
  superToken = login.body.internal.sessionToken;
});
after(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); });

test('unit: restriction transition table allows exactly the contract moves', () => {
  const expected: Record<string, Record<string, string | null>> = {
    BLOCK: { NONE: 'BLOCKED', BLOCKED: null, DEACTIVATED: null },
    DEACTIVATE: { NONE: 'DEACTIVATED', BLOCKED: null, DEACTIVATED: null },
    RESTORE: { NONE: null, BLOCKED: 'NONE', DEACTIVATED: 'NONE' },
  };
  for (const [action, row] of Object.entries(expected)) {
    for (const [from, to] of Object.entries(row)) {
      assert.equal(restriction.nextRestrictionStatus(action as never, from), to, `${action} from ${from}`);
    }
  }
});

test('unit: restriction reason and directory query validation', () => {
  const parse = (body: object) => validation.restrictionSchema.safeParse(body).success;
  const ok = { action: 'BLOCK', expectedRestrictionVersion: 0 };
  assert.equal(parse({ ...ok, reason: 'x'.repeat(9) }), false);
  assert.equal(parse({ ...ok, reason: 'x'.repeat(10) }), true);
  assert.equal(parse({ ...ok, reason: 'x'.repeat(1000) }), true);
  assert.equal(parse({ ...ok, reason: 'x'.repeat(1001) }), false);
  assert.equal(parse({ ...ok, reason: '            ' }), false);
  assert.equal(parse({ action: 'RESTORE', expectedRestrictionVersion: 0 }), false);
  assert.equal(parse({ ...ok, action: 'DELETE', reason }), false);
  const query = (input: object) => validation.directoryQuerySchema.safeParse(input).success;
  assert.equal(query({}), true);
  assert.equal(query({ q: 'a' }), false);
  assert.equal(query({ review: 'ARCHIVED' }), false);
  assert.equal(query({ restriction: 'BLOCKED', review: 'APPROVED', limit: '5' }), true);
});

test('Block, Deactivate and Restore each write exactly one restriction audit entry', async () => {
  const owner = await newOwner('lifecycle');
  const steps = [
    { action: 'DEACTIVATE', to: 'DEACTIVATED', audit: 'RESTRICT_DEACTIVATE', from: 'NONE' },
    { action: 'RESTORE', to: 'NONE', audit: 'RESTRICT_RESTORE', from: 'DEACTIVATED' },
    { action: 'BLOCK', to: 'BLOCKED', audit: 'RESTRICT_BLOCK', from: 'NONE' },
    { action: 'RESTORE', to: 'NONE', audit: 'RESTRICT_RESTORE', from: 'BLOCKED' },
  ];
  for (const [version, step] of steps.entries()) {
    const response = await restrict(owner.agencyId, { action: step.action, reason, expectedRestrictionVersion: version });
    assert.equal(response.status, 200, JSON.stringify(response.body));
    assert.equal(response.body.data.restriction.status, step.to);
    assert.equal(response.body.data.restriction.version, version + 1);
    const entries = await restrictionAudits(owner.agencyId);
    assert.equal(entries.length, version + 1);
    const entry = entries.at(-1)!;
    assert.equal(entry.action, step.audit);
    assert.equal(entry.actorRole, 'SUPER_ADMIN');
    assert.equal(entry.fromStatus, step.from);
    assert.equal(entry.toStatus, step.to);
    assert.equal(entry.reason, reason);
  }
  const agency = await agencyOf(owner.agencyId);
  assert.equal(agency?.reviewStatus, 'PENDING');
  assert.equal(agency?.reviewVersion, 0);
});

test('invalid reasons, wrong starting state, stale version and parallel actions', async () => {
  const owner = await newOwner('conflicts');
  for (const body of [
    { action: 'BLOCK', expectedRestrictionVersion: 0 },
    { action: 'BLOCK', expectedRestrictionVersion: 0, reason: 'too short' },
    { action: 'DEACTIVATE', expectedRestrictionVersion: 0, reason: 'x'.repeat(1001) },
  ]) assert.equal((await restrict(owner.agencyId, body)).status, 422);
  assert.equal((await restrictionAudits(owner.agencyId)).length, 0);
  const restore = await restrict(owner.agencyId, { action: 'RESTORE', reason, expectedRestrictionVersion: 0 });
  assert.equal(restore.status, 409);
  assert.equal(restore.body.error.code, 'INVALID_TRANSITION');
  assert.equal((await restrict(owner.agencyId, { action: 'DEACTIVATE', reason, expectedRestrictionVersion: 0 })).status, 200);
  const switchDirect = await restrict(owner.agencyId, { action: 'BLOCK', reason, expectedRestrictionVersion: 1 });
  assert.equal(switchDirect.status, 409);
  assert.equal(switchDirect.body.error.code, 'INVALID_TRANSITION');
  const stale = await restrict(owner.agencyId, { action: 'RESTORE', reason, expectedRestrictionVersion: 0 });
  assert.equal(stale.status, 409);
  assert.equal(stale.body.error.code, 'RESTRICTION_CONFLICT');
  const parallel = await Promise.all([
    restrict(owner.agencyId, { action: 'RESTORE', reason, expectedRestrictionVersion: 1 }),
    restrict(owner.agencyId, { action: 'RESTORE', reason, expectedRestrictionVersion: 1 }),
  ]);
  assert.deepEqual(parallel.map((response) => response.status).sort(), [200, 409]);
  assert.equal((await restrictionAudits(owner.agencyId)).length, 2);
  assert.equal((await agencyOf(owner.agencyId))?.restrictionVersion, 2);
});

test('Block revokes owner sessions; blocked sign-in is refused only after a correct password', async () => {
  const owner = await newOwner('blocked');
  const second = await ownerLogin(owner.email);
  assert.equal(second.status, 200);
  assert.equal((await restrict(owner.agencyId, { action: 'BLOCK', reason, expectedRestrictionVersion: 0 })).status, 200);
  const active = await models.AuthSession.countDocuments({ revokedAt: { $exists: false }, userId: (await models.User.findOne({ agencyId: owner.agencyId }).lean())!._id });
  assert.equal(active, 0);
  assert.equal((await ownerView(owner)).status, 401);
  assert.equal((await authedGet('OWNER', second.body.internal.sessionToken, '/api/v1/owner/session')).status, 401);
  const blocked = await ownerLogin(owner.email);
  assert.equal(blocked.status, 403);
  assert.equal(blocked.body.error.code, 'AGENCY_BLOCKED');
  assert.equal(blocked.body.internal, undefined);
  const wrong = await ownerLogin(owner.email, 'Wrong!Password!123?');
  assert.equal(wrong.status, 401);
  assert.equal(wrong.body.error.code, 'INVALID_CREDENTIALS');
});

test('a Blocked agency whose session was not revoked still gets 401 (defence in depth)', async () => {
  const owner = await newOwner('depth');
  await models.Agency.updateOne({ _id: owner.agencyId }, { $set: { restrictionStatus: 'BLOCKED' } });
  assert.equal((await ownerView(owner)).status, 401);
  assert.equal((await authedGet('OWNER', owner.token, '/api/v1/owner/session')).status, 401);
});

test('Deactivated owner can sign in and read, but every owner mutation is refused', async () => {
  const owner = await newOwner('readonly');
  assert.equal((await decide(owner.agencyId, { decision: 'REQUEST_CHANGES', reason, expectedReviewVersion: 0 })).status, 200);
  const deactivateReason = 'Agency has not responded to support for 60 days.';
  assert.equal((await restrict(owner.agencyId, { action: 'DEACTIVATE', reason: deactivateReason, expectedRestrictionVersion: 0 })).status, 200);
  const login = await ownerLogin(owner.email);
  assert.equal(login.status, 200);
  assert.equal(login.body.data.agency.restrictionStatus, 'DEACTIVATED');
  const view = await ownerView(owner);
  assert.equal(view.status, 200);
  assert.deepEqual(view.body.data.restriction, { status: 'DEACTIVATED', reason: deactivateReason });
  assert.equal(view.body.data.canEdit, false);
  assert.equal(view.body.data.canResubmit, false);
  const resubmit = await authedPost('OWNER', owner.token, '/api/v1/owner/review-resubmissions', { expectedReviewVersion: 1 });
  assert.equal(resubmit.status, 403);
  assert.equal(resubmit.body.error.code, 'AGENCY_DEACTIVATED');
  assert.equal((await agencyOf(owner.agencyId))?.reviewStatus, 'CHANGES_REQUESTED');
});

test('Blocked owner never sees the Block reason; owner view hides it after Restore too', async () => {
  const owner = await newOwner('hidden');
  assert.equal((await restrict(owner.agencyId, { action: 'BLOCK', reason, expectedRestrictionVersion: 0 })).status, 200);
  assert.equal((await restrict(owner.agencyId, { action: 'RESTORE', reason: 'Owner verified identity with support.', expectedRestrictionVersion: 1 })).status, 200);
  const login = await ownerLogin(owner.email);
  assert.equal(login.status, 200);
  const view = await ownerView({ agencyId: owner.agencyId, token: login.body.internal.sessionToken });
  assert.deepEqual(view.body.data.restriction, { status: 'NONE' });
});

test('review decisions are frozen while restricted; a Block racing an Approve never leaves a later approval', async () => {
  const owner = await newOwner('frozen');
  assert.equal((await restrict(owner.agencyId, { action: 'DEACTIVATE', reason, expectedRestrictionVersion: 0 })).status, 200);
  const approve = await decide(owner.agencyId, { decision: 'APPROVE', expectedReviewVersion: 0 });
  assert.equal(approve.status, 409);
  assert.equal(approve.body.error.code, 'AGENCY_RESTRICTED');
  assert.equal((await decide(owner.agencyId, { decision: 'REJECT', reason, expectedReviewVersion: 0 })).status, 409);
  assert.equal((await agencyOf(owner.agencyId))?.reviewStatus, 'PENDING');

  const rejected = await newOwner('frozenreopen');
  assert.equal((await decide(rejected.agencyId, { decision: 'REJECT', reason, expectedReviewVersion: 0 })).status, 200);
  assert.equal((await restrict(rejected.agencyId, { action: 'BLOCK', reason, expectedRestrictionVersion: 0 })).status, 200);
  const reopen = await authedPost('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${rejected.agencyId}/reopen`, { reason, expectedReviewVersion: 1 });
  assert.equal(reopen.status, 409);
  assert.equal(reopen.body.error.code, 'AGENCY_RESTRICTED');

  // Phase 2b §3: whichever lands first wins; an approval can never be recorded after the Block.
  const race = await newOwner('race');
  const [approved, blocked] = await Promise.all([
    decide(race.agencyId, { decision: 'APPROVE', expectedReviewVersion: 0 }),
    restrict(race.agencyId, { action: 'BLOCK', reason, expectedRestrictionVersion: 0 }),
  ]);
  assert.equal(blocked.status, 200);
  const agency = await agencyOf(race.agencyId);
  assert.equal(agency?.restrictionStatus, 'BLOCKED');
  const actions = (await models.AgencyAudit.find({ agencyId: race.agencyId }).sort({ at: 1, _id: 1 }).lean()).map((entry) => entry.action);
  if (approved.status === 200) {
    assert.deepEqual(actions, ['REVIEW_APPROVE', 'RESTRICT_BLOCK']);
  } else {
    assert.equal(approved.body.error.code, 'AGENCY_RESTRICTED');
    assert.deepEqual(actions, ['RESTRICT_BLOCK']);
    assert.equal(agency?.reviewStatus, 'PENDING');
  }
});

test('Restore returns to None with review status unchanged; owner can sign in again', async () => {
  const owner = await newOwner('restored');
  assert.equal((await decide(owner.agencyId, { decision: 'APPROVE', expectedReviewVersion: 0 })).status, 200);
  assert.equal((await restrict(owner.agencyId, { action: 'BLOCK', reason, expectedRestrictionVersion: 0 })).status, 200);
  assert.equal((await ownerLogin(owner.email)).status, 403);
  const restored = await restrict(owner.agencyId, { action: 'RESTORE', reason: 'Issue resolved with the agency owner.', expectedRestrictionVersion: 1 });
  assert.equal(restored.status, 200);
  const agency = await agencyOf(owner.agencyId);
  assert.equal(agency?.restrictionStatus, 'NONE');
  assert.equal(agency?.reviewStatus, 'APPROVED');
  assert.equal(agency?.publicationStatus, 'NEVER_PUBLISHED');
  assert.equal((await ownerLogin(owner.email)).status, 200);
  const detail = await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${owner.agencyId}`);
  assert.equal(detail.body.data.restriction.status, 'NONE');
  assert.equal(detail.body.data.restriction.latestRestriction.action, 'RESTORE');
  assert.deepEqual(detail.body.data.history.map((entry: { axis: string }) => entry.axis), ['RESTRICTION', 'RESTRICTION', 'REVIEW']);
});

test('directory: newest first, filters, literal search, pagination, validation and portal boundary', async () => {
  const a = await newOwner('dirsearch-alpha');
  await new Promise((resolve) => setTimeout(resolve, 5));
  const b = await newOwner('dirsearch-beta');
  await new Promise((resolve) => setTimeout(resolve, 5));
  const c = await newOwner('dirsearch-gamma');
  assert.equal((await decide(b.agencyId, { decision: 'APPROVE', expectedReviewVersion: 0 })).status, 200);
  assert.equal((await restrict(c.agencyId, { action: 'DEACTIVATE', reason, expectedRestrictionVersion: 0 })).status, 200);
  await models.Agency.updateOne({ _id: a.agencyId }, { $set: { name: 'Literal (A+B).* Realty' } });
  const list = (query: string) => authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies?${query}`);
  const ids = (response: supertest.Response) => response.body.data.items.map((item: { id: string }) => item.id);

  const all = await list('q=dirsearch');
  assert.equal(all.status, 200);
  assert.deepEqual(ids(all), [c.agencyId, b.agencyId, a.agencyId]);
  assert.equal(all.body.data.items[0].ownerEmail, 'dirsearch-gamma@example.test');
  assert.equal(all.body.data.items[0].restrictionStatus, 'DEACTIVATED');
  assert.equal(all.body.data.items[0].websiteReadiness, 'NOT_READY');
  assert.deepEqual(ids(await list('q=dirsearch&review=APPROVED')), [b.agencyId]);
  assert.deepEqual(ids(await list('q=dirsearch&restriction=DEACTIVATED')), [c.agencyId]);
  assert.deepEqual(ids(await list('q=dirsearch&restriction=NONE')), [b.agencyId, a.agencyId]);
  assert.deepEqual(ids(await list(`q=${encodeURIComponent('(A+B).*')}`)), [a.agencyId]);
  assert.deepEqual(ids(await list(`q=${encodeURIComponent('.*')}`)), [a.agencyId]);
  assert.deepEqual(ids(await list('q=DIRSEARCH-BETA%40EXAMPLE')), [b.agencyId]);

  const page1 = await list('q=dirsearch&limit=2');
  assert.deepEqual(ids(page1), [c.agencyId, b.agencyId]);
  assert.ok(page1.body.data.nextCursor);
  const page2 = await list(`q=dirsearch&limit=2&cursor=${encodeURIComponent(page1.body.data.nextCursor)}`);
  assert.deepEqual(ids(page2), [a.agencyId]);
  assert.equal(page2.body.data.nextCursor, null);

  assert.equal((await list('review=ARCHIVED')).status, 422);
  assert.equal((await list('q=x')).status, 422);
  assert.equal((await list('agencyId=abc')).status, 422);
  assert.equal((await authedGet('OWNER', b.token, '/api/v1/super-admin/agencies')).status, 403);
  assert.equal((await authedGet('SUPER_ADMIN', b.token, '/api/v1/super-admin/agencies')).status, 401);
});

test('a failed audit or session revocation rolls back the whole restriction change', async () => {
  const owner = await newOwner('rollback');
  const originalCreate = models.AgencyAudit.create.bind(models.AgencyAudit);
  (models.AgencyAudit as unknown as { create: unknown }).create = async () => { throw new Error('simulated audit failure'); };
  try {
    assert.equal((await restrict(owner.agencyId, { action: 'BLOCK', reason, expectedRestrictionVersion: 0 })).status, 500);
  } finally { (models.AgencyAudit as unknown as { create: unknown }).create = originalCreate; }
  const originalRevoke = models.AuthSession.updateMany.bind(models.AuthSession);
  (models.AuthSession as unknown as { updateMany: unknown }).updateMany = async () => { throw new Error('simulated revocation failure'); };
  try {
    assert.equal((await restrict(owner.agencyId, { action: 'BLOCK', reason, expectedRestrictionVersion: 0 })).status, 500);
  } finally { (models.AuthSession as unknown as { updateMany: unknown }).updateMany = originalRevoke; }
  const agency = await agencyOf(owner.agencyId);
  assert.equal(agency?.restrictionStatus, 'NONE');
  assert.equal(agency?.restrictionVersion, 0);
  assert.equal((await restrictionAudits(owner.agencyId)).length, 0);
  assert.equal((await ownerView(owner)).status, 200);
});

test('migration backfills restrictionVersion and the audit axis, and stays idempotent', async () => {
  const uri = mongo.getUri('migration_2b');
  const legacyDb = mongoose.connection.useDb('migration_2b');
  const createdAt = new Date('2026-10-01T10:00:00Z');
  const { insertedId } = await legacyDb.collection('agencies').insertOne({
    name: 'Legacy 2a Agency', mobileE164: '+923001234567', whatsappE164: '+923001234567', reviewStatus: 'APPROVED',
    reviewVersion: 1, submittedForReviewAt: createdAt, restrictionStatus: 'NONE', publicationStatus: 'NEVER_PUBLISHED', createdAt, updatedAt: createdAt,
  });
  await legacyDb.collection('agencyaudits').insertOne({
    at: createdAt, agencyId: insertedId, actorUserId: new mongoose.Types.ObjectId(), actorRole: 'SUPER_ADMIN',
    action: 'REVIEW_APPROVE', fromStatus: 'PENDING', toStatus: 'APPROVED',
  });
  const runner = path.resolve(process.cwd(), '../node_modules/tsx/dist/cli.mjs');
  // Async on purpose: a sync spawn blocks this process, so the in-memory mongod's piped log fills up and it stalls.
  const run = () => new Promise<{ status: number | null; stdout: string; stderr: string }>((resolve) => {
    execFile(process.execPath, [runner, 'src/cli/migrate-review-axes.ts'], { cwd: process.cwd(), env: { ...process.env, MONGODB_URI: uri }, encoding: 'utf8', timeout: 30000 },
      (error, stdout, stderr) => resolve({ status: error ? (typeof error.code === 'number' ? error.code : null) : 0, stdout, stderr }));
  });
  const first = await run();
  assert.equal(first.status, 0, first.stderr);
  // restrictionVersion + audit axis (2b), plus profileVersion + publicContact (3a).
  assert.match(first.stdout, / 4 field update/);
  assert.equal((await legacyDb.collection('agencies').findOne({ _id: insertedId }))?.restrictionVersion, 0);
  assert.equal((await legacyDb.collection('agencyaudits').findOne({ agencyId: insertedId }))?.axis, 'REVIEW');
  const second = await run();
  assert.equal(second.status, 0, second.stderr);
  assert.match(second.stdout, / 0 field update/);
});
