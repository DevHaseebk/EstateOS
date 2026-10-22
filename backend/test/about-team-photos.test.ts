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

// Phase 3e contract §4 acceptance tests: About and Team photos on the 3d pipeline. Synthetic images and people only (D-116).
const key = 'test-internal-api-key-with-at-least-thirty-two-characters';
const publicKey = 'test-public-api-key-with-at-least-thirty-two-characters-x';
const ownerOrigin = 'https://admin.estateos.localhost';
const superOrigin = 'https://control.estateos.localhost';
const password = 'Orchid!Harbor!72?Sky';
const reason = 'Synthetic reason for a Phase 3e photo test.';
type Portal = 'OWNER' | 'SUPER_ADMIN';

let mongo: MongoMemoryReplSet;
let mediaDir: string;
let app: Awaited<typeof import('../src/app.js')>['app'];
let models: typeof import('../src/models.js');
let media: typeof import('../src/media.js');
let validation: typeof import('../src/validation.js');
let superToken = '';
let ipCounter = 10;
const nextIp = () => `10.8.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`;

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
  validation = await import('../src/validation.js');
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

const story = 'A synthetic agency story that is long enough to be shown on the website.';
const member = (name: string, extra: object = {}) => ({ name, role: 'Agent', ...extra });
const putSection = (token: string, key: string, body: object) => authed('put', 'OWNER', token, `/api/v1/owner/website/sections/${key}`, body);
const putLayout = (token: string, visible: Record<string, boolean>, expectedLayoutVersion: number) => authed('put', 'OWNER', token, '/api/v1/owner/website/layout', {
  order: ['about', 'services', 'properties', 'whyChooseUs', 'team'], visible: { about: false, services: false, whyChooseUs: false, team: false, properties: false, ...visible }, expectedLayoutVersion,
});
async function uploaded(token: string, purpose: string, width: number, height: number) {
  const response = await upload(token, purpose, await image(width, height));
  assert.equal(response.status, 201, JSON.stringify(response.body));
  return response.body.data.media.id as string;
}

test('unit: minimum sizes for ABOUT and TEAM', async () => {
  await assert.rejects(media.processImage(await image(799, 500), 'ABOUT'), { code: 'TOO_SMALL' });
  await assert.rejects(media.processImage(await image(800, 499), 'ABOUT'), { code: 'TOO_SMALL' });
  assert.equal((await media.processImage(await image(800, 500), 'ABOUT')).width, 800);
  await assert.rejects(media.processImage(await image(299, 300), 'TEAM'), { code: 'TOO_SMALL' });
  await assert.rejects(media.processImage(await image(300, 299), 'TEAM'), { code: 'TOO_SMALL' });
  const square = await media.processImage(await image(300, 300), 'TEAM');
  assert.deepEqual(square.variants.map((variant) => variant.width), [300], 'never upscaled');
});

test('unit: a team photo needs the consent tick', () => {
  const team = validation.sectionSchemas.team;
  const photo = 'a'.repeat(32);
  const parse = (extra: object) => team.safeParse({ heading: 'Our team', members: [member('Sara Example', extra)], expectedVersion: 0 }).success;
  assert.equal(parse({ photoMediaId: photo }), false);
  assert.equal(parse({ photoMediaId: photo, photoConsent: false }), false);
  assert.equal(parse({ photoMediaId: photo, photoConsent: true }), true);
  assert.equal(parse({ photoMediaId: 'not-a-media-id', photoConsent: true }), false);
  assert.equal(parse({ photoMediaId: null }), true);
});

test('About photo: upload, save attaches it; wrong purpose refused; removing only unlinks', async () => {
  const owner = await newOwner('aboutphoto');
  const photo = await uploaded(owner.token, 'ABOUT', 1000, 600);
  const teamPhoto = await uploaded(owner.token, 'TEAM', 400, 400);
  const wrong = await putSection(owner.token, 'about', { heading: 'About us', story, photoMediaId: teamPhoto, expectedVersion: 0 });
  assert.equal(wrong.status, 422);
  assert.ok(wrong.body.error.details.photoMediaId);
  const saved = await putSection(owner.token, 'about', { heading: 'About us', story, photoMediaId: photo, expectedVersion: 0 });
  assert.equal(saved.status, 200, JSON.stringify(saved.body));
  assert.deepEqual(saved.body.data.section, { heading: 'About us', story, photoMediaId: photo, version: 1 });
  assert.equal((await models.Media.findOne({ mediaId: photo }).lean())?.status, 'ATTACHED');
  const removed = await putSection(owner.token, 'about', { heading: 'About us', story, photoMediaId: null, expectedVersion: 1 });
  assert.deepEqual(removed.body.data.section, { heading: 'About us', story, version: 2 }, 'without a photo the section reads as in 3c');
  assert.equal(await models.Media.countDocuments({ mediaId: photo }), 1, 'the media is kept');
});

