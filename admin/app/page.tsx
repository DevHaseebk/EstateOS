'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { AppShell } from './components/AppShell';
import { Overview } from './components/Overview';
import type { OwnerSession } from './lib/api';

type Mode = 'login' | 'register' | 'recovery';
type Session = OwnerSession;

async function mutation(path: string, method: 'POST' | 'DELETE', body?: Record<string, FormDataEntryValue>) {
  const csrfResponse = await fetch('/api/v1/auth/csrf', { cache: 'no-store' });
  const csrf = await csrfResponse.json();
  if (!csrfResponse.ok) throw new Error(csrf.error?.message ?? 'Authentication is unavailable');
  const response = await fetch(path, {
    method,
    headers: { 'X-CSRF-Token': csrf.data.csrfToken, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(errorMessage(payload));
  return payload;
}

function errorMessage(payload: { error?: { message?: string; details?: Record<string, string> } } | null): string {
  const details = payload?.error?.details ? Object.values(payload.error.details).join(' ') : '';
  return details || payload?.error?.message || 'Request failed';
}

export default function Home() {
  const [mode, setMode] = useState<Mode>('login');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    fetch('/api/v1/owner/session', { cache: 'no-store' })
      .then(async (response) => response.ok ? (await response.json()).data as Session : null)
      .then(setSession).catch(() => setSession(null)).finally(() => setLoading(false));
  }, []);
  const sessionEnded = useCallback(() => { setSession(null); setMode('login'); setNotice('Your session has ended. Please sign in again.'); }, []);
  const refreshSession = useCallback(() => {
    void fetch('/api/v1/owner/session', { cache: 'no-store' })
      .then(async (response) => response.ok ? (await response.json()).data as Session : null)
      .then((next) => { if (next) setSession(next); else sessionEnded(); }).catch(() => undefined);
  }, [sessionEnded]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (mode === 'login') setSession((await mutation('/api/v1/owner/sessions', 'POST', data)).data as Session);
      else if (mode === 'register') {
        await mutation('/api/v1/owner/registrations', 'POST', data);
        setNotice('Your agency is Pending review. Sign in to access your private workspace.'); setMode('login');
      } else {
        await mutation('/api/v1/auth/recovery/complete', 'POST', data);
        setNotice('Password updated. Sign in with your new password.'); setMode('login');
      }
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Request failed'); }
    finally { setBusy(false); }
  }
  if (loading) return <main className="auth-page"><p role="status">Checking your session…</p></main>;
  if (session) return <AppShell session={session} onSignedOut={() => setSession(null)}>
    <Overview session={session} onStatusChange={refreshSession} onSessionEnded={sessionEnded} />
  </AppShell>;
  return <main className="auth-page">
    <section className="auth-intro" aria-label="EstateOS Agency Admin">
      <p className="eyebrow">EstateOS / Agency Admin</p>
      <h1>Manage your agency with a secure sign in.</h1>
      <p>Register your agency, then access your private workspace while your application is Pending review.</p>
      <span className="auth-note">Your website is not public during Pending review.</span>
    </section>
    <section className="auth-card" aria-label="Agency account">
      <div className="auth-tabs"><button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => { setMode('login'); setError(''); }}>Sign in</button>
        <button type="button" className={mode === 'register' ? 'selected' : ''} onClick={() => { setMode('register'); setError(''); }}>Register</button></div>
      <h2>{mode === 'login' ? 'Agency sign in' : mode === 'register' ? 'Create an agency' : 'Use a support reset code'}</h2>
      {mode === 'recovery' && <p>Contact EstateOS support first. Enter the one-time code they give you after identity verification.</p>}
      <form onSubmit={submit}>
        {mode === 'register' && <>
          <label htmlFor="ownerName">Owner full name</label><input id="ownerName" name="ownerName" autoComplete="name" required minLength={2} maxLength={100} />
          <label htmlFor="agencyName">Agency name</label><input id="agencyName" name="agencyName" required minLength={2} maxLength={120} />
          <label htmlFor="mobile">Mobile number</label><input id="mobile" name="mobile" type="tel" autoComplete="tel" required />
          <label htmlFor="whatsapp">WhatsApp number</label><input id="whatsapp" name="whatsapp" type="tel" required />
        </>}
        {mode !== 'recovery' ? <><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} /></> :
          <><label htmlFor="resetCode">One-time reset code</label><input id="resetCode" name="resetCode" autoComplete="off" required /></>}
        <label htmlFor="password">{mode === 'recovery' ? 'New password' : 'Password'}</label>
        <input id="password" name={mode === 'recovery' ? 'newPassword' : 'password'} type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={mode === 'login' ? 1 : 12} />
        {mode !== 'login' && <p className="field-hint">Use at least 12 characters and a password that is hard to guess.</p>}
        <button className="primary" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create Pending agency' : 'Update password'}</button>
      </form>
      <button type="button" className="text-button" onClick={() => { setMode(mode === 'recovery' ? 'login' : 'recovery'); setError(''); }}>
        {mode === 'recovery' ? 'Back to sign in' : 'Have a support reset code?'}</button>
      {error && <p className="form-error" role="alert">{error}</p>}
      {notice && <p className="form-notice" role="status">{notice}</p>}
    </section>
  </main>;
}
