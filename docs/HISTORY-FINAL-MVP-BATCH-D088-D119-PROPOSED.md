**HISTORICAL PROPOSAL ONLY.** All 32 options A explicitly approved on 2026-10-21. Refer to `docs/MVP-D088-CONFIRMED.md` … `docs/MVP-D119-CONFIRMED.md` and v5.9 map.

---

# EstateOS — Consolidated MVP Planning Approval Batch (D-088–D-119)

**ALL OPTIONS BELOW ARE PROPOSED ONLY. NONE are approved by this document.**

Based on EstateOS v5.8 confirmed through D-087, plus the Claude read-only Phase 0 review. This is a one-time batch for remaining *high-level MVP policy and implementation-contract choices*; it does not authorize coding. Existing D-001–D-087, zero-property readiness, first auto-go-live and later explicit Publish Updates remain authoritative.

Choose A/B/C for every decision; A is the suggested pilot default. Any option conflicting with an approved decision requires explicit supersession and should not be mechanically applied.

## Decisions

### Security, authentication & tenant access


#### D-088 — Session transport & CSRF
- **A (recommended):** Same-origin admin API proxy/BFF; host-only secure HttpOnly server sessions; CSRF tokens, strict Origin/Fetch Metadata; dedicated dev hostnames.
- **B:** Direct browser-to-backend cross-origin sessions with strict CORS + CSRF/Origin hardening.
- **C:** Separate managed authentication gateway; additional complexity.

#### D-089 — Tenant-isolation enforcement
- **A (recommended):** Server-derived agencyId and centralized tenant-scoped data access, deny-by-default + cross-tenant negative tests.
- **B:** Route middleware adds agencyId; rely on disciplined downstream queries.
- **C:** Database per agency (conflicts with approved shared DB D-076).

#### D-095 — First Super Admin account
- **A (recommended):** One-time audited CLI bootstrap with environment-provided secret; no public Super Admin signup.
- **B:** Manually insert privileged user in MongoDB.
- **C:** Add external invitation/auth provider first.

#### D-096 — Password recovery
- **A (recommended):** Support-assisted recovery after identity verification; short-lived single-use reset link/token, revoke sessions, no automated email dependency.
- **B:** Set up automated verified-email reset service for pilot.
- **C:** No recovery in pilot.

#### D-097 — Registration validation
- **A (recommended):** Validate approved 6 signup fields server-side; normalize unique email, strong password/contact formats; no verification gate.
- **B:** Validate only minimally; resolve duplicates manually.
- **C:** Require email verification before Pending (contradicts D-028).

#### D-098 — Session lifecycle
- **A (recommended):** Revocable per-portal server sessions; inactivity and absolute expiry; rate limiting; logout and reset revocation.
- **B:** Simple login-until-logout sessions with basic rate limit.
- **C:** JWT stored/managed in browser instead of approved server sessions.

#### D-118 — Super Admin creates agencies
- **A (recommended):** Owner-claimed account via one-time invitation/activation; owner sets own password, no public secrets.
- **B:** Super Admin sets temporary password and shares it manually.
- **C:** Remove admin-created agency path (conflicts D-028).

### Snapshots, publishing, status & privacy


#### D-090 — Live snapshot implementation
- **A (recommended):** Immutable versioned public snapshots with one atomic authoritative live-revision pointer.
- **B:** Update multiple live records inside one transaction.
- **C:** Primary queued eventual publishing with asynchronous reconciliation.

#### D-091 — First-live activation reliability
- **A (recommended):** Recheck on committed readiness/approval changes; idempotent activation plus reconciliation for stuck cases.
- **B:** Evaluate readiness on every public request.
- **C:** Manual Super Admin activation (conflicts D-029 automatic first Live).

#### D-092 — Review/action audit durability
- **A (recommended):** Append-only actor/time/agency/action/reason/outcome audit; privacy/retention safeguards.
- **B:** Generic application logs only.
- **C:** Full event-sourcing architecture.

