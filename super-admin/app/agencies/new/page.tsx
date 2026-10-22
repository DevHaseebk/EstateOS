'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { AdminHeader } from '../../components/AdminHeader';
import { InvitationLink, type Invitation } from '../../components/InvitationLink';
import { ApiError, apiGet, apiMutation } from '../../lib/api';

type Session = { user: { name: string } };
type Created = { agency: { id: string }; invitation: Invitation };
const FIELDS = [
  { name: 'agencyName', label: 'Agency name', type: 'text', autoComplete: 'organization', max: 120 },
  { name: 'ownerName', label: 'Owner name', type: 'text', autoComplete: 'name', max: 100 },
  { name: 'email', label: 'Owner email', type: 'email', autoComplete: 'email', max: 254 },
  { name: 'mobile', label: 'Mobile', type: 'tel', autoComplete: 'tel', max: 20 },
  { name: 'whatsapp', label: 'WhatsApp', type: 'tel', autoComplete: 'tel', max: 20 },
] as const;

// Phase 6a (D-028/D-118): EstateOS creates a Pending agency; the owner chooses their own password through a one-time link.
export default function CreateAgencyPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [signedOut, setSignedOut] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [created, setCreated] = useState<Created | null>(null);

  useEffect(() => { void apiGet<Session>('/api/v1/super-admin/session').then(setSession).catch(() => setSignedOut(true)); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    setSaving(true); setErrors({}); setError('');
    try {
      setCreated(await apiMutation<Created>('/api/v1/super-admin/agencies', 'POST', data));
    } catch (failure) {
      if (failure instanceof ApiError && failure.status === 401) setSignedOut(true);
      else if (failure instanceof ApiError && failure.code === 'EMAIL_EXISTS') setErrors({ email: 'This email already has an EstateOS account.' });
      else if (failure instanceof ApiError && Object.keys(failure.details).length) setErrors(failure.details);
      else setError(failure instanceof Error ? failure.message : 'Could not create the agency');
    } finally { setSaving(false); }
  }

  if (signedOut) return <main className="admin-page"><p>Your session has ended. <Link href="/">Sign in again</Link>.</p></main>;
  return <>
    {session && <AdminHeader name={session.user.name} onSignedOut={() => setSignedOut(true)} />}
    <main className="admin-page">
      <p><Link href="/agencies" className="back-link">← All agencies</Link></p>
      <h1>Create agency</h1>
      {created ? <section className="panel" aria-labelledby="created-title">
        <h2 id="created-title">Agency created</h2>
        <p>The agency is <strong>Pending review</strong>. The owner cannot sign in until they open this link and choose a password.</p>
        <InvitationLink invitation={created.invitation} />
        <p><Link href={`/agencies/${created.agency.id}`} className="back-link">Open the agency</Link></p>
      </section> : <section className="panel">
        <p>Enter the owner&apos;s details. You never choose or see their password: they set it themselves through a one-time link you send them.</p>
        <form className="stack-form" onSubmit={(event) => void submit(event)} noValidate>
          {FIELDS.map((field) => <div key={field.name} className="field">
            <label htmlFor={field.name}>{field.label}</label>
            <input id={field.name} name={field.name} type={field.type} autoComplete={field.autoComplete} maxLength={field.max} required
              aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} />
            {errors[field.name] && <p className="form-error" id={`${field.name}-error`}>{errors[field.name]}</p>}
          </div>)}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="primary-inline" disabled={saving}>{saving ? 'Creating…' : 'Create agency and invitation'}</button>
        </form>
      </section>}
    </main>
  </>;
}
