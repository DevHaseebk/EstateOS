import { Router } from 'express';
import { ZodError } from 'zod';
import { asyncRoute, currentSession, HttpError, rejectAgencyInput, requireCsrf, requireOwnerWritable, requirePortal, type AuthRequest } from './auth.js';
import { Agency, WebsiteDraft } from './models.js';
import { ownerCanEdit, ReviewError } from './review.js';
import { ownerScope, superAdminScope, tenantAgencyFilter } from './tenant.js';
import { sectionSchemas, themeSchema } from './validation.js';
import { ensureDraft, licensedHeroDefaults, readinessView, sectionView, virtualDraft, websiteView } from './website.js';

// Phase 3b My Website foundation (docs/PHASE-3B-WEBSITE-FOUNDATION-CONTRACT-APPROVED.md). Drafts are private (D-101).
const router = Router();
const OBJECT_ID = /^[a-f0-9]{24}$/i;
type Section = keyof typeof sectionSchemas;

/** One field-level 422 in the same shape the error handler produces for zod errors. */
function fieldError(path: string, message: string): never {
  throw new ZodError([{ code: 'custom', path: [path], message, input: undefined }]);
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
  response.json({ data: websiteView(agency, await ensureDraft(agency)) });
}));

router.put('/owner/website/theme', asyncRoute(async (request, response) => {
  const agency = await writableOwnerAgency(request);
  const input = themeSchema.parse(request.body);
  await ensureDraft(agency);
  const result = await WebsiteDraft.updateOne(
    { agencyId: agency._id, 'theme.version': input.expectedThemeVersion },
    { $set: { 'theme.preset': input.preset }, $inc: { 'theme.version': 1 } },
  );
  if (result.modifiedCount !== 1) throw new ReviewError(409, 'THEME_CONFLICT', 'The theme was changed in another window. Reload to see the latest version.');
  const draft = await WebsiteDraft.findOne({ agencyId: agency._id }).lean();
  response.json({ data: { theme: { preset: draft!.theme?.preset ?? null, version: draft!.theme?.version ?? 0 }, readiness: readinessView(draft!) } });
}));

router.put('/owner/website/sections/:section', asyncRoute(async (request, response) => {
  const section = String(request.params.section);
  if (!Object.hasOwn(sectionSchemas, section)) throw new HttpError(404, 'NOT_FOUND', 'Not found');
  const agency = await writableOwnerAgency(request);
  const draft = await ensureDraft(agency);
  const key = section as Section;
  const input = sectionSchemas[key].parse(request.body);
  const set: Record<string, unknown> = {};
  const unset: Record<string, ''> = {};
  const path = `sections.${key}`;
  if ('contactButtonLabel' in input) {
    const preferred = input.preferredContact ?? null;
    if (preferred === 'PHONE' && !draft.mapped?.phone) fieldError('preferredContact', 'Choose your mobile number as public first (Agency profile).');
    if (preferred === 'WHATSAPP' && !draft.mapped?.whatsapp) fieldError('preferredContact', 'Choose your WhatsApp number as public first (Agency profile).');
    set[`${path}.contactButtonLabel`] = input.contactButtonLabel;
    if (preferred) set[`${path}.preferredContact`] = preferred; else unset[`${path}.preferredContact`] = '';
  } else if ('ctaLabel' in input) {
    const imageId = input.heroImageId ?? null;
    if (imageId && !licensedHeroDefaults().some((entry) => entry.id === imageId)) fieldError('heroImageId', 'Choose one of the listed photos.');
    set[`${path}.heading`] = input.heading;
    set[`${path}.ctaLabel`] = input.ctaLabel;
    if (input.subtitle) set[`${path}.subtitle`] = input.subtitle; else unset[`${path}.subtitle`] = '';
    if (imageId) set[`${path}.heroImage`] = { kind: 'PLATFORM_DEFAULT', assetId: imageId }; else unset[`${path}.heroImage`] = '';
  } else {
    set[`${path}.heading`] = input.heading;
    if (input.message) set[`${path}.message`] = input.message; else unset[`${path}.message`] = '';
  }
  const result = await WebsiteDraft.updateOne(
    { agencyId: agency._id, [`${path}.version`]: input.expectedVersion },
    { $set: set, ...(Object.keys(unset).length ? { $unset: unset } : {}), $inc: { [`${path}.version`]: 1 } },
  );
  if (result.modifiedCount !== 1) throw new ReviewError(409, 'SECTION_CONFLICT', 'This section was changed in another window. Reload to see the latest version.');
  const updated = await WebsiteDraft.findOne({ agencyId: agency._id }).lean();
  response.json({ data: { section: sectionView(updated!, key), readiness: readinessView(updated!) } });
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
  response.json({ data: websiteView(agency, draft, false) });
}));

export { router as websiteRouter };
