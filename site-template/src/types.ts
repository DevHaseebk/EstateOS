// D-034: exactly three curated presets of the ONE shared template (D-030).
export const THEME_PRESETS = ['MODERN_LIGHT', 'WARM_EDITORIAL', 'CONTEMPORARY_DARK'] as const;
export type ThemePreset = typeof THEME_PRESETS[number];

export const THEME_LABELS: Record<ThemePreset, string> = {
  MODERN_LIGHT: 'Modern Light',
  WARM_EDITORIAL: 'Warm Editorial',
  CONTEMPORARY_DARK: 'Contemporary Dark',
};

export const THEME_DESCRIPTIONS: Record<ThemePreset, string> = {
  MODERN_LIGHT: 'Clean and bright, with calm blue-green accents.',
  WARM_EDITORIAL: 'Warm paper tones with elegant serif headings.',
  CONTEMPORARY_DARK: 'Dark and premium, with soft gold accents.',
};

// Phase 3c: the D-032 optional sections, a fixed icon list, and their default order (Properties waits for Phase 5).
export const SITE_ICONS = ['home', 'key', 'building', 'handshake', 'document', 'map-pin', 'search', 'chart', 'shield', 'star', 'phone', 'people'] as const;
export type SiteIcon = typeof SITE_ICONS[number];
export const ICON_LABELS: Record<SiteIcon, string> = {
  home: 'Home', key: 'Key', building: 'Building', handshake: 'Handshake', document: 'Document', 'map-pin': 'Map pin',
  search: 'Search', chart: 'Chart', shield: 'Shield', star: 'Star', phone: 'Phone', people: 'People',
};
export const OPTIONAL_SECTIONS = ['about', 'services', 'properties', 'whyChooseUs', 'team'] as const;
export type OptionalSection = typeof OPTIONAL_SECTIONS[number];
export const OPTIONAL_SECTION_LABELS: Record<OptionalSection, string> = {
  about: 'About', services: 'Services', properties: 'Properties', whyChooseUs: 'Why Choose Us', team: 'Team',
};

export type Card = { title: string; text?: string; icon: SiteIcon };
export type TeamMember = { name: string; role?: string; phone?: string; whatsapp?: string };
/** One shown optional section, already filtered to visible + minimum content, in layout order. */
export type OptionalBlock =
  | { key: 'about'; heading: string; story: string }
  | { key: 'services' | 'whyChooseUs'; heading: string; cards: Card[] }
  | { key: 'team'; heading: string; members: TeamMember[] };

/** Everything the template needs to render one agency site. Built from the saved draft only (D-052). */
export type SiteModel = {
  theme: ThemePreset;
  agencyName: string;
  header: { contactButtonLabel: string; preferredContact: 'WHATSAPP' | 'PHONE' | null };
  hero: { heading: string; subtitle?: string; ctaLabel: string; imageUrl?: string };
  contact: { heading: string; message?: string };
  optional: OptionalBlock[];
  contacts: { phone?: string; whatsapp?: string; publicEmail?: string; officeAddress?: string; city?: string };
};
