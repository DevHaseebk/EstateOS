import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { reconcileActivations } from '../publication.js';

// Phase 4a §3: run the first-activation reconciliation once (the API also runs it every 5 minutes).
async function main(): Promise<void> {
  if (!env.mongoUri) throw new Error('MONGODB_URI is required');
  await mongoose.connect(env.mongoUri);
  try {
    const result = await reconcileActivations(1000);
    process.stdout.write(`Activation reconcile: checked ${result.checked}, went Live ${result.live}, failed ${result.failed}.\n`);
  } finally { await mongoose.disconnect(); }
}
void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Reconcile failed');
  process.exitCode = 1;
});
