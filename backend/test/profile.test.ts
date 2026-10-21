import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { execFile } from 'node:child_process';
import path from 'node:path';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';

// Phase 3a contract §7 acceptance tests. Synthetic data only (D-116).
const key = 'test-internal-api-key-with-at-least-thirty-two-characters';
const ownerOrigin = 'https://admin.estateos.localhost';
const superOrigin = 'https://control.estateos.localhost';
const password = 'Orchid!Harbor!72?Sky';
const reason = 'Synthetic reason for a Phase 3a profile test.';
type Portal = 'OWNER' | 'SUPER_ADMIN';

let mongo: MongoMemoryReplSet;
let app: Awaited<typeof import('../src/app.js')>['app'];
let models: typeof import('../src/models.js');
let review: typeof import('../src/review.js');
let validation: typeof import('../src/validation.js');
let superToken = '';
let ipCounter = 10;
const nextIp = () => `10.2.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`;

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
async function authed(method: 'post' | 'put', portal: Portal, token: string, url: string, body: object, extra: Record<string, string> = {}) {
  const ip = nextIp();
  const pre = await csrfFor(portal, ip, token);
  return supertest(app)[method](url)
    .set({ ...base(portal, ip), origin: portal === 'OWNER' ? ownerOrigin : superOrigin, 'x-csrf-token': pre.token, 'x-session-token': token, ...extra })
    .send(body);
}
function authedGet(portal: Portal, token: string, url: string) {
  return supertest(app).get(url).set({ ...base(portal, nextIp()), 'x-session-token': token });
}
async function newOwner(label: string) {
  const email = `${label}@example.test`;
  const created = await preAuthPost('OWNER', '/api/v1/owner/registrations', {
    ownerName: `Owner ${label}`, agencyName: `Agency ${label}`, mobile: '03001234567', whatsapp: '03007654321', email, password,
  });
  assert.equal(created.status, 201, JSON.stringify(created.body));
  const login = await preAuthPost('OWNER', '/api/v1/owner/sessions', { email, password });
  assert.equal(login.status, 200);
  return { email, agencyId: created.body.data.agency.id as string, token: login.body.internal.sessionToken as string };
}
const getProfile = (token: string) => authedGet('OWNER', token, '/api/v1/owner/profile');
const putProfile = (token: string, body: object, extra: Record<string, string> = {}) => authed('put', 'OWNER', token, '/api/v1/owner/profile', body, extra);
const superPost = (url: string, body: object) => authed('post', 'SUPER_ADMIN', superToken, url, body);
function fullForm(version: number, overrides: Record<string, unknown> = {}) {
  return {
    agencyName: 'Harbor View Realty', ownerName: 'Sana Example', mobile: '0300 111 2222', whatsapp: '+923004445555',
    publicContact: { showMobile: false, showWhatsapp: true },
    profile: { description: 'Family-run agency for homes and plots.', officeAddress: 'Office 4, Example Plaza', city: 'Karachi', serviceAreas: 'DHA, Clifton', publicEmail: 'Hello@Example.test' },
    expectedProfileVersion: version,
    ...overrides,
  };
}

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
  await models.User.create({ role: 'SUPER_ADMIN', name: 'Profile Operator', emailNormalized: 'profiles@example.test', passwordHash: await security.hashPassword(password), bootstrapKey: 'TEST_ONLY' });
  const login = await preAuthPost('SUPER_ADMIN', '/api/v1/super-admin/sessions', { email: 'profiles@example.test', password });
  assert.equal(login.status, 200);
  superToken = login.body.internal.sessionToken;
});
after(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); });

