'use client';

import { OwnerPage } from '../components/OwnerPage';
import { ProfileForm } from '../components/ProfileForm';

// Phase 3a §6: /profile is the one-page Agency Profile; signed-out owners go back to sign-in.
export default function ProfilePage() {
  return <OwnerPage>{(_session, refresh) => <div className="page">
    <h1>Agency profile</h1>
    <p className="page-intro">These details are used for your agency account and, later, for your website.</p>
    <ProfileForm onSaved={refresh} />
  </div>}</OwnerPage>;
}
