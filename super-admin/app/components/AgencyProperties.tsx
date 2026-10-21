'use client';

import { useEffect, useState } from 'react';
import { formatPrice, INTENT_LABELS, type PropertyIntent } from 'site-template';
import { apiGet } from '../lib/api';

type Item = { id: string; title: string; intent: PropertyIntent; pricePkr: number; city: string; area: string; availability: string; archived: boolean };
const AVAILABILITY: Record<string, string> = { AVAILABLE: 'Available', SOLD: 'Sold', RENTED: 'Rented' };

// Phase 5a §4: read-only property list for the review page. Super Admin never edits agency listings.
export function AgencyProperties({ agencyId }: { agencyId: string }) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    void apiGet<{ items: Item[] }>(`/api/v1/super-admin/agencies/${agencyId}/properties`)
      .then((data) => setItems(data.items))
      .catch((failure: unknown) => setError(failure instanceof Error ? failure.message : 'Could not load properties'));
  }, [agencyId]);
  const active = items?.filter((item) => !item.archived).length ?? 0;
  return <section className="panel" aria-labelledby="properties-title">
    <h2 id="properties-title">Properties{items ? ` (${active} active, ${items.length - active} archived)` : ''}</h2>
    {error && <p className="form-error" role="alert">{error}</p>}
    {!items && !error && <p role="status">Loading…</p>}
    {items?.length === 0 && <p>No properties yet. That is fine: a website can go live without them.</p>}
    {items && items.length > 0 && <ul className="history">
      {items.map((item) => <li key={item.id}>
        <p><strong>{item.title}</strong> · {INTENT_LABELS[item.intent]} · {formatPrice(item.pricePkr, item.intent)}</p>
        <p className="queue-meta">{item.area}, {item.city} · {AVAILABILITY[item.availability] ?? item.availability}{item.archived ? ' · Archived' : ''}</p>
      </li>)}
    </ul>}
  </section>;
}