test('unit: ownerCanEdit for every review and restriction combination (Phase 3a §3)', () => {
  const editable = new Set(['PENDING', 'CHANGES_REQUESTED', 'APPROVED']);
  for (const reviewStatus of ['PENDING', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED']) {
    for (const restrictionStatus of ['NONE', 'DEACTIVATED', 'BLOCKED']) {
      const expected = editable.has(reviewStatus) && restrictionStatus === 'NONE';
      assert.equal(review.ownerCanEdit({ reviewStatus, restrictionStatus }), expected, `${reviewStatus}/${restrictionStatus}`);
    }
  }
});

test('unit: profile schema limits, phones, optional values and unknown fields', () => {
  const parse = (overrides: Record<string, unknown>) => validation.profileSchema.safeParse(fullForm(0, overrides));
  assert.equal(parse({}).success, true);
  const parsed = parse({});
  assert.ok(parsed.success);
  assert.equal(parsed.data.mobile, '+923001112222');
  assert.equal(parsed.data.profile.publicEmail, 'hello@example.test');
  const empty = parse({ profile: { description: '   ', officeAddress: '', city: '', serviceAreas: '', publicEmail: '' } });
  assert.ok(empty.success);
  assert.deepEqual(Object.values(empty.data.profile).filter((value) => value !== undefined), []);
  const limits: [string, number][] = [['description', 600], ['officeAddress', 200], ['city', 80], ['serviceAreas', 200]];
  for (const [field, max] of limits) {
    assert.equal(parse({ profile: { [field]: 'x'.repeat(max) } }).success, true, `${field} at ${max}`);
    assert.equal(parse({ profile: { [field]: 'x'.repeat(max + 1) } }).success, false, `${field} at ${max + 1}`);
  }
  assert.equal(parse({ agencyName: 'A' }).success, false);
  assert.equal(parse({ agencyName: 'x'.repeat(121) }).success, false);
  assert.equal(parse({ ownerName: 'x'.repeat(101) }).success, false);
  assert.equal(parse({ mobile: '12345' }).success, false);
  assert.equal(parse({ profile: { publicEmail: 'not-an-email' } }).success, false);
  assert.equal(parse({ publicContact: { showMobile: true } }).success, false);
  assert.equal(parse({ website: 'https://example.test' }).success, false);
  assert.equal(parse({ profile: { logo: 'x' } }).success, false);
});

test('GET returns the own profile with public contact off by default', async () => {
  const owner = await newOwner('defaults');
  const response = await getProfile(owner.token);
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.data.publicContact, { showMobile: false, showWhatsapp: false });
  assert.deepEqual(response.body.data.profile, {});
  assert.equal(response.body.data.agencyName, 'Agency defaults');
  assert.equal(response.body.data.ownerName, 'Owner defaults');
  assert.equal(response.body.data.loginEmail, 'defaults@example.test');
  assert.equal(response.body.data.mobile, '+923001234567');
  assert.equal(response.body.data.version, 0);
  assert.equal(response.body.data.canEdit, true);
});

test('PUT saves the whole form, normalizes values and clears emptied optional fields', async () => {
  const owner = await newOwner('fullsave');
  const saved = await putProfile(owner.token, fullForm(0));
  assert.equal(saved.status, 200, JSON.stringify(saved.body));
  assert.equal(saved.body.data.version, 1);
  assert.equal(saved.body.data.agencyName, 'Harbor View Realty');
  assert.equal(saved.body.data.ownerName, 'Sana Example');
  assert.equal(saved.body.data.mobile, '+923001112222');
  assert.equal(saved.body.data.profile.publicEmail, 'hello@example.test');
  assert.deepEqual(saved.body.data.publicContact, { showMobile: false, showWhatsapp: true });
  const read = await getProfile(owner.token);
  assert.deepEqual(read.body.data, saved.body.data);
  const session = await authedGet('OWNER', owner.token, '/api/v1/owner/session');
  assert.equal(session.body.data.agency.name, 'Harbor View Realty');
  assert.equal(session.body.data.user.name, 'Sana Example');
  const cleared = await putProfile(owner.token, fullForm(1, { profile: { city: 'Lahore', description: '' } }));
  assert.equal(cleared.status, 200);
  assert.deepEqual(cleared.body.data.profile, { city: 'Lahore' });
});

