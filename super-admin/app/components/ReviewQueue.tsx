'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { apiGet, formatDate, REVIEW_LABELS } from '../lib/api';

type QueueItem = { id: string; agencyName: string; ownerName: string | null; submittedForReviewAt: string; reviewStatus: string };
type Queue = { items: QueueItem[]; nextCursor: string | null; counts: Record<string, number> };

// D-064: Pending review queue first; one Review action per agency; no analytics.
export function ReviewQueue() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPage = useCallback((cursor?: string) =>
    apiGet<Queue>(`/api/v1/super-admin/review-queue${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`)
      .then((data) => {
        setItems((current) => cursor ? [...current, ...data.items] : data.items);
        setCounts(data.counts); setNextCursor(data.nextCursor);
      })
      .catch((failure: unknown) => setError(failure instanceof Error ? failure.message : 'Could not load the review queue'))
      .finally(() => setLoading(false)), []);
  useEffect(() => { void fetchPage(); }, [fetchPage]);
  function load(cursor?: string) { setLoading(true); setError(''); void fetchPage(cursor); }

  return <section aria-labelledby="queue-title">
    <div className="section-head">
      <h1 id="queue-title">Agencies waiting for review</h1>
      <p className="queue-count" aria-live="polite">{counts.PENDING ?? 0} pending</p>
    </div>
    {error && <p className="form-error" role="alert">{error} <button type="button" className="text-button" onClick={() => void load()}>Try again</button></p>}
    {!loading && !error && items.length === 0 && <p className="empty-state">No agencies are waiting for review.</p>}
    {items.length > 0 && <ul className="queue-list">
      {items.map((item) => <li key={item.id} className="queue-row">
        <div>
          <p className="queue-name">{item.agencyName}</p>
          <p className="queue-meta">{item.ownerName ?? 'Owner unknown'} · Waiting since {formatDate(item.submittedForReviewAt)}</p>
        </div>
        <Link className="review-link" href={`/agencies/${item.id}`}>Review<span className="visually-hidden"> {item.agencyName}</span></Link>
      </li>)}
    </ul>}
    {loading && <p role="status">Loading…</p>}
    {nextCursor && !loading && <button type="button" className="secondary" onClick={() => void load(nextCursor)}>Show more</button>}
    <dl className="status-counts" aria-label="Agencies by review status">
      {(['CHANGES_REQUESTED', 'APPROVED', 'REJECTED'] as const).map((status) => <div key={status}>
        <dt>{REVIEW_LABELS[status]}</dt><dd>{counts[status] ?? 0}</dd>
      </div>)}
    </dl>
  </section>;
}
