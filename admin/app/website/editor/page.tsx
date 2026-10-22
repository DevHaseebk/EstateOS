'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import type { OptionalSection, WebsiteData } from 'site-template';
import { useGuardedAction } from '../../components/AppShell';
import { OwnerPage } from '../../components/OwnerPage';
import { useWebsite } from '../../lib/website';
import { BasicSectionForm, CardsForm, LayoutPanel, PropertiesSectionForm, TeamForm } from './forms';

type EditorKey = 'layout' | 'header' | 'hero' | 'contact' | 'about' | 'services' | 'whyChooseUs' | 'team' | 'properties' | 'footer';
// Phase 6b §1 Q7: two labelled groups, so owners see what every site needs apart from what is optional.
const SECTIONS: { key: EditorKey; label: string; hint: string; group: 'essentials' | 'optional'; optional?: OptionalSection }[] = [
  { key: 'header', label: 'Header', hint: 'Agency name and contact button', group: 'essentials' },
  { key: 'hero', label: 'Hero', hint: 'Main heading, photo and button', group: 'essentials' },
  { key: 'contact', label: 'Contact', hint: 'Contact heading and message', group: 'essentials' },
  { key: 'footer', label: 'Footer', hint: 'Built from your Agency profile', group: 'essentials' },
  { key: 'layout', label: 'Layout', hint: 'Show, hide and order these sections', group: 'optional' },
  { key: 'about', label: 'About', hint: 'Your agency story', group: 'optional', optional: 'about' },
  { key: 'services', label: 'Services', hint: 'What you offer', group: 'optional', optional: 'services' },
  { key: 'whyChooseUs', label: 'Why Choose Us', hint: 'Reasons to choose you', group: 'optional', optional: 'whyChooseUs' },
  { key: 'team', label: 'Team', hint: 'Your agents', group: 'optional', optional: 'team' },
  { key: 'properties', label: 'Properties', hint: 'Your listings on the website', group: 'optional', optional: 'properties' },
];
const GROUPS = [{ key: 'essentials', title: 'Essentials' }, { key: 'optional', title: 'Optional sections' }] as const;

function Footer({ mapped }: { mapped: WebsiteData['mapped'] }) {
  return <section className="form-section">
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
  </section>;
}

// D-050: one section at a time with its own Save. D-051: switching sections or opening Preview with unsaved edits asks Save / Discard / Stay.
function Editor() {
  const router = useRouter();
  const params = useSearchParams();
  const guarded = useGuardedAction();
  const { website, setWebsite, error } = useWebsite();
  const requested = params.get('section');
  const current: EditorKey = SECTIONS.some((section) => section.key === requested) ? requested as EditorKey : 'hero';
  const open = (key: EditorKey) => guarded(() => router.replace(`/website/editor?section=${key}`));
  if (!website) return error ? <p className="form-error" role="alert">{error}</p> : <p role="status">Loading your website…</p>;
  return <>{website.publication?.status === 'LIVE'
    ? <p className="live-note">Saved changes stay private until you publish them from <Link href="/website">My Website</Link>.</p>
    : <p className="page-intro">Saved changes stay private until your website goes live.</p>}<div className="editor-layout">
    <nav className="section-list" aria-label="Website sections">
      {GROUPS.map((group) => <div key={group.key} className="section-group" role="group" aria-labelledby={`group-${group.key}`}>
        <p className="section-group-title" id={`group-${group.key}`}>{group.title}</p>
        {SECTIONS.filter((section) => section.group === group.key).map((section) => <button key={section.key} type="button" aria-current={current === section.key ? 'true' : undefined} onClick={() => open(section.key)}>
          <strong>{section.label}{section.optional && <span className={`shown-badge${website.layout.visible[section.optional] ? ' on' : ''}`}>{website.layout.visible[section.optional] ? 'Shown' : 'Hidden'}</span>}</strong>
          <span>{section.hint}</span>
        </button>)}
      </div>)}
      <button type="button" className="secondary" onClick={() => guarded(() => router.push('/website/preview'))}>Preview website</button>
    </nav>
    <div className="editor-main">
      {current === 'footer' && <Footer mapped={website.mapped} />}
      {current === 'layout' && <LayoutPanel key="layout" website={website} onSaved={setWebsite} onEdit={(key) => open(key as EditorKey)} />}
      {(current === 'header' || current === 'hero' || current === 'contact' || current === 'about') &&
        <BasicSectionForm key={current} website={website} sectionKey={current} onSaved={setWebsite} />}
      {(current === 'services' || current === 'whyChooseUs') && <CardsForm key={current} website={website} sectionKey={current} onSaved={setWebsite} />}
      {current === 'team' && <TeamForm key="team" website={website} onSaved={setWebsite} />}
      {current === 'properties' && <PropertiesSectionForm key="properties" website={website} onSaved={setWebsite} />}
    </div>
  </div></>;
}

export default function EditorPage() {
  return <OwnerPage>{() => <div className="page page-wide">
    <h1>Edit website</h1>
    <p className="page-intro">Choose a section, make changes and save it.</p>
    <Suspense fallback={<p role="status">Loading…</p>}><Editor /></Suspense>
  </div>}</OwnerPage>;
}
