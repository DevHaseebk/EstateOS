import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { Agency, AgencyAudit } from '../models.js';

// Phase 2a contract §3: backfill review/restriction/publication fields on pre-2a agencies. Idempotent.
async function main(): Promise<void> {
  if (!env.mongoUri) throw new Error('MONGODB_URI is required');
  await mongoose.connect(env.mongoUri);
  try {
    await Promise.all([Agency.init(), AgencyAudit.init()]);
    const agencies = Agency.collection;
    const results = await Promise.all([
      agencies.updateMany({ reviewVersion: { $exists: false } }, { $set: { reviewVersion: 0 } }),
      agencies.updateMany({ submittedForReviewAt: { $exists: false } }, [{ $set: { submittedForReviewAt: '$createdAt' } }]),
      agencies.updateMany({ restrictionStatus: { $exists: false } }, { $set: { restrictionStatus: 'NONE' } }),
      agencies.updateMany({ publicationStatus: { $exists: false } }, { $set: { publicationStatus: 'NEVER_PUBLISHED' } }),
    ]);
    const updated = results.reduce((total, result) => total + result.modifiedCount, 0);
    process.stdout.write(`Review axes migration complete: ${updated} field update(s).\n`);
  } finally { await mongoose.disconnect(); }
}
void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Migration failed');
  process.exitCode = 1;
});
