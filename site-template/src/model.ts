import { HERO_IMAGE_SRC } from './hero-images';
import type { SiteModel, ThemePreset } from './types';

/** Shape of GET /owner/website and GET /super-admin/agencies/:id/website (Phase 3b contract §6). */
export type WebsiteData = {
  theme: { preset: ThemePreset | null; version: number };
  sections: {
    header: { contactButtonLabel: string; preferredContact: 'WHATSAPP' | 'PHONE' | null; version: number };
    hero: { heading: string; subtitle?: string; ctaLabel: string; heroImageId: string | null; version: number };
    contact: { heading: string; message?: string; version: number };
  };
  mapped: { agencyName?: string; phone?: string; whatsapp?: string; publicEmail?: string; officeAddress?: string; city?: string };
  readiness: { ready: boolean; issues: { key: string; message: string }[] };
  heroDefaults: { id: string; label: string }[];
  canEdit: boolean;
};

/** Saved draft → render model (D-052: saved content and the applied theme only). Modern Light stands in until a theme is chosen. */
export function siteModelFromWebsite(website: WebsiteData, themeOverride?: ThemePreset): SiteModel {
  const { header, hero, contact } = website.sections;
  const imageUrl = hero.heroImageId ? HERO_IMAGE_SRC[hero.heroImageId] : undefined;
  return {
    theme: themeOverride ?? website.theme.preset ?? 'MODERN_LIGHT',
    agencyName: website.mapped.agencyName ?? '',
    header: { contactButtonLabel: header.contactButtonLabel, preferredContact: header.preferredContact },
    hero: { heading: hero.heading, ...(hero.subtitle ? { subtitle: hero.subtitle } : {}), ctaLabel: hero.ctaLabel, ...(imageUrl ? { imageUrl } : {}) },
    contact: { heading: contact.heading, ...(contact.message ? { message: contact.message } : {}) },
    contacts: {
      phone: website.mapped.phone, whatsapp: website.mapped.whatsapp, publicEmail: website.mapped.publicEmail,
      officeAddress: website.mapped.officeAddress, city: website.mapped.city,
    },
  };
}
