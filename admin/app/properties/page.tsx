'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { formatPrice, INTENT_LABELS, PROPERTY_TYPE_LABELS, SiteIconGlyph } from 'site-template';
import { OwnerPage } from '../components/OwnerPage';
import { apiGet } from '../lib/api';
import { AVAILABILITY_LABELS, type OwnerProperty } from '../lib/properties';

type List = { items: OwnerProperty[]; counts: { active: number; archived: number } };

// D-056: responsive property cards (grid on desktop, one column on phones), a friendly empty state and an optional Add property.
function PropertyList() {
  const [archived, setArchived] = useState(false);
  const [list, setList] = useState<List | null>(null);
  const [error, setError] = useState('');
  const load = useCallback((showArchived: boolean) => apiGet<List>(`/api/v1/owner/properties?archived=${showArchived}`)
    .then((data) => { setList(data); setError(''); })
    .catch((failure: unknown) => setError(failure instanceof Error ? failure.message : 'Could not load your properties')), []);
  useEffect(() => { void load(archived); }, [archived, load]);

  return <>
    <div className="list-toolbar">
      <div className="segmented" role="group" aria-label="Which properties">
        <button type="button" aria-pressed={!archived} onClick={() => setArchived(false)}>Active{list ? ` (${list.counts.active})` : ''}</button>
        <button type="button" aria-pressed={archived} onClick={() => setArchived(true)}>Archived{list ? ` (${list.counts.archived})` : ''}</button>
      </div>
      <Link href="/properties/new" className="primary-link">Add property</Link>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    {!list && !error && <p role="status">Loading properties…</p>}
    {list && list.items.length === 0 && <p className="empty-state">{archived
      ? 'No archived properties.'
      : 'No properties yet. Your website works without them; add one whenever you are ready.'}</p>}
    {list && list.items.length > 0 && <ul className="property-cards">
      {list.items.map((property) => <li key={property.id} className="property-card">
        <div className="property-visual" aria-hidden="true"><SiteIconGlyph icon={property.type === 'PLOT' ? 'map-pin' : property.type === 'SHOP' || property.type === 'OFFICE' ? 'building' : 'home'} /></div>
        <div className="property-card-body">
          <p className="property-meta"><span className={`status-pill availability-${property.availability.toLowerCase()}`}>{AVAILABILITY_LABELS[property.availability]}</span>
            {INTENT_LABELS[property.intent]} · {PROPERTY_TYPE_LABELS[property.type]}</p>
          <h2>{property.title}</h2>
          <p className="field-hint">{property.area}, {property.city}</p>
          <p className="property-price">{formatPrice(property.pricePkr, property.intent)}</p>
          <Link href={`/properties/${property.id}`} className="back-link">Edit<span className="visually-hidden"> {property.title}</span></Link>
        </div>
      </li>)}
    </ul>}
  </>;
}

export default function PropertiesPage() {
  return <OwnerPage>{() => <div className="page page-wide">
    <h1>Properties</h1>
    <p className="page-intro">Optional listings for your website. Only available, non-archived properties appear publicly, and only after your website publishes them.</p>
    <PropertyList />
  </div>}</OwnerPage>;
}
