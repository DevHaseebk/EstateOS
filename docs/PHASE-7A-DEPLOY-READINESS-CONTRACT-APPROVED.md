# EstateOS — Phase 7a Deploy Readiness Contract (APPROVED)

**Status:** APPROVED by the owner in chat on 2026-10-22, as written, including the confirmations in section 5 (D-115). Drafted by Claude Code the same day.
**Builds on:** `docs/PHASE-7-STAGING-DEPLOYMENT-CONTRACT-PROPOSED.md` (Codex draft, the umbrella for staging and production). That draft lists the owner's account choices (domain, hosting, storage, CDN, backup provider). **Phase 7a is the part that needs no account**: the code and files that any staging or production setup will need. Provisioning and the first real deployment become **Phase 7b**, once the owner has made those choices.
**Decisions:** D-081, D-088, D-093, D-094, D-105, D-111, D-112, D-114, D-115, D-116.

## 0. Why this phase, and what the review found

A Claude review of the current code against the Codex draft found these deploy blockers. Each is real code, not a hosting choice:

1. **Media can only be stored on the local disk** (`backend/src/storage.ts`). A hosted backend needs an object-storage driver.
2. **Config silently falls back to development values.** Missing `OWNER_ORIGIN`, `SUPER_ADMIN_ORIGIN` or `PUBLIC_SITE_DOMAIN` become `*.estateos.localhost`; nothing stops a production start with dev defaults or short keys.
3. **Without `TRUSTED_CLIENT_IP_HEADER`, every visitor's IP is `unknown`.** The per-IP sign-in limit (20 per 15 minutes) then applies to **all owners together**, so one busy hour could lock everyone out. In production this setting must be mandatory.
4. **`/api/health` returns 200 even when the database is down**, so a host cannot tell a broken deployment from a working one.
5. **The public site uses `API_URL` while the BFFs use `BACKEND_INTERNAL_URL`.** Two names for one setting invite a misconfiguration.
6. **The reconciler and staged-media cleanup run in every backend process.** They are safe to repeat, but a second instance doubles the work and the logs.
7. **There is no backup tool.** D-112 needs an encrypted daily backup with a tested restore. MongoDB Atlas free clusters have no backups, so EstateOS needs its own.
8. **No CI and no environment templates.** Nothing runs the gates automatically, and nobody can see which settings each app needs.

## 1. Owner answers this contract is based on (approved 2026-10-22)

| # | Question | Recommended answer |
|---|---|---|
| 1 | Which storage driver? | One **S3-compatible** driver behind the existing `MediaStorage` interface: it works with Cloudflare R2, AWS S3, Backblaze B2 and MinIO, so the supplier choice stays open for 7b. Selected by `MEDIA_STORAGE=local` (default in development) or `s3`. The bucket stays **private**; images are still served only through the API's existing permission checks. New dependency: `@aws-sdk/client-s3`. |
| 2 | How strict is production config? | With `NODE_ENV=production` the backend **refuses to start** if any of these holds: `MONGODB_URI` is missing; a key is shorter than 32 characters, or two keys are equal; an origin or the public domain is a `localhost` value; `MEDIA_STORAGE` is not `s3`. The admin and Super Admin BFFs answer **503** in production when `TRUSTED_CLIENT_IP_HEADER` is not set. Error messages name the setting, never its value. |
| 3 | Health checks? | `/api/health` stays as it is (liveness, used by the dev scripts). A new **`/api/ready`** returns 200 `{ "status": "ready" }` only when the database is connected and storage answers, otherwise **503**. It is public, reveals nothing else and is not rate limited. |
| 4 | One backend URL name? | `BACKEND_INTERNAL_URL` everywhere. The public frontend still accepts `API_URL` as a fallback for one release, then drops it. |
| 5 | Background jobs? | `RUN_BACKGROUND_JOBS` (default `true`). Exactly one backend instance runs the reconciler and cleanup; extra instances set it to `false`. The pilot plans a single instance anyway. |
| 6 | Backups (D-112)? | Two backend scripts. **`npm run backup -w backend`** exports every collection as Extended JSON, gzips it and encrypts it with **AES-256-GCM** (`BACKUP_ENCRYPTION_KEY`, 32 bytes, kept outside Git and the database), then writes it to the media storage under a separate `backups/` prefix. **`npm run restore -w backend`** restores into a target database: it refuses a target that is the source or not empty, and checks the authentication tag before writing anything. Scheduling (daily), retention and key custody are 7b. Media objects rely on the storage provider's own durability; their backup policy is a 7b choice. |
| 7 | CI? | A GitHub Actions workflow on push and pull request to `master`: `npm ci`, typecheck, lint, build, backend tests. No secrets and no deployment step. |
| 8 | Templates and runbook? | A `.env.example` per app listing every setting with a comment and **no values**, plus `docs/DEPLOYMENT-RUNBOOK.md`: release, smoke checks, rollback, backup, restore drill and secret rotation. Provider-specific steps stay blank until 7b. |

