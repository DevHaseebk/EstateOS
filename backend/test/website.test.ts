import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import path from 'node:path';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';

// Phase 3b contract §9 acceptance tests. Synthetic data only (D-116); a fixture photo list stands in for the owner's licensed photos.
const key = 'test-internal-api-key-with-at-least-thirty-two-characters';
const ownerOrigin = 'https://admin.estateos.localhost';
const superOrigin = 'https://control.estateos.localhost';
const password = 'Orchid!Harbor!72?Sky';
const reason = 'Synthetic reason for a Phase 3b website test.';
type Portal = 'OWNER' | 'SUPER_ADMIN';

let mongo: MongoMemoryReplSet;
let app: Awaited<typeof import('../src/app.js')>['app'];
let models: typeof import('../src/models.js');
let website: typeof import('../src/website.js');
let validation: typeof import('../src/validation.js');
let superToken = '';
let ipCounter = 10;
const nextIp = () => `10.3.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`;

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
const putTheme = (token: string, preset: string, version: number) => authed('put', 'OWNER', token, '/api/v1/owner/website/theme', { preset, expectedThemeVersion: version });
const putSection = (token: string, section: string, body: object, extra: Record<string, string> = {}) => authed('put', 'OWNER', token, `/api/v1/owner/website/sections/${section}`, body, extra);
const superPost = (url: string, body: object) => authed('post', 'SUPER_ADMIN', superToken, url, body);
const heroBody = (version: number, overrides: Record<string, unknown> = {}) => ({ heading: 'Homes and plots across Karachi', subtitle: 'Family-run since 2010.', ctaLabel: 'Talk to us', heroImageId: 'test-licensed', expectedVersion: version, ...overrides });
async function choosePublic(token: string, showMobile: boolean, showWhatsapp: boolean) {
  const profile = (await authedGet('OWNER', token, '/api/v1/owner/profile')).body.data;
  const saved = await authed('put', 'OWNER', token, '/api/v1/owner/profile', {
    agencyName: profile.agencyName, ownerName: profile.ownerName, mobile: profile.mobile, whatsapp: profile.whatsapp,
    publicContact: { showMobile, showWhatsapp }, profile: { city: 'Karachi' }, expectedProfileVersion: profile.version,
  });
  assert.equal(saved.status, 200, JSON.stringify(saved.body));
}
async function makeReady(token: string) {
  await choosePublic(token, false, true);
  assert.equal((await putTheme(token, 'WARM_EDITORIAL', 0)).status, 200);
  assert.equal((await putSection(token, 'hero', heroBody(0))).status, 200);
}

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
  await models.User.create({ role: 'SUPER_ADMIN', name: 'Website Operator', emailNormalized: 'sites@example.test', passwordHash: await security.hashPassword(password), bootstrapKey: 'TEST_ONLY' });
  const login = await preAuthPost('SUPER_ADMIN', '/api/v1/super-admin/sessions', { email: 'sites@example.test', password });
  assert.equal(login.status, 200);
  superToken = login.body.internal.sessionToken;
});
after(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); });

test('unit: licensed photo list ignores entries without full licence details', () => {
  assert.deepEqual(website.licensedHeroDefaults().map((entry) => entry.id), ['test-licensed']);
});

test('unit: getReadinessIssues reports each missing essential and nothing when all are met', () => {
  const licensed = new Set(['photo-1']);
  const complete = {
    theme: { preset: 'MODERN_LIGHT' },
    sections: { hero: { heading: 'A real heading', heroImage: { assetId: 'photo-1' } } },
    mapped: { agencyName: 'Real Agency', whatsapp: '+923001234567' },
  };
  assert.deepEqual(website.getReadinessIssues(complete, licensed), []);
  const keys = (draft: object) => website.getReadinessIssues(draft, licensed).map((issue) => issue.key);
  assert.deepEqual(keys({ ...complete, theme: { preset: null } }), ['THEME']);
  assert.deepEqual(keys({ ...complete, mapped: { agencyName: '  ', whatsapp: '+923001234567' } }), ['AGENCY_NAME']);
  assert.deepEqual(keys({ ...complete, sections: { hero: { heading: '   ', heroImage: { assetId: 'photo-1' } } } }), ['HERO_HEADING']);
  assert.deepEqual(keys({ ...complete, mapped: { agencyName: 'Real Agency' } }), ['PUBLIC_CONTACT']);
  assert.deepEqual(keys({ ...complete, mapped: { agencyName: 'Real Agency', phone: '+923001234567' } }), []);
  assert.deepEqual(keys({ ...complete, sections: { hero: { heading: 'A real heading' } } }), ['HERO_IMAGE']);
  assert.deepEqual(keys({ ...complete, sections: { hero: { heading: 'A real heading', heroImage: { assetId: 'unlisted' } } } }), ['HERO_IMAGE']);
});

