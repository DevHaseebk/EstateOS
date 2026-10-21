import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';

// Phase 5a contract §5 acceptance tests: properties and their publication. Synthetic data only (D-116).
const key = 'test-internal-api-key-with-at-least-thirty-two-characters';
const publicKey = 'test-public-api-key-with-at-least-thirty-two-characters-x';
const ownerOrigin = 'https://admin.estateos.localhost';
const superOrigin = 'https://control.estateos.localhost';
const password = 'Orchid!Harbor!72?Sky';
const reason = 'Synthetic reason for a Phase 5a properties test.';
type Portal = 'OWNER' | 'SUPER_ADMIN';

let mongo: MongoMemoryReplSet;
let app: Awaited<typeof import('../src/app.js')>['app'];
let models: typeof import('../src/models.js');
let validation: typeof import('../src/validation.js');
let publication: typeof import('../src/publication.js');
let superToken = '';
let ipCounter = 10;
const nextIp = () => `10.7.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`;

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
async function authed(method: 'post' | 'put' | 'delete', portal: Portal, token: string, url: string, body: object, extra: Record<string, string> = {}) {
  const ip = nextIp();
  const pre = await csrfFor(portal, ip, token);
  return supertest(app)[method](url).set({ ...base(portal, ip), origin: portal === 'OWNER' ? ownerOrigin : superOrigin, 'x-csrf-token': pre.token, 'x-session-token': token, ...extra }).send(body);
}
const authedGet = (portal: Portal, token: string, url: string) => supertest(app).get(url).set({ ...base(portal, nextIp()), 'x-session-token': token });
const publicGet = (slug: string) => supertest(app).get(`/api/v1/public/sites/${slug}`).set({ 'x-public-api-key': publicKey });
const superPost = (url: string, body: object) => authed('post', 'SUPER_ADMIN', superToken, url, body);
const site = (token: string) => authedGet('OWNER', token, '/api/v1/owner/website').then((response) => response.body.data);

const house = (overrides: Record<string, unknown> = {}) => ({
  title: '10 Marla House in DHA', intent: 'SALE', type: 'HOUSE', pricePkr: 45_000_000, city: 'Karachi', area: 'DHA Phase 6',
  size: { value: 10, unit: 'MARLA' }, bedrooms: 4, bathrooms: 3, description: 'Synthetic test listing.', ...overrides,
});
const createProperty = (token: string, body: object = house()) => authed('post', 'OWNER', token, '/api/v1/owner/properties', body);
const updateProperty = (token: string, id: string, body: object) => authed('put', 'OWNER', token, `/api/v1/owner/properties/${id}`, body);
const archive = (token: string, id: string, expectedVersion: number, action: 'archive' | 'restore' = 'archive') =>
  authed('post', 'OWNER', token, `/api/v1/owner/properties/${id}/${action}`, { expectedVersion });

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
async function makeReady(token: string) {
  const profile = (await authedGet('OWNER', token, '/api/v1/owner/profile')).body.data;
  assert.equal((await authed('put', 'OWNER', token, '/api/v1/owner/profile', {
    agencyName: profile.agencyName, ownerName: profile.ownerName, mobile: profile.mobile, whatsapp: profile.whatsapp,
    publicContact: { showMobile: false, showWhatsapp: true }, profile: { city: 'Karachi' }, expectedProfileVersion: profile.version,
  })).status, 200);
  assert.equal((await authed('put', 'OWNER', token, '/api/v1/owner/website/theme', { preset: 'MODERN_LIGHT', expectedThemeVersion: 0 })).status, 200);
  assert.equal((await authed('put', 'OWNER', token, '/api/v1/owner/website/sections/hero', { heading: 'Homes across Karachi', ctaLabel: 'Talk to us', heroImageId: 'test-licensed', expectedVersion: 0 })).status, 200);
}
const approve = (agencyId: string) => superPost(`/api/v1/super-admin/agencies/${agencyId}/review-decisions`, { decision: 'APPROVE', expectedReviewVersion: 0 });
const showProperties = (token: string, version: number) => authed('put', 'OWNER', token, '/api/v1/owner/website/layout', {
  order: ['about', 'services', 'properties', 'whyChooseUs', 'team'], visible: { about: false, services: false, whyChooseUs: false, team: false, properties: true }, expectedLayoutVersion: version,
});

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
  validation = await import('../src/validation.js');
  publication = await import('../src/publication.js');
  const security = await import('../src/security.js');
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongo.getUri());
  await Promise.all([models.Agency.init(), models.User.init(), models.AuthSession.init(), models.AuthRateLimit.init(), models.AgencyAudit.init(), models.WebsiteDraft.init(), models.PublishedRevision.init(), models.Property.init()]);
  await models.User.create({ role: 'SUPER_ADMIN', name: 'Property Operator', emailNormalized: 'listings@example.test', passwordHash: await security.hashPassword(password), bootstrapKey: 'TEST_ONLY' });
  const login = await preAuthPost('SUPER_ADMIN', '/api/v1/super-admin/sessions', { email: 'listings@example.test', password });
  assert.equal(login.status, 200);
  superToken = login.body.internal.sessionToken;
});
after(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); });

