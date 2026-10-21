import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import path from 'node:path';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';

// Phase 3c contract §6 acceptance tests (optional sections and layout). Synthetic data only (D-116).
const key = 'test-internal-api-key-with-at-least-thirty-two-characters';
const ownerOrigin = 'https://admin.estateos.localhost';
const superOrigin = 'https://control.estateos.localhost';
const password = 'Orchid!Harbor!72?Sky';
const reason = 'Synthetic reason for a Phase 3c sections test.';
type Portal = 'OWNER' | 'SUPER_ADMIN';

let mongo: MongoMemoryReplSet;
let app: Awaited<typeof import('../src/app.js')>['app'];
let models: typeof import('../src/models.js');
let website: typeof import('../src/website.js');
let validation: typeof import('../src/validation.js');
let superToken = '';
let ipCounter = 10;
const nextIp = () => `10.4.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`;

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
const getSite = (token: string) => authedGet('OWNER', token, '/api/v1/owner/website');
const putSection = (token: string, section: string, body: object, extra: Record<string, string> = {}) => authed('put', 'OWNER', token, `/api/v1/owner/website/sections/${section}`, body, extra);
const putLayout = (token: string, body: object) => authed('put', 'OWNER', token, '/api/v1/owner/website/layout', body);
const superPost = (url: string, body: object) => authed('post', 'SUPER_ADMIN', superToken, url, body);
const ORDER = ['about', 'services', 'properties', 'whyChooseUs', 'team'];
const hidden = { about: false, services: false, whyChooseUs: false, team: false };
const story = 'We are a family-run agency helping buyers and sellers since 2010.';
const services = (version: number, count = 2) => ({
  heading: 'What we do',
  cards: Array.from({ length: count }, (_, i) => ({ title: `Service ${i + 1}`, description: 'Short synthetic description.', icon: 'home' })),
  expectedVersion: version,
});

before(async () => {
  process.env.INTERNAL_API_KEY = key;
  process.env.CSRF_SIGNING_KEY = 'test-csrf-signing-key-with-at-least-thirty-two-characters';
  process.env.OWNER_ORIGIN = ownerOrigin;
  process.env.SUPER_ADMIN_ORIGIN = superOrigin;
  process.env.HERO_DEFAULTS_PATH = path.resolve(process.cwd(), 'test/fixtures/hero-defaults.test.json');
  app = (await import('../src/app.js')).app;
  models = await import('../src/models.js');
  website = await import('../src/website.js');
  validation = await import('../src/validation.js');
  const security = await import('../src/security.js');
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongo.getUri());
  await Promise.all([models.Agency.init(), models.User.init(), models.AuthSession.init(), models.AuthRateLimit.init(), models.AgencyAudit.init(), models.WebsiteDraft.init()]);
  await models.User.create({ role: 'SUPER_ADMIN', name: 'Sections Operator', emailNormalized: 'sections@example.test', passwordHash: await security.hashPassword(password), bootstrapKey: 'TEST_ONLY' });
  const login = await preAuthPost('SUPER_ADMIN', '/api/v1/super-admin/sessions', { email: 'sections@example.test', password });
  assert.equal(login.status, 200);
  superToken = login.body.internal.sessionToken;
});
after(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); });

