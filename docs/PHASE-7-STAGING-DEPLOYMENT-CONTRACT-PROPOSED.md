# EstateOS — Phase 7 Staging and Deployment Contract (PROPOSED)

**Status:** Proposal for owner review, 2026-10-22. This is not an approved D-115 implementation contract or permission to provision services, deploy, or launch a real-user pilot.

**Decisions:** D-075, D-081, D-088/D-089, D-093/D-094, D-105, D-107, D-111/D-112, D-114–D-117. Existing approved Phase 1–6b contracts continue to control application behavior.

## 1. Outcome and boundary

Prepare an isolated staging environment that can exercise the current EstateOS pilot end to end with synthetic data, then define the exact production release, backup, restore and rollback gates for a limited 2–3 agency pilot. Keep the five existing npm workspaces and local ports 4000–4003. No CRM, billing, additional roles, custom agency domains or new public product features are in this phase.

Production launch is a separate decision after staging evidence, operational ownership and D-117 privacy/legal work are complete. This proposal does not select a hosting company, object-storage supplier, domain, CDN, CI/CD service or backup provider.

## 2. Deployment topology to contract

| Component | Staging | Production |
| --- | --- | --- |
| Public website | One `frontend/` Next.js deployment serving tenant subdomains of a staging platform domain | One independent `frontend/` deployment serving tenant subdomains of the selected production platform domain |
| Agency Admin | Separate `admin/` Next.js deployment on its own HTTPS host | Separate `admin/` deployment on its own HTTPS host |
| Super Admin | Separate `super-admin/` Next.js deployment on its own HTTPS host | Separate `super-admin/` deployment on its own HTTPS host |
| API | `backend/` reachable only from authorized application services and operational access | Separately protected `backend/`; management and public keys remain distinct |
| Data and media | Dedicated managed MongoDB database/credentials and media namespace with synthetic records only | Separate managed MongoDB database/credentials and media namespace |

The chosen ingress must present the original `Host` accurately to the public frontend, terminate valid HTTPS on all management hosts and wildcard public subdomains, and reject unexpected hosts. The management BFFs must receive client IP only from a header that the ingress overwrites; untrusted incoming copies must be stripped. The exact `TRUSTED_CLIENT_IP_HEADER` and trusted proxy arrangement must be recorded before enabling production mode. Backend access must be network restricted; never expose `INTERNAL_API_KEY`, `PUBLIC_API_KEY`, session secrets or object credentials to browser code.

Each environment gets separate `MONGODB_URI`, `INTERNAL_API_KEY`, `PUBLIC_API_KEY`, `CSRF_SIGNING_KEY`, `OWNER_ORIGIN`, `SUPER_ADMIN_ORIGIN`, `PUBLIC_SITE_DOMAIN`, `BACKEND_INTERNAL_URL` and storage credentials. Document secret owner, rotation and revocation in the deployment runbook without placing values in Git. Keep the host-only `__Host-` management cookies, exact Origin/CSRF checks and server-derived agency scope; no shared admin cookie on public tenant hosts.

## 3. Media and cache migration

`backend/src/storage.ts` currently supplies only `LocalDiskStorage` under `.media-dev`. Implement a managed object-storage adapter behind `MediaStorage` after supplier and access model are approved. Keep private originals inaccessible by public URL. Continue server authorization for WebP derivatives: a public image is available only while it belongs to the current Live revision of an unrestricted agency; owner/Super Admin image routes keep their existing permissions. Preserve staged-upload expiry and verify deletion/retry behavior against the chosen storage service. Staging receives synthetic images and no copy of dev or production private media.

Until a tested invalidation path exists, retain `Cache-Control: public, max-age=300` for public images and `no-store` for public site JSON. If a CDN is selected, its effective TTL must be no greater than five minutes at this gate. A future longer TTL needs a separate approved purge design and tests for Block, Deactivate, photo removal and Publish Updates. Browser caches cannot be recalled after delivery, so the five-minute exposure bound must be stated in the pilot operations notes.

## 4. Release and recovery procedure

