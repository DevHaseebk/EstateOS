> **v5.8 RESOLVED / HISTORICAL (2026-10-21):** User approved ALL seven D-081 through D-087 Option A. Read individual `docs/IMPLEMENTATION-READINESS-D081-CONFIRMED.md` through `D087-CONFIRMED.md` and v5.8 map. The original UNAPPROVED wording below is archival, NOT CURRENT.

---

# D-081 through D-087 — NEXT IMPLEMENTATION-READINESS BATCH (PROPOSED ONLY)

**ALL SEVEN UNAPPROVED as of 2026-10-21.** Choose A/B/C independently. Even seven Option A recommendations are NOT owner authorization until explicitly selected. These are pilot product/security and workflow policies, not build permission or final schemas/APIs. Do not silently change D-074–D-080.

## D-081 — Session separation between public site, Agency Admin and Super Admin

- **A (recommended):** Dedicated role/portal session contexts; restrict management-session cookies to the appropriate admin host/session boundary; backend validates each request and role/tenant. No broad `.platform-domain` cookie shared with public agency subdomains as a convenience. Exact SameSite, CSRF, auth-proxy/BFF, cookie domain and API deployment choices remain OPEN.
- **B:** Shared authenticated cookie scope across all management subdomains with strict backend roles. Greater risk of unnecessary cookie exposure; must justify security controls.
- **C:** Unified SSO through a separate centralized identity host with cross-portal delegation. Additional complexity, role/tenant enforcement still server side.

## D-082 — Public subdomain slug changes in pilot

- **A (recommended):** After a public subdomain is allocated, keep it fixed during pilot; Super Admin corrections handled explicitly as exceptional operations. Prevent broken public links and cross-tenant collisions. Exact assignment, naming/length/reserved words and exceptional rename controls remain OPEN.
- **B:** Agency Owner may change slug with protected redirects and collision checks.
- **C:** Super Admin may routinely change slug and manage redirects.

## D-083 — Public website access when agency is Blocked or Deactivated

- **A (recommended):** Both Blocked and Deactivated agencies become non-public while their business restriction holds; reversible restore can make previously ready/approved site accessible again subject to authorized status/readiness checks. Keep admin auth/session consequences separate and OPEN.
- **B:** Blocked non-public; Deactivated public read-only while agency management paused.
- **C:** Public sites remain visible for both restrictions, only management controls disabled.

## D-084 — Eligible saved properties at FIRST automatic website go-live

- **A (recommended):** At the first automatic Live transition (D-029/D-077), include available + non-archived **successfully saved** eligible properties, if any, as part of the first public snapshot. **Zero properties remain valid**; no owner initial Publish/Submit. Exact validation/version/error handling OPEN.
- **B:** First automatic Live contains the website alone; saved property listings only appear after the first separate post-Live Publish Updates action.
- **C:** First Live includes only eligible saved properties that owner explicitly marked for initial inclusion in private pre-launch editing; selection is optional and must NEVER introduce a first owner Publish/Submit gate. Exact selection UI stays open.

## D-085 — Agency Profile data and public website draft synchronization

- **A (recommended):** Treat agency identity/contact details in Agency Profile as canonical private business data; clearly mapped public-site contact fields are copied/staged to the saved website draft, never directly to an already-Live public site. Owner publishes these later with D-053; no separate initial publish gate. Exact mapping, Save/dirty rules and requiredness remain OPEN.
- **B:** Profile is strictly internal; public site contact details maintained independently in website editor; no automatic synchronization.
- **C:** Agency Profile stays canonical, but owner must explicitly use a separate **Sync to Website Draft** action to stage mapped fields; actual public changes still require D-053 Publish Updates when already Live. No extra Super Admin review gate.

## D-086 — Property image privacy and processing baseline

- **A (recommended):** Validate uploaded actual media, remove EXIF/location metadata from public derivatives, serve optimized display variants, secure access to originals/storage; no need for photo to save D-058 property. Exact resizing dimensions, pipeline, retention and failures OPEN.
- **B:** Strip EXIF/location metadata and store/serve validated originals without generating multiple optimized variants; privacy must still be protected.
- **C:** Offload media variants/privacy transformations to a managed image service, with vendor/cost controls to decide.

## D-087 — Publish Updates failure, retry and owner feedback

- **A (recommended):** Publish is idempotent by revision/request, shows progress and confirmed final success/failure; on failure old Live snapshot stays, saved private draft remains available, and explicit safe retry is offered. Exact cache/CDN, transactional outbox and versioning OPEN.
- **B:** Failed publish requires Super Admin intervention; owner cannot retry directly.
- **C:** Failed publish automatically retries without an owner-facing retry action; expose a pending state with timeout/reconciliation. Avoid indefinite ambiguity.

## Invariants and pending implementation work

D-022 reason-required actions; D-028 lean signup; D-029+D-033+D-077 first-Live automatic; D-053+D-063+D-079 atomic deliberate post-live Publish Updates; D-078 Available/non-Archived public only; D-080 CRM deferred; D-064–D-073 Super Admin UX; Phase 0 npm workspaces/four apps/ports. Detailed schema/API, user passwords/CSRF/session mechanisms, review and property transition tables, route copy/breakpoints, origin security, media pipeline, private previews, billing, QA/deployment and actual Codex scaffolding verification remain OPEN. Business-feature coding not authorized.