## 2. Code and API changes

- `backend/src/storage.ts`: `S3Storage implements MediaStorage` (`put`/`get`/`delete`; path-style addressing; a missing object returns `null`); driver chosen once from `MEDIA_STORAGE`. Settings: `S3_ENDPOINT`, `S3_REGION` (default `auto`), `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`. Key validation is the same as the disk driver.
- `backend/src/config/env.ts`: `assertProductionConfig()` per §1 Q2, run before `listen`; plus `runBackgroundJobs`.
- `backend/src/app.ts`: `GET /api/ready` (§1 Q3), mounted beside `/api/health`, before the API guard.
- `backend/src/server.ts`: start the jobs only when `RUN_BACKGROUND_JOBS` is not `false`.
- `backend/src/cli/backup.ts` and `cli/restore.ts` (§1 Q6). File format: a small header (version, created time, collection names and counts, no secrets) plus the encrypted body. Restore checks the version and the authentication tag first.
- `frontend/app/lib/public-api.ts` and the image proxy read `BACKEND_INTERNAL_URL ?? API_URL`.
- Admin and Super Admin BFF: 503 `MISCONFIGURED` in production without `TRUSTED_CLIENT_IP_HEADER`.
- New files: `.github/workflows/ci.yml`; `backend/.env.example`, `admin/.env.example`, `super-admin/.env.example`, `frontend/.env.example`; `docs/DEPLOYMENT-RUNBOOK.md`.
- **No change** to any business route, permission, publication rule or the 5-minute public image cache.

## 3. Acceptance tests (D-093)

1. **Storage driver contract:** the same test suite runs against the disk driver and the S3 driver. The S3 run uses an in-process fake S3 HTTP server (no account, no new test dependency): put, get, overwrite, a missing key gives `null`, delete, invalid keys refused. The full media test file also passes with `MEDIA_STORAGE=s3` against the fake.
2. **Production config:** each bad setting in §1 Q2 stops startup with a message naming the setting and not its value; a complete synthetic production config passes; development is unaffected.
3. **Ready check:** 200 with a connected database; 503 when it is disconnected; `/api/health` is unchanged.
4. **Jobs flag:** with `RUN_BACKGROUND_JOBS=false` no timers start.
5. **Backup and restore round-trip** on an in-memory database with synthetic agencies, users, drafts, revisions, properties, media records and audit: backup → restore into an empty database → identical documents and indexes; the append-only audit is preserved; a wrong key, a changed byte, a non-empty target or the source as target are all refused before any write.
6. **BFF:** in production without `TRUSTED_CLIENT_IP_HEADER` → 503; with it, the configured header is forwarded and any incoming `x-client-ip` is ignored.
7. **CI:** the workflow file is valid; the gates it runs pass locally with the same commands.

**Gates:** typecheck, lint and build, plus `npm test -w backend`; a local HTTPS check that the dev setup still works with `MEDIA_STORAGE=local`; one manual backup → restore into a scratch local database (synthetic data only).

## 4. Out of scope (Phase 7b, after the owner's choices)

The domain, DNS and wildcard TLS; hosting for the three Next.js apps and the API; creating the bucket, the database users and the secrets; the CDN decision; the daily backup schedule, retention and key custody; monitoring and alerts; the first staging deployment and its UAT; D-117 privacy text. To help those choices, Claude's pilot-sized suggestion is: **one small VPS running Docker Compose with Caddy** (the same layout as local development, wildcard TLS through a DNS challenge), the existing **MongoDB Atlas** cluster with a separate staging database, **Cloudflare R2** for media and backups, and **no CDN** at first. These are suggestions for 7b only, not part of this approval.

## 5. Owner confirmations (approved 2026-10-22)

The owner confirmed:

- An S3-compatible storage driver (new dependency `@aws-sdk/client-s3`); the supplier is chosen in 7b.
- Production refuses to start with development defaults, and the BFFs refuse to run without a trusted client-IP header.
- EstateOS's own encrypted backup and restore scripts; the schedule and key custody are decided in 7b.
- A GitHub Actions CI workflow on this repository (gates only, no deployment, no secrets).
