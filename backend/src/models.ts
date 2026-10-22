import mongoose, { Schema } from 'mongoose';

export const REVIEW_STATUSES = ['PENDING', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED'] as const;
export const REVIEW_ACTIONS = ['APPROVE', 'REQUEST_CHANGES', 'REJECT', 'RESUBMIT', 'REOPEN'] as const;
export const RESTRICTION_STATUSES = ['NONE', 'BLOCKED', 'DEACTIVATED'] as const;
export const RESTRICTION_ACTIONS = ['BLOCK', 'DEACTIVATE', 'RESTORE'] as const;
// Phase 4a (D-102, D-119): ACTIVATION_PENDING only after a failed automatic first activation.
export const PUBLICATION_STATUSES = ['NEVER_PUBLISHED', 'ACTIVATION_PENDING', 'LIVE'] as const;

// Phase 4a (D-082, D-090, D-119): stable slug, the single authoritative Live pointer, and private activation errors.
const publicationSchema = new Schema({
  slug: { type: String },
  liveRevisionId: { type: Schema.Types.ObjectId, ref: 'PublishedRevision' },
  firstLiveAt: { type: Date },
  lastActivationError: { type: new Schema({ code: { type: String, required: true }, at: { type: Date, required: true } }, { _id: false }) },
  activationAttempts: { type: Number, default: 0 },
}, { _id: false });

const latestReviewSchema = new Schema({
  action: { type: String, enum: REVIEW_ACTIONS, required: true },
  reason: { type: String },
  decidedAt: { type: Date, required: true },
  actorUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { _id: false });

const latestRestrictionSchema = new Schema({
  action: { type: String, enum: RESTRICTION_ACTIONS, required: true },
  reason: { type: String, required: true },
  decidedAt: { type: Date, required: true },
  actorUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { _id: false });

// Phase 3a: optional Agency Profile details; empty values are stored as absent.
const agencyProfileSchema = new Schema({
  description: { type: String },
  officeAddress: { type: String },
  city: { type: String },
  serviceAreas: { type: String },
  publicEmail: { type: String },
}, { _id: false });

// D-099: nothing is public until the owner chooses it.
const publicContactSchema = new Schema({
  showMobile: { type: Boolean, required: true, default: false },
  showWhatsapp: { type: Boolean, required: true, default: false },
}, { _id: false });

// D-102: review, restriction and publication are separate axes; readiness is computed later (Phase 3).
const agencySchema = new Schema({
  name: { type: String, required: true },
  mobileE164: { type: String, required: true },
  whatsappE164: { type: String, required: true },
  reviewStatus: { type: String, enum: REVIEW_STATUSES, default: 'PENDING', required: true },
  reviewVersion: { type: Number, required: true, default: 0 },
  submittedForReviewAt: { type: Date, required: true, default: Date.now },
  latestReview: { type: latestReviewSchema, default: undefined },
  restrictionStatus: { type: String, enum: RESTRICTION_STATUSES, required: true, default: 'NONE' },
  restrictionVersion: { type: Number, required: true, default: 0 },
  latestRestriction: { type: latestRestrictionSchema, default: undefined },
  publicationStatus: { type: String, enum: PUBLICATION_STATUSES, required: true, default: 'NEVER_PUBLISHED' },
  publication: { type: publicationSchema, default: undefined },
  publicContact: { type: publicContactSchema, required: true, default: () => ({}) },
  profile: { type: agencyProfileSchema, default: undefined },
  profileVersion: { type: Number, required: true, default: 0 },
  profileUpdatedAt: { type: Date },
}, { timestamps: true });
agencySchema.index({ reviewStatus: 1, submittedForReviewAt: 1, _id: 1 });
// Phase 2b directory: newest first, optionally filtered by one axis.
agencySchema.index({ createdAt: -1, _id: -1 });
agencySchema.index({ reviewStatus: 1, createdAt: -1 });
agencySchema.index({ restrictionStatus: 1, createdAt: -1 });
agencySchema.index({ 'publication.slug': 1 }, { unique: true, partialFilterExpression: { 'publication.slug': { $type: 'string' } } });
// Reconciler scan (Phase 4a §3): approved, unrestricted, not yet Live.
agencySchema.index({ reviewStatus: 1, restrictionStatus: 1, publicationStatus: 1 });

const userSchema = new Schema({
  role: { type: String, enum: ['AGENCY_OWNER', 'SUPER_ADMIN'], required: true },
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency' },
  name: { type: String, required: true },
  emailNormalized: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true, select: false },
  credentialVersion: { type: Number, required: true, default: 0 },
  accountState: { type: String, enum: ['ACTIVE'], required: true, default: 'ACTIVE' },
  resetTokenDigest: { type: String, select: false },
  resetExpiresAt: { type: Date, select: false },
  bootstrapKey: { type: String, unique: true, sparse: true },
}, { timestamps: true });
userSchema.index({ agencyId: 1, role: 1 });

const sessionSchema = new Schema({
  tokenDigest: { type: String, required: true, unique: true, select: false },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  portal: { type: String, enum: ['OWNER', 'SUPER_ADMIN'], required: true },
  credentialVersion: { type: Number, required: true },
  csrfSecret: { type: String, required: true, select: false },
  lastSeenAt: { type: Date, required: true },
  idleExpiresAt: { type: Date, required: true },
  absoluteExpiresAt: { type: Date, required: true },
  revokedAt: { type: Date },
}, { timestamps: true });
sessionSchema.index({ userId: 1, portal: 1 });
sessionSchema.index({ absoluteExpiresAt: 1 }, { expireAfterSeconds: 0 });

const rateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, required: true, default: 0 },
  expiresAt: { type: Date, required: true },
});
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const auditSchema = new Schema({
  action: { type: String, required: true },
  actor: { type: String, required: true },
  targetUserId: { type: Schema.Types.ObjectId, ref: 'User' },
  method: { type: String },
  secondApprover: { type: String },
  createdAt: { type: Date, required: true, default: Date.now },
}, { versionKey: false });

