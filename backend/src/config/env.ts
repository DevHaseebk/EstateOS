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
  // Phase 7a §1 Q5: exactly one instance runs the reconciler and staged-media cleanup.
  runBackgroundJobs: process.env.RUN_BACKGROUND_JOBS?.trim() !== 'false',
};

const isLocalHost = (host: string) => host === 'localhost' || host.endsWith('.localhost') || host === '127.0.0.1' || host === '[::1]';

/**
 * Phase 7a §1 Q2: what is wrong with a production configuration. Each entry names a setting, never its value.
 * Development (any NODE_ENV other than "production") is never checked.
 */
export function productionConfigProblems(source: NodeJS.ProcessEnv = process.env): string[] {
  if (source.NODE_ENV !== 'production') return [];
  const problems: string[] = [];
  const value = (name: string) => source[name]?.trim() ?? '';
  if (!value('MONGODB_URI')) problems.push('MONGODB_URI is required');
  const keys = ['INTERNAL_API_KEY', 'PUBLIC_API_KEY', 'CSRF_SIGNING_KEY'];
  for (const name of keys) if (value(name).length < 32) problems.push(`${name} must be at least 32 characters`);
  for (let i = 0; i < keys.length; i += 1) {
    for (let j = i + 1; j < keys.length; j += 1) {
      if (value(keys[i]!) && value(keys[i]!) === value(keys[j]!)) problems.push(`${keys[i]} and ${keys[j]} must be different`);
    }
  }
  for (const name of ['OWNER_ORIGIN', 'SUPER_ADMIN_ORIGIN']) {
    let host = '';
    try { host = new URL(value(name)).hostname; } catch { /* reported below */ }
    if (!host || isLocalHost(host)) problems.push(`${name} must be the real HTTPS origin, not a localhost value`);
  }
  const domain = value('PUBLIC_SITE_DOMAIN');
  if (!domain || isLocalHost(domain)) problems.push('PUBLIC_SITE_DOMAIN must be the real public site domain, not a localhost value');
  if (value('MEDIA_STORAGE') !== 's3') problems.push('MEDIA_STORAGE must be "s3" in production');
  else for (const name of ['S3_ENDPOINT', 'S3_BUCKET', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY']) if (!value(name)) problems.push(`${name} is required`);
  return problems;
}

/** Stops a production start that would silently run with development defaults. */
export function assertProductionConfig(source: NodeJS.ProcessEnv = process.env): void {
  const problems = productionConfigProblems(source);
  if (problems.length) throw new Error(`Production configuration is incomplete:\n- ${problems.join('\n- ')}`);
}
