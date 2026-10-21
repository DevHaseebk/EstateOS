import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Phase 4a §7 frontend checks: host parsing, the server-side public fetch, and rendering a frozen revision.
const domain = 'sites.estateos.localhost';

test('tenant host parsing accepts only <slug>.<domain>', async () => {
  const { parseTenantHost } = await import('../../frontend/app/lib/tenant.ts');
  assert.equal(parseTenantHost('city-homes.sites.estateos.localhost', domain), 'city-homes');
  assert.equal(parseTenantHost('City-Homes.Sites.EstateOS.localhost:443', domain), 'city-homes');
  assert.equal(parseTenantHost('sites.estateos.localhost', domain), null);
  assert.equal(parseTenantHost('a.b.sites.estateos.localhost', domain), null);
  assert.equal(parseTenantHost('evil.example.com', domain), null);
  assert.equal(parseTenantHost('city-homes.sites.estateos.localhost.evil.com', domain), null);
  assert.equal(parseTenantHost('-bad.sites.estateos.localhost', domain), null);
  assert.equal(parseTenantHost('ab.sites.estateos.localhost', domain), null);
  assert.equal(parseTenantHost(null, domain), null);
});

test('public fetch sends only the public key and maps 404 to null', async () => {
  const { fetchPublishedSite } = await import('../../frontend/app/lib/public-api.ts');
  process.env.PUBLIC_API_KEY = 'test-public-api-key-with-at-least-thirty-two-characters-x';
  process.env.API_URL = 'http://127.0.0.1:4003';
  const originalFetch = globalThis.fetch;
  const calls: { url: string; headers: Record<string, string> }[] = [];
  globalThis.fetch = async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(input), headers: init?.headers as Record<string, string> });
    return String(input).endsWith('/missing') ? Response.json({ error: {} }, { status: 404 }) : Response.json({ data: { site: {}, revision: 1, publishedAt: 'now' } });
  };
  try {
    assert.deepEqual(await fetchPublishedSite('city-homes'), { site: {}, revision: 1, publishedAt: 'now' });
    assert.equal(await fetchPublishedSite('missing'), null);
  } finally { globalThis.fetch = originalFetch; }
  assert.equal(calls[0]!.url, 'http://127.0.0.1:4003/api/v1/public/sites/city-homes');
  assert.deepEqual(Object.keys(calls[0]!.headers), ['x-public-api-key']);
});

test('a frozen revision renders server-side with the shared template', async () => {
  // tsx applies this package's tsconfig only to backend files, so site-template's JSX compiles in classic mode here.
  (globalThis as { React?: typeof React }).React = React;
  const { SiteTemplate, siteModelFromWebsite } = await import('site-template');
  const site = {
    theme: { preset: 'WARM_EDITORIAL' as const, version: 1 },
    sections: {
      header: { contactButtonLabel: 'Contact us', preferredContact: null, version: 0 },
      hero: { heading: 'Homes across Karachi', ctaLabel: 'Talk to us', heroImageId: 'test-licensed', version: 1 },
      contact: { heading: 'Get in touch', version: 0 },
      about: { heading: 'About us', version: 0 },
      services: { heading: 'Our services', cards: [], version: 0 },
      whyChooseUs: { heading: 'Why choose us', cards: [], version: 0 },
      team: { heading: 'Our team', members: [], version: 0 },
    },
    layout: { order: ['about', 'services', 'properties', 'whyChooseUs', 'team'] as ('about' | 'services' | 'properties' | 'whyChooseUs' | 'team')[], visible: { about: false, services: false, whyChooseUs: false, team: false }, version: 0 },
    mapped: { agencyName: 'Synthetic Realty', whatsapp: '+923001234567' },
  };
  const html = renderToStaticMarkup(React.createElement(SiteTemplate, { model: siteModelFromWebsite(site) }));
  assert.match(html, /data-theme="WARM_EDITORIAL"/);
  assert.match(html, /Homes across Karachi/);
  assert.match(html, /wa\.me\/923001234567/);
});