test('unit: section schemas enforce the approved text limits', () => {
  const hero = (overrides: Record<string, unknown>) => validation.sectionSchemas.hero.safeParse(heroBody(0, overrides)).success;
  assert.equal(hero({}), true);
  assert.equal(hero({ heading: 'ab' }), false);
  assert.equal(hero({ heading: 'abc' }), true);
  assert.equal(hero({ heading: 'x'.repeat(80) }), true);
  assert.equal(hero({ heading: 'x'.repeat(81) }), false);
  assert.equal(hero({ subtitle: 'x'.repeat(160) }), true);
  assert.equal(hero({ subtitle: 'x'.repeat(161) }), false);
  assert.equal(hero({ ctaLabel: 'x' }), false);
  assert.equal(hero({ ctaLabel: 'x'.repeat(31) }), false);
  assert.equal(hero({ ctaTarget: 'PROPERTIES' }), false);
  const contact = (overrides: Record<string, unknown>) => validation.sectionSchemas.contact.safeParse({ heading: 'Get in touch', expectedVersion: 0, ...overrides }).success;
  assert.equal(contact({ message: 'x'.repeat(300) }), true);
  assert.equal(contact({ message: 'x'.repeat(301) }), false);
  assert.equal(contact({ heading: 'x'.repeat(81) }), false);
  const header = (overrides: Record<string, unknown>) => validation.sectionSchemas.header.safeParse({ contactButtonLabel: 'Call us', expectedVersion: 0, ...overrides }).success;
  assert.equal(header({ preferredContact: 'EMAIL' }), false);
  assert.equal(header({ contactButtonLabel: 'x'.repeat(31) }), false);
  assert.equal(validation.themeSchema.safeParse({ preset: 'NEON', expectedThemeVersion: 0 }).success, false);
});

test('first GET creates one private draft with defaults and the expected missing items', async () => {
  const owner = await newOwner('firstget');
  const first = await getSite(owner.token);
  assert.equal(first.status, 200);
  assert.deepEqual(first.body.data.theme, { preset: null, version: 0 });
  assert.equal(first.body.data.sections.hero.heading, '');
  assert.equal(first.body.data.sections.header.contactButtonLabel, 'Contact us');
  assert.equal(first.body.data.sections.contact.heading, 'Get in touch');
  assert.deepEqual(first.body.data.mapped, { agencyName: 'Agency firstget' });
  assert.deepEqual(first.body.data.readiness.issues.map((issue: { key: string }) => issue.key), ['THEME', 'HERO_HEADING', 'PUBLIC_CONTACT', 'HERO_IMAGE']);
  assert.deepEqual(first.body.data.heroDefaults, [{ id: 'test-licensed', label: 'Synthetic licensed photo' }]);
  await Promise.all([getSite(owner.token), getSite(owner.token)]);
  assert.equal(await models.WebsiteDraft.countDocuments({ agencyId: owner.agencyId }), 1);
});

test('theme Apply saves with a version; a stale version is a conflict', async () => {
  const owner = await newOwner('theme');
  const applied = await putTheme(owner.token, 'CONTEMPORARY_DARK', 0);
  assert.equal(applied.status, 200, JSON.stringify(applied.body));
  assert.deepEqual(applied.body.data.theme, { preset: 'CONTEMPORARY_DARK', version: 1 });
  assert.ok(!applied.body.data.readiness.issues.some((issue: { key: string }) => issue.key === 'THEME'));
  const stale = await putTheme(owner.token, 'MODERN_LIGHT', 0);
  assert.equal(stale.status, 409);
  assert.equal(stale.body.error.code, 'THEME_CONFLICT');
  assert.equal((await getSite(owner.token)).body.data.theme.preset, 'CONTEMPORARY_DARK');
});