#### D-099 — Public contact consent
- **A (recommended):** Owner explicitly chooses/confirms public Phone or WhatsApp during website setup; signup contact remains private until intentionally selected; D-085 maps to saved draft.
- **B:** Automatically expose signup Phone/WhatsApp on first activation.
- **C:** Maintain completely separate website contacts with no Profile mapping.

#### D-100 — Agency Profile saving
- **A (recommended):** Manual Save Profile for the page + Save/Discard/Stay guard; mapped values stage private website draft.
- **B:** Profile autosaves every edit.
- **C:** Manual Save without dirty-navigation protection.

#### D-101 — Private saved-draft Preview
- **A (recommended):** Authorized management-host preview backed by server checks; no public draft endpoint or shareable unsecured link.
- **B:** Short-lived signed preview link on public host with strict binding.
- **C:** Publicly reachable obscure/unlisted preview link.

#### D-102 — Review/restriction/website state model
- **A (recommended):** Separate review, restriction, readiness and publication state axes with explicit allowed transitions and conflict checks.
- **B:** One consolidated agency status enum.
- **C:** Independent loosely checked booleans.

#### D-107 — Concurrent publication & cache
- **A (recommended):** Optimistic revision/CAS on publish, idempotency keys, revisioned assets/cache, no partial public update.
- **B:** Last-write-wins publish.
- **C:** Long-lived exclusive edit locks.

#### D-119 — Failed automatic first-live activation
- **A (recommended):** Truthful Not Live/Activation Pending and retry/reconcile without creating an owner Publish gate.
- **B:** Require Super Admin manual retry for failures.
- **C:** Show Live immediately and repair errors later.

### Properties, media, design & pilot experience


#### D-103 — Property types/price rules
- **A (recommended):** Pilot property types House, Apartment, Plot, Shop, Office, Other; positive whole-number PKR; rent shown PKR/month; typed city/area.
- **B:** Allow arbitrary custom property types and flexible price units immediately.
- **C:** Free-text types and prices, minimal validation.

#### D-104 — Default property availability
- **A (recommended):** New property defaults Available in private saved record; status/archive updates remain private until eligible publication; first-live D-084 still applies.
- **B:** Require explicit status selection for every new record.
- **C:** Default new record Off Market/private as a new status.

#### D-105 — Photo storage model
- **A (recommended):** Managed object storage (S3-compatible or equivalent); private originals and derived public media; provider selected during implementation.
- **B:** Store uploaded photos on backend disk.
- **C:** Store images directly in MongoDB documents.

#### D-106 — Photo upload/save relationship
- **A (recommended):** Staged validated uploads; whole-property Save links successes; per-file failure recovery; clean orphaned temporary files; photos optional.
- **B:** Only upload images on Save Property.
- **C:** Autonomous media attachment without explicit Save relationship.

#### D-108 — Hero image readiness asset
- **A (recommended):** Curated properly licensed platform Hero default or owner upload; retain D-033 genuine Hero image readiness.
- **B:** Require owner upload every time, no licensed platform default.
- **C:** Allow generic gradient/no image to satisfy readiness (conflicts D-035/D-033).

#### D-109 — Responsive/routing baseline
- **A (recommended):** Tailwind standard breakpoints 640/768/1024/1280 and routes grouped under Overview, My Website, Agency Profile, Properties, Agencies; precise routes specified before coding each screen.
- **B:** Custom bespoke breakpoint grid and navigation scheme now.
- **C:** Leave all viewport thresholds and route structure undefined.

#### D-110 — Accessibility baseline
- **A (recommended):** Target WCAG 2.2 AA; keyboard/focus, semantic controls, contrast, responsive and error accessibility checks.
- **B:** Basic manual keyboard checks only.
- **C:** Target full WCAG AAA for entire pilot.

### Deployment, operations & implementation process


