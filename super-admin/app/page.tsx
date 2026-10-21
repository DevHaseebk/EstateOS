'use client';

import { useEffect, useState, type FormEvent } from 'react';

type Session = { user: { id: string; name: string; role: string } };
async function mutation(path: string, method: 'POST' | 'DELETE', body?: Record<string, FormDataEntryValue>) {
  const csrfResponse = await fetch('/api/v1/auth/csrf', { cache: 'no-store' });
  const csrf = await csrfResponse.json();
  if (!csrfResponse.ok) throw new Error(csrf.error?.message ?? 'Authentication is unavailable');
  const response = await fetch(path, { method,
    headers: { 'X-CSRF-Token': csrf.data.csrfToken, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined });
  const payload = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(errorMessage(payload));
  return payload;
}

function errorMessage(payload: { error?: { message?: string; details?: Record<string, string> } } | null): string {
  const details = payload?.error?.details ? Object.values(payload.error.details).join(' ') : '';
  return details || payload?.error?.message || 'Request failed';
}

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [mode, setMode] = useState<'login' | 'recovery'>('login');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    fetch('/api/v1/super-admin/session', { cache: 'no-store' })
      .then(async (response) => response.ok ? (await response.json()).data as Session : null)
      .then(setSession).catch(() => setSession(null)).finally(() => setLoading(false));
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (mode === 'login') setSession((await mutation('/api/v1/super-admin/sessions', 'POST', data)).data as Session);
      else { await mutation('/api/v1/auth/recovery/complete', 'POST', data); setNotice('Password updated. Sign in with your new password.'); setMode('login'); }
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Request failed'); }
    finally { setBusy(false); }
  }
  async function logout() {
    setBusy(true); setError('');
    try { await mutation('/api/v1/super-admin/session', 'DELETE'); setSession(null); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not sign out'); }
    finally { setBusy(false); }
  }
  return <main className="auth-page">
    <section className="auth-intro" aria-label="EstateOS Super Admin">
      <p className="eyebrow">EstateOS / Super Admin</p>
      <h1>Platform access, secured.</h1>
      <p>This separate management portal is for authorized Super Admin accounts only.</p>
      <span className="auth-note">Account setup is handled through a controlled operator process.</span>
    </section>
    <section className="auth-card" aria-label="Super Admin account">
      {loading ? <p role="status">Checking your session…</p> : session ? <>
        <p className="eyebrow">Signed in</p><h2>Welcome, {session.user.name}</h2>
        <p>Review and approval controls are outside this milestone.</p>
        <button type="button" className="primary" disabled={busy} onClick={logout}>Sign out</button>
      </> : <>
        <h2>{mode === 'login' ? 'Super Admin sign in' : 'Use a support reset code'}</h2>
        {mode === 'recovery' && <p>Use the one-time code issued after support verifies your identity and records a second approver.</p>}
        <form onSubmit={submit}>
          {mode === 'login' ? <><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required /></> :
            <><label htmlFor="resetCode">One-time reset code</label><input id="resetCode" name="resetCode" autoComplete="off" required /></>}
          <label htmlFor="password">{mode === 'login' ? 'Password' : 'New password'}</label>
          <input id="password" name={mode === 'login' ? 'password' : 'newPassword'} type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={mode === 'login' ? 1 : 12} required />
          <button className="primary" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Update password'}</button>
        </form>
        <button type="button" className="text-button" onClick={() => { setMode(mode === 'login' ? 'recovery' : 'login'); setError(''); }}>
          {mode === 'login' ? 'Have a support reset code?' : 'Back to sign in'}</button>
      </>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {notice && <p className="form-notice" role="status">{notice}</p>}
    </section>
  </main>;
}
