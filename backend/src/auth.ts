import { Router, type Request, type Response, type NextFunction } from 'express';
import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';
import { ZodError } from 'zod';
import { env } from './config/env.js';
import { requireDatabase } from './config/database.js';
import { Agency, AuthRateLimit, AuthSession, User } from './models.js';
import { digest, hashPassword, normalizeEmail, preAuthCsrf, randomToken, secureEqual, sessionCsrf, verifyPassword } from './security.js';
import { loginSchema, resetSchema, signupSchema } from './validation.js';
import { ownerScope, tenantAgencyFilter } from './tenant.js';
import { ownerReviewView, ReviewError } from './review.js';
import { ownerRestrictionView } from './restriction.js';

export type Portal = 'OWNER' | 'SUPER_ADMIN';
type SessionContext = { session: InstanceType<typeof AuthSession>; user: InstanceType<typeof User>; tokenDigest: string; agencyRestriction?: string };
export type AuthRequest = Request & { portal?: Portal; sessionContext?: SessionContext };
const router = Router();

export class HttpError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
export const problem = (status: number, code: string, message: string): never => { throw new HttpError(status, code, message); };
export const asyncRoute = (handler: (request: AuthRequest, response: Response) => Promise<void>) =>
  (request: Request, response: Response, next: NextFunction) => { void handler(request as AuthRequest, response).catch(next); };

let dummyHash: Promise<string> | undefined;
const timingSafeHash = () => (dummyHash ??= hashPassword(randomToken()));

