import { Router } from 'express';
import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';
import { asyncRoute, currentSession, HttpError, rejectAgencyInput, requireCsrf, requireOwnerWritable, requirePortal, type AuthRequest } from './auth.js';
import { Agency, AgencyAudit, REVIEW_STATUSES, User, WebsiteDraft } from './models.js';
import { profileDetails, publicContactView } from './profile-routes.js';
import { adminPublicationView, afterReadinessChange, livePublicationDetails, publicUrl } from './publication.js';
import { applyRestrictionTransition, restrictionView } from './restriction.js';
import { getReadinessIssues, licensedHeroDefaults, virtualDraft } from './website.js';
import { applyReviewTransition, ownerReviewView, reviewView } from './review.js';
import { ownerScope, superAdminScope } from './tenant.js';
import { directoryQuerySchema, reopenSchema, restrictionSchema, resubmitSchema, reviewDecisionSchema, reviewQueueQuerySchema } from './validation.js';

// Phase 2a review lifecycle and Phase 2b directory/restrictions
// (docs/PHASE-2A-REVIEW-CONTRACT-APPROVED.md, docs/PHASE-2B-DIRECTORY-RESTRICTIONS-CONTRACT-APPROVED.md).
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
function encodeCursor(t: Date | null | undefined, id: mongoose.Types.ObjectId): string {
  return Buffer.from(JSON.stringify({ t: t?.toISOString(), id: String(id) })).toString('base64url');
}
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
    nextCursor: found.length > limit && last ? encodeCursor(last.submittedForReviewAt, last._id) : null,
    counts,
  } });
}));

router.get('/super-admin/agencies', asyncRoute(async (request, response) => {
  await requireSuperAdmin(request, false);
  const { q, review, restriction, limit, cursor } = directoryQuerySchema.parse(request.query);
  const conditions: Record<string, unknown>[] = [];
  if (review) conditions.push({ reviewStatus: review });
  if (restriction) conditions.push(restriction === 'NONE' ? { restrictionStatus: { $in: ['NONE', null] } } : { restrictionStatus: restriction });
  if (q) {
    // User input is escaped, so it always matches literally (never as a regular expression).
    const pattern = new RegExp(escapeRegex(q), 'i');
    const owners = await User.find({ role: 'AGENCY_OWNER', emailNormalized: pattern }).select('agencyId').limit(500).lean();
    conditions.push({ $or: [{ name: pattern }, { _id: { $in: owners.map((owner) => owner.agencyId) } }] });
  }
  if (cursor) {
    const after = decodeCursor(cursor);
    conditions.push({ $or: [{ createdAt: { $lt: after.t } }, { createdAt: after.t, _id: { $lt: after.id } }] });
  }
  const found = await Agency.find(conditions.length ? { $and: conditions } : {}).sort({ createdAt: -1, _id: -1 }).limit(limit + 1).lean();
  const page = found.slice(0, limit);
  const owners = await User.find({ role: 'AGENCY_OWNER', agencyId: { $in: page.map((agency) => agency._id) } }).select('agencyId name emailNormalized accountState').lean();
  const ownerByAgency = new Map(owners.map((owner) => [String(owner.agencyId), owner]));
  const drafts = await WebsiteDraft.find({ agencyId: { $in: page.map((agency) => agency._id) } }).lean();
  const draftByAgency = new Map(drafts.map((draft) => [String(draft.agencyId), draft]));
  const licensedIds = new Set(licensedHeroDefaults().map((entry) => entry.id));
  const last = page.at(-1);
  response.json({ data: {
    items: page.map((agency) => {
      const owner = ownerByAgency.get(String(agency._id));
      return {
        id: String(agency._id), agencyName: agency.name, ownerName: owner?.name ?? null, ownerEmail: owner?.emailNormalized ?? null,
        origin: agency.origin ?? 'SELF_SIGNUP', ownerAccountState: owner?.accountState ?? 'ACTIVE',
        createdAt: agency.createdAt, reviewStatus: agency.reviewStatus, restrictionStatus: agency.restrictionStatus ?? 'NONE',
        websiteReadiness: getReadinessIssues(draftByAgency.get(String(agency._id)) ?? virtualDraft(agency), licensedIds).length ? 'NOT_READY' : 'READY',
        publicationStatus: agency.publicationStatus ?? 'NEVER_PUBLISHED',
        ...(agency.publicationStatus === 'LIVE' && agency.publication?.slug ? { publicUrl: publicUrl(agency.publication.slug) } : {}),
      };
    }),
    nextCursor: found.length > limit && last ? encodeCursor(last.createdAt, last._id) : null,
  } });
}));

