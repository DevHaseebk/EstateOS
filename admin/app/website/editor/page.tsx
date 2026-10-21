'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { HERO_IMAGE_SRC, type WebsiteData } from 'site-template';
import { useGuardedAction, useUnsavedGuard } from '../../components/AppShell';
import { OwnerPage } from '../../components/OwnerPage';
import { ApiError, apiMutation } from '../../lib/api';
import { useWebsite } from '../../lib/website';

type SectionKey = 'header' | 'hero' | 'contact';
type Values = Record<string, string>;
const SECTIONS: { key: SectionKey | 'footer'; label: string; hint: string }[] = [
  { key: 'header', label: 'Header', hint: 'Agency name and contact button' },
  { key: 'hero', label: 'Hero', hint: 'Main heading, photo and button' },
  { key: 'contact', label: 'Contact', hint: 'Contact heading and message' },
  { key: 'footer', label: 'Footer', hint: 'Built from your Agency profile' },
];

function valuesFor(website: WebsiteData, key: SectionKey): Values {
  const { header, hero, contact } = website.sections;
  if (key === 'header') return { contactButtonLabel: header.contactButtonLabel, preferredContact: header.preferredContact ?? '' };
  if (key === 'hero') return { heading: hero.heading, subtitle: hero.subtitle ?? '', ctaLabel: hero.ctaLabel, heroImageId: hero.heroImageId ?? '' };
  return { heading: contact.heading, message: contact.message ?? '' };
}
function bodyFor(key: SectionKey, values: Values, expectedVersion: number) {
  if (key === 'header') return { contactButtonLabel: values.contactButtonLabel, preferredContact: values.preferredContact || null, expectedVersion };
  if (key === 'hero') return { heading: values.heading, subtitle: values.subtitle, ctaLabel: values.ctaLabel, heroImageId: values.heroImageId || null, expectedVersion };
  return { heading: values.heading, message: values.message, expectedVersion };
}

