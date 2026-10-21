import { HERO_IMAGE_SRC } from './hero-images';
import type { OptionalBlock, OptionalSection, SiteIcon, SiteModel, ThemePreset } from './types';

type CardData = { title: string; icon: SiteIcon };
export type LayoutData = { order: OptionalSection[]; visible: Record<'about' | 'services' | 'whyChooseUs' | 'team', boolean>; version: number };

/** Shape of GET /owner/website and GET /super-admin/agencies/:id/website (Phase 3b contract §6). */
export type WebsiteData = {
  theme: { preset: ThemePreset | null; version: number };
  sections: {
    header: { contactButtonLabel: string; preferredContact: 'WHATSAPP' | 'PHONE' | null; version: number };
    hero: { heading: string; subtitle?: string; ctaLabel: string; heroImageId: string | null; version: number };
    contact: { heading: string; message?: string; version: number };
    about: { heading: string; story?: string; version: number };
    services: { heading: string; cards: (CardData & { description?: string })[]; version: number };
    whyChooseUs: { heading: string; cards: (CardData & { detail?: string })[]; version: number };
    team: { heading: string; members: { name: string; role?: string; phone?: string; whatsapp?: string; contactConsent?: boolean }[]; version: number };
  };
  layout: LayoutData;
  mapped: { agencyName?: string; phone?: string; whatsapp?: string; publicEmail?: string; officeAddress?: string; city?: string };
  readiness: { ready: boolean; issues: { key: string; message: string }[] };
  heroDefaults: { id: string; label: string }[];
  canEdit: boolean;
  /** Phase 4a: truthful publication status; a URL only when actually Live. */
  publication?: { status: 'NEVER_PUBLISHED' | 'ACTIVATION_PENDING' | 'LIVE'; url?: string; firstLiveAt?: string };
};

/** The renderable part of a website: the saved draft, or a frozen published revision (Phase 4a, D-090). */
export type SiteContent = Pick<WebsiteData, 'theme' | 'sections' | 'layout' | 'mapped'>;

/** Phase 3c §3: a section is shown only when switched on AND it has its minimum content (never an empty section). */
function optionalBlocks(website: SiteContent): OptionalBlock[] {
  const { about, services, whyChooseUs, team } = website.sections;
  const blocks: OptionalBlock[] = [];
  for (const key of website.layout.order) {
    if (key === 'properties' || !website.layout.visible[key]) continue;
    if (key === 'about' && about.story) blocks.push({ key, heading: about.heading, story: about.story });
    if (key === 'services' && services.cards.length) blocks.push({ key, heading: services.heading, cards: services.cards.map(({ title, description, icon }) => ({ title, text: description, icon })) });
    if (key === 'whyChooseUs' && whyChooseUs.cards.length) blocks.push({ key, heading: whyChooseUs.heading, cards: whyChooseUs.cards.map(({ title, detail, icon }) => ({ title, text: detail, icon })) });
    if (key === 'team' && team.members.length) blocks.push({ key, heading: team.heading, members: team.members.map(({ name, role, phone, whatsapp }) => ({ name, role, phone, whatsapp })) });
  }
  return blocks;
}

/** Saved draft → render model (D-052: saved content and the applied theme only). Modern Light stands in until a theme is chosen. */
export function siteModelFromWebsite(website: SiteContent, themeOverride?: ThemePreset): SiteModel {
  const { header, hero, contact } = website.sections;
  const imageUrl = hero.heroImageId ? HERO_IMAGE_SRC[hero.heroImageId] : undefined;
  return {
    theme: themeOverride ?? website.theme.preset ?? 'MODERN_LIGHT',
    agencyName: website.mapped.agencyName ?? '',
    header: { contactButtonLabel: header.contactButtonLabel, preferredContact: header.preferredContact },
    hero: { heading: hero.heading, ...(hero.subtitle ? { subtitle: hero.subtitle } : {}), ctaLabel: hero.ctaLabel, ...(imageUrl ? { imageUrl } : {}) },
    contact: { heading: contact.heading, ...(contact.message ? { message: contact.message } : {}) },
    optional: optionalBlocks(website),
    contacts: {
      phone: website.mapped.phone, whatsapp: website.mapped.whatsapp, publicEmail: website.mapped.publicEmail,
      officeAddress: website.mapped.officeAddress, city: website.mapped.city,
    },
  };
}
