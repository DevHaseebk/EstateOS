import type { SiteContent } from 'site-template';

// Server-side only: the public key never reaches the browser. Read-only PUBLIC portal (Phase 4a §1 Q3).
export type PublishedSite = { site: SiteContent; revision: number; publishedAt: string };

export async function fetchPublishedSite(slug: string): Promise<PublishedSite | null> {
  const key = process.env.PUBLIC_API_KEY;
  if (!key || key.length < 32) throw new Error('PUBLIC_API_KEY is not configured');
  const api = process.env.API_URL ?? 'http://127.0.0.1:4003';
  // No caching in 4a: every request reads the current Live revision, so restrictions apply at once (§1 Q7).
  const response = await fetch(`${api}/api/v1/public/sites/${encodeURIComponent(slug)}`, {
    headers: { 'x-public-api-key': key }, cache: 'no-store', signal: AbortSignal.timeout(8000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Public site API returned ${response.status}`);
  return (await response.json()).data as PublishedSite;
}

export const publicSiteDomain = () => process.env.PUBLIC_SITE_DOMAIN ?? 'sites.estateos.localhost';
