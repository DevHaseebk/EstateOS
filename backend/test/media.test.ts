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

// Phase 3d contract §6 acceptance tests: uploads, processing, attachment and image visibility. Synthetic images only (D-116).
const key = 'test-internal-api-key-with-at-least-thirty-two-characters';
const publicKey = 'test-public-api-key-with-at-least-thirty-two-characters-x';
const ownerOrigin = 'https://admin.estateos.localhost';
const superOrigin = 'https://control.estateos.localhost';
const password = 'Orchid!Harbor!72?Sky';
const reason = 'Synthetic reason for a Phase 3d media test.';
type Portal = 'OWNER' | 'SUPER_ADMIN';

let mongo: MongoMemoryReplSet;
let mediaDir: string;
let app: Awaited<typeof import('../src/app.js')>['app'];
let models: typeof import('../src/models.js');
let media: typeof import('../src/media.js');
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
const house = (photos: string[] = [], coverMediaId?: string) => ({
  title: 'Synthetic house with photos', intent: 'SALE', type: 'HOUSE', pricePkr: 30_000_000, city: 'Karachi', area: 'DHA', photos, ...(coverMediaId ? { coverMediaId } : {}),
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

test('unit: content sniffing trusts bytes, not names or claimed types', async () => {
  assert.equal(media.sniffImageType(Buffer.from('MZ fake executable pretending to be a photo')), null);
  assert.equal(media.sniffImageType(await image(10, 10, 'png')), 'png');
  assert.equal(media.sniffImageType(await image(10, 10, 'jpeg')), 'jpeg');
  assert.equal(media.sniffImageType(await image(10, 10, 'webp')), 'webp');
  await assert.rejects(media.processImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'), 'PROPERTY'), { code: 'UNSUPPORTED_TYPE' });
  await assert.rejects(media.processImage(Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.alloc(2000, 7)]), 'PROPERTY'), { code: 'CORRUPT_IMAGE' });
  await assert.rejects(media.processImage(Buffer.concat([await image(400, 300), Buffer.alloc(media.MAX_UPLOAD_BYTES)]), 'PROPERTY'), { code: 'TOO_LARGE' });
});

test('unit: minimum sizes per purpose', async () => {
  await assert.rejects(media.processImage(await image(1100, 600), 'HERO'), { code: 'TOO_SMALL' });
  await assert.rejects(media.processImage(await image(1300, 1400), 'HERO'), { code: 'TOO_SMALL' });
  assert.equal((await media.processImage(await image(1200, 700), 'HERO')).width, 1200);
  await assert.rejects(media.processImage(await image(63, 200), 'LOGO'), { code: 'TOO_SMALL' });
  assert.equal((await media.processImage(await image(64, 64, 'png'), 'LOGO')).width, 64);
  await assert.rejects(media.processImage(await image(399, 300), 'PROPERTY'), { code: 'TOO_SMALL' });
  await assert.rejects(media.processImage(await image(400, 299), 'PROPERTY'), { code: 'TOO_SMALL' });
});

test('unit: EXIF and GPS are removed from every derivative; variants never upscale', async () => {
  const withGps = await image(2000, 1200, 'jpeg', true);
  const source = await sharp(withGps).metadata();
  assert.ok(source.exif, 'the synthetic source carries EXIF');
  const processed = await media.processImage(withGps, 'HERO');
  assert.deepEqual(processed.variants.map((variant) => variant.width), [480, 960, 1600]);
  for (const variant of processed.variants) {
    const meta = await sharp(variant.body).metadata();
    assert.equal(meta.format, 'webp');
    assert.equal(meta.exif, undefined);
    assert.equal(meta.icc, undefined);
    assert.equal(meta.xmp, undefined);
    assert.equal(meta.width, variant.width);
    assert.equal(variant.body.includes(Buffer.from('SyntheticCam')), false);
  }
  assert.deepEqual((await media.processImage(await image(1000, 700), 'PROPERTY')).variants.map((variant) => variant.width), [480, 960]);
  assert.deepEqual((await media.processImage(await image(100, 80, 'png'), 'LOGO')).variants.map((variant) => variant.width), [100]);
});

test('upload stages privately: owner sees it, another agency and the public do not; originals are never served', async () => {
  const a = await newOwner('mediaa');
  const b = await newOwner('mediab');
  const original = await image(1000, 700, 'png');
  const uploaded = await upload(a.token, 'PROPERTY', original, 'image/jpeg');
  assert.equal(uploaded.status, 201, JSON.stringify(uploaded.body));
  const id = uploaded.body.data.media.id as string;
  assert.match(id, /^[a-f0-9]{32}$/);
  assert.equal(uploaded.body.data.media.status, 'STAGED');
  const own = await authedGet('OWNER', a.token, `/api/v1/owner/media/${id}/960`);
  assert.equal(own.status, 200);
  assert.equal(own.headers['content-type'], 'image/webp');
  assert.match(own.headers['cache-control'], /private/);
  assert.notDeepEqual(own.body, original);
  assert.equal((await sharp(own.body as Buffer).metadata()).format, 'webp');
  assert.equal((await authedGet('OWNER', b.token, `/api/v1/owner/media/${id}/960`)).status, 404);
  assert.equal((await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/media/${id}/960`)).status, 404, 'staged media is not visible to the Super Admin');
  assert.equal((await publicMedia(id)).status, 404);
  const files = await readdir(path.join(mediaDir, 'originals', a.agencyId));
  assert.deepEqual(files, [id]);
});

test('upload validation errors are clear and per file; wrong content types are refused', async () => {
  const owner = await newOwner('mediainvalid');
  const exe = await upload(owner.token, 'PROPERTY', Buffer.from('MZ this is not an image at all'), 'image/jpeg');
  assert.equal(exe.status, 422);
  assert.equal(exe.body.error.code, 'UNSUPPORTED_TYPE');
  const small = await upload(owner.token, 'HERO', await image(800, 600));
  assert.equal(small.body.error.code, 'TOO_SMALL');
  const big = await upload(owner.token, 'PROPERTY', Buffer.concat([await image(400, 300), Buffer.alloc(media.MAX_UPLOAD_BYTES + 10)]));
  assert.equal(big.status, 422);
  assert.equal(big.body.error.code, 'TOO_LARGE');
  assert.equal((await upload(owner.token, 'PROPERTY', await image(400, 300), 'application/octet-stream')).status, 415);
  assert.equal((await upload(owner.token, 'AVATAR', await image(400, 300))).status, 422);
  assert.equal((await upload(owner.token, 'PROPERTY', await image(400, 300), 'image/jpeg', { 'x-agency-id': new mongoose.Types.ObjectId().toString() })).status, 422);
  assert.equal(await models.Media.countDocuments({ agencyId: owner.agencyId }), 0);
});

test('Hero upload is attached on save, satisfies readiness and takes a ready approved agency Live with it', async () => {
  const owner = await newOwner('mediahero');
  await publicNumber(owner.token);
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/theme', { preset: 'WARM_EDITORIAL', expectedThemeVersion: 0 })).status, 200);
  const hero = (await upload(owner.token, 'HERO', await image(1600, 900))).body.data.media.id as string;
  const property = (await upload(owner.token, 'PROPERTY', await image(800, 600))).body.data.media.id as string;
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', { heading: 'Homes we sell', ctaLabel: 'Talk to us', heroUploadId: property, expectedVersion: 0 })).status, 422, 'a PROPERTY upload cannot be the Hero');
  const saved = await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', { heading: 'Homes we sell', ctaLabel: 'Talk to us', heroUploadId: hero, expectedVersion: 0 });
  assert.equal(saved.status, 200, JSON.stringify(saved.body));
  assert.equal(saved.body.data.section.heroUploadId, hero);
  assert.equal(saved.body.data.section.heroImageId, null);
  assert.deepEqual(saved.body.data.readiness, { ready: true, issues: [] });
  assert.equal((await models.Media.findOne({ mediaId: hero }).lean())?.status, 'ATTACHED');
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', { heading: 'Homes', ctaLabel: 'Talk', heroUploadId: hero, heroImageId: 'test-licensed', expectedVersion: 1 })).status, 422);
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${owner.agencyId}/review-decisions`, { decision: 'APPROVE', expectedReviewVersion: 0 })).status, 200);
  const agency = await models.Agency.findById(owner.agencyId).lean();
  assert.equal(agency?.publicationStatus, 'LIVE');
  const revision = await models.PublishedRevision.findById(agency!.publication!.liveRevisionId).lean();
  assert.deepEqual(revision?.mediaIds, [hero]);
  const live = await publicMedia(hero, 1600);
  assert.equal(live.status, 200);
  assert.equal(live.headers['content-type'], 'image/webp');
  assert.equal(live.headers['cache-control'], 'public, max-age=300', 'Phase 6b: short public cache');
  assert.equal(live.headers['set-cookie'], undefined);
  assert.equal((await authedGet('SUPER_ADMIN', superToken, `/api/v1/super-admin/media/${hero}/960`)).status, 200);
});

