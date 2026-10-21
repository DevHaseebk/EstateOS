import mongoose, { type Types } from 'mongoose';
import { Agency, AgencyAudit, REVIEW_ACTIONS, REVIEW_STATUSES } from './models.js';

export type ReviewStatus = typeof REVIEW_STATUSES[number];
export type ReviewAction = typeof REVIEW_ACTIONS[number];
type ActorRole = 'SUPER_ADMIN' | 'AGENCY_OWNER';

/** Phase 2a contract §2: the only allowed review-axis transitions. */
export const REVIEW_TRANSITIONS: Readonly<Record<ReviewAction, { from: ReviewStatus; to: ReviewStatus; actor: ActorRole; reason: boolean }>> = {
  APPROVE: { from: 'PENDING', to: 'APPROVED', actor: 'SUPER_ADMIN', reason: false },
  REQUEST_CHANGES: { from: 'PENDING', to: 'CHANGES_REQUESTED', actor: 'SUPER_ADMIN', reason: true },
  REJECT: { from: 'PENDING', to: 'REJECTED', actor: 'SUPER_ADMIN', reason: true },
  RESUBMIT: { from: 'CHANGES_REQUESTED', to: 'PENDING', actor: 'AGENCY_OWNER', reason: false },
  REOPEN: { from: 'REJECTED', to: 'PENDING', actor: 'SUPER_ADMIN', reason: true },
};

const AUDIT_ACTIONS = {
  APPROVE: 'REVIEW_APPROVE',
  REQUEST_CHANGES: 'REVIEW_REQUEST_CHANGES',
  REJECT: 'REVIEW_REJECT',
  RESUBMIT: 'OWNER_RESUBMIT',
  REOPEN: 'REVIEW_REOPEN',
} as const satisfies Record<ReviewAction, string>;

export function nextReviewStatus(action: ReviewAction, from: string): ReviewStatus | null {
  const rule = REVIEW_TRANSITIONS[action];
  return rule.from === from ? rule.to : null;
}

type AgencyReviewFields = {
  reviewStatus: string;
  reviewVersion?: number | null;
  restrictionStatus?: string | null;
  submittedForReviewAt?: Date | null;
  latestReview?: { action: string; reason?: string | null; decidedAt: Date; actorUserId?: Types.ObjectId } | null;
};

/**
 * Owner may edit agency data while Pending, Changes Requested or Approved and unrestricted
 * (Phase 2a owner answer 4, amended by Phase 3a §3). Rejected stays view-only.
 */
export function ownerCanEdit(agency: AgencyReviewFields): boolean {
  return ['PENDING', 'CHANGES_REQUESTED', 'APPROVED'].includes(agency.reviewStatus) && (agency.restrictionStatus ?? 'NONE') === 'NONE';
}

function latestReviewView(agency: AgencyReviewFields) {
  const latest = agency.latestReview;
  return latest ? { action: latest.action, ...(latest.reason ? { reason: latest.reason } : {}), decidedAt: latest.decidedAt } : null;
}

export function reviewView(agency: AgencyReviewFields) {
  return { status: agency.reviewStatus, version: agency.reviewVersion ?? 0, latestReview: latestReviewView(agency) };
}

export function ownerReviewView(agency: AgencyReviewFields) {
  return {
    review: reviewView(agency),
    canResubmit: agency.reviewStatus === 'CHANGES_REQUESTED' && (agency.restrictionStatus ?? 'NONE') === 'NONE',
    canEdit: ownerCanEdit(agency),
  };
}

export class ReviewError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

type TransitionInput = {
  agencyId: string;
  action: ReviewAction;
  actorUserId: string;
  actorRole: ActorRole;
  expectedReviewVersion: number;
  reason?: string;
  requestId: string;
};

/**
 * Applies one review transition atomically: guarded status/version update plus its audit entry
 * in one transaction (D-092). Throws ReviewError for 404 / 409 cases; nothing is saved on any failure.
 */
export async function applyReviewTransition(input: TransitionInput): Promise<AgencyReviewFields> {
  const rule = REVIEW_TRANSITIONS[input.action];
  if (rule.actor !== input.actorRole) throw new ReviewError(403, 'FORBIDDEN', 'Action not allowed for this role');
  await mongoose.connection.transaction(async (session) => {
    const agency = await Agency.findById(input.agencyId).session(session);
    if (!agency) throw new ReviewError(404, 'NOT_FOUND', 'Agency not found');
    // Phase 2b §3: review decisions and Resubmit are frozen while Blocked or Deactivated.
    if ((agency.restrictionStatus ?? 'NONE') !== 'NONE') {
      throw new ReviewError(409, 'AGENCY_RESTRICTED', 'Restore this agency before making review decisions');
    }
    if ((agency.reviewVersion ?? 0) !== input.expectedReviewVersion) {
      throw new ReviewError(409, 'REVIEW_CONFLICT', 'This agency was updated by someone else. Reload and try again.');
    }
    if (agency.reviewStatus !== rule.from) {
      throw new ReviewError(409, 'INVALID_TRANSITION', 'This action is not allowed for the agency\'s current status');
    }
    const now = new Date();
    const latestReview = { action: input.action, ...(input.reason ? { reason: input.reason } : {}), decidedAt: now, actorUserId: input.actorUserId };
    const result = await Agency.updateOne(
      { _id: agency._id, reviewStatus: rule.from, reviewVersion: input.expectedReviewVersion, restrictionStatus: 'NONE' },
      { $set: { reviewStatus: rule.to, latestReview, ...(rule.to === 'PENDING' ? { submittedForReviewAt: now } : {}) }, $inc: { reviewVersion: 1 } },
      { session },
    );
    if (result.modifiedCount !== 1) throw new ReviewError(409, 'REVIEW_CONFLICT', 'This agency was updated by someone else. Reload and try again.');
    await AgencyAudit.create([{
      at: now, agencyId: agency._id, actorUserId: input.actorUserId, actorRole: input.actorRole, axis: 'REVIEW',
      action: AUDIT_ACTIONS[input.action], fromStatus: rule.from, toStatus: rule.to,
      ...(input.reason ? { reason: input.reason } : {}), requestId: input.requestId,
    }], { session });
  });
  const updated = await Agency.findById(input.agencyId).lean();
  if (!updated) throw new ReviewError(404, 'NOT_FOUND', 'Agency not found');
  return updated;
}
