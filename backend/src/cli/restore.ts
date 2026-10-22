import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { BackupError, parseBackupKey, restoreBackup, sameDatabase } from '../backup.js';
import { mediaStorage } from '../storage.js';

// Phase 7a §1 Q6 (D-112): `npm run restore -w backend` restores one backup into an EMPTY target database.
// RESTORE_TARGET_URI is required and must not be the source (MONGODB_URI). The backup comes from RESTORE_KEY
// (a backups/... storage key) or RESTORE_FILE (a local file). The key and tag are checked before anything is written.
async function main(): Promise<void> {
  const key = parseBackupKey(process.env.BACKUP_ENCRYPTION_KEY);
  const targetUri = process.env.RESTORE_TARGET_URI?.trim();
  if (!targetUri) throw new BackupError('RESTORE_TARGET_URI is required');
  if (env.mongoUri && sameDatabase(env.mongoUri, targetUri)) throw new BackupError('RESTORE_TARGET_URI must not be the source database (MONGODB_URI)');
  const storageKey = process.env.RESTORE_KEY?.trim();
  const localFile = process.env.RESTORE_FILE?.trim();
  if (!storageKey === !localFile) throw new BackupError('Set exactly one of RESTORE_KEY or RESTORE_FILE');
  const file = storageKey ? await mediaStorage().get(storageKey) : await readFile(localFile!);
  if (!file) throw new BackupError('The backup was not found');
  const connection = await mongoose.createConnection(targetUri, { serverSelectionTimeoutMS: 10_000 }).asPromise();
  try {
    const header = await restoreBackup(file, key, connection.db!);
    process.stdout.write(`Restored backup from ${header.createdAt}\n`);
    for (const entry of header.collections) process.stdout.write(`  ${entry.name}: ${entry.count}\n`);
  } finally { await connection.close(); }
}
void main().catch((error: unknown) => {
  console.error(error instanceof BackupError ? error.message : 'Restore failed');
  if (!(error instanceof BackupError) && error instanceof Error) console.error(error.name);
  process.exitCode = 1;
});
