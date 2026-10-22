import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { LocalDiskStorage, S3Storage, s3SettingsFromEnv, type MediaStorage } from '../src/storage.js';
import { startFakeS3, type FakeS3 } from './fixtures/fake-s3.js';

// Phase 7a §3 test 1: one contract suite for both MediaStorage drivers. Synthetic bytes only (D-116).
let fake: FakeS3;
let dir: string;
before(async () => {
  fake = await startFakeS3();
  dir = await mkdtemp(path.join(os.tmpdir(), 'estateos-storage-test-'));
});
after(async () => { await fake.close(); await rm(dir, { recursive: true, force: true }); });

function drivers(): [string, MediaStorage][] {
  return [
    ['local disk', new LocalDiskStorage(dir)],
    ['S3-compatible', new S3Storage({ endpoint: fake.endpoint, region: 'auto', bucket: fake.bucket, accessKeyId: 'synthetic-key', secretAccessKey: 'synthetic-secret' })],
  ];
}

test('both drivers: put, get, overwrite, missing key, delete, invalid keys, check', async () => {
  for (const [name, storage] of drivers()) {
    const key = 'agency-1/media-1/w480.webp';
    await storage.put(key, Buffer.from('first'), 'image/webp');
    assert.deepEqual(await storage.get(key), Buffer.from('first'), name);
    await storage.put(key, Buffer.from('second version'), 'image/webp');
    assert.deepEqual(await storage.get(key), Buffer.from('second version'), `${name}: overwrite`);
    assert.equal(await storage.get('agency-1/missing.webp'), null, `${name}: missing key`);
    await storage.delete(key);
    assert.equal(await storage.get(key), null, `${name}: deleted`);
    await storage.delete(key); // deleting twice is harmless
    for (const bad of ['../escape', '/absolute', 'a/../b', '', 'spaces not allowed']) {
      await assert.rejects(storage.put(bad, Buffer.from('x'), 'image/webp'), /INVALID_STORAGE_KEY/, `${name}: ${bad}`);
    }
    assert.equal(await storage.check(), true, `${name}: check`);
  }
  assert.equal(fake.objects.size, 0);
});

test('S3 driver signs requests, keeps the content type, and reports an unreachable bucket', async () => {
  const storage = drivers()[1]![1];
  await storage.put('agency-2/original.jpg', Buffer.from([0xff, 0xd8, 0xff]), 'image/jpeg');
  assert.equal(fake.objects.get('agency-2/original.jpg')?.contentType, 'image/jpeg');
  const wrongBucket = new S3Storage({ endpoint: fake.endpoint, region: 'auto', bucket: 'other-bucket', accessKeyId: 'k', secretAccessKey: 's' });
  assert.equal(await wrongBucket.check(), false);
  const nowhere = new S3Storage({ endpoint: 'http://127.0.0.1:1', region: 'auto', bucket: fake.bucket, accessKeyId: 'k', secretAccessKey: 's' });
  assert.equal(await nowhere.check(), false);
});

test('S3 settings name the missing variable and never echo a value', () => {
  const full = { S3_ENDPOINT: 'https://example.invalid', S3_BUCKET: 'b', S3_ACCESS_KEY_ID: 'id-value', S3_SECRET_ACCESS_KEY: 'secret-value' };
  assert.equal(s3SettingsFromEnv(full).region, 'auto');
  for (const name of Object.keys(full)) {
    const partial: NodeJS.ProcessEnv = { ...full, [name]: '' };
    assert.throws(() => s3SettingsFromEnv(partial), (error: Error) => error.message === `Missing ${name} for MEDIA_STORAGE=s3` && !error.message.includes('secret-value'));
  }
});
