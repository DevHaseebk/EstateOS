'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, type FormEvent, type ReactNode } from 'react';
import { HERO_IMAGE_SRC, ICON_LABELS, OPTIONAL_SECTION_LABELS, SITE_ICONS, SiteIconGlyph, type LayoutData, type OptionalSection, type SiteIcon, type WebsiteData } from 'site-template';
import { apiMutation } from '../../lib/api';
import { useDraftForm } from './useDraftForm';

type Sections = WebsiteData['sections'];
type SaveResult<K extends keyof Sections> = { section: Sections[K]; readiness: WebsiteData['readiness'] };
type OnSaved = (website: WebsiteData) => void;

async function saveSection<K extends keyof Sections>(website: WebsiteData, key: K, body: object, onSaved: OnSaved): Promise<WebsiteData> {
  const result = await apiMutation<SaveResult<K>>(`/api/v1/owner/website/sections/${key}`, 'PUT', { ...body, expectedVersion: website.sections[key].version });
  if (!result) throw new Error('Could not save. Nothing was changed.');
  const next = { ...website, sections: { ...website.sections, [key]: result.section }, readiness: result.readiness };
  onSaved(next);
  return next;
}
const move = <T,>(list: T[], index: number, offset: -1 | 1): T[] => {
  const target = index + offset;
  if (target < 0 || target >= list.length) return list;
  const copy = [...list];
  [copy[index], copy[target]] = [copy[target]!, copy[index]!];
  return copy;
};

export function TextField({ id, label, value, onChange, max, error, multiline, disabled, hint, counter = true }: {
  id: string; label: string; value: string; onChange: (value: string) => void; max: number; error?: string; multiline?: boolean; disabled: boolean; hint?: string; counter?: boolean;
}) {
  const describedBy = [counter || hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;
  const props = { id, value, maxLength: max, disabled, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy };
  return <div className="field">
    <label htmlFor={id}>{label}</label>
    {multiline ? <textarea {...props} rows={4} onChange={(event) => onChange(event.target.value)} /> : <input {...props} onChange={(event) => onChange(event.target.value)} />}
    {(counter || hint) && <p className="field-hint" id={`${id}-hint`}>{hint ? `${hint}${counter ? ' · ' : ''}` : ''}{counter ? `${value.trim().length} / ${max} characters` : ''}</p>}
    {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
  </div>;
}

function FormShell({ title, children, readOnly, dirty, saving, message, onSubmit, saveLabel = 'Save changes' }: {
  title: string; children: ReactNode; readOnly: boolean; dirty: boolean; saving: boolean; message: { kind: 'error' | 'notice'; text: string } | null;
  onSubmit: () => Promise<boolean>; saveLabel?: string;
}) {
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); await onSubmit(); }
  return <form className="profile-form" onSubmit={submit} noValidate>
    <fieldset disabled={readOnly || saving}>
      <section className="form-section"><h2>{title}</h2>{children}</section>
    </fieldset>
    {!readOnly && <div className="form-actions">
      <button type="submit" className="primary-inline" disabled={!dirty || saving}>{saving ? 'Saving…' : saveLabel}</button>
      {dirty && !saving && <span className="field-hint">You have unsaved changes in this section.</span>}
    </div>}
    {message && <p className={message.kind === 'error' ? 'form-error' : 'form-notice'} role={message.kind === 'error' ? 'alert' : 'status'}>{message.text}</p>}
  </form>;
}

function RowControls({ index, count, label, onMove, onRemove }: { index: number; count: number; label: string; onMove: (offset: -1 | 1) => void; onRemove: () => void }) {
  return <div className="row-controls">
    <button type="button" className="secondary small" disabled={index === 0} onClick={() => onMove(-1)} aria-label={`Move ${label} up`}>Move up</button>
    <button type="button" className="secondary small" disabled={index === count - 1} onClick={() => onMove(1)} aria-label={`Move ${label} down`}>Move down</button>
    <button type="button" className="danger-text small" onClick={onRemove} aria-label={`Remove ${label}`}>Remove</button>
  </div>;
}

function IconPicker({ name, value, onChange, error }: { name: string; value: SiteIcon; onChange: (icon: SiteIcon) => void; error?: string }) {
  return <fieldset className="icon-picker">
    <legend>Icon</legend>
    <div className="icon-options">
      {SITE_ICONS.map((icon) => <label key={icon} className={`icon-option${value === icon ? ' selected' : ''}`}>
        <input type="radio" name={name} value={icon} checked={value === icon} onChange={() => onChange(icon)} />
        <SiteIconGlyph icon={icon} /><span>{ICON_LABELS[icon]}</span>
      </label>)}
    </div>
    {error && <p className="field-error">{error}</p>}
  </fieldset>;
}

