'use client';

import Link from 'next/link';
import { THEME_LABELS } from 'site-template';
import { OwnerPage } from '../components/OwnerPage';
import type { OwnerSession } from '../lib/api';
import { ISSUE_LINKS, useWebsite, websiteStatus } from '../lib/website';

// D-048: status and readiness first, ONE main action, then Theme / Edit website / Preview. A public link only when Live (Phase 4a).
function Hub({ session }: { session: OwnerSession }) {
  const { website, error } = useWebsite();
  if (!website) return error ? <p className="form-error" role="alert">{error}</p> : <p role="status">Loading your website…</p>;
  const { ready, issues } = website.readiness;
  const status = websiteStatus(website, session.agency.reviewStatus);
  const firstIssue = issues[0] ? ISSUE_LINKS[issues[0].key] : undefined;
  const main = status.url ? { href: status.url, label: 'Open your website' }
    : !website.theme.preset ? { href: '/website/theme', label: 'Choose a theme' }
    : !ready && firstIssue ? { href: firstIssue.href, label: 'Continue setup' }
      : { href: '/website/preview', label: 'Preview your website' };
  return <>
    <section className="status-summary" aria-label="Website status">
      <div>
        <p className="status-label">Website</p>
        <p className="status-value">{status.label}</p>
        <p className="status-hint">{status.hint}</p>
        {status.url && <p className="status-hint"><a href={status.url} target="_blank" rel="noopener noreferrer" className="back-link">{status.url.replace('https://', '')}</a></p>}
      </div>
      <div>
        <p className="status-label">Theme</p>
        <p className="status-value">{website.theme.preset ? THEME_LABELS[website.theme.preset] : 'Not chosen yet'}</p>
      </div>
    </section>
    {!website.canEdit && <p className="form-notice" role="status">Your website is view-only right now. Contact EstateOS support if something needs to change.</p>}
    {issues.length > 0 && <section className="panel-plain" aria-labelledby="missing-title">
      <h2 id="missing-title">Needed before your website can go live</h2>
      <ul className="issue-list">
        {issues.map((issue) => <li key={issue.key}>
          <span>{issue.message}</span>
          {ISSUE_LINKS[issue.key] && <Link href={ISSUE_LINKS[issue.key].href}>{ISSUE_LINKS[issue.key].label}</Link>}
        </li>)}
      </ul>
    </section>}
    <div className="next-action">{status.url
      ? <a href={main.href} className="primary-link" target="_blank" rel="noopener noreferrer">{main.label}</a>
      : <Link href={main.href} className="primary-link">{main.label}</Link>}</div>
    <nav className="tool-grid" aria-label="Website tools">
      <Link href="/website/theme" className="tool-card"><strong>Theme</strong><span>Choose one of three styles for your website.</span></Link>
      <Link href="/website/editor" className="tool-card"><strong>Edit website</strong><span>Header, main section and contact details.</span></Link>
      <Link href="/website/preview" className="tool-card"><strong>Preview</strong><span>See your saved website privately. Not public.</span></Link>
    </nav>
  </>;
}

export default function WebsitePage() {
  return <OwnerPage>{(session) => <div className="page">
    <h1>My Website</h1>
    <Hub session={session} />
  </div>}</OwnerPage>;
}
