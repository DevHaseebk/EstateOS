import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';

// Phase 4b contract §6 acceptance tests: Publish updates for already-Live websites. Synthetic data only (D-116).
const key = 'test-internal-api-key-with-at-least-thirty-two-characters';
const publicKey = 'test-public-api-key-with-at-least-thirty-two-characters-x';
const ownerOrigin = 'https://admin.estateos.localhost';
const superOrigin = 'https://control.estateos.localhost';
const password = 'Orchid!Harbor!72?Sky';
const reason = 'Synthetic reason for a Phase 4b publish test.';
type Portal = 'OWNER' | 'SUPER_ADMIN';

let mongo: MongoMemoryReplSet;
let app: Awaited<typeof import('../src/app.js')>['app'];
let models: typeof import('../src/models.js');
let publication: typeof import('../src/publication.js');
let superToken = '';
let ipCounter = 10;
const nextIp = () => `10.6.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`;

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
  return supertest(app)[method](url).set({ ...base(portal, ip), origin: portal === 'OWNER' ? ownerOrigin : superOrigin, 'x-csrf-token': pre.token, 'x-session-token': token, ...extra }).send(body);
}
const authedGet = (portal: Portal, token: string, url: string) => supertest(app).get(url).set({ ...base(portal, nextIp()), 'x-session-token': token });
const publicGet = (slug: string) => supertest(app).get(`/api/v1/public/sites/${slug}`).set({ 'x-public-api-key': publicKey });
const superPost = (url: string, body: object) => authed('post', 'SUPER_ADMIN', superToken, url, body);
const site = (token: string) => authedGet('OWNER', token, '/api/v1/owner/website').then((response) => response.body.data);
const publish = (token: string, expectedLiveRevision: number, requestId = randomUUID(), extra: Record<string, string> = {}) =>
  authed('post', 'OWNER', token, '/api/v1/owner/website/publish', { expectedLiveRevision, requestId }, extra);
const heroBody = (version: number, heading: string) => ({ heading, ctaLabel: 'Talk to us', heroImageId: 'test-licensed', expectedVersion: version });

