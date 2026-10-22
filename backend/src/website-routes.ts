import { Router } from 'express';
import { ZodError } from 'zod';
import { asyncRoute, currentSession, HttpError, rejectAgencyInput, requireCsrf, requireOwnerWritable, requirePortal, type AuthRequest } from './auth.js';
import { Agency, Property, WebsiteDraft } from './models.js';
import { ELIGIBLE_FILTER, eligibleProperties } from './properties.js';
import { attachMedia } from './media.js';
import { ownerCanEdit, ReviewError } from './review.js';
import { afterReadinessChange, livePublicationDetails, ownerPublicationView, publishUpdates } from './publication.js';
import { ownerScope, superAdminScope, tenantAgencyFilter } from './tenant.js';
import { layoutSchema, publishSchema, sectionSchemas, themeSchema } from './validation.js';
import {
  ensureDraft, hasMinimumContent, layoutView, licensedHeroDefaults, OPTIONAL_KEYS, readinessView, sectionView, virtualDraft, websiteView,
  type DraftFields, type OptionalKey,
} from './website.js';

// Phase 3b My Website foundation and Phase 3c optional sections (docs/PHASE-3B-…, docs/PHASE-3C-…-APPROVED.md). Drafts are private (D-101).
const router = Router();
const OBJECT_ID = /^[a-f0-9]{24}$/i;
type Section = keyof typeof sectionSchemas;

/** One field-level 422 in the same shape the error handler produces for zod errors. */
function fieldError(path: string, message: string): never {
  throw new ZodError([{ code: 'custom', path: [path], message, input: undefined }]);
}

const OPTIONAL_LABELS: Record<OptionalKey, string> = { about: 'About', services: 'Services', whyChooseUs: 'Why Choose Us', team: 'Team' };
const isOptional = (key: Section): key is OptionalKey => (OPTIONAL_KEYS as readonly string[]).includes(key);
const defined = <T extends object>(value: T) => Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T;

/** Version filter that also matches drafts created before a section existed (a missing version means 0). */
function versionFilter(path: string, expected: number) {
  return expected === 0 ? { $or: [{ [path]: 0 }, { [path]: { $exists: false } }] } : { [path]: expected };
}

/** The saved content of one section as it will be after this update (for the minimum-content rule). */
function contentOf(set: Record<string, unknown>, path: string) {
  return Object.fromEntries(Object.entries(set).filter(([field]) => field.startsWith(`${path}.`)).map(([field, value]) => [field.slice(path.length + 1), value]));
}

/** Validates one section body and builds its $set / $unset. Optional text left empty is removed, never stored as "". */
async function sectionUpdate(key: Section, body: unknown, draft: DraftFields, path: string, agencyId: string) {
  const set: Record<string, unknown> = {};
  const unset: Record<string, ''> = {};
  const put = (field: string, value: unknown) => { if (value === undefined || value === null) unset[`${path}.${field}`] = ''; else set[`${path}.${field}`] = value; };
  if (key === 'header') {
    const input = sectionSchemas.header.parse(body);
    const preferred = input.preferredContact ?? null;
    if (preferred === 'PHONE' && !draft.mapped?.phone) fieldError('preferredContact', 'Choose your mobile number as public first (Agency profile).');
    if (preferred === 'WHATSAPP' && !draft.mapped?.whatsapp) fieldError('preferredContact', 'Choose your WhatsApp number as public first (Agency profile).');
    put('contactButtonLabel', input.contactButtonLabel);
    put('preferredContact', preferred);
    // Phase 3d §1 Q5: the save attaches the staged logo; any id that is not this agency's LOGO media is refused.
    if (input.logoMediaId && (await attachMedia(agencyId, 'LOGO', [input.logoMediaId])).length) fieldError('logoMediaId', 'Upload the logo again.');
    put('logoMediaId', input.logoMediaId ?? null);
  } else if (key === 'hero') {
    const input = sectionSchemas.hero.parse(body);
    const imageId = input.heroImageId ?? null;
    if (imageId && !licensedHeroDefaults().some((entry) => entry.id === imageId)) fieldError('heroImageId', 'Choose one of the listed photos.');
    const uploadId = input.heroUploadId ?? null;
    if (uploadId && (await attachMedia(agencyId, 'HERO', [uploadId])).length) fieldError('heroUploadId', 'Upload the photo again.');
    put('heading', input.heading);
    put('ctaLabel', input.ctaLabel);
    put('subtitle', input.subtitle);
    put('heroImage', uploadId ? { kind: 'UPLOAD', mediaId: uploadId } : imageId ? { kind: 'PLATFORM_DEFAULT', assetId: imageId } : null);
  } else if (key === 'contact') {
    const input = sectionSchemas.contact.parse(body);
    put('heading', input.heading);
    put('message', input.message);
  } else if (key === 'about') {
    const input = sectionSchemas.about.parse(body);
    put('heading', input.heading);
    put('story', input.story);
  } else if (key === 'services') {
    const input = sectionSchemas.services.parse(body);
    put('heading', input.heading);
    put('cards', input.cards.map(defined));
  } else if (key === 'whyChooseUs') {
    const input = sectionSchemas.whyChooseUs.parse(body);
    put('heading', input.heading);
    put('cards', input.cards.map(defined));
  } else if (key === 'properties') {
    const input = sectionSchemas.properties.parse(body);
    put('heading', input.heading);
    put('displayCount', input.displayCount);
  } else {
    const input = sectionSchemas.team.parse(body);
    put('heading', input.heading);
    put('members', input.members.map((member) => defined({ ...member, contactConsent: member.phone || member.whatsapp ? true : undefined })));
  }
  return { set, unset };
}

