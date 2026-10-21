import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

app.listen(env.port, env.bindHost, (error?: Error) => {
  if (error) {
    console.error(`EstateOS API could not listen on ${env.bindHost}:${env.port}: ${error.message}`);
    process.exitCode = 1;
    return;
  }
  console.info(`EstateOS API listening on http://localhost:${env.port}`);
  void connectDatabase();
});
