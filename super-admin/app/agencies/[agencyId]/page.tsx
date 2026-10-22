'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AdminHeader } from '../../components/AdminHeader';
import { AgencyProperties } from '../../components/AgencyProperties';
import { InvitationLink, type Invitation } from '../../components/InvitationLink';
import { DecisionDialog, type DecisionKind } from '../../components/DecisionDialog';
import { ACTION_LABELS, ApiError, apiGet, apiMutation, formatDate, OWNER_ACCOUNT_LABELS, RESTRICTION_LABELS, REVIEW_LABELS, statusLabel, websiteLabel } from '../../lib/api';

type Detail = {
  id: string;
  agencyName: string;
  owner: { name: string | null; email: string | null; mobile: string; whatsapp: string; accountState: string; invitationExpiresAt?: string | null };
  origin: string;
  createdAt: string;
  profile: { description?: string; officeAddress?: string; city?: string; serviceAreas?: string; publicEmail?: string };
  publicContact: { showMobile: boolean; showWhatsapp: boolean };
  review: { status: string; version: number; latestReview: { action: string; reason?: string; decidedAt: string } | null; submittedForReviewAt: string };
  restrictionStatus: string;
  restriction: { status: string; version: number; latestRestriction: { action: string; reason: string; decidedAt: string } | null };
  websiteReadiness: string;
  readinessIssues: { key: string; message: string }[];
  publicationStatus: string;
  publication: {
    status: string; url?: string; firstLiveAt?: string; lastActivationError?: { code: string; at: string }; activationAttempts: number;
    liveRevision?: number; publishedAt?: string; unpublishedChanges?: boolean;
  };
  history: { at: string; axis: string; action: string; actorRole: string; fromStatus?: string; toStatus: string; reason?: string }[];
};
type Session = { user: { name: string } };

const RESTRICTION_KINDS = ['BLOCK', 'DEACTIVATE', 'RESTORE'] as const;
const DONE_NOTICE: Record<DecisionKind, string> = {
  APPROVE: 'Agency approved. Its website is not live until it is also ready.',
  REQUEST_CHANGES: 'Change request sent to the owner.',
  REJECT: 'Agency rejected.',
  REOPEN: 'Agency reopened for review.',
  BLOCK: 'Agency blocked. The owner has been signed out.',
  DEACTIVATE: 'Agency deactivated. The owner now has read-only access.',
  RESTORE: 'Agency restored. The owner has normal access again.',
};

