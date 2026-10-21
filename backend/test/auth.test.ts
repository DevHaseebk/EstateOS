import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const key = 'test-internal-api-key-with-at-least-thirty-two-characters';
const ownerOrigin = 'https://admin.estateos.test';
const superOrigin = 'https://control.estateos.test';
const password = 'Orchid!Harbor!72?Sky';
let mongo: MongoMemoryReplSet;
let app: Awaited<typeof import('../src/app.js')>['app'];
let models: typeof import('../src/models.js');
let security: typeof import('../src/security.js');
let ownerA = { agencyId: '', userId: '', token: '' };
let ownerB = { agencyId: '', userId: '', token: '' };

function api(portal: 'OWNER' | 'SUPER_ADMIN', ip = '127.0.0.20') {
  return supertest(app);
}
function headers(portal: 'OWNER' | 'SUPER_ADMIN', ip = '127.0.0.20') {
  return { 'x-internal-api-key': key, 'x-portal': portal, 'x-client-ip': ip };
}
async function csrf(portal: 'OWNER' | 'SUPER_ADMIN', ip = '127.0.0.20', token?: string) {
  const request = api(portal, ip).get('/api/v1/auth/csrf').set(headers(portal, ip));
  if (token) request.set('x-session-token', token);
  const response = await request;
  assert.equal(response.status, 200);
  return { token: response.body.data.csrfToken as string, nonce: response.body.internal?.preauthNonce as string | undefined };
}
function mutationHeaders(portal: 'OWNER' | 'SUPER_ADMIN', csrfToken: string, nonce?: string, sessionToken?: string, ip = '127.0.0.20') {
  return {
    ...headers(portal, ip), origin: portal === 'OWNER' ? ownerOrigin : superOrigin,
    'x-csrf-token': csrfToken,
    ...(nonce ? { 'x-preauth-nonce': nonce } : {}),
    ...(sessionToken ? { 'x-session-token': sessionToken } : {}),
  };
}

before(async () => {
  process.env.INTERNAL_API_KEY = key;
  process.env.CSRF_SIGNING_KEY = 'test-csrf-signing-key-with-at-least-thirty-two-characters';
  process.env.OWNER_ORIGIN = ownerOrigin;
  process.env.SUPER_ADMIN_ORIGIN = superOrigin;
  const loaded = await import('../src/app.js');
  app = loaded.app;
  models = await import('../src/models.js');
  security = await import('../src/security.js');
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongo.getUri());
  await Promise.all([models.Agency.init(), models.User.init(), models.AuthSession.init(), models.AuthRateLimit.init()]);
});
after(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); });

test('health stays available and protected API rejects direct requests', async () => {
  const health = await supertest(app).get('/api/health');
  assert.equal(health.status, 200);
  assert.equal(health.body.status, 'ok');
  const direct = await supertest(app).get('/api/v1/owner/session');
  assert.equal(direct.status, 403);
  const unauthorized = await api('OWNER').get('/api/v1/owner/session').set(headers('OWNER'));
  assert.equal(unauthorized.status, 401);
});

test('signup is Pending, validates CSRF and enforces normalized unique email', async () => {
  const first = await csrf('OWNER');
  const data = { ownerName: 'Amina Seller', agencyName: 'Amina Estates', mobile: '03001234567', whatsapp: '03001234567', email: ' Amina@Example.com ', password };
  const missingCsrf = await api('OWNER').post('/api/v1/owner/registrations').set({ ...headers('OWNER'), origin: ownerOrigin }).send(data);
  assert.equal(missingCsrf.status, 403);
  const foreign = await api('OWNER').post('/api/v1/owner/registrations').set({ ...mutationHeaders('OWNER', first.token, first.nonce), origin: 'https://attacker.example' }).send(data);
  assert.equal(foreign.status, 403);
  const created = await api('OWNER').post('/api/v1/owner/registrations').set(mutationHeaders('OWNER', first.token, first.nonce)).send(data);
  assert.equal(created.status, 201);
  assert.equal(created.body.data.agency.reviewStatus, 'PENDING');
  ownerA.agencyId = created.body.data.agency.id;
  ownerA.userId = created.body.data.owner.id;
  const duplicate = await api('OWNER').post('/api/v1/owner/registrations').set(mutationHeaders('OWNER', first.token, first.nonce)).send({ ...data, email: 'amina@example.com' });
  assert.equal(duplicate.status, 409);
  const second = await csrf('OWNER', '127.0.0.21');
  const other = await api('OWNER', '127.0.0.21').post('/api/v1/owner/registrations').set(mutationHeaders('OWNER', second.token, second.nonce, undefined, '127.0.0.21'))
    .send({ ...data, ownerName: 'Bilal Seller', agencyName: 'Bilal Estates', email: 'bilal@example.com' });
  assert.equal(other.status, 201);
  ownerB.agencyId = other.body.data.agency.id;
  ownerB.userId = other.body.data.owner.id;
});