function TextField({ id, label, value, onChange, max, error, multiline, disabled, hint }: {
  id: string; label: string; value: string; onChange: (value: string) => void; max: number; error?: string; multiline?: boolean; disabled: boolean; hint?: string;
}) {
  const describedBy = [`${id}-count`, error ? `${id}-error` : ''].filter(Boolean).join(' ');
  const props = { id, value, maxLength: max, disabled, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy };
  return <div className="field">
    <label htmlFor={id}>{label}</label>
    {multiline ? <textarea {...props} rows={3} onChange={(event) => onChange(event.target.value)} /> : <input {...props} onChange={(event) => onChange(event.target.value)} />}
    <p className="field-hint" id={`${id}-count`}>{hint ? `${hint} · ` : ''}{value.trim().length} / {max} characters</p>
    {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
  </div>;
}

// D-050: one section at a time with its own Save changes. D-051: leaving with unsaved edits asks Save / Discard / Stay (shell guard).
function SectionForm({ website, sectionKey, onSaved }: { website: WebsiteData; sectionKey: SectionKey; onSaved: (website: WebsiteData) => void }) {
  const [saved, setSaved] = useState<Values>(() => valuesFor(website, sectionKey));
  const [values, setValues] = useState<Values>(saved);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ kind: 'error' | 'notice'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const register = useUnsavedGuard();
  const dirty = JSON.stringify(values) !== JSON.stringify(saved);
  const readOnly = !website.canEdit;

  const save = useCallback(async (): Promise<boolean> => {
    setSaving(true); setErrors({}); setMessage(null);
    try {
      const result = await apiMutation<{ section: WebsiteData['sections'][SectionKey]; readiness: WebsiteData['readiness'] }>(
        `/api/v1/owner/website/sections/${sectionKey}`, 'PUT', bodyFor(sectionKey, values, website.sections[sectionKey].version));
      if (!result) return false;
      const next = { ...website, sections: { ...website.sections, [sectionKey]: result.section }, readiness: result.readiness } as WebsiteData;
      const nextValues = valuesFor(next, sectionKey);
      setSaved(nextValues); setValues(nextValues);
      setMessage({ kind: 'notice', text: 'Saved. Your changes are in your private draft.' });
      onSaved(next);
      return true;
    } catch (failure) {
      if (failure instanceof ApiError && failure.code === 'SECTION_CONFLICT') setMessage({ kind: 'error', text: 'This section was changed in another window. Reload the page to see the latest version. Your typed changes stay here until you reload.' });
      else if (failure instanceof ApiError && failure.status === 422) { setErrors(failure.details); setMessage({ kind: 'error', text: 'Please fix the highlighted fields.' }); }
      else setMessage({ kind: 'error', text: failure instanceof Error ? failure.message : 'Could not save. Nothing was changed.' });
      return false;
    } finally { setSaving(false); }
  }, [sectionKey, values, website, onSaved]);

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

  const set = (key: string) => (value: string) => setValues({ ...values, [key]: value });
  const disabled = readOnly || saving;
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); await save(); }
  const { mapped } = website;

  return <form className="profile-form" onSubmit={submit} noValidate>
    <section className="form-section">
      {sectionKey === 'header' && <>
        <h2>Header</h2>
        <p className="field-hint">Your agency name ({mapped.agencyName}) is shown as the site name. A logo upload comes in a later phase.</p>
        <TextField id="contactButtonLabel" label="Contact button text" value={values.contactButtonLabel} onChange={set('contactButtonLabel')} max={30} error={errors.contactButtonLabel} disabled={disabled} />
        <div className="field">
          <label htmlFor="preferredContact">Contact button opens</label>
          <select id="preferredContact" value={values.preferredContact} disabled={disabled} onChange={(event) => set('preferredContact')(event.target.value)} aria-invalid={Boolean(errors.preferredContact)}>
            <option value="">Automatic (WhatsApp if shown, otherwise phone)</option>
            {mapped.whatsapp && <option value="WHATSAPP">WhatsApp</option>}
            {mapped.phone && <option value="PHONE">Phone call</option>}
          </select>
          {errors.preferredContact && <p className="field-error">{errors.preferredContact}</p>}
          {!mapped.phone && !mapped.whatsapp && <p className="field-hint">No number is shown on your website yet. <Link href="/profile">Choose one in Agency profile</Link>.</p>}
        </div>
      </>}
      {sectionKey === 'hero' && <>
        <h2>Hero</h2>
        <TextField id="heading" label="Main heading" value={values.heading} onChange={set('heading')} max={80} error={errors.heading} disabled={disabled} hint="Required, at least 3 characters" />
        <TextField id="subtitle" label="Short subtitle (optional)" value={values.subtitle} onChange={set('subtitle')} max={160} error={errors.subtitle} multiline disabled={disabled} />
        <TextField id="ctaLabel" label="Button text" value={values.ctaLabel} onChange={set('ctaLabel')} max={30} error={errors.ctaLabel} disabled={disabled} hint="The button scrolls to your contact details" />
        <fieldset className="choice-group">
          <legend>Main photo</legend>
          {website.heroDefaults.length === 0
            ? <p className="field-hint">No platform photos are available yet. EstateOS will add licensed photos soon; photo upload comes in a later phase.</p>
            : <div className="photo-grid">
              {website.heroDefaults.map((photo) => <label key={photo.id} className={`photo-option${values.heroImageId === photo.id ? ' selected' : ''}`}>
                <input type="radio" name="heroImageId" value={photo.id} checked={values.heroImageId === photo.id} disabled={disabled} onChange={() => set('heroImageId')(photo.id)} />
                {HERO_IMAGE_SRC[photo.id] ? <Image src={HERO_IMAGE_SRC[photo.id]} alt="" width={320} height={200} /> : <span className="photo-missing" />}
                <span>{photo.label}</span>
              </label>)}
            </div>}
          {errors.heroImageId && <p className="field-error">{errors.heroImageId}</p>}
        </fieldset>
      </>}
      {sectionKey === 'contact' && <>
        <h2>Contact</h2>
        <TextField id="contactHeading" label="Heading" value={values.heading} onChange={set('heading')} max={80} error={errors.heading} disabled={disabled} />
        <TextField id="message" label="Short message (optional)" value={values.message} onChange={set('message')} max={300} error={errors.message} multiline disabled={disabled} />
        <div className="readonly-box">
          <p className="status-label">Shown contact details (from Agency profile)</p>
          <ul>
            {mapped.whatsapp && <li>WhatsApp: {mapped.whatsapp}</li>}
            {mapped.phone && <li>Phone: {mapped.phone}</li>}
            {mapped.publicEmail && <li>Email: {mapped.publicEmail}</li>}
            {(mapped.officeAddress || mapped.city) && <li>Office: {[mapped.officeAddress, mapped.city].filter(Boolean).join(', ')}</li>}
            {!mapped.whatsapp && !mapped.phone && !mapped.publicEmail && <li>None yet.</li>}
          </ul>
          <Link href="/profile">Change these in Agency profile</Link>
        </div>
      </>}
    </section>
    {!readOnly && <div className="form-actions">
      <button type="submit" className="primary-inline" disabled={!dirty || saving}>{saving ? 'Saving…' : 'Save changes'}</button>
      {dirty && !saving && <span className="field-hint">You have unsaved changes in this section.</span>}
    </div>}
    {message && <p className={message.kind === 'error' ? 'form-error' : 'form-notice'} role={message.kind === 'error' ? 'alert' : 'status'}>{message.text}</p>}
  </form>;
}