test('section saves: per-section versions, conflicts, parallel saves and no cross-section changes', async () => {
  const owner = await newOwner('sections');
  const hero = await putSection(owner.token, 'hero', heroBody(0));
  assert.equal(hero.status, 200, JSON.stringify(hero.body));
  assert.equal(hero.body.data.section.version, 1);
  assert.equal(hero.body.data.section.heroImageId, 'test-licensed');
  const contact = await putSection(owner.token, 'contact', { heading: 'Visit our office', message: 'Open Monday to Saturday.', expectedVersion: 0 });
  assert.equal(contact.status, 200);
  const site = (await getSite(owner.token)).body.data;
  assert.equal(site.sections.hero.heading, 'Homes and plots across Karachi');
  assert.equal(site.sections.hero.version, 1);
  assert.equal(site.sections.contact.message, 'Open Monday to Saturday.');
  assert.equal(site.sections.header.version, 0);
  const stale = await putSection(owner.token, 'hero', heroBody(0, { heading: 'Stale heading text' }));
  assert.equal(stale.status, 409);
  assert.equal(stale.body.error.code, 'SECTION_CONFLICT');
  const parallel = await Promise.all([
    putSection(owner.token, 'contact', { heading: 'First parallel', expectedVersion: 1 }),
    putSection(owner.token, 'contact', { heading: 'Second parallel', expectedVersion: 1 }),
  ]);
  assert.deepEqual(parallel.map((result) => result.status).sort(), [200, 409]);
  const cleared = await putSection(owner.token, 'hero', heroBody(1, { subtitle: '', heroImageId: null }));
  assert.equal(cleared.status, 200);
  assert.equal(cleared.body.data.section.subtitle, undefined);
  assert.equal(cleared.body.data.section.heroImageId, null);
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/footer', {})).status, 404);
});

test('hero photo must be licensed; preferred contact must be a public number', async () => {
  const owner = await newOwner('rules');
  const unlicensed = await putSection(owner.token, 'hero', heroBody(0, { heroImageId: 'test-unlicensed' }));
  assert.equal(unlicensed.status, 422);
  assert.ok(unlicensed.body.error.details.heroImageId);
  assert.equal((await putSection(owner.token, 'hero', heroBody(0, { heroImageId: 'made-up' }))).status, 422);
  const phone = await putSection(owner.token, 'header', { contactButtonLabel: 'Call us', preferredContact: 'PHONE', expectedVersion: 0 });
  assert.equal(phone.status, 422);
  assert.ok(phone.body.error.details.preferredContact);
  await choosePublic(owner.token, true, false);
  assert.equal((await putSection(owner.token, 'header', { contactButtonLabel: 'Call us', preferredContact: 'PHONE', expectedVersion: 0 })).status, 200);
  assert.equal((await putSection(owner.token, 'header', { contactButtonLabel: 'Call us', preferredContact: 'WHATSAPP', expectedVersion: 1 })).status, 422);
});

test('Profile saves refresh the mapped values; numbers not chosen as public are never mapped', async () => {
  const owner = await newOwner('mapping');
  await getSite(owner.token);
  await choosePublic(owner.token, false, true);
  let mapped = (await getSite(owner.token)).body.data.mapped;
  assert.deepEqual(mapped, { agencyName: 'Agency mapping', whatsapp: '+923007654321', city: 'Karachi' });
  await choosePublic(owner.token, true, false);
  mapped = (await getSite(owner.token)).body.data.mapped;
  assert.equal(mapped.phone, '+923001234567');
  assert.equal(mapped.whatsapp, undefined);
  const stored = await models.WebsiteDraft.findOne({ agencyId: owner.agencyId }).lean();
  assert.equal(stored?.mapped?.whatsapp, undefined);

  const fresh = await newOwner('mappingfresh');
  await choosePublic(fresh.token, false, true);
  assert.equal((await models.WebsiteDraft.findOne({ agencyId: fresh.agencyId }).lean())?.mapped?.whatsapp, '+923007654321');
});

test('all five essentials make the site READY; approved + ready is still never published', async () => {
  const owner = await newOwner('ready');
  await makeReady(owner.token);
  const site = (await getSite(owner.token)).body.data;
  assert.deepEqual(site.readiness, { ready: true, issues: [] });
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${owner.agencyId}/review-decisions`, { decision: 'APPROVE', expectedReviewVersion: 0 })).status, 200);
  const agency = await models.Agency.findById(owner.agencyId).lean();
  assert.equal(agency?.publicationStatus, 'NEVER_PUBLISHED');
  const detail = await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${owner.agencyId}`);
  assert.equal(detail.body.data.websiteReadiness, 'READY');
  assert.deepEqual(detail.body.data.readinessIssues, []);
});