test('unit: optional section schemas enforce limits, icons and the consent rule', () => {
  const s = validation.sectionSchemas;
  const card = { title: 'Buying', icon: 'key' };
  assert.equal(s.services.safeParse({ heading: 'Our services', cards: [card], expectedVersion: 0 }).success, true);
  assert.equal(s.services.safeParse({ heading: 'Our services', cards: Array(6).fill(card), expectedVersion: 0 }).success, true);
  assert.equal(s.services.safeParse({ heading: 'Our services', cards: Array(7).fill(card), expectedVersion: 0 }).success, false);
  assert.equal(s.services.safeParse({ heading: 'Our services', cards: [{ ...card, icon: 'rocket' }], expectedVersion: 0 }).success, false);
  assert.equal(s.services.safeParse({ heading: 'Our services', cards: [{ ...card, title: 'x'.repeat(41) }], expectedVersion: 0 }).success, false);
  assert.equal(s.services.safeParse({ heading: 'Our services', cards: [{ ...card, description: 'x'.repeat(161) }], expectedVersion: 0 }).success, false);
  assert.equal(s.services.safeParse({ heading: 'Our services', cards: [{ ...card, detail: 'wrong field' }], expectedVersion: 0 }).success, false);
  assert.equal(s.whyChooseUs.safeParse({ heading: 'Why choose us', cards: [{ ...card, detail: 'x'.repeat(160) }], expectedVersion: 0 }).success, true);
  assert.equal(s.about.safeParse({ heading: 'About us', story: 'x'.repeat(19), expectedVersion: 0 }).success, false);
  assert.equal(s.about.safeParse({ heading: 'About us', story: 'x'.repeat(20), expectedVersion: 0 }).success, true);
  assert.equal(s.about.safeParse({ heading: 'About us', story: 'x'.repeat(1201), expectedVersion: 0 }).success, false);
  assert.equal(s.about.safeParse({ heading: 'About us', story: '', expectedVersion: 0 }).success, true);
  assert.equal(s.about.safeParse({ heading: 'x'.repeat(61), expectedVersion: 0 }).success, false);
  const member = { name: 'Sara Example' };
  assert.equal(s.team.safeParse({ heading: 'Our team', members: Array(12).fill(member), expectedVersion: 0 }).success, true);
  assert.equal(s.team.safeParse({ heading: 'Our team', members: Array(13).fill(member), expectedVersion: 0 }).success, false);
  assert.equal(s.team.safeParse({ heading: 'Our team', members: [{ ...member, phone: '03001112222' }], expectedVersion: 0 }).success, false);
  assert.equal(s.team.safeParse({ heading: 'Our team', members: [{ ...member, phone: '03001112222', contactConsent: true }], expectedVersion: 0 }).success, true);
  assert.equal(s.team.safeParse({ heading: 'Our team', members: [{ ...member, phone: '12', contactConsent: true }], expectedVersion: 0 }).success, false);
  assert.equal(s.team.safeParse({ heading: 'Our team', members: [{ ...member, phone: '', whatsapp: '' }], expectedVersion: 0 }).success, true);
  const layout = (order: string[]) => validation.layoutSchema.safeParse({ order, visible: hidden, expectedLayoutVersion: 0 }).success;
  assert.equal(layout(ORDER), true);
  assert.equal(layout(['team', 'whyChooseUs', 'properties', 'services', 'about']), true);
  assert.equal(layout(['about', 'about', 'properties', 'whyChooseUs', 'team']), false);
  assert.equal(layout(ORDER.slice(0, 4)), false);
  assert.equal(layout([...ORDER.slice(0, 4), 'faq']), false);
});

test('unit: minimum content to show each optional section', () => {
  const min = (sections: object, keyName: 'about' | 'services' | 'whyChooseUs' | 'team') => website.hasMinimumContent({ sections } as never, keyName);
  assert.equal(min({}, 'about'), false);
  assert.equal(min({ about: { story: '   ' } }, 'about'), false);
  assert.equal(min({ about: { story } }, 'about'), true);
  assert.equal(min({ services: { cards: [] } }, 'services'), false);
  assert.equal(min({ services: { cards: [{ title: 'A', icon: 'home' }] } }, 'services'), true);
  assert.equal(min({ whyChooseUs: { cards: [{ title: 'A', icon: 'home' }] } }, 'whyChooseUs'), true);
  assert.equal(min({ team: { members: [{ name: 'Sara' }] } }, 'team'), true);
});

test('defaults: all optional sections hidden, default order, readiness unaffected', async () => {
  const owner = await newOwner('optdefaults');
  const site = (await getSite(owner.token)).body.data;
  assert.deepEqual(site.layout, { order: ORDER, visible: hidden, version: 0 });
  assert.deepEqual(site.sections.about, { heading: 'About us', version: 0 });
  assert.deepEqual(site.sections.services, { heading: 'Our services', cards: [], version: 0 });
  assert.deepEqual(site.sections.team, { heading: 'Our team', members: [], version: 0 });
  const issuesBefore = site.readiness.issues;
  assert.equal((await putSection(owner.token, 'about', { heading: 'About us', story, expectedVersion: 0 })).status, 200);
  assert.equal((await putSection(owner.token, 'services', services(0))).status, 200);
  assert.equal((await putLayout(owner.token, { order: ORDER, visible: { ...hidden, about: true, services: true }, expectedLayoutVersion: 0 })).status, 200);
  assert.deepEqual((await getSite(owner.token)).body.data.readiness.issues, issuesBefore);
});

