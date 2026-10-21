import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import path from 'node:path';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';

// Phase 4a contract §7 acceptance tests: automatic first Live, public read, keys, slugs. Synthetic data only (D-116).
const key = 'test-internal-api-key-with-at-least-thirty-two-characters';
const publicKey = 'test-public-api-key-with-at-least-thirty-two-characters-x';
const ownerOrigin = 'https://admin.estateos.localhost';
const superOrigin = 'https://control.estateos.localhost';
const password = 'Orchid!Harbor!72?Sky';
const reason = 'Synthetic reason for a Phase 4a publication test.';
type Portal = 'OWNER' | 'SUPER_ADMIN';

let mongo: MongoMemoryReplSet;
let app: Awaited<typeof import('../src/app.js')>['app'];
let models: typeof import('../src/models.js');
let publication: typeof import('../src/publication.js');
let superToken = '';
let ipCounter = 10;
const nextIp = () => `10.5.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`;

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
async function authed(method: 'post' | 'put', portal: Portal, token: string, url: string, body: object) {
  const ip = nextIp();
  const pre = await csrfFor(portal, ip, token);
  return supertest(app)[method](url).set({ ...base(portal, ip), origin: portal === 'OWNER' ? ownerOrigin : superOrigin, 'x-csrf-token': pre.token, 'x-session-token': token }).send(body);
}
const authedGet = (portal: Portal, token: string, url: string) => supertest(app).get(url).set({ ...base(portal, nextIp()), 'x-session-token': token });
const publicGet = (slug: string) => supertest(app).get(`/api/v1/public/sites/${slug}`).set({ 'x-public-api-key': publicKey });
const superPost = (url: string, body: object) => authed('post', 'SUPER_ADMIN', superToken, url, body);

async function newOwner(label: string, agencyName = `Agency ${label}`) {
  const email = `${label}@example.test`;
  const created = await preAuthPost('OWNER', '/api/v1/owner/registrations', {
    ownerName: `Owner ${label}`, agencyName, mobile: '03001234567', whatsapp: '03007654321', email, password,
  });
  assert.equal(created.status, 201, JSON.stringify(created.body));
  const login = await preAuthPost('OWNER', '/api/v1/owner/sessions', { email, password });
  assert.equal(login.status, 200);
  return { email, agencyId: created.body.data.agency.id as string, token: login.body.internal.sessionToken as string };
}
async function choosePublic(token: string, overrides: Record<string, unknown> = {}) {
  const profile = (await authedGet('OWNER', token, '/api/v1/owner/profile')).body.data;
  const saved = await authed('put', 'OWNER', token, '/api/v1/owner/profile', {
    agencyName: profile.agencyName, ownerName: profile.ownerName, mobile: profile.mobile, whatsapp: profile.whatsapp,
    publicContact: { showMobile: false, showWhatsapp: true }, profile: { city: 'Karachi' }, expectedProfileVersion: profile.version, ...overrides,
  });
  assert.equal(saved.status, 200, JSON.stringify(saved.body));
}
const heroBody = (version: number, heading = 'Homes and plots across Karachi') => ({ heading, ctaLabel: 'Talk to us', heroImageId: 'test-licensed', expectedVersion: version });
async function makeReadyExceptHero(token: string) {
  await choosePublic(token);
  assert.equal((await authed('put', 'OWNER', token, '/api/v1/owner/website/theme', { preset: 'MODERN_LIGHT', expectedThemeVersion: 0 })).status, 200);
}
const approve = (agencyId: string) => superPost(`/api/v1/super-admin/agencies/${agencyId}/review-decisions`, { decision: 'APPROVE', expectedReviewVersion: 0 });
const agencyOf = (agencyId: string) => models.Agency.findById(agencyId).lean();
const revisionsOf = (agencyId: string) => models.PublishedRevision.countDocuments({ agencyId });

