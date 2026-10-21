'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiGet, REVIEW_LABELS, type OwnerSession } from '../lib/api';
import { ReviewStatusCard } from './ReviewStatusCard';

type ProfileSummary = { publicContact: { showMobile: boolean; showWhatsapp: boolean }; canEdit: boolean };

// D-047: true status first (review and website shown separately), then ONE primary next action, then the review card.
export function Overview({ session, onStatusChange, onSessionEnded }: { session: OwnerSession; onStatusChange: () => void; onSessionEnded: () => void }) {
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  useEffect(() => { void apiGet<ProfileSummary>('/api/v1/owner/profile').then(setProfile).catch(() => setProfile(null)); }, [session]);

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
        <p className="status-hint">Website setup comes next.</p>
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
    <ReviewStatusCard agencyId={session.agency.id} onSessionEnded={onSessionEnded} onStatusChange={onStatusChange} />
  </div>;
}