test('logo upload attaches on Header save and can be removed', async () => {
  const owner = await newOwner('medialogo');
  const logo = (await upload(owner.token, 'LOGO', await image(300, 120, 'png'), 'image/png')).body.data.media.id as string;
  const saved = await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/header', { contactButtonLabel: 'Contact us', logoMediaId: logo, expectedVersion: 0 });
  assert.equal(saved.status, 200, JSON.stringify(saved.body));
  assert.equal(saved.body.data.section.logoMediaId, logo);
  assert.equal((await models.Media.findOne({ mediaId: logo }).lean())?.status, 'ATTACHED');
  const removed = await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/header', { contactButtonLabel: 'Contact us', logoMediaId: null, expectedVersion: 1 });
  assert.equal(removed.body.data.section.logoMediaId, null);
  assert.equal(await models.Media.countDocuments({ mediaId: logo }), 1, 'removing only unlinks; the media is kept');
});

test('property photos: order and cover kept; limits, foreign and wrong-purpose ids refused; remove only unlinks', async () => {
  const owner = await newOwner('mediaprops');
  const other = await newOwner('mediapropsother');
  const ids: string[] = [];
  for (let i = 0; i < 11; i += 1) ids.push((await upload(owner.token, 'PROPERTY', await image(400 + i, 300))).body.data.media.id);
  const created = await authed('post', 'OWNER', owner.token, '/api/v1/owner/properties', house(ids.slice(0, 3), ids[2]));
  assert.equal(created.status, 201, JSON.stringify(created.body));
  const property = created.body.data.property;
  assert.deepEqual(property.photos, ids.slice(0, 3));
  assert.equal(property.coverMediaId, ids[2]);
  assert.equal(await models.Media.countDocuments({ mediaId: { $in: ids.slice(0, 3) }, status: 'ATTACHED' }), 3);
  assert.equal((await authed('post', 'OWNER', owner.token, '/api/v1/owner/properties', house(ids))).status, 422, '11 photos');
  assert.equal((await authed('post', 'OWNER', owner.token, '/api/v1/owner/properties', house([ids[0]!, ids[0]!]))).status, 422, 'duplicate');
  assert.equal((await authed('post', 'OWNER', owner.token, '/api/v1/owner/properties', house([ids[3]!], ids[4]))).status, 422, 'cover not in photos');
  const foreign = (await upload(other.token, 'PROPERTY', await image(400, 300))).body.data.media.id as string;
  assert.equal((await authed('post', 'OWNER', owner.token, '/api/v1/owner/properties', house([foreign]))).status, 422, 'another agency\'s photo');
  const hero = (await upload(owner.token, 'HERO', await image(1300, 700))).body.data.media.id as string;
  assert.equal((await authed('post', 'OWNER', owner.token, '/api/v1/owner/properties', house([hero]))).status, 422, 'wrong purpose');
  const updated = await authed('put', 'OWNER', owner.token, `/api/v1/owner/properties/${property.id}`, { ...house([ids[1]!, ids[0]!]), availability: 'AVAILABLE', expectedVersion: 0 });
  assert.equal(updated.status, 200, JSON.stringify(updated.body));
  assert.deepEqual(updated.body.data.property.photos, [ids[1], ids[0]]);
  assert.equal(updated.body.data.property.coverMediaId, ids[1], 'cover falls back to the first photo');
  assert.equal(await models.Media.countDocuments({ mediaId: ids[2] }), 1, 'removed photo is unlinked, not deleted');
});

