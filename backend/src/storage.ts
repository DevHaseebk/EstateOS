import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { DeleteObjectCommand, GetObjectCommand, HeadBucketCommand, PutObjectCommand, S3Client, S3ServiceException } from '@aws-sdk/client-s3';

// Phase 3d §1 Q1 (D-105): one storage interface. Development and tests use the local disk; Phase 7a adds the
// S3-compatible driver (Cloudflare R2, AWS S3, Backblaze B2, MinIO) behind the same interface, so callers never change.
export interface MediaStorage {
  put(key: string, body: Buffer, contentType: string): Promise<void>;
  get(key: string): Promise<Buffer | null>;
  delete(key: string): Promise<void>;
  /** Phase 7a: true when the storage answers (used by /api/ready). */
  check(): Promise<boolean>;
}

const SAFE_KEY = /^[a-z0-9][a-z0-9/._-]{0,200}$/i;
function assertKey(key: string): void {
  if (!SAFE_KEY.test(key) || key.includes('..')) throw new Error('INVALID_STORAGE_KEY');
}

export class LocalDiskStorage implements MediaStorage {
  constructor(private readonly root: string) {}
  private resolve(key: string): string {
    assertKey(key);
    return path.join(this.root, ...key.split('/'));
  }
  async put(key: string, body: Buffer): Promise<void> {
    const file = this.resolve(key);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, body);
  }
  async get(key: string): Promise<Buffer | null> {
    try { return await readFile(this.resolve(key)); } catch { return null; }
  }
  async delete(key: string): Promise<void> {
    await rm(this.resolve(key), { force: true });
  }
  async check(): Promise<boolean> {
    try { await mkdir(this.root, { recursive: true }); return true; } catch { return false; }
  }
}

export type S3Settings = { endpoint: string; region: string; bucket: string; accessKeyId: string; secretAccessKey: string };

/** Phase 7a §1 Q1: a private bucket; objects are only ever served through the API's permission checks. */
export class S3Storage implements MediaStorage {
  private readonly client: S3Client;
  constructor(private readonly settings: S3Settings) {
    this.client = new S3Client({
      endpoint: settings.endpoint, region: settings.region, forcePathStyle: true,
      credentials: { accessKeyId: settings.accessKeyId, secretAccessKey: settings.secretAccessKey },
      // Only send/verify checksums when an operation requires them; several S3-compatible services reject the newer defaults.
      requestChecksumCalculation: 'WHEN_REQUIRED', responseChecksumValidation: 'WHEN_REQUIRED',
    });
  }
  async put(key: string, body: Buffer, contentType: string): Promise<void> {
    assertKey(key);
    await this.client.send(new PutObjectCommand({ Bucket: this.settings.bucket, Key: key, Body: body, ContentType: contentType }));
  }
  async get(key: string): Promise<Buffer | null> {
    assertKey(key);
    try {
      const result = await this.client.send(new GetObjectCommand({ Bucket: this.settings.bucket, Key: key }));
      return result.Body ? Buffer.from(await result.Body.transformToByteArray()) : null;
    } catch (error) {
      if (error instanceof S3ServiceException && (error.name === 'NoSuchKey' || error.$metadata.httpStatusCode === 404)) return null;
      throw error;
    }
  }
  async delete(key: string): Promise<void> {
    assertKey(key);
    await this.client.send(new DeleteObjectCommand({ Bucket: this.settings.bucket, Key: key }));
  }
  async check(): Promise<boolean> {
    try { await this.client.send(new HeadBucketCommand({ Bucket: this.settings.bucket })); return true; } catch { return false; }
  }
}

/** Reads the S3 settings; names the first missing one (never a value). */
export function s3SettingsFromEnv(source: NodeJS.ProcessEnv = process.env): S3Settings {
  const required = (name: string) => {
    const value = source[name]?.trim();
    if (!value) throw new Error(`Missing ${name} for MEDIA_STORAGE=s3`);
    return value;
  };
  return {
    endpoint: required('S3_ENDPOINT'), region: source.S3_REGION?.trim() || 'auto', bucket: required('S3_BUCKET'),
    accessKeyId: required('S3_ACCESS_KEY_ID'), secretAccessKey: required('S3_SECRET_ACCESS_KEY'),
  };
}

let storage: MediaStorage | undefined;
/**
 * MEDIA_STORAGE=local (default) uses MEDIA_DIR or backend/.media-dev (gitignored); MEDIA_STORAGE=s3 uses the S3_* settings.
 */
export function mediaStorage(): MediaStorage {
  if (storage) return storage;
  const driver = process.env.MEDIA_STORAGE?.trim() || 'local';
  if (driver === 's3') storage = new S3Storage(s3SettingsFromEnv());
  else if (driver === 'local') storage = new LocalDiskStorage(process.env.MEDIA_DIR ?? path.resolve(process.cwd(), '.media-dev'));
  else throw new Error('MEDIA_STORAGE must be "local" or "s3"');
  return storage;
}
