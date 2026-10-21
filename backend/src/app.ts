import express from 'express';
import { databaseStatus } from './config/database.js';
import { apiGuard, authErrorHandler, authRouter } from './auth.js';
import { reviewRouter } from './review-routes.js';
import { profileRouter } from './profile-routes.js';
import { websiteRouter } from './website-routes.js';

export const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', database: databaseStatus() });
});

app.use('/api/v1', apiGuard, authRouter, reviewRouter, profileRouter, websiteRouter);
app.use(authErrorHandler);
