'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';

export type DecisionKind = 'APPROVE' | 'REQUEST_CHANGES' | 'REJECT' | 'REOPEN';

const COPY: Record<DecisionKind, { title: string; confirm: string; body: string; danger?: boolean }> = {
  APPROVE: {
    title: 'Approve this agency?',
    confirm: 'Approve agency',
    body: 'Approval does not publish the website. The site only goes live automatically once the website is also ready.',
  },
  REQUEST_CHANGES: {
    title: 'Request changes?',
    confirm: 'Send change request',
    body: 'The owner will see your reason and can resubmit the agency for review.',
  },
  REJECT: {
    title: 'Reject this agency?',
    confirm: 'Reject agency',
    body: 'The owner will see your reason. A Super Admin can reopen a rejected agency later.',
    danger: true,
  },
  REOPEN: {
    title: 'Reopen for review?',
    confirm: 'Reopen for review',
    body: 'The agency returns to the Pending review queue. Reopening does not approve it.',
  },
};

// D-066: one focused confirmation per action (dialog on desktop, bottom sheet on mobile); reason required where D-022 says so.
export function DecisionDialog({ kind, agencyName, onCancel, onConfirm }: {
  kind: DecisionKind | null;
  agencyName: string;
  onCancel: () => void;
  onConfirm: (reason?: string) => Promise<void>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reasonId = useId();
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const needsReason = kind !== null && kind !== 'APPROVE';
  const length = reason.trim().length;

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (kind && !element.open) { setReason(''); setError(''); element.showModal(); }
    if (!kind && element.open) element.close();
  }, [kind]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (needsReason && (length < 10 || length > 1000)) { setError('Please write a reason between 10 and 1000 characters.'); return; }
    setBusy(true); setError('');
    try { await onConfirm(needsReason ? reason.trim() : undefined); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'The action failed. Nothing was changed.'); }
    finally { setBusy(false); }
  }

  const copy = kind ? COPY[kind] : null;
  return <dialog ref={dialog} className="decision-dialog" aria-labelledby="decision-title" onCancel={(event) => { event.preventDefault(); if (!busy) onCancel(); }}>
    {copy && <form onSubmit={submit}>
      <h2 id="decision-title">{copy.title}</h2>
      <p className="dialog-agency">{agencyName}</p>
      <p>{copy.body}</p>
      {needsReason && <>
        <label htmlFor={reasonId}>Reason (shown to the agency owner)</label>
        <textarea id={reasonId} value={reason} onChange={(event) => setReason(event.target.value)} rows={5} maxLength={1000} required aria-describedby={`${reasonId}-count`} />
        <p id={`${reasonId}-count`} className="field-hint">{length} / 1000 characters (minimum 10)</p>
      </>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="dialog-actions">
        <button type="button" className="secondary" disabled={busy} onClick={onCancel}>Cancel</button>
        <button type="submit" className={copy.danger ? 'danger' : 'primary-inline'} disabled={busy}>{busy ? 'Please wait…' : copy.confirm}</button>
      </div>
    </form>}
  </dialog>;
}