function portalOrigin(portal: Portal): string { return portal === 'OWNER' ? env.ownerOrigin : env.superOrigin; }
function portalFor(request: AuthRequest): Portal {
  const portal = request.header('x-portal');
  if (portal !== 'OWNER' && portal !== 'SUPER_ADMIN') problem(403, 'FORBIDDEN', 'Invalid portal');
  request.portal = portal as Portal;
  return portal as Portal;
}
export function requirePortal(request: AuthRequest, portal: Portal): void {
  if (portalFor(request) !== portal) problem(403, 'FORBIDDEN', 'Wrong portal');
}
function validateOrigin(request: AuthRequest): void {
  const expected = portalOrigin(portalFor(request));
  if (request.header('origin') !== expected) problem(403, 'ORIGIN_REJECTED', 'Origin is not allowed');
  if (request.header('sec-fetch-site') === 'cross-site') problem(403, 'ORIGIN_REJECTED', 'Cross-site request rejected');
}
export function clientIp(request: Request): string {
  return request.header('x-client-ip') ?? 'unknown';
}
export async function countAttempt(kind: string, value: string, durationMs: number): Promise<number> {
  const now = Date.now();
  const bucket = Math.floor(now / durationMs);
  const key = digest(`${kind}:${value}:${bucket}`);
  const expiresAt = new Date((bucket + 1) * durationMs + 5 * 60_000);
  try {
    const result = await AuthRateLimit.findOneAndUpdate({ key }, { $inc: { count: 1 }, $setOnInsert: { expiresAt } }, { upsert: true, returnDocument: 'after' });
    return result?.count ?? 1;
  } catch (error) {
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      const result = await AuthRateLimit.findOneAndUpdate({ key }, { $inc: { count: 1 } }, { returnDocument: 'after' });
      return result?.count ?? 1;
    }
    throw error;
  }
}
export async function currentSession(request: AuthRequest, required = true): Promise<SessionContext | undefined> {
  const token = request.header('x-session-token');
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
    if (required) problem(401, 'AUTH_REQUIRED', 'Sign in required');
    return undefined;
  }
  const tokenDigest = digest(token);
  const session = await AuthSession.findOne({ tokenDigest }).select('+tokenDigest +csrfSecret');
  const now = new Date();
  if (!session || session.revokedAt || session.idleExpiresAt <= now || session.absoluteExpiresAt <= now || session.portal !== portalFor(request)) {
    if (required) problem(401, 'AUTH_REQUIRED', 'Sign in required');
    return undefined;
  }
  const user = await User.findById(session.userId);
  const expectedRole = session.portal === 'OWNER' ? 'AGENCY_OWNER' : 'SUPER_ADMIN';
  if (!user || user.accountState !== 'ACTIVE' || user.role !== expectedRole || user.credentialVersion !== session.credentialVersion ||
      (expectedRole === 'AGENCY_OWNER' && !user.agencyId) || (expectedRole === 'SUPER_ADMIN' && user.agencyId)) {
    if (required) problem(401, 'AUTH_REQUIRED', 'Sign in required');
    return undefined;
  }
  // Phase 2b §4 defence in depth: a Blocked agency never has a usable owner session, even if revocation was missed.
  let agencyRestriction: string | undefined;
  if (expectedRole === 'AGENCY_OWNER') {
    const agency = await Agency.findById(user.agencyId).select('restrictionStatus').lean();
    agencyRestriction = agency?.restrictionStatus ?? 'NONE';
    if (!agency || agencyRestriction === 'BLOCKED') {
      if (required) problem(401, 'AUTH_REQUIRED', 'Sign in required');
      return undefined;
    }
  }
  if (now.getTime() - session.lastSeenAt.getTime() >= 5 * 60_000) {
    const idleMs = session.portal === 'OWNER' ? 12 * 60 * 60_000 : 30 * 60_000;
    void AuthSession.updateOne({ _id: session._id, revokedAt: { $exists: false } }, { $set: { lastSeenAt: now, idleExpiresAt: new Date(Math.min(now.getTime() + idleMs, session.absoluteExpiresAt.getTime())) } }).catch(() => undefined);
  }
  const context = { session, user, tokenDigest, agencyRestriction };
  request.sessionContext = context;
  return context;
}
function preAuthValid(request: AuthRequest): boolean {
  const nonceValue = request.header('x-preauth-nonce') ?? '';
  const [nonce, expires] = nonceValue.split('.');
  const expiry = Number(expires);
  if (!nonce || !/^[A-Za-z0-9_-]{43}$/.test(nonce) || !Number.isFinite(expiry) || Date.now() > expiry || expiry > Date.now() + 20 * 60_000) return false;
  const expected = preAuthCsrf(portalFor(request), nonceValue);
  return secureEqual(request.header('x-csrf-token') ?? '', expected);
}
/** Mutations need CSRF + exact Origin. Bodies are JSON unless a route explicitly allows other types (Phase 3d image uploads). */
export async function requireCsrf(request: AuthRequest, authenticated: boolean, allowedTypes: string[] = ['application/json']): Promise<void> {
  validateOrigin(request);
  if (!request.is(allowedTypes) && request.method !== 'DELETE') problem(415, 'UNSUPPORTED_MEDIA_TYPE', allowedTypes.length === 1 ? 'JSON required' : 'Unsupported content type');
  if (authenticated) {
    const context = await currentSession(request);
    if (!context || !secureEqual(request.header('x-csrf-token') ?? '', sessionCsrf(context.session.csrfSecret, context.tokenDigest))) {
      problem(403, 'CSRF_REJECTED', 'CSRF token invalid');
    }
  } else if (!preAuthValid(request)) problem(403, 'CSRF_REJECTED', 'CSRF token invalid');
}
export function rejectAgencyInput(request: Request): void {
  if (Object.hasOwn(request.query, 'agencyId') || Object.hasOwn(request.body ?? {}, 'agencyId') || request.header('x-agency-id')) {
    problem(422, 'VALIDATION_ERROR', 'agencyId is not accepted');
  }
}
/** Phase 2b §4: a Deactivated owner keeps read access but every owner mutation except sign-out is refused. */
export function requireOwnerWritable(request: AuthRequest): void {
  if (request.sessionContext?.agencyRestriction === 'DEACTIVATED') {
    problem(403, 'AGENCY_DEACTIVATED', 'Your agency account is deactivated. Contact EstateOS support.');
  }
}
function ownerData(user: InstanceType<typeof User>, agency: InstanceType<typeof Agency>) {
  return {
    user: { id: user.id, name: user.name, role: user.role },
    agency: { id: agency.id, name: agency.name, reviewStatus: agency.reviewStatus, restrictionStatus: agency.restrictionStatus ?? 'NONE' },
  };
}

