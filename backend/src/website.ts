import { readFileSync } from 'node:fs';
import mongoose, { type Types } from 'mongoose';
import { WebsiteDraft } from './models.js';
import { ownerCanEdit } from './review.js';

// Phase 3b My Website foundation (docs/PHASE-3B-WEBSITE-FOUNDATION-CONTRACT-APPROVED.md).

type HeroDefault = { id: string; label: string; file: string; source: string; author: string; license: string; recordedAt: string };
const LICENCE_FIELDS = ['id', 'label', 'file', 'source', 'author', 'license', 'recordedAt'] as const;

/**
 * D-108: the owner-supplied platform Hero photos. Only entries with every licence field filled count.
 * Read on each call so a newly recorded photo needs no restart. HERO_DEFAULTS_PATH overrides the file (tests).
 */
export function licensedHeroDefaults(): HeroDefault[] {
  try {
    const path = process.env.HERO_DEFAULTS_PATH ?? require.resolve('site-template/hero-defaults.json');
    const list: unknown = JSON.parse(readFileSync(path, 'utf8'));
    if (!Array.isArray(list)) return [];
    return list.filter((entry): entry is HeroDefault => typeof entry === 'object' && entry !== null &&
      LICENCE_FIELDS.every((field) => typeof (entry as Record<string, unknown>)[field] === 'string' && ((entry as Record<string, string>)[field]).trim() !== ''));
  } catch {
    return [];
  }
}

type AgencyFields = {
  _id: Types.ObjectId; name: string; mobileE164: string; whatsappE164: string; reviewStatus: string; restrictionStatus?: string | null;
  publicContact?: { showMobile?: boolean | null; showWhatsapp?: boolean | null } | null;
  profile?: { publicEmail?: string | null; officeAddress?: string | null; city?: string | null } | null;
};

/** D-085 / D-099: the Profile values the website may use. A number is mapped only when chosen as public. */
export function mapFromAgency(agency: AgencyFields) {
  return {
    agencyName: agency.name,
    ...(agency.publicContact?.showMobile ? { phone: agency.mobileE164 } : {}),
    ...(agency.publicContact?.showWhatsapp ? { whatsapp: agency.whatsappE164 } : {}),
    ...(agency.profile?.publicEmail ? { publicEmail: agency.profile.publicEmail } : {}),
    ...(agency.profile?.officeAddress ? { officeAddress: agency.profile.officeAddress } : {}),
    ...(agency.profile?.city ? { city: agency.profile.city } : {}),
    mappedAt: new Date(),
  };
}

type CardFields = { title: string; description?: string | null; detail?: string | null; icon: string };
type MemberFields = { name: string; role?: string | null; phone?: string | null; whatsapp?: string | null; contactConsent?: boolean | null };
export type OptionalKey = 'about' | 'services' | 'whyChooseUs' | 'team';
export const OPTIONAL_KEYS: readonly OptionalKey[] = ['about', 'services', 'whyChooseUs', 'team'];
const DEFAULT_ORDER = ['about', 'services', 'properties', 'whyChooseUs', 'team'];
const optional = <T extends object>(entries: T) => Object.fromEntries(Object.entries(entries).filter(([, value]) => value !== undefined && value !== null && value !== '')) as Partial<T>;

export type DraftFields = {
  theme?: { preset?: string | null; version?: number | null } | null;
  sections?: {
    header?: { contactButtonLabel?: string | null; preferredContact?: string | null; version?: number | null } | null;
    hero?: { heading?: string | null; subtitle?: string | null; ctaLabel?: string | null; heroImage?: { assetId?: string | null } | null; version?: number | null } | null;
    contact?: { heading?: string | null; message?: string | null; version?: number | null } | null;
    about?: { heading?: string | null; story?: string | null; version?: number | null } | null;
    services?: { heading?: string | null; cards?: CardFields[] | null; version?: number | null } | null;
    whyChooseUs?: { heading?: string | null; cards?: CardFields[] | null; version?: number | null } | null;
    team?: { heading?: string | null; members?: MemberFields[] | null; version?: number | null } | null;
    properties?: { heading?: string | null; displayCount?: number | null; version?: number | null } | null;
  } | null;
  layout?: { order?: string[] | null; visible?: Partial<Record<OptionalKey | 'properties', boolean | null>> | null; version?: number | null } | null;
  mapped?: { agencyName?: string | null; phone?: string | null; whatsapp?: string | null; publicEmail?: string | null; officeAddress?: string | null; city?: string | null } | null;
};

/** Returns the agency's draft, creating it (with defaults and mapped Profile values) on first use. */
export async function ensureDraft(agency: AgencyFields): Promise<DraftFields> {
  const existing = await WebsiteDraft.findOne({ agencyId: agency._id }).lean();
  if (existing) return existing;
  try {
    await WebsiteDraft.create({ agencyId: agency._id, mapped: mapFromAgency(agency) });
  } catch (error) {
    if (!(error instanceof mongoose.mongo.MongoServerError && error.code === 11000)) throw error;
  }
  const created = await WebsiteDraft.findOne({ agencyId: agency._id }).lean();
  if (!created) throw new Error('Website draft could not be created');
  return created;
}

/** A not-yet-saved draft with defaults, for read-only viewers (Super Admin) of agencies that never opened My Website. */
export function virtualDraft(agency: AgencyFields): DraftFields {
  return new WebsiteDraft({ agencyId: agency._id, mapped: mapFromAgency(agency) }).toObject();
}

