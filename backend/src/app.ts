import express from 'express';
import { databaseStatus } from './config/database.js';
import { authErrorHandler, authRouter } from './auth.js';

export const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', database: databaseStatus() });
});

app.use('/api/v1', authRouter);
app.use(authErrorHandler);
