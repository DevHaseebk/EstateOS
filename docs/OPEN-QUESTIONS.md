# EstateOS — Remaining Open Implementation Contracts (v5.9)

**All D-088–D-119 Option A are confirmed planning policies.** No new broad A/B/C approval batch is awaiting the owner. The following are NOT automatically approved by these decisions and must be specified with the relevant milestone before code/launch.

## Phase 1 auth and tenant foundation — design gate first

- Exact host/dev domain topology (localhost port cookie collision), BFF proxy shape/trust, `__Host-` feasibility, cookie path/domain/SameSite/Secure dev strategy, CSRF token issuance/validation and Origin/Fetch-Metadata behavior.
- Session store, session expiry durations, credential hashing library/config, input validators, rate-limit thresholds, password policy, errors and login/logout/reset authentication contract.
- Super Admin bootstrap one-use safeguards, owner invitation channel and identity-confirmed support reset protocols with audit controls.
- Exact `Agency`, `User`, `Session` fields/indexes and versioned auth/tenant API contracts; explicit permissions/access checks, tenant isolation helper/repository policy, negative tests.
- Git/runtime state and dependency checks from actual developer repo (not included in planning ZIP); user reports root remote push, Codex/Claude skills tasks assigned, completion not verified.

## Subsequent milestones

- Full review/restriction/status transition authorization matrix, audit reason validation and user-facing notifications/errors.
- Privacy-consented public contact selection UX and Profile mapping/default behavior, first activation concurrency and reconciliation cadence.
- Authorized management-host private preview renderer reuse and route permissions.
- Actual immutable snapshot records, concurrency rules, status labels, CDN/cache revision mapping and retries/recovery.
- Pilot property type/area/price field validators and sizes; photo staging upload endpoints, signed URLs, object provider, EXIF stripping verification and orphan cleanup.
- Hero default actual license/provenance and safe selection, theme accessibility color contrast, final routes/labels, responsive component tests.
- Production domain DNS/wildcard TLS, providers and keys, backups retention/restore drill, legal/privacy review, security threat model, staging UAT, rollout/rollback and monitoring.

## Not approved for MVP

- CRM/inquiry inbox/pipeline and billing UI (D-080/D-113 deferred).
- Third-party enterprise auth or extra role hierarchy (D-072 two roles).
- Mandatory email/KYC verification as signup gate (D-028).
- Owner initial website Publish/Submit for first activation (D-029).

## History

Earlier v5.8 OPEN-QUESTIONS text preserved verbatim at `docs/AI/HISTORY-v5.8-docs-OPEN-QUESTIONS.md` but its D-088–D-119 statuses are superseded by this current file.