// D-092: append-only review and restriction audit. Writes happen in the same transaction as the status change.
const agencyAuditSchema = new Schema({
  at: { type: Date, required: true, default: Date.now, immutable: true },
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true, immutable: true },
  // SYSTEM entries (automatic first Live, Phase 4a) have no acting user.
  actorUserId: { type: Schema.Types.ObjectId, ref: 'User', immutable: true, required(this: { actorRole?: string }) { return this.actorRole !== 'SYSTEM'; } },
  actorRole: { type: String, enum: ['SUPER_ADMIN', 'AGENCY_OWNER', 'SYSTEM'], required: true, immutable: true },
  axis: { type: String, enum: ['REVIEW', 'RESTRICTION', 'PUBLICATION'], required: true, default: 'REVIEW', immutable: true },
  action: {
    type: String, required: true, immutable: true,
    enum: ['REVIEW_APPROVE', 'REVIEW_REQUEST_CHANGES', 'REVIEW_REJECT', 'REVIEW_REOPEN', 'OWNER_RESUBMIT', 'RESTRICT_BLOCK', 'RESTRICT_DEACTIVATE', 'RESTRICT_RESTORE', 'WEBSITE_FIRST_LIVE', 'WEBSITE_PUBLISH_UPDATES'],
  },
  fromStatus: { type: String, enum: [...REVIEW_STATUSES, ...RESTRICTION_STATUSES, ...PUBLICATION_STATUSES], required: true, immutable: true },
  toStatus: { type: String, enum: [...REVIEW_STATUSES, ...RESTRICTION_STATUSES, ...PUBLICATION_STATUSES], required: true, immutable: true },
  reason: { type: String, immutable: true },
  requestId: { type: String, immutable: true },
}, { versionKey: false });
agencyAuditSchema.index({ agencyId: 1, at: -1 });
for (const operation of ['updateOne', 'updateMany', 'findOneAndUpdate', 'replaceOne', 'findOneAndReplace', 'deleteOne', 'deleteMany', 'findOneAndDelete'] as const) {
  agencyAuditSchema.pre(operation, () => { throw new Error('AUDIT_APPEND_ONLY'); });
}