/** Owner website mutation guard: CSRF, Deactivated (403), no agencyId input, and the shared edit rule (Rejected → read-only). */
async function writableOwnerAgency(request: AuthRequest) {
  requirePortal(request, 'OWNER');
  await requireCsrf(request, true);
  requireOwnerWritable(request);
  rejectAgencyInput(request);
  const agency = await Agency.findOne(tenantAgencyFilter(ownerScope(request.sessionContext!.user))).lean();
  if (!agency) throw new HttpError(404, 'NOT_FOUND', 'Agency not found');
  if (!ownerCanEdit(agency)) {
    if ((agency.restrictionStatus ?? 'NONE') === 'DEACTIVATED') throw new HttpError(403, 'AGENCY_DEACTIVATED', 'Your agency account is deactivated. Contact EstateOS support.');
    throw new ReviewError(403, 'WEBSITE_READ_ONLY', 'Your website can no longer be changed. Contact EstateOS support.');
  }
  return agency;
}

router.get('/owner/website', asyncRoute(async (request, response) => {
  requirePortal(request, 'OWNER');
  rejectAgencyInput(request);
  const context = await currentSession(request);
  const agency = await Agency.findOne(tenantAgencyFilter(ownerScope(context!.user))).lean();
  if (!agency) throw new HttpError(404, 'NOT_FOUND', 'Agency not found');
  const draft = await ensureDraft(agency);
  response.json({ data: { ...websiteView(agency, draft), properties: await eligibleProperties(agency._id), publication: { ...ownerPublicationView(agency), ...await livePublicationDetails(agency, draft) } } });
}));

// Phase 4b: deliberate owner Publish updates for an already-Live website (D-053). Never a first-Live gate (D-029).
router.post('/owner/website/publish', asyncRoute(async (request, response) => {
  requirePortal(request, 'OWNER');
  await requireCsrf(request, true);
  requireOwnerWritable(request);
  rejectAgencyInput(request);
  const input = publishSchema.parse(request.body);
  const scope = ownerScope(request.sessionContext!.user);
  const result = await publishUpdates({ agencyId: scope.agencyId, ownerUserId: scope.userId, ...input });
  if (result.kind === 'NOT_READY') {
    response.status(422).json({ error: {
      code: 'NOT_READY', message: 'Your website is missing essentials, so it cannot be published. Your live website is unchanged.',
      details: Object.fromEntries(result.issues.map((issue) => [issue.key, issue.message])),
    } });
    return;
  }
  const agency = await Agency.findOne(tenantAgencyFilter(scope)).lean();
  const draft = await WebsiteDraft.findOne({ agencyId: scope.agencyId }).lean();
  response.json({ data: { publication: { ...ownerPublicationView(agency!), ...await livePublicationDetails(agency!, draft) } } });
}));

router.put('/owner/website/theme', asyncRoute(async (request, response) => {
  const agency = await writableOwnerAgency(request);
  const input = themeSchema.parse(request.body);
  await ensureDraft(agency);
  const result = await WebsiteDraft.updateOne(
    { agencyId: agency._id, ...versionFilter('theme.version', input.expectedThemeVersion) },
    { $set: { 'theme.preset': input.preset }, $inc: { 'theme.version': 1 } },
  );
  if (result.modifiedCount !== 1) throw new ReviewError(409, 'THEME_CONFLICT', 'The theme was changed in another window. Reload to see the latest version.');
  const draft = await WebsiteDraft.findOne({ agencyId: agency._id }).lean();
  await afterReadinessChange(agency._id);
  response.json({ data: { theme: { preset: draft!.theme?.preset ?? null, version: draft!.theme?.version ?? 0 }, readiness: readinessView(draft!) } });
}));

