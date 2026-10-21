import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import { databaseStatus } from './config/database.js';
import { env } from './config/env.js';

export const app = express();

app.use(cors({ origin: env.corsOrigins }));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', database: databaseStatus() });
});

const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }
  console.error(error);
  response.status(500).json({ error: 'Internal server error' });
};

app.use(errorHandler);
