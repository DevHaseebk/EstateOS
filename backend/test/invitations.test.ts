import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createHash, randomBytes } from 'node:crypto';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';

// Phase 6a contract §5 acceptance tests: Super Admin-created agency and the one-time owner invitation (D-028, D-118).
// Synthetic people and agencies only (D-116).
const key = 'test-internal-api-key-with-at-least-thirty-two-characters';
const ownerOrigin = 'https://admin.estateos.localhost';
const superOrigin = 'https://control.estateos.localhost';
const password = 'Orchid!Harbor!72?Sky';
const ownerPassword = 'Lantern!Meadow!48?Tide';
const reason = 'Synthetic reason for a Phase 6a invitation test.';
type Portal = 'OWNER' | 'SUPER_ADMIN';

let mongo: MongoMemoryReplSet;
let app: Awaited<typeof import('../src/app.js')>['app'];
let models: typeof import('../src/models.js');
let superToken = '';
let ipCounter = 10;
const nextIp = () => `10.9.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`;
const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

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
async function preAuthPost(portal: Portal, url: string, body: object, ip = nextIp()) {
  const pre = await csrfFor(portal, ip);
  return supertest(app).post(url).set({ ...base(portal, ip), origin: portal === 'OWNER' ? ownerOrigin : superOrigin, 'x-csrf-token': pre.token, 'x-preauth-nonce': pre.nonce! }).send(body);
}
async function authed(portal: Portal, token: string, url: string, body: object) {
  const ip = nextIp();
  const pre = await csrfFor(portal, ip, token);
  return supertest(app).post(url).set({ ...base(portal, ip), origin: portal === 'OWNER' ? ownerOrigin : superOrigin, 'x-csrf-token': pre.token, 'x-session-token': token }).send(body);
}
const superPost = (url: string, body: object) => authed('SUPER_ADMIN', superToken, url, body);
const superGet = (url: string) => supertest(app).get(url).set({ ...base('SUPER_ADMIN', nextIp()), 'x-session-token': superToken });
const ownerLogin = (email: string, secret = ownerPassword) => preAuthPost('OWNER', '/api/v1/owner/sessions', { email, password: secret });
const preview = (invitationCode: string, ip?: string) => preAuthPost('OWNER', '/api/v1/auth/invitations/preview', { invitationCode }, ip);
const claim = (invitationCode: string, newPassword = ownerPassword) => preAuthPost('OWNER', '/api/v1/auth/invitations/claim', { invitationCode, newPassword });
const codeOf = (url: string) => url.split('#')[1]!;

async function createAgency(label: string) {
  const email = `${label}@example.test`;
  const response = await superPost('/api/v1/super-admin/agencies', {
    agencyName: `Agency ${label}`, ownerName: `Owner ${label}`, mobile: '03001234567', whatsapp: '03007654321', email,
  });
  assert.equal(response.status, 201, JSON.stringify(response.body));
  return { email, agencyId: response.body.data.agency.id as string, url: response.body.data.invitation.url as string, expiresAt: response.body.data.invitation.expiresAt as string };
}

before(async () => {
  process.env.INTERNAL_API_KEY = key;
  process.env.PUBLIC_API_KEY = 'test-public-api-key-with-at-least-thirty-two-characters-x';
  process.env.PUBLIC_SITE_DOMAIN = 'sites.example.test';
  process.env.CSRF_SIGNING_KEY = 'test-csrf-signing-key-with-at-least-thirty-two-characters';
  process.env.OWNER_ORIGIN = ownerOrigin;
  process.env.SUPER_ADMIN_ORIGIN = superOrigin;
  app = (await import('../src/app.js')).app;
  models = await import('../src/models.js');
  const security = await import('../src/security.js');
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongo.getUri());
  await Promise.all([models.Agency.init(), models.User.init(), models.AuthSession.init(), models.AuthRateLimit.init(), models.AgencyAudit.init(), models.WebsiteDraft.init()]);
  await models.User.create({ role: 'SUPER_ADMIN', name: 'Invite Operator', emailNormalized: 'invite-operator@example.test', passwordHash: await security.hashPassword(password), bootstrapKey: 'TEST_ONLY' });
  const login = await preAuthPost('SUPER_ADMIN', '/api/v1/super-admin/sessions', { email: 'invite-operator@example.test', password });
  assert.equal(login.status, 200);
  superToken = login.body.internal.sessionToken;
});
after(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); });

test('unit: the link carries a random single-use code; only its digest is stored; it lasts 72 hours', async () => {
  const before = Date.now();
  const created = await createAgency('inviteunit');
  assert.ok(created.url.startsWith(`${ownerOrigin}/invite#`), 'the code is in the fragment');
  const code = codeOf(created.url);
  assert.match(code, /^[A-Za-z0-9_-]{43}$/);
  const user = await models.User.findOne({ emailNormalized: created.email }).select('+inviteTokenDigest +inviteExpiresAt +passwordHash').lean();
  assert.equal(user?.inviteTokenDigest, sha256(code));
  assert.equal(JSON.stringify(user).includes(code), false, 'the plain code is never stored');
  const ttl = new Date(created.expiresAt).getTime() - before;
  assert.ok(ttl > 72 * 3600_000 - 60_000 && ttl <= 72 * 3600_000 + 60_000, `ttl ${ttl}`);
  assert.equal(user?.passwordHash, undefined);
  assert.notEqual(codeOf((await createAgency('inviteunit2')).url), code);
});

