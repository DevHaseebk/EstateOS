import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { NextRequest } from 'next/server';

// Phase 7a §3 tests 2–4 and 6: production config guard, readiness, background-jobs flag, BFF client-IP rule,
// and the single backend-URL name. Synthetic settings only (D-116); no real secret is ever used here.
const key = 'test-internal-api-key-with-at-least-thirty-two-characters';
let mongo: MongoMemoryReplSet;
let mediaDir: string;
let app: Awaited<typeof import('../src/app.js')>['app'];
let config: typeof import('../src/config/env.js');

before(async () => {
  mediaDir = await mkdtemp(path.join(os.tmpdir(), 'estateos-ready-test-'));
  process.env.MEDIA_DIR = mediaDir;
  process.env.INTERNAL_API_KEY = key;
  app = (await import('../src/app.js')).app;
  config = await import('../src/config/env.js');
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
});
after(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); await rm(mediaDir, { recursive: true, force: true }); });

const production = (overrides: Record<string, string> = {}): NodeJS.ProcessEnv => ({
  NODE_ENV: 'production',
  MONGODB_URI: 'mongodb+srv://synthetic.example.invalid/estateos',
  INTERNAL_API_KEY: 'i'.repeat(40), PUBLIC_API_KEY: 'p'.repeat(40), CSRF_SIGNING_KEY: 'c'.repeat(40),
  OWNER_ORIGIN: 'https://admin.example.test', SUPER_ADMIN_ORIGIN: 'https://control.example.test', PUBLIC_SITE_DOMAIN: 'sites.example.test',
  MEDIA_STORAGE: 's3', S3_ENDPOINT: 'https://storage.example.test', S3_BUCKET: 'estateos', S3_ACCESS_KEY_ID: 'synthetic-id', S3_SECRET_ACCESS_KEY: 'synthetic-secret-value',
  ...overrides,
});

test('production config: a complete config passes; each development default or weak setting is named, never echoed', () => {
  assert.deepEqual(config.productionConfigProblems(production()), []);
  assert.deepEqual(config.productionConfigProblems({ NODE_ENV: 'development' }), [], 'development is never checked');
  const cases: [Record<string, string>, RegExp][] = [
    [{ MONGODB_URI: '' }, /^MONGODB_URI is required$/],
    [{ INTERNAL_API_KEY: 'short-key' }, /^INTERNAL_API_KEY must be at least 32 characters$/],
    [{ PUBLIC_API_KEY: 'i'.repeat(40) }, /^INTERNAL_API_KEY and PUBLIC_API_KEY must be different$/],
    [{ OWNER_ORIGIN: 'https://admin.estateos.localhost' }, /^OWNER_ORIGIN must be the real HTTPS origin/],
    [{ SUPER_ADMIN_ORIGIN: '' }, /^SUPER_ADMIN_ORIGIN must be the real HTTPS origin/],
    [{ PUBLIC_SITE_DOMAIN: 'sites.estateos.localhost' }, /^PUBLIC_SITE_DOMAIN must be the real public site domain/],
    [{ MEDIA_STORAGE: 'local' }, /^MEDIA_STORAGE must be "s3" in production$/],
    [{ S3_SECRET_ACCESS_KEY: '' }, /^S3_SECRET_ACCESS_KEY is required$/],
  ];
  for (const [override, expected] of cases) {
    const problems = config.productionConfigProblems(production(override));
    assert.equal(problems.length, 1, JSON.stringify(override));
    assert.match(problems[0]!, expected);
  }
  const error = (() => { try { config.assertProductionConfig(production({ INTERNAL_API_KEY: 'leaky-short-value' })); return null; } catch (failure) { return failure as Error; } })();
  assert.ok(error);
  assert.match(error.message, /INTERNAL_API_KEY/);
  assert.doesNotMatch(error.message, /leaky-short-value|synthetic-secret-value/, 'values never appear');
});

test('/api/ready is 200 only with a connected database and working storage; /api/health keeps its shape', async () => {
  const notReady = await supertest(app).get('/api/ready');
  assert.deepEqual([notReady.status, notReady.body], [503, { status: 'not_ready' }]);
  await mongoose.connect(mongo.getUri());
  const ready = await supertest(app).get('/api/ready');
  assert.deepEqual([ready.status, ready.body], [200, { status: 'ready' }]);
  assert.equal(ready.headers['cache-control'], 'no-store');
  assert.deepEqual((await supertest(app).get('/api/health')).body, { status: 'ok', database: 'connected' });
  await mongoose.disconnect();
  assert.equal((await supertest(app).get('/api/ready')).status, 503);
  assert.deepEqual((await supertest(app).get('/api/health')).body, { status: 'ok', database: 'disconnected' });
});

