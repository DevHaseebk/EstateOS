'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { AdminHeader } from './components/AdminHeader';
import { ReviewQueue } from './components/ReviewQueue';
import { apiMutation } from './lib/api';

type Session = { user: { id: string; name: string; role: string } };

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
      if (mode === 'login') setSession(await apiMutation<Session>('/api/v1/super-admin/sessions', 'POST', data));
      else { await apiMutation('/api/v1/auth/recovery/complete', 'POST', data); setNotice('Password updated. Sign in with your new password.'); setMode('login'); }
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Request failed'); }
    finally { setBusy(false); }
  }
  if (loading) return <main className="admin-page"><p role="status">Checking your session…</p></main>;
  if (session) return <>
    <AdminHeader name={session.user.name} onSignedOut={() => setSession(null)} />
    <main className="admin-page"><ReviewQueue /></main>
  </>;
  return <main className="auth-page">
    <section className="auth-intro" aria-label="EstateOS Super Admin">
      <p className="eyebrow">EstateOS / Super Admin</p>
      <h1>Platform access, secured.</h1>
      <p>This separate management portal is for authorized Super Admin accounts only.</p>
      <span className="auth-note">Account setup is handled through a controlled operator process.</span>
    </section>
    <section className="auth-card" aria-label="Super Admin account">
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
      {error && <p className="form-error" role="alert">{error}</p>}
      {notice && <p className="form-notice" role="status">{notice}</p>}
    </section>
  </main>;
}