test('permissions: Approved edits, Rejected read-only, Deactivated refused but can read, Blocked signed out', async () => {
  const approved = await newOwner('siteapproved');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${approved.agencyId}/review-decisions`, { decision: 'APPROVE', expectedReviewVersion: 0 })).status, 200);
  assert.equal((await putTheme(approved.token, 'MODERN_LIGHT', 0)).status, 200);

  const rejected = await newOwner('siterejected');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${rejected.agencyId}/review-decisions`, { decision: 'REJECT', reason, expectedReviewVersion: 0 })).status, 200);
  assert.equal((await getSite(rejected.token)).body.data.canEdit, false);
  const readOnly = await putTheme(rejected.token, 'MODERN_LIGHT', 0);
  assert.equal(readOnly.status, 403);
  assert.equal(readOnly.body.error.code, 'WEBSITE_READ_ONLY');
  assert.equal((await putSection(rejected.token, 'hero', heroBody(0))).body.error.code, 'WEBSITE_READ_ONLY');

  const deactivated = await newOwner('sitedeactivated');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${deactivated.agencyId}/restrictions`, { action: 'DEACTIVATE', reason, expectedRestrictionVersion: 0 })).status, 200);
  assert.equal((await getSite(deactivated.token)).status, 200);
  const refused = await putSection(deactivated.token, 'contact', { heading: 'Get in touch', expectedVersion: 0 });
  assert.equal(refused.status, 403);
  assert.equal(refused.body.error.code, 'AGENCY_DEACTIVATED');

  const blocked = await newOwner('siteblocked');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${blocked.agencyId}/restrictions`, { action: 'BLOCK', reason, expectedRestrictionVersion: 0 })).status, 200);
  assert.equal((await getSite(blocked.token)).status, 401);
  assert.equal((await putTheme(blocked.token, 'MODERN_LIGHT', 0)).status, 401);
});

test('tenant isolation: injected agencyId is rejected and owners only touch their own draft', async () => {
  const a = await newOwner('sitea');
  const b = await newOwner('siteb');
  await getSite(b.token);
  assert.equal((await authedGet('OWNER', a.token, `/api/v1/owner/website?agencyId=${b.agencyId}`)).status, 422);
  assert.equal((await putSection(a.token, 'hero', { ...heroBody(0), agencyId: b.agencyId })).status, 422);
  assert.equal((await putSection(a.token, 'hero', heroBody(0), { 'x-agency-id': b.agencyId })).status, 422);
  assert.equal((await putSection(a.token, 'hero', heroBody(0))).status, 200);
  const bSite = (await getSite(b.token)).body.data;
  assert.equal(bSite.sections.hero.heading, '');
  assert.equal(bSite.sections.hero.version, 0);
  assert.equal(bSite.mapped.agencyName, 'Agency siteb');
});

test('Super Admin website view, directory readiness, and no draft created by reading', async () => {
  const quiet = await newOwner('sitequiet');
  const view = await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${quiet.agencyId}/website`);
  assert.equal(view.status, 200);
  assert.equal(view.body.data.canEdit, false);
  assert.equal(view.body.data.mapped.agencyName, 'Agency sitequiet');
  assert.equal(await models.WebsiteDraft.countDocuments({ agencyId: quiet.agencyId }), 0);
  const ready = await newOwner('sitedir');
  await makeReady(ready.token);
  const list = await authedGet('SUPER_ADMIN', superToken, '/api/v1/super-admin/agencies?q=site');
  const byId = new Map(list.body.data.items.map((item: { id: string; websiteReadiness: string }) => [item.id, item.websiteReadiness]));
  assert.equal(byId.get(ready.agencyId), 'READY');
  assert.equal(byId.get(quiet.agencyId), 'NOT_READY');
  assert.equal((await authedGet('OWNER', ready.token, `/api/v1/super-admin/agencies/${ready.agencyId}/website`)).status, 403);
  assert.equal((await authedGet('SUPER_ADMIN', ready.token, `/api/v1/super-admin/agencies/${ready.agencyId}/website`)).status, 401);
  assert.equal((await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${new mongoose.Types.ObjectId().toString()}/website`)).status, 404);
});

test('website saves never change review, restriction or publication state', async () => {
  const owner = await newOwner('siteaxes');
  const before = await models.Agency.findById(owner.agencyId).lean();
  await makeReady(owner.token);
  const after = await models.Agency.findById(owner.agencyId).lean();
  for (const field of ['reviewStatus', 'reviewVersion', 'restrictionStatus', 'restrictionVersion', 'publicationStatus'] as const) {
    assert.deepEqual(after?.[field], before?.[field], field);
  }
});