test('owner login, role boundary and tenant isolation', async () => {
  for (const [owner, email, ip] of [[ownerA, 'amina@example.com', '127.0.0.22'], [ownerB, 'bilal@example.com', '127.0.0.23']] as const) {
    const pre = await csrf('OWNER', ip);
    const login = await api('OWNER', ip).post('/api/v1/owner/sessions').set(mutationHeaders('OWNER', pre.token, pre.nonce, undefined, ip)).send({ email, password });
    assert.equal(login.status, 200);
    owner.token = login.body.internal.sessionToken;
  }
  const own = await api('OWNER').get(`/api/v1/owner/agencies/${ownerA.agencyId}`).set({ ...headers('OWNER'), 'x-session-token': ownerA.token });
  assert.equal(own.status, 200);
  const other = await api('OWNER').get(`/api/v1/owner/agencies/${ownerB.agencyId}`).set({ ...headers('OWNER'), 'x-session-token': ownerA.token });
  assert.equal(other.status, 404);
  const injected = await api('OWNER').get(`/api/v1/owner/agencies/${ownerA.agencyId}?agencyId=${ownerB.agencyId}`).set({ ...headers('OWNER'), 'x-session-token': ownerA.token });
  assert.equal(injected.status, 422);
  const headerInjected = await api('OWNER').get(`/api/v1/owner/agencies/${ownerA.agencyId}`).set({ ...headers('OWNER'), 'x-session-token': ownerA.token, 'x-agency-id': ownerB.agencyId });
  assert.equal(headerInjected.status, 422);
  const wrongPortal = await api('SUPER_ADMIN').get('/api/v1/super-admin/session').set({ ...headers('SUPER_ADMIN'), 'x-session-token': ownerA.token });
  assert.equal(wrongPortal.status, 401);
  const inputCsrf = await csrf('OWNER');
  const bodyInjected = await api('OWNER').post('/api/v1/owner/sessions').set(mutationHeaders('OWNER', inputCsrf.token, inputCsrf.nonce))
    .send({ email: 'amina@example.com', password, agencyId: ownerB.agencyId });
  assert.equal(bodyInjected.status, 422);
});

test('central tenant scope constrains synthetic writes', async () => {
  const { ownerScope, tenantAgencyFilter } = await import('../src/tenant.js');
  const user = await models.User.findById(ownerA.userId);
  assert.ok(user);
  const scope = ownerScope(user);
  assert.throws(() => tenantAgencyFilter(scope, ownerB.agencyId));
  const before = await models.Agency.findById(ownerB.agencyId);
  await models.Agency.updateOne(tenantAgencyFilter(scope), { $set: { name: 'Amina Updated' } });
  const after = await models.Agency.findById(ownerB.agencyId);
  assert.equal(after?.name, before?.name);
});

test('Super Admin sessions are separate and logout revokes the session', async () => {
  await models.User.create({ role: 'SUPER_ADMIN', name: 'Platform Operator', emailNormalized: 'operator@example.com', passwordHash: await security.hashPassword(password), bootstrapKey: 'TEST_ONLY' });
  const pre = await csrf('SUPER_ADMIN', '127.0.0.30');
  const login = await api('SUPER_ADMIN', '127.0.0.30').post('/api/v1/super-admin/sessions')
    .set(mutationHeaders('SUPER_ADMIN', pre.token, pre.nonce, undefined, '127.0.0.30')).send({ email: 'operator@example.com', password });
  assert.equal(login.status, 200);
  const token = login.body.internal.sessionToken as string;
  const ownerRoute = await api('OWNER').get('/api/v1/owner/session').set({ ...headers('OWNER'), 'x-session-token': token });
  assert.equal(ownerRoute.status, 401);
  const authedCsrf = await csrf('SUPER_ADMIN', '127.0.0.30', token);
  const logout = await api('SUPER_ADMIN', '127.0.0.30').delete('/api/v1/super-admin/session')
    .set(mutationHeaders('SUPER_ADMIN', authedCsrf.token, undefined, token, '127.0.0.30'));
  assert.equal(logout.status, 204);
  const revoked = await api('SUPER_ADMIN').get('/api/v1/super-admin/session').set({ ...headers('SUPER_ADMIN'), 'x-session-token': token });
  assert.equal(revoked.status, 401);
});

