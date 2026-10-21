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

/** Everything the template needs to render one agency site. Built from the saved draft only (D-052). */
export type SiteModel = {
  theme: ThemePreset;
  agencyName: string;
  header: { contactButtonLabel: string; preferredContact: 'WHATSAPP' | 'PHONE' | null };
  hero: { heading: string; subtitle?: string; ctaLabel: string; imageUrl?: string };
  contact: { heading: string; message?: string };
  contacts: { phone?: string; whatsapp?: string; publicEmail?: string; officeAddress?: string; city?: string };
};