#### D-093 — Test/release acceptance gates
- **A (recommended):** Unit tests readiness/status; auth/tenant integration/negative tests; publication rollback/retry tests; four-app lint/typecheck/build smoke and pilot acceptance.
- **B:** Manual pilot QA only.
- **C:** Comprehensive full E2E suite for every path before first pilot.

#### D-094 — Four-app deployment topology
- **A (recommended):** Deploy three Next apps independently + protected API, managed MongoDB and media; separate staging/prod secrets; wildcard DNS/TLS before public launch.
- **B:** Merge all four apps into one deployment.
- **C:** Multiple microservices and distributed operational stack.

#### D-111 — Operational logs/audit privacy
- **A (recommended):** Structured redacted operational logs plus durable restricted audit; never record passwords/tokens; define explicit retention before production.
- **B:** Log everything indefinitely for troubleshooting.
- **C:** No operational logs or persistent audit (conflicts D-073).

#### D-112 — Database backup & restore
- **A (recommended):** Encrypted automated daily backup plus restore drill before real pilot launch, documented recovery owner.
- **B:** Weekly backups without restore verification.
- **C:** No dedicated backup planning.

#### D-113 — Pilot billing policy
- **A (recommended):** Invite-only pilot; billing/payment UI deferred, pricing determined after feedback.
- **B:** Manual subscription invoices during pilot.
- **C:** Implement recurring online payment gateway immediately.

#### D-114 — Release/pilot process
- **A (recommended):** Staging with synthetic data, smoke/UAT checklist and rollback plan, then limited 2–3-agency production pilot.
- **B:** Direct production releases with ad-hoc checks.
- **C:** Full enterprise CI/CD workflow before any pilot.

#### D-115 — API/data contract discipline
- **A (recommended):** Document versioned REST request/response/authorization/error contract per milestone before feature code; keep schemas implementation-scoped.
- **B:** Code endpoints first, document later.
- **C:** GraphQL-first API platform.

#### D-116 — Non-production test data
- **A (recommended):** Synthetic agencies/properties in dev and staging; never clone real client data without controlled consent/anonymization.
- **B:** Copy anonymized production data by default.
- **C:** No fixtures or seeded examples.

#### D-117 — Pilot privacy & user data handling
- **A (recommended):** Publish privacy notice, consent for public business contacts, controlled access/export/correction/deletion request workflow; review local obligations before launch.
- **B:** Defer privacy policy and requests until paid launch.
- **C:** Build a full automated compliance self-service portal.

## Unchanged confirmed invariants

- D-028 lean signup immediately Pending; manual review; no mandatory email/KYC gate.
- D-029/D-033 first website becomes Live automatically only after manual approval **and** genuine readiness, no initial owner Publish/Submit. Zero-property website is allowed.
- D-053/D-063/D-079 post-Live Publish Updates for eligible saved changes is deliberate, atomic and does not silently auto-publish property Save.
- D-072 pilot only Super Admin and Agency Owner roles; D-080 CRM deferred.
- D-074/D-081 host-isolated backend-validated server sessions, D-076 shared MongoDB with server-derived agencyId, D-078 public Available/non-Archived only, D-083 restricted site hidden.
- D-084 first Live includes saved eligible properties; D-085 Profile mapped contacts stage private draft; D-086 strip GPS/EXIF on display derivatives; D-087 safe retry.
- Four root npm-workspace apps: frontend/ 4000, admin/ 4001, super-admin/ 4002, backend/ 4003.

## Remaining details that cannot honestly be blanket-locked

Implementation still requires exact endpoint and database field contracts, state transition/role matrices, secrets/cookie/CSRF threat modeling, media provider and deployment DNS/TLS, legal/privacy review, authentic licensed assets, actual test/build evidence and provider credentials. These must be scoped and verified during feature milestones.

## Approval and source rules

Until the owner explicitly selects and confirms options, D-088–D-119 remain **PROPOSED**. A future confirmed bundle should preserve all v5.8 files and update canonical decision log, OPEN-QUESTIONS, README, all agent rule entry points and current AI handovers. Feature coding still requires a distinct owner-approved milestone scope.