// ---- Header, Hero, Contact (3b) and About (3c): simple text sections ----
type Basic = 'header' | 'hero' | 'contact' | 'about';
type Values = Record<string, string>;
function valuesFor(website: WebsiteData, key: Basic): Values {
  const { header, hero, contact, about } = website.sections;
  if (key === 'header') return { contactButtonLabel: header.contactButtonLabel, preferredContact: header.preferredContact ?? '' };
  if (key === 'hero') return { heading: hero.heading, subtitle: hero.subtitle ?? '', ctaLabel: hero.ctaLabel, heroImageId: hero.heroImageId ?? '' };
  if (key === 'contact') return { heading: contact.heading, message: contact.message ?? '' };
  return { heading: about.heading, story: about.story ?? '' };
}
function bodyFor(key: Basic, values: Values) {
  if (key === 'header') return { contactButtonLabel: values.contactButtonLabel, preferredContact: values.preferredContact || null };
  if (key === 'hero') return { heading: values.heading, subtitle: values.subtitle, ctaLabel: values.ctaLabel, heroImageId: values.heroImageId || null };
  if (key === 'contact') return { heading: values.heading, message: values.message };
  return { heading: values.heading, story: values.story };
}

export function BasicSectionForm({ website, sectionKey, onSaved }: { website: WebsiteData; sectionKey: Basic; onSaved: OnSaved }) {
  const submit = useCallback(async (values: Values) => valuesFor(await saveSection(website, sectionKey, bodyFor(sectionKey, values), onSaved), sectionKey), [website, sectionKey, onSaved]);
  const { values, setValues, dirty, saving, errors, message, save } = useDraftForm(valuesFor(website, sectionKey), submit);
  const set = (key: string) => (value: string) => setValues({ ...values, [key]: value });
  const disabled = !website.canEdit || saving;
  const { mapped } = website;
  const titles: Record<Basic, string> = { header: 'Header', hero: 'Hero', contact: 'Contact', about: 'About' };
  return <FormShell title={titles[sectionKey]} readOnly={!website.canEdit} dirty={dirty} saving={saving} message={message} onSubmit={save}>
    {sectionKey === 'header' && <>
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
      <TextField id="contactHeading" label="Heading" value={values.heading} onChange={set('heading')} max={80} error={errors.heading} disabled={disabled} />
      <TextField id="message" label="Short message (optional)" value={values.message} onChange={set('message')} max={300} error={errors.message} multiline disabled={disabled} />
      <ContactDetails mapped={mapped} />
    </>}
    {sectionKey === 'about' && <>
      <TextField id="aboutHeading" label="Heading" value={values.heading} onChange={set('heading')} max={60} error={errors.heading} disabled={disabled} />
      <TextField id="story" label="About your agency" value={values.story} onChange={set('story')} max={1200} error={errors.story} multiline disabled={disabled} hint="Needed before this section can be shown, at least 20 characters" />
      <p className="field-hint">A supporting photo comes with photo upload in a later phase.</p>
    </>}
  </FormShell>;
}

export function ContactDetails({ mapped }: { mapped: WebsiteData['mapped'] }) {
  return <div className="readonly-box">
    <p className="status-label">Shown contact details (from Agency profile)</p>
    <ul>
      {mapped.whatsapp && <li>WhatsApp: {mapped.whatsapp}</li>}
      {mapped.phone && <li>Phone: {mapped.phone}</li>}
      {mapped.publicEmail && <li>Email: {mapped.publicEmail}</li>}
      {(mapped.officeAddress || mapped.city) && <li>Office: {[mapped.officeAddress, mapped.city].filter(Boolean).join(', ')}</li>}
      {!mapped.whatsapp && !mapped.phone && !mapped.publicEmail && <li>None yet.</li>}
    </ul>
    <Link href="/profile">Change these in Agency profile</Link>
  </div>;
}

// ---- Services and Why Choose Us: repeatable cards (max 6) ----
type CardValues = { heading: string; cards: { title: string; text: string; icon: SiteIcon }[] };
function cardValues(website: WebsiteData, key: 'services' | 'whyChooseUs'): CardValues {
  const block = website.sections[key];
  return {
    heading: block.heading,
    cards: block.cards.map((card) => ({ title: card.title, text: ('description' in card ? card.description : 'detail' in card ? card.detail : undefined) ?? '', icon: card.icon })),
  };
}