/** Runs before every /api/v1 router: internal facade key, database availability, portal header, no-store. */
export function apiGuard(request: Request, response: Response, next: NextFunction): void {
  response.setHeader('Cache-Control', 'no-store');
  if (!env.internalApiKey || env.internalApiKey.length < 32 || !secureEqual(request.header('x-internal-api-key') ?? '', env.internalApiKey)) {
    next(new HttpError(403, 'FORBIDDEN', 'Protected API'));
    return;
  }
  try { requireDatabase(); portalFor(request as AuthRequest); next(); } catch (error) { next(error); }
}

router.get('/auth/csrf', asyncRoute(async (request, response) => {
  if (await countAttempt('csrf', clientIp(request), 60_000) > 30) problem(429, 'RATE_LIMITED', 'Too many requests');
  const context = await currentSession(request, false);
  if (context) {
    response.json({ data: { csrfToken: sessionCsrf(context.session.csrfSecret, context.tokenDigest) } });
    return;
  }
  const nonce = `${randomToken()}.${Date.now() + 20 * 60_000}`;
  response.json({ data: { csrfToken: preAuthCsrf(portalFor(request), nonce) }, internal: { preauthNonce: nonce } });
}));

router.post('/owner/registrations', asyncRoute(async (request, response) => {
  requirePortal(request, 'OWNER');
  await requireCsrf(request, false);
  rejectAgencyInput(request);
  if (await countAttempt('signup', clientIp(request), 60 * 60_000) > 5) problem(429, 'RATE_LIMITED', 'Too many requests');
  const input = signupSchema.parse(request.body);
  const passwordHash = await hashPassword(input.password);
  let agencyResult: InstanceType<typeof Agency> | undefined;
  let ownerResult: InstanceType<typeof User> | undefined;
  try {
    await mongoose.connection.transaction(async (transaction) => {
      const [agency] = await Agency.create([{ name: input.agencyName, mobileE164: input.mobile, whatsappE164: input.whatsapp, reviewStatus: 'PENDING' }], { session: transaction });
      const [owner] = await User.create([{ role: 'AGENCY_OWNER', agencyId: agency._id, name: input.ownerName, emailNormalized: input.email, passwordHash }], { session: transaction });
      agencyResult = agency;
      ownerResult = owner;
    });
  } catch (error) {
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) problem(409, 'EMAIL_EXISTS', 'Email is already registered');
    throw error;
  }
  const agency = agencyResult!;
  const owner = ownerResult!;
  response.status(201).json({ data: { agency: { id: agency.id, reviewStatus: 'PENDING' }, owner: { id: owner.id, name: owner.name, email: owner.emailNormalized } } });
}));

