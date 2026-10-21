# EstateOS — v5.9 MVP Decisions CONFIRMED Map

**CURRENT SOURCE OF TRUTH — 2026-10-21.** Product owner explicitly approved **ALL 32 D-088–D-119 Option A** as MVP planning policy. These supplement all prior confirmed D-001–D-087 at the level those decisions were approved. This file plus individual D088–D119 canonical specs overrides older `PROPOSED` and stale banners. No application business features are automatically authorized.

## New locked decisions

| Decision | CONFIRMED owner-approved policy | Canonical spec |
|---|---|---|
| **D-088** | Option A — Same-origin management API proxy/BFF with protected server sessions | [`docs/MVP-D088-CONFIRMED.md`](MVP-D088-CONFIRMED.md) |
| **D-089** | Option A — Server-enforced agency scope with denial tests | [`docs/MVP-D089-CONFIRMED.md`](MVP-D089-CONFIRMED.md) |
| **D-090** | Option A — Immutable versioned public snapshots and atomic pointer | [`docs/MVP-D090-CONFIRMED.md`](MVP-D090-CONFIRMED.md) |
| **D-091** | Option A — Idempotent committed-change first activation with reconciliation | [`docs/MVP-D091-CONFIRMED.md`](MVP-D091-CONFIRMED.md) |
| **D-092** | Option A — Append-only critical review and action audit records | [`docs/MVP-D092-CONFIRMED.md`](MVP-D092-CONFIRMED.md) |
| **D-093** | Option A — Minimum automated QA gates | [`docs/MVP-D093-CONFIRMED.md`](MVP-D093-CONFIRMED.md) |
| **D-094** | Option A — Three independent Next.js deployments plus protected API | [`docs/MVP-D094-CONFIRMED.md`](MVP-D094-CONFIRMED.md) |
| **D-095** | Option A — One-time audited first-Super-Admin CLI bootstrap | [`docs/MVP-D095-CONFIRMED.md`](MVP-D095-CONFIRMED.md) |
| **D-096** | Option A — Identity-verified support-assisted account recovery | [`docs/MVP-D096-CONFIRMED.md`](MVP-D096-CONFIRMED.md) |
| **D-097** | Option A — Validate six lean signup fields with no verification gate | [`docs/MVP-D097-CONFIRMED.md`](MVP-D097-CONFIRMED.md) |
| **D-098** | Option A — Revocable limited-lifetime management sessions | [`docs/MVP-D098-CONFIRMED.md`](MVP-D098-CONFIRMED.md) |
| **D-099** | Option A — Owner expressly selects public Phone or WhatsApp | [`docs/MVP-D099-CONFIRMED.md`](MVP-D099-CONFIRMED.md) |
| **D-100** | Option A — One manual Save Profile with dirty-navigation guard | [`docs/MVP-D100-CONFIRMED.md`](MVP-D100-CONFIRMED.md) |
| **D-101** | Option A — Authenticated management-host private website preview | [`docs/MVP-D101-CONFIRMED.md`](MVP-D101-CONFIRMED.md) |
| **D-102** | Option A — Separate review, restriction, readiness and publication axes | [`docs/MVP-D102-CONFIRMED.md`](MVP-D102-CONFIRMED.md) |
| **D-103** | Option A — Standard pilot property types and positive PKR prices | [`docs/MVP-D103-CONFIRMED.md`](MVP-D103-CONFIRMED.md) |
| **D-104** | Option A — Available default on new private saved property | [`docs/MVP-D104-CONFIRMED.md`](MVP-D104-CONFIRMED.md) |
| **D-105** | Option A — Managed object storage, private originals, public safe derivatives | [`docs/MVP-D105-CONFIRMED.md`](MVP-D105-CONFIRMED.md) |
| **D-106** | Option A — Staged validation/upload linked by explicit Property Save | [`docs/MVP-D106-CONFIRMED.md`](MVP-D106-CONFIRMED.md) |
| **D-107** | Option A — Optimistic revision and cache-safe atomic publication | [`docs/MVP-D107-CONFIRMED.md`](MVP-D107-CONFIRMED.md) |
| **D-108** | Option A — Genuine licensed default or uploaded Hero image | [`docs/MVP-D108-CONFIRMED.md`](MVP-D108-CONFIRMED.md) |
| **D-109** | Option A — Tailwind standard responsive breakpoints and grouped routes | [`docs/MVP-D109-CONFIRMED.md`](MVP-D109-CONFIRMED.md) |
| **D-110** | Option A — WCAG 2.2 AA accessibility target | [`docs/MVP-D110-CONFIRMED.md`](MVP-D110-CONFIRMED.md) |
| **D-111** | Option A — Redacted structured operational logs and restricted audit | [`docs/MVP-D111-CONFIRMED.md`](MVP-D111-CONFIRMED.md) |
| **D-112** | Option A — Encrypted daily backup and tested restore | [`docs/MVP-D112-CONFIRMED.md`](MVP-D112-CONFIRMED.md) |
| **D-113** | Option A — Free curated pilot; billing deferred | [`docs/MVP-D113-CONFIRMED.md`](MVP-D113-CONFIRMED.md) |
| **D-114** | Option A — Staging, smoke/UAT and rollback before limited launch | [`docs/MVP-D114-CONFIRMED.md`](MVP-D114-CONFIRMED.md) |
| **D-115** | Option A — Document versioned REST feature contracts before coding each feature | [`docs/MVP-D115-CONFIRMED.md`](MVP-D115-CONFIRMED.md) |
| **D-116** | Option A — Synthetic fixtures for development and staging | [`docs/MVP-D116-CONFIRMED.md`](MVP-D116-CONFIRMED.md) |
| **D-117** | Option A — Pilot privacy notice, contact consent and controlled requests | [`docs/MVP-D117-CONFIRMED.md`](MVP-D117-CONFIRMED.md) |
| **D-118** | Option A — Secure one-time invitation for admin-created agency owner | [`docs/MVP-D118-CONFIRMED.md`](MVP-D118-CONFIRMED.md) |
| **D-119** | Option A — Truthful first-activation failure with automatic recovery | [`docs/MVP-D119-CONFIRMED.md`](MVP-D119-CONFIRMED.md) |

