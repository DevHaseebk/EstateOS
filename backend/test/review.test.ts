import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';

// Phase 2a contract §7 acceptance tests. Synthetic data only (D-116).
const key = 'test-internal-api-key-with-at-least-thirty-two-characters';
const ownerOrigin = 'https://admin.estateos.localhost';
const superOrigin = 'https://control.estateos.localhost';
const password = 'Orchid!Harbor!72?Sky';
const goodReason = 'Please add a clearer agency name and office area.';
type Portal = 'OWNER' | 'SUPER_ADMIN';

let mongo: MongoMemoryReplSet;
let app: Awaited<typeof import('../src/app.js')>['app'];
let models: typeof import('../src/models.js');
let review: typeof import('../src/review.js');
let validation: typeof import('../src/validation.js');
let superToken = '';
let ipCounter = 10;
const nextIp = () => `10.0.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`;

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
async function authedPost(portal: Portal, token: string, url: string, body: object, overrides: Record<string, string> = {}) {
  const ip = nextIp();
  const pre = await csrfFor(portal, ip, token);
  return supertest(app).post(url)
    .set({ ...base(portal, ip), origin: portal === 'OWNER' ? ownerOrigin : superOrigin, 'x-csrf-token': pre.token, 'x-session-token': token, ...overrides })
    .send(body);
}
function authedGet(portal: Portal, token: string, url: string) {
  return supertest(app).get(url).set({ ...base(portal, nextIp()), 'x-session-token': token });
}
async function newOwner(label: string) {
  const email = `${label}@example.test`;
  const created = await preAuthPost('OWNER', '/api/v1/owner/registrations', {
    ownerName: `Owner ${label}`, agencyName: `Agency ${label}`, mobile: '03001234567', whatsapp: '03001234567', email, password,
  });
  assert.equal(created.status, 201, JSON.stringify(created.body));
  const login = await preAuthPost('OWNER', '/api/v1/owner/sessions', { email, password });
  assert.equal(login.status, 200);
  return { agencyId: created.body.data.agency.id as string, token: login.body.internal.sessionToken as string };
}
const decide = (agencyId: string, body: object) => authedPost('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${agencyId}/review-decisions`, body);
const auditCount = (agencyId: string) => models.AgencyAudit.countDocuments({ agencyId });
const agencyOf = (agencyId: string) => models.Agency.findById(agencyId).lean();

before(async () => {
  process.env.INTERNAL_API_KEY = key;
  process.env.CSRF_SIGNING_KEY = 'test-csrf-signing-key-with-at-least-thirty-two-characters';
  process.env.OWNER_ORIGIN = ownerOrigin;
  process.env.SUPER_ADMIN_ORIGIN = superOrigin;
  app = (await import('../src/app.js')).app;
  models = await import('../src/models.js');
  review = await import('../src/review.js');
  validation = await import('../src/validation.js');
  const security = await import('../src/security.js');
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongo.getUri());
  await Promise.all([models.Agency.init(), models.User.init(), models.AuthSession.init(), models.AuthRateLimit.init(), models.AgencyAudit.init()]);
  await models.User.create({ role: 'SUPER_ADMIN', name: 'Review Operator', emailNormalized: 'reviewer@example.test', passwordHash: await security.hashPassword(password), bootstrapKey: 'TEST_ONLY' });
  const login = await preAuthPost('SUPER_ADMIN', '/api/v1/super-admin/sessions', { email: 'reviewer@example.test', password });
  assert.equal(login.status, 200);
  superToken = login.body.internal.sessionToken;
});
after(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); });

test('unit: transition table allows exactly the contract moves', () => {
  const expected: Record<string, Record<string, string | null>> = {
    APPROVE: { PENDING: 'APPROVED', CHANGES_REQUESTED: null, APPROVED: null, REJECTED: null },
    REQUEST_CHANGES: { PENDING: 'CHANGES_REQUESTED', CHANGES_REQUESTED: null, APPROVED: null, REJECTED: null },
    REJECT: { PENDING: 'REJECTED', CHANGES_REQUESTED: null, APPROVED: null, REJECTED: null },
    RESUBMIT: { PENDING: null, CHANGES_REQUESTED: 'PENDING', APPROVED: null, REJECTED: null },
    REOPEN: { PENDING: null, CHANGES_REQUESTED: null, APPROVED: null, REJECTED: 'PENDING' },
  };
  for (const [action, row] of Object.entries(expected)) {
    for (const [from, to] of Object.entries(row)) {
      assert.equal(review.nextReviewStatus(action as never, from), to, `${action} from ${from}`);
    }
  }
});

