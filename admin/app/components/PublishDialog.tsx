'use client';

import { useEffect, useRef, useState } from 'react';
import type { WebsiteData } from 'site-template';
import { ApiError, apiMutation } from '../lib/api';

type Publication = NonNullable<WebsiteData['publication']>;

/**
 * Phase 4b (D-053, D-087): a deliberate confirmation before publishing the saved draft. Success is shown only after the
 * server confirms. The request id is kept until success, so "Try again" can never publish twice.
 */
export function PublishDialog({ open, liveRevision, onClose, onPublished, onStale }: {
  open: boolean; liveRevision: number; onClose: () => void; onPublished: (publication: Publication) => void; onStale: (message: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const requestId = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  async function publish() {
    requestId.current ??= crypto.randomUUID();
    setBusy(true); setError('');
    try {
      const result = await apiMutation<{ publication: Publication }>('/api/v1/owner/website/publish', 'POST', { expectedLiveRevision: liveRevision, requestId: requestId.current });
      requestId.current = null;
      if (result) onPublished(result.publication);
    } catch (failure) {
      if (failure instanceof ApiError && (failure.status === 409 || failure.status === 422 || failure.status === 403)) {
        requestId.current = null;
        const details = Object.values(failure.details);
        onStale(details.length ? `${failure.message} ${details.join(' ')}` : failure.message);
      } else {
        setError(failure instanceof Error ? failure.message : 'Publishing failed. Your live website and saved changes are unchanged. Please try again.');
      }
    } finally { setBusy(false); }
  }

  return <dialog ref={dialog} className="confirm-dialog" aria-labelledby="publish-title" onCancel={(event) => { event.preventDefault(); if (!busy) { setError(''); onClose(); } }}>
    <h2 id="publish-title">Publish your saved changes?</h2>
    <p>Your live website will be updated with everything you have saved. Visitors will see it right away.</p>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="dialog-actions">
      <button type="button" className="secondary" disabled={busy} onClick={() => { setError(''); onClose(); }}>Cancel</button>
      <button type="button" className="primary-inline" disabled={busy} onClick={() => void publish()}>{busy ? 'Publishing…' : error ? 'Try again' : 'Publish'}</button>
    </div>
  </dialog>;
}
