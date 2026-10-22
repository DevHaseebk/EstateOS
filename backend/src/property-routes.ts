import { Router } from 'express';
import type { Types } from 'mongoose';
import { asyncRoute, currentSession, HttpError, rejectAgencyInput, requireCsrf, requireOwnerWritable, requirePortal, type AuthRequest } from './auth.js';
import { Agency, Property } from './models.js';
import { attachMedia } from './media.js';
import { MAX_ACTIVE_PROPERTIES, ownerPropertyView } from './properties.js';
import { ownerCanEdit, ReviewError } from './review.js';
import { ownerScope, superAdminScope, tenantAgencyFilter } from './tenant.js';
import { createPropertySchema, propertyListQuerySchema, propertyVersionSchema, updatePropertySchema } from './validation.js';

// Phase 5a properties (docs/PHASE-5A-PROPERTIES-CONTRACT-APPROVED.md). Every query is scoped by the session's agencyId (D-089).
const router = Router();
const OBJECT_ID = /^[a-f0-9]{24}$/i;
const notFound = () => new HttpError(404, 'NOT_FOUND', 'Property not found');
const conflict = () => new ReviewError(409, 'PROPERTY_CONFLICT', 'This property was changed in another window. Reload to see the latest version.');
const OPTIONAL_FIELDS = ['size', 'bedrooms', 'bathrooms', 'description', 'coverMediaId'] as const;

/** Phase 3d §1 Q5 (D-106): only a successful property save attaches its staged photos; foreign or wrong-purpose ids → 422. */
async function attachPhotos(agencyId: string, photos: string[]) {
  const bad = await attachMedia(agencyId, 'PROPERTY', photos);
  if (bad.length) throw new ReviewError(422, 'VALIDATION_ERROR', 'Some photos could not be found. Upload them again.');
}

function propertyId(value: unknown): string {
  const id = String(value);
  if (!OBJECT_ID.test(id)) throw notFound();
  return id;
}

async function ownerRead(request: AuthRequest) {
  requirePortal(request, 'OWNER');
  rejectAgencyInput(request);
  const context = await currentSession(request);
  return ownerScope(context!.user);
}

/** Mutations: CSRF, Deactivated → 403, no agencyId input, and the shared edit rule (Rejected → read-only). */
async function ownerWrite(request: AuthRequest) {
  requirePortal(request, 'OWNER');
  await requireCsrf(request, true);
  requireOwnerWritable(request);
  rejectAgencyInput(request);
  const scope = ownerScope(request.sessionContext!.user);
  const agency = await Agency.findOne(tenantAgencyFilter(scope)).select('reviewStatus restrictionStatus').lean();
  if (!agency) throw new HttpError(404, 'NOT_FOUND', 'Agency not found');
  if (!ownerCanEdit(agency)) throw new ReviewError(403, 'PROPERTIES_READ_ONLY', 'Your properties can no longer be changed. Contact EstateOS support.');
  return scope;
}

async function assertBelowLimit(agencyId: string | Types.ObjectId) {
  if (await Property.countDocuments({ agencyId, archivedAt: { $exists: false } }) >= MAX_ACTIVE_PROPERTIES) {
    throw new ReviewError(422, 'PROPERTY_LIMIT', `You can have at most ${MAX_ACTIVE_PROPERTIES} active properties. Archive one first.`);
  }
}

/** After a guarded update matched nothing: tell apart "not yours / missing", "wrong state" and "stale version". */
async function explainMiss(id: string, agencyId: string, expectedVersion: number, wrongState?: (property: { archivedAt?: Date | null }) => boolean): Promise<never> {
  const property = await Property.findOne({ _id: id, agencyId }).select('version archivedAt').lean();
  if (!property) throw notFound();
  if ((property.version ?? 0) !== expectedVersion) throw conflict();
  if (wrongState?.(property)) throw new ReviewError(409, 'INVALID_TRANSITION', 'This action is not allowed for the property\'s current state');
  throw conflict();
}

router.get('/owner/properties', asyncRoute(async (request, response) => {
  const scope = await ownerRead(request);
  const { archived } = propertyListQuerySchema.parse(request.query);
  const filter = { agencyId: scope.agencyId, archivedAt: { $exists: archived === 'true' } };
  const [items, active, archivedCount] = await Promise.all([
    Property.find(filter).sort({ createdAt: -1, _id: -1 }).lean(),
    Property.countDocuments({ agencyId: scope.agencyId, archivedAt: { $exists: false } }),
    Property.countDocuments({ agencyId: scope.agencyId, archivedAt: { $exists: true } }),
  ]);
  response.json({ data: { items: items.map(ownerPropertyView), counts: { active, archived: archivedCount } } });
}));