test('unit: ownerCanEdit only while Pending or Changes Requested and unrestricted', () => {
  assert.equal(review.ownerCanEdit({ reviewStatus: 'PENDING' }), true);
  assert.equal(review.ownerCanEdit({ reviewStatus: 'CHANGES_REQUESTED', restrictionStatus: 'NONE' }), true);
  assert.equal(review.ownerCanEdit({ reviewStatus: 'APPROVED' }), false);
  assert.equal(review.ownerCanEdit({ reviewStatus: 'REJECTED' }), false);
  assert.equal(review.ownerCanEdit({ reviewStatus: 'PENDING', restrictionStatus: 'BLOCKED' }), false);
});

test('unit: reason validation edges', () => {
  const parse = (body: object) => validation.reviewDecisionSchema.safeParse(body).success;
  const base = { decision: 'REJECT', expectedReviewVersion: 0 };
  assert.equal(parse({ ...base, reason: 'x'.repeat(9) }), false);
  assert.equal(parse({ ...base, reason: 'x'.repeat(10) }), true);
  assert.equal(parse({ ...base, reason: 'x'.repeat(1000) }), true);
  assert.equal(parse({ ...base, reason: 'x'.repeat(1001) }), false);
  assert.equal(parse({ ...base, reason: '               ' }), false);
  assert.equal(parse({ ...base }), false);
  assert.equal(parse({ decision: 'APPROVE', expectedReviewVersion: 0, reason: goodReason }), false);
  assert.equal(parse({ decision: 'APPROVE', expectedReviewVersion: 0 }), true);
  assert.equal(parse({ decision: 'ARCHIVE', expectedReviewVersion: 0 }), false);
});

test('Approve, Request Changes and Reject each write exactly one audit entry', async () => {
  const cases = [
    { decision: 'APPROVE', to: 'APPROVED', action: 'REVIEW_APPROVE' },
    { decision: 'REQUEST_CHANGES', to: 'CHANGES_REQUESTED', action: 'REVIEW_REQUEST_CHANGES', reason: goodReason },
    { decision: 'REJECT', to: 'REJECTED', action: 'REVIEW_REJECT', reason: goodReason },
  ];
  for (const [index, item] of cases.entries()) {
    const owner = await newOwner(`decide${index}`);
    const response = await decide(owner.agencyId, { decision: item.decision, expectedReviewVersion: 0, ...(item.reason ? { reason: item.reason } : {}) });
    assert.equal(response.status, 200, JSON.stringify(response.body));
    assert.equal(response.body.data.review.status, item.to);
    assert.equal(response.body.data.review.version, 1);
    const entries = await models.AgencyAudit.find({ agencyId: owner.agencyId }).lean();
    assert.equal(entries.length, 1);
    assert.equal(entries[0].action, item.action);
    assert.equal(entries[0].actorRole, 'SUPER_ADMIN');
    assert.equal(entries[0].fromStatus, 'PENDING');
    assert.equal(entries[0].toStatus, item.to);
    assert.equal(entries[0].reason ?? undefined, item.reason);
  }
});

test('invalid reasons are rejected with no state change and no audit', async () => {
  const owner = await newOwner('badreason');
  for (const body of [
    { decision: 'REJECT', expectedReviewVersion: 0 },
    { decision: 'REJECT', expectedReviewVersion: 0, reason: 'too short' },
    { decision: 'REQUEST_CHANGES', expectedReviewVersion: 0, reason: 'x'.repeat(1001) },
    { decision: 'APPROVE', expectedReviewVersion: 0, reason: goodReason },
  ]) {
    const response = await decide(owner.agencyId, body);
    assert.equal(response.status, 422, JSON.stringify(body));
  }
  assert.equal((await agencyOf(owner.agencyId))?.reviewStatus, 'PENDING');
  assert.equal(await auditCount(owner.agencyId), 0);
});

test('invalid transition and stale version both return 409', async () => {
  const owner = await newOwner('conflict');
  assert.equal((await decide(owner.agencyId, { decision: 'APPROVE', expectedReviewVersion: 0 })).status, 200);
  const again = await decide(owner.agencyId, { decision: 'APPROVE', expectedReviewVersion: 1 });
  assert.equal(again.status, 409);
  assert.equal(again.body.error.code, 'INVALID_TRANSITION');
  const stale = await decide(owner.agencyId, { decision: 'REJECT', expectedReviewVersion: 0, reason: goodReason });
  assert.equal(stale.status, 409);
  assert.equal(stale.body.error.code, 'REVIEW_CONFLICT');
  assert.equal(await auditCount(owner.agencyId), 1);
});

test('two parallel decisions: exactly one succeeds', async () => {
  const owner = await newOwner('parallel');
  const results = await Promise.all([
    decide(owner.agencyId, { decision: 'APPROVE', expectedReviewVersion: 0 }),
    decide(owner.agencyId, { decision: 'REJECT', expectedReviewVersion: 0, reason: goodReason }),
  ]);
  const statuses = results.map((result) => result.status).sort();
  assert.deepEqual(statuses, [200, 409]);
  assert.equal(await auditCount(owner.agencyId), 1);
  assert.equal((await agencyOf(owner.agencyId))?.reviewVersion, 1);
});

