import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { BackupError, createBackup, parseBackupKey } from '../backup.js';
import { mediaStorage } from '../storage.js';

// Phase 7a §1 Q6 (D-112): `npm run backup -w backend` writes one encrypted backup to the media storage under backups/.
// Scheduling (daily), retention and key custody are Phase 7b. Prints the stored key and counts, never data or secrets.
async function main(): Promise<void> {
  const key = parseBackupKey(process.env.BACKUP_ENCRYPTION_KEY);
  if (!env.mongoUri) throw new BackupError('MONGODB_URI is required');
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10_000 });
  try {
    const now = new Date();
    const { file, header } = await createBackup(mongoose.connection.db!, key, now);
    const stamp = now.toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
    const storageKey = `backups/estateos-${stamp}.bak`;
    await mediaStorage().put(storageKey, file, 'application/octet-stream');
    process.stdout.write(`Backup stored: ${storageKey} (${file.length} bytes)\n`);
    for (const entry of header.collections) process.stdout.write(`  ${entry.name}: ${entry.count}\n`);
  } finally { await mongoose.disconnect(); }
}
void main().catch((error: unknown) => {
  console.error(error instanceof BackupError ? error.message : 'Backup failed');
  if (!(error instanceof BackupError) && error instanceof Error) console.error(error.name);
  process.exitCode = 1;
});
