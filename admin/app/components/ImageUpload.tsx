'use client';

import { useId, useState, type ChangeEvent } from 'react';
import { IMAGE_ACCEPT, precheckImage, uploadImage, type MediaPurpose } from '../lib/media';

/**
 * Phase 3d single-image upload (Hero, logo). The upload is only STAGED; the section's own Save attaches it (D-106).
 * Shows the rule near the control and a plain per-file reason on failure (D-060 §4).
 */
export function ImageUpload({ purpose, label, rule, disabled, onUploaded, onBusyChange }: {
  purpose: MediaPurpose; label: string; rule: string; disabled: boolean;
  onUploaded: (mediaId: string) => void; onBusyChange?: (busy: boolean) => void;
}) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function choose(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const problem = precheckImage(file);
    if (problem) { setError(problem); return; }
    setBusy(true); setError(''); onBusyChange?.(true);
    try { onUploaded((await uploadImage(file, purpose)).id); }
    catch (failure) { setError(`${file.name}: ${failure instanceof Error ? failure.message : 'the upload failed.'}`); }
    finally { setBusy(false); onBusyChange?.(false); }
  }
  return <div className="upload-control">
    <label htmlFor={id} className={`secondary upload-button${disabled || busy ? ' disabled' : ''}`}>{busy ? 'Uploading…' : label}</label>
    <input id={id} type="file" accept={IMAGE_ACCEPT} className="visually-hidden" disabled={disabled || busy} onChange={(event) => void choose(event)} aria-describedby={`${id}-rule`} />
    <p className="field-hint" id={`${id}-rule`}>{rule}</p>
    {error && <p className="field-error" role="alert">{error}</p>}
  </div>;
}
