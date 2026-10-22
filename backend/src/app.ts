import express from 'express';
import { databaseStatus } from './config/database.js';
import { mediaStorage } from './storage.js';
import { apiGuard, authErrorHandler, authRouter } from './auth.js';
import { reviewRouter } from './review-routes.js';
import { invitationRouter } from './invitation-routes.js';
import { profileRouter } from './profile-routes.js';
import { websiteRouter } from './website-routes.js';
import { propertyRouter } from './property-routes.js';
import { mediaRouter } from './media-routes.js';
import { publicGuard, publicRouter } from './public-routes.js';

export const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', database: databaseStatus() });
});
// Phase 7a §1 Q3: readiness for hosts and load balancers: 200 only when the database and media storage both answer.
app.get('/api/ready', async (_request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  // An async wrapper turns a storage misconfiguration (thrown while creating the driver) into "not ready" too.
  const ready = databaseStatus() === 'connected' && await (async () => mediaStorage().check())().catch(() => false);
  response.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'not_ready' });
});

// Phase 4a: the public read API is mounted first, behind its own key; management routes never see public callers.
app.use('/api/v1/public', publicGuard, publicRouter);
app.use('/api/v1', apiGuard, authRouter, invitationRouter, reviewRouter, profileRouter, websiteRouter, propertyRouter, mediaRouter);
app.use(authErrorHandler);