// Phase 3b: one private website draft per agency (D-050/D-052). Never public; always scoped by agencyId (D-089).
export const THEME_PRESETS = ['MODERN_LIGHT', 'WARM_EDITORIAL', 'CONTEMPORARY_DARK'] as const;
export const WEBSITE_SECTIONS = ['header', 'hero', 'contact', 'about', 'services', 'whyChooseUs', 'team', 'properties'] as const;
// Phase 3c: D-032 optional sections, their default order (Properties is Phase 5) and the fixed icon list.
export const OPTIONAL_ORDER = ['about', 'services', 'properties', 'whyChooseUs', 'team'] as const;
export const SITE_ICONS = ['home', 'key', 'building', 'handshake', 'document', 'map-pin', 'search', 'chart', 'shield', 'star', 'phone', 'people'] as const;
const draftHeaderSchema = new Schema({
  contactButtonLabel: { type: String, required: true, default: 'Contact us' },
  preferredContact: { type: String, enum: ['WHATSAPP', 'PHONE'] },
  logoMediaId: { type: String },
  version: { type: Number, required: true, default: 0 },
}, { _id: false });
const draftHeroSchema = new Schema({
  heading: { type: String, default: '' },
  subtitle: { type: String },
  ctaLabel: { type: String, required: true, default: 'Contact us' },
  // Phase 3d: a licensed platform default (assetId) or the agency's own upload (mediaId).
  heroImage: { type: new Schema({ kind: { type: String, enum: ['PLATFORM_DEFAULT', 'UPLOAD'], required: true }, assetId: { type: String }, mediaId: { type: String } }, { _id: false }) },
  version: { type: Number, required: true, default: 0 },
}, { _id: false });
const draftContactSchema = new Schema({
  heading: { type: String, required: true, default: 'Get in touch' },
  message: { type: String },
  version: { type: Number, required: true, default: 0 },
}, { _id: false });
const draftServiceCardSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String, enum: SITE_ICONS, required: true },
}, { _id: false });
const draftReasonCardSchema = new Schema({
  title: { type: String, required: true },
  detail: { type: String },
  icon: { type: String, enum: SITE_ICONS, required: true },
}, { _id: false });
const draftAboutSchema = new Schema({
  heading: { type: String, required: true, default: 'About us' },
  story: { type: String },
  photoMediaId: { type: String }, // Phase 3e: ABOUT media
  version: { type: Number, required: true, default: 0 },
}, { _id: false });
const draftServicesSchema = new Schema({
  heading: { type: String, required: true, default: 'Our services' },
  cards: { type: [draftServiceCardSchema], default: [] },
  version: { type: Number, required: true, default: 0 },
}, { _id: false });
const draftWhyChooseUsSchema = new Schema({
  heading: { type: String, required: true, default: 'Why choose us' },
  cards: { type: [draftReasonCardSchema], default: [] },
  version: { type: Number, required: true, default: 0 },
}, { _id: false });
const draftTeamSchema = new Schema({
  heading: { type: String, required: true, default: 'Our team' },
  members: {
    type: [new Schema({
      name: { type: String, required: true }, role: { type: String }, phone: { type: String }, whatsapp: { type: String },
      contactConsent: { type: Boolean },
      photoMediaId: { type: String }, photoConsent: { type: Boolean }, // Phase 3e: TEAM media + consent
    }, { _id: false })],
    default: [],
  },
  version: { type: Number, required: true, default: 0 },
}, { _id: false });
// Phase 5a (D-032): public Properties section settings; the listings themselves are Property records.
const draftPropertiesSchema = new Schema({
  heading: { type: String, required: true, default: 'Our properties' },
  displayCount: { type: Number, enum: [3, 6], required: true, default: 6 },
  version: { type: Number, required: true, default: 0 },
}, { _id: false });
const draftLayoutSchema = new Schema({
  order: { type: [{ type: String, enum: OPTIONAL_ORDER }], default: () => [...OPTIONAL_ORDER] },
  visible: {
    type: new Schema({
      about: { type: Boolean, default: false }, services: { type: Boolean, default: false },
      whyChooseUs: { type: Boolean, default: false }, team: { type: Boolean, default: false },
      // Phase 5a: the reserved Properties slot can now be shown (only with an eligible property).
      properties: { type: Boolean, default: false },
    }, { _id: false }),
    default: () => ({}),
  },
  version: { type: Number, required: true, default: 0 },
}, { _id: false });

// D-085: Profile values copied into the draft on every successful Profile save; numbers only when chosen as public (D-099).
const draftMappedSchema = new Schema({
  agencyName: { type: String, required: true },
  phone: { type: String },
  whatsapp: { type: String },
  publicEmail: { type: String },
  officeAddress: { type: String },
  city: { type: String },
  mappedAt: { type: Date, required: true, default: Date.now },
}, { _id: false });
const websiteDraftSchema = new Schema({
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true, unique: true, immutable: true },
  theme: {
    type: new Schema({ preset: { type: String, enum: THEME_PRESETS }, version: { type: Number, required: true, default: 0 } }, { _id: false }),
    default: () => ({}),
  },
  sections: {
    type: new Schema({
      header: { type: draftHeaderSchema, default: () => ({}) },
      hero: { type: draftHeroSchema, default: () => ({}) },
      contact: { type: draftContactSchema, default: () => ({}) },
      about: { type: draftAboutSchema, default: () => ({}) },
      services: { type: draftServicesSchema, default: () => ({}) },
      whyChooseUs: { type: draftWhyChooseUsSchema, default: () => ({}) },
      team: { type: draftTeamSchema, default: () => ({}) },
      properties: { type: draftPropertiesSchema, default: () => ({}) },
    }, { _id: false }),
    default: () => ({}),
  },
  layout: { type: draftLayoutSchema, default: () => ({}) },
  mapped: { type: draftMappedSchema, required: true },
}, { timestamps: true });

