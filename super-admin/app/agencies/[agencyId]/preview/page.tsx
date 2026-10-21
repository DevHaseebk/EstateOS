'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SiteTemplate, siteModelFromWebsite, type WebsiteData } from 'site-template';
import { ApiError, apiGet } from '../../../lib/api';

// D-065 / D-101: Super Admin read-only private preview of an agency's saved draft. Never a public URL.
export default function AgencyPreviewPage() {
  const { agencyId } = useParams<{ agencyId: string }>();
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'signed-out' | 'not-found' | 'error'>('loading');
  const [width, setWidth] = useState<'desktop' | 'mobile'>('desktop');
  useEffect(() => {
    void apiGet<WebsiteData>(`/api/v1/super-admin/agencies/${agencyId}/website`)
      .then((data) => { setWebsite(data); setState('ready'); })
      .catch((failure: unknown) => {
        if (failure instanceof ApiError && failure.status === 401) setState('signed-out');
        else if (failure instanceof ApiError && failure.status === 404) setState('not-found');
        else setState('error');
      });
  }, [agencyId]);

  if (state === 'loading') return <main className="admin-page"><p role="status">Loading preview…</p></main>;
  if (state === 'signed-out') return <main className="admin-page"><p>Your session has ended. <Link href="/">Sign in again</Link>.</p></main>;
  if (state === 'not-found') return <main className="admin-page"><p>Agency not found. <Link href="/agencies">Back to All agencies</Link>.</p></main>;
  if (state === 'error' || !website) return <main className="admin-page"><p className="form-error" role="alert">Could not load the preview.</p></main>;
  return <main className="admin-page preview-page">
    <div className="preview-bar" role="status">
      <span><strong>Private preview — not public.</strong> {website.theme.preset ? 'Saved draft of this agency.' : 'Theme not chosen yet — showing Modern Light.'}</span>
      <span className="preview-controls">
        <span role="group" aria-label="Preview width" className="segmented">
          <button type="button" aria-pressed={width === 'desktop'} onClick={() => setWidth('desktop')}>Desktop</button>
          <button type="button" aria-pressed={width === 'mobile'} onClick={() => setWidth('mobile')}>Mobile</button>
        </span>
        <Link href={`/agencies/${agencyId}`} className="back-link">Back to agency</Link>
      </span>
    </div>
    <div className={`preview-canvas preview-${width}`}><SiteTemplate model={siteModelFromWebsite(website)} /></div>
  </main>;
}