test('owner resubmit only from Changes Requested, own agency only', async () => {
  const a = await newOwner('resubA');
  const b = await newOwner('resubB');
  const early = await authedPost('OWNER', a.token, '/api/v1/owner/review-resubmissions', { expectedReviewVersion: 0 });
  assert.equal(early.status, 409);
  assert.equal(early.body.error.code, 'INVALID_TRANSITION');
  assert.equal((await decide(a.agencyId, { decision: 'REQUEST_CHANGES', expectedReviewVersion: 0, reason: goodReason })).status, 200);
  const viewed = await authedGet('OWNER', a.token, `/api/v1/owner/agencies/${a.agencyId}`);
  assert.equal(viewed.status, 200);
  assert.equal(viewed.body.data.review.status, 'CHANGES_REQUESTED');
  assert.equal(viewed.body.data.review.latestReview.reason, goodReason);
  assert.equal(viewed.body.data.canResubmit, true);
  assert.equal(viewed.body.data.canEdit, true);
  const injectedBody = await authedPost('OWNER', a.token, '/api/v1/owner/review-resubmissions', { expectedReviewVersion: 1, agencyId: b.agencyId });
  assert.equal(injectedBody.status, 422);
  const injectedHeader = await authedPost('OWNER', a.token, '/api/v1/owner/review-resubmissions', { expectedReviewVersion: 1 }, { 'x-agency-id': b.agencyId });
  assert.equal(injectedHeader.status, 422);
  const bTry = await authedPost('OWNER', b.token, '/api/v1/owner/review-resubmissions', { expectedReviewVersion: 1 });
  assert.equal(bTry.status, 409);
  assert.equal((await agencyOf(a.agencyId))?.reviewStatus, 'CHANGES_REQUESTED');
  const done = await authedPost('OWNER', a.token, '/api/v1/owner/review-resubmissions', { expectedReviewVersion: 1 });
  assert.equal(done.status, 200, JSON.stringify(done.body));
  assert.equal(done.body.data.review.status, 'PENDING');
  const entries = await models.AgencyAudit.find({ agencyId: a.agencyId }).sort({ at: 1 }).lean();
  assert.deepEqual(entries.map((entry) => entry.action), ['REVIEW_REQUEST_CHANGES', 'OWNER_RESUBMIT']);
  assert.equal(entries[1].actorRole, 'AGENCY_OWNER');
});

test('reopen only from Rejected and requires a reason', async () => {
  const owner = await newOwner('reopen');
  const reopenUrl = `/api/v1/super-admin/agencies/${owner.agencyId}/reopen`;
  assert.equal((await authedPost('SUPER_ADMIN', superToken, reopenUrl, { reason: goodReason, expectedReviewVersion: 0 })).status, 409);
  assert.equal((await decide(owner.agencyId, { decision: 'REJECT', expectedReviewVersion: 0, reason: goodReason })).status, 200);
  const rejectedView = await authedGet('OWNER', owner.token, `/api/v1/owner/agencies/${owner.agencyId}`);
  assert.equal(rejectedView.body.data.canEdit, false);
  assert.equal(rejectedView.body.data.canResubmit, false);
  assert.equal((await authedPost('SUPER_ADMIN', superToken, reopenUrl, { expectedReviewVersion: 1 })).status, 422);
  const reopened = await authedPost('SUPER_ADMIN', superToken, reopenUrl, { reason: 'Owner provided the missing details by phone.', expectedReviewVersion: 1 });
  assert.equal(reopened.status, 200);
  assert.equal(reopened.body.data.review.status, 'PENDING');
});

test('owner sessions cannot use Super Admin routes; CSRF and Origin enforced', async () => {
  const owner = await newOwner('boundary');
  const ownerAsSuper = await authedGet('SUPER_ADMIN', owner.token, '/api/v1/super-admin/review-queue');
  assert.equal(ownerAsSuper.status, 401);
  const ownerPortal = await authedGet('OWNER', owner.token, '/api/v1/super-admin/review-queue');
  assert.equal(ownerPortal.status, 403);
  const url = `/api/v1/super-admin/agencies/${owner.agencyId}/review-decisions`;
  const noCsrf = await supertest(app).post(url).set({ ...base('SUPER_ADMIN', nextIp()), origin: superOrigin, 'x-session-token': superToken }).send({ decision: 'APPROVE', expectedReviewVersion: 0 });
  assert.equal(noCsrf.status, 403);
  const foreign = await authedPost('SUPER_ADMIN', superToken, url, { decision: 'APPROVE', expectedReviewVersion: 0 }, { origin: 'https://evil.example' });
  assert.equal(foreign.status, 403);
  assert.equal((await agencyOf(owner.agencyId))?.reviewStatus, 'PENDING');
});

