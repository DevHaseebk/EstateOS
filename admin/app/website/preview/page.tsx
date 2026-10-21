'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SiteTemplate, siteModelFromWebsite } from 'site-template';
import { OwnerPage } from '../../components/OwnerPage';
import { useWebsite } from '../../lib/website';

// D-052 / D-101: saved draft + applied theme only, inside the authenticated management host. Never public.
function Preview() {
  const { website, error } = useWebsite();
  const [width, setWidth] = useState<'desktop' | 'mobile'>('desktop');
  if (!website) return error ? <p className="form-error" role="alert">{error}</p> : <p role="status">Loading preview…</p>;
  return <>
    <div className="preview-bar" role="status">
      <span><strong>Private preview — not public.</strong> {website.theme.preset ? 'Showing your saved draft.' : 'Theme not chosen yet — showing Modern Light.'}</span>
      <span className="preview-controls">
        <span role="group" aria-label="Preview width" className="segmented">
          <button type="button" aria-pressed={width === 'desktop'} onClick={() => setWidth('desktop')}>Desktop</button>
          <button type="button" aria-pressed={width === 'mobile'} onClick={() => setWidth('mobile')}>Mobile</button>
        </span>
        <Link href="/website/editor" className="back-link">Edit website</Link>
      </span>
    </div>
    <div className={`preview-canvas preview-${width}`}><SiteTemplate model={siteModelFromWebsite(website)} /></div>
  </>;
}

export default function PreviewPage() {
  return <OwnerPage>{() => <div className="page page-full"><h1 className="visually-hidden">Website preview</h1><Preview /></div>}</OwnerPage>;
}