test('stale version is a conflict with nothing saved; parallel saves let exactly one win', async () => {
  const owner = await newOwner('conflict');
  assert.equal((await putProfile(owner.token, fullForm(0))).status, 200);
  const stale = await putProfile(owner.token, fullForm(0, { agencyName: 'Stale Name Agency' }));
  assert.equal(stale.status, 409);
  assert.equal(stale.body.error.code, 'PROFILE_CONFLICT');
  assert.equal((await getProfile(owner.token)).body.data.agencyName, 'Harbor View Realty');
  const results = await Promise.all([
    putProfile(owner.token, fullForm(1, { agencyName: 'First Parallel Agency' })),
    putProfile(owner.token, fullForm(1, { agencyName: 'Second Parallel Agency' })),
  ]);
  assert.deepEqual(results.map((result) => result.status).sort(), [200, 409]);
  assert.equal((await getProfile(owner.token)).body.data.version, 2);
});

test('Approved can save; Rejected is read-only; Deactivated is refused; Blocked has no session', async () => {
  const approved = await newOwner('approved');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${approved.agencyId}/review-decisions`, { decision: 'APPROVE', expectedReviewVersion: 0 })).status, 200);
  assert.equal((await getProfile(approved.token)).body.data.canEdit, true);
  assert.equal((await putProfile(approved.token, fullForm(0))).status, 200);

  const rejected = await newOwner('rejected');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${rejected.agencyId}/review-decisions`, { decision: 'REJECT', reason, expectedReviewVersion: 0 })).status, 200);
  assert.equal((await getProfile(rejected.token)).body.data.canEdit, false);
  const readOnly = await putProfile(rejected.token, fullForm(0));
  assert.equal(readOnly.status, 403);
  assert.equal(readOnly.body.error.code, 'PROFILE_READ_ONLY');

  const deactivated = await newOwner('deactivated');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${deactivated.agencyId}/restrictions`, { action: 'DEACTIVATE', reason, expectedRestrictionVersion: 0 })).status, 200);
  assert.equal((await getProfile(deactivated.token)).body.data.canEdit, false);
  const refused = await putProfile(deactivated.token, fullForm(0));
  assert.equal(refused.status, 403);
  assert.equal(refused.body.error.code, 'AGENCY_DEACTIVATED');

  const blocked = await newOwner('blockedprofile');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${blocked.agencyId}/restrictions`, { action: 'BLOCK', reason, expectedRestrictionVersion: 0 })).status, 200);
  assert.equal((await getProfile(blocked.token)).status, 401);
  assert.equal((await putProfile(blocked.token, fullForm(0))).status, 401);

  for (const owner of [rejected, deactivated]) {
    const agency = await models.Agency.findById(owner.agencyId).lean();
    assert.equal(agency?.name, owner === rejected ? 'Agency rejected' : 'Agency deactivated');
    assert.equal(agency?.profileVersion, 0);
  }
});

test('agencyId injection is rejected and one owner can never touch another agency', async () => {
  const a = await newOwner('tenanta');
  const b = await newOwner('tenantb');
  assert.equal((await putProfile(a.token, { ...fullForm(0), agencyId: b.agencyId })).status, 422);
  assert.equal((await putProfile(a.token, fullForm(0), { 'x-agency-id': b.agencyId })).status, 422);
  assert.equal((await authedGet('OWNER', a.token, `/api/v1/owner/profile?agencyId=${b.agencyId}`)).status, 422);
  assert.equal((await putProfile(a.token, fullForm(0, { agencyName: 'Tenant A Renamed' }))).status, 200);
  const bProfile = await getProfile(b.token);
  assert.equal(bProfile.body.data.agencyName, 'Agency tenantb');
  assert.equal(bProfile.body.data.version, 0);
  assert.equal((await getProfile(a.token)).body.data.agencyName, 'Tenant A Renamed');
});