test('unit: property schema limits and the status/intent rule', () => {
  const create = (overrides: Record<string, unknown>) => validation.createPropertySchema.safeParse(house(overrides)).success;
  assert.equal(create({}), true);
  assert.equal(create({ size: null, bedrooms: null, bathrooms: null, description: '' }), true);
  assert.equal(create({ title: 'ab' }), false);
  assert.equal(create({ title: 'x'.repeat(100) }), true);
  assert.equal(create({ title: 'x'.repeat(101) }), false);
  assert.equal(create({ pricePkr: 0 }), false);
  assert.equal(create({ pricePkr: 1 }), true);
  assert.equal(create({ pricePkr: 10_000_000_000 }), true);
  assert.equal(create({ pricePkr: 10_000_000_001 }), false);
  assert.equal(create({ pricePkr: 1500.5 }), false);
  assert.equal(create({ type: 'CASTLE' }), false);
  assert.equal(create({ intent: 'LEASE' }), false);
  assert.equal(create({ city: 'K' }), false);
  assert.equal(create({ area: 'x'.repeat(81) }), false);
  assert.equal(create({ size: { value: 0, unit: 'MARLA' } }), false);
  assert.equal(create({ size: { value: 10.25, unit: 'MARLA' } }), true);
  assert.equal(create({ size: { value: 10.255, unit: 'MARLA' } }), false);
  assert.equal(create({ size: { value: 1_000_001, unit: 'SQ_FT' } }), false);
  assert.equal(create({ size: { value: 10, unit: 'ACRE' } }), false);
  assert.equal(create({ bedrooms: 21 }), false);
  assert.equal(create({ bathrooms: 2.5 }), false);
  assert.equal(create({ description: 'x'.repeat(2001) }), false);
  assert.equal(create({ availability: 'AVAILABLE' }), false);
  const update = (overrides: Record<string, unknown>) => validation.updatePropertySchema.safeParse({ ...house(), availability: 'AVAILABLE', expectedVersion: 0, ...overrides }).success;
  assert.equal(update({ availability: 'SOLD' }), true);
  assert.equal(update({ availability: 'RENTED' }), false);
  assert.equal(update({ intent: 'RENT', availability: 'RENTED' }), true);
  assert.equal(update({ intent: 'RENT', availability: 'SOLD' }), false);
});

test('unit: price/facts formatting and the fingerprint follows eligible property content', async () => {
  const template = await import('site-template');
  assert.equal(template.formatPrice(25_000_000, 'SALE'), 'PKR 25,000,000');
  assert.equal(template.formatPrice(85_000, 'RENT'), 'PKR 85,000 / month');
  assert.equal(template.propertyFacts({ size: { value: 10, unit: 'MARLA' }, bedrooms: 1, bathrooms: 2 }), '10 marla · 1 bed · 2 baths');
  assert.equal(template.propertyFacts({}), '');
  const site = { theme: { preset: 'MODERN_LIGHT' }, properties: [{ key: 'a', title: 'One', pricePkr: 1 }] };
  assert.equal(publication.contentFingerprint(site), publication.contentFingerprint({ ...site }));
  assert.notEqual(publication.contentFingerprint(site), publication.contentFingerprint({ ...site, properties: [{ key: 'a', title: 'One', pricePkr: 2 }] }));
});

