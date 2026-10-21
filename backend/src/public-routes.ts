import { Router, type NextFunction, type Request, type Response } from 'express';
import { requireDatabase } from './config/database.js';
import { env } from './config/env.js';
import { asyncRoute, HttpError } from './auth.js';
import { Agency, PublishedRevision } from './models.js';
import { SLUG_PATTERN } from './publication.js';
import { secureEqual } from './security.js';

// Phase 4a §4: the read-only PUBLIC portal for frontend/. Own key, no sessions, no cookies, Live revisions only (D-081, D-083, D-090).
const router = Router();
const notAvailable = () => new HttpError(404, 'NOT_AVAILABLE', 'This website is not available');

/** Only the public key opens these routes; the management key (and anything else) is refused. */
export function publicGuard(request: Request, response: Response, next: NextFunction): void {
  response.setHeader('Cache-Control', 'no-store');
  const key = env.publicApiKey;
  if (!key || key.length < 32 || key === env.internalApiKey || !secureEqual(request.header('x-public-api-key') ?? '', key)) {
    next(new HttpError(403, 'FORBIDDEN', 'Protected API'));
    return;
  }
  try { requireDatabase(); next(); } catch (error) { next(error); }
}

router.get('/sites/:slug', asyncRoute(async (request, response) => {
  const slug = String(request.params.slug);
  if (!SLUG_PATTERN.test(slug)) throw notAvailable();
  const agency = await Agency.findOne({ 'publication.slug': slug }).select('publicationStatus restrictionStatus publication').lean();
  // One identical answer for unknown, Not Live, Blocked and Deactivated (§1 Q6).
  if (!agency || agency.publicationStatus !== 'LIVE' || (agency.restrictionStatus ?? 'NONE') !== 'NONE' || !agency.publication?.liveRevisionId) throw notAvailable();
  const revision = await PublishedRevision.findOne({ _id: agency.publication.liveRevisionId, agencyId: agency._id }).lean();
  if (!revision) throw notAvailable();
  response.json({ data: { site: revision.site, revision: revision.revision, publishedAt: revision.createdAt } });
}));

router.use(() => { throw notAvailable(); });

export { router as publicRouter };
