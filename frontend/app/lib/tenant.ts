// Phase 4a §5: the agency comes only from the Host header, <slug>.<PUBLIC_SITE_DOMAIN> (D-075).
const SLUG = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/;

/** Returns the agency slug for a public site host, or null for the bare domain, foreign hosts and malformed names. */
export function parseTenantHost(host: string | null | undefined, domain: string): string | null {
  if (!host) return null;
  const name = host.trim().toLowerCase().replace(/:\d+$/, '').replace(/\.$/, '');
  const suffix = `.${domain.toLowerCase()}`;
  if (!name.endsWith(suffix)) return null;
  const label = name.slice(0, -suffix.length);
  return SLUG.test(label) ? label : null;
}