test('each new section saves with its own version; conflicts; parallel saves; no cross-section changes', async () => {
  const owner = await newOwner('optsections');
  const saved = await putSection(owner.token, 'services', services(0));
  assert.equal(saved.status, 200, JSON.stringify(saved.body));
  assert.equal(saved.body.data.section.version, 1);
  assert.deepEqual(saved.body.data.section.cards[0], { title: 'Service 1', description: 'Short synthetic description.', icon: 'home' });
  const reasons = await putSection(owner.token, 'whyChooseUs', { heading: 'Why us', cards: [{ title: 'Honest advice', detail: 'No hidden fees.', icon: 'shield' }], expectedVersion: 0 });
  assert.equal(reasons.status, 200);
  assert.equal(reasons.body.data.section.cards[0].detail, 'No hidden fees.');
  const team = await putSection(owner.token, 'team', { heading: 'Our team', members: [{ name: 'Sara Example', role: 'Agent', whatsapp: '0300 111 2222', contactConsent: true }, { name: 'Ali Example' }], expectedVersion: 0 });
  assert.equal(team.status, 200, JSON.stringify(team.body));
  assert.deepEqual(team.body.data.section.members, [
    { name: 'Sara Example', role: 'Agent', whatsapp: '+923001112222', contactConsent: true },
    { name: 'Ali Example' },
  ]);
  const site = (await getSite(owner.token)).body.data;
  assert.equal(site.sections.about.version, 0);
  assert.equal(site.sections.hero.version, 0);
  assert.equal(site.sections.services.version, 1);
  const stale = await putSection(owner.token, 'services', services(0, 1));
  assert.equal(stale.status, 409);
  assert.equal(stale.body.error.code, 'SECTION_CONFLICT');
  const parallel = await Promise.all([putSection(owner.token, 'services', services(1, 3)), putSection(owner.token, 'services', services(1, 4))]);
  assert.deepEqual(parallel.map((result) => result.status).sort(), [200, 409]);
});

test('team numbers need consent; unknown icons and limits are 422', async () => {
  const owner = await newOwner('optconsent');
  const noConsent = await putSection(owner.token, 'team', { heading: 'Our team', members: [{ name: 'Sara Example', phone: '03001112222' }], expectedVersion: 0 });
  assert.equal(noConsent.status, 422);
  assert.ok(noConsent.body.error.details['members.0.contactConsent']);
  assert.equal((await putSection(owner.token, 'services', { heading: 'Our services', cards: [{ title: 'Buying', icon: 'rocket' }], expectedVersion: 0 })).status, 422);
  assert.equal((await putSection(owner.token, 'services', services(0, 7))).status, 422);
  assert.equal((await getSite(owner.token)).body.data.sections.team.members.length, 0);
});

test('layout: save order and visibility, conflicts, minimum content to show, no emptying a shown section', async () => {
  const owner = await newOwner('optlayout');
  const showEmpty = await putLayout(owner.token, { order: ORDER, visible: { ...hidden, services: true }, expectedLayoutVersion: 0 });
  assert.equal(showEmpty.status, 422);
  assert.ok(showEmpty.body.error.details['visible.services']);
  assert.equal((await putSection(owner.token, 'services', services(0))).status, 200);
  const order = ['team', 'services', 'properties', 'about', 'whyChooseUs'];
  const saved = await putLayout(owner.token, { order, visible: { ...hidden, services: true }, expectedLayoutVersion: 0 });
  assert.equal(saved.status, 200, JSON.stringify(saved.body));
  assert.deepEqual(saved.body.data.layout, { order, visible: { ...hidden, services: true }, version: 1 });
  const stale = await putLayout(owner.token, { order: ORDER, visible: hidden, expectedLayoutVersion: 0 });
  assert.equal(stale.status, 409);
  assert.equal(stale.body.error.code, 'LAYOUT_CONFLICT');
  const emptied = await putSection(owner.token, 'services', { heading: 'What we do', cards: [], expectedVersion: 1 });
  assert.equal(emptied.status, 422);
  assert.ok(emptied.body.error.details.section);
  assert.equal((await getSite(owner.token)).body.data.sections.services.cards.length, 2);
  assert.equal((await putLayout(owner.token, { order, visible: hidden, expectedLayoutVersion: 1 })).status, 200);
  assert.equal((await putSection(owner.token, 'services', { heading: 'What we do', cards: [], expectedVersion: 1 })).status, 200);
  assert.equal((await putSection(owner.token, 'about', { heading: 'About us', story: '', expectedVersion: 0 })).status, 200);
});

