import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
  console.info(`EstateOS API listening on http://localhost:${env.port}`);
  void connectDatabase();
});