test('create (Available by default), read, whole-form update with versions, conflicts and parallel saves', async () => {
  const owner = await newOwner('propcrud');
  const created = await createProperty(owner.token);
  assert.equal(created.status, 201, JSON.stringify(created.body));
  const property = created.body.data.property;
  assert.equal(property.availability, 'AVAILABLE');
  assert.equal(property.version, 0);
  assert.equal(property.archived, false);
  const read = await authedGet('OWNER', owner.token, `/api/v1/owner/properties/${property.id}`);
  assert.deepEqual(read.body.data.property, property);
  const updated = await updateProperty(owner.token, property.id, { ...house({ title: 'Updated synthetic house', size: null, description: '' }), availability: 'SOLD', expectedVersion: 0 });
  assert.equal(updated.status, 200, JSON.stringify(updated.body));
  assert.equal(updated.body.data.property.title, 'Updated synthetic house');
  assert.equal(updated.body.data.property.availability, 'SOLD');
  assert.equal(updated.body.data.property.size, undefined);
  assert.equal(updated.body.data.property.description, undefined);
  assert.equal(updated.body.data.property.version, 1);
  const stale = await updateProperty(owner.token, property.id, { ...house(), availability: 'AVAILABLE', expectedVersion: 0 });
  assert.equal(stale.status, 409);
  assert.equal(stale.body.error.code, 'PROPERTY_CONFLICT');
  const parallel = await Promise.all([1, 2].map((n) => updateProperty(owner.token, property.id, { ...house({ title: `Parallel ${n} title` }), availability: 'AVAILABLE', expectedVersion: 1 })));
  assert.deepEqual(parallel.map((response) => response.status).sort(), [200, 409]);
  const list = await authedGet('OWNER', owner.token, '/api/v1/owner/properties');
  assert.equal(list.body.data.items.length, 1);
  assert.deepEqual(list.body.data.counts, { active: 1, archived: 0 });
});

test('status must fit the listing: Sold only for Sale, Rented only for Rent', async () => {
  const owner = await newOwner('propstatus');
  const rent = (await createProperty(owner.token, house({ title: 'Synthetic flat for rent', intent: 'RENT', type: 'APARTMENT', pricePkr: 85_000 }))).body.data.property;
  const sold = await updateProperty(owner.token, rent.id, { ...house({ intent: 'RENT' }), availability: 'SOLD', expectedVersion: 0 });
  assert.equal(sold.status, 422);
  assert.ok(sold.body.error.details.availability);
  assert.equal((await updateProperty(owner.token, rent.id, { ...house({ intent: 'RENT' }), availability: 'RENTED', expectedVersion: 0 })).status, 200);
  const switchIntent = await updateProperty(owner.token, rent.id, { ...house({ intent: 'SALE' }), availability: 'RENTED', expectedVersion: 1 });
  assert.equal(switchIntent.status, 422);
});

test('archive and restore: versions, wrong state, active list, limit, and no delete', async () => {
  const owner = await newOwner('proparchive');
  const property = (await createProperty(owner.token)).body.data.property;
  const archived = await archive(owner.token, property.id, 0);
  assert.equal(archived.status, 200);
  assert.equal(archived.body.data.property.archived, true);
  const again = await archive(owner.token, property.id, 1);
  assert.equal(again.status, 409);
  assert.equal(again.body.error.code, 'INVALID_TRANSITION');
  assert.equal((await archive(owner.token, property.id, 0, 'restore')).body.error.code, 'PROPERTY_CONFLICT');
  assert.deepEqual((await authedGet('OWNER', owner.token, '/api/v1/owner/properties')).body.data.counts, { active: 0, archived: 1 });
  assert.equal((await authedGet('OWNER', owner.token, '/api/v1/owner/properties?archived=true')).body.data.items.length, 1);
  assert.equal((await authed('delete', 'OWNER', owner.token, `/api/v1/owner/properties/${property.id}`, {})).status, 404);
  await models.Property.insertMany(Array.from({ length: 200 }, (_, i) => ({ ...house({ title: `Bulk synthetic ${i}` }), agencyId: owner.agencyId })));
  const limit = await createProperty(owner.token);
  assert.equal(limit.status, 422);
  assert.equal(limit.body.error.code, 'PROPERTY_LIMIT');
  assert.equal((await archive(owner.token, property.id, 1, 'restore')).body.error.code, 'PROPERTY_LIMIT');
  assert.equal(await models.Property.countDocuments({ agencyId: owner.agencyId }), 201);
});