test('public images: only those in the current Live revision; draft-only photos and restricted agencies are 404', async () => {
  const owner = await newOwner('mediapublic');
  await publicNumber(owner.token);
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/theme', { preset: 'MODERN_LIGHT', expectedThemeVersion: 0 })).status, 200);
  const hero = (await upload(owner.token, 'HERO', await image(1400, 800))).body.data.media.id as string;
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/sections/hero', { heading: 'Homes', ctaLabel: 'Talk to us', heroUploadId: hero, expectedVersion: 0 })).status, 200);
  assert.equal((await publicMedia(hero)).status, 404, 'not Live yet');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${owner.agencyId}/review-decisions`, { decision: 'APPROVE', expectedReviewVersion: 0 })).status, 200);
  assert.equal((await publicMedia(hero)).status, 200);
  const photo = (await upload(owner.token, 'PROPERTY', await image(600, 400))).body.data.media.id as string;
  assert.equal((await authed('post', 'OWNER', owner.token, '/api/v1/owner/properties', house([photo]))).status, 201);
  // Phase 6b §1 Q2: property photos are public only while the Properties section is shown.
  assert.equal((await authed('put', 'OWNER', owner.token, '/api/v1/owner/website/layout', {
    order: ['about', 'services', 'properties', 'whyChooseUs', 'team'], visible: { about: false, services: false, whyChooseUs: false, team: false, properties: true }, expectedLayoutVersion: 0,
  })).status, 200);
  assert.equal((await publicMedia(photo)).status, 404, 'saved but not published yet');
  assert.equal((await authed('post', 'OWNER', owner.token, '/api/v1/owner/website/publish', { expectedLiveRevision: 1, requestId: randomUUID() })).status, 200);
  assert.equal((await publicMedia(photo)).status, 200);
  const site = (await supertest(app).get(`/api/v1/public/sites/${owner.slug}`).set({ 'x-public-api-key': publicKey })).body.data.site;
  assert.equal(site.properties[0].coverMediaId, photo);
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${owner.agencyId}/restrictions`, { action: 'BLOCK', reason, expectedRestrictionVersion: 0 })).status, 200);
  assert.equal((await publicMedia(hero)).status, 404);
  assert.equal((await publicMedia(photo)).status, 404);
  assert.equal((await publicMedia('0'.repeat(32))).status, 404);
  assert.equal((await supertest(app).get(`/api/v1/public/media/${hero}/960`)).status, 403, 'no public key');
});

