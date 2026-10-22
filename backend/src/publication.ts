import { createHash } from 'node:crypto';
import mongoose, { type Types } from 'mongoose';
import { env } from './config/env.js';
import { Agency, AgencyAudit, PublishedRevision, WebsiteDraft } from './models.js';
import { ownerCanEdit, ReviewError } from './review.js';
import { eligibleProperties } from './properties.js';
import { getReadinessIssues, websiteView, type DraftFields, type ReadinessIssue } from './website.js';

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

type SnapshotAgency = Parameters<typeof websiteView>[0];
/** The public material of one revision (D-090): exactly what the template renders, including eligible properties (Phase 5a). */
/** Phase 3d: every media id a snapshot shows (Hero upload, logo, property photos). The public image route serves only these. */
export function snapshotMediaIds(site: Awaited<ReturnType<typeof buildSnapshot>>): string[] {
  const ids = new Set<string>();
  const hero = site.sections.hero as { heroUploadId?: string | null };
  const header = site.sections.header as { logoMediaId?: string | null };
  if (hero.heroUploadId) ids.add(hero.heroUploadId);
  if (header.logoMediaId) ids.add(header.logoMediaId);
  for (const property of site.properties as { photos?: string[] }[]) for (const id of property.photos ?? []) ids.add(id);
  return [...ids];
}

export async function buildSnapshot(agency: SnapshotAgency, draft: DraftFields, session?: mongoose.ClientSession) {
  const view = websiteView(agency, draft, false);
  return { theme: view.theme, sections: view.sections, layout: view.layout, mapped: view.mapped, properties: await eligibleProperties(agency._id, session) };
}

/** Recursively drops internal `version` counters and sorts keys, so identical content always gives the same text. */
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(Object.keys(value).filter((key) => key !== 'version').sort()
      .map((key) => [key, canonical((value as Record<string, unknown>)[key])]).filter(([, entry]) => entry !== undefined));
  }
  return value;
}
/** Phase 4b §1 Q3: content fingerprint for "Unpublished changes". Saving identical text again never counts as a change. */
export function contentFingerprint(site: unknown): string {
  return createHash('sha256').update(JSON.stringify(canonical(site))).digest('hex');
}

type LiveAgency = SnapshotAgency & { publicationStatus?: string | null; publication?: { liveRevisionId?: Types.ObjectId | null } | null };
/** Live revision number, publish date and whether the saved draft really differs from it (D-054). Only for Live agencies. */
export async function livePublicationDetails(agency: LiveAgency, draft: DraftFields | null) {
  if (agency.publicationStatus !== 'LIVE' || !agency.publication?.liveRevisionId) return {};
  const live = await PublishedRevision.findById(agency.publication.liveRevisionId).select('revision createdAt contentHash site').lean();
  if (!live) return {};
  const liveHash = live.contentHash ?? contentFingerprint(live.site);
  const unpublishedChanges = draft ? contentFingerprint(await buildSnapshot(agency, draft)) !== liveHash : false;
  return { liveRevision: live.revision, publishedAt: live.createdAt, unpublishedChanges };
}

export type PublishResult = { kind: 'PUBLISHED'; revision: number } | { kind: 'NOT_READY'; issues: ReadinessIssue[] };
const conflict = () => new ReviewError(409, 'PUBLISH_CONFLICT', 'Your website was updated in another window. Reload to see the latest version.');

/**
 * Phase 4b §3: Publish updates. The whole saved draft becomes revision n+1; the pointer moves by compare-and-swap,
 * all in one transaction with the audit entry. The same requestId never publishes twice (D-087, D-107).
 * On any unexpected failure nothing changes: the Live revision and the saved draft both stay as they were.
 */