test('Team photo: consent required; attached with consent; wrong purpose and foreign media refused', async () => {
  const owner = await newOwner('teamphoto');
  const other = await newOwner('teamphotoother');
  const photo = await uploaded(owner.token, 'TEAM', 500, 500);
  const noConsent = await putSection(owner.token, 'team', { heading: 'Our team', members: [member('Sara Example', { photoMediaId: photo })], expectedVersion: 0 });
  assert.equal(noConsent.status, 422);
  assert.ok(noConsent.body.error.details['members.0.photoConsent']);
  assert.equal((await models.Media.findOne({ mediaId: photo }).lean())?.status, 'STAGED', 'a refused save attaches nothing');
  const property = await uploaded(owner.token, 'PROPERTY', 600, 400);
  const wrong = await putSection(owner.token, 'team', { heading: 'Our team', members: [member('Ali Example'), member('Sara Example', { photoMediaId: property, photoConsent: true })], expectedVersion: 0 });
  assert.equal(wrong.status, 422);
  assert.ok(wrong.body.error.details['members.1.photoMediaId']);
  const foreign = await uploaded(other.token, 'TEAM', 300, 300);
  const foreignSave = await putSection(owner.token, 'team', { heading: 'Our team', members: [member('Sara Example', { photoMediaId: foreign, photoConsent: true })], expectedVersion: 0 });
  assert.equal(foreignSave.status, 422, 'another agency\'s photo');
  const saved = await putSection(owner.token, 'team', { heading: 'Our team', members: [member('Sara Example', { photoMediaId: photo, photoConsent: true }), member('Ali Example', { photoConsent: true })], expectedVersion: 0 });
  assert.equal(saved.status, 200, JSON.stringify(saved.body));
  assert.deepEqual(saved.body.data.section.members, [
    { name: 'Sara Example', role: 'Agent', photoMediaId: photo, photoConsent: true },
    { name: 'Ali Example', role: 'Agent' },
  ], 'a consent tick without a photo is not stored');
  assert.equal((await models.Media.findOne({ mediaId: photo }).lean())?.status, 'ATTACHED');
  assert.equal((await models.Media.findOne({ mediaId: foreign }).lean())?.status, 'STAGED');
});

test('Live site: About and Team photos go public only after Publish, only while shown, and not while blocked; readiness unchanged', async () => {
  const owner = await newOwner('photolive');
  await publicNumber(owner.token);
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/theme', { preset: 'CONTEMPORARY_DARK', expectedThemeVersion: 0 })).status, 200);
  const about = await uploaded(owner.token, 'ABOUT', 900, 600);
  const savedAbout = await putSection(owner.token, 'about', { heading: 'About us', story, photoMediaId: about, expectedVersion: 0 });
  assert.deepEqual(savedAbout.body.data.readiness.issues.map((issue: { key: string }) => issue.key), ['HERO_HEADING', 'HERO_IMAGE'], 'an About photo is not a Hero photo');
  const hero = await uploaded(owner.token, 'HERO', 1400, 800);
  assert.equal((await putSection(owner.token, 'hero', { heading: 'Homes', ctaLabel: 'Talk to us', heroUploadId: hero, expectedVersion: 0 })).status, 200);
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${owner.agencyId}/review-decisions`, { decision: 'APPROVE', expectedReviewVersion: 0 })).status, 200);
  assert.equal((await models.Agency.findById(owner.agencyId).lean())?.publicationStatus, 'LIVE');
  assert.equal((await publicMedia(about)).status, 404, 'the About section was hidden at First Live');
  const team = await uploaded(owner.token, 'TEAM', 400, 400);
  assert.equal((await putSection(owner.token, 'team', { heading: 'Our team', members: [member('Sara Example', { photoMediaId: team, photoConsent: true })], expectedVersion: 0 })).status, 200);
  assert.equal((await putLayout(owner.token, { about: true, team: true }, 0)).status, 200);
  assert.equal((await publicMedia(about)).status, 404, 'saved but not published');
  assert.equal((await publicMedia(team, 480)).status, 404, 'saved but not published');
  assert.equal((await authed('post', 'OWNER', owner.token, '/api/v1/owner/website/publish', { expectedLiveRevision: 1, requestId: randomUUID() })).status, 200);
  assert.equal((await publicMedia(about)).status, 200);
  const teamImage = await publicMedia(team, 480);
  assert.equal(teamImage.status, 200);
  assert.equal(teamImage.headers['content-type'], 'image/webp');
  const site = (await supertest(app).get(`/api/v1/public/sites/${owner.slug}`).set({ 'x-public-api-key': publicKey })).body.data.site;
  assert.equal(site.sections.about.photoMediaId, about);
  assert.equal(site.sections.team.members[0].photoMediaId, team);
  assert.equal((await putLayout(owner.token, { about: true, team: false }, 1)).status, 200);
  assert.equal((await authed('post', 'OWNER', owner.token, '/api/v1/owner/website/publish', { expectedLiveRevision: 2, requestId: randomUUID() })).status, 200);
  assert.equal((await publicMedia(team, 480)).status, 404, 'a hidden section keeps its photo private');
  assert.equal((await publicMedia(about)).status, 200);
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${owner.agencyId}/restrictions`, { action: 'BLOCK', reason, expectedRestrictionVersion: 0 })).status, 200);
  assert.equal((await publicMedia(about)).status, 404, 'blocked');
});

