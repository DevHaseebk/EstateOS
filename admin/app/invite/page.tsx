'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ApiError, apiMutation } from '../lib/api';

type Preview = { agencyName: string; email: string };
type State = { kind: 'checking' } | { kind: 'invalid' } | { kind: 'ready'; code: string; preview: Preview } | { kind: 'done'; email: string };

/**
 * Phase 6a (D-118): the owner of an agency created by EstateOS claims the account with a one-time link and chooses their
 * own password. The code is read from the URL fragment (never sent to a server in the URL) and then removed from the address bar.
 */
export default function InvitePage() {
  const [state, setState] = useState<State>({ kind: 'checking' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  // Kept across React's development double effect run, which would otherwise see the already-cleared fragment.
  const codeRef = useRef<string | null>(null);

  useEffect(() => {
    if (codeRef.current === null) {
      codeRef.current = window.location.hash.slice(1);
      window.history.replaceState(null, '', window.location.pathname);
    }
    const code = codeRef.current;
    if (!/^[A-Za-z0-9_-]{32,128}$/.test(code)) { setState({ kind: 'invalid' }); return; }
    apiMutation<Preview>('/api/v1/auth/invitations/preview', 'POST', { invitationCode: code })
      .then((preview) => setState({ kind: 'ready', code, preview: preview! }))
      .catch(() => setState({ kind: 'invalid' }));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.kind !== 'ready') return;
    const data = new FormData(event.currentTarget);
    const newPassword = String(data.get('newPassword') ?? '');
    if (newPassword !== String(data.get('confirmPassword') ?? '')) { setError('The two passwords do not match.'); return; }
    setBusy(true); setError('');
    try {
      await apiMutation('/api/v1/auth/invitations/claim', 'POST', { invitationCode: state.code, newPassword });
      setState({ kind: 'done', email: state.preview.email });
    } catch (failure) {
      if (failure instanceof ApiError && failure.code === 'INVALID_INVITATION') setState({ kind: 'invalid' });
      else if (failure instanceof ApiError && failure.details.newPassword) setError(failure.details.newPassword);
      else setError(failure instanceof Error ? failure.message : 'Could not set your password');
    } finally { setBusy(false); }
  }

  return <main className="auth-page">
    <section className="auth-intro" aria-label="EstateOS Agency Admin">
      <p className="eyebrow">EstateOS / Agency Admin</p>
      <h1>Activate your agency account.</h1>
      <p>EstateOS set up your agency. Choose your own password to start using your private workspace.</p>
    </section>
    <section className="auth-card" aria-live="polite">
      {state.kind === 'checking' && <p role="status">Checking your invitation…</p>}
      {state.kind === 'invalid' && <>
        <h2>This link cannot be used</h2>
        <p>This link is invalid or has expired. Ask EstateOS support for a new one.</p>
        <Link href="/" className="text-button">Go to sign in</Link>
      </>}
      {state.kind === 'done' && <>
        <h2>Your account is ready</h2>
        <p className="form-notice" role="status">Sign in with {state.email} and your new password.</p>
        <Link href="/" className="primary link-button">Go to sign in</Link>
      </>}
      {state.kind === 'ready' && <>
        <h2>Choose your password</h2>
        <dl className="invite-facts">
          <div><dt>Agency</dt><dd>{state.preview.agencyName}</dd></div>
          <div><dt>Your email</dt><dd>{state.preview.email}</dd></div>
        </dl>
        <form onSubmit={(event) => void submit(event)}>
          <input type="email" name="username" autoComplete="username" value={state.preview.email} readOnly hidden />
          <label htmlFor="newPassword">New password</label>
          <input id="newPassword" name="newPassword" type="password" autoComplete="new-password" required minLength={12} maxLength={128} />
          <label htmlFor="confirmPassword">Repeat the password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required minLength={12} maxLength={128} />
          <p className="field-hint">Use at least 12 characters and a password that is hard to guess.</p>
          <button className="primary" disabled={busy}>{busy ? 'Please wait…' : 'Activate my account'}</button>
        </form>
        {error && <p className="form-error" role="alert">{error}</p>}
      </>}
    </section>
  </main>;
}
