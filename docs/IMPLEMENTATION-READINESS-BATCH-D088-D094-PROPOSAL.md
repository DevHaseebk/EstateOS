# HISTORICAL PROPOSAL ONLY — D-088–D-094 (superseded by v5.9 owner approvals)

**Do not use these old option letters as active requirements.** The selected D-088 through D-094 Option A now have canonical `docs/MVP-D088-CONFIRMED.md` ... `docs/MVP-D094-CONFIRMED.md`, and the old proposal used different wording for D-088. Retained below for provenance.

---

# D-088–D-094 — NEXT BUILD-CONTRACT BATCH (PROPOSED ONLY)

**NOT APPROVED.** This batch is deliberately implementation-facing. Product/architecture decisions D-001–D-087 preserve precedence; never equate reviewing these options with permission to code. Review product repo/Phase 0 status before requesting feature implementation.

## D-088 — Session transport / CSRF contract
- **A recommended:** backend server sessions plus explicit CSRF protection for state mutations, host-scoped cookies, central authorization policy and designed cross-origin dev boundary; exact tokens/header/CORS configuration to specify after reviewing deployment topology.
- **B:** strict same-site API gateway/BFF so browser only same-origin backend interactions; CSRF requirements still assessed.
- **C:** dedicated auth gateway as separate module/service for pilot (higher operations overhead).

## D-089 — Central multi-tenant backend query protection
- **A recommended:** require authenticated context and an explicit authorized tenant query scope at repository/service boundaries, negative cross-tenant tests for every CRUD path; no public unvalidated `agencyId` override.
- **B:** route middleware injects `agencyId`, service discipline relies on developer review (weaker defense in depth).
- **C:** database-per-tenant approach (would conflict with D-076 without superseding approval; not suitable as a casual choice).

## D-090 — Atomic draft/live snapshot implementation contract
- **A recommended:** immutable numbered snapshots + one authoritative live revision pointer updated atomically, with idempotent retry and cache-safe revision URLs.
- **B:** mutate multiple live documents in transaction; all-or-nothing guaranteed only if storage/CDN alignment properly designed.
- **C:** queue publish and reconcile in background as primary path; availability tradeoffs need approval.

## D-091 — Readiness / activation consistency
- **A recommended:** evaluate after committed approved/readiness-relevant mutations with idempotent first-live transition; periodically reconcile stuck transitions (monitoring detail still open).
- **B:** evaluate on each public read (risk extra workload/inconsistent snapshots).
- **C:** manual Super Admin reactivation (must NOT introduce initial owner Publish and conflicts with automatic D-029 unless specially designed).

## D-092 — Audit event durability
- **A recommended:** append-only, actor/time/agency/action/reason/outcome audit records for review and restriction actions; tenant privacy and retention policy remains open.
- **B:** generic event log in existing application logs only, hard to audit later.
- **C:** full business-event sourcing from day one (overscope for pilot).

## D-093 — Minimal test/release gates
- **A recommended:** basic unit tests for readiness/status logic; auth/tenant isolation API integration tests; publish snapshot failure/retry tests; Next.js smoke builds and structured pilot acceptance checklist.
- **B:** manual pilot QA only, automate later (higher regression risk).
- **C:** exhaustive end-to-end suite for all flows before small pilot (high setup burden).

## D-094 — Deployment shape for 4 workspaces
- **A recommended:** three separately deployed Next.js apps with one protected backend and managed MongoDB/media storage; preview/staging/production secrets isolation, wildcard DNS/TLS planning.
- **B:** single combined deployment for all roles and public site (would require reconciling owner-confirmed four apps).
- **C:** multiple service/microservice production topology (likely unnecessary).

## Never infer from proposals

Exact endpoint/schema/permission code, cookie/CSRF choice, provider, tests, dates, operational cost, DNS/TLS, stage domains and production rollout require separate grounded design and explicit owner approval. Business feature coding is NOT approved by this proposal. D-081–D-087 are confirmed; see `docs/IMPLEMENTATION-READINESS-v5.8-CONFIRMED-MAP.md`.
