'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { INTENT_LABELS, PROPERTY_TYPE_LABELS, SIZE_UNIT_LABELS, type PropertyIntent, type PropertyType, type SizeUnit } from 'site-template';
import { ApiError, apiMutation } from '../lib/api';
import { AVAILABILITY_LABELS, availabilityOptions, type OwnerProperty } from '../lib/properties';
import { TextField } from '../website/editor/forms';
import { useDraftForm } from '../website/editor/useDraftForm';

type Values = {
  title: string; intent: PropertyIntent; type: PropertyType; pricePkr: string; city: string; area: string;
  sizeValue: string; sizeUnit: SizeUnit; bedrooms: string; bathrooms: string; description: string; availability: OwnerProperty['availability'];
};
const EMPTY: Values = {
  title: '', intent: 'SALE', type: 'HOUSE', pricePkr: '', city: '', area: '', sizeValue: '', sizeUnit: 'MARLA', bedrooms: '', bathrooms: '', description: '', availability: 'AVAILABLE',
};
const toValues = (property: OwnerProperty | null): Values => property ? {
  title: property.title, intent: property.intent, type: property.type, pricePkr: String(property.pricePkr), city: property.city, area: property.area,
  sizeValue: property.size ? String(property.size.value) : '', sizeUnit: property.size?.unit ?? 'MARLA',
  bedrooms: property.bedrooms !== undefined ? String(property.bedrooms) : '', bathrooms: property.bathrooms !== undefined ? String(property.bathrooms) : '',
  description: property.description ?? '', availability: property.availability,
} : EMPTY;
const numberOrNull = (value: string) => value.trim() === '' ? null : Number(value.replace(/,/g, ''));

function body(values: Values) {
  return {
    title: values.title, intent: values.intent, type: values.type, pricePkr: numberOrNull(values.pricePkr), city: values.city, area: values.area,
    size: values.sizeValue.trim() ? { value: numberOrNull(values.sizeValue), unit: values.sizeUnit } : null,
    bedrooms: numberOrNull(values.bedrooms), bathrooms: numberOrNull(values.bathrooms), description: values.description,
  };
}

/** Archive/Restore confirmation (D-062): explicit, reversible, never a delete. */
function ConfirmAction({ open, archived, busy, onConfirm, onCancel }: { open: boolean; archived: boolean; busy: boolean; onConfirm: () => void; onCancel: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);
  return <dialog ref={dialog} className="confirm-dialog" aria-labelledby="archive-title" onCancel={(event) => { event.preventDefault(); if (!busy) onCancel(); }}>
    <h2 id="archive-title">{archived ? 'Restore this property?' : 'Archive this property?'}</h2>
    <p>{archived ? 'It returns to your active properties. It appears on your website again after you publish.' : 'It moves to Archived and will not appear on your website after you publish. You can restore it at any time.'}</p>
    <div className="dialog-actions">
      <button type="button" className="secondary" disabled={busy} onClick={onCancel}>Cancel</button>
      <button type="button" className="primary-inline" disabled={busy} onClick={onConfirm}>{busy ? 'Please wait…' : archived ? 'Restore' : 'Archive'}</button>
    </div>
  </dialog>;
}

