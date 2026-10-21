import mongoose, { type Types } from 'mongoose';
import { Agency, AgencyAudit, AuthSession, RESTRICTION_ACTIONS, RESTRICTION_STATUSES, User } from './models.js';
import { ReviewError } from './review.js';

export type RestrictionStatus = typeof RESTRICTION_STATUSES[number];
export type RestrictionAction = typeof RESTRICTION_ACTIONS[number];

/** Phase 2b contract §3: one restriction at a time; switching needs Restore first. Reason always required. */
export const RESTRICTION_TRANSITIONS: Readonly<Record<RestrictionAction, { from: readonly RestrictionStatus[]; to: RestrictionStatus }>> = {
  BLOCK: { from: ['NONE'], to: 'BLOCKED' },
  DEACTIVATE: { from: ['NONE'], to: 'DEACTIVATED' },
  RESTORE: { from: ['BLOCKED', 'DEACTIVATED'], to: 'NONE' },
};

const AUDIT_ACTIONS = {
  BLOCK: 'RESTRICT_BLOCK',
  DEACTIVATE: 'RESTRICT_DEACTIVATE',
  RESTORE: 'RESTRICT_RESTORE',
} as const satisfies Record<RestrictionAction, string>;

export function nextRestrictionStatus(action: RestrictionAction, from: string): RestrictionStatus | null {
  const rule = RESTRICTION_TRANSITIONS[action];
  return (rule.from as readonly string[]).includes(from) ? rule.to : null;
}

type AgencyRestrictionFields = {
  restrictionStatus?: string | null;
  restrictionVersion?: number | null;
  latestRestriction?: { action: string; reason: string; decidedAt: Date; actorUserId?: Types.ObjectId } | null;
};

export function restrictionView(agency: AgencyRestrictionFields) {
  const latest = agency.latestRestriction;
  return {
    status: agency.restrictionStatus ?? 'NONE',
    version: agency.restrictionVersion ?? 0,
    latestRestriction: latest ? { action: latest.action, reason: latest.reason, decidedAt: latest.decidedAt } : null,
  };
}

/** Owners see the reason only while Deactivated; a Blocked owner cannot sign in at all (owner answer 5). */
export function ownerRestrictionView(agency: AgencyRestrictionFields) {
  const status = agency.restrictionStatus ?? 'NONE';
  const reason = status === 'DEACTIVATED' ? agency.latestRestriction?.reason : undefined;
  return { status, ...(reason ? { reason } : {}) };
}

type RestrictionInput = {
  agencyId: string;
  action: RestrictionAction;
  actorUserId: string;
  expectedRestrictionVersion: number;
  reason: string;
  requestId: string;
};

/**
 * Applies one restriction transition atomically: guarded status/version update, owner session
 * revocation on Block, and the audit entry, all in one transaction (D-092). Nothing is saved on failure.
 */
export async function applyRestrictionTransition(input: RestrictionInput): Promise<AgencyRestrictionFields> {
  const rule = RESTRICTION_TRANSITIONS[input.action];
  await mongoose.connection.transaction(async (session) => {
    const agency = await Agency.findById(input.agencyId).session(session);
    if (!agency) throw new ReviewError(404, 'NOT_FOUND', 'Agency not found');
    const from = agency.restrictionStatus ?? 'NONE';
    if ((agency.restrictionVersion ?? 0) !== input.expectedRestrictionVersion) {
      throw new ReviewError(409, 'RESTRICTION_CONFLICT', 'This agency was updated by someone else. Reload and try again.');
    }
    if (!nextRestrictionStatus(input.action, from)) {
      throw new ReviewError(409, 'INVALID_TRANSITION', 'This action is not allowed for the agency\'s current account status');
    }
    const now = new Date();
    const latestRestriction = { action: input.action, reason: input.reason, decidedAt: now, actorUserId: input.actorUserId };
    const result = await Agency.updateOne(
      { _id: agency._id, restrictionStatus: from, restrictionVersion: input.expectedRestrictionVersion },
      { $set: { restrictionStatus: rule.to, latestRestriction }, $inc: { restrictionVersion: 1 } },
      { session },
    );
    if (result.modifiedCount !== 1) throw new ReviewError(409, 'RESTRICTION_CONFLICT', 'This agency was updated by someone else. Reload and try again.');
    if (rule.to === 'BLOCKED') {
      const owners = await User.find({ role: 'AGENCY_OWNER', agencyId: agency._id }).select('_id').session(session).lean();
      await AuthSession.updateMany(
        { userId: { $in: owners.map((owner) => owner._id) }, revokedAt: { $exists: false } },
        { $set: { revokedAt: now } },
        { session },
      );
    }
    await AgencyAudit.create([{
      at: now, agencyId: agency._id, actorUserId: input.actorUserId, actorRole: 'SUPER_ADMIN', axis: 'RESTRICTION',
      action: AUDIT_ACTIONS[input.action], fromStatus: from, toStatus: rule.to, reason: input.reason, requestId: input.requestId,
    }], { session });
  });
  const updated = await Agency.findById(input.agencyId).lean();
  if (!updated) throw new ReviewError(404, 'NOT_FOUND', 'Agency not found');
  return updated;
}
