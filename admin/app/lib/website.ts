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

/** Phase 4a: one truthful website status for the hub and Overview. A link only when actually Live (D-048, D-054, D-119). */
export function websiteStatus(website: WebsiteData, reviewStatus: string): { label: string; hint: string; url?: string } {
  const publication = website.publication ?? { status: 'NEVER_PUBLISHED' as const };
  if (publication.status === 'LIVE') {
    return { label: 'Live', url: publication.url, hint: publication.unpublishedChanges
      ? 'You saved changes that are not on your live website yet.' : 'Your live website is up to date.' };
  }
  if (publication.status === 'ACTIVATION_PENDING') return { label: 'Going live', hint: 'Going live — retrying automatically. You do not need to do anything.' };
  if (!website.readiness.ready) return { label: 'Not live yet', hint: 'A few essentials are still missing.' };
  return reviewStatus === 'APPROVED'
    ? { label: 'Going live', hint: 'Your website is ready and is going live now. Refresh in a moment.' }
    : { label: 'Not live yet', hint: 'Ready. It goes live automatically after your agency is approved.' };
}