before(async () => {
  process.env.INTERNAL_API_KEY = key;
  process.env.PUBLIC_API_KEY = publicKey;
  process.env.PUBLIC_SITE_DOMAIN = 'sites.example.test';
  process.env.CSRF_SIGNING_KEY = 'test-csrf-signing-key-with-at-least-thirty-two-characters';
  process.env.OWNER_ORIGIN = ownerOrigin;
  process.env.SUPER_ADMIN_ORIGIN = superOrigin;
  process.env.HERO_DEFAULTS_PATH = path.resolve(process.cwd(), 'test/fixtures/hero-defaults.test.json');
  app = (await import('../src/app.js')).app;
  models = await import('../src/models.js');
  publication = await import('../src/publication.js');
  const security = await import('../src/security.js');
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongo.getUri());
  await Promise.all([models.Agency.init(), models.User.init(), models.AuthSession.init(), models.AuthRateLimit.init(), models.AgencyAudit.init(), models.WebsiteDraft.init(), models.PublishedRevision.init()]);
  await models.User.create({ role: 'SUPER_ADMIN', name: 'Publication Operator', emailNormalized: 'publish@example.test', passwordHash: await security.hashPassword(password), bootstrapKey: 'TEST_ONLY' });
  const login = await preAuthPost('SUPER_ADMIN', '/api/v1/super-admin/sessions', { email: 'publish@example.test', password });
  assert.equal(login.status, 200);
  superToken = login.body.internal.sessionToken;
});
after(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); });

test('unit: slug rules', () => {
  assert.equal(publication.slugBase('Café Homes & Plots!'), 'cafe-homes-plots');
  assert.equal(publication.slugBase('AB'), 'ab-agency');
  assert.equal(publication.slugBase('Admin'), 'admin-agency');
  assert.equal(publication.slugBase('ریئل اسٹیٹ'), 'agency');
  const long = publication.slugBase('Very Long Agency Name With Many Words For Testing Limits');
  assert.ok(long.length <= 40 && !long.endsWith('-'), long);
  const candidate = publication.slugCandidate('x'.repeat(40), 12);
  assert.equal(candidate.length, 40);
  assert.ok(candidate.endsWith('-12'));
  for (const slug of ['cafe-homes-plots', 'ab-agency', 'agency', long, candidate]) assert.ok(publication.SLUG_PATTERN.test(slug), slug);
  assert.equal(publication.SLUG_PATTERN.test('-bad'), false);
  assert.equal(publication.SLUG_PATTERN.test('ab'), false);
});