test('tenant isolation: another agency\'s property is 404; injected agencyId is 422', async () => {
  const a = await newOwner('propa');
  const b = await newOwner('propb');
  const bProperty = (await createProperty(b.token)).body.data.property;
  assert.equal((await authedGet('OWNER', a.token, `/api/v1/owner/properties/${bProperty.id}`)).status, 404);
  assert.equal((await updateProperty(a.token, bProperty.id, { ...house(), availability: 'AVAILABLE', expectedVersion: 0 })).status, 404);
  assert.equal((await archive(a.token, bProperty.id, 0)).status, 404);
  assert.equal((await archive(a.token, bProperty.id, 0, 'restore')).status, 404);
  assert.equal((await authedGet('OWNER', a.token, '/api/v1/owner/properties/not-an-id')).status, 404);
  assert.equal((await createProperty(a.token, { ...house(), agencyId: b.agencyId })).status, 422);
  assert.equal((await authed('post', 'OWNER', a.token, '/api/v1/owner/properties', house(), { 'x-agency-id': b.agencyId })).status, 422);
  assert.equal((await authedGet('OWNER', a.token, `/api/v1/owner/properties?agencyId=${b.agencyId}`)).status, 422);
  assert.equal((await authedGet('OWNER', a.token, '/api/v1/owner/properties')).body.data.items.length, 0);
  assert.equal((await models.Property.findById(bProperty.id).lean())?.version, 0);
});

