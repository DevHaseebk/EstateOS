'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AdminHeader } from '../../components/AdminHeader';
import { DecisionDialog, type DecisionKind } from '../../components/DecisionDialog';
import { ACTION_LABELS, ApiError, apiGet, apiMutation, formatDate, REVIEW_LABELS } from '../../lib/api';

type Detail = {
  id: string;
  agencyName: string;
  owner: { name: string | null; email: string | null; mobile: string; whatsapp: string };
  createdAt: string;
  review: { status: string; version: number; latestReview: { action: string; reason?: string; decidedAt: string } | null; submittedForReviewAt: string };
  restrictionStatus: string;
  websiteReadiness: string;
  publicationStatus: string;
  history: { at: string; action: string; actorRole: string; fromStatus: string; toStatus: string; reason?: string }[];
};
type Session = { user: { name: string } };

// D-065: one responsive review page; review status and website readiness shown separately.
export default function AgencyReviewPage() {
  const { agencyId } = useParams<{ agencyId: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'signed-out' | 'not-found' | 'error'>('loading');
  const [dialog, setDialog] = useState<DecisionKind | null>(null);
  const [notice, setNotice] = useState('');

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
      if (dialog === 'REOPEN') await apiMutation(`/api/v1/super-admin/agencies/${detail.id}/reopen`, 'POST', { reason, expectedReviewVersion });
      else await apiMutation(`/api/v1/super-admin/agencies/${detail.id}/review-decisions`, 'POST', { decision: dialog, ...(reason ? { reason } : {}), expectedReviewVersion });
      const done = dialog;
      setDialog(null);
      setNotice(done === 'APPROVE' ? 'Agency approved. Its website is not live until it is also ready.' : done === 'REQUEST_CHANGES' ? 'Change request sent to the owner.' : done === 'REJECT' ? 'Agency rejected.' : 'Agency reopened for review.');
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

  if (state === 'loading') return <main className="admin-page"><p role="status">Loading agency…</p></main>;
  if (state === 'signed-out') return <main className="admin-page"><p>Your session has ended. <Link href="/">Sign in again</Link>.</p></main>;
  if (state === 'not-found') return <main className="admin-page"><p>Agency not found. <Link href="/">Back to the review queue</Link>.</p></main>;
  if (state === 'error' || !detail || !session) return <main className="admin-page"><p className="form-error" role="alert">Could not load this agency. <button type="button" className="text-button" onClick={() => void load()}>Try again</button></p></main>;

  const status = detail.review.status;
  const latest = detail.review.latestReview;
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
            <div><dt>Registered</dt><dd>{formatDate(detail.createdAt)}</dd></div>
            <div><dt>In queue since</dt><dd>{formatDate(detail.review.submittedForReviewAt)}</dd></div>
          </dl>
          <div className="badges">
            <span className={`badge review-${status.toLowerCase()}`}>Review: {REVIEW_LABELS[status] ?? status}</span>
            <span className="badge neutral">Website: not ready (website builder comes later)</span>
          </div>
          <button type="button" className="secondary" disabled title="Available after the website builder">Private preview — available after the website builder</button>
          {latest?.reason && <div className="latest-reason"><p className="eyebrow">Latest reason ({ACTION_LABELS[`REVIEW_${latest.action}`] ?? latest.action})</p><p>{latest.reason}</p></div>}
        </section>

        <section className="panel decision-panel" aria-labelledby="decision-title-area">
          <h2 id="decision-title-area">Decision</h2>
          {status === 'PENDING' && <div className="decision-buttons">
            <button type="button" className="primary-inline" onClick={() => setDialog('APPROVE')}>Approve</button>
            <button type="button" className="secondary" onClick={() => setDialog('REQUEST_CHANGES')}>Request changes</button>
            <button type="button" className="danger" onClick={() => setDialog('REJECT')}>Reject</button>
          </div>}
          {status === 'CHANGES_REQUESTED' && <p>Waiting for the owner to make changes and resubmit for review.</p>}
          {status === 'APPROVED' && <p>This agency is approved. No further review decision is needed.</p>}
          {status === 'REJECTED' && <>
            <p>This agency was rejected. You can reopen it for another manual review.</p>
            <button type="button" className="secondary" onClick={() => setDialog('REOPEN')}>Reopen for review</button>
          </>}
        </section>
      </div>

      <section className="panel" aria-labelledby="history-title">
        <h2 id="history-title">History</h2>
        {detail.history.length === 0 ? <p>No review actions yet.</p> : <ol className="history">
          {detail.history.map((entry, index) => <li key={`${entry.at}-${index}`}>
            <p><strong>{ACTION_LABELS[entry.action] ?? entry.action}</strong> · {formatDate(entry.at)} · by {entry.actorRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Agency owner'}</p>
            <p className="queue-meta">{REVIEW_LABELS[entry.fromStatus]} → {REVIEW_LABELS[entry.toStatus]}</p>
            {entry.reason && <p className="history-reason">{entry.reason}</p>}
          </li>)}
        </ol>}
      </section>
    </main>
    <DecisionDialog kind={dialog} agencyName={detail.agencyName} onCancel={() => setDialog(null)} onConfirm={confirm} />
  </>;
}
