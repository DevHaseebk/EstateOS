import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { assertProductionConfig, env } from './config/env.js';
import { startReconciler } from './publication.js';
import { cleanupStagedMedia } from './media.js';

// Phase 7a §1 Q2: refuse to start in production with development defaults (the message names settings, never values).
assertProductionConfig();

app.listen(env.port, env.bindHost, (error?: Error) => {
  if (error) {
    console.error(`EstateOS API could not listen on ${env.bindHost}:${env.port}: ${error.message}`);
    process.exitCode = 1;
    return;
  }
  console.info(`EstateOS API listening on http://localhost:${env.port}`);
  void connectDatabase();
  // Phase 7a §1 Q5: extra instances set RUN_BACKGROUND_JOBS=false so only one runs the jobs.
  if (!env.runBackgroundJobs) { console.info('Background jobs are off for this instance (RUN_BACKGROUND_JOBS=false)'); return; }
  // Phase 4a §3: retries missed or failed first activations every 5 minutes.
  startReconciler();
  // Phase 3d §1 Q5: staged uploads never attached within 24 hours are removed hourly.
  setInterval(() => { void cleanupStagedMedia().catch((error: unknown) => console.error('[media] cleanup failed', error instanceof Error ? error.message : error)); }, 60 * 60_000).unref();
});
