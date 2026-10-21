# HISTORICAL / RESOLVED — D-074 through D-080 ALL CONFIRMED Option A in v5.7

The A/B/C alternatives below are retained as **planning history**, NOT outstanding choices. Owner explicitly approved **Option A separately for each D-074–D-080** on 2026-10-21. Use `docs/IMPLEMENTATION-READINESS-D074-CONFIRMED.md` through `docs/IMPLEMENTATION-READINESS-D080-CONFIRMED.md` for current authority. New pending batch is `docs/IMPLEMENTATION-READINESS-BATCH-D081-D087-PROPOSAL.md`. Do not interpret prior **"UNAPPROVED"** text below as applying to D-074–D-080 now.

# D-074 through D-080 — NEXT FAST-TRACK BATCH PROPOSAL ONLY (Implementation Readiness)

**Status: ALL SEVEN UNAPPROVED.** Each A/B/C recommendation below is a **proposal**, not owner authorization to build it. Choices can be approved together in one message. These are architectural/product POLICY choices, not exhaustive technical specifications, API contracts or feature coding permission. D-067 through D-073 are already CONFIRMED separately in v5.6.

## D-074 — Authentication and session strategy

**A (recommended):** Browser-centric secure server-managed sessions via HttpOnly/Secure cookies with backend session validation. CSRF protection, SameSite behavior, expiration, password reset, logout-all, login rate limits and store choice OPEN; password auth must not require verified email as an onboarding KYC gate.

**B:** Short-lived access tokens and rotating refresh tokens; server enforces token integrity and revocation. More complexity in token storage/rotation, especially across separate apps.

**C:** Managed authentication provider for Owner and Super Admin, with custom tenancy/roles enforcement remaining server-side. Costs and vendor dependence must be evaluated.

Do not confuse role strategy D-072 with a selected auth protocol. Tenant safety and secure auth required under all options.

## D-075 — Public agency website addressing for pilot

**A (recommended):** One multi-tenant `frontend/` serving agency **platform-managed subdomains** (`agency.<platform-domain>`) in pilot; custom domains future/deferred. Exact domain purchase, wildcard DNS, tenant slug collision/reserved names, TLS and preview routing OPEN.

**B:** Single public frontend hostname with agency site under **path prefixes** (`<platform-domain>/agency/<slug>`). Simpler wildcard handling, different branding.

**C:** Custom agency-owned domains in first pilot as a primary path, with subdomain fallback. More verification/DNS/SSL/support burden.

No user-selected domain is automatically safe or authorized to access another agency's private data.

## D-076 — Multi-tenant data storage boundary

**A (recommended):** One MongoDB database with tenant-scoped shared collections. Every tenant-owned record keyed/scoped to trusted `agencyId` and every read/write server-authorized; use appropriate compound indexes, tests and unique constraints. **No client-supplied agencyId may override trusted identity.**

**B:** Separate MongoDB database per tenant with isolation enforced in routing and credentials.

**C:** Separate collections per tenant in one database with isolation enforced in queries and naming.

All approaches REQUIRE secure server authorization; choosing a storage topology alone does not approve auth implementation or schema fields.

## D-077 — Automatic first-live readiness reevaluation

**A (recommended):** On **successfully persisted** changes relevant to D-033 readiness or agency approval, automatically reevaluate both conditions and, if satisfied, perform first Live activation. Ensure retry/reconciliation for missed events; exact contract OPEN. No owner initial Publish/Submit and zero properties valid.

**B:** A background scheduled readiness reconciler automatically detects and activates eligible approved websites with a small unspecified delay. No manual gate.

**C:** Dedicated readiness/event pipeline automatically drives website activation with explicit durable workflow state. More operational complexity.

ALL options must preserve D-029 automatic activation after both gates; a manually triggered initial activation is NOT an allowed choice.

## D-078 — Public property visibility and business statuses

**A (recommended):** In public website published snapshots, show only **Available and not Archived** properties; Sold/Rented and Archived entries omitted from public listings. On already-Live sites changes take effect only after successful D-063 Publish Updates. First-ever snapshot inclusion/owner draft selection and any edge-case migration OPEN unless separately settled.

**B:** Show Available plus **Sold/Rented with clear labels** in published snapshots; Archived hidden. Post-live changes still need Publish Updates.

**C:** Public portfolio may show Available, Sold/Rented and explicitly labeled Archived as history; protect against misleading active availability. Post-live changes still need Publish Updates.

No option permits bypassing the confirmed private Save/Publish Updates boundary. Exact status enums/transitions, restored-record eligibility and filters remain OPEN.

## D-079 — All-or-nothing Publish Updates boundary

**A (recommended):** A successful Publish Updates creates one consistent **atomic public snapshot/revision** including validated eligible saved website section/theme/property changes. On validation/publish failure, keep old public revision intact, display error and allow safe retry; exact implementation (data model, transaction/versions/rollback/cache invalidation) OPEN. First site Live still automatic D-029.

**B:** Allow different content units to publish independently within one owner Publish Updates action; partial completion must be clearly reported. Harder to maintain coherent public consistency.

**C:** Queue publication units asynchronously behind a single owner action, with visible pending/success states and defined compensation on partial failure; more orchestration.

No user-facing success before actual durable publication; availability and authorization are mandatory.

## D-080 — CRM and inquiry management in initial pilot

**A (recommended):** **Defer internal CRM/Inquiries inbox and pipeline** for 2–3 agency pilot; keep approved public contact/WhatsApp CTA functionality, with actual contact presentation/source validation still TBD. Avoid claiming messages are stored as leads.

**B:** Add **basic inquiry capture/inbox only** (no lead pipeline), with privacy/anti-spam/notification needs separately specified.

**C:** Build starter CRM with statuses, assignments/follow-ups and inbox for pilot; largest scope.

No option authorizes spam/unsolicited marketing or inventing contact data. Pilot billing/pricing and advanced CRM remain independent scope items.

## Cross-batch boundaries, unresolved technical details

- Choices A/B/C must be explicit for **each D-074…D-080**. The recommended A set is not confirmed until owner approves. The user may override any choice.
- D-067–D-073 confirmed UX/business scope remains fixed; D-022 mandatory review reasons, D-028 lean Pending signup/no KYC proof gate, D-029/D-033 automatic first Live, D-053/D-063 post-live explicit Publish Updates, and Phase 0 apps/ports unchanged.
- Detailed permissions, password policy/reset, session storage, tenant middleware tests, persisted schema/API, DNS/cert operations, media security, profile public sync, exact public property publishing/status handling, transaction/cache rollback, audit schema, accessibility, copy/routes/breakpoints, billing, CI/QA/deploy remain OPEN unless explicitly approved in future decisions.
- If a proposed option conflicts with a prior invariant, prior CONFIRMED invariant wins and the conflict must be raised. Product-feature implementation is NOT authorized by policy-choice approval.
