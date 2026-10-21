import mongoose, { type Types } from 'mongoose';
import { env } from './config/env.js';
import { Agency, AgencyAudit, PublishedRevision, WebsiteDraft } from './models.js';
import { getReadinessIssues, websiteView } from './website.js';

// Phase 4a automatic first Live (docs/PHASE-4A-FIRST-LIVE-CONTRACT-APPROVED.md): D-029, D-077, D-082, D-090, D-091, D-119.

export const RESERVED_SLUGS: ReadonlySet<string> = new Set(['www', 'admin', 'control', 'api', 'app', 'sites', 'mail', 'support', 'help', 'status', 'estateos', 'static', 'assets']);
export const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/;

/** §1 Q2: lowercase a–z, 0–9 and hyphens, 3–40 characters, never a reserved word. */
export function slugBase(agencyName: string): string {
  let base = agencyName.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40).replace(/-+$/g, '');
  if (base.length < 3) base = base ? `${base}-agency` : 'agency';
  if (RESERVED_SLUGS.has(base)) base = `${base}-agency`;
  return base;
}
/** Candidate n (1 = the base itself), trimmed so the suffix still fits in 40 characters. */
export function slugCandidate(base: string, n: number): string {
  if (n === 1) return base;
  const suffix = `-${n}`;
  return `${base.slice(0, 40 - suffix.length).replace(/-+$/g, '')}${suffix}`;
}
async function pickSlug(agencyName: string, session: mongoose.ClientSession): Promise<string> {
  const base = slugBase(agencyName);
  for (let n = 1; n <= 200; n += 1) {
    const candidate = slugCandidate(base, n);
    if (!await Agency.exists({ 'publication.slug': candidate }).session(session)) return candidate;
  }
  throw new Error('SLUG_EXHAUSTED');
}

export function publicUrl(slug: string): string {
  return `https://${slug}.${env.publicSiteDomain}`;
}

type PublicationFields = {
  publicationStatus?: string | null;
  publication?: { slug?: string | null; firstLiveAt?: Date | null; lastActivationError?: { code: string; at: Date } | null; activationAttempts?: number | null } | null;
};
/** Truthful status for the owner: a link only when actually Live (D-048, D-119). */
export function ownerPublicationView(agency: PublicationFields) {
  const status = agency.publicationStatus ?? 'NEVER_PUBLISHED';
  const slug = agency.publication?.slug;
  return { status, ...(status === 'LIVE' && slug ? { url: publicUrl(slug), firstLiveAt: agency.publication?.firstLiveAt } : {}) };
}
/** Super Admin also sees the private activation error and attempt count. */
export function adminPublicationView(agency: PublicationFields) {
  return {
    ...ownerPublicationView(agency),
    ...(agency.publication?.lastActivationError ? { lastActivationError: agency.publication.lastActivationError } : {}),
    activationAttempts: agency.publication?.activationAttempts ?? 0,
  };
}

export type ActivationResult = 'LIVE' | 'ALREADY_LIVE' | 'NOT_ELIGIBLE' | 'FAILED';
class NotEligible extends Error {}

type AgencyDoc = { _id: Types.ObjectId; name: string; reviewStatus: string; restrictionStatus?: string | null; publicationStatus?: string | null };
function eligible(agency: AgencyDoc, draft: Parameters<typeof getReadinessIssues>[0] | null): boolean {
  return agency.reviewStatus === 'APPROVED' && (agency.restrictionStatus ?? 'NONE') === 'NONE' && Boolean(draft) && getReadinessIssues(draft!).length === 0;
}

/**
 * §3: the one idempotent first activation. Revision 1, slug, Live pointer and audit are written in ONE transaction,
 * guarded by a conditional update, so concurrent callers produce exactly one Live. A failure never shows Live:
 * the agency is marked ACTIVATION_PENDING privately and the reconciler retries (D-119).
 */