/** Starts the real server entry point and resolves with its output once it reports its job state (or after 25 s). */
function startServer(extraEnv: Record<string, string>): Promise<string> {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ['--import', 'tsx', 'src/server.ts'], {
      cwd: path.resolve(__dirname, '..'), env: { ...process.env, ...extraEnv }, stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    const finish = () => { clearTimeout(timer); child.kill(); resolve(output); };
    const timer = setTimeout(finish, 25_000);
    const onData = (chunk: Buffer) => { output += chunk.toString(); if (/Background jobs are off|MongoDB connected|Production configuration is incomplete/.test(output)) setTimeout(finish, 300); };
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('exit', () => { clearTimeout(timer); resolve(output); });
  });
}

test('the server: RUN_BACKGROUND_JOBS=false starts no jobs; production with development defaults refuses to start', async () => {
  const base = { MONGODB_URI: mongo.getUri(), MEDIA_DIR: mediaDir, BIND_HOST: '127.0.0.1' };
  const off = await startServer({ ...base, PORT: '4891', RUN_BACKGROUND_JOBS: 'false' });
  assert.match(off, /Background jobs are off for this instance/);
  const refused = await startServer({ ...base, PORT: '4892', NODE_ENV: 'production', OWNER_ORIGIN: 'https://admin.estateos.localhost', MEDIA_STORAGE: 'local' });
  assert.match(refused, /Production configuration is incomplete/);
  assert.match(refused, /OWNER_ORIGIN must be the real HTTPS origin/);
  assert.doesNotMatch(refused, /EstateOS API listening/, 'it never starts listening');
});

test('BFF: production requires a trusted client-IP header; only that header is forwarded as the client IP', async () => {
  const owner = await import('../../admin/app/api/v1/[...path]/route.ts');
  const originalFetch = globalThis.fetch;
  const originalNodeEnv = process.env.NODE_ENV;
  const forwarded: Headers[] = [];
  globalThis.fetch = async (_input: string | URL | Request, init?: RequestInit) => { forwarded.push(new Headers(init?.headers)); return Response.json({ data: {} }); };
  const env = process.env as Record<string, string | undefined>;
  const request = () => new NextRequest('https://admin.estateos.localhost/api/v1/owner/session', { headers: { 'x-client-ip': '6.6.6.6', 'cf-connecting-ip': '203.0.113.7' } });
  const ctx = { params: Promise.resolve({ path: ['owner', 'session'] }) };
  try {
    env.NODE_ENV = 'production';
    delete env.TRUSTED_CLIENT_IP_HEADER;
    assert.equal((await owner.GET(request(), ctx)).status, 503);
    assert.equal(forwarded.length, 0);
    env.TRUSTED_CLIENT_IP_HEADER = 'cf-connecting-ip';
    assert.equal((await owner.GET(request(), ctx)).status, 200);
    assert.equal(forwarded[0]!.get('x-client-ip'), '203.0.113.7', 'the incoming x-client-ip is ignored');
  } finally {
    globalThis.fetch = originalFetch;
    env.NODE_ENV = originalNodeEnv;
    delete env.TRUSTED_CLIENT_IP_HEADER;
  }
});

test('the public site uses BACKEND_INTERNAL_URL, with API_URL only as a fallback', async () => {
  const { fetchPublishedSite } = await import('../../frontend/app/lib/public-api.ts');
  process.env.PUBLIC_API_KEY = 'test-public-api-key-with-at-least-thirty-two-characters-x';
  const originalFetch = globalThis.fetch;
  const urls: string[] = [];
  globalThis.fetch = async (input: string | URL | Request) => { urls.push(String(input)); return Response.json({ data: { site: {}, revision: 1, publishedAt: 'now' } }); };
  try {
    process.env.API_URL = 'http://legacy.internal:4003';
    process.env.BACKEND_INTERNAL_URL = 'http://backend.internal:4003';
    await fetchPublishedSite('city-homes');
    delete process.env.BACKEND_INTERNAL_URL;
    await fetchPublishedSite('city-homes');
  } finally { globalThis.fetch = originalFetch; delete process.env.API_URL; delete process.env.BACKEND_INTERNAL_URL; }
  assert.deepEqual(urls, ['http://backend.internal:4003/api/v1/public/sites/city-homes', 'http://legacy.internal:4003/api/v1/public/sites/city-homes']);
});
