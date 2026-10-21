'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { OwnerPage } from '../../components/OwnerPage';
import { PropertyForm } from '../../components/PropertyForm';
import { ApiError, apiGet } from '../../lib/api';
import type { OwnerProperty } from '../../lib/properties';
import { useWebsite } from '../../lib/website';

function EditProperty() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { website } = useWebsite();
  const [property, setProperty] = useState<OwnerProperty | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'not-found' | 'error'>('loading');
  useEffect(() => {
    void apiGet<{ property: OwnerProperty }>(`/api/v1/owner/properties/${propertyId}`)
      .then((data) => { setProperty(data.property); setState('ready'); })
      .catch((failure: unknown) => setState(failure instanceof ApiError && failure.status === 404 ? 'not-found' : 'error'));
  }, [propertyId]);
  if (state === 'loading') return <p role="status">Loading property…</p>;
  if (state === 'not-found') return <p>Property not found. <Link href="/properties">Back to Properties</Link>.</p>;
  if (state === 'error' || !property) return <p className="form-error" role="alert">Could not load this property.</p>;
  return <>
    {website?.publication?.status === 'LIVE' && <p className="live-note">Changes reach your live website when you publish them from <Link href="/website">My Website</Link>.</p>}
    <PropertyForm key={property.id} property={property} canEdit={website?.canEdit ?? false} onSaved={setProperty} />
  </>;
}

export default function EditPropertyPage() {
  return <OwnerPage>{() => <div className="page">
    <p><Link href="/properties" className="back-link">← Properties</Link></p>
    <h1>Edit property</h1>
    <EditProperty />
  </div>}</OwnerPage>;
}
