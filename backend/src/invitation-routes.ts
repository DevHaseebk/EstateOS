import { Router } from 'express';
import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';
import { ZodError } from 'zod';
import { env } from './config/env.js';
import { asyncRoute, clientIp, countAttempt, HttpError, problem, rejectAgencyInput, requireCsrf, requirePortal, type AuthRequest } from './auth.js';
import { Agency, AgencyAudit, User } from './models.js';
import { digest, hashPassword, randomToken, validatePassword } from './security.js';
import { superAdminScope } from './tenant.js';
import { adminAgencySchema, invitationClaimSchema, invitationPreviewSchema } from './validation.js';

// Phase 6a (docs/PHASE-6A-ADMIN-CREATED-AGENCY-INVITATION-CONTRACT-APPROVED.md): D-028 Super Admin agency creation
// with a D-118 one-time owner invitation. Only the code's digest is stored; the link is returned once and never logged.
const router = Router();
const OBJECT_ID = /^[a-f0-9]{24}$/i;
export const INVITATION_TTL_MS = 72 * 60 * 60_000;

/** A fresh single-use code; the code travels in the URL fragment so it never reaches server logs or Referer headers. */
function newInvitation() {
  const code = randomToken();
  const expiresAt = new Date(Date.now() + INVITATION_TTL_MS);
  return { code, tokenDigest: digest(code), expiresAt, url: `${env.ownerOrigin}/invite#${code}` };
}

async function requireSuperAdminMutation(request: AuthRequest) {
  requirePortal(request, 'SUPER_ADMIN');
  await requireCsrf(request, true);
  const scope = superAdminScope(request.sessionContext!.user);
  if (await countAttempt('admin-invitations', scope.userId, 60 * 60_000) > 30) problem(429, 'RATE_LIMITED', 'Too many requests');
  return scope;
}

router.post('/super-admin/agencies', asyncRoute(async (request, response) => {
  const scope = await requireSuperAdminMutation(request);
  const input = adminAgencySchema.parse(request.body);
  const invitation = newInvitation();
  let agencyId = '';
  try {
    await mongoose.connection.transaction(async (session) => {
      const now = new Date();
      const [agency] = await Agency.create([{ name: input.agencyName, mobileE164: input.mobile, whatsappE164: input.whatsapp, reviewStatus: 'PENDING', origin: 'ADMIN_CREATED' }], { session });
      await User.create([{
        role: 'AGENCY_OWNER', agencyId: agency!._id, name: input.ownerName, emailNormalized: input.email, accountState: 'INVITED',
        inviteTokenDigest: invitation.tokenDigest, inviteExpiresAt: invitation.expiresAt,
      }], { session });
      const requestId = randomUUID();
      await AgencyAudit.create([
        { at: now, agencyId: agency!._id, actorUserId: scope.userId, actorRole: 'SUPER_ADMIN', axis: 'ACCOUNT', action: 'AGENCY_CREATED_BY_ADMIN', toStatus: 'INVITED', requestId },
        { at: now, agencyId: agency!._id, actorUserId: scope.userId, actorRole: 'SUPER_ADMIN', axis: 'ACCOUNT', action: 'INVITATION_ISSUED', fromStatus: 'INVITED', toStatus: 'INVITED', requestId },
      ], { session, ordered: true });
      agencyId = agency!.id;
    });
  } catch (error) {
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) problem(409, 'EMAIL_EXISTS', 'Email is already registered');
    throw error;
  }
  response.status(201).json({ data: { agency: { id: agencyId, reviewStatus: 'PENDING', origin: 'ADMIN_CREATED' }, invitation: { url: invitation.url, expiresAt: invitation.expiresAt } } });
}));