async function newOwner(label: string) {
  const email = `${label}@example.test`;
  const created = await preAuthPost('OWNER', '/api/v1/owner/registrations', {
    ownerName: `Owner ${label}`, agencyName: `Agency ${label}`, mobile: '03001234567', whatsapp: '03007654321', email, password,
  });
  assert.equal(created.status, 201, JSON.stringify(created.body));
  const login = await preAuthPost('OWNER', '/api/v1/owner/sessions', { email, password });
  assert.equal(login.status, 200);
  return { email, agencyId: created.body.data.agency.id as string, token: login.body.internal.sessionToken as string, slug: `agency-${label}` };
}
async function saveProfile(token: string, publicContact = { showMobile: false, showWhatsapp: true }) {
  const profile = (await authedGet('OWNER', token, '/api/v1/owner/profile')).body.data;
  const saved = await authed('put', 'OWNER', token, '/api/v1/owner/profile', {
    agencyName: profile.agencyName, ownerName: profile.ownerName, mobile: profile.mobile, whatsapp: profile.whatsapp,
    publicContact, profile: { city: 'Karachi' }, expectedProfileVersion: profile.version,
  });
  assert.equal(saved.status, 200, JSON.stringify(saved.body));
}
/** A Live agency with revision 1. */
async function liveOwner(label: string) {
  const owner = await newOwner(label);
  await saveProfile(owner.token);
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/theme', { preset: 'MODERN_LIGHT', expectedThemeVersion: 0 })).status, 200);
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', heroBody(0, 'First live heading'))).status, 200);
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${owner.agencyId}/review-decisions`, { decision: 'APPROVE', expectedReviewVersion: 0 })).status, 200);
  assert.equal((await models.Agency.findById(owner.agencyId).lean())?.publicationStatus, 'LIVE');
  return owner;
}

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
  await models.User.create({ role: 'SUPER_ADMIN', name: 'Publish Operator', emailNormalized: 'updates@example.test', passwordHash: await security.hashPassword(password), bootstrapKey: 'TEST_ONLY' });
  const login = await preAuthPost('SUPER_ADMIN', '/api/v1/super-admin/sessions', { email: 'updates@example.test', password });
  assert.equal(login.status, 200);
  superToken = login.body.internal.sessionToken;
});
after(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); });

test('unit: the content fingerprint ignores version counters and key order, and sees real changes', () => {
  const a = { theme: { preset: 'MODERN_LIGHT', version: 1 }, sections: { hero: { heading: 'Hello', version: 3 } }, mapped: { agencyName: 'X' } };
  const b = { mapped: { agencyName: 'X' }, sections: { hero: { version: 9, heading: 'Hello' } }, theme: { version: 7, preset: 'MODERN_LIGHT' } };
  assert.equal(publication.contentFingerprint(a), publication.contentFingerprint(b));
  assert.notEqual(publication.contentFingerprint(a), publication.contentFingerprint({ ...a, theme: { preset: 'WARM_EDITORIAL', version: 1 } }));
  assert.notEqual(publication.contentFingerprint(a), publication.contentFingerprint({ ...a, mapped: { agencyName: 'X', phone: '+923001234567' } }));
  assert.notEqual(publication.contentFingerprint(a), publication.contentFingerprint({ ...a, sections: { hero: { heading: 'Hello!', version: 3 } } }));
});

test('publish is never a first-Live gate: not Live → 409 NOT_LIVE', async () => {
  const pending = await newOwner('notlive');
  await saveProfile(pending.token);
  const response = await publish(pending.token, 1);
  assert.equal(response.status, 409);
  assert.equal(response.body.error.code, 'NOT_LIVE');
  assert.equal(await models.PublishedRevision.countDocuments({ agencyId: pending.agencyId }), 0);
  assert.equal((await models.Agency.findById(pending.agencyId).lean())?.publicationStatus, 'NEVER_PUBLISHED');
});

test('no changes: flag false, publish → NOTHING_TO_PUBLISH; re-saving identical text keeps it false', async () => {
  const owner = await liveOwner('nochange');
  let data = await site(owner.token);
  assert.equal(data.publication.unpublishedChanges, false);
  assert.equal(data.publication.liveRevision, 1);
  const nothing = await publish(owner.token, 1);
  assert.equal(nothing.status, 409);
  assert.equal(nothing.body.error.code, 'NOTHING_TO_PUBLISH');
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', heroBody(1, 'First live heading'))).status, 200);
  data = await site(owner.token);
  assert.equal(data.sections.hero.version, 2);
  assert.equal(data.publication.unpublishedChanges, false);
});

test('section, theme, layout and Profile saves mark changes; publish makes revision 2 public and clears the flag', async () => {
  const owner = await liveOwner('changes');
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', heroBody(1, 'Second heading for publish'))).status, 200);
  assert.equal((await site(owner.token)).publication.unpublishedChanges, true);
  assert.equal((await publicGet(owner.slug)).body.data.site.sections.hero.heading, 'First live heading');
  const published = await publish(owner.token, 1);
  assert.equal(published.status, 200, JSON.stringify(published.body));
  assert.equal(published.body.data.publication.liveRevision, 2);
  assert.equal(published.body.data.publication.unpublishedChanges, false);
  const live = await publicGet(owner.slug);
  assert.equal(live.body.data.revision, 2);
  assert.equal(live.body.data.site.sections.hero.heading, 'Second heading for publish');
  const audit = await models.AgencyAudit.find({ agencyId: owner.agencyId, action: 'WEBSITE_PUBLISH_UPDATES' }).lean();
  assert.equal(audit.length, 1);
  assert.equal(audit[0]!.actorRole, 'AGENCY_OWNER');

  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/theme', { preset: 'CONTEMPORARY_DARK', expectedThemeVersion: 1 })).status, 200);
  assert.equal((await site(owner.token)).publication.unpublishedChanges, true);
  assert.equal((await publish(owner.token, 2)).status, 200);
  assert.equal((await publicGet(owner.slug)).body.data.site.theme.preset, 'CONTEMPORARY_DARK');

  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/about', { heading: 'About us', story: 'A synthetic agency story that is long enough.', expectedVersion: 0 })).status, 200);
  // §1 Q1: the whole saved draft is published, so saved content of a hidden section is also an unpublished change.
  assert.equal((await site(owner.token)).publication.unpublishedChanges, true);
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/layout', { order: ['about', 'services', 'properties', 'whyChooseUs', 'team'], visible: { about: true, services: false, whyChooseUs: false, team: false }, expectedLayoutVersion: 0 })).status, 200);
  assert.equal((await site(owner.token)).publication.unpublishedChanges, true);
  assert.equal((await publish(owner.token, 3)).status, 200);

  await saveProfile(owner.token, { showMobile: true, showWhatsapp: true });
  assert.equal((await site(owner.token)).publication.unpublishedChanges, true);
  assert.equal((await publicGet(owner.slug)).body.data.site.mapped.phone, undefined);
  assert.equal((await publish(owner.token, 4)).status, 200);
  assert.equal((await publicGet(owner.slug)).body.data.site.mapped.phone, '+923001234567');
});

test('the same requestId never publishes twice; a stale expected revision is a conflict', async () => {
  const owner = await liveOwner('idempotent');
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', heroBody(1, 'Idempotent heading'))).status, 200);
  const requestId = randomUUID();
  const [first, second] = await Promise.all([publish(owner.token, 1, requestId), publish(owner.token, 1, requestId)]);
  assert.equal(first.status, 200, JSON.stringify(first.body));
  assert.equal(second.status, 200, JSON.stringify(second.body));
  const third = await publish(owner.token, 1, requestId);
  assert.equal(third.status, 200);
  assert.equal(await models.PublishedRevision.countDocuments({ agencyId: owner.agencyId }), 2);
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', heroBody(2, 'Another heading'))).status, 200);
  const stale = await publish(owner.token, 1);
  assert.equal(stale.status, 409);
  assert.equal(stale.body.error.code, 'PUBLISH_CONFLICT');
  assert.equal((await publish(owner.token, 2, 'not-a-uuid')).status, 422);
});

test('a failure changes nothing; retrying with the same requestId then publishes once', async () => {
  const owner = await liveOwner('failure');
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', heroBody(1, 'Heading after failure'))).status, 200);
  const requestId = randomUUID();
  const original = models.PublishedRevision.create.bind(models.PublishedRevision);
  (models.PublishedRevision as unknown as { create: unknown }).create = async () => { throw new Error('SIMULATED_STORAGE_FAILURE'); };
  try {
    const failed = await publish(owner.token, 1, requestId);
    assert.equal(failed.status, 503);
    assert.equal(failed.body.error.code, 'PUBLISH_FAILED');
  } finally { (models.PublishedRevision as unknown as { create: unknown }).create = original; }
  assert.equal((await publicGet(owner.slug)).body.data.site.sections.hero.heading, 'First live heading');
  assert.equal((await site(owner.token)).sections.hero.heading, 'Heading after failure');
  assert.equal(await models.PublishedRevision.countDocuments({ agencyId: owner.agencyId }), 1);
  assert.equal((await publish(owner.token, 1, requestId)).status, 200);
  assert.equal(await models.PublishedRevision.countDocuments({ agencyId: owner.agencyId }), 2);
  assert.equal((await publicGet(owner.slug)).body.data.site.sections.hero.heading, 'Heading after failure');
});

test('a draft that is no longer ready cannot be published; the Live site stays', async () => {
  const owner = await liveOwner('unready');
  await saveProfile(owner.token, { showMobile: false, showWhatsapp: false });
  const refused = await publish(owner.token, 1);
  assert.equal(refused.status, 422);
  assert.equal(refused.body.error.code, 'NOT_READY');
  assert.ok(refused.body.error.details.PUBLIC_CONTACT);
  const live = await publicGet(owner.slug);
  assert.equal(live.body.data.revision, 1);
  assert.equal(live.body.data.site.mapped.whatsapp, '+923007654321');
});

test('permissions and tenant isolation', async () => {
  const deactivated = await liveOwner('pubdeactivated');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${deactivated.agencyId}/restrictions`, { action: 'DEACTIVATE', reason, expectedRestrictionVersion: 0 })).status, 200);
  assert.equal((await publish(deactivated.token, 1)).body.error.code, 'AGENCY_DEACTIVATED');
  const blocked = await liveOwner('pubblocked');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${blocked.agencyId}/restrictions`, { action: 'BLOCK', reason, expectedRestrictionVersion: 0 })).status, 200);
  assert.equal((await publish(blocked.token, 1)).status, 401);
  const a = await liveOwner('puba');
  const b = await liveOwner('pubb');
  assert.equal((await authed('put', 'OWNER', b.token, '/api/v1/owner/website/sections/hero', heroBody(1, 'B private change'))).status, 200);
  assert.equal((await authed('post', 'OWNER', a.token, '/api/v1/owner/website/publish', { expectedLiveRevision: 1, requestId: randomUUID(), agencyId: b.agencyId })).status, 422);
  assert.equal((await publish(a.token, 1, randomUUID(), { 'x-agency-id': b.agencyId })).status, 422);
  assert.equal((await publish(a.token, 1)).body.error.code, 'NOTHING_TO_PUBLISH');
  assert.equal((await publicGet(b.slug)).body.data.revision, 1);
});

test('Super Admin detail shows the Live revision, publish date and unpublished flag', async () => {
  const owner = await liveOwner('pubadmin');
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/contact', { heading: 'Call us today', expectedVersion: 0 })).status, 200);
  let detail = (await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${owner.agencyId}`)).body.data;
  assert.equal(detail.publication.liveRevision, 1);
  assert.ok(detail.publication.publishedAt);
  assert.equal(detail.publication.unpublishedChanges, true);
  assert.equal((await publish(owner.token, 1)).status, 200);
  detail = (await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${owner.agencyId}`)).body.data;
  assert.equal(detail.publication.liveRevision, 2);
  assert.equal(detail.publication.unpublishedChanges, false);
  assert.ok(detail.history.some((entry: { action: string }) => entry.action === 'WEBSITE_PUBLISH_UPDATES'));
});
