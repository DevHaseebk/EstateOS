# EstateOS — Phase 4a Automatic First Live and Public Agency Website Contract (APPROVED)

**Status:** APPROVED by the owner in chat on 2026-10-22, as written, including the confirmations in section 8 (D-115). Drafted by Claude Code the same day.
**Builds on:** Phases 1–3c (`docs/PHASE-*-APPROVED.md`), especially the 3b draft, readiness and shared template.
**Decisions implemented:** D-029, D-033, D-048, D-054 (Live status part), D-075, D-076, D-077, D-078/D-084 (zero properties), D-081, D-082, D-083, D-088, D-089, D-090, D-091, D-092, D-094 (dev hosts only), D-102, D-111, D-115, D-119.

## 0. How Phase 4 is split (approved)

| Phase | Contents |
|---|---|
| **4a (this contract)** | Public web address (slug) per agency; immutable published revisions; **automatic first Live** when the agency is Approved **and** the website is ready (no owner Publish/Submit, D-029); safe retry and reconciliation (D-091, D-119); the public agency website on `frontend/`; Blocked/Deactivated agencies not public (D-083); truthful Live status and the real link in both portals. |
| 4b (later contract) | **Publish Updates** after Live (D-053, D-063, D-079, D-087, D-107): an "Unpublished changes" indicator (D-054) and atomic publishing with safe retry. |

Until 4b, edits saved after going Live stay in the private draft. The hub says so plainly.

## 1. Owner answers this contract is based on (approved 2026-10-22)

| # | Question | Recommended answer |
|---|---|---|
| 1 | What is the public web address in development? | `https://<slug>.sites.estateos.localhost` through the local Caddy proxy (wildcard, `tls internal`). The real production domain is chosen later (D-094). It is one setting, `PUBLIC_SITE_DOMAIN`. |
| 2 | How is the slug made, and when? | Made **at first Live** from the agency name: lowercase a–z, 0–9 and hyphens, 3–40 characters, with a number added if it is already taken (`city-homes-2`). Reserved words are never used (`www`, `admin`, `control`, `api`, `app`, `sites`, `mail`, `support`, `help`, `status`, `estateos`, `static`, `assets`). After that it **never changes** (D-082). Super Admin correction is an exceptional later feature, not in 4a. |
| 3 | How does the public site read data safely? | A new read-only **PUBLIC** portal for `frontend/`, with its **own** API key (`PUBLIC_API_KEY`, not the management key). It can only call `GET /public/sites/:slug`. It has no cookies and no sessions (D-081). |
| 4 | When does the first Live happen? | It is checked **after each successful**: Approve; Restore; Profile save; theme, section or layout save. If Approved **and** unrestricted **and** ready → revision 1 is created and the agency goes Live, exactly once. A background **reconciliation** run every 5 minutes (plus a CLI) retries anything missed or failed. |
| 5 | What if activation fails? | The triggering save still succeeds and is kept. The agency shows **"Going live — retrying automatically"** privately, with the error recorded, and is **never** shown as Live publicly until it really is (D-119). |
| 6 | What do Blocked, Deactivated or unknown addresses show? | The same plain **"This website is not available"** page (HTTP 404). It does not reveal whether the agency exists or why. Restoring re-checks eligibility; the site does not simply come back (D-083). |
| 7 | Caching? | **None in 4a.** Every public request reads the current Live revision, so restrictions apply immediately. Caching comes with 4b/launch work (D-107). |
| 8 | Properties on the first Live (D-084)? | Properties do not exist yet (Phase 5). Revision 1 has an empty property list, and zero properties is valid. |

## 2. Data model

**`Agency`:**
- `publicationStatus` gains values: `NEVER_PUBLISHED` → `ACTIVATION_PENDING` (failure only) → `LIVE` (D-102).
- New `publication` fields:

| Field | Meaning |
|---|---|
| `slug` | unique, set once at first Live |
| `liveRevisionId` | the single authoritative pointer (D-090) |
| `firstLiveAt` | when the agency first went Live |
| `lastActivationError` | `{ code, at }`, private |
| `activationAttempts` | count of attempts |

**`PublishedRevision` (new, append-only like the audit — no update or delete paths):**
- `agencyId`, `revision` (1 in 4a), `slug`;
- `site` — the full render model frozen at publish time: theme, all sections, layout, mapped contacts, the Hero photo id, and `properties: []`;
- `createdAt`, `reason: 'FIRST_ACTIVATION'`.
- Unique index `(agencyId, revision)`.

**Audit:** `AgencyAudit` gets the action `WEBSITE_FIRST_LIVE` (actor: system, `axis: 'PUBLICATION'`), written in the same transaction as the pointer switch.

## 3. First activation — one function, idempotent (D-077, D-091)

`tryFirstActivation(agencyId)`:
1. Read the agency and the draft. If already `LIVE` → do nothing. If not Approved, restricted, or `getReadinessIssues` is not empty → do nothing (stays Not Live).
2. In **one transaction**:
   - assign the slug if missing (unique index; on a collision try the next suffix);
   - insert revision 1;
   - set `publicationStatus: LIVE`, `liveRevisionId`, `firstLiveAt`, using a conditional update on `publicationStatus ∈ {NEVER_PUBLISHED, ACTIVATION_PENDING}`;
   - write the audit entry.
   If the conditional update matches nothing, another run already succeeded → abort and do nothing.
