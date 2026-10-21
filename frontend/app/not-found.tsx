import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Website not available', robots: { index: false } };

// Phase 4a §1 Q6: one identical page for unknown, Not Live, Blocked and Deactivated sites. It reveals nothing.
export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 text-slate-900">
    <div className="max-w-md text-center">
      <h1 className="text-2xl font-semibold">This website is not available</h1>
      <p className="mt-3 text-slate-600">Please check the address and try again.</p>
    </div>
  </main>;
}