test('Super Admin creates a Pending ADMIN_CREATED agency with an INVITED owner; audited; duplicates and wrong callers refused', async () => {
  const created = await createAgency('invitecreate');
  const agency = await models.Agency.findById(created.agencyId).lean();
  assert.equal(agency?.reviewStatus, 'PENDING');
  assert.equal(agency?.origin, 'ADMIN_CREATED');
  const owner = await models.User.findOne({ emailNormalized: created.email }).lean();
  assert.equal(owner?.accountState, 'INVITED');
  assert.equal(owner?.role, 'AGENCY_OWNER');
  const audit = await models.AgencyAudit.find({ agencyId: created.agencyId }).sort({ _id: 1 }).lean();
  assert.deepEqual(audit.map((entry) => [entry.axis, entry.action, entry.toStatus]), [['ACCOUNT', 'AGENCY_CREATED_BY_ADMIN', 'INVITED'], ['ACCOUNT', 'INVITATION_ISSUED', 'INVITED']]);
  const duplicate = await superPost('/api/v1/super-admin/agencies', { agencyName: 'Another agency', ownerName: 'Another Owner', mobile: '03001234567', whatsapp: '03007654321', email: created.email.toUpperCase() });
  assert.equal(duplicate.status, 409);
  assert.equal(duplicate.body.error.code, 'EMAIL_EXISTS');
  const invalid = await superPost('/api/v1/super-admin/agencies', { agencyName: 'A', ownerName: 'Owner', mobile: '12', whatsapp: '03007654321', email: 'not-an-email' });
  assert.equal(invalid.status, 422);
  assert.ok(invalid.body.error.details.agencyName && invalid.body.error.details.mobile && invalid.body.error.details.email);
  assert.equal((await superPost('/api/v1/super-admin/agencies', { agencyName: 'Agency x', ownerName: 'Owner x', mobile: '03001234567', whatsapp: '03007654321', email: 'x@example.test', password: 'Chosen!By!Admin!123' })).status, 422, 'no admin-chosen password');
  const ownerPortal = await preAuthPost('OWNER', '/api/v1/super-admin/agencies', { agencyName: 'Agency y', ownerName: 'Owner y', mobile: '03001234567', whatsapp: '03007654321', email: 'y@example.test' });
  assert.equal(ownerPortal.status, 403);
  const anonymous = await preAuthPost('SUPER_ADMIN', '/api/v1/super-admin/agencies', { agencyName: 'Agency z', ownerName: 'Owner z', mobile: '03001234567', whatsapp: '03007654321', email: 'z@example.test' });
  assert.ok([401, 403].includes(anonymous.status));
  const detail = await superGet(`/api/v1/super-admin/agencies/${created.agencyId}`);
  assert.equal(detail.body.data.origin, 'ADMIN_CREATED');
  assert.equal(detail.body.data.owner.accountState, 'INVITED');
  assert.equal(detail.body.data.owner.invitationExpiresAt, created.expiresAt);
  assert.equal(JSON.stringify(detail.body).includes(codeOf(created.url)), false, 'the link is never returned again');
  const list = await superGet('/api/v1/super-admin/agencies?q=invitecreate');
  assert.deepEqual([list.body.data.items[0].origin, list.body.data.items[0].ownerAccountState], ['ADMIN_CREATED', 'INVITED']);
});

test('an invited owner cannot sign in or use a support reset code', async () => {
  const created = await createAgency('invitelocked');
  const login = await ownerLogin(created.email, 'anything-at-all-123');
  assert.equal(login.status, 401);
  assert.equal(login.body.error.code, 'INVALID_CREDENTIALS');
  const resetCode = randomBytes(32).toString('base64url');
  await models.User.updateOne({ emailNormalized: created.email }, { $set: { resetTokenDigest: sha256(resetCode), resetExpiresAt: new Date(Date.now() + 600_000) } });
  const reset = await preAuthPost('OWNER', '/api/v1/auth/recovery/complete', { resetCode, newPassword: ownerPassword });
  assert.equal(reset.status, 400);
  assert.equal((await models.User.findOne({ emailNormalized: created.email }).lean())?.accountState, 'INVITED');
});