1. Build an immutable release from a recorded Git commit. Run root typecheck, lint, build and backend tests; publish only artifacts that passed. Record exact commands and results.
2. Deploy that release to staging with dedicated secrets and synthetic fixtures. Verify database transactions, upload/read/cleanup, tenant routing, both management hosts, and HTTPS certificates.
3. Run the smoke/UAT list below and record results, operator, time and release ID. Any blocking failure stops production promotion.
4. Before pilot production, enable automated encrypted daily DB backups, name the recovery operator and successfully restore a backup into an isolated environment. Record the restore result and the approved retention, key custody, RPO/RTO and drill cadence.
5. Record a production rollout window, change owner, monitoring/alert route, and rollback decision maker. Promote the tested release; run the smoke checks again against permitted synthetic production checks without modifying real agency records.
6. On a bad release, revert application artifacts to the last compatible version or roll forward with a fix. Database/schema changes must be backward compatible across that window; a DB restore is a separately approved recovery action because it can discard newer writes. Preserve existing Live revision pointers and audit history on an application rollback.

An `/api/health` response with `database: disconnected` is not a healthy deployment. Readiness checks must distinguish a reachable process from usable DB-backed application behavior. Operational logs must be structured, access controlled and redacted per D-111; configure alerts for failed deployment, DB disconnect, publication/reconciler failure, failed media storage, backup failure and restore drill failure. Retention, access matrix and alert destination remain owner decisions.

## 5. Staging acceptance evidence

- TLS/host test: valid admin, control and tenant hosts route correctly; bare/foreign/malformed public hosts do not reveal a tenant; management cookies stay host scoped; untrusted forwarded-IP headers are ignored.
- Auth/tenant test: Pending signup, invitation claim, portal isolation, CSRF/Origin rejection, cross-tenant denial, restriction access and session revocation work through the deployed ingress.
- Publication test: an approved, genuinely ready zero-property agency goes Live automatically; an already-Live draft stays private until one successful Publish Updates; retry and failed publish keep the prior Live revision.
- Restriction/cache test: Block/Deactivate makes the site and fresh media requests non-public; removed/hidden photos fail after Publish; response and any CDN TTL stay within the approved five-minute bound.
- Media test: real synthetic upload is processed, metadata stripped, private original cannot be fetched publicly, authorized derivative works, and staged cleanup succeeds.
- Operations test: backup job is observed and an encrypted backup is restored successfully in isolation; release rollback or safe roll-forward is rehearsed with audit and Live pointers intact.
- Browser UAT: desktop/mobile Agency Admin, Super Admin and public site flows on staging, including the Phase 6b status wording, are reviewed by the owner or named pilot reviewer.

The same codebase's current local Phase 6b checks (five-workspace typecheck/lint/build and 142 backend tests) are baseline evidence only. They do not prove staging ingress, object storage, backup, CDN, monitoring or production behavior.

## 6. Owner choices required before implementation or provisioning

1. Staging and production platform domains, management hostnames, DNS control and wildcard TLS owner.
2. Hosting/ingress provider and account access for three Next.js deployments plus the protected API; CI/CD method and who can promote/rollback.
3. Managed MongoDB environments, managed object-storage supplier, private bucket/namespace layout, access method and retention/deletion policy. Cloudflare R2 appears as a recommendation in older implementation notes, not as an approved selection.
4. CDN choice or explicit no-CDN pilot mode. Longer public-image caching is outside this proposal until purge behavior is contracted and verified.
5. Backup provider, retention, encryption-key custody, RPO/RTO, restore-drill cadence and named recovery operator.
6. Logging/alert provider, access matrix, retention, on-call recipient and release/rollback owner.
7. D-117 privacy notice text, request channel, retention/deletion handling and qualified legal review before any real-user pilot.

After these answers, turn this proposal into an owner-reviewed Phase 7 implementation contract with exact environment values (excluding secrets), architecture/secret flow, failure/error behavior, test commands and rollout steps. Any new REST endpoint or changed auth/tenant/error shape needs its own versioned D-115 contract before code. Do not treat this draft as launch approval.