// D-065: one responsive review page; review status and website readiness shown separately.
export default function AgencyReviewPage() {
  const { agencyId } = useParams<{ agencyId: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'signed-out' | 'not-found' | 'error'>('loading');
  const [dialog, setDialog] = useState<DecisionKind | null>(null);
  const [notice, setNotice] = useState('');
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [inviteError, setInviteError] = useState('');
  const [issuing, setIssuing] = useState(false);

  const load = useCallback(() =>
    Promise.all([apiGet<Session>('/api/v1/super-admin/session'), apiGet<Detail>(`/api/v1/super-admin/agencies/${agencyId}`)])
      .then(([me, data]) => { setSession(me); setDetail(data); setState('ready'); })
      .catch((failure: unknown) => {
        if (failure instanceof ApiError && failure.status === 401) setState('signed-out');
        else if (failure instanceof ApiError && failure.status === 404) setState('not-found');
        else setState('error');
      }), [agencyId]);
  useEffect(() => { void load(); }, [load]);

  async function confirm(reason?: string) {
    if (!detail || !dialog) return;
    const expectedReviewVersion = detail.review.version;
    try {
      if ((RESTRICTION_KINDS as readonly string[]).includes(dialog)) {
        await apiMutation(`/api/v1/super-admin/agencies/${detail.id}/restrictions`, 'POST', { action: dialog, reason, expectedRestrictionVersion: detail.restriction.version });
      } else if (dialog === 'REOPEN') await apiMutation(`/api/v1/super-admin/agencies/${detail.id}/reopen`, 'POST', { reason, expectedReviewVersion });
      else await apiMutation(`/api/v1/super-admin/agencies/${detail.id}/review-decisions`, 'POST', { decision: dialog, ...(reason ? { reason } : {}), expectedReviewVersion });
      const done = dialog;
      setDialog(null);
      setNotice(DONE_NOTICE[done]);
      await load();
    } catch (failure) {
      if (failure instanceof ApiError && failure.status === 409) {
        setDialog(null);
        setNotice('This agency changed while you were reviewing it. The latest status is shown below; nothing else was changed.');
        await load();
        return;
      }
      throw failure;
    }
  }

  // Phase 6a §4: a new link cancels the previous one; the URL is only ever shown in this response.
  async function issueLink() {
    if (!detail) return;
    setIssuing(true); setInviteError('');
    try {
      const data = await apiMutation<{ invitation: Invitation }>(`/api/v1/super-admin/agencies/${detail.id}/invitations`, 'POST', {});
      setInvitation(data!.invitation);
      await load();
    } catch (failure) {
      setInviteError(failure instanceof Error ? failure.message : 'Could not issue a new link');
    } finally { setIssuing(false); }
  }

  if (state === 'loading') return <main className="admin-page"><p role="status">Loading agency…</p></main>;
  if (state === 'signed-out') return <main className="admin-page"><p>Your session has ended. <Link href="/">Sign in again</Link>.</p></main>;
  if (state === 'not-found') return <main className="admin-page"><p>Agency not found. <Link href="/">Back to the review queue</Link>.</p></main>;
  if (state === 'error' || !detail || !session) return <main className="admin-page"><p className="form-error" role="alert">Could not load this agency. <button type="button" className="text-button" onClick={() => void load()}>Try again</button></p></main>;

  const status = detail.review.status;
  const latest = detail.review.latestReview;
  const restriction = detail.restriction;
  const restricted = restriction.status !== 'NONE';
  return <>
    <AdminHeader name={session.user.name} onSignedOut={() => setState('signed-out')} />
    <main className="admin-page review-page">
      <p><Link href="/" className="back-link">← Review queue</Link></p>
      <h1>{detail.agencyName}</h1>
      {notice && <p className="form-notice" role="status">{notice}</p>}
      <div className="review-layout">
        <section className="panel" aria-labelledby="summary-title">
          <h2 id="summary-title">Agency and owner</h2>
          <dl className="facts">
            <div><dt>Owner</dt><dd>{detail.owner.name ?? '—'}</dd></div>
            <div><dt>Email</dt><dd>{detail.owner.email ?? '—'}</dd></div>
            <div><dt>Mobile</dt><dd>{detail.owner.mobile}</dd></div>
            <div><dt>WhatsApp</dt><dd>{detail.owner.whatsapp}</dd></div>
            <div><dt>{detail.origin === 'ADMIN_CREATED' ? 'Created by EstateOS' : 'Registered'}</dt><dd>{formatDate(detail.createdAt)}</dd></div>
            <div><dt>Owner account</dt><dd>{detail.owner.accountState === 'INVITED'
              ? (detail.owner.invitationExpiresAt && new Date(detail.owner.invitationExpiresAt) > new Date() ? `Invitation sent, expires ${formatDate(detail.owner.invitationExpiresAt)}` : 'Invitation expired')
              : OWNER_ACCOUNT_LABELS.ACTIVE}</dd></div>
            <div><dt>In queue since</dt><dd>{formatDate(detail.review.submittedForReviewAt)}</dd></div>
            <div><dt>Shown on website</dt><dd>{[detail.publicContact.showMobile && 'Mobile', detail.publicContact.showWhatsapp && 'WhatsApp'].filter(Boolean).join(', ') || 'None chosen yet'}</dd></div>
            <div><dt>City</dt><dd>{detail.profile.city ?? '—'}</dd></div>
            <div><dt>Office address</dt><dd>{detail.profile.officeAddress ?? '—'}</dd></div>
            <div><dt>Areas served</dt><dd>{detail.profile.serviceAreas ?? '—'}</dd></div>
            <div><dt>Public email</dt><dd>{detail.profile.publicEmail ?? '—'}</dd></div>
          </dl>
          {detail.profile.description && <div className="latest-reason"><p className="eyebrow">Agency description</p><p>{detail.profile.description}</p></div>}
          <div className="badges">
            <span className={`badge review-${status.toLowerCase()}`}>Review: {REVIEW_LABELS[status] ?? status}</span>
            {restricted && <span className={`badge account-${restriction.status.toLowerCase()}`}>Account: {RESTRICTION_LABELS[restriction.status]}</span>}
            {(() => { const label = websiteLabel(detail.publicationStatus, detail.websiteReadiness); return <span className={`badge ${label.tone}`}>Website: {label.text}</span>; })()}
          </div>
          {detail.publication.url && <p>Public website: <a href={detail.publication.url} target="_blank" rel="noopener noreferrer" className="back-link">{detail.publication.url.replace('https://', '')}</a>
            {detail.publication.firstLiveAt && <span className="queue-meta"> · Live since {formatDate(detail.publication.firstLiveAt)}</span>}</p>}
          {detail.publication.liveRevision && <p className="queue-meta">Live revision {detail.publication.liveRevision}, published {formatDate(detail.publication.publishedAt)} · Unpublished changes: {detail.publication.unpublishedChanges ? 'yes' : 'no'}</p>}
          {detail.publication.lastActivationError && detail.publication.status !== 'LIVE' && <div className="latest-reason">
            <p className="eyebrow">Automatic go-live failed — retrying</p>
            <p>Error {detail.publication.lastActivationError.code} at {formatDate(detail.publication.lastActivationError.at)} · attempts: {detail.publication.activationAttempts}</p>
          </div>}
          {detail.publicationStatus !== 'LIVE' && detail.readinessIssues.length > 0 && <div className="latest-reason">
            <p className="eyebrow">Website essentials still missing</p>
            <ul className="readiness-list">{detail.readinessIssues.map((issue) => <li key={issue.key}>{issue.message}</li>)}</ul>
          </div>}
          {/* D-065 / D-101: authorized, read-only private preview of the saved draft. */}
          <Link href={`/agencies/${detail.id}/preview`} className="secondary preview-link">Private preview</Link>
          {latest?.reason && <div className="latest-reason"><p className="eyebrow">Latest reason ({ACTION_LABELS[`REVIEW_${latest.action}`] ?? latest.action})</p><p>{latest.reason}</p></div>}
        </section>

        <div className="side-stack">
        <section className="panel decision-panel" aria-labelledby="decision-title-area">
          <h2 id="decision-title-area">Decision</h2>
          {restricted && <p>Restore this agency before making review decisions.</p>}
          {!restricted && status === 'PENDING' && <div className="decision-buttons">
            <button type="button" className="primary-inline" onClick={() => setDialog('APPROVE')}>Approve</button>
            <button type="button" className="secondary" onClick={() => setDialog('REQUEST_CHANGES')}>Request changes</button>
            <button type="button" className="danger" onClick={() => setDialog('REJECT')}>Reject</button>
          </div>}
          {!restricted && status === 'CHANGES_REQUESTED' && <p>Waiting for the owner to make changes and resubmit for review.</p>}
          {!restricted && status === 'APPROVED' && <p>This agency is approved. No further review decision is needed.</p>}
          {!restricted && status === 'REJECTED' && <>
            <p>This agency was rejected. You can reopen it for another manual review.</p>
            <button type="button" className="secondary" onClick={() => setDialog('REOPEN')}>Reopen for review</button>
          </>}
        </section>

        {detail.owner.accountState === 'INVITED' && <section className="panel" aria-labelledby="invite-title">
          <h2 id="invite-title">Owner invitation</h2>
          <p>The owner has not set a password yet. Issuing a new link cancels the previous one.</p>
          {invitation && <InvitationLink invitation={invitation} />}
          {inviteError && <p className="form-error" role="alert">{inviteError}</p>}
          {restriction.status === 'DEACTIVATED'
            ? <p>Restore the agency before sending a new invitation.</p>
            : <button type="button" className="secondary" disabled={issuing} onClick={() => void issueLink()}>{issuing ? 'Issuing…' : 'Issue a new link'}</button>}
        </section>}

        <section className="panel account-panel" aria-labelledby="account-title">
          <h2 id="account-title">Account status</h2>
          {!restricted ? <>
            {/* Phase 6b §1 Q6: the owner's account state is separate from the restriction state. */}
            {detail.owner.accountState === 'INVITED'
              ? <p><strong>Not restricted.</strong> The owner has not activated the account yet, so nobody can sign in.</p>
              : <p><strong>Active.</strong> The owner has normal access.</p>}
            <ul className="account-help">
              <li><strong>Deactivate</strong>: the owner can sign in but cannot change anything.</li>
              <li><strong>Block</strong>: the owner is signed out and cannot sign in.</li>
            </ul>
            <div className="decision-buttons">
              <button type="button" className="secondary" onClick={() => setDialog('DEACTIVATE')}>Deactivate</button>
              <button type="button" className="danger" onClick={() => setDialog('BLOCK')}>Block</button>
            </div>
          </> : <>
            <p><strong>{RESTRICTION_LABELS[restriction.status]}</strong>{restriction.latestRestriction && <> since {formatDate(restriction.latestRestriction.decidedAt)}</>}</p>
            {restriction.latestRestriction && <p className="history-reason">{restriction.latestRestriction.reason}</p>}
            <button type="button" className="secondary" onClick={() => setDialog('RESTORE')}>Restore agency</button>
          </>}
        </section>
        </div>
      </div>

      <AgencyProperties agencyId={detail.id} />

      <section className="panel" aria-labelledby="history-title">
        <h2 id="history-title">History</h2>
        {detail.history.length === 0 ? <p>No review actions yet.</p> : <ol className="history">
          {detail.history.map((entry, index) => <li key={`${entry.at}-${index}`}>
            <p><strong>{ACTION_LABELS[entry.action] ?? entry.action}</strong> · {formatDate(entry.at)} · by {entry.actorRole === 'SUPER_ADMIN' ? 'Super Admin' : entry.actorRole === 'SYSTEM' ? 'EstateOS (automatic)' : 'Agency owner'}</p>
            <p className="queue-meta">{entry.axis === 'RESTRICTION' ? 'Account: ' : entry.axis === 'PUBLICATION' ? 'Website: ' : entry.axis === 'ACCOUNT' ? 'Owner: ' : ''}{entry.fromStatus ? `${statusLabel(entry.fromStatus)} → ` : ''}{statusLabel(entry.toStatus)}</p>
            {entry.reason && <p className="history-reason">{entry.reason}</p>}
          </li>)}
        </ol>}
      </section>
    </main>
    <DecisionDialog kind={dialog} agencyName={detail.agencyName} websiteReady={detail.websiteReadiness === 'READY'} onCancel={() => setDialog(null)} onConfirm={confirm} />
  </>;
}
