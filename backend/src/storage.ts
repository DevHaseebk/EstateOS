import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Phase 3d §1 Q1 (D-105): one storage interface. Development and tests use the local disk; the S3-compatible
// (Cloudflare R2) driver is added at deploy time behind the same interface, so callers never change.
export interface MediaStorage {
  put(key: string, body: Buffer, contentType: string): Promise<void>;
  get(key: string): Promise<Buffer | null>;
  delete(key: string): Promise<void>;
}

const SAFE_KEY = /^[a-z0-9][a-z0-9/._-]{0,200}$/i;

class LocalDiskStorage implements MediaStorage {
  constructor(private readonly root: string) {}
  private resolve(key: string): string {
    if (!SAFE_KEY.test(key) || key.includes('..')) throw new Error('INVALID_STORAGE_KEY');
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
}

let storage: MediaStorage | undefined;
/** MEDIA_DIR overrides the folder (tests use a temporary one). Default: backend/.media-dev (gitignored). */
export function mediaStorage(): MediaStorage {
  storage ??= new LocalDiskStorage(process.env.MEDIA_DIR ?? path.resolve(process.cwd(), '.media-dev'));
  return storage;
}