export type ReadinessIssue = { key: 'THEME' | 'AGENCY_NAME' | 'HERO_HEADING' | 'PUBLIC_CONTACT' | 'HERO_IMAGE'; message: string };

/** D-033: the one server-side readiness rule. Same messages for owner and Super Admin. Computed, never stored. */
export function getReadinessIssues(draft: DraftFields, licensedIds: ReadonlySet<string> = new Set(licensedHeroDefaults().map((entry) => entry.id))): ReadinessIssue[] {
  const issues: ReadinessIssue[] = [];
  const mapped = draft.mapped ?? {};
  const hero = draft.sections?.hero ?? {};
  if (!draft.theme?.preset) issues.push({ key: 'THEME', message: 'Choose a theme for your website.' });
  if (!mapped.agencyName?.trim()) issues.push({ key: 'AGENCY_NAME', message: 'Add your agency name.' });
  if (!hero.heading?.trim()) issues.push({ key: 'HERO_HEADING', message: 'Write a main heading for your website.' });
  if (!mapped.phone && !mapped.whatsapp) issues.push({ key: 'PUBLIC_CONTACT', message: 'Choose a phone or WhatsApp number to show on your website (Agency profile).' });
  if (!hero.heroImage?.assetId || !licensedIds.has(hero.heroImage.assetId)) issues.push({ key: 'HERO_IMAGE', message: 'Choose a main photo for your website.' });
  return issues;
}

export function readinessView(draft: DraftFields) {
  const issues = getReadinessIssues(draft);
  return { ready: issues.length === 0, issues };
}

export type SectionKey = 'header' | 'hero' | 'contact' | OptionalKey | 'properties';

/** Phase 3c §3: the content a section needs before it may be shown (never an empty section, D-032). */
export function hasMinimumContent(draft: DraftFields, section: OptionalKey): boolean {
  const sections = draft.sections ?? {};
  if (section === 'about') return Boolean(sections.about?.story?.trim());
  if (section === 'team') return (sections.team?.members?.length ?? 0) > 0;
  return (sections[section]?.cards?.length ?? 0) > 0;
}

export function layoutView(draft: DraftFields) {
  const layout = draft.layout ?? {};
  return {
    order: layout.order?.length === DEFAULT_ORDER.length ? [...layout.order] : [...DEFAULT_ORDER],
    visible: Object.fromEntries([...OPTIONAL_KEYS, 'properties' as const].map((key) => [key, layout.visible?.[key] ?? false])) as Record<OptionalKey | 'properties', boolean>,
    version: layout.version ?? 0,
  };
}

export function sectionView(draft: DraftFields, section: SectionKey) {
  const sections = draft.sections ?? {};
  if (section === 'about') {
    const about = sections.about ?? {};
    return { heading: about.heading ?? 'About us', ...optional({ story: about.story }), version: about.version ?? 0 };
  }
  if (section === 'services' || section === 'whyChooseUs') {
    const block = sections[section] ?? {};
    const textKey = section === 'services' ? 'description' : 'detail';
    return {
      heading: block.heading ?? (section === 'services' ? 'Our services' : 'Why choose us'),
      cards: (block.cards ?? []).map((card) => ({ title: card.title, ...optional({ [textKey]: card[textKey] }), icon: card.icon })),
      version: block.version ?? 0,
    };
  }
  if (section === 'properties') {
    const block = sections.properties ?? {};
    return { heading: block.heading ?? 'Our properties', displayCount: block.displayCount === 3 ? 3 : 6, version: block.version ?? 0 };
  }
  if (section === 'team') {
    const team = sections.team ?? {};
    return {
      heading: team.heading ?? 'Our team',
      members: (team.members ?? []).map((member) => ({ name: member.name, ...optional({ role: member.role, phone: member.phone, whatsapp: member.whatsapp }), ...(member.contactConsent ? { contactConsent: true } : {}) })),
      version: team.version ?? 0,
    };
  }
  if (section === 'header') {
    const header = sections.header ?? {};
    return { contactButtonLabel: header.contactButtonLabel ?? 'Contact us', preferredContact: header.preferredContact ?? null, version: header.version ?? 0 };
  }
  if (section === 'hero') {
    const hero = sections.hero ?? {};
    return {
      heading: hero.heading ?? '', ...(hero.subtitle ? { subtitle: hero.subtitle } : {}), ctaLabel: hero.ctaLabel ?? 'Contact us',
      heroImageId: hero.heroImage?.assetId ?? null, version: hero.version ?? 0,
    };
  }
  const contact = sections.contact ?? {};
  return { heading: contact.heading ?? 'Get in touch', ...(contact.message ? { message: contact.message } : {}), version: contact.version ?? 0 };
}

export function websiteView(agency: AgencyFields, draft: DraftFields, canEdit = ownerCanEdit(agency)) {
  const mapped = draft.mapped ?? {};
  return {
    theme: { preset: draft.theme?.preset ?? null, version: draft.theme?.version ?? 0 },
    sections: Object.fromEntries((['header', 'hero', 'contact', ...OPTIONAL_KEYS, 'properties'] as SectionKey[]).map((key) => [key, sectionView(draft, key)])),
    layout: layoutView(draft),
    mapped: Object.fromEntries(['agencyName', 'phone', 'whatsapp', 'publicEmail', 'officeAddress', 'city']
      .map((key) => [key, mapped[key as keyof typeof mapped]]).filter(([, value]) => value)),
    readiness: readinessView(draft),
    heroDefaults: licensedHeroDefaults().map(({ id, label }) => ({ id, label })),
    canEdit,
  };
}
