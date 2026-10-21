'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState, type FormEvent } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { ApiError, apiGet, formatDate, RESTRICTION_LABELS, REVIEW_LABELS, websiteLabel } from '../lib/api';

type DirectoryItem = {
  id: string; agencyName: string; ownerName: string | null; ownerEmail: string | null; createdAt: string;
  reviewStatus: string; restrictionStatus: string; websiteReadiness: string; publicationStatus?: string; publicUrl?: string;
};
type Directory = { items: DirectoryItem[]; nextCursor: string | null };
type Session = { user: { name: string } };

export default function AgenciesPage() {
  return <Suspense fallback={<main className="admin-page"><p role="status">Loading agencies…</p></main>}><AgencyDirectory /></Suspense>;
}

// D-070: searchable, status-filtered list; rows on desktop, cards on mobile; one View / Manage link each.
function AgencyDirectory() {
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get('q') ?? '';
  const review = params.get('review') ?? '';
  const restriction = params.get('restriction') ?? '';
  const query = new URLSearchParams(Object.entries({ q, review, restriction }).filter(([, value]) => value)).toString();

  const [session, setSession] = useState<Session | null>(null);
  const [signedOut, setSignedOut] = useState(false);
  const [items, setItems] = useState<DirectoryItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    void apiGet<Session>('/api/v1/super-admin/session').then(setSession).catch(() => setSignedOut(true));
  }, []);

  const fetchPage = useCallback((cursor?: string) => {
    const search = new URLSearchParams(query);
    if (cursor) search.set('cursor', cursor);
    return apiGet<Directory>(`/api/v1/super-admin/agencies${search.size ? `?${search}` : ''}`)
      .then((data) => {
        setItems((current) => cursor ? [...current, ...data.items] : data.items);
        setNextCursor(data.nextCursor); setError('');
      })
      .catch((failure: unknown) => {
        if (failure instanceof ApiError && failure.status === 401) setSignedOut(true);
        else setError(failure instanceof Error ? failure.message : 'Could not load agencies');
      })
      .finally(() => setLoading(false));
  }, [query]);
  useEffect(() => { void fetchPage(); }, [fetchPage]);
  function more() { if (nextCursor) { setLoading(true); void fetchPage(nextCursor); } }

  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const search = String(data.get('q') ?? '').trim();
    if (search.length === 1) { setFormError('Type at least 2 characters to search.'); return; }
    setFormError('');
    const next = new URLSearchParams();
    if (search) next.set('q', search);
    for (const key of ['review', 'restriction']) { const value = String(data.get(key) ?? ''); if (value) next.set(key, value); }
    setLoading(true);
    router.replace(`/agencies${next.size ? `?${next}` : ''}`);
  }

  if (signedOut) return <main className="admin-page"><p>Your session has ended. <Link href="/">Sign in again</Link>.</p></main>;
  const filtered = Boolean(q || review || restriction);
  return <>
    {session && <AdminHeader name={session.user.name} onSignedOut={() => setSignedOut(true)} />}
    <main className="admin-page">
      <h1>All agencies</h1>
      <form className="directory-filters" role="search" onSubmit={apply} key={query}>
        <div className="search-field">
          <label htmlFor="q">Search agency name or owner email</label>
          <input id="q" name="q" type="search" defaultValue={q} maxLength={100} autoComplete="off" />
        </div>
        <div>
          <label htmlFor="review">Review status</label>
          <select id="review" name="review" defaultValue={review} onChange={(event) => event.currentTarget.form?.requestSubmit()}>
            <option value="">Any</option>
            {Object.entries(REVIEW_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="restriction">Account</label>
          <select id="restriction" name="restriction" defaultValue={restriction} onChange={(event) => event.currentTarget.form?.requestSubmit()}>
            <option value="">Any</option>
            {Object.entries(RESTRICTION_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className="filter-actions">
          <button type="submit" className="primary-inline">Search</button>
          {filtered && <Link href="/agencies" className="back-link">Clear</Link>}
        </div>
        {formError && <p className="form-error" role="alert">{formError}</p>}
      </form>

      {error && <p className="form-error" role="alert">{error} <button type="button" className="text-button" onClick={() => { setLoading(true); void fetchPage(); }}>Try again</button></p>}
      {!loading && !error && items.length === 0 && <p className="empty-state">{filtered ? 'No agencies match these filters.' : 'No agencies have registered yet.'}</p>}
      {items.length > 0 && <ul className="queue-list" aria-label="Agencies">
        {items.map((item) => <li key={item.id} className="queue-row directory-row">
          <div>
            <p className="queue-name">{item.agencyName}</p>
            <p className="queue-meta">{item.ownerName ?? 'Owner unknown'}{item.ownerEmail ? ` · ${item.ownerEmail}` : ''} · Registered {formatDate(item.createdAt)}</p>
            <div className="badges">
              <span className={`badge small review-${item.reviewStatus.toLowerCase()}`}>Review: {REVIEW_LABELS[item.reviewStatus] ?? item.reviewStatus}</span>
              {item.restrictionStatus !== 'NONE' && <span className={`badge small account-${item.restrictionStatus.toLowerCase()}`}>Account: {RESTRICTION_LABELS[item.restrictionStatus]}</span>}
              {(() => { const label = websiteLabel(item.publicationStatus, item.websiteReadiness); return <span className={`badge small ${label.tone}`}>Website: {label.text}</span>; })()}
              {item.publicUrl && <a className="badge small neutral" href={item.publicUrl} target="_blank" rel="noopener noreferrer">Open site<span className="visually-hidden"> of {item.agencyName}</span></a>}
            </div>
          </div>
          <Link className="review-link" href={`/agencies/${item.id}`}>View / Manage<span className="visually-hidden"> {item.agencyName}</span></Link>
        </li>)}
      </ul>}
      {loading && <p role="status">Loading…</p>}
      {nextCursor && !loading && <button type="button" className="secondary" onClick={more}>Show more</button>}
    </main>
  </>;
}
