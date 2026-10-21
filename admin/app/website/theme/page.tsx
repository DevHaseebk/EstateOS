'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SiteTemplate, siteModelFromWebsite, THEME_DESCRIPTIONS, THEME_LABELS, THEME_PRESETS, type ThemePreset, type WebsiteData } from 'site-template';
import { OwnerPage } from '../../components/OwnerPage';
import { ApiError, apiMutation } from '../../lib/api';
import { useWebsite } from '../../lib/website';

// D-049: browsing a candidate never saves it; only Apply theme does. Cancel keeps the saved theme.
function ThemeSelection() {
  const { website, setWebsite, error, reload } = useWebsite();
  const [candidate, setCandidate] = useState<ThemePreset | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: 'error' | 'notice'; text: string } | null>(null);
  if (!website) return error ? <p className="form-error" role="alert">{error}</p> : <p role="status">Loading themes…</p>;
  const saved = website.theme.preset;
  const shown = candidate ?? saved ?? 'MODERN_LIGHT';
  const changed = shown !== saved;

  async function apply() {
    if (!website) return;
    setBusy(true); setMessage(null);
    try {
      const result = await apiMutation<{ theme: WebsiteData['theme']; readiness: WebsiteData['readiness'] }>('/api/v1/owner/website/theme', 'PUT',
        { preset: shown, expectedThemeVersion: website.theme.version });
      if (result) setWebsite({ ...website, theme: result.theme, readiness: result.readiness });
      setCandidate(null);
      setMessage({ kind: 'notice', text: `${THEME_LABELS[shown]} is now your theme.` });
    } catch (failure) {
      if (failure instanceof ApiError && failure.code === 'THEME_CONFLICT') {
        setMessage({ kind: 'error', text: 'The theme was changed in another window. The latest saved theme is shown now.' });
        setCandidate(null); void reload();
      } else setMessage({ kind: 'error', text: failure instanceof Error ? failure.message : 'Could not apply the theme. Nothing was changed.' });
    } finally { setBusy(false); }
  }

  return <>
    {!website.canEdit && <p className="form-notice" role="status">Your website is view-only right now.</p>}
    {website.publication?.status === 'LIVE' && <p className="live-note">An applied theme stays private until you publish it from <Link href="/website">My Website</Link>.</p>}
    <div className="theme-grid" role="radiogroup" aria-label="Website theme">
      {THEME_PRESETS.map((preset) => <button key={preset} type="button" role="radio" aria-checked={shown === preset}
        className={`theme-card theme-${preset.toLowerCase()}${shown === preset ? ' selected' : ''}`} onClick={() => { setCandidate(preset); setMessage(null); }}>
        <span className="theme-swatch" aria-hidden="true"><span /><span /><span /></span>
        <strong>{THEME_LABELS[preset]}</strong>
        <span className="field-hint">{THEME_DESCRIPTIONS[preset]}</span>
        {saved === preset && <span className="badge-saved">Current theme</span>}
      </button>)}
    </div>
    <div className="form-actions">
      {website.canEdit && <button type="button" className="primary-inline" disabled={!changed || busy} onClick={() => void apply()}>
        {busy ? 'Applying…' : `Apply ${THEME_LABELS[shown]}`}</button>}
      {changed && <button type="button" className="secondary" disabled={busy} onClick={() => setCandidate(null)}>Cancel</button>}
      <Link href="/website" className="back-link">Back to My Website</Link>
    </div>
    {message && <p className={message.kind === 'error' ? 'form-error' : 'form-notice'} role={message.kind === 'error' ? 'alert' : 'status'}>{message.text}</p>}
    <section aria-label="Theme preview" className="preview-frame">
      <p className="preview-label">{changed ? `Preview of ${THEME_LABELS[shown]} — not applied` : saved ? `Your saved theme: ${THEME_LABELS[shown]}` : 'Theme not chosen yet — showing Modern Light'}</p>
      <div className="preview-canvas"><SiteTemplate model={siteModelFromWebsite(website, shown)} /></div>
    </section>
  </>;
}

export default function ThemePage() {
  return <OwnerPage>{() => <div className="page page-wide">
    <h1>Theme</h1>
    <p className="page-intro">One website design in three styles. Changing the style keeps all your content.</p>
    <ThemeSelection />
  </div>}</OwnerPage>;
}