router.put('/owner/website/sections/:section', asyncRoute(async (request, response) => {
  const section = String(request.params.section);
  if (!Object.hasOwn(sectionSchemas, section)) throw new HttpError(404, 'NOT_FOUND', 'Not found');
  const agency = await writableOwnerAgency(request);
  const draft = await ensureDraft(agency);
  const key = section as Section;
  const path = `sections.${key}`;
  const { set, unset } = await sectionUpdate(key, request.body, draft, path, String(agency._id));
  // Phase 3c §3: a shown optional section may not be emptied; the visibility check is part of the same atomic write.
  const conditions: Record<string, unknown>[] = [{ agencyId: agency._id }, versionFilter(`${path}.version`, Number(request.body?.expectedVersion))];
  if (isOptional(key) && !hasMinimumContent({ sections: { [key]: contentOf(set, path) } }, key)) {
    if (layoutView(draft).visible[key]) fieldError('section', `This section is shown on your website. Hide it in Layout before removing all of its content.`);
    conditions.push({ [`layout.visible.${key}`]: { $ne: true } });
  }
  const result = await WebsiteDraft.updateOne(
    { $and: conditions },
    { $set: set, ...(Object.keys(unset).length ? { $unset: unset } : {}), $inc: { [`${path}.version`]: 1 } },
  );
  if (result.modifiedCount !== 1) throw new ReviewError(409, 'SECTION_CONFLICT', 'This section was changed in another window. Reload to see the latest version.');
  const updated = await WebsiteDraft.findOne({ agencyId: agency._id }).lean();
  await afterReadinessChange(agency._id);
  response.json({ data: { section: sectionView(updated!, key), readiness: readinessView(updated!) } });
}));

router.put('/owner/website/layout', asyncRoute(async (request, response) => {
  const agency = await writableOwnerAgency(request);
  const input = layoutSchema.parse(request.body);
  const draft = await ensureDraft(agency);
  const conditions: Record<string, unknown>[] = [{ agencyId: agency._id }, versionFilter('layout.version', input.expectedLayoutVersion)];
  // Phase 5a: the Properties slot can be shown only with at least one eligible (Available, not archived) property.
  if (input.visible.properties && !await Property.exists({ agencyId: agency._id, ...ELIGIBLE_FILTER })) {
    fieldError('visible.properties', 'Add an available property before showing the Properties section.');
  }
  for (const key of OPTIONAL_KEYS) {
    if (!input.visible[key]) continue;
    if (!hasMinimumContent(draft, key)) fieldError(`visible.${key}`, `Add content to ${OPTIONAL_LABELS[key]} before showing it.`);
    // Same atomic write: the content must still be there when the layout is saved.
    conditions.push(key === 'about' ? { 'sections.about.story': { $exists: true, $nin: ['', null] } }
      : { [`sections.${key}.${key === 'team' ? 'members' : 'cards'}.0`]: { $exists: true } });
  }
  const result = await WebsiteDraft.updateOne(
    { $and: conditions },
    { $set: { 'layout.order': input.order, 'layout.visible': input.visible }, $inc: { 'layout.version': 1 } },
  );
  if (result.modifiedCount !== 1) throw new ReviewError(409, 'LAYOUT_CONFLICT', 'The layout or a section was changed in another window. Reload to see the latest version.');
  const updated = await WebsiteDraft.findOne({ agencyId: agency._id }).lean();
  await afterReadinessChange(agency._id);
  response.json({ data: { layout: layoutView(updated!) } });
}));

router.get('/super-admin/agencies/:agencyId/website', asyncRoute(async (request, response) => {
  requirePortal(request, 'SUPER_ADMIN');
  const context = await currentSession(request);
  superAdminScope(context!.user);
  const agencyId = String(request.params.agencyId);
  if (!OBJECT_ID.test(agencyId)) throw new HttpError(404, 'NOT_FOUND', 'Agency not found');
  const agency = await Agency.findById(agencyId).lean();
  if (!agency) throw new HttpError(404, 'NOT_FOUND', 'Agency not found');
  // Read-only: never creates a draft for the agency.
  const draft = await WebsiteDraft.findOne({ agencyId: agency._id }).lean() ?? virtualDraft(agency);
  response.json({ data: { ...websiteView(agency, draft, false), properties: await eligibleProperties(agency._id) } });
}));

export { router as websiteRouter };
