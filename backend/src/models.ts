import mongoose, { Schema } from 'mongoose';

const agencySchema = new Schema({
  name: { type: String, required: true },
  mobileE164: { type: String, required: true },
  whatsappE164: { type: String, required: true },
  reviewStatus: { type: String, enum: ['PENDING'], default: 'PENDING', required: true },
}, { timestamps: true });
agencySchema.index({ reviewStatus: 1, createdAt: 1 });

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

export const Agency = mongoose.model('Agency', agencySchema);
export const User = mongoose.model('User', userSchema);
export const AuthSession = mongoose.model('AuthSession', sessionSchema);
export const AuthRateLimit = mongoose.model('AuthRateLimit', rateLimitSchema);
export const AuthAudit = mongoose.model('AuthAudit', auditSchema);