3. On any error → outside the transaction set `ACTIVATION_PENDING`, `lastActivationError`, `activationAttempts += 1`, and log without private data (D-111). Nothing public changes.

**Callers:**
- the six triggers in section 1 Q4 (called after the triggering write has committed; its errors never fail that request);
- the **reconciler** every 5 minutes in the backend process for agencies that are Approved, unrestricted and not `LIVE`;
- `npm run reconcile:activations -w backend`.

## 4. Public read (D-075, D-083, D-089)

`GET /api/v1/public/sites/:slug` (PUBLIC portal only):
- returns `200 { site, revision, publishedAt }` **only** if the agency is `LIVE` **and** `restrictionStatus = NONE`;
- otherwise `404 NOT_AVAILABLE`, the same body whether the slug is unknown, Blocked, Deactivated or Not Live;
- the slug comes from the path only, so there is no other way to address an agency.

## 5. Screens

- **Public website (`frontend/`, port 4000):**
  - reads the `Host` header (`<slug>.<PUBLIC_SITE_DOMAIN>`);
  - fetches the revision server-side and renders the shared `SiteTemplate` (server-rendered, good for search engines);
  - page title = agency name; no cookies; a minimal plain 404 page for "not available".
  - The bare platform host keeps the current placeholder page.
- **Agency Admin:**
  - The hub and Overview show the **website status** truthfully:
    - **Not live** (with the missing items);
    - **Going live — retrying automatically**;
    - **Live** with the real link "Open your website" (D-048);
    - after Live: "Changes you save stay private until Publish Updates (coming next)".
  - No Publish or Submit button for the first Live.
- **Super Admin:**
  - directory and detail show Website status (Not ready / Ready / Going live / Live) and, when Live, the public link;
  - the detail shows the last activation error code when pending.

## 6. Local development setup

- `dev/https/Caddyfile` adds `*.sites.estateos.localhost` → `127.0.0.1:4000` (`tls internal`, the same trusted local CA).
- New env variables:
  - `frontend/.env.local`: `PUBLIC_API_KEY`, `PUBLIC_SITE_DOMAIN`, `API_URL`;
  - `backend/.env`: `PUBLIC_API_KEY`.
  - Claude generates the random key in the gitignored files, as for the other keys.
- Local end-to-end testing of a real Live needs a ready site. Licensed Hero photos don't exist yet, so the backend is run temporarily with the **test fixture** (`HERO_DEFAULTS_PATH`) for the check only. This is documented, dev-only, and never used in production.

## 7. Acceptance tests (D-093)

**Unit:** slug generation (accents and symbols removed, length bounds, reserved words, suffix on collision); the publication state transitions.

**API integration (in-memory replica set, synthetic data, fixture photos):**
1. A ready agency that is approved goes Live exactly once: revision 1 exists, the pointer is set, the slug is assigned, and one audit entry is written.
2. An agency that is approved but not ready stays `NEVER_PUBLISHED`. Its later save that completes readiness triggers Live; zero properties is fine.
3. A ready but Pending agency never goes Live, and Approve then triggers Live.
4. Parallel triggers (two saves at once plus the reconciler) still produce exactly one revision.
5. A forced failure during activation → `ACTIVATION_PENDING` with an error. The triggering save still succeeds, nothing is public, and the next reconcile run goes Live.
6. Public read: Live → 200 with the frozen revision. A later draft edit does **not** change the public data (until 4b). Blocked, Deactivated, unknown and Not Live → identical 404. Restore re-checks and the site is public again.
7. The PUBLIC key/portal can only call `GET /public/sites/:slug`; the management key can't call public routes and vice versa; public routes set no cookies.
8. A slug collision between two agencies with the same name → the second gets `-2`, and slugs never change after a rename.
9. Revisions and audit entries can't be updated or deleted.

**Frontend:** host parsing (valid slug host, bare host, foreign host) and server-rendering of a revision.

**Gates:**
- typecheck, lint and build (5 workspaces), plus `npm test -w backend`;
- an HTTPS end-to-end check: the synthetic test owner made ready with the fixture photo, approved by the Super Admin, the site opens at `https://<slug>.sites.estateos.localhost`, Block hides it, Restore shows it again.
- Because revisions can't be deleted, the end-to-end check uses a **new synthetic agency** made only for this test, and that agency stays Live in the dev DB. The owner's real agency and the existing test owner are untouched.

## 8. Owner confirmations (approved 2026-10-22)

The owner confirmed:

- The dev public host `*.sites.estateos.localhost`, a separate `PUBLIC_API_KEY`, and the slug rules in section 1 Q2 (set at first Live, then fixed).
- Automatic first Live on Approve/Restore/saves plus 5-minute reconciliation; truthful "Going live" on failure.
- One identical "not available" page for Blocked, Deactivated, unknown and Not Live.
- No caching in 4a; Publish Updates after Live comes in 4b.
- A dedicated synthetic agency is created in the dev DB for the end-to-end check, and it stays there (revisions are append-only).
