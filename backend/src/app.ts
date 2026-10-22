import express from 'express';
import { databaseStatus } from './config/database.js';
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

// Phase 4a: the public read API is mounted first, behind its own key; management routes never see public callers.
app.use('/api/v1/public', publicGuard, publicRouter);
app.use('/api/v1', apiGuard, authRouter, invitationRouter, reviewRouter, profileRouter, websiteRouter, propertyRouter, mediaRouter);
app.use(authErrorHandler);
