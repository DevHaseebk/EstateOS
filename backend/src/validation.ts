import { z } from 'zod';
import { normalizeEmail, validatePassword } from './security.js';

const email = z.string().trim().pipe(z.email().max(254)).transform(normalizeEmail);
const name = (max: number) => z.string().trim().min(2).max(max);
const phone = z.string().trim().transform((input, context) => {
  const compact = input.replace(/[\s()-]/g, '');
  let normalized = compact;
  if (/^03\d{9}$/.test(compact)) normalized = `+92${compact.slice(1)}`;
  else if (/^92\d{10}$/.test(compact)) normalized = `+${compact}`;
  if (!/^\+[1-9]\d{7,14}$/.test(normalized)) {
    context.addIssue({ code: 'custom', message: 'Enter a valid phone number' });
    return z.NEVER;
  }
  return normalized;
});
export const signupSchema = z.strictObject({
  ownerName: name(100), agencyName: name(120), mobile: phone, whatsapp: phone,
  email, password: z.string().min(12).max(128),
}).refine((input) => validatePassword(input.password, [input.email, input.ownerName, input.agencyName]), { message: 'Choose a stronger password', path: ['password'] });
export const loginSchema = z.strictObject({ email, password: z.string().min(1).max(1024) });
export const resetSchema = z.strictObject({ resetCode: z.string().min(32).max(128), newPassword: z.string().min(12).max(128) })
  .refine((input) => validatePassword(input.newPassword), { message: 'Choose a stronger password', path: ['newPassword'] });

// Phase 2a review contract §5.
const reviewReason = z.string().trim().min(10, 'Reason must be at least 10 characters').max(1000, 'Reason must be at most 1000 characters');
const expectedReviewVersion = z.number().int().min(0);
export const reviewDecisionSchema = z.discriminatedUnion('decision', [
  z.strictObject({ decision: z.literal('APPROVE'), expectedReviewVersion }),
  z.strictObject({ decision: z.literal('REQUEST_CHANGES'), reason: reviewReason, expectedReviewVersion }),
  z.strictObject({ decision: z.literal('REJECT'), reason: reviewReason, expectedReviewVersion }),
]);
export const reopenSchema = z.strictObject({ reason: reviewReason, expectedReviewVersion });
export const resubmitSchema = z.strictObject({ expectedReviewVersion });
export const reviewQueueQuerySchema = z.strictObject({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().max(200).optional(),
});

