import 'dotenv/config';

const port = Number(process.env.PORT ?? 4003);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
const ownerOrigin = process.env.OWNER_ORIGIN ?? 'https://admin.estateos.localhost';
const superOrigin = process.env.SUPER_ADMIN_ORIGIN ?? 'https://control.estateos.localhost';
for (const origin of [ownerOrigin, superOrigin]) {
  const parsed = new URL(origin);
  if (parsed.origin !== origin || parsed.protocol !== 'https:') throw new Error('Management origins must be exact HTTPS origins');
}
export const env = {
  port,
  bindHost: process.env.BIND_HOST ?? '127.0.0.1',
  mongoUri: process.env.MONGODB_URI,
  ownerOrigin,
  superOrigin,
  internalApiKey: process.env.INTERNAL_API_KEY,
  csrfSigningKey: process.env.CSRF_SIGNING_KEY,
  // Phase 4a: read-only key for the public frontend (never the management key) and the public site domain.
  publicApiKey: process.env.PUBLIC_API_KEY,
  publicSiteDomain: process.env.PUBLIC_SITE_DOMAIN ?? 'sites.estateos.localhost',
};