## Guardrails/invariants

- **D-028:** both self-service and Super Admin agency creation remain available. Six-field valid owner signup immediately Pending, manual review; no mandatory KYC/email verification or business proof. The free curated pilot (D-113) is not a new verification/signup gate.
- **D-022/D-064–D-073:** Super Admin manually reviews, reason required for Request Changes/Reject and for approved restriction actions; review status, restrictions, readiness and publication are distinct.
- **D-029/D-033/D-077/D-084/D-091/D-099/D-119:** FIRST website goes public automatically only on approved + genuine ready; owner must intentionally select a public Phone OR WhatsApp contact, but no owner initial Submit/Publish/approval gate; zero properties valid; eligible saved Available/non-Archived properties may appear on initial Live revision. Failed activation never presents false Live.
- **D-053/D-063/D-079/D-085/D-087/D-090/D-107:** already-Live site saved sections/theme/eligible properties and mapped Profile changes remain PRIVATE until existing owner Publish Updates successfully produces a full immutable atomic revision; prior Live preserved on failures.
- **D-074/D-081/D-088/D-098:** backend sessions, appropriately host-scoped HttpOnly/Secure cookies per management portal, same-origin management API facade, state-changing CSRF/Origin checks. Cookie isolation is not achieved with different localhost PORTS alone; deployment/dev host plan remains to be contracted.
- **D-076/D-089:** shared MongoDB with authenticated/trusted server-derived agencyId in every tenant-owned access; require negative tests.
- **D-078/D-083/D-104:** public properties Available and non-Archived only, and Blocked/Deactivated agencies nonpublic.
- **D-080/D-113:** CRM and billing deferred for free curated 2–3 agency pilot; contact/WhatsApp CTAs remain.
- **Phase 0:** one root Git/nmp workspaces repository, frontend/ 4000, admin/ 4001, super-admin/ 4002, backend/ 4003. Git already initialized/pushed per owner report; do not reinitialize or push. Codex/Claude setup task completion and build results have not been independently verified here.

## Intentional policy interfaces requiring careful implementation

1. **D-099 vs D-085/D-033:** internal signup contact must not become public by default; owner choice of public contact is website setup and readiness data, not a new signup/KYC or first-launch Publish gate.
2. **D-113 vs D-028:** invited pilot participants does not disable available self-service Pending signup or admin-created agency flow.
3. **D-088 vs prior D-088 proposal:** older option labels differ; only the explicitly selected current Option A (same-origin management facade + secure cookies + CSRF/Origin) is locked.
4. **D-096/D-118 vs D-073:** secure reset/activation token delivery must be explicitly contracted without presuming automated transactional email.
5. **D-090 vs D-083:** published revision immutability and public-access suppression for restricted agency are separate; restriction can hide already-published content without rewriting snapshot.

## Coding scope

Planning is policy-complete for broad MVP boundaries, **not** implementation-contract-complete or production launch approved. See `docs/AI/PHASE-1-AUTH-TENANT-CODEX-PROMPT.md` for an approval-gated contract-first Phase 1 request; exact providers, route payloads/schemas, security threats, legal requirements, deployment, accessible UX and test acceptance need actual review.
