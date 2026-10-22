import { HERO_IMAGE_SRC } from './hero-images';
import type { PublicProperty } from './property';
import type { OptionalBlock, OptionalSection, SiteIcon, SiteModel, ThemePreset } from './types';

type CardData = { title: string; icon: SiteIcon };
export type LayoutData = { order: OptionalSection[]; visible: Record<'about' | 'services' | 'whyChooseUs' | 'team' | 'properties', boolean>; version: number };

/** Shape of GET /owner/website and GET /super-admin/agencies/:id/website (Phase 3b contract §6). */
export type WebsiteData = {
  theme: { preset: ThemePreset | null; version: number };
  sections: {
    header: { contactButtonLabel: string; preferredContact: 'WHATSAPP' | 'PHONE' | null; logoMediaId?: string | null; version: number };
    hero: { heading: string; subtitle?: string; ctaLabel: string; heroImageId: string | null; heroUploadId?: string | null; version: number };
    contact: { heading: string; message?: string; version: number };
    about: { heading: string; story?: string; photoMediaId?: string; version: number };
    services: { heading: string; cards: (CardData & { description?: string })[]; version: number };
    whyChooseUs: { heading: string; cards: (CardData & { detail?: string })[]; version: number };
    team: { heading: string; members: { name: string; role?: string; phone?: string; whatsapp?: string; contactConsent?: boolean; photoMediaId?: string; photoConsent?: boolean }[]; version: number };
    /** Phase 5a: public Properties section settings (D-032). */
    properties: { heading: string; displayCount: 3 | 6; version: number };
  };
  /** Phase 5a: eligible properties (Available, not archived) — the draft's for previews, the revision's when published. */
  properties?: PublicProperty[];
  layout: LayoutData;
  mapped: { agencyName?: string; phone?: string; whatsapp?: string; publicEmail?: string; officeAddress?: string; city?: string };
  readiness: { ready: boolean; issues: { key: string; message: string }[] };
  heroDefaults: { id: string; label: string }[];
  canEdit: boolean;
  /** Phase 4a: truthful publication status; a URL only when actually Live. */
  publication?: {
    status: 'NEVER_PUBLISHED' | 'ACTIVATION_PENDING' | 'LIVE'; url?: string; firstLiveAt?: string;
    /** Phase 4b (D-054): only for Live sites. */
    liveRevision?: number; publishedAt?: string; unpublishedChanges?: boolean;
  };
};

/** The renderable part of a website: the saved draft, or a frozen published revision (Phase 4a, D-090). */
export type SiteContent = Pick<WebsiteData, 'theme' | 'sections' | 'layout' | 'mapped' | 'properties'>;

/**
 * Phase 3d: how the current host turns an uploaded media id into an image URL (owner preview, Super Admin preview
 * or the public site). Without it, uploaded images are simply not shown.
 */
export type MediaUrl = (mediaId: string, width: 480 | 960 | 1600) => string;
const srcSet = (mediaUrl: MediaUrl, id: string, widths: (480 | 960 | 1600)[]) => widths.map((width) => `${mediaUrl(id, width)} ${width}w`).join(', ');

/** Phase 3c §3: a section is shown only when switched on AND it has its minimum content (never an empty section). */
function optionalBlocks(website: SiteContent, mediaUrl?: MediaUrl): OptionalBlock[] {
  const { about, services, whyChooseUs, team } = website.sections;
  const blocks: OptionalBlock[] = [];
  for (const key of website.layout.order) {
    if (!website.layout.visible[key]) continue;
    // Never an empty section and never fake listings (D-032, D-078): only real eligible properties, newest first.
    if (key === 'properties') {
      const items = (website.properties ?? []).slice(0, website.sections.properties?.displayCount ?? 6).map((property) => (
        property.coverMediaId && mediaUrl
          ? { ...property, coverUrl: mediaUrl(property.coverMediaId, 960), coverSrcSet: srcSet(mediaUrl, property.coverMediaId, [480, 960]) }
          : property));
      if (items.length) blocks.push({ key, heading: website.sections.properties?.heading ?? 'Our properties', items });
      continue;
    }
    if (key === 'about' && about.story) {
      // Phase 3e: the optional About photo (D-032), alt text names the agency.
      const photo = about.photoMediaId && mediaUrl
        ? { url: mediaUrl(about.photoMediaId, 960), srcSet: srcSet(mediaUrl, about.photoMediaId, [480, 960]), alt: `Photo of ${website.mapped.agencyName || 'our agency'}` }
        : undefined;
      blocks.push({ key, heading: about.heading, story: about.story, ...(photo ? { photo } : {}) });
    }
    if (key === 'services' && services.cards.length) blocks.push({ key, heading: services.heading, cards: services.cards.map(({ title, description, icon }) => ({ title, text: description, icon })) });
    if (key === 'whyChooseUs' && whyChooseUs.cards.length) blocks.push({ key, heading: whyChooseUs.heading, cards: whyChooseUs.cards.map(({ title, detail, icon }) => ({ title, text: detail, icon })) });
    if (key === 'team' && team.members.length) blocks.push({ key, heading: team.heading, members: team.members.map(({ name, role, phone, whatsapp, photoMediaId }) => ({
      name, role, phone, whatsapp, ...(photoMediaId && mediaUrl ? { photoUrl: mediaUrl(photoMediaId, 480) } : {}),
    })) });
  }
  return blocks;
}

/** Saved draft → render model (D-052: saved content and the applied theme only). Modern Light stands in until a theme is chosen. */
export function siteModelFromWebsite(website: SiteContent, themeOverride?: ThemePreset, options: { mediaUrl?: MediaUrl } = {}): SiteModel {
  const { header, hero, contact } = website.sections;
  const { mediaUrl } = options;
  const upload = hero.heroUploadId && mediaUrl ? hero.heroUploadId : null;
  const imageUrl = upload ? mediaUrl!(upload, 1600) : hero.heroImageId ? HERO_IMAGE_SRC[hero.heroImageId] : undefined;
  const imageSrcSet = upload ? srcSet(mediaUrl!, upload, [960, 1600]) : undefined;
  const logoUrl = header.logoMediaId && mediaUrl ? mediaUrl(header.logoMediaId, 480) : undefined;
  return {
    theme: themeOverride ?? website.theme.preset ?? 'MODERN_LIGHT',
    agencyName: website.mapped.agencyName ?? '',
    header: { contactButtonLabel: header.contactButtonLabel, preferredContact: header.preferredContact, ...(logoUrl ? { logoUrl } : {}) },
    hero: { heading: hero.heading, ...(hero.subtitle ? { subtitle: hero.subtitle } : {}), ctaLabel: hero.ctaLabel, ...(imageUrl ? { imageUrl } : {}), ...(imageSrcSet ? { imageSrcSet } : {}) },
    contact: { heading: contact.heading, ...(contact.message ? { message: contact.message } : {}) },
    optional: optionalBlocks(website, mediaUrl),
    contacts: {
      phone: website.mapped.phone, whatsapp: website.mapped.whatsapp, publicEmail: website.mapped.publicEmail,
      officeAddress: website.mapped.officeAddress, city: website.mapped.city,
    },
  };
}
