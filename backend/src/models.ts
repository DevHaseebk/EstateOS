import mongoose, { Schema } from 'mongoose';

export const REVIEW_STATUSES = ['PENDING', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED'] as const;
export const REVIEW_ACTIONS = ['APPROVE', 'REQUEST_CHANGES', 'REJECT', 'RESUBMIT', 'REOPEN'] as const;

const latestReviewSchema = new Schema({
  action: { type: String, enum: REVIEW_ACTIONS, required: true },
  reason: { type: String },
  decidedAt: { type: Date, required: true },
  actorUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
  restrictionStatus: { type: String, enum: ['NONE'], required: true, default: 'NONE' },
  publicationStatus: { type: String, enum: ['NEVER_PUBLISHED'], required: true, default: 'NEVER_PUBLISHED' },
}, { timestamps: true });
agencySchema.index({ reviewStatus: 1, submittedForReviewAt: 1, _id: 1 });

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

// D-092: append-only review audit. Writes happen in the same transaction as the status change.
const agencyAuditSchema = new Schema({
  at: { type: Date, required: true, default: Date.now, immutable: true },
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true, immutable: true },
  actorUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, immutable: true },
  actorRole: { type: String, enum: ['SUPER_ADMIN', 'AGENCY_OWNER'], required: true, immutable: true },
  action: { type: String, enum: ['REVIEW_APPROVE', 'REVIEW_REQUEST_CHANGES', 'REVIEW_REJECT', 'REVIEW_REOPEN', 'OWNER_RESUBMIT'], required: true, immutable: true },
  fromStatus: { type: String, enum: REVIEW_STATUSES, required: true, immutable: true },
  toStatus: { type: String, enum: REVIEW_STATUSES, required: true, immutable: true },
  reason: { type: String, immutable: true },
  requestId: { type: String, immutable: true },
}, { versionKey: false });
agencyAuditSchema.index({ agencyId: 1, at: -1 });
for (const operation of ['updateOne', 'updateMany', 'findOneAndUpdate', 'replaceOne', 'findOneAndReplace', 'deleteOne', 'deleteMany', 'findOneAndDelete'] as const) {
  agencyAuditSchema.pre(operation, () => { throw new Error('AUDIT_APPEND_ONLY'); });
}

export const Agency = mongoose.model('Agency', agencySchema);
export const AgencyAudit = mongoose.model('AgencyAudit', agencyAuditSchema);
export const User = mongoose.model('User', userSchema);
export const AuthSession = mongoose.model('AuthSession', sessionSchema);
export const AuthRateLimit = mongoose.model('AuthRateLimit', rateLimitSchema);
export const AuthAudit = mongoose.model('AuthAudit', auditSchema);
