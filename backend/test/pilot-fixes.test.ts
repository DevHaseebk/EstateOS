import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { randomUUID } from 'node:crypto';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import sharp from 'sharp';
import supertest from 'supertest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Phase 6b contract §4 acceptance tests: pilot fixes (image cache, shown-only properties, account login limit, truthful wording).
// Synthetic agencies, people and images only (D-116).
const key = 'test-internal-api-key-with-at-least-thirty-two-characters';
const publicKey = 'test-public-api-key-with-at-least-thirty-two-characters-x';
const ownerOrigin = 'https://admin.estateos.localhost';
const superOrigin = 'https://control.estateos.localhost';
const password = 'Orchid!Harbor!72?Sky';
type Portal = 'OWNER' | 'SUPER_ADMIN';

let mongo: MongoMemoryReplSet;
let mediaDir: string;
let app: Awaited<typeof import('../src/app.js')>['app'];
let models: typeof import('../src/models.js');
let media: typeof import('../src/media.js');
let superToken = '';
let ipCounter = 10;
const nextIp = () => `10.6.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`;

/** A synthetic photo: solid colour, given size and format, optionally carrying GPS EXIF. */
async function image(width: number, height: number, format: 'jpeg' | 'png' | 'webp' = 'jpeg', withGps = false) {
  let pipeline = sharp({ create: { width, height, channels: 3, background: { r: 40, g: 110, b: 90 } } });
  if (withGps) pipeline = pipeline.withExif({ IFD0: { Make: 'SyntheticCam', Model: 'Test 1' }, IFD3: { GPSLatitudeRef: 'N', GPSLatitude: '24/1 51/1 0/1', GPSLongitudeRef: 'E', GPSLongitude: '67/1 0/1 0/1' } });
  return pipeline.toFormat(format).toBuffer();
}

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
const authedGet = (portal: Portal, token: string, url: string) => supertest(app).get(url).set({ ...base(portal, nextIp()), 'x-session-token': token }).buffer(true)
  .parse((response, callback) => { const chunks: Buffer[] = []; response.on('data', (chunk: Buffer) => chunks.push(chunk)); response.on('end', () => callback(null, Buffer.concat(chunks))); });
const json = (token: string, url: string) => supertest(app).get(url).set({ ...base('OWNER', nextIp()), 'x-session-token': token });
const publicMedia = (mediaId: string, width = 960) => supertest(app).get(`/api/v1/public/media/${mediaId}/${width}`).set({ 'x-public-api-key': publicKey });
async function upload(token: string, purpose: string, body: Buffer, contentType = 'image/jpeg', extra: Record<string, string> = {}) {
  const ip = nextIp();
  const pre = await csrfFor('OWNER', ip, token);
  return supertest(app).post(`/api/v1/owner/media?purpose=${purpose}`)
    .set({ ...base('OWNER', ip), origin: ownerOrigin, 'x-csrf-token': pre.token, 'x-session-token': token, 'content-type': contentType, ...extra }).send(body);
}
const superPost = (url: string, body: object) => authed('post', 'SUPER_ADMIN', superToken, url, body);

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
async function publicNumber(token: string) {
  const profile = (await json(token, '/api/v1/owner/profile')).body.data;
  assert.equal((await authed('put', 'OWNER', token, '/api/v1/owner/profile', {
    agencyName: profile.agencyName, ownerName: profile.ownerName, mobile: profile.mobile, whatsapp: profile.whatsapp,
    publicContact: { showMobile: false, showWhatsapp: true }, profile: {}, expectedProfileVersion: profile.version,
  })).status, 200);
}
const house = (photos: string[] = [], coverMediaId?: string, title = 'Synthetic house with photos') => ({
  title, intent: 'SALE', type: 'HOUSE', pricePkr: 30_000_000, city: 'Karachi', area: 'DHA', photos, ...(coverMediaId ? { coverMediaId } : {}),
});