async function login(request: AuthRequest, response: Response, portal: Portal): Promise<void> {
  requirePortal(request, portal);
  await requireCsrf(request, false);
  rejectAgencyInput(request);
  const input = loginSchema.parse(request.body);
  const ip = clientIp(request);
  if (await countAttempt(`login-ip-${portal}`, ip, 15 * 60_000) > (portal === 'OWNER' ? 20 : 10)) problem(429, 'RATE_LIMITED', 'Too many requests');
  const failedKey = `${normalizeEmail(input.email)}:${ip}`;
  const failedBucket = Math.floor(Date.now() / (15 * 60_000));
  const failed = await AuthRateLimit.findOne({ key: digest(`login-fail-${portal}:${failedKey}:${failedBucket}`) });
  if ((failed?.count ?? 0) >= 5) problem(429, 'RATE_LIMITED', 'Too many requests');
  const user = await User.findOne({ emailNormalized: input.email }).select('+passwordHash');
  const expectedRole = portal === 'OWNER' ? 'AGENCY_OWNER' : 'SUPER_ADMIN';
  // Verify against a throwaway hash for unknown emails so response timing does not reveal registered accounts.
  const verified = await verifyPassword(user?.passwordHash ?? await timingSafeHash(), input.password);
  const good = Boolean(user?.passwordHash) && verified;
  if (!good || !user || user.role !== expectedRole || user.accountState !== 'ACTIVE') {
    await countAttempt(`login-fail-${portal}`, failedKey, 15 * 60_000);
    throw new HttpError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }
  if (portal === 'OWNER' && !user.agencyId) problem(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  if (portal === 'SUPER_ADMIN' && user.agencyId) problem(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  const agency = portal === 'OWNER' ? await Agency.findById(user.agencyId) : null;
  if (portal === 'OWNER' && !agency) problem(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  // Shown only after a correct password, so it reveals nothing about which emails exist (Phase 2b §4).
  if (agency?.restrictionStatus === 'BLOCKED') problem(403, 'AGENCY_BLOCKED', 'This agency account is blocked. Contact EstateOS support.');
  const token = randomToken();
  const now = new Date();
  const idleMs = portal === 'OWNER' ? 12 * 60 * 60_000 : 30 * 60_000;
  const absoluteMs = portal === 'OWNER' ? 7 * 24 * 60 * 60_000 : 12 * 60 * 60_000;
  await AuthSession.create({ tokenDigest: digest(token), userId: user._id, portal, credentialVersion: user.credentialVersion,
    csrfSecret: randomToken(), lastSeenAt: now, idleExpiresAt: new Date(now.getTime() + idleMs), absoluteExpiresAt: new Date(now.getTime() + absoluteMs) });
  const sessions = await AuthSession.find({ userId: user._id, portal, revokedAt: { $exists: false } }).sort({ createdAt: -1 }).select('_id');
  const max = portal === 'OWNER' ? 3 : 1;
  if (sessions.length > max) await AuthSession.updateMany({ _id: { $in: sessions.slice(max).map((item) => item._id) } }, { $set: { revokedAt: now } });
  if (agency) response.json({ data: ownerData(user, agency), internal: { sessionToken: token } });
  else response.json({ data: { user: { id: user.id, name: user.name, role: user.role } }, internal: { sessionToken: token } });
}
router.post('/owner/sessions', asyncRoute((request, response) => login(request, response, 'OWNER')));
router.post('/super-admin/sessions', asyncRoute((request, response) => login(request, response, 'SUPER_ADMIN')));

router.get('/owner/session', asyncRoute(async (request, response) => {
  requirePortal(request, 'OWNER');
  const context = await currentSession(request);
  const agency = await Agency.findOne(tenantAgencyFilter(ownerScope(context!.user)));
  if (!agency) throw new HttpError(401, 'AUTH_REQUIRED', 'Sign in required');
  response.json({ data: ownerData(context!.user, agency) });
}));
router.get('/super-admin/session', asyncRoute(async (request, response) => {
  requirePortal(request, 'SUPER_ADMIN');
  const context = await currentSession(request);
  response.json({ data: { user: { id: context!.user.id, name: context!.user.name, role: context!.user.role } } });
}));
router.delete('/owner/session', asyncRoute(async (request, response) => {
  requirePortal(request, 'OWNER');
  await requireCsrf(request, true);
  await AuthSession.updateOne({ _id: request.sessionContext!.session._id }, { $set: { revokedAt: new Date() } });
  response.status(204).end();
}));
router.delete('/super-admin/session', asyncRoute(async (request, response) => {
  requirePortal(request, 'SUPER_ADMIN');
  await requireCsrf(request, true);
  await AuthSession.updateOne({ _id: request.sessionContext!.session._id }, { $set: { revokedAt: new Date() } });
  response.status(204).end();
}));

router.get('/owner/agencies/:agencyId', asyncRoute(async (request, response) => {
  requirePortal(request, 'OWNER');
  rejectAgencyInput(request);
  const context = await currentSession(request);
  let filter: { _id: string };
  try { filter = tenantAgencyFilter(ownerScope(context!.user), String(request.params.agencyId)); }
  catch { throw new HttpError(404, 'NOT_FOUND', 'Agency not found'); }
  const agency = await Agency.findOne(filter);
  if (!agency) throw new HttpError(404, 'NOT_FOUND', 'Agency not found');
  response.json({ data: { id: agency.id, name: agency.name, mobile: agency.mobileE164, whatsapp: agency.whatsappE164, reviewStatus: agency.reviewStatus, ...ownerReviewView(agency), restriction: ownerRestrictionView(agency) } });
}));

router.post('/auth/recovery/complete', asyncRoute(async (request, response) => {
  await requireCsrf(request, false);
  rejectAgencyInput(request);
  const input = resetSchema.parse(request.body);
  if (await countAttempt('reset-ip', clientIp(request), 60 * 60_000) > 5 || await countAttempt('reset-code', digest(input.resetCode), 15 * 60_000) > 5) problem(429, 'RATE_LIMITED', 'Too many requests');
  const tokenDigest = digest(input.resetCode);
  const passwordHash = await hashPassword(input.newPassword);
  const portal = portalFor(request);
  let succeeded = false;
  await mongoose.connection.transaction(async (transaction) => {
    // Phase 6a: an INVITED account claims its invitation instead; a reset code never applies to it.
    const user = await User.findOne({ resetTokenDigest: tokenDigest, resetExpiresAt: { $gt: new Date() }, accountState: 'ACTIVE', role: portal === 'OWNER' ? 'AGENCY_OWNER' : 'SUPER_ADMIN' })
      .select('+resetTokenDigest +resetExpiresAt').session(transaction);
    if (!user) return;
    const result = await User.updateOne({ _id: user._id, resetTokenDigest: tokenDigest }, { $set: { passwordHash }, $inc: { credentialVersion: 1 }, $unset: { resetTokenDigest: '', resetExpiresAt: '' } }, { session: transaction });
    if (result.modifiedCount !== 1) return;
    await AuthSession.updateMany({ userId: user._id, revokedAt: { $exists: false } }, { $set: { revokedAt: new Date() } }, { session: transaction });
    succeeded = true;
  });
  if (!succeeded) problem(400, 'INVALID_RESET_CODE', 'Reset code is invalid or expired');
  response.status(204).end();
}));

export function authErrorHandler(error: unknown, _request: Request, response: Response, next: NextFunction): void {
  if (response.headersSent) { next(error); return; }
  const requestId = randomUUID();
  let status = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'Internal server error';
  let details: Record<string, string> | undefined;
  if (error instanceof HttpError || error instanceof ReviewError) { status = error.status; code = error.code; message = error.message; }
  else if (error instanceof ZodError) {
    status = 422; code = 'VALIDATION_ERROR'; message = 'Invalid request';
    details = Object.fromEntries(error.issues.map((issue) => [issue.path.join('.') || 'request', issue.message]));
  } else if (error instanceof Error && error.message === 'AUTH_UNAVAILABLE') {
    status = 503; code = 'AUTH_UNAVAILABLE'; message = 'Authentication is temporarily unavailable';
  } else if (error instanceof Error && (error as { type?: string }).type === 'entity.too.large') {
    // Phase 3d: an upload body over the size limit (D-060: 5 MB per image).
    status = 422; code = 'TOO_LARGE'; message = 'This image is larger than 5 MB.';
  } else if (error instanceof SyntaxError && 'body' in error) {
    status = 400; code = 'INVALID_JSON'; message = 'Malformed JSON';
  }
  if (status >= 500) console.error(`[${requestId}]`, error);
  if (status === 429) response.setHeader('Retry-After', '900');
  response.status(status).json({ error: { code, message, ...(details ? { details } : {}), requestId } });
}

export { router as authRouter };
