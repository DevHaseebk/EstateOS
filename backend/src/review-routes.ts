import { Router } from 'express';
import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';
import { asyncRoute, currentSession, HttpError, rejectAgencyInput, requireCsrf, requirePortal, type AuthRequest } from './auth.js';
import { Agency, AgencyAudit, REVIEW_STATUSES, User } from './models.js';
import { applyReviewTransition, ownerReviewView, reviewView } from './review.js';
import { ownerScope, superAdminScope } from './tenant.js';
import { reopenSchema, resubmitSchema, reviewDecisionSchema, reviewQueueQuerySchema } from './validation.js';

// Phase 2a Super Admin review lifecycle (docs/PHASE-2A-REVIEW-CONTRACT-APPROVED.md).
const router = Router();
const OBJECT_ID = /^[a-f0-9]{24}$/i;

function agencyIdParam(value: unknown): string {
  const id = String(value);
  if (!OBJECT_ID.test(id)) throw new HttpError(404, 'NOT_FOUND', 'Agency not found');
  return id;
}

async function requireSuperAdmin(request: AuthRequest, mutation: boolean) {
  requirePortal(request, 'SUPER_ADMIN');
  if (mutation) await requireCsrf(request, true);
  const context = mutation ? request.sessionContext : await currentSession(request);
  return superAdminScope(context!.user);
}

type QueueCursor = { t: Date; id: mongoose.Types.ObjectId };
function encodeCursor(agency: { submittedForReviewAt?: Date | null; _id: mongoose.Types.ObjectId }): string {
  return Buffer.from(JSON.stringify({ t: agency.submittedForReviewAt?.toISOString(), id: String(agency._id) })).toString('base64url');
}
function decodeCursor(cursor: string): QueueCursor {
  try {
    const parsed = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8')) as { t?: string; id?: string };
    const t = new Date(parsed.t ?? '');
    if (Number.isNaN(t.getTime()) || !OBJECT_ID.test(parsed.id ?? '')) throw new Error('bad cursor');
    return { t, id: new mongoose.Types.ObjectId(parsed.id) };
  } catch {
    throw new HttpError(422, 'VALIDATION_ERROR', 'Invalid cursor');
  }
}

router.get('/super-admin/review-queue', asyncRoute(async (request, response) => {
  await requireSuperAdmin(request, false);
  const { limit, cursor } = reviewQueueQuerySchema.parse(request.query);
  const filter: Record<string, unknown> = { reviewStatus: 'PENDING' };
  if (cursor) {
    const after = decodeCursor(cursor);
    filter.$or = [{ submittedForReviewAt: { $gt: after.t } }, { submittedForReviewAt: after.t, _id: { $gt: after.id } }];
  }
  const found = await Agency.find(filter).sort({ submittedForReviewAt: 1, _id: 1 }).limit(limit + 1).lean();
  const page = found.slice(0, limit);
  const owners = await User.find({ role: 'AGENCY_OWNER', agencyId: { $in: page.map((agency) => agency._id) } }).select('agencyId name').lean();
  const ownerNames = new Map(owners.map((owner) => [String(owner.agencyId), owner.name]));
  const grouped = await Agency.aggregate<{ _id: string; count: number }>([{ $group: { _id: '$reviewStatus', count: { $sum: 1 } } }]);
  const counts = Object.fromEntries(REVIEW_STATUSES.map((status) => [status, grouped.find((group) => group._id === status)?.count ?? 0]));
  const last = page.at(-1);
  response.json({ data: {
    items: page.map((agency) => ({
      id: String(agency._id), agencyName: agency.name, ownerName: ownerNames.get(String(agency._id)) ?? null,
      submittedForReviewAt: agency.submittedForReviewAt, reviewStatus: agency.reviewStatus,
    })),
    nextCursor: found.length > limit && last ? encodeCursor(last) : null,
    counts,
  } });
}));

router.get('/super-admin/agencies/:agencyId', asyncRoute(async (request, response) => {
  await requireSuperAdmin(request, false);
  const agencyId = agencyIdParam(request.params.agencyId);
  const agency = await Agency.findById(agencyId).lean();
  if (!agency) throw new HttpError(404, 'NOT_FOUND', 'Agency not found');
  const owner = await User.findOne({ role: 'AGENCY_OWNER', agencyId: agency._id }).select('name emailNormalized').lean();
  const history = await AgencyAudit.find({ agencyId: agency._id }).sort({ at: -1 }).limit(50).lean();
  response.json({ data: {
    id: String(agency._id),
    agencyName: agency.name,
    owner: { name: owner?.name ?? null, email: owner?.emailNormalized ?? null, mobile: agency.mobileE164, whatsapp: agency.whatsappE164 },
    createdAt: agency.createdAt,
    review: { ...reviewView(agency), submittedForReviewAt: agency.submittedForReviewAt },
    restrictionStatus: agency.restrictionStatus ?? 'NONE',
    websiteReadiness: 'NOT_READY',
    publicationStatus: agency.publicationStatus ?? 'NEVER_PUBLISHED',
    history: history.map((entry) => ({
      at: entry.at, action: entry.action, actorRole: entry.actorRole, fromStatus: entry.fromStatus, toStatus: entry.toStatus,
      ...(entry.reason ? { reason: entry.reason } : {}),
    })),
  } });
}));

router.post('/super-admin/agencies/:agencyId/review-decisions', asyncRoute(async (request, response) => {
  const scope = await requireSuperAdmin(request, true);
  const agencyId = agencyIdParam(request.params.agencyId);
  const input = reviewDecisionSchema.parse(request.body);
  const agency = await applyReviewTransition({
    agencyId, action: input.decision, actorUserId: scope.userId, actorRole: 'SUPER_ADMIN',
    expectedReviewVersion: input.expectedReviewVersion, reason: 'reason' in input ? input.reason : undefined, requestId: randomUUID(),
  });
  response.json({ data: { review: reviewView(agency) } });
}));

router.post('/super-admin/agencies/:agencyId/reopen', asyncRoute(async (request, response) => {
  const scope = await requireSuperAdmin(request, true);
  const agencyId = agencyIdParam(request.params.agencyId);
  const input = reopenSchema.parse(request.body);
  const agency = await applyReviewTransition({
    agencyId, action: 'REOPEN', actorUserId: scope.userId, actorRole: 'SUPER_ADMIN',
    expectedReviewVersion: input.expectedReviewVersion, reason: input.reason, requestId: randomUUID(),
  });
  response.json({ data: { review: reviewView(agency) } });
}));

router.post('/owner/review-resubmissions', asyncRoute(async (request, response) => {
  requirePortal(request, 'OWNER');
  await requireCsrf(request, true);
  rejectAgencyInput(request);
  const input = resubmitSchema.parse(request.body);
  const scope = ownerScope(request.sessionContext!.user);
  const agency = await applyReviewTransition({
    agencyId: scope.agencyId, action: 'RESUBMIT', actorUserId: scope.userId, actorRole: 'AGENCY_OWNER',
    expectedReviewVersion: input.expectedReviewVersion, requestId: randomUUID(),
  });
  response.json({ data: ownerReviewView(agency) });
}));

export { router as reviewRouter };
