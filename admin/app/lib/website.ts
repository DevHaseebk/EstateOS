'use client';

import { useCallback, useEffect, useState } from 'react';
import type { WebsiteData } from 'site-template';
import { apiGet } from './api';

/** Where each D-033 readiness item is fixed (Phase 3b §7 hub). */
export const ISSUE_LINKS: Record<string, { href: string; label: string }> = {
  THEME: { href: '/website/theme', label: 'Choose a theme' },
  AGENCY_NAME: { href: '/profile', label: 'Open Agency profile' },
  HERO_HEADING: { href: '/website/editor?section=hero', label: 'Edit Hero' },
  PUBLIC_CONTACT: { href: '/profile', label: 'Open Agency profile' },
  HERO_IMAGE: { href: '/website/editor?section=hero', label: 'Choose a photo' },
};

/** Loads the owner's saved website draft; reload() after saves. */
export function useWebsite() {
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [error, setError] = useState('');
  const reload = useCallback(() => apiGet<WebsiteData>('/api/v1/owner/website')
    .then((data) => { setWebsite(data); setError(''); })
    .catch((failure: unknown) => setError(failure instanceof Error ? failure.message : 'Could not load your website')), []);
  useEffect(() => { void reload(); }, [reload]);
  return { website, setWebsite, error, reload };
}