test('queue lists only Pending, oldest first, with pagination; unknown detail is 404', async () => {
  await models.Agency.updateMany({ reviewStatus: 'PENDING' }, { $set: { reviewStatus: 'APPROVED' } });
  const first = await newOwner('queue1');
  await new Promise((resolve) => setTimeout(resolve, 5));
  const second = await newOwner('queue2');
  const decided = await newOwner('queue3');
  assert.equal((await decide(decided.agencyId, { decision: 'APPROVE', expectedReviewVersion: 0 })).status, 200);
  const page1 = await authedGet('SUPER_ADMIN', superToken, '/api/v1/super-admin/review-queue?limit=1');
  assert.equal(page1.status, 200);
  assert.deepEqual(page1.body.data.items.map((item: { id: string }) => item.id), [first.agencyId]);
  assert.equal(page1.body.data.items[0].ownerName, 'Owner queue1');
  assert.ok(page1.body.data.nextCursor);
  assert.equal(page1.body.data.counts.PENDING, 2);
  const page2 = await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/review-queue?limit=1&cursor=${encodeURIComponent(page1.body.data.nextCursor)}`);
  assert.deepEqual(page2.body.data.items.map((item: { id: string }) => item.id), [second.agencyId]);
  assert.equal(page2.body.data.nextCursor, null);
  assert.equal((await authedGet('SUPER_ADMIN', superToken, '/api/v1/super-admin/review-queue?cursor=not-a-cursor')).status, 422);
  const detail = await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${decided.agencyId}`);
  assert.equal(detail.status, 200);
  assert.equal(detail.body.data.owner.email, 'queue3@example.test');
  assert.equal(detail.body.data.websiteReadiness, 'NOT_READY');
  assert.equal(detail.body.data.history.length, 1);
  assert.equal((await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${new mongoose.Types.ObjectId().toString()}`)).status, 404);
});

test('a failed audit write leaves the status unchanged; audit is append-only', async () => {
  const owner = await newOwner('auditfail');
  const original = models.AgencyAudit.create.bind(models.AgencyAudit);
  (models.AgencyAudit as unknown as { create: unknown }).create = async () => { throw new Error('simulated audit failure'); };
  try {
    const response = await decide(owner.agencyId, { decision: 'APPROVE', expectedReviewVersion: 0 });
    assert.equal(response.status, 500);
  } finally {
    (models.AgencyAudit as unknown as { create: unknown }).create = original;
  }
  const agency = await agencyOf(owner.agencyId);
  assert.equal(agency?.reviewStatus, 'PENDING');
  assert.equal(agency?.reviewVersion, 0);
  assert.equal(await auditCount(owner.agencyId), 0);
  assert.equal((await decide(owner.agencyId, { decision: 'APPROVE', expectedReviewVersion: 0 })).status, 200);
  await assert.rejects(() => models.AgencyAudit.updateOne({ agencyId: owner.agencyId }, { $set: { reason: 'tampered' } }), /AUDIT_APPEND_ONLY/);
  await assert.rejects(() => models.AgencyAudit.deleteMany({ agencyId: owner.agencyId }), /AUDIT_APPEND_ONLY/);
});

test('migration CLI backfills legacy agencies and is idempotent', async () => {
  const uri = mongo.getUri('migration_test');
  const legacyDb = mongoose.connection.useDb('migration_test');
  const createdAt = new Date('2026-10-01T10:00:00Z');
  await legacyDb.collection('agencies').insertOne({ name: 'Legacy Agency', mobileE164: '+923001234567', whatsappE164: '+923001234567', reviewStatus: 'PENDING', createdAt, updatedAt: createdAt });
  const runner = path.resolve(process.cwd(), '../node_modules/tsx/dist/cli.mjs');
  const run = () => spawnSync(process.execPath, [runner, 'src/cli/migrate-review-axes.ts'], { cwd: process.cwd(), env: { ...process.env, MONGODB_URI: uri }, encoding: 'utf8', timeout: 30000 });
  const first = run();
  assert.equal(first.status, 0, first.stderr);
  const migrated = await legacyDb.collection('agencies').findOne({ name: 'Legacy Agency' });
  assert.equal(migrated?.reviewVersion, 0);
  assert.equal(migrated?.restrictionStatus, 'NONE');
  assert.equal(migrated?.publicationStatus, 'NEVER_PUBLISHED');
  assert.equal((migrated?.submittedForReviewAt as Date).toISOString(), createdAt.toISOString());
  const second = run();
  assert.equal(second.status, 0, second.stderr);
  assert.match(second.stdout, / 0 field update/);
});