before(async () => {
  mediaDir = await mkdtemp(path.join(os.tmpdir(), 'estateos-media-test-'));
  process.env.MEDIA_DIR = mediaDir;
  process.env.INTERNAL_API_KEY = key;
  process.env.PUBLIC_API_KEY = publicKey;
  process.env.PUBLIC_SITE_DOMAIN = 'sites.example.test';
  process.env.CSRF_SIGNING_KEY = 'test-csrf-signing-key-with-at-least-thirty-two-characters';
  process.env.OWNER_ORIGIN = ownerOrigin;
  process.env.SUPER_ADMIN_ORIGIN = superOrigin;
  process.env.HERO_DEFAULTS_PATH = path.resolve(process.cwd(), 'test/fixtures/hero-defaults.test.json');
  app = (await import('../src/app.js')).app;
  models = await import('../src/models.js');
  media = await import('../src/media.js');
  const security = await import('../src/security.js');
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongo.getUri());
  await Promise.all([models.Agency.init(), models.User.init(), models.AuthSession.init(), models.AuthRateLimit.init(), models.AgencyAudit.init(),
    models.WebsiteDraft.init(), models.PublishedRevision.init(), models.Property.init(), models.Media.init()]);
  await models.User.create({ role: 'SUPER_ADMIN', name: 'Media Operator', emailNormalized: 'media@example.test', passwordHash: await security.hashPassword(password), bootstrapKey: 'TEST_ONLY' });
  const login = await preAuthPost('SUPER_ADMIN', '/api/v1/super-admin/sessions', { email: 'media@example.test', password });
  assert.equal(login.status, 200);
  superToken = login.body.internal.sessionToken;
});
after(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); await rm(mediaDir, { recursive: true, force: true }); });

const layout = (token: string, properties: boolean, expectedLayoutVersion: number) => authed('put', 'OWNER', token, '/api/v1/owner/website/layout', {
  order: ['about', 'services', 'properties', 'whyChooseUs', 'team'], visible: { about: false, services: false, whyChooseUs: false, team: false, properties }, expectedLayoutVersion,
});
const ownerLogin = (email: string, secret: string, ip = nextIp()) => csrfFor('OWNER', ip).then((pre) => supertest(app).post('/api/v1/owner/sessions')
  .set({ ...base('OWNER', ip), origin: ownerOrigin, 'x-csrf-token': pre.token, 'x-preauth-nonce': pre.nonce! }).send({ email, password: secret }));

async function liveOwner(label: string) {
  const owner = await newOwner(label);
  await publicNumber(owner.token);
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/theme', { preset: 'MODERN_LIGHT', expectedThemeVersion: 0 })).status, 200);
  const hero = (await upload(owner.token, 'HERO', await image(1300, 700))).body.data.media.id as string;
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', { heading: 'Homes', ctaLabel: 'Talk to us', heroUploadId: hero, expectedVersion: 0 })).status, 200);
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${owner.agencyId}/review-decisions`, { decision: 'APPROVE', expectedReviewVersion: 0 })).status, 200);
  return { ...owner, hero };
}

test('public images are cached for 5 minutes only; owner and Super Admin images stay private', async () => {
  const owner = await liveOwner('fixcache');
  const live = await publicMedia(owner.hero);
  assert.equal(live.status, 200);
  assert.equal(live.headers['cache-control'], 'public, max-age=300');
  assert.equal((await authedGet('OWNER', owner.token, `/api/v1/owner/media/${owner.hero}/960`)).headers['cache-control'], 'private, max-age=3600');
  assert.equal((await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/media/${owner.hero}/960`)).headers['cache-control'], 'private, max-age=3600');
});

test('a revision holds only the shown properties (newest displayCount) and only their photos become public', async () => {
  const owner = await liveOwner('fixprops');
  const photos: string[] = [];
  const titles: string[] = [];
  for (let i = 1; i <= 8; i += 1) {
    const photo = (await upload(owner.token, 'PROPERTY', await image(400 + i, 300))).body.data.media.id as string;
    photos.push(photo);
    titles.push(`Synthetic listing ${i}`);
    assert.equal((await authed('post', 'OWNER', owner.token, '/api/v1/owner/properties', house([photo], undefined, titles[i - 1]))).status, 201);
  }
  assert.equal((await layout(owner.token, true, 0)).status, 200);
  assert.equal((await authed('post', 'OWNER', owner.token, '/api/v1/owner/website/publish', { expectedLiveRevision: 1, requestId: randomUUID() })).status, 200);
  const site = (await supertest(app).get(`/api/v1/public/sites/${owner.slug}`).set({ 'x-public-api-key': publicKey })).body.data.site;
  assert.deepEqual(site.properties.map((property: { title: string }) => property.title), titles.slice(2).reverse(), 'newest 6 (displayCount default)');
  for (const photo of photos.slice(2)) assert.equal((await publicMedia(photo)).status, 200);
  for (const photo of photos.slice(0, 2)) assert.equal((await publicMedia(photo)).status, 404, 'not shown, so not public');

  assert.equal((await layout(owner.token, false, 1)).status, 200);
  assert.equal((await authed('post', 'OWNER', owner.token, '/api/v1/owner/website/publish', { expectedLiveRevision: 2, requestId: randomUUID() })).status, 200);
  const hidden = (await supertest(app).get(`/api/v1/public/sites/${owner.slug}`).set({ 'x-public-api-key': publicKey })).body.data.site;
  assert.deepEqual(hidden.properties, []);
  for (const photo of photos) assert.equal((await publicMedia(photo)).status, 404, 'Properties section hidden');
});