function Editor() {
  const router = useRouter();
  const params = useSearchParams();
  const guarded = useGuardedAction();
  const { website, setWebsite, error } = useWebsite();
  const requested = params.get('section');
  const current = SECTIONS.some((section) => section.key === requested) ? requested as SectionKey | 'footer' : 'hero';
  if (!website) return error ? <p className="form-error" role="alert">{error}</p> : <p role="status">Loading your website…</p>;
  const { mapped } = website;
  return <div className="editor-layout">
    <nav className="section-list" aria-label="Website sections">
      {SECTIONS.map((section) => <button key={section.key} type="button" aria-current={current === section.key ? 'true' : undefined}
        onClick={() => guarded(() => router.replace(`/website/editor?section=${section.key}`))}>
        <strong>{section.label}</strong><span>{section.hint}</span>
      </button>)}
      <button type="button" className="secondary" onClick={() => guarded(() => router.push('/website/preview'))}>Preview website</button>
    </nav>
    <div className="editor-main">
      {current === 'footer'
        ? <section className="form-section">
          <h2>Footer</h2>
          <p>The footer shows your agency name, office location and the contact details you chose to show. It always appears and cannot be hidden.</p>
          <div className="readonly-box">
            <ul>
              <li>Name: {mapped.agencyName}</li>
              {(mapped.officeAddress || mapped.city) && <li>Office: {[mapped.officeAddress, mapped.city].filter(Boolean).join(', ')}</li>}
              {mapped.phone && <li>Phone: {mapped.phone}</li>}
              {mapped.whatsapp && <li>WhatsApp: {mapped.whatsapp}</li>}
              {mapped.publicEmail && <li>Email: {mapped.publicEmail}</li>}
            </ul>
            <Link href="/profile">Change these in Agency profile</Link>
          </div>
        </section>
        : <SectionForm key={current} website={website} sectionKey={current} onSaved={setWebsite} />}
    </div>
  </div>;
}

export default function EditorPage() {
  return <OwnerPage>{() => <div className="page page-wide">
    <h1>Edit website</h1>
    <p className="page-intro">Choose a section, make changes and save it. Saved changes stay private until your website goes live.</p>
    <Suspense fallback={<p role="status">Loading…</p>}><Editor /></Suspense>
  </div>}</OwnerPage>;
}
