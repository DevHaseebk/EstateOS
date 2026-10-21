import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { SiteTemplate, siteModelFromWebsite } from 'site-template';
import { fetchPublishedSite, publicSiteDomain } from './lib/public-api';
import { parseTenantHost } from './lib/tenant';

// Phase 4a §5: one multi-tenant renderer (D-075). An agency host shows its Live revision; the bare host keeps the placeholder.
async function currentSlug() {
  return parseTenantHost((await headers()).get('host'), publicSiteDomain());
}

export async function generateMetadata(): Promise<Metadata> {
  const slug = await currentSlug();
  if (!slug) return { title: 'EstateOS' };
  const published = await fetchPublishedSite(slug);
  if (!published) return { title: 'Website not available', robots: { index: false } };
  const { mapped, sections } = published.site;
  return { title: mapped.agencyName, description: sections.hero.subtitle ?? sections.hero.heading };
}

export default async function Home() {
  const slug = await currentSlug();
  if (slug) {
    const published = await fetchPublishedSite(slug);
    if (!published) notFound();
    return <SiteTemplate model={siteModelFromWebsite(published.site)} />;
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 text-slate-900">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">EstateOS</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">EstateOS — Agency Websites</h1>
        <p className="mt-5 text-base leading-7 text-slate-600">Agency websites are served from their own web addresses.</p>
      </div>
    </main>
  );
}