test('a ready agency goes Live exactly once on Approve: revision, pointer, slug and audit', async () => {
  const owner = await newOwner('live1', 'Harbor View Realty');
  await makeReadyExceptHero(owner.token);
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', heroBody(0))).status, 200);
  assert.equal((await agencyOf(owner.agencyId))?.publicationStatus, 'NEVER_PUBLISHED');
  assert.equal((await approve(owner.agencyId)).status, 200);
  const agency = await agencyOf(owner.agencyId);
  assert.equal(agency?.publicationStatus, 'LIVE');
  assert.equal(agency?.publication?.slug, 'harbor-view-realty');
  assert.ok(agency?.publication?.liveRevisionId);
  assert.equal(await revisionsOf(owner.agencyId), 1);
  const audits = await models.AgencyAudit.find({ agencyId: owner.agencyId, axis: 'PUBLICATION' }).lean();
  assert.equal(audits.length, 1);
  assert.equal(audits[0]!.action, 'WEBSITE_FIRST_LIVE');
  assert.equal(audits[0]!.actorRole, 'SYSTEM');
  const site = (await authedGet('OWNER', owner.token, '/api/v1/owner/website')).body.data;
  const firstLiveAt = agency!.publication!.firstLiveAt!.toISOString();
  // Phase 4b adds liveRevision, publishedAt and unpublishedChanges for Live sites.
  assert.deepEqual(site.publication, { status: 'LIVE', url: 'https://harbor-view-realty.sites.example.test', firstLiveAt, liveRevision: 1, publishedAt: firstLiveAt, unpublishedChanges: false });
  assert.equal(await publication.tryFirstActivation(owner.agencyId), 'ALREADY_LIVE');
  assert.equal(await revisionsOf(owner.agencyId), 1);
  const detail = (await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${owner.agencyId}`)).body.data;
  assert.equal(detail.publication.url, 'https://harbor-view-realty.sites.example.test');
});

test('approved but not ready stays Not Live until the save that completes readiness', async () => {
  const owner = await newOwner('live2');
  assert.equal((await approve(owner.agencyId)).status, 200);
  await makeReadyExceptHero(owner.token);
  assert.equal((await agencyOf(owner.agencyId))?.publicationStatus, 'NEVER_PUBLISHED');
  assert.equal(await revisionsOf(owner.agencyId), 0);
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', heroBody(0))).status, 200);
  assert.equal((await agencyOf(owner.agencyId))?.publicationStatus, 'LIVE');
  const revision = await models.PublishedRevision.findOne({ agencyId: owner.agencyId }).lean();
  assert.deepEqual((revision?.site as { properties: unknown[] }).properties, []);
});

test('a ready but Pending agency never goes Live; reconcile does not publish it either', async () => {
  const owner = await newOwner('live3');
  await makeReadyExceptHero(owner.token);
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', heroBody(0))).status, 200);
  await publication.reconcileActivations();
  assert.equal((await agencyOf(owner.agencyId))?.publicationStatus, 'NEVER_PUBLISHED');
  assert.equal(await publication.tryFirstActivation(owner.agencyId), 'NOT_ELIGIBLE');
});

test('parallel triggers produce exactly one revision', async () => {
  const owner = await newOwner('live4');
  await makeReadyExceptHero(owner.token);
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', heroBody(0))).status, 200);
  await models.Agency.updateOne({ _id: owner.agencyId }, { $set: { reviewStatus: 'APPROVED' } });
  const results = await Promise.all([
    publication.tryFirstActivation(owner.agencyId), publication.tryFirstActivation(owner.agencyId),
    publication.reconcileActivations(), authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/contact', { heading: 'Get in touch', expectedVersion: 0 }),
  ]);
  assert.equal(results.filter((result) => result === 'LIVE').length <= 1, true);
  assert.equal(await revisionsOf(owner.agencyId), 1);
  assert.equal((await agencyOf(owner.agencyId))?.publicationStatus, 'LIVE');
});

test('a failed activation is truthful: ACTIVATION_PENDING, save kept, nothing public; reconcile then goes Live', async () => {
  const owner = await newOwner('live5', 'Retry Realty');
  await makeReadyExceptHero(owner.token);
  assert.equal((await approve(owner.agencyId)).status, 200);
  const original = models.PublishedRevision.create.bind(models.PublishedRevision);
  (models.PublishedRevision as unknown as { create: unknown }).create = async () => { throw new Error('SIMULATED_STORAGE_FAILURE'); };
  try {
    const saved = await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', heroBody(0));
    assert.equal(saved.status, 200);
  } finally { (models.PublishedRevision as unknown as { create: unknown }).create = original; }
  const pending = await agencyOf(owner.agencyId);
  assert.equal(pending?.publicationStatus, 'ACTIVATION_PENDING');
  assert.equal(pending?.publication?.lastActivationError?.code, 'SIMULATED_STORAGE_FAILURE');
  assert.equal(pending?.publication?.activationAttempts, 1);
  assert.equal(await revisionsOf(owner.agencyId), 0);
  assert.equal((await authedGet('OWNER', owner.token, '/api/v1/owner/website')).body.data.sections.hero.heading, 'Homes and plots across Karachi');
  assert.deepEqual((await authedGet('OWNER', owner.token, '/api/v1/owner/website')).body.data.publication, { status: 'ACTIVATION_PENDING' });
  assert.equal((await publicGet('retry-realty')).status, 404);
  const detail = (await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${owner.agencyId}`)).body.data;
  assert.equal(detail.publication.lastActivationError.code, 'SIMULATED_STORAGE_FAILURE');
  const result = await publication.reconcileActivations();
  assert.ok(result.live >= 1);
  const live = await agencyOf(owner.agencyId);
  assert.equal(live?.publicationStatus, 'LIVE');
  assert.equal(live?.publication?.lastActivationError, undefined);
  assert.equal((await publicGet('retry-realty')).status, 200);
});

