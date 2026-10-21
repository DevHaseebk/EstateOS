'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ApiError, apiGet, apiMutation } from '../lib/api';
import { useUnsavedGuard } from './AppShell';

type OptionalKey = 'description' | 'officeAddress' | 'city' | 'serviceAreas' | 'publicEmail';
type Profile = {
  agencyName: string; ownerName: string; loginEmail: string; mobile: string; whatsapp: string;
  publicContact: { showMobile: boolean; showWhatsapp: boolean };
  profile: Partial<Record<OptionalKey, string>>;
  version: number; updatedAt: string | null; canEdit: boolean;
};
type Form = Omit<Profile, 'loginEmail' | 'version' | 'updatedAt' | 'canEdit' | 'profile'> & { profile: Record<OptionalKey, string> };

const OPTIONAL: { key: OptionalKey; label: string; max: number; multiline?: boolean; type?: string }[] = [
  { key: 'description', label: 'Short description', max: 600, multiline: true },
  { key: 'officeAddress', label: 'Office address', max: 200 },
  { key: 'city', label: 'City', max: 80 },
  { key: 'serviceAreas', label: 'Areas you serve', max: 200 },
  { key: 'publicEmail', label: 'Public email', max: 254, type: 'email' },
];

function toForm(profile: Profile): Form {
  return {
    agencyName: profile.agencyName, ownerName: profile.ownerName, mobile: profile.mobile, whatsapp: profile.whatsapp,
    publicContact: { ...profile.publicContact },
    profile: Object.fromEntries(OPTIONAL.map(({ key }) => [key, profile.profile[key] ?? ''])) as Record<OptionalKey, string>,
  };
}

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: ReactNode; children: ReactNode }) {
  return <div className="field">
    <label htmlFor={id}>{label}</label>
    {children}
    {hint && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
    {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
  </div>;
}

// D-055 one page (essentials visible, more details collapsible); D-100 one Save profile with a Save/Discard/Stay guard.
export function ProfileForm({ onSaved }: { onSaved: () => void }) {
  const [loaded, setLoaded] = useState<Profile | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [saved, setSaved] = useState<Form | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ kind: 'error' | 'notice'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const register = useUnsavedGuard();

  const apply = useCallback((profile: Profile) => {
    const next = toForm(profile);
    setLoaded(profile); setForm(next); setSaved(next);
  }, []);
  const load = useCallback(() => apiGet<Profile>('/api/v1/owner/profile').then(apply)
    .catch((failure: unknown) => setMessage({ kind: 'error', text: failure instanceof Error ? failure.message : 'Could not load your profile' })), [apply]);
  useEffect(() => { void load(); }, [load]);

  const dirty = Boolean(form && saved && JSON.stringify(form) !== JSON.stringify(saved));

  const save = useCallback(async (): Promise<boolean> => {
    if (!form || !loaded) return false;
    setSaving(true); setErrors({}); setMessage(null);
    try {
      const result = await apiMutation<Profile>('/api/v1/owner/profile', 'PUT', { ...form, expectedProfileVersion: loaded.version });
      if (result) apply(result);
      setMessage({ kind: 'notice', text: 'Saved.' });
      onSaved();
      return true;
    } catch (failure) {
      if (failure instanceof ApiError && failure.code === 'PROFILE_CONFLICT') {
        setMessage({ kind: 'error', text: 'These details were changed in another window. Reload to see the latest version. Your typed changes stay here until you reload.' });
      } else if (failure instanceof ApiError && failure.status === 422) {
        setErrors(failure.details);
        setMessage({ kind: 'error', text: 'Please fix the highlighted fields.' });
        if (Object.keys(failure.details).some((key) => key.startsWith('profile.'))) setMoreOpen(true);
      } else {
        setMessage({ kind: 'error', text: failure instanceof Error ? failure.message : 'Could not save. Nothing was changed.' });
      }
      return false;
    } finally { setSaving(false); }
  }, [form, loaded, apply, onSaved]);

  const latest = useRef({ dirty, save });
  useEffect(() => { latest.current = { dirty, save }; }, [dirty, save]);
  useEffect(() => {
    register({ isDirty: () => latest.current.dirty, save: () => latest.current.save() });
    return () => register(null);
  }, [register]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  if (!form || !loaded) return message ? <p className="form-error" role="alert">{message.text}</p> : <p role="status">Loading your agency profile…</p>;
  const readOnly = !loaded.canEdit;
  const set = (patch: Partial<Form>) => setForm({ ...form, ...patch });
  const setOptional = (key: OptionalKey, value: string) => setForm({ ...form, profile: { ...form.profile, [key]: value } });
  const describedBy = (id: string, hint = false) => [hint ? `${id}-hint` : '', errors[id] ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); await save(); }

  return <form className="profile-form" onSubmit={submit} noValidate>
    {readOnly && <p className="form-notice" role="status">Your agency details are view-only right now. Contact EstateOS support if something needs to change.</p>}
    <fieldset disabled={readOnly || saving}>
      <section className="form-section" aria-labelledby="essentials-title">
        <h2 id="essentials-title">Agency and contact</h2>
        <Field id="agencyName" label="Agency name" error={errors.agencyName}>
          <input id="agencyName" value={form.agencyName} onChange={(event) => set({ agencyName: event.target.value })} maxLength={120} required aria-invalid={Boolean(errors.agencyName)} aria-describedby={describedBy('agencyName')} />
        </Field>
        <Field id="ownerName" label="Owner name" error={errors.ownerName}>
          <input id="ownerName" value={form.ownerName} autoComplete="name" onChange={(event) => set({ ownerName: event.target.value })} maxLength={100} required aria-invalid={Boolean(errors.ownerName)} aria-describedby={describedBy('ownerName')} />
        </Field>
        <div className="field-row">
          <Field id="mobile" label="Mobile number" error={errors.mobile}>
            <input id="mobile" type="tel" value={form.mobile} autoComplete="tel" onChange={(event) => set({ mobile: event.target.value })} required aria-invalid={Boolean(errors.mobile)} aria-describedby={describedBy('mobile')} />
          </Field>
          <Field id="whatsapp" label="WhatsApp number" error={errors.whatsapp}>
            <input id="whatsapp" type="tel" value={form.whatsapp} onChange={(event) => set({ whatsapp: event.target.value })} required aria-invalid={Boolean(errors.whatsapp)} aria-describedby={describedBy('whatsapp')} />
          </Field>
        </div>
        <fieldset className="choice-group" aria-describedby="public-contact-hint">
          <legend>Shown on your website</legend>
          <label className="checkbox"><input type="checkbox" checked={form.publicContact.showMobile} onChange={(event) => set({ publicContact: { ...form.publicContact, showMobile: event.target.checked } })} /> Show mobile number</label>
          <label className="checkbox"><input type="checkbox" checked={form.publicContact.showWhatsapp} onChange={(event) => set({ publicContact: { ...form.publicContact, showWhatsapp: event.target.checked } })} /> Show WhatsApp number</label>
          <p className="field-hint" id="public-contact-hint">Nothing is shown publicly until you choose it. At least one is needed before your website can go live.</p>
        </fieldset>
        <Field id="loginEmail" label="Login email" hint="Contact EstateOS support to change it.">
          <input id="loginEmail" value={loaded.loginEmail} readOnly aria-describedby="loginEmail-hint" />
        </Field>
      </section>

      <section className="form-section" aria-labelledby="more-title">
        <h2 id="more-title" className="section-toggle-title">
          <button type="button" className="section-toggle" aria-expanded={moreOpen} aria-controls="more-details" onClick={() => setMoreOpen((open) => !open)}>
            More details <span className="field-hint">(optional)</span>
          </button>
        </h2>
        <div id="more-details" hidden={!moreOpen}>
          {OPTIONAL.map(({ key, label, max, multiline, type }) => {
            const id = `profile.${key}`;
            const value = form.profile[key];
            const counter = multiline ? `${value.trim().length} / ${max} characters` : undefined;
            return <Field key={key} id={id} label={label} error={errors[id]} hint={counter}>
              {multiline
                ? <textarea id={id} value={value} rows={4} maxLength={max} onChange={(event) => setOptional(key, event.target.value)} aria-invalid={Boolean(errors[id])} aria-describedby={describedBy(id, Boolean(counter))} />
                : <input id={id} type={type ?? 'text'} value={value} maxLength={max} onChange={(event) => setOptional(key, event.target.value)} aria-invalid={Boolean(errors[id])} aria-describedby={describedBy(id)} />}
            </Field>;
          })}
        </div>
      </section>
    </fieldset>

    {!readOnly && <div className="form-actions">
      <button type="submit" className="primary-inline" disabled={!dirty || saving}>{saving ? 'Saving…' : 'Save profile'}</button>
      {dirty && !saving && <span className="field-hint">You have unsaved changes.</span>}
    </div>}
    {message && <p className={message.kind === 'error' ? 'form-error' : 'form-notice'} role={message.kind === 'error' ? 'alert' : 'status'}>{message.text}</p>}
  </form>;
}