// Phase 2b directory and restriction contract §6.
export const restrictionSchema = z.strictObject({
  action: z.enum(['BLOCK', 'DEACTIVATE', 'RESTORE']),
  reason: reviewReason,
  expectedRestrictionVersion: z.number().int().min(0),
});
export const directoryQuerySchema = z.strictObject({
  q: z.string().trim().min(2, 'Search must be at least 2 characters').max(100).optional(),
  review: z.enum(['PENDING', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED']).optional(),
  restriction: z.enum(['NONE', 'BLOCKED', 'DEACTIVATED']).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().max(200).optional(),
});

// Phase 3a Agency Profile contract §4–§5: the whole form is saved at once.
const optionalText = (max: number) => z.string().trim().max(max, `Must be at most ${max} characters`).optional()
  .transform((value) => value ? value : undefined);
const optionalEmail = z.string().trim().max(254).optional()
  .refine((value) => !value || z.email().safeParse(value).success, 'Enter a valid email address')
  .transform((value) => value ? value.toLowerCase() : undefined);
export const profileSchema = z.strictObject({
  agencyName: name(120),
  ownerName: name(100),
  mobile: phone,
  whatsapp: phone,
  publicContact: z.strictObject({ showMobile: z.boolean(), showWhatsapp: z.boolean() }),
  profile: z.strictObject({
    description: optionalText(600),
    officeAddress: optionalText(200),
    city: optionalText(80),
    serviceAreas: optionalText(200),
    publicEmail: optionalEmail,
  }),
  expectedProfileVersion: z.number().int().min(0),
});

// Phase 3d: random 32-hex public media ids.
const mediaId = z.string().regex(/^[a-f0-9]{32}$/, 'Unknown image');

// Phase 3b My Website contract §1 Q4 and §6: text limits and strict section bodies.
const sectionText = (min: number, max: number) => z.string().trim()
  .min(min, `Must be at least ${min} characters`).max(max, `Must be at most ${max} characters`);
const optionalSectionText = (max: number) => z.string().trim().max(max, `Must be at most ${max} characters`).optional()
  .transform((value) => value ? value : undefined);
const siteIcon = z.enum(['home', 'key', 'building', 'handshake', 'document', 'map-pin', 'search', 'chart', 'shield', 'star', 'phone', 'people'], 'Choose an icon from the list');
const optionalPhone = z.string().trim().optional().transform((value) => value ? value : undefined).pipe(phone.optional());
export const themeSchema = z.strictObject({
  preset: z.enum(['MODERN_LIGHT', 'WARM_EDITORIAL', 'CONTEMPORARY_DARK']),
  expectedThemeVersion: z.number().int().min(0),
});
export const sectionSchemas = {
  header: z.strictObject({
    contactButtonLabel: sectionText(2, 30),
    preferredContact: z.enum(['WHATSAPP', 'PHONE']).nullable().optional(),
    // Phase 3d: an uploaded logo (purpose LOGO); null removes it.
    logoMediaId: mediaId.nullable().optional(),
    expectedVersion: z.number().int().min(0),
  }),
  hero: z.strictObject({
    heading: sectionText(3, 80),
    subtitle: optionalSectionText(160),
    ctaLabel: sectionText(2, 30),
    heroImageId: z.string().max(100).nullable().optional(),
    // Phase 3d: the agency's own uploaded Hero photo (purpose HERO). At most one of the two may be chosen.
    heroUploadId: mediaId.nullable().optional(),
    expectedVersion: z.number().int().min(0),
  }).refine((input) => !(input.heroImageId && input.heroUploadId), { message: 'Choose either a platform photo or your own upload', path: ['heroUploadId'] }),
  contact: z.strictObject({
    heading: sectionText(3, 80),
    message: optionalSectionText(300),
    expectedVersion: z.number().int().min(0),
  }),
  // Phase 3c §3: optional sections. Empty content is allowed while hidden; the route enforces minimums when shown.
  about: z.strictObject({
    heading: sectionText(3, 60),
    story: z.string().trim().optional().transform((value) => value ? value : undefined)
      .pipe(z.string().min(20, 'Must be at least 20 characters').max(1200, 'Must be at most 1200 characters').optional()),
    photoMediaId: mediaId.nullable().optional(), // Phase 3e
    expectedVersion: z.number().int().min(0),
  }),
  services: z.strictObject({
    heading: sectionText(3, 60),
    cards: z.array(z.strictObject({ title: sectionText(2, 40), description: optionalSectionText(160), icon: siteIcon })).max(6, 'At most 6 services'),
    expectedVersion: z.number().int().min(0),
  }),
  whyChooseUs: z.strictObject({
    heading: sectionText(3, 60),
    cards: z.array(z.strictObject({ title: sectionText(2, 40), detail: optionalSectionText(160), icon: siteIcon })).max(6, 'At most 6 reasons'),
    expectedVersion: z.number().int().min(0),
  }),
  team: z.strictObject({
    heading: sectionText(3, 60),
    members: z.array(z.strictObject({
      name: sectionText(2, 60),
      role: optionalSectionText(60),
      phone: optionalPhone,
      whatsapp: optionalPhone,
      contactConsent: z.boolean().optional(),
      // Phase 3e §1 Q2: a member photo needs the "agreed to show their photo" tick.
      photoMediaId: mediaId.nullable().optional(),
      photoConsent: z.boolean().optional(),
    }).refine((member) => (!member.phone && !member.whatsapp) || member.contactConsent === true, {
      message: 'Tick that this person agreed to show this number on the website', path: ['contactConsent'],
    }).refine((member) => !member.photoMediaId || member.photoConsent === true, {
      message: 'Tick that this person agreed to show their photo on the website', path: ['photoConsent'],
    })).max(12, 'At most 12 team members'),
    expectedVersion: z.number().int().min(0),
  }),
  // Phase 5a: public Properties section settings (D-032: 3 or 6 cards, newest first).
  properties: z.strictObject({
    heading: sectionText(3, 60),
    displayCount: z.union([z.literal(3), z.literal(6)], 'Choose 3 or 6'),
    expectedVersion: z.number().int().min(0),
  }),
} as const;
export const layoutSchema = z.strictObject({
  order: z.array(z.enum(['about', 'services', 'properties', 'whyChooseUs', 'team'])).length(5)
    .refine((order) => new Set(order).size === 5, 'Each section must appear exactly once'),
  visible: z.strictObject({ about: z.boolean(), services: z.boolean(), whyChooseUs: z.boolean(), team: z.boolean(), properties: z.boolean().default(false) }),
  expectedLayoutVersion: z.number().int().min(0),
});

// Phase 4b §4: Publish updates carries the Live revision it expects and an idempotency key (D-087, D-107).
export const publishSchema = z.strictObject({
  expectedLiveRevision: z.number().int().min(1),
  requestId: z.uuid('requestId must be a UUID'),
});

// Phase 5a contract §2: one property record, saved as a whole form (D-058, D-061, D-103).
const sizeValue = z.number().positive('Must be more than 0').max(1_000_000, 'Must be at most 1,000,000')
  .refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-9, 'Use at most 2 decimals');
const roomCount = z.number().int('Must be a whole number').min(0).max(20, 'Must be at most 20').nullable().optional().transform((value) => value ?? undefined);
const propertyFields = {
  title: sectionText(3, 100),
  intent: z.enum(['SALE', 'RENT'], 'Choose For Sale or For Rent'),
  type: z.enum(['HOUSE', 'APARTMENT', 'PLOT', 'SHOP', 'OFFICE', 'OTHER'], 'Choose a property type'),
  pricePkr: z.number('Enter a price').int('Use a whole number of rupees').min(1, 'Must be at least 1').max(10_000_000_000, 'Must be at most 10,000,000,000'),
  city: sectionText(2, 80),
  area: sectionText(2, 80),
  size: z.strictObject({ value: sizeValue, unit: z.enum(['SQ_FT', 'SQ_YD', 'MARLA', 'KANAL'], 'Choose a unit') }).nullable().optional().transform((value) => value ?? undefined),
  bedrooms: roomCount,
  bathrooms: roomCount,
  description: optionalSectionText(2000),
  // Phase 3d (D-059/D-060): 0–10 photos in display order and an explicit cover (defaults to the first photo).
  photos: z.array(mediaId).max(10, 'At most 10 photos per property').default([])
    .refine((photos) => new Set(photos).size === photos.length, 'Each photo can be added only once'),
  coverMediaId: mediaId.nullable().optional().transform((value) => value ?? undefined),
};
const coverInPhotos = (input: { photos: string[]; coverMediaId?: string }) => !input.coverMediaId || input.photos.includes(input.coverMediaId);
/** Phase 5a §1 Q3: Sold only for Sale listings, Rented only for Rent listings. */
const fitsIntent = (input: { intent: string; availability?: string }) =>
  !(input.availability === 'SOLD' && input.intent !== 'SALE') && !(input.availability === 'RENTED' && input.intent !== 'RENT');
export const createPropertySchema = z.strictObject(propertyFields)
  .refine(coverInPhotos, { message: 'The cover must be one of the photos', path: ['coverMediaId'] });
export const updatePropertySchema = z.strictObject({
  ...propertyFields,
  availability: z.enum(['AVAILABLE', 'SOLD', 'RENTED']),
  expectedVersion: z.number().int().min(0),
}).refine(fitsIntent, { message: 'Sold is only for For Sale listings and Rented only for For Rent listings', path: ['availability'] })
  .refine(coverInPhotos, { message: 'The cover must be one of the photos', path: ['coverMediaId'] });
export const propertyVersionSchema = z.strictObject({ expectedVersion: z.number().int().min(0) });
export const propertyListQuerySchema = z.strictObject({ archived: z.enum(['true', 'false']).default('false') });
