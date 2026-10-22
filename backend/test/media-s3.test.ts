import { after, before } from 'node:test';
import { startFakeS3, type FakeS3 } from './fixtures/fake-s3.js';

// Phase 7a §3 test 1: the whole Phase 3d media suite again, with MEDIA_STORAGE=s3 against the in-process fake S3.
// This hook is registered before the suite's own hooks, so the storage settings exist before the app first uses storage.
let fake: FakeS3 | undefined;
before(async () => {
  fake = await startFakeS3();
  Object.assign(process.env, {
    MEDIA_STORAGE: 's3', S3_ENDPOINT: fake.endpoint, S3_BUCKET: fake.bucket, S3_ACCESS_KEY_ID: 'synthetic-key', S3_SECRET_ACCESS_KEY: 'synthetic-secret',
  });
});
after(async () => { await fake?.close(); });

// Loaded after the hook above on purpose (a static import would register the suite's hooks first).
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('./media.test.ts');
