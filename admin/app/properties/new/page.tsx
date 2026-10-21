'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OwnerPage } from '../../components/OwnerPage';
import { PropertyForm } from '../../components/PropertyForm';
import { useWebsite } from '../../lib/website';

function NewProperty() {
  const router = useRouter();
  const { website } = useWebsite();
  return <>
    {website?.publication?.status === 'LIVE' && <p className="live-note">New properties reach your live website when you publish them from <Link href="/website">My Website</Link>.</p>}
    <PropertyForm property={null} canEdit={website?.canEdit ?? true} onSaved={(property) => router.replace(`/properties/${property.id}`)} />
  </>;
}

export default function NewPropertyPage() {
  return <OwnerPage>{() => <div className="page">
    <p><Link href="/properties" className="back-link">← Properties</Link></p>
    <h1>Add property</h1>
    <NewProperty />
  </div>}</OwnerPage>;
}
