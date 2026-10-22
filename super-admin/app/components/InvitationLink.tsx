'use client';

import { useState } from 'react';
import { formatDate } from '../lib/api';

export type Invitation = { url: string; expiresAt: string };

/** Phase 6a (D-118): the one-time owner link, shown once. The Super Admin delivers it personally. */
export function InvitationLink({ invitation }: { invitation: Invitation }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(invitation.url); setCopied(true); }
    catch { setCopied(false); }
  }
  return <div className="invitation-box" role="region" aria-label="Owner invitation link">
    <label htmlFor="invitation-url">Invitation link</label>
    <div className="invitation-row">
      <input id="invitation-url" type="text" readOnly value={invitation.url} onFocus={(event) => event.currentTarget.select()} />
      <button type="button" className="primary-inline" onClick={() => void copy()}>{copied ? 'Copied' : 'Copy link'}</button>
    </div>
    <p className="queue-meta">Single use · expires {formatDate(invitation.expiresAt)}</p>
    <p><strong>Send this link to the owner yourself. It is shown only once.</strong></p>
  </div>;
}