export async function tryFirstActivation(agencyId: Types.ObjectId | string): Promise<ActivationResult> {
  const agency = await Agency.findById(agencyId).lean();
  if (!agency) return 'NOT_ELIGIBLE';
  if (agency.publicationStatus === 'LIVE') return 'ALREADY_LIVE';
  if (!eligible(agency, await WebsiteDraft.findOne({ agencyId: agency._id }).lean())) return 'NOT_ELIGIBLE';
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await mongoose.connection.transaction(async (session) => {
        const current = await Agency.findById(agency._id).session(session).lean();
        const draft = await WebsiteDraft.findOne({ agencyId: agency._id }).session(session).lean();
        if (!current || current.publicationStatus === 'LIVE' || !eligible(current, draft)) throw new NotEligible();
        const slug = current.publication?.slug ?? await pickSlug(current.name, session);
        const view = websiteView(current, draft!, false);
        const site = { theme: view.theme, sections: view.sections, layout: view.layout, mapped: view.mapped, properties: [] };
        const now = new Date();
        const [revision] = await PublishedRevision.create([{ agencyId: current._id, revision: 1, slug, site, reason: 'FIRST_ACTIVATION', createdAt: now }], { session });
        const fromStatus = current.publicationStatus ?? 'NEVER_PUBLISHED';
        const result = await Agency.updateOne(
          { _id: current._id, publicationStatus: { $in: ['NEVER_PUBLISHED', 'ACTIVATION_PENDING'] }, reviewStatus: 'APPROVED', restrictionStatus: 'NONE' },
          {
            $set: { publicationStatus: 'LIVE', 'publication.slug': slug, 'publication.liveRevisionId': revision!._id, 'publication.firstLiveAt': now },
            $unset: { 'publication.lastActivationError': '' },
          },
          { session },
        );
        if (result.modifiedCount !== 1) throw new NotEligible();
        await AgencyAudit.create([{
          at: now, agencyId: current._id, actorRole: 'SYSTEM', axis: 'PUBLICATION', action: 'WEBSITE_FIRST_LIVE',
          fromStatus, toStatus: 'LIVE', requestId: `activation-${String(revision!._id)}`,
        }], { session });
      });
      return 'LIVE';
    } catch (error) {
      if (error instanceof NotEligible) {
        const latest = await Agency.findById(agency._id).select('publicationStatus').lean();
        return latest?.publicationStatus === 'LIVE' ? 'ALREADY_LIVE' : 'NOT_ELIGIBLE';
      }
      // A slug taken by a concurrent activation of another agency: pick again.
      if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000 && attempt < 3) continue;
      const code = error instanceof mongoose.mongo.MongoServerError ? `MONGO_${error.code ?? 'ERROR'}` : error instanceof Error ? error.message.slice(0, 60) : 'UNKNOWN';
      await Agency.updateOne(
        { _id: agency._id, publicationStatus: { $ne: 'LIVE' } },
        { $set: { publicationStatus: 'ACTIVATION_PENDING', 'publication.lastActivationError': { code, at: new Date() } }, $inc: { 'publication.activationAttempts': 1 } },
      ).catch(() => undefined);
      console.error(`[activation] agency=${String(agency._id)} failed code=${code}`);
      return 'FAILED';
    }
  }
  return 'FAILED';
}

/** Called after a triggering write has committed (§1 Q4). Never fails the caller's request. */
export async function afterReadinessChange(agencyId: Types.ObjectId | string): Promise<void> {
  await tryFirstActivation(agencyId).catch(() => undefined);
}

/** §3 reconciliation: approved, unrestricted agencies that are not Live yet. Returns how many went Live. */
export async function reconcileActivations(limit = 200): Promise<{ checked: number; live: number; failed: number }> {
  const candidates = await Agency.find({ reviewStatus: 'APPROVED', restrictionStatus: 'NONE', publicationStatus: { $ne: 'LIVE' } })
    .select('_id').limit(limit).lean();
  let live = 0;
  let failed = 0;
  for (const candidate of candidates) {
    const result = await tryFirstActivation(candidate._id);
    if (result === 'LIVE') live += 1;
    if (result === 'FAILED') failed += 1;
  }
  return { checked: candidates.length, live, failed };
}

let reconciling = false;
/** Background reconciler every 5 minutes (§1 Q4); one run at a time, never keeps the process alive on its own. */
export function startReconciler(intervalMs = 5 * 60_000): NodeJS.Timeout {
  const timer = setInterval(() => {
    if (reconciling || mongoose.connection.readyState !== 1) return;
    reconciling = true;
    void reconcileActivations()
      .then((result) => { if (result.live || result.failed) console.info(`[activation] reconcile checked=${result.checked} live=${result.live} failed=${result.failed}`); })
      .catch((error: unknown) => console.error('[activation] reconcile failed', error instanceof Error ? error.message : error))
      .finally(() => { reconciling = false; });
  }, intervalMs);
  timer.unref();
  return timer;
}