// D-057 one page: Basics first, Details and Photos expandable. D-061 one Save property with Save / Discard / Stay. D-062 status and Archive/Restore.
export function PropertyForm({ property, canEdit, onSaved }: { property: OwnerProperty | null; canEdit: boolean; onSaved: (property: OwnerProperty) => void }) {
  const [current, setCurrent] = useState(property);
  const [detailsOpen, setDetailsOpen] = useState(Boolean(property && (property.size || property.bedrooms !== undefined || property.bathrooms !== undefined || property.description)));
  const [photosOpen, setPhotosOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');

  const submit = useCallback(async (values: Values) => {
    const result = current
      ? await apiMutation<{ property: OwnerProperty }>(`/api/v1/owner/properties/${current.id}`, 'PUT', { ...body(values), availability: values.availability, expectedVersion: current.version })
      : await apiMutation<{ property: OwnerProperty }>('/api/v1/owner/properties', 'POST', body(values));
    if (!result) throw new Error('Could not save. Nothing was changed.');
    setCurrent(result.property);
    onSaved(result.property);
    return toValues(result.property);
  }, [current, onSaved]);
  const { values, setValues, dirty, saving, errors, message, save } = useDraftForm(toValues(property), submit, 'Saved.');
  const set = <K extends keyof Values>(key: K, value: Values[K]) => setValues({ ...values, [key]: value });
  const disabled = !canEdit || saving || Boolean(current?.archived);
  async function onSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); await save(); }

  async function archiveOrRestore() {
    if (!current) return;
    setBusy(true); setActionError('');
    try {
      const result = await apiMutation<{ property: OwnerProperty }>(`/api/v1/owner/properties/${current.id}/${current.archived ? 'restore' : 'archive'}`, 'POST', { expectedVersion: current.version });
      if (result) { setCurrent(result.property); setValues(toValues(result.property)); onSaved(result.property); }
      setConfirming(false);
    } catch (failure) {
      setConfirming(false);
      setActionError(failure instanceof ApiError || failure instanceof Error ? failure.message : 'The action failed. Nothing was changed.');
    } finally { setBusy(false); }
  }

  return <form className="profile-form" onSubmit={onSubmit} noValidate>
    {current?.archived && <p className="form-notice" role="status">This property is archived. Restore it to edit it again.</p>}
    <fieldset disabled={disabled}>
      <section className="form-section" aria-labelledby="basics-title">
        <h2 id="basics-title">Basics</h2>
        <TextField id="title" label="Property title" value={values.title} onChange={(value) => set('title', value)} max={100} error={errors.title} disabled={disabled} />
        <fieldset className="choice-group">
          <legend>Listing</legend>
          {(['SALE', 'RENT'] as const).map((intent) => <label key={intent} className="checkbox">
            <input type="radio" name="intent" checked={values.intent === intent}
              onChange={() => setValues({ ...values, intent, availability: availabilityOptions(intent).includes(values.availability) ? values.availability : 'AVAILABLE' })} /> {INTENT_LABELS[intent]}
          </label>)}
        </fieldset>
        <div className="field">
          <label htmlFor="type">Property type</label>
          <select id="type" value={values.type} onChange={(event) => set('type', event.target.value as PropertyType)}>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="pricePkr">{values.intent === 'RENT' ? 'Rent per month (PKR)' : 'Price (PKR)'}</label>
          <input id="pricePkr" inputMode="numeric" value={values.pricePkr} onChange={(event) => set('pricePkr', event.target.value)} aria-invalid={Boolean(errors.pricePkr)} aria-describedby={errors.pricePkr ? 'pricePkr-error' : undefined} />
          {errors.pricePkr && <p className="field-error" id="pricePkr-error">{errors.pricePkr}</p>}
        </div>
        <div className="field-row">
          <TextField id="city" label="City" value={values.city} onChange={(value) => set('city', value)} max={80} error={errors.city} disabled={disabled} counter={false} />
          <TextField id="area" label="Area / neighbourhood" value={values.area} onChange={(value) => set('area', value)} max={80} error={errors.area} disabled={disabled} counter={false} />
        </div>
        {current && <div className="field">
          <label htmlFor="availability">Availability</label>
          <select id="availability" value={values.availability} onChange={(event) => set('availability', event.target.value as Values['availability'])} aria-invalid={Boolean(errors.availability)}>
            {availabilityOptions(values.intent).map((option) => <option key={option} value={option}>{AVAILABILITY_LABELS[option]}</option>)}
          </select>
          {errors.availability && <p className="field-error">{errors.availability}</p>}
          <p className="field-hint">Only Available properties can appear on your website.</p>
        </div>}
      </section>

      <section className="form-section">
        <h2 className="section-toggle-title"><button type="button" className="section-toggle" aria-expanded={detailsOpen} aria-controls="property-details" onClick={() => setDetailsOpen(!detailsOpen)}>
          Details <span className="field-hint">(optional)</span></button></h2>
        <div id="property-details" hidden={!detailsOpen}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="sizeValue">Size</label>
              <input id="sizeValue" inputMode="decimal" value={values.sizeValue} onChange={(event) => set('sizeValue', event.target.value)} aria-invalid={Boolean(errors['size.value'])} />
              {errors['size.value'] && <p className="field-error">{errors['size.value']}</p>}
            </div>
            <div className="field">
              <label htmlFor="sizeUnit">Unit</label>
              <select id="sizeUnit" value={values.sizeUnit} onChange={(event) => set('sizeUnit', event.target.value as SizeUnit)}>
                {Object.entries(SIZE_UNIT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="bedrooms">Bedrooms</label>
              <input id="bedrooms" inputMode="numeric" value={values.bedrooms} onChange={(event) => set('bedrooms', event.target.value)} aria-invalid={Boolean(errors.bedrooms)} />
              {errors.bedrooms && <p className="field-error">{errors.bedrooms}</p>}
            </div>
            <div className="field">
              <label htmlFor="bathrooms">Bathrooms</label>
              <input id="bathrooms" inputMode="numeric" value={values.bathrooms} onChange={(event) => set('bathrooms', event.target.value)} aria-invalid={Boolean(errors.bathrooms)} />
              {errors.bathrooms && <p className="field-error">{errors.bathrooms}</p>}
            </div>
          </div>
          <TextField id="description" label="Description" value={values.description} onChange={(value) => set('description', value)} max={2000} error={errors.description} multiline disabled={disabled} />
        </div>
      </section>

      <section className="form-section">
        <h2 className="section-toggle-title"><button type="button" className="section-toggle" aria-expanded={photosOpen} aria-controls="property-photos" onClick={() => setPhotosOpen(!photosOpen)}>
          Photos <span className="field-hint">(optional)</span></button></h2>
        <div id="property-photos" hidden={!photosOpen}><p className="field-hint">Photo upload comes in a later phase. Your website shows a simple placeholder until then.</p></div>
      </section>
    </fieldset>

    {canEdit && <div className="form-actions">
      {!current?.archived && <button type="submit" className="primary-inline" disabled={!dirty || saving}>{saving ? 'Saving…' : current ? 'Save property' : 'Add property'}</button>}
      {dirty && !saving && <span className="field-hint">You have unsaved changes.</span>}
      {current && <button type="button" className="secondary" disabled={dirty || busy} title={dirty ? 'Save or discard your changes first' : undefined} onClick={() => { setActionError(''); setConfirming(true); }}>
        {current.archived ? 'Restore' : 'Archive'}</button>}
    </div>}
    {message && <p className={message.kind === 'error' ? 'form-error' : 'form-notice'} role={message.kind === 'error' ? 'alert' : 'status'}>{message.text}</p>}
    {actionError && <p className="form-error" role="alert">{actionError}</p>}
    <ConfirmAction open={confirming} archived={Boolean(current?.archived)} busy={busy} onConfirm={() => void archiveOrRestore()} onCancel={() => setConfirming(false)} />
  </form>;
}
