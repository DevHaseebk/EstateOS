'use client';

import { useCallback, useEffect, useState } from 'react';
import { approvedText, type approvedWebsiteState } from '../lib/website';

type Review = { status: string; version: number; latestReview: { action: string; reason?: string; decidedAt: string } | null };
type AgencyReview = { name: string; review: Review; canResubmit: boolean; canEdit: boolean; restriction: { status: string; reason?: string } };
type ErrorPayload = { error?: { message?: string; details?: Record<string, string> } } | null;

function messageFrom(payload: ErrorPayload, fallback: string): string {
  const details = payload?.error?.details ? Object.values(payload.error.details).join(' ') : '';
  return details || payload?.error?.message || fallback;
}

// D-067/D-068/D-073: truthful review status, the latest reason, and Resubmit only after Request Changes.
// Phase 2b: a Deactivated agency is read-only; a Blocked agency loses its session (onSessionEnded).
export function ReviewStatusCard({ agencyId, websiteState, onSessionEnded, onStatusChange }: {
  agencyId: string; websiteState?: ReturnType<typeof approvedWebsiteState>; onSessionEnded: () => void; onStatusChange?: () => void;
}) {
  const [agency, setAgency] = useState<AgencyReview | null>(null);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const load = useCallback(() =>
    fetch(`/api/v1/owner/agencies/${agencyId}`, { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (response.status === 401) { onSessionEnded(); return; }
        if (!response.ok) throw new Error(messageFrom(payload, 'Could not load your agency status'));
        setAgency(payload.data as AgencyReview);
      })
      .catch((failure: unknown) => setError(failure instanceof Error ? failure.message : 'Could not load your agency status')), [agencyId, onSessionEnded]);
  useEffect(() => { void load(); }, [load]);

  async function resubmit() {
    if (!agency) return;
    setBusy(true); setError('');
    try {
      const csrfResponse = await fetch('/api/v1/auth/csrf', { cache: 'no-store' });
      const csrf = await csrfResponse.json().catch(() => null);
      if (!csrfResponse.ok) throw new Error(messageFrom(csrf, 'Authentication is unavailable'));
      const response = await fetch('/api/v1/owner/review-resubmissions', {
        method: 'POST',
        headers: { 'X-CSRF-Token': csrf.data.csrfToken, 'Content-Type': 'application/json' },
        body: JSON.stringify({ expectedReviewVersion: agency.review.version }),
      });
      const payload = await response.json().catch(() => null);
      if (response.status === 401) { onSessionEnded(); return; }
      if (response.status === 403 || response.status === 409) { setNotice('Your agency status changed. The latest status is shown.'); await load(); return; }
      if (!response.ok) throw new Error(messageFrom(payload, 'Could not resubmit'));
      setNotice('Resubmitted. Your agency is waiting for review again.');
      await load();
      onStatusChange?.();
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not resubmit'); }
    finally { setBusy(false); setConfirming(false); }
  }

  if (!agency) return error ? <p className="form-error" role="alert">{error}</p> : <p role="status">Loading your agency status…</p>;
  const { status, latestReview } = agency.review;
  if (agency.restriction.status === 'DEACTIVATED') return <div className="status-card status-deactivated">
    <p className="status-title">Account deactivated</p>
    {agency.restriction.reason && <p className="status-reason">{agency.restriction.reason}</p>}
    <p>Your agency account is deactivated, so you can view it but not make changes. Please contact EstateOS support.</p>
    {notice && <p className="form-notice" role="status">{notice}</p>}
  </div>;
  return <div className={`status-card status-${status.toLowerCase()}`}>
    {status === 'PENDING' && <><p className="status-title">Waiting for review</p><p>Your agency is waiting for review by the EstateOS team. Your website is not public yet.</p></>}
    {status === 'CHANGES_REQUESTED' && <>
      <p className="status-title">Changes requested</p>
      {latestReview?.reason && <p className="status-reason">{latestReview.reason}</p>}
      <p>Update your agency details or website, then resubmit for review.</p>
      {agency.canResubmit && (confirming ? <div className="confirm-row">
        <p>Send your agency back for review now?</p>
        <button type="button" className="primary" disabled={busy} onClick={resubmit}>{busy ? 'Please wait…' : 'Yes, resubmit for review'}</button>
        <button type="button" className="text-button" disabled={busy} onClick={() => setConfirming(false)}>Cancel</button>
      </div> : <button type="button" className="primary" onClick={() => setConfirming(true)}>Resubmit for review</button>)}
    </>}
    {status === 'APPROVED' && <><p className="status-title">Approved</p><p>{approvedText(websiteState ?? null)}</p></>}
    {status === 'REJECTED' && <>
      <p className="status-title">Not approved</p>
      {latestReview?.reason && <p className="status-reason">{latestReview.reason}</p>}
      <p>Please contact EstateOS support if you have questions.</p>
    </>}
    {error && <p className="form-error" role="alert">{error}</p>}
    {notice && <p className="form-notice" role="status">{notice}</p>}
  </div>;
}