export function CardsForm({ website, sectionKey, onSaved }: { website: WebsiteData; sectionKey: 'services' | 'whyChooseUs'; onSaved: OnSaved }) {
  const textKey = sectionKey === 'services' ? 'description' : 'detail';
  const submit = useCallback(async (values: CardValues) => cardValues(await saveSection(website, sectionKey, {
    heading: values.heading, cards: values.cards.map((card) => ({ title: card.title, [textKey]: card.text, icon: card.icon })),
  }, onSaved), sectionKey), [website, sectionKey, textKey, onSaved]);
  const { values, setValues, dirty, saving, errors, message, save } = useDraftForm(cardValues(website, sectionKey), submit);
  const disabled = !website.canEdit || saving;
  const noun = sectionKey === 'services' ? 'service' : 'reason';
  const setCard = (index: number, patch: Partial<CardValues['cards'][number]>) =>
    setValues({ ...values, cards: values.cards.map((card, i) => i === index ? { ...card, ...patch } : card) });
  return <FormShell title={sectionKey === 'services' ? 'Services' : 'Why Choose Us'} readOnly={!website.canEdit} dirty={dirty} saving={saving} message={message} onSubmit={save}>
    <TextField id={`${sectionKey}-heading`} label="Heading" value={values.heading} onChange={(heading) => setValues({ ...values, heading })} max={60} error={errors.heading} disabled={disabled} />
    <p className="field-hint">Add up to 6 {noun}s. At least one is needed before this section can be shown. Only list what your agency really offers.</p>
    {errors.cards && <p className="field-error">{errors.cards}</p>}
    <ol className="card-rows">
      {values.cards.map((card, index) => <li key={index} className="card-row">
        <p className="card-row-title">{noun[0]!.toUpperCase() + noun.slice(1)} {index + 1}</p>
        <TextField id={`${sectionKey}-${index}-title`} label="Title" value={card.title} onChange={(title) => setCard(index, { title })} max={40} error={errors[`cards.${index}.title`]} disabled={disabled} />
        <TextField id={`${sectionKey}-${index}-text`} label="Short description (optional)" value={card.text} onChange={(text) => setCard(index, { text })} max={160} error={errors[`cards.${index}.${textKey}`]} multiline disabled={disabled} />
        <IconPicker name={`${sectionKey}-${index}-icon`} value={card.icon} onChange={(icon) => setCard(index, { icon })} error={errors[`cards.${index}.icon`]} />
        {website.canEdit && <RowControls index={index} count={values.cards.length} label={`${noun} ${index + 1}`}
          onMove={(offset) => setValues({ ...values, cards: move(values.cards, index, offset) })}
          onRemove={() => setValues({ ...values, cards: values.cards.filter((_, i) => i !== index) })} />}
      </li>)}
    </ol>
    {website.canEdit && values.cards.length < 6 && <button type="button" className="secondary" onClick={() => setValues({ ...values, cards: [...values.cards, { title: '', text: '', icon: 'home' }] })}>Add {noun}</button>}
  </FormShell>;
}

// ---- Team: up to 12 members; numbers need the person's consent ----
type Member = { name: string; role: string; phone: string; whatsapp: string; contactConsent: boolean };
type TeamValues = { heading: string; members: Member[] };
function teamValues(website: WebsiteData): TeamValues {
  const { team } = website.sections;
  return {
    heading: team.heading,
    members: team.members.map((member) => ({ name: member.name, role: member.role ?? '', phone: member.phone ?? '', whatsapp: member.whatsapp ?? '', contactConsent: Boolean(member.contactConsent) })),
  };
}

export function TeamForm({ website, onSaved }: { website: WebsiteData; onSaved: OnSaved }) {
  const submit = useCallback(async (values: TeamValues) => teamValues(await saveSection(website, 'team', {
    heading: values.heading,
    members: values.members.map((member) => ({ name: member.name, role: member.role, phone: member.phone, whatsapp: member.whatsapp, contactConsent: member.contactConsent })),
  }, onSaved)), [website, onSaved]);
  const { values, setValues, dirty, saving, errors, message, save } = useDraftForm(teamValues(website), submit);
  const disabled = !website.canEdit || saving;
  const setMember = (index: number, patch: Partial<Member>) => setValues({ ...values, members: values.members.map((member, i) => i === index ? { ...member, ...patch } : member) });
  return <FormShell title="Team" readOnly={!website.canEdit} dirty={dirty} saving={saving} message={message} onSubmit={save}>
    <TextField id="team-heading" label="Heading" value={values.heading} onChange={(heading) => setValues({ ...values, heading })} max={60} error={errors.heading} disabled={disabled} />
    <p className="field-hint">Add up to 12 real team members. Photos come with photo upload in a later phase; until then the website shows initials.</p>
    <ol className="card-rows">
      {values.members.map((member, index) => <li key={index} className="card-row">
        <p className="card-row-title">Member {index + 1}</p>
        <TextField id={`member-${index}-name`} label="Name" value={member.name} onChange={(name) => setMember(index, { name })} max={60} error={errors[`members.${index}.name`]} disabled={disabled} counter={false} />
        <TextField id={`member-${index}-role`} label="Role (optional)" value={member.role} onChange={(role) => setMember(index, { role })} max={60} error={errors[`members.${index}.role`]} disabled={disabled} counter={false} />
        <div className="field-row">
          <TextField id={`member-${index}-phone`} label="Phone (optional)" value={member.phone} onChange={(phone) => setMember(index, { phone })} max={20} error={errors[`members.${index}.phone`]} disabled={disabled} counter={false} />
          <TextField id={`member-${index}-whatsapp`} label="WhatsApp (optional)" value={member.whatsapp} onChange={(whatsapp) => setMember(index, { whatsapp })} max={20} error={errors[`members.${index}.whatsapp`]} disabled={disabled} counter={false} />
        </div>
        {(member.phone.trim() || member.whatsapp.trim()) && <label className="checkbox consent">
          <input type="checkbox" checked={member.contactConsent} onChange={(event) => setMember(index, { contactConsent: event.target.checked })} aria-invalid={Boolean(errors[`members.${index}.contactConsent`])} />
          This person agreed to show this number on the website
        </label>}
        {errors[`members.${index}.contactConsent`] && <p className="field-error">{errors[`members.${index}.contactConsent`]}</p>}
        {website.canEdit && <RowControls index={index} count={values.members.length} label={`member ${index + 1}`}
          onMove={(offset) => setValues({ ...values, members: move(values.members, index, offset) })}
          onRemove={() => setValues({ ...values, members: values.members.filter((_, i) => i !== index) })} />}
      </li>)}
    </ol>
    {website.canEdit && values.members.length < 12 && <button type="button" className="secondary" onClick={() => setValues({ ...values, members: [...values.members, { name: '', role: '', phone: '', whatsapp: '', contactConsent: false }] })}>Add member</button>}
  </FormShell>;
}