test('absolute expiry and logout CSRF are enforced', async () => {
  const noCsrf = await api('OWNER').delete('/api/v1/owner/session')
    .set({ ...headers('OWNER'), origin: ownerOrigin, 'x-session-token': ownerA.token });
  assert.equal(noCsrf.status, 403);
  const validCsrf = await csrf('OWNER', '127.0.0.33', ownerA.token);
  const foreignOrigin = await api('OWNER', '127.0.0.33').delete('/api/v1/owner/session')
    .set({ ...mutationHeaders('OWNER', validCsrf.token, undefined, ownerA.token, '127.0.0.33'), origin: 'https://attacker.example' });
  assert.equal(foreignOrigin.status, 403);
  const pre = await csrf('OWNER', '127.0.0.34');
  const login = await api('OWNER', '127.0.0.34').post('/api/v1/owner/sessions')
    .set(mutationHeaders('OWNER', pre.token, pre.nonce, undefined, '127.0.0.34')).send({ email: 'bilal@example.com', password });
  assert.equal(login.status, 200);
  const token = login.body.internal.sessionToken as string;
  await models.AuthSession.updateOne({ tokenDigest: security.digest(token) }, { $set: { absoluteExpiresAt: new Date(Date.now() - 1000) } });
  const expired = await api('OWNER').get('/api/v1/owner/session').set({ ...headers('OWNER'), 'x-session-token': token });
  assert.equal(expired.status, 401);
});

test('idle expiry and support reset revoke owner sessions', async () => {
  await models.AuthSession.updateOne({ tokenDigest: security.digest(ownerB.token) }, { $set: { idleExpiresAt: new Date(Date.now() - 1000) } });
  const expired = await api('OWNER').get('/api/v1/owner/session').set({ ...headers('OWNER'), 'x-session-token': ownerB.token });
  assert.equal(expired.status, 401);
  const code = security.randomToken();
  await models.User.updateOne({ _id: ownerA.userId }, { $set: { resetTokenDigest: security.digest(code), resetExpiresAt: new Date(Date.now() + 15 * 60_000) } });
  const pre = await csrf('OWNER', '127.0.0.40');
  const reset = await api('OWNER', '127.0.0.40').post('/api/v1/auth/recovery/complete')
    .set(mutationHeaders('OWNER', pre.token, pre.nonce, undefined, '127.0.0.40')).send({ resetCode: code, newPassword: 'Fjord!Compass!83?River' });
  assert.equal(reset.status, 204);
  const revoked = await api('OWNER').get('/api/v1/owner/session').set({ ...headers('OWNER'), 'x-session-token': ownerA.token });
  assert.equal(revoked.status, 401);
  const replay = await api('OWNER', '127.0.0.41').post('/api/v1/auth/recovery/complete')
    .set(mutationHeaders('OWNER', pre.token, pre.nonce, undefined, '127.0.0.41')).send({ resetCode: code, newPassword: 'Fjord!Compass!83?River' });
  assert.equal(replay.status, 400);
});

test('login throttling rejects repeated attempts', async () => {
  const ip = '127.0.0.50';
  const pre = await csrf('OWNER', ip);
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const result = await api('OWNER', ip).post('/api/v1/owner/sessions').set(mutationHeaders('OWNER', pre.token, pre.nonce, undefined, ip))
      .send({ email: 'nobody@example.com', password: 'wrong' });
    assert.equal(result.status, 401);
  }
  const limited = await api('OWNER', ip).post('/api/v1/owner/sessions').set(mutationHeaders('OWNER', pre.token, pre.nonce, undefined, ip))
    .send({ email: 'nobody@example.com', password: 'wrong' });
  assert.equal(limited.status, 429);
});

test('first Super Admin CLI bootstrap is audited and cannot run twice', async () => {
  const uri = mongo.getUri('bootstrap_test');
  const runner = path.resolve(process.cwd(), '../node_modules/tsx/dist/cli.mjs');
  const env = { ...process.env, MONGODB_URI: uri, BOOTSTRAP_OPERATOR: 'synthetic-operator',
    BOOTSTRAP_NAME: 'First Operator', BOOTSTRAP_EMAIL: 'first@example.test', BOOTSTRAP_PASSWORD: password };
  const command = [runner, 'src/cli/bootstrap-super-admin.ts'];
  const first = spawnSync(process.execPath, command, { cwd: process.cwd(), env, encoding: 'utf8', timeout: 30000 });
  assert.equal(first.status, 0, first.stderr);
  assert.doesNotMatch(first.stdout, new RegExp(password, 'i'));
  const second = spawnSync(process.execPath, command, { cwd: process.cwd(), env, encoding: 'utf8', timeout: 30000 });
  assert.notEqual(second.status, 0);
  const bootstrapDb = mongoose.connection.useDb('bootstrap_test');
  assert.equal(await bootstrapDb.collection('users').countDocuments({ role: 'SUPER_ADMIN' }), 1);
  assert.equal(await bootstrapDb.collection('authaudits').countDocuments({ action: 'FIRST_SUPER_ADMIN_BOOTSTRAP' }), 1);
});