test('saving never changes review, restriction or publication state', async () => {
  const owner = await newOwner('axes');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${owner.agencyId}/review-decisions`, { decision: 'REQUEST_CHANGES', reason, expectedReviewVersion: 0 })).status, 200);
  const before = await models.Agency.findById(owner.agencyId).lean();
  assert.equal((await putProfile(owner.token, fullForm(0))).status, 200);
  const after = await models.Agency.findById(owner.agencyId).lean();
  for (const field of ['reviewStatus', 'reviewVersion', 'restrictionStatus', 'restrictionVersion', 'publicationStatus'] as const) {
    assert.deepEqual(after?.[field], before?.[field], field);
  }
  assert.equal(await models.AgencyAudit.countDocuments({ agencyId: owner.agencyId }), 1);
});

test('invalid input is 422 with field details and nothing saved', async () => {
  const owner = await newOwner('invalid');
  const response = await putProfile(owner.token, fullForm(0, { mobile: '123', profile: { publicEmail: 'nope', city: 'x'.repeat(81) } }));
  assert.equal(response.status, 422);
  assert.ok(response.body.error.details.mobile);
  assert.ok(response.body.error.details['profile.publicEmail']);
  assert.ok(response.body.error.details['profile.city']);
  const agency = await models.Agency.findById(owner.agencyId).lean();
  assert.equal(agency?.profileVersion, 0);
  assert.equal(agency?.mobileE164, '+923001234567');
});

test('Super Admin detail includes the profile; owner sessions cannot read it', async () => {
  const owner = await newOwner('reviewer');
  assert.equal((await putProfile(owner.token, fullForm(0))).status, 200);
  const detail = await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${owner.agencyId}`);
  assert.equal(detail.status, 200);
  assert.equal(detail.body.data.agencyName, 'Harbor View Realty');
  assert.equal(detail.body.data.owner.name, 'Sana Example');
  assert.deepEqual(detail.body.data.publicContact, { showMobile: false, showWhatsapp: true });
  assert.equal(detail.body.data.profile.city, 'Karachi');
  assert.equal((await authedGet('OWNER', owner.token, `/api/v1/super-admin/agencies/${owner.agencyId}`)).status, 403);
  assert.equal((await authedGet('SUPER_ADMIN', owner.token, `/api/v1/super-admin/agencies/${owner.agencyId}`)).status, 401);
});

test('migration backfills profileVersion and publicContact and stays idempotent', async () => {
  const uri = mongo.getUri('migration_3a');
  const legacyDb = mongoose.connection.useDb('migration_3a');
  const createdAt = new Date('2026-10-01T10:00:00Z');
  const { insertedId } = await legacyDb.collection('agencies').insertOne({
    name: 'Legacy 2b Agency', mobileE164: '+923001234567', whatsappE164: '+923001234567', reviewStatus: 'APPROVED', reviewVersion: 1,
    submittedForReviewAt: createdAt, restrictionStatus: 'NONE', restrictionVersion: 0, publicationStatus: 'NEVER_PUBLISHED', createdAt, updatedAt: createdAt,
  });
  const runner = path.resolve(process.cwd(), '../node_modules/tsx/dist/cli.mjs');
  // Async on purpose: a sync spawn blocks this process, so the in-memory mongod's piped log fills up and it stalls.
  const run = () => new Promise<{ status: number | null; stdout: string; stderr: string }>((resolve) => {
    execFile(process.execPath, [runner, 'src/cli/migrate-review-axes.ts'], { cwd: process.cwd(), env: { ...process.env, MONGODB_URI: uri }, encoding: 'utf8', timeout: 30000 },
      (error, stdout, stderr) => resolve({ status: error ? (typeof error.code === 'number' ? error.code : null) : 0, stdout, stderr }));
  });
  const first = await run();
  assert.equal(first.status, 0, first.stderr);
  assert.match(first.stdout, / 2 field update/);
  const migrated = await legacyDb.collection('agencies').findOne({ _id: insertedId });
  assert.equal(migrated?.profileVersion, 0);
  assert.deepEqual(migrated?.publicContact, { showMobile: false, showWhatsapp: false });
  const second = await run();
  assert.equal(second.status, 0, second.stderr);
  assert.match(second.stdout, / 0 field update/);
});