test('template: About and Team photos render in all 3 themes; without photos the 3c output is unchanged', async () => {
  // tsx applies this package's tsconfig only to backend files, so site-template's JSX compiles in classic mode here.
  (globalThis as { React?: typeof React }).React = React;
  const { SiteTemplate, siteModelFromWebsite, THEME_PRESETS } = await import('site-template');
  const aboutId = 'a'.repeat(32);
  const teamId = 'b'.repeat(32);
  const site = (withPhotos: boolean) => ({
    theme: { preset: 'MODERN_LIGHT' as const, version: 1 },
    sections: {
      header: { contactButtonLabel: 'Contact us', preferredContact: null, version: 0 },
      hero: { heading: 'Homes across Karachi', ctaLabel: 'Talk to us', heroImageId: 'test-licensed', version: 1 },
      contact: { heading: 'Get in touch', version: 0 },
      about: { heading: 'About us', story, ...(withPhotos ? { photoMediaId: aboutId } : {}), version: 1 },
      services: { heading: 'Our services', cards: [], version: 0 },
      whyChooseUs: { heading: 'Why choose us', cards: [], version: 0 },
      team: { heading: 'Our team', members: [{ name: 'Sara Example', ...(withPhotos ? { photoMediaId: teamId, photoConsent: true } : {}) }, { name: 'Ali Example' }], version: 1 },
      properties: { heading: 'Our properties', displayCount: 6 as const, version: 0 },
    },
    layout: { order: ['about', 'services', 'properties', 'whyChooseUs', 'team'] as ('about' | 'services' | 'properties' | 'whyChooseUs' | 'team')[], visible: { about: true, services: false, whyChooseUs: false, team: true, properties: false }, version: 1 },
    mapped: { agencyName: 'Synthetic Realty', whatsapp: '+923001234567' },
    properties: [],
  });
  const mediaUrl = (id: string, width: number) => `/media/${id}/${width}`;
  const render = (withPhotos: boolean, preset: typeof THEME_PRESETS[number], withMedia = true) =>
    renderToStaticMarkup(React.createElement(SiteTemplate, { model: siteModelFromWebsite(site(withPhotos), preset, withMedia ? { mediaUrl } : {}) }));
  for (const preset of THEME_PRESETS) {
    const html = render(true, preset);
    assert.match(html, new RegExp(`data-theme="${preset}"`));
    assert.match(html, new RegExp(`class="est-about-photo" src="/media/${aboutId}/960" srcSet="/media/${aboutId}/480 480w, /media/${aboutId}/960 960w"`));
    assert.match(html, /alt="Photo of Synthetic Realty"/);
    assert.match(html, new RegExp(`class="est-member-photo" src="/media/${teamId}/480" alt="Sara Example"`));
    assert.doesNotMatch(html, />SE</, 'the photo replaces the initials');
    assert.match(html, />AE</, 'members without a photo keep their initials');
    const plain = render(false, preset);
    assert.doesNotMatch(plain, /est-about-photo|est-member-photo|est-about-with-photo/);
    assert.match(plain, />SE</);
    assert.equal(render(true, preset, false), plain, 'without a media URL the photos are dropped and the page matches the no-photo output');
  }
});
