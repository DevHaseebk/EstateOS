import 'dotenv/config';

const port = Number(process.env.PORT ?? 4003);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid TCP port');
}

const defaultOrigins = [
  'http://localhost:4000',
  'http://localhost:4001',
  'http://localhost:4002',
];
const configuredOrigins = process.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean);
const corsOrigins = configuredOrigins ?? (process.env.NODE_ENV === 'production' ? [] : defaultOrigins);

if (process.env.NODE_ENV === 'production' && corsOrigins.length === 0) {
  throw new Error('CORS_ORIGINS must be set in production');
}
if (corsOrigins.includes('*')) {
  throw new Error('CORS_ORIGINS cannot contain a wildcard');
}

export const env = {
  port,
  mongoUri: process.env.MONGODB_URI,
  corsOrigins,
};