test('permissions and tenant isolation match Phase 3b', async () => {
  const rejected = await newOwner('optrejected');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${rejected.agencyId}/review-decisions`, { decision: 'REJECT', reason, expectedReviewVersion: 0 })).status, 200);
  assert.equal((await putSection(rejected.token, 'about', { heading: 'About us', story, expectedVersion: 0 })).body.error.code, 'WEBSITE_READ_ONLY');
  assert.equal((await putLayout(rejected.token, { order: ORDER, visible: hidden, expectedLayoutVersion: 0 })).body.error.code, 'WEBSITE_READ_ONLY');
  const deactivated = await newOwner('optdeactivated');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${deactivated.agencyId}/restrictions`, { action: 'DEACTIVATE', reason, expectedRestrictionVersion: 0 })).status, 200);
  assert.equal((await putLayout(deactivated.token, { order: ORDER, visible: hidden, expectedLayoutVersion: 0 })).body.error.code, 'AGENCY_DEACTIVATED');
  const blocked = await newOwner('optblocked');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${blocked.agencyId}/restrictions`, { action: 'BLOCK', reason, expectedRestrictionVersion: 0 })).status, 200);
  assert.equal((await putSection(blocked.token, 'team', { heading: 'Our team', members: [], expectedVersion: 0 })).status, 401);
  const a = await newOwner('opta');
  const b = await newOwner('optb');
  assert.equal((await putSection(a.token, 'about', { heading: 'About us', story, expectedVersion: 0, agencyId: b.agencyId })).status, 422);
  assert.equal((await putSection(a.token, 'about', { heading: 'About us', story, expectedVersion: 0 }, { 'x-agency-id': b.agencyId })).status, 422);
  assert.equal((await putSection(a.token, 'about', { heading: 'About us', story, expectedVersion: 0 })).status, 200);
  const bSite = (await getSite(b.token)).body.data;
  assert.deepEqual(bSite.sections.about, { heading: 'About us', version: 0 });
});

test('Super Admin view includes sections and layout and never creates a draft', async () => {
  const quiet = await newOwner('optquiet');
  const view = await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${quiet.agencyId}/website`);
  assert.equal(view.status, 200);
  assert.deepEqual(view.body.data.layout, { order: ORDER, visible: hidden, version: 0 });
  assert.deepEqual(view.body.data.sections.whyChooseUs, { heading: 'Why choose us', cards: [], version: 0 });
  assert.equal(await models.WebsiteDraft.countDocuments({ agencyId: quiet.agencyId }), 0);
  const busy = await newOwner('optbusy');
  assert.equal((await putSection(busy.token, 'team', { heading: 'Meet the team', members: [{ name: 'Sara Example' }], expectedVersion: 0 })).status, 200);
  const busyView = (await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${busy.agencyId}/website`)).body.data;
  assert.equal(busyView.sections.team.heading, 'Meet the team');
  assert.equal(busyView.canEdit, false);
});

test('drafts created before Phase 3c (no new fields stored) still save', async () => {
  const owner = await newOwner('optlegacy');
  await getSite(owner.token);
  await models.WebsiteDraft.collection.updateOne({ agencyId: new mongoose.Types.ObjectId(owner.agencyId) },
    { $unset: { 'sections.about': '', 'sections.services': '', 'sections.whyChooseUs': '', 'sections.team': '', layout: '' } });
  assert.equal((await putSection(owner.token, 'services', services(0))).status, 200);
  assert.equal((await putLayout(owner.token, { order: ORDER, visible: { ...hidden, services: true }, expectedLayoutVersion: 0 })).status, 200);
  const site = (await getSite(owner.token)).body.data;
  assert.equal(site.layout.visible.services, true);
  assert.equal(site.sections.about.heading, 'About us');
});