export async function publishUpdates(input: { agencyId: string; ownerUserId: string; expectedLiveRevision: number; requestId: string }): Promise<PublishResult> {
  try {
    let outcome: PublishResult | undefined;
    await mongoose.connection.transaction(async (session) => {
      const replay = await PublishedRevision.findOne({ agencyId: input.agencyId, requestId: input.requestId }).session(session).select('revision').lean();
      if (replay) { outcome = { kind: 'PUBLISHED', revision: replay.revision }; return; }
      const agency = await Agency.findById(input.agencyId).session(session).lean();
      if (!agency) throw new ReviewError(404, 'NOT_FOUND', 'Agency not found');
      if (agency.publicationStatus !== 'LIVE' || !agency.publication?.liveRevisionId || !agency.publication.slug) {
        throw new ReviewError(409, 'NOT_LIVE', 'Your website is not live yet. It goes live automatically once it is approved and ready.');
      }
      if (!ownerCanEdit(agency)) {
        if ((agency.restrictionStatus ?? 'NONE') === 'DEACTIVATED') throw new ReviewError(403, 'AGENCY_DEACTIVATED', 'Your agency account is deactivated. Contact EstateOS support.');
        throw new ReviewError(403, 'WEBSITE_READ_ONLY', 'Your website can no longer be changed. Contact EstateOS support.');
      }
      const live = await PublishedRevision.findById(agency.publication.liveRevisionId).session(session).lean();
      if (!live || live.revision !== input.expectedLiveRevision) throw conflict();
      const draft = await WebsiteDraft.findOne({ agencyId: agency._id }).session(session).lean();
      const issues = draft ? getReadinessIssues(draft) : [];
      if (!draft || issues.length) { outcome = { kind: 'NOT_READY', issues }; return; }
      const site = await buildSnapshot(agency, draft, session);
      const contentHash = contentFingerprint(site);
      if (contentHash === (live.contentHash ?? contentFingerprint(live.site))) {
        throw new ReviewError(409, 'NOTHING_TO_PUBLISH', 'There are no saved changes to publish.');
      }
      const now = new Date();
      const [revision] = await PublishedRevision.create([{
        agencyId: agency._id, revision: live.revision + 1, slug: agency.publication.slug, site, reason: 'PUBLISH_UPDATES',
        requestId: input.requestId, contentHash, mediaIds: snapshotMediaIds(site), createdAt: now,
      }], { session });
      const swapped = await Agency.updateOne(
        { _id: agency._id, publicationStatus: 'LIVE', restrictionStatus: 'NONE', 'publication.liveRevisionId': live._id },
        { $set: { 'publication.liveRevisionId': revision!._id } },
        { session },
      );
      if (swapped.modifiedCount !== 1) throw conflict();
      await AgencyAudit.create([{
        at: now, agencyId: agency._id, actorUserId: input.ownerUserId, actorRole: 'AGENCY_OWNER', axis: 'PUBLICATION',
        action: 'WEBSITE_PUBLISH_UPDATES', fromStatus: 'LIVE', toStatus: 'LIVE', requestId: input.requestId,
      }], { session });
      outcome = { kind: 'PUBLISHED', revision: revision!.revision };
    });
    return outcome!;
  } catch (error) {
    if (error instanceof ReviewError) throw error;
    // A concurrent publish with the same requestId won the race: that is the same publication, not a failure.
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      const replay = await PublishedRevision.findOne({ agencyId: input.agencyId, requestId: input.requestId }).select('revision').lean();
      if (replay) return { kind: 'PUBLISHED', revision: replay.revision };
      throw conflict();
    }
    console.error(`[publish] agency=${input.agencyId} failed code=${error instanceof Error ? error.message.slice(0, 60) : 'UNKNOWN'}`);
    throw new ReviewError(503, 'PUBLISH_FAILED', 'Publishing failed. Your live website and saved changes are unchanged. Please try again.');
  }
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
        const site = await buildSnapshot(current, draft!, session);
        const now = new Date();
        const [revision] = await PublishedRevision.create([{ agencyId: current._id, revision: 1, slug, site, reason: 'FIRST_ACTIVATION', contentHash: contentFingerprint(site), mediaIds: snapshotMediaIds(site), createdAt: now }], { session });
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