test('cleanup removes stale staged uploads with their files and never touches attached media', async () => {
  const owner = await newOwner('mediacleanup');
  const stale = (await upload(owner.token, 'PROPERTY', await image(400, 300))).body.data.media.id as string;
  const fresh = (await upload(owner.token, 'PROPERTY', await image(400, 300))).body.data.media.id as string;
  const attached = (await upload(owner.token, 'PROPERTY', await image(400, 300))).body.data.media.id as string;
  assert.equal((await authed('post', 'OWNER', owner.token, '/api/v1/owner/properties', house([attached]))).status, 201);
  const old = new Date(Date.now() - 25 * 60 * 60_000);
  await models.Media.collection.updateMany({ mediaId: { $in: [stale, attached] } }, { $set: { createdAt: old } });
  const removed = await media.cleanupStagedMedia();
  assert.ok(removed >= 1);
  assert.equal(await models.Media.countDocuments({ mediaId: stale }), 0);
  assert.equal(await models.Media.countDocuments({ mediaId: fresh }), 1);
  assert.equal(await models.Media.countDocuments({ mediaId: attached }), 1);
  const leftover = await readdir(path.join(mediaDir, 'variants', stale)).catch(() => [] as string[]);
  assert.deepEqual(leftover, [], 'no variant files remain for the removed upload');
  assert.deepEqual(await readdir(path.join(mediaDir, 'originals', owner.agencyId)).then((files) => files.includes(stale)), false);
  assert.ok((await readdir(path.join(mediaDir, 'variants', attached))).length > 0);
});

test('permissions and the upload rate limit', async () => {
  const rejected = await newOwner('mediarejected');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${rejected.agencyId}/review-decisions`, { decision: 'REJECT', reason, expectedReviewVersion: 0 })).status, 200);
  assert.equal((await upload(rejected.token, 'PROPERTY', await image(400, 300))).body.error.code, 'WEBSITE_READ_ONLY');
  const deactivated = await newOwner('mediadeactivated');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${deactivated.agencyId}/restrictions`, { action: 'DEACTIVATE', reason, expectedRestrictionVersion: 0 })).status, 200);
  assert.equal((await upload(deactivated.token, 'PROPERTY', await image(400, 300))).body.error.code, 'AGENCY_DEACTIVATED');
  const blocked = await newOwner('mediablocked');
  assert.equal((await superPost(`/api/v1/super-admin/agencies/${blocked.agencyId}/restrictions`, { action: 'BLOCK', reason, expectedRestrictionVersion: 0 })).status, 200);
  assert.equal((await upload(blocked.token, 'PROPERTY', await image(400, 300))).status, 401);
  const busy = await newOwner('mediabusy');
  const small = await image(400, 300);
  const statuses: number[] = [];
  for (let i = 0; i < 61; i += 1) statuses.push((await upload(busy.token, 'PROPERTY', small)).status);
  assert.equal(statuses.filter((status) => status === 201).length, 60);
  assert.equal(statuses.at(-1), 429);
});
