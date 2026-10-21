import type { SiteIcon } from './types';

// Phase 3c §1 Q5: twelve simple line icons drawn in the template (24×24, stroke = currentColor). No icon uploads.
const PATHS: Record<SiteIcon, string[]> = {
  home: ['M3 11l9-7 9 7', 'M5 10v10h14V10', 'M10 20v-6h4v6'],
  key: ['M14 10a4 4 0 1 0-1.2 2.8L20 20', 'M17 17l2-2', 'M15 15l1.5-1.5'],
  building: ['M5 21V4h10v17', 'M15 9h4v12', 'M8 8h4', 'M8 12h4', 'M8 16h4', 'M3 21h18'],
  handshake: ['M3 12l4-4 4 2 3-2 3 1 4 3', 'M7 8v5l4 4 2-1 2 1 3-3', 'M11 13l2 2'],
  document: ['M7 3h7l4 4v14H7z', 'M14 3v4h4', 'M10 12h5', 'M10 16h5'],
  'map-pin': ['M12 21s-6-6.2-6-11a6 6 0 0 1 12 0c0 4.8-6 11-6 11z', 'M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'],
  search: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M16 16l5 5'],
  chart: ['M4 20V4', 'M4 20h16', 'M8 16v-4', 'M12 16V8', 'M16 16v-6'],
  shield: ['M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z', 'M9 12l2 2 4-4'],
  star: ['M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z'],
  phone: ['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z'],
  people: ['M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', 'M2.5 20a6.5 6.5 0 0 1 13 0', 'M16 4.3a3.5 3.5 0 0 1 0 6.4', 'M18 14a6.5 6.5 0 0 1 3.5 6'],
};

export function SiteIconGlyph({ icon, className }: { icon: SiteIcon; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {(PATHS[icon] ?? PATHS.home).map((d) => <path key={d} d={d} />)}
  </svg>;
}