test('public read: frozen revision, later edits stay private, restrictions hide it with one identical 404', async () => {
  const owner = await newOwner('live6', 'Frozen Homes');
  await makeReadyExceptHero(owner.token);
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', heroBody(0))).status, 200);
  assert.equal((await approve(owner.agencyId)).status, 200);
  const live = await publicGet('frozen-homes');
  assert.equal(live.status, 200);
  assert.equal(live.body.data.revision, 1);
  assert.equal(live.body.data.site.sections.hero.heading, 'Homes and plots across Karachi');
  assert.equal(live.body.data.site.mapped.whatsapp, '+923007654321');
  assert.equal(live.headers['set-cookie'], undefined);
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', heroBody(1, 'A brand new private heading'))).status, 200);
  assert.equal((await publicGet('frozen-homes')).body.data.site.sections.hero.heading, 'Homes and plots across Karachi');

  const unknown = await publicGet('no-such-agency');
  assert.equal(unknown.status, 404);
  const notLive = await newOwner('live6b', 'Not Yet Live');
  await models.Agency.updateOne({ _id: notLive.agencyId }, { $set: { 'publication.slug': 'not-yet-live' } });
  const notLiveRead = await publicGet('not-yet-live');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${owner.agencyId}/restrictions`, { action: 'DEACTIVATE', reason, expectedRestrictionVersion: 0 })).status, 200);
  const deactivated = await publicGet('frozen-homes');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${owner.agencyId}/restrictions`, { action: 'RESTORE', reason, expectedRestrictionVersion: 1 })).status, 200);
  assert.equal((await publicGet('frozen-homes')).status, 200);
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${owner.agencyId}/restrictions`, { action: 'BLOCK', reason, expectedRestrictionVersion: 2 })).status, 200);
  const blocked = await publicGet('frozen-homes');
  for (const response of [unknown, notLiveRead, deactivated, blocked]) {
    assert.equal(response.status, 404);
    assert.equal(response.body.error.code, 'NOT_AVAILABLE');
    assert.equal(response.body.error.message, 'This website is not available');
  }
  assert.equal((await publicGet('Bad_Slug')).status, 404);
});

test('keys: the public key only reads public sites; the management key cannot read them', async () => {
  assert.equal((await supertest(app).get('/api/v1/owner/session').set({ 'x-public-api-key': publicKey, 'x-portal': 'OWNER' })).status, 403);
  assert.equal((await supertest(app).get('/api/v1/public/sites/harbor-view-realty').set(base('OWNER', nextIp()))).status, 403);
  assert.equal((await supertest(app).get('/api/v1/public/sites/harbor-view-realty')).status, 403);
  assert.equal((await supertest(app).get('/api/v1/public/sites/harbor-view-realty').set({ 'x-public-api-key': 'wrong-key-with-at-least-thirty-two-characters!!' })).status, 403);
  assert.equal((await supertest(app).post('/api/v1/public/sites/harbor-view-realty').set({ 'x-public-api-key': publicKey })).status, 404);
  assert.equal((await supertest(app).get('/api/v1/public/agencies').set({ 'x-public-api-key': publicKey })).status, 404);
});

test('slug collisions get a number; slugs never change after a rename', async () => {
  const first = await newOwner('twin1', 'Twin City Estates');
  const second = await newOwner('twin2', 'Twin City Estates');
  for (const owner of [first, second]) {
    await makeReadyExceptHero(owner.token);
    assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', heroBody(0))).status, 200);
    assert.equal((await approve(owner.agencyId)).status, 200);
  }
  assert.equal((await agencyOf(first.agencyId))?.publication?.slug, 'twin-city-estates');
  assert.equal((await agencyOf(second.agencyId))?.publication?.slug, 'twin-city-estates-2');
  await choosePublic(first.token, { agencyName: 'Renamed Twin Estates', expectedProfileVersion: 1 });
  assert.equal((await agencyOf(first.agencyId))?.publication?.slug, 'twin-city-estates');
  assert.equal((await publicGet('twin-city-estates')).status, 200);
});

test('published revisions are append-only', async () => {
  const any = await models.PublishedRevision.findOne().lean();
  assert.ok(any);
  await assert.rejects(() => models.PublishedRevision.updateOne({ _id: any!._id }, { $set: { slug: 'tampered' } }), /REVISION_APPEND_ONLY/);
  await assert.rejects(() => models.PublishedRevision.deleteMany({}), /REVISION_APPEND_ONLY/);
});