router.get('/super-admin/agencies/:agencyId', asyncRoute(async (request, response) => {
  await requireSuperAdmin(request, false);
  const agencyId = agencyIdParam(request.params.agencyId);
  const agency = await Agency.findById(agencyId).lean();
  if (!agency) throw new HttpError(404, 'NOT_FOUND', 'Agency not found');
  const owner = await User.findOne({ role: 'AGENCY_OWNER', agencyId: agency._id }).select('name emailNormalized accountState +inviteExpiresAt').lean();
  const history = await AgencyAudit.find({ agencyId: agency._id }).sort({ at: -1, _id: -1 }).limit(50).lean();
  const draft = await WebsiteDraft.findOne({ agencyId: agency._id }).lean();
  const readinessIssues = getReadinessIssues(draft ?? virtualDraft(agency));
  response.json({ data: {
    id: String(agency._id),
    agencyName: agency.name,
    owner: {
      name: owner?.name ?? null, email: owner?.emailNormalized ?? null, mobile: agency.mobileE164, whatsapp: agency.whatsappE164,
      // Phase 6a: the invitation URL itself is never returned again.
      accountState: owner?.accountState ?? 'ACTIVE', ...(owner?.accountState === 'INVITED' ? { invitationExpiresAt: owner.inviteExpiresAt ?? null } : {}),
    },
    origin: agency.origin ?? 'SELF_SIGNUP',
    createdAt: agency.createdAt,
    profile: profileDetails(agency),
    publicContact: publicContactView(agency),
    review: { ...reviewView(agency), submittedForReviewAt: agency.submittedForReviewAt },
    restrictionStatus: agency.restrictionStatus ?? 'NONE',
    restriction: restrictionView(agency),
    websiteReadiness: readinessIssues.length ? 'NOT_READY' : 'READY',
    readinessIssues,
    publicationStatus: agency.publicationStatus ?? 'NEVER_PUBLISHED',
    publication: { ...adminPublicationView(agency), ...await livePublicationDetails(agency, draft) },
    history: history.map((entry) => ({
      at: entry.at, axis: entry.axis ?? 'REVIEW', action: entry.action, actorRole: entry.actorRole, fromStatus: entry.fromStatus, toStatus: entry.toStatus,
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
  // Phase 4a §1 Q4: Approve may complete the first-Live conditions (D-077).
  if (input.decision === 'APPROVE') await afterReadinessChange(agencyId);
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

router.post('/super-admin/agencies/:agencyId/restrictions', asyncRoute(async (request, response) => {
  const scope = await requireSuperAdmin(request, true);
  const agencyId = agencyIdParam(request.params.agencyId);
  const input = restrictionSchema.parse(request.body);
  const agency = await applyRestrictionTransition({
    agencyId, action: input.action, actorUserId: scope.userId,
    expectedRestrictionVersion: input.expectedRestrictionVersion, reason: input.reason, requestId: randomUUID(),
  });
  // D-083: Restore re-checks eligibility; it never simply shows the site again.
  if (input.action === 'RESTORE') await afterReadinessChange(agencyId);
  response.json({ data: { restriction: restrictionView(agency) } });
}));

router.post('/owner/review-resubmissions', asyncRoute(async (request, response) => {
  requirePortal(request, 'OWNER');
  await requireCsrf(request, true);
  requireOwnerWritable(request);
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