test('30 failed sign-ins for one account across many IP addresses lock that account for the window only', async () => {
  const target = await newOwner('fixlogin');
  const other = await newOwner('fixloginother');
  for (let i = 0; i < 30; i += 1) assert.equal((await ownerLogin(target.email, `Wrong!Password!${i}x`)).status, 401);
  const locked = await ownerLogin(target.email, password);
  assert.deepEqual([locked.status, locked.body.error.code], [429, 'RATE_LIMITED'], 'the right password from a new IP is still throttled');
  assert.equal((await ownerLogin(other.email, password)).status, 200, 'another account is not affected');
  await models.AuthRateLimit.deleteMany({}); // stands in for the 15-minute window ending
  assert.equal((await ownerLogin(target.email, password)).status, 200);
});

test('the upload error names all five purposes', async () => {
  const owner = await newOwner('fixpurpose');
  const refused = await upload(owner.token, 'BANNER', await image(400, 300));
  assert.equal(refused.status, 422);
  assert.equal(refused.body.error.message, 'Choose what the image is for: Hero, logo, property, About or team photo.');
});

test('screens: the Overview action, the approved review text and the Approve/Restore dialogs state the real behaviour', async () => {
  (globalThis as { React?: typeof React }).React = React;
  const { overviewAction, approvedText, approvedWebsiteState } = await import('../../admin/app/lib/website.ts');
  const { DecisionDialog } = await import('../../super-admin/app/components/DecisionDialog.tsx');
  const contact = { showMobile: false, showWhatsapp: true };
  const website = (publication: object | undefined, ready = true) => ({ readiness: { ready, issues: ready ? [] : [{ key: 'HERO_IMAGE', message: 'x' }] }, publication }) as never;
  const action = (overrides: Partial<Parameters<typeof overviewAction>[0]>) => overviewAction({ profile: { publicContact: contact, canEdit: true }, website: website(undefined), reviewStatus: 'PENDING', ...overrides });
  assert.equal(action({ profile: null }), null);
  assert.equal(action({ restrictionStatus: 'DEACTIVATED' })?.label, 'View agency details');
  assert.equal(action({ reviewStatus: 'CHANGES_REQUESTED' })?.label, 'Complete your agency details');
  assert.equal(action({ profile: { publicContact: { showMobile: false, showWhatsapp: false }, canEdit: true } })?.label, 'Choose a public number');
  assert.deepEqual(action({ website: website(undefined, false) }), { label: 'Finish your website', href: '/website/editor?section=hero' });
  assert.deepEqual(action({ website: website({ status: 'LIVE', url: 'https://x.sites.example.test', unpublishedChanges: true }) }), { label: 'Review and publish updates', href: '/website' });
  assert.deepEqual(action({ website: website({ status: 'LIVE', url: 'https://x.sites.example.test', unpublishedChanges: false }) }), { label: 'Open your website', href: 'https://x.sites.example.test', external: true });
  assert.equal(action({})?.label, 'Preview your website');
  assert.equal(approvedText(approvedWebsiteState(website({ status: 'LIVE' }))), 'Your agency is approved. Your website is live.');
  assert.equal(approvedText(approvedWebsiteState(website(undefined, false))), 'Your agency is approved. Your website goes live as soon as the essentials are finished.');
  assert.equal(approvedText(approvedWebsiteState(website(undefined, true))), 'Your agency is approved. Your website is going live now.');
  const dialog = (kind: 'APPROVE' | 'RESTORE', websiteReady: boolean) => renderToStaticMarkup(React.createElement(DecisionDialog, { kind, agencyName: 'Synthetic Realty', websiteReady, onCancel: () => undefined, onConfirm: async () => undefined }));
  assert.match(dialog('APPROVE', true), /The website is ready, so it goes live as soon as you approve\./);
  assert.match(dialog('APPROVE', false), /goes live automatically once the owner finishes the website essentials/);
  assert.doesNotMatch(dialog('APPROVE', false), /does not publish/);
  assert.match(dialog('RESTORE', false), /If the agency is approved and its website is ready, the website becomes public again\./);
});