test('permissions: Pending can manage; Rejected and Deactivated read-only; Blocked signed out', async () => {
  const pending = await newOwner('proppending');
  assert.equal((await createProperty(pending.token)).status, 201);
  const rejected = await newOwner('proprejected');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${rejected.agencyId}/review-decisions`, { decision: 'REJECT', reason, expectedReviewVersion: 0 })).status, 200);
  assert.equal((await createProperty(rejected.token)).body.error.code, 'PROPERTIES_READ_ONLY');
  assert.equal((await authedGet('OWNER', rejected.token, '/api/v1/owner/properties')).status, 200);
  const deactivated = await newOwner('propdeactivated');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${deactivated.agencyId}/restrictions`, { action: 'DEACTIVATE', reason, expectedRestrictionVersion: 0 })).status, 200);
  assert.equal((await createProperty(deactivated.token)).body.error.code, 'AGENCY_DEACTIVATED');
  const blocked = await newOwner('propblocked');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${blocked.agencyId}/restrictions`, { action: 'BLOCK', reason, expectedRestrictionVersion: 0 })).status, 200);
  assert.equal((await authedGet('OWNER', blocked.token, '/api/v1/owner/properties')).status, 401);
});

test('first Live includes only eligible properties; zero properties still go Live', async () => {
  const owner = await newOwner('propfirstlive');
  const available = (await createProperty(owner.token, house({ title: 'Available synthetic house' }))).body.data.property;
  const sold = (await createProperty(owner.token, house({ title: 'Sold synthetic house' }))).body.data.property;
  assert.equal((await updateProperty(owner.token, sold.id, { ...house({ title: 'Sold synthetic house' }), availability: 'SOLD', expectedVersion: 0 })).status, 200);
  const archivedOne = (await createProperty(owner.token, house({ title: 'Archived synthetic house' }))).body.data.property;
  assert.equal((await archive(owner.token, archivedOne.id, 0)).status, 200);
  await makeReady(owner.token);
  assert.equal((await approve(owner.agencyId)).status, 200);
  const live = await publicGet(owner.slug);
  assert.equal(live.status, 200);
  assert.deepEqual(live.body.data.site.properties.map((property: { title: string }) => property.title), ['Available synthetic house']);
  assert.equal(live.body.data.site.properties[0].key, available.id);
  assert.equal(live.body.data.site.properties[0].availability, undefined);
  assert.equal(live.body.data.site.properties[0].version, undefined);

  const empty = await newOwner('propzero');
  await makeReady(empty.token);
  assert.equal((await approve(empty.agencyId)).status, 200);
  assert.deepEqual((await publicGet(empty.slug)).body.data.site.properties, []);
});

test('on a Live site, property changes are unpublished until Publish updates', async () => {
  const owner = await newOwner('proplive');
  await makeReady(owner.token);
  assert.equal((await approve(owner.agencyId)).status, 200);
  assert.equal((await site(owner.token)).publication.unpublishedChanges, false);
  const property = (await createProperty(owner.token, house({ title: 'New synthetic listing' }))).body.data.property;
  let data = await site(owner.token);
  assert.equal(data.publication.unpublishedChanges, true);
  assert.equal(data.properties.length, 1);
  assert.deepEqual((await publicGet(owner.slug)).body.data.site.properties, []);
  assert.equal((await authed('post', 'OWNER', owner.token, '/api/v1/owner/website/publish', { expectedLiveRevision: 1, requestId: randomUUID() })).status, 200);
  assert.deepEqual((await publicGet(owner.slug)).body.data.site.properties.map((p: { title: string }) => p.title), ['New synthetic listing']);
  assert.equal((await updateProperty(owner.token, property.id, { ...house({ title: 'New synthetic listing' }), availability: 'SOLD', expectedVersion: 0 })).status, 200);
  data = await site(owner.token);
  assert.equal(data.publication.unpublishedChanges, true);
  assert.equal((await publicGet(owner.slug)).body.data.site.properties.length, 1);
  assert.equal((await authed('post', 'OWNER', owner.token, '/api/v1/owner/website/publish', { expectedLiveRevision: 2, requestId: randomUUID() })).status, 200);
  assert.deepEqual((await publicGet(owner.slug)).body.data.site.properties, []);
});

test('layout: Properties can be shown only with an eligible property; section settings save with versions', async () => {
  const owner = await newOwner('proplayout');
  const refused = await showProperties(owner.token, 0);
  assert.equal(refused.status, 422);
  assert.ok(refused.body.error.details['visible.properties']);
  const property = (await createProperty(owner.token)).body.data.property;
  assert.equal((await showProperties(owner.token, 0)).status, 200);
  const settings = await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/properties', { heading: 'Homes we are selling', displayCount: 3, expectedVersion: 0 });
  assert.equal(settings.status, 200, JSON.stringify(settings.body));
  assert.deepEqual(settings.body.data.section, { heading: 'Homes we are selling', displayCount: 3, version: 1 });
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/properties', { heading: 'Homes', displayCount: 4, expectedVersion: 1 })).status, 422);
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/properties', { heading: 'Homes', displayCount: 6, expectedVersion: 0 })).body.error.code, 'SECTION_CONFLICT');
  const data = await site(owner.token);
  assert.equal(data.layout.visible.properties, true);
  assert.equal(data.properties[0].key, property.id);
});

test('Super Admin read-only property list; owner sessions are rejected on it', async () => {
  const owner = await newOwner('propadmin');
  const property = (await createProperty(owner.token)).body.data.property;
  assert.equal((await archive(owner.token, property.id, 0)).status, 200);
  await createProperty(owner.token, house({ title: 'Second synthetic listing' }));
  const list = await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${owner.agencyId}/properties`);
  assert.equal(list.status, 200);
  assert.equal(list.body.data.items.length, 2);
  assert.equal(list.body.data.items.filter((item: { archived: boolean }) => item.archived).length, 1);
  assert.equal((await authedGet('OWNER', owner.token, `/api/v1/super-admin/agencies/${owner.agencyId}/properties`)).status, 403);
  assert.equal((await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/agencies/${new mongoose.Types.ObjectId().toString()}/properties`)).status, 404);
});