// ---- Layout: show/hide and order of the optional sections, saved on its own (Phase 3c §1 Q3) ----
type LayoutValues = Pick<LayoutData, 'order' | 'visible'>;
const hasContent = (website: WebsiteData, key: OptionalSection) => {
  const { about, services, whyChooseUs, team } = website.sections;
  return key === 'about' ? Boolean(about.story) : key === 'services' ? services.cards.length > 0 : key === 'whyChooseUs' ? whyChooseUs.cards.length > 0 : key === 'team' ? team.members.length > 0 : false;
};

export function LayoutPanel({ website, onSaved, onEdit }: { website: WebsiteData; onSaved: OnSaved; onEdit: (key: OptionalSection) => void }) {
  const submit = useCallback(async (values: LayoutValues) => {
    const result = await apiMutation<{ layout: LayoutData }>('/api/v1/owner/website/layout', 'PUT', { ...values, expectedLayoutVersion: website.layout.version });
    if (!result) throw new Error('Could not save the layout. Nothing was changed.');
    onSaved({ ...website, layout: result.layout });
    return { order: result.layout.order, visible: result.layout.visible };
  }, [website, onSaved]);
  const { values, setValues, dirty, saving, errors, message, save } = useDraftForm<LayoutValues>({ order: website.layout.order, visible: website.layout.visible }, submit, 'Layout saved in your private draft.');
  return <FormShell title="Layout" readOnly={!website.canEdit} dirty={dirty} saving={saving} message={message} onSubmit={save} saveLabel="Save layout">
    <p className="field-hint">Header, Hero, Contact and Footer are always shown. Choose which extra sections appear between Hero and Contact, and in what order.</p>
    <ol className="layout-rows">
      {values.order.map((key, index) => {
        const label = OPTIONAL_SECTION_LABELS[key];
        if (key === 'properties') return <li key={key} className="layout-row muted-row"><strong>{label}</strong><span className="field-hint">Comes with Properties in a later phase.</span></li>;
        const content = hasContent(website, key);
        const shown = values.visible[key];
        return <li key={key} className="layout-row">
          <label className="checkbox">
            <input type="checkbox" checked={shown} disabled={!content && !shown} onChange={(event) => setValues({ ...values, visible: { ...values.visible, [key]: event.target.checked } })} />
            <strong>{label}</strong> <span className="field-hint">{shown ? 'Shown' : 'Hidden'}</span>
          </label>
          {!content && <span className="field-hint">Add content first. <button type="button" className="link-button" onClick={() => onEdit(key)}>Edit {label}</button></span>}
          {errors[`visible.${key}`] && <p className="field-error">{errors[`visible.${key}`]}</p>}
          {website.canEdit && <div className="row-controls">
            <button type="button" className="secondary small" disabled={index === 0} onClick={() => setValues({ ...values, order: move(values.order, index, -1) })} aria-label={`Move ${label} up`}>Move up</button>
            <button type="button" className="secondary small" disabled={index === values.order.length - 1} onClick={() => setValues({ ...values, order: move(values.order, index, 1) })} aria-label={`Move ${label} down`}>Move down</button>
          </div>}
        </li>;
      })}
    </ol>
  </FormShell>;
}
