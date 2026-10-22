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

/** Phase 3d: the owner's own images (staged or attached) through the Agency Admin BFF. */
export const ownerMediaUrl = (mediaId: string, width: 480 | 960 | 1600) => `/api/v1/owner/media/${mediaId}/${width}`;

export type NextAction = { label: string; href: string; external?: boolean };
/**
 * Phase 6b §1 Q4: the ONE Overview action (D-047), from the real state; the first match wins.
 * Returns null until the profile has loaded.
 */
export function overviewAction(input: {
  profile: { publicContact: { showMobile: boolean; showWhatsapp: boolean }; canEdit: boolean } | null;
  website: WebsiteData | null; reviewStatus: string; restrictionStatus?: string;
}): NextAction | null {
  const { profile, website, reviewStatus, restrictionStatus } = input;
  if (!profile) return null;
  if (restrictionStatus === 'DEACTIVATED' || !profile.canEdit) return { label: 'View agency details', href: '/profile' };
  if (reviewStatus === 'CHANGES_REQUESTED') return { label: 'Complete your agency details', href: '/profile' };
  if (!profile.publicContact.showMobile && !profile.publicContact.showWhatsapp) return { label: 'Choose a public number', href: '/profile' };
  if (!website) return null;
  const publication = website.publication;
  if (publication?.status === 'LIVE') {
    if (publication.unpublishedChanges) return { label: 'Review and publish updates', href: '/website' };
    if (publication.url) return { label: 'Open your website', href: publication.url, external: true };
  }
  if (!website.readiness.ready) return { label: 'Finish your website', href: ISSUE_LINKS[website.readiness.issues[0]?.key ?? '']?.href ?? '/website' };
  return { label: 'Preview your website', href: '/website/preview' };
}

/** Phase 6b §3: the review card text for an approved agency, from the real website state. */
export function approvedText(state: ReturnType<typeof approvedWebsiteState>): string {
  return 'Your agency is approved.' + (state === 'LIVE' ? ' Your website is live.'
    : state === 'GOING_LIVE' ? ' Your website is going live now.' : state === 'NOT_READY' ? ' Your website goes live as soon as the essentials are finished.' : '');
}

/** Phase 6b §3: the website state the review card describes for an approved agency. */
export function approvedWebsiteState(website: WebsiteData | null): 'LIVE' | 'GOING_LIVE' | 'NOT_READY' | null {
  if (!website) return null;
  if (website.publication?.status === 'LIVE') return 'LIVE';
  return website.publication?.status === 'ACTIVATION_PENDING' || website.readiness.ready ? 'GOING_LIVE' : 'NOT_READY';
}