test('preview and claim: the owner sets a password, signs in normally, and the code is used up', async () => {
  const created = await createAgency('inviteclaim');
  const code = codeOf(created.url);
  const shown = await preview(code);
  assert.equal(shown.status, 200);
  assert.deepEqual(shown.body.data, { agencyName: 'Agency inviteclaim', email: created.email });
  const weak = await claim(code, 'inviteclaim@example.test');
  assert.equal(weak.status, 422);
  assert.ok(weak.body.error.details.newPassword);
  assert.equal((await claim(code)).status, 204);
  const owner = await models.User.findOne({ emailNormalized: created.email }).select('+inviteTokenDigest +inviteExpiresAt').lean();
  assert.equal(owner?.accountState, 'ACTIVE');
  assert.equal(owner?.inviteTokenDigest, undefined);
  assert.equal(owner?.inviteExpiresAt, undefined);
  const login = await ownerLogin(created.email);
  assert.equal(login.status, 200, JSON.stringify(login.body));
  assert.equal(login.body.data.agency.reviewStatus, 'PENDING');
  assert.equal((await claim(code, 'Another!Strong!Pass!93')).status, 400, 'single use');
  assert.equal((await preview(code)).body.error.code, 'INVALID_INVITATION');
  const claimed = await models.AgencyAudit.findOne({ agencyId: created.agencyId, action: 'INVITATION_CLAIMED' }).lean();
  assert.deepEqual([claimed?.actorRole, claimed?.fromStatus, claimed?.toStatus], ['AGENCY_OWNER', 'INVITED', 'ACTIVE']);
  assert.equal((await superGet(`/api/v1/super-admin/agencies/${created.agencyId}`)).body.data.owner.accountState, 'ACTIVE');
});

test('expired and replaced codes fail with the same generic error; the per-code rate limit applies', async () => {
  const expired = await createAgency('inviteexpired');
  await models.User.updateOne({ emailNormalized: expired.email }, { $set: { inviteExpiresAt: new Date(Date.now() - 1000) } });
  const expiredPreview = await preview(codeOf(expired.url));
  assert.deepEqual([expiredPreview.status, expiredPreview.body.error.code], [400, 'INVALID_INVITATION']);
  assert.equal((await claim(codeOf(expired.url))).status, 400);

  const replaced = await createAgency('invitereplaced');
  const reissued = await superPost(`/api/v1/super-admin/agencies/${replaced.agencyId}/invitations`, {});
  assert.equal(reissued.status, 201);
  assert.notEqual(reissued.body.data.invitation.url, replaced.url);
  const old = await preview(codeOf(replaced.url));
  assert.deepEqual([old.status, old.body.error.code, old.body.error.message], [400, 'INVALID_INVITATION', expiredPreview.body.error.message]);
  assert.equal((await claim(codeOf(reissued.body.data.invitation.url))).status, 204);
  assert.equal((await models.AgencyAudit.countDocuments({ agencyId: replaced.agencyId, action: 'INVITATION_ISSUED' })), 2);

  const unknown = randomBytes(32).toString('base64url');
  const statuses: number[] = [];
  for (let i = 0; i < 6; i += 1) statuses.push((await preview(unknown)).status);
  assert.deepEqual(statuses, [400, 400, 400, 400, 400, 429]);
});

test('a new link is refused once the owner is active or while the agency is Deactivated; unknown agencies are 404', async () => {
  const active = await createAgency('inviteactive');
  assert.equal((await claim(codeOf(active.url))).status, 204);
  const again = await superPost(`/api/v1/super-admin/agencies/${active.agencyId}/invitations`, {});
  assert.deepEqual([again.status, again.body.error.code], [409, 'ALREADY_CLAIMED']);

  const deactivated = await createAgency('invitedeactivated');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${deactivated.agencyId}/restrictions`, { action: 'DEACTIVATE', reason, expectedRestrictionVersion: 0 })).status, 200);
  const refused = await superPost(`/api/v1/super-admin/agencies/${deactivated.agencyId}/invitations`, {});
  assert.deepEqual([refused.status, refused.body.error.code], [409, 'AGENCY_DEACTIVATED']);
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${'0'.repeat(24)}/invitations`, {})).status, 404);
  assert.equal((await superPost('/api/v1/super-admin/agencies/not-an-id/invitations', {})).status, 404);
});

test('a created agency follows the normal review path; a Blocked agency\'s owner may claim but sign-in shows the block', async () => {
  const reviewed = await createAgency('invitereview');
  const approve = await superPost(`/api/v1/super-admin/agencies/${reviewed.agencyId}/review-decisions`, { decision: 'APPROVE', expectedReviewVersion: 0 });
  assert.equal(approve.status, 200);
  const agency = await models.Agency.findById(reviewed.agencyId).lean();
  assert.equal(agency?.reviewStatus, 'APPROVED');
  assert.equal(agency?.publicationStatus, 'NEVER_PUBLISHED', 'readiness still controls First Live');

  const blocked = await createAgency('inviteblocked');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${blocked.agencyId}/restrictions`, { action: 'BLOCK', reason, expectedRestrictionVersion: 0 })).status, 200);
  assert.equal((await claim(codeOf(blocked.url))).status, 204);
  const login = await ownerLogin(blocked.email);
  assert.deepEqual([login.status, login.body.error.code], [403, 'AGENCY_BLOCKED']);
});
