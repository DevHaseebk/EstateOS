import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { gunzipSync, gzipSync } from 'node:zlib';
import mongoose from 'mongoose';

// Phase 7a §1 Q6 (D-112): EstateOS's own encrypted database backup, independent of the hosting provider.
// File layout: [4-byte header length][header JSON][12-byte IV][16-byte GCM tag][encrypted gzip of the collections].
// The header is authenticated too (GCM additional data), so neither part can be altered unnoticed. No secret is ever in it.
const { EJSON } = mongoose.mongo.BSON;
type Db = mongoose.mongo.Db;
type IndexSpec = { name: string; key: Record<string, unknown>; [option: string]: unknown };
export type BackupHeader = { format: 'estateos-backup'; version: 1; createdAt: string; collections: { name: string; count: number }[] };
type BackupBody = { collections: Record<string, { indexes: IndexSpec[]; documents: unknown[] }> };

export class BackupError extends Error {}

/** BACKUP_ENCRYPTION_KEY: 32 bytes as 64 hex characters or base64. Kept outside Git and the database. */
export function parseBackupKey(value: string | undefined): Buffer {
  const text = value?.trim() ?? '';
  const key = /^[0-9a-f]{64}$/i.test(text) ? Buffer.from(text, 'hex') : Buffer.from(text, 'base64');
  if (key.length !== 32) throw new BackupError('BACKUP_ENCRYPTION_KEY must be 32 bytes (64 hex characters or base64)');
  return key;
}

async function userCollections(db: Db): Promise<string[]> {
  return (await db.listCollections({}, { nameOnly: true }).toArray()).map((entry) => entry.name).filter((name) => !name.startsWith('system.')).sort();
}

export async function createBackup(db: Db, key: Buffer, now = new Date()): Promise<{ file: Buffer; header: BackupHeader }> {
  const body: BackupBody = { collections: {} };
  const header: BackupHeader = { format: 'estateos-backup', version: 1, createdAt: now.toISOString(), collections: [] };
  for (const name of await userCollections(db)) {
    const collection = db.collection(name);
    const documents = await collection.find({}).sort({ _id: 1 }).toArray();
    const indexes = (await collection.indexes()) as IndexSpec[];
    body.collections[name] = { indexes, documents };
    header.collections.push({ name, count: documents.length });
  }
  const plain = gzipSync(Buffer.from(EJSON.stringify(body, { relaxed: false }), 'utf8'));
  const headerBytes = Buffer.from(JSON.stringify(header), 'utf8');
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(headerBytes);
  const encrypted = Buffer.concat([cipher.update(plain), cipher.final()]);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(headerBytes.length);
  return { file: Buffer.concat([length, headerBytes, iv, cipher.getAuthTag(), encrypted]), header };
}

/** Checks the format and the authentication tag and returns the collections; throws before anything is written. */
export function openBackup(file: Buffer, key: Buffer): { header: BackupHeader; body: BackupBody } {
  try {
    const headerLength = file.readUInt32BE(0);
    const headerBytes = file.subarray(4, 4 + headerLength);
    const header = JSON.parse(headerBytes.toString('utf8')) as BackupHeader;
    if (header.format !== 'estateos-backup' || header.version !== 1) throw new BackupError('Unsupported backup format');
    const offset = 4 + headerLength;
    const decipher = createDecipheriv('aes-256-gcm', key, file.subarray(offset, offset + 12));
    decipher.setAAD(headerBytes);
    decipher.setAuthTag(file.subarray(offset + 12, offset + 28));
    const plain = Buffer.concat([decipher.update(file.subarray(offset + 28)), decipher.final()]);
    return { header, body: EJSON.parse(gunzipSync(plain).toString('utf8'), { relaxed: false }) as BackupBody };
  } catch (error) {
    if (error instanceof BackupError) throw error;
    throw new BackupError('The backup cannot be opened: wrong key, or the file was changed or damaged');
  }
}

/** Two connection strings point at the same database (same hosts and database name). */
export function sameDatabase(sourceUri: string, targetUri: string): boolean {
  const identity = (uri: string) => {
    const parsed = new URL(uri.replace(/^mongodb(\+srv)?:\/\//, 'http://'));
    return `${parsed.host.toLowerCase()}/${parsed.pathname.replace(/^\//, '') || 'test'}`;
  };
  return identity(sourceUri) === identity(targetUri);
}

/** Restores into an EMPTY target database. Every check happens before the first write. */
export async function restoreBackup(file: Buffer, key: Buffer, target: Db): Promise<BackupHeader> {
  const { header, body } = openBackup(file, key);
  for (const name of await userCollections(target)) {
    if (await target.collection(name).estimatedDocumentCount() > 0) throw new BackupError('The target database is not empty; restore only into an empty database');
  }
  for (const [name, { indexes, documents }] of Object.entries(body.collections)) {
    const collection = target.collection(name);
    if (documents.length) {
      for (let start = 0; start < documents.length; start += 1000) {
        await collection.insertMany(documents.slice(start, start + 1000) as mongoose.mongo.OptionalId<mongoose.mongo.Document>[], { ordered: true });
      }
    } else await target.createCollection(name).catch(() => undefined);
    for (const index of indexes) {
      if (index.name === '_id_') continue;
      // Everything except the server-owned fields (key, v, ns) is an index option (name, unique, sparse, partial filter, TTL …).
      const options = Object.fromEntries(Object.entries(index).filter(([field]) => !['key', 'v', 'ns'].includes(field)));
      await collection.createIndex(index.key as mongoose.mongo.IndexSpecification, options as mongoose.mongo.CreateIndexesOptions);
    }
  }
  return header;
}