router.post('/super-admin/agencies/:agencyId/invitations', asyncRoute(async (request, response) => {
  const scope = await requireSuperAdminMutation(request);
  const agencyId = String(request.params.agencyId);
  if (!OBJECT_ID.test(agencyId)) throw new HttpError(404, 'NOT_FOUND', 'Agency not found');
  const agency = await Agency.findById(agencyId).select('restrictionStatus').lean();
  if (!agency) throw new HttpError(404, 'NOT_FOUND', 'Agency not found');
  if (agency.restrictionStatus === 'DEACTIVATED') problem(409, 'AGENCY_DEACTIVATED', 'Restore the agency before sending a new invitation.');
  const invitation = newInvitation();
  let issued = false;
  await mongoose.connection.transaction(async (session) => {
    // Replacing the digest cancels the previous link (§1 Q4).
    const result = await User.updateOne({ role: 'AGENCY_OWNER', agencyId: agency._id, accountState: 'INVITED' },
      { $set: { inviteTokenDigest: invitation.tokenDigest, inviteExpiresAt: invitation.expiresAt } }, { session });
    if (result.modifiedCount !== 1) return;
    await AgencyAudit.create([{ agencyId: agency._id, actorUserId: scope.userId, actorRole: 'SUPER_ADMIN', axis: 'ACCOUNT', action: 'INVITATION_ISSUED', fromStatus: 'INVITED', toStatus: 'INVITED', requestId: randomUUID() }], { session });
    issued = true;
  });
  if (!issued) problem(409, 'ALREADY_CLAIMED', 'The owner has already activated this account.');
  response.status(201).json({ data: { invitation: { url: invitation.url, expiresAt: invitation.expiresAt } } });
}));

/** Pre-auth owner routes share one generic failure so a caller learns nothing about unknown, used or expired codes. */
async function invitedOwner(request: AuthRequest, code: string) {
  if (await countAttempt('invite-ip', clientIp(request), 60 * 60_000) > 20 || await countAttempt('invite-code', digest(code), 15 * 60_000) > 5) problem(429, 'RATE_LIMITED', 'Too many requests');
  const user = await User.findOne({ inviteTokenDigest: digest(code), inviteExpiresAt: { $gt: new Date() }, accountState: 'INVITED', role: 'AGENCY_OWNER' }).select('+inviteTokenDigest');
  const agency = user?.agencyId ? await Agency.findById(user.agencyId).select('name').lean() : null;
  if (!user || !agency) problem(400, 'INVALID_INVITATION', 'This link is invalid or has expired.');
  return { user: user!, agency: agency! };
}

router.post('/auth/invitations/preview', asyncRoute(async (request, response) => {
  requirePortal(request, 'OWNER');
  await requireCsrf(request, false);
  rejectAgencyInput(request);
  const input = invitationPreviewSchema.parse(request.body);
  const { user, agency } = await invitedOwner(request, input.invitationCode);
  response.json({ data: { agencyName: agency.name, email: user.emailNormalized } });
}));

router.post('/auth/invitations/claim', asyncRoute(async (request, response) => {
  requirePortal(request, 'OWNER');
  await requireCsrf(request, false);
  rejectAgencyInput(request);
  const input = invitationClaimSchema.parse(request.body);
  const { user, agency } = await invitedOwner(request, input.invitationCode);
  if (!validatePassword(input.newPassword, [user.emailNormalized, user.name, agency.name])) {
    throw new ZodError([{ code: 'custom', path: ['newPassword'], message: 'Choose a stronger password', input: undefined }]);
  }
  const passwordHash = await hashPassword(input.newPassword);
  let claimed = false;
  await mongoose.connection.transaction(async (session) => {
    const result = await User.updateOne({ _id: user._id, accountState: 'INVITED', inviteTokenDigest: digest(input.invitationCode) },
      { $set: { passwordHash, accountState: 'ACTIVE' }, $inc: { credentialVersion: 1 }, $unset: { inviteTokenDigest: '', inviteExpiresAt: '' } }, { session });
    if (result.modifiedCount !== 1) return;
    await AgencyAudit.create([{ agencyId: agency._id, actorUserId: user._id, actorRole: 'AGENCY_OWNER', axis: 'ACCOUNT', action: 'INVITATION_CLAIMED', fromStatus: 'INVITED', toStatus: 'ACTIVE', requestId: randomUUID() }], { session });
    claimed = true;
  });
  if (!claimed) problem(400, 'INVALID_INVITATION', 'This link is invalid or has expired.');
  response.status(204).end();
}));

export { router as invitationRouter };
