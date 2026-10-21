'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { WebsiteData } from 'site-template';
import { apiGet, REVIEW_LABELS, type OwnerSession } from '../lib/api';
import { ReviewStatusCard } from './ReviewStatusCard';

type ProfileSummary = { publicContact: { showMobile: boolean; showWhatsapp: boolean }; canEdit: boolean };

// D-047: true status first (review and website shown separately), then ONE primary next action, then the review card.
export function Overview({ session, onStatusChange, onSessionEnded }: { session: OwnerSession; onStatusChange: () => void; onSessionEnded: () => void }) {
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  useEffect(() => {
    void apiGet<ProfileSummary>('/api/v1/owner/profile').then(setProfile).catch(() => setProfile(null));
    void apiGet<WebsiteData>('/api/v1/owner/website').then(setWebsite).catch(() => setWebsite(null));
  }, [session]);

  const { reviewStatus, restrictionStatus } = session.agency;
  const noPublicContact = profile ? !profile.publicContact.showMobile && !profile.publicContact.showWhatsapp : false;
  const action = !profile ? null
    : !profile.canEdit ? 'View agency details'
      : reviewStatus === 'CHANGES_REQUESTED' || noPublicContact ? 'Complete your agency details' : 'Review agency details';

  return <div className="page">
    <h1>Overview</h1>
    <section className="status-summary" aria-label="Agency status">
      <div>
        <p className="status-label">Agency review</p>
        <p className="status-value">{REVIEW_LABELS[reviewStatus] ?? reviewStatus}</p>
      </div>
      <div>
        <p className="status-label">Website</p>
        <p className="status-value">Not live yet</p>
        <p className="status-hint">{website?.readiness.ready ? 'Ready — going live comes in the next phase.' : 'Finish the essentials in My Website.'}</p>
      </div>
      {restrictionStatus === 'DEACTIVATED' && <div>
        <p className="status-label">Account</p>
        <p className="status-value">Deactivated (read-only)</p>
      </div>}
    </section>
    {action && <div className="next-action">
      <Link href="/profile" className="primary-link">{action}</Link>
      {noPublicContact && profile?.canEdit && <p className="status-hint">Choose a phone or WhatsApp number to show on your website.</p>}
    </div>}
    {website && profile && <section className="checklist" aria-labelledby="checklist-title">
      {/* D-045: four nonblocking shortcuts in any order; completion comes from real saved data, not a stored flag. */}
      <h2 id="checklist-title">Set up your website</h2>
      <ol>
        <li className={noPublicContact ? '' : 'done'}><Link href="/profile">Agency details</Link><span>{noPublicContact ? 'Choose a number to show' : 'Done'}</span></li>
        <li className={website.theme.preset ? 'done' : ''}><Link href="/website/theme">Choose theme</Link><span>{website.theme.preset ? 'Done' : 'Not chosen yet'}</span></li>
        <li className={website.sections.hero.heading ? 'done' : ''}><Link href="/website/editor?section=hero">Customize website</Link><span>{website.sections.hero.heading ? 'Done' : 'Add a main heading'}</span></li>
        <li><Link href="/website/preview">Preview website</Link><span>Private</span></li>
      </ol>
    </section>}
    <ReviewStatusCard agencyId={session.agency.id} onSessionEnded={onSessionEnded} onStatusChange={onStatusChange} />
  </div>;
}