router.get('/owner/properties/:propertyId', asyncRoute(async (request, response) => {
  const scope = await ownerRead(request);
  const property = await Property.findOne({ _id: propertyId(request.params.propertyId), agencyId: scope.agencyId }).lean();
  if (!property) throw notFound();
  response.json({ data: { property: ownerPropertyView(property) } });
}));

router.post('/owner/properties', asyncRoute(async (request, response) => {
  const scope = await ownerWrite(request);
  const input = createPropertySchema.parse(request.body);
  await assertBelowLimit(scope.agencyId);
  await attachPhotos(scope.agencyId, input.photos);
  const property = await Property.create({ ...input, agencyId: scope.agencyId, availability: 'AVAILABLE' });
  response.status(201).json({ data: { property: ownerPropertyView(property.toObject()) } });
}));

router.put('/owner/properties/:propertyId', asyncRoute(async (request, response) => {
  const scope = await ownerWrite(request);
  const id = propertyId(request.params.propertyId);
  const { expectedVersion, ...input } = updatePropertySchema.parse(request.body);
  await attachPhotos(scope.agencyId, input.photos);
  const unset = Object.fromEntries(OPTIONAL_FIELDS.filter((field) => input[field] === undefined).map((field) => [field, '']));
  const set = Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));
  const result = await Property.updateOne(
    { _id: id, agencyId: scope.agencyId, version: expectedVersion },
    { $set: set, ...(Object.keys(unset).length ? { $unset: unset } : {}), $inc: { version: 1 } },
  );
  if (result.modifiedCount !== 1) await explainMiss(id, scope.agencyId, expectedVersion);
  const property = await Property.findOne({ _id: id, agencyId: scope.agencyId }).lean();
  response.json({ data: { property: ownerPropertyView(property!) } });
}));

router.post('/owner/properties/:propertyId/archive', asyncRoute(async (request, response) => {
  const scope = await ownerWrite(request);
  const id = propertyId(request.params.propertyId);
  const { expectedVersion } = propertyVersionSchema.parse(request.body);
  const result = await Property.updateOne(
    { _id: id, agencyId: scope.agencyId, version: expectedVersion, archivedAt: { $exists: false } },
    { $set: { archivedAt: new Date() }, $inc: { version: 1 } },
  );
  if (result.modifiedCount !== 1) await explainMiss(id, scope.agencyId, expectedVersion, (property) => Boolean(property.archivedAt));
  const property = await Property.findOne({ _id: id, agencyId: scope.agencyId }).lean();
  response.json({ data: { property: ownerPropertyView(property!) } });
}));

router.post('/owner/properties/:propertyId/restore', asyncRoute(async (request, response) => {
  const scope = await ownerWrite(request);
  const id = propertyId(request.params.propertyId);
  const { expectedVersion } = propertyVersionSchema.parse(request.body);
  await assertBelowLimit(scope.agencyId);
  const result = await Property.updateOne(
    { _id: id, agencyId: scope.agencyId, version: expectedVersion, archivedAt: { $exists: true } },
    { $unset: { archivedAt: '' }, $inc: { version: 1 } },
  );
  if (result.modifiedCount !== 1) await explainMiss(id, scope.agencyId, expectedVersion, (property) => !property.archivedAt);
  const property = await Property.findOne({ _id: id, agencyId: scope.agencyId }).lean();
  response.json({ data: { property: ownerPropertyView(property!) } });
}));

// Super Admin read-only list for the review page (Phase 5a §3).
router.get('/super-admin/agencies/:agencyId/properties', asyncRoute(async (request, response) => {
  requirePortal(request, 'SUPER_ADMIN');
  const context = await currentSession(request);
  superAdminScope(context!.user);
  const agencyId = String(request.params.agencyId);
  if (!OBJECT_ID.test(agencyId) || !await Agency.exists({ _id: agencyId })) throw new HttpError(404, 'NOT_FOUND', 'Agency not found');
  const items = await Property.find({ agencyId }).sort({ createdAt: -1, _id: -1 }).lean();
  response.json({ data: { items: items.map(ownerPropertyView) } });
}));

export { router as propertyRouter };