// D-090: immutable published website material. Append-only: nothing updates or deletes a revision.
const publishedRevisionSchema = new Schema({
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true, immutable: true },
  revision: { type: Number, required: true, immutable: true },
  slug: { type: String, required: true, immutable: true },
  site: { type: Schema.Types.Mixed, required: true, immutable: true },
  reason: { type: String, enum: ['FIRST_ACTIVATION', 'PUBLISH_UPDATES'], required: true, immutable: true },
  // Phase 3d: every media id this revision shows; the public media route serves only these (D-090).
  mediaIds: { type: [String], default: [], immutable: true },
  // Phase 4b (D-087, D-107): the owner's idempotency key and the content fingerprint used for "Unpublished changes".
  requestId: { type: String, immutable: true },
  contentHash: { type: String, immutable: true },
  createdAt: { type: Date, required: true, default: Date.now, immutable: true },
}, { versionKey: false, minimize: false });
publishedRevisionSchema.index({ agencyId: 1, revision: 1 }, { unique: true });
publishedRevisionSchema.index({ _id: 1, mediaIds: 1 });
publishedRevisionSchema.index({ agencyId: 1, requestId: 1 }, { unique: true, partialFilterExpression: { requestId: { $type: 'string' } } });
for (const operation of ['updateOne', 'updateMany', 'findOneAndUpdate', 'replaceOne', 'findOneAndReplace', 'deleteOne', 'deleteMany', 'findOneAndDelete'] as const) {
  publishedRevisionSchema.pre(operation, () => { throw new Error('REVISION_APPEND_ONLY'); });
}

// Phase 5a (D-058, D-062, D-103, D-104): agency property records. Never deleted; Archive is reversible.
export const PROPERTY_INTENTS = ['SALE', 'RENT'] as const;
export const PROPERTY_TYPES = ['HOUSE', 'APARTMENT', 'PLOT', 'SHOP', 'OFFICE', 'OTHER'] as const;
export const PROPERTY_AVAILABILITY = ['AVAILABLE', 'SOLD', 'RENTED'] as const;
export const SIZE_UNITS = ['SQ_FT', 'SQ_YD', 'MARLA', 'KANAL'] as const;
const propertySchema = new Schema({
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true, immutable: true },
  title: { type: String, required: true },
  intent: { type: String, enum: PROPERTY_INTENTS, required: true },
  type: { type: String, enum: PROPERTY_TYPES, required: true },
  pricePkr: { type: Number, required: true },
  city: { type: String, required: true },
  area: { type: String, required: true },
  size: { type: new Schema({ value: { type: Number, required: true }, unit: { type: String, enum: SIZE_UNITS, required: true } }, { _id: false }) },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  description: { type: String },
  availability: { type: String, enum: PROPERTY_AVAILABILITY, required: true, default: 'AVAILABLE' },
  // Phase 3d (D-059/D-060): up to 10 photo media ids in display order and an explicit cover.
  photos: { type: [String], default: [] },
  coverMediaId: { type: String },
  archivedAt: { type: Date },
  version: { type: Number, required: true, default: 0 },
}, { timestamps: true });
propertySchema.index({ agencyId: 1, archivedAt: 1, createdAt: -1, _id: -1 });

// Phase 3d (D-086, D-105, D-106): uploaded images. Originals are private; only WebP variants are ever served.
const mediaSchema = new Schema({
  mediaId: { type: String, required: true, unique: true, immutable: true },
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true, immutable: true },
  purpose: { type: String, enum: ['HERO', 'LOGO', 'PROPERTY', 'ABOUT', 'TEAM'], required: true, immutable: true },
  status: { type: String, enum: ['STAGED', 'ATTACHED'], required: true, default: 'STAGED' },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  bytes: { type: Number, required: true },
  contentType: { type: String, required: true },
  originalKey: { type: String, required: true },
  variants: { type: [new Schema({ width: { type: Number, required: true }, key: { type: String, required: true }, bytes: { type: Number, required: true } }, { _id: false })], default: [] },
  attachedAt: { type: Date },
}, { timestamps: true });
mediaSchema.index({ status: 1, createdAt: 1 });
mediaSchema.index({ agencyId: 1, purpose: 1 });

export const Agency = mongoose.model('Agency', agencySchema);
export const Media = mongoose.model('Media', mediaSchema);
export const Property = mongoose.model('Property', propertySchema);
export const PublishedRevision = mongoose.model('PublishedRevision', publishedRevisionSchema);
export const WebsiteDraft = mongoose.model('WebsiteDraft', websiteDraftSchema);
export const AgencyAudit = mongoose.model('AgencyAudit', agencyAuditSchema);
export const User = mongoose.model('User', userSchema);
export const AuthSession = mongoose.model('AuthSession', sessionSchema);
export const AuthRateLimit = mongoose.model('AuthRateLimit', rateLimitSchema);
export const AuthAudit = mongoose.model('AuthAudit', auditSchema);
