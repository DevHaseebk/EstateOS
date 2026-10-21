# EstateOS — CURRENT STATE v5.8 (AUTHORITATIVE)

**Date: 2026-10-21. Status: active planning and read-only architecture review. Codex Phase 0 scaffold previously authorized; actual repository output and test status NOT verified. No feature coding authorization.**

## Latest approvals: D-081 to D-087 all Option A CONFIRMED
- **D-081:** CONFIRMED Option A: distinct role/portal session context and host-scoped management cookies; never broadly share admin session with tenant public subdomains. Backend validates role/tenant per request. Exact implementation OPEN: Exact cookie/domain topology, SameSite, CSRF, development localhost behavior, API cross-origin/session store/expiry/revocation and identity bridging remain OPEN.
- **D-082:** CONFIRMED Option A: after assignment, agency platform subdomain slug remains stable during the pilot. Exceptional correction is an expressly authorized Super Admin operation, not owner self-service. Exact implementation OPEN: Slug algorithm, uniqueness/reserved names, exceptional rename mechanics, redirects, approval and DNS/TLS setup remain OPEN.
- **D-083:** CONFIRMED Option A: public agency website access is suppressed for BOTH Blocked and Deactivated operational restrictions. Reversal/restore triggers eligibility re-check rather than blindly showing site. Exact implementation OPEN: Admin login/session consequences, exact HTTP/error pages, SEO/cache invalidation timing, transition rules and restoration checks remain OPEN.
- **D-084:** CONFIRMED Option A: first automatic website activation includes successfully saved and publication-eligible Available AND non-Archived properties, if any. Zero-property website still allowed. No initial owner Publish/Submit step. Exact implementation OPEN: First snapshot validation, media readiness, publication data projection, concurrency, error/reconciliation and indexing remain OPEN.
- **D-085:** CONFIRMED Option A: internal Agency Profile is canonical for relevant agency/contact values; after a successful relevant Profile save, explicitly mapped fields are staged into private saved website draft. Already-Live public remains unchanged until existing Publish Updates succeeds. Exact implementation OPEN: Exact profile requiredness, unsaved warning/Save UX, field mapping and conflicts, consent/contact exposure, preview semantics and cross-surface validation remain OPEN.
- **D-086:** CONFIRMED Option A: verify uploaded media, strip metadata including EXIF GPS from public derivatives, produce optimized display variants, restrict original storage/access. Preserve D-060 10 max, 5 MB/file, JPEG/PNG/WebP and optional photos. Exact implementation OPEN: Exact image widths, formats/derivative policy, compression, storage/access mechanism, retention, upload job failures/retries and abuse scanning remain OPEN.
- **D-087:** CONFIRMED Option A: show truthful pending/failure/success state, retain last successful Live snapshot AND saved private draft on publish failure, allow explicit safe idempotent owner retry by revision/request without duplicate publication. Exact implementation OPEN: Idempotency key/schema, publish transaction/copy/swap, cache invalidation, retry budget, race resolution, job plumbing and timeout UX remain OPEN.

## Mandatory guardrails

- First website goes Live **automatically** once Super Admin manual approval AND D-033 readiness both true; recheck after successfully saved relevant changes; zero properties valid. First snapshot includes eligible saved Available/non-Archived properties, if any. No owner initial Publish/Submit.
- Existing Live site: saved edits (sections, theme, eligible properties, mapped profile data) are PRIVATE draft; deliberate owner Publish Updates atomically changes Live, otherwise old public version stays. Failed publish leaves old Live + private draft; allow safe idempotent retry.
- Blocked/Deactivated public websites non-public subject to recheck when restored, independent of private draft/publish pathways. Exact admin-session restrictions TBD.
- Pilot `frontend/` 4000, `admin/` 4001, `super-admin/` 4002, `backend/` 4003, root npm workspaces; no old pnpm apps/* scaffolding or product feature code permission.
- No new email/KYC/proof/map mandatory approval gate. D-022 reasons for Request Changes/Reject unchanged. CRM deferred; public WhatsApp/contact CTA remains.

## Read next

`docs/PLANNING-INDEX-LOCKED-v5.8.md`; `docs/IMPLEMENTATION-READINESS-v5.8-CONFIRMED-MAP.md`; canonical D081–D087 docs; `docs/AI/HANDOVER-LATEST.md`; proposed-only D088–D094; safe copy guide and Claude read-only prompt. Historical sections below can still call past choices OPEN: they are not current.

---

## HISTORICAL CURRENT-STATE SNAPSHOTS BELOW

---

# EstateOS — CURRENT STATE v5.7 (AUTHORITATIVE)

**Date: 2026-10-21. Planning advanced; Phase 0 only Codex scaffolding owner-authorized but code/build remains UNVERIFIED. No business-feature coding approval.**

## Newly CONFIRMED: all seven D-074–D-080 Option A

- **D-074 A:** Browser-centric server-managed sessions using HttpOnly/Secure cookies, with backend session validation for Agency Owner and Super Admin. No exposed bearer token in normal browser storage as the default architecture. Canonical `docs/IMPLEMENTATION-READINESS-D074-CONFIRMED.md`.
- **D-075 A:** Pilot public agency websites use platform-controlled agency-specific subdomains of one platform domain and one shared multi-tenant frontend/ renderer. Custom agency-owned domains deferred from pilot. Canonical `docs/IMPLEMENTATION-READINESS-D075-CONFIRMED.md`.
- **D-076 A:** Pilot tenants share MongoDB database and tenant-owned collections; all tenant-owned reads and writes are authorized and scoped by trusted server-derived agencyId. Never trust or let client-supplied agencyId override identity. Canonical `docs/IMPLEMENTATION-READINESS-D076-CONFIRMED.md`.
- **D-077 A:** After successful persistence of site-readiness-related changes or Super Admin approval, backend reevaluates BOTH manual approval and D-033 genuine website readiness. If both hold, first-ever website Live activation happens automatically, no owner initial Publish/Submit. Canonical `docs/IMPLEMENTATION-READINESS-D077-CONFIRMED.md`.
- **D-078 A:** Public agency site published snapshot lists property records only if they are Available AND not Archived. Sold, Rented and Archived records do NOT appear in public property listings. Status and archive remain independent management concepts. Canonical `docs/IMPLEMENTATION-READINESS-D078-CONFIRMED.md`.
- **D-079 A:** For an already-Live agency website, a successful deliberate owner Publish Updates makes one internally consistent public revision of eligible validated saved website sections/theme/property changes. Publication must be all-or-nothing to viewers, never report success early. Canonical `docs/IMPLEMENTATION-READINESS-D079-CONFIRMED.md`.
- **D-080 A:** For first 2–3 agencies, do not implement internal lead CRM, inquiry inbox, follow-up pipeline or message storage. Use website Contact CTA / WhatsApp pathway under existing site UX, with no claim of captured/saved leads. Canonical `docs/IMPLEMENTATION-READINESS-D080-CONFIRMED.md`.

Integrated policy map: `docs/IMPLEMENTATION-READINESS-v5.7-CONFIRMED-MAP.md`. D-074–D-080 A/B/C proposal is now RESOLVED/HISTORICAL.

## NEXT seven choices D-081–D-087 (ALL UNAPPROVED)

`docs/IMPLEMENTATION-READINESS-BATCH-D081-D087-PROPOSAL.md`: portal cookie/session boundaries; public slug renaming; Block/Deactivate public-site effect; first automatic Live property snapshot; private agency profile/public site draft synchronization; image privacy/transforms; publish failure/retry UX. Choices must be explicitly confirmed. **DO NOT implement proposed preferences.**

## Highest-priority invariants unchanged

- **D-022 + D-028:** reason mandatory for Request Changes/Reject; lean immediately Pending agency signup; manual Super Admin review, no mandatory KYC/document/email-verification gate.
- **D-029 + D-033 + D-077:** first public Live AUTOMATIC after manual approval AND authentic readiness, even with zero properties. No owner initial Publish/Submit. Approved but unready nonpublic; recheck triggered by successfully persisted relevant changes.
- **D-050 + D-053 + D-061 + D-063 + D-078 + D-079:** saved edits private; on already-Live sites public property listings only Available & non-Archived, and deliberate Publish Updates atomically publishes eligible saved sections/theme/properties. No implicit public Save sync.
- **D-064–D-073:** queue-first Super Admin, distinct review action UX, corrections/reopen, searchable directory, reversible Block/Deactivate, two pilot roles, audit and in-app status.
- **D-075 + D-076:** ONE shared multi-tenant frontend serving platform-managed subdomains; shared DB requires trusted server-derived tenant authorization on every query. Subdomain slug is not access permission.
- **D-080:** no CRM/inbox pilot, but public Contact/WhatsApp CTA remains.
- **Phase 0:** owner authorized Codex scaffold only, root npm workspaces; `frontend/` 4000, `admin/` 4001, `super-admin/` 4002, `backend/` 4003. No verified implementation here.

## OPEN technical and UX work

Exact session, CSRF/password/security, tenant schemas/API/indexes/tests; wildcard DNS/TLS/slug; initial auto-Live race/idempotency/first property snapshot; agency Block/Deactivate public and session effects; Agency Profile Save/requiredness/public sync; property enums/status and photo processing/privacy; publish transaction/rollback/cache/retry; admin statuses/auth/alerts/audit retention; labels/routes/responsive breakpoints; pilot QA/deploy/backups/pricing. **Planning approvals are not authorization to code business features.**

---

## HISTORICAL v5.6 CURRENT STATE BELOW — AUDIT ONLY

# EstateOS — CURRENT STATE v5.6 (AUTHORITATIVE)

**Date:** 2026-10-21 | **Status:** Product planning; Codex Phase 0 app scaffolding owner-authorized but actual code/build unverified. NO business-feature coding approval.

## Newly CONFIRMED — seven Super Admin decisions D-067 through D-073, ALL Option A

| ID | Confirmed product/UX policy | Canonical |
|---|---|---|
| D-067 | Separate **Changes Requested** review disposition; upon owner D-068 resubmit, Pending manual review again | `docs/SUPER-ADMIN-D067-CONFIRMED.md` |
| D-068 | Private correction reason; explicit owner **Resubmit for Review** after permitted corrections, NOT normal first signup Submit/Publish | `docs/SUPER-ADMIN-D068-CONFIRMED.md` |
| D-069 | Authorized Super Admin may reopen Rejected agency for manual review, with reason retained, never autoapproved | `docs/SUPER-ADMIN-D069-CONFIRMED.md` |
| D-070 | Searchable status-filtered All Agencies list; compact desktop rows/mobile cards, View/Manage | `docs/SUPER-ADMIN-D070-CONFIRMED.md` |
| D-071 | Distinct reversible Block vs Deactivate with required reason and confirm, authorized Super Admin restores; public/login effects OPEN | `docs/SUPER-ADMIN-D071-CONFIRMED.md` |
| D-072 | Pilot roles **Super Admin + Agency Owner** only; owner agency-scoped, staff/fine-grained RBAC deferred | `docs/SUPER-ADMIN-D072-CONFIRMED.md` |
| D-073 | Minimal persistent critical-action audit history and truthful in-app status/reasons, no mandatory automated email/SMS | `docs/SUPER-ADMIN-D073-CONFIRMED.md` |

The earlier batch comparison `docs/SUPER-ADMIN-BATCH-D067-D073-PROPOSAL.md` is now **RESOLVED/HISTORICAL**. Approved high-level lifecycle: `docs/SUPER-ADMIN-REVIEW-LIFECYCLE-v5.6.md`.

## NEXT: seven unapproved D-074…D-080 implementation-readiness choices

`docs/IMPLEMENTATION-READINESS-BATCH-D074-D080-PROPOSAL.md`: authentication/session, tenant domain routing, Mongo tenant storage, automatic first-live readiness reevaluation, public property business-status visibility, consistency/atomicity of Publish Updates, CRM/Inquiries pilot scope. **ALL PROPOSED ONLY; NO A/B/C assumed approved.**

## Nonnegotiable existing approvals

- D-022: required reason for Request Changes/Reject. D-028: lean self-signup Pending + Super Admin create/review, no mandatory verification/KYC/docs.
- D-029/D-033: website first Live **AUTOMATIC** on manual agency approval AND essentials readiness. Approved-but-unready nonpublic; zero properties valid, no initial owner Publish/Submit. Correction-cycle Resubmit is NOT a first publication gate.
- D-053/D-063: already-Live website saved section, theme and eligible property changes PRIVATE until owner **Publish Updates** succeeds; no per-property direct Publish and no per-update Super Admin approval.
- D-064 approval queue first, D-065 single-page agency review/readiness/private Preview, D-066 separate action confirmations with mandatory reasons where required.
- D-056–D-062 property cards, one-page editor, six required Basics, optional max 10 photos (5MB, JPEG/PNG/WebP), explicit Save + Save/Discard/Stay, Available/Sold/Rented + reversible Archive/Restore, no permanent delete MVP.
- Phase 0 owner-authorized scaffold ONLY: root **npm workspaces**, `frontend/` 4000, `admin/` 4001, `super-admin/` 4002, `backend/` 4003. Actual Codex code/build verification NOT available; this ZIP is docs, not implementation.

## Major remaining OPEN work

Exact backend status enum and transition/permission matrix, D-071 public/session effects, review reasons validators, race/error handling, audit event schema/privacy, user login/auth/tenant API, D-033 readiness auto recheck, first public property snapshot, property sold/rented/archive visibility, post-live publish validations/rollback/cache, Agency Profile-to-public sync and Save policy, CRM scope, routes/copy/breakpoints, staging/QA/security/backup and billing. No feature implementation authorized.

---

## HISTORICAL v5.5 CURRENT STATE — AUDIT ONLY

# EstateOS — CURRENT STATE v5.5 (AUTHORITATIVE)

**Date:** 2026-10-21 | **Status:** Product planning with Phase 0 scaffolding separately owner-authorized; Codex repo/build NOT verified from this ZIP. No product-feature implementation authorization.

## Most recent confirmed decision D-066 Option A

Super Admin Agency Review Detail (D-065) remains one responsive page with authentic agency/contact info, manual review status distinct from D-033 site readiness, authorized PRIVATE saved-draft Preview, and distinct existing Approve, Request Changes, Reject controls. Each control now opens its own **focused compact confirmation dialog / mobile sheet**. D-022 requires reason for Request Changes and Reject. Approve confirmation must NOT claim site Live if D-033 readiness absent. Cancel makes no mutation; only acknowledged success may appear. Exact reason form rules, concurrency, permission and transitions NOT determined.

## Owner-requested fast-track: NEXT seven D-067–D-073 decisions PROPOSED ONLY

Read `docs/SUPER-ADMIN-BATCH-D067-D073-PROPOSAL.md` for A/B/C of: D-067 review status model; D-068 owner correction and re-review trigger; D-069 rejection recovery; D-070 directory UX; D-071 Block/Deactivate interaction; D-072 pilot role boundary; D-073 audit/notification scope. An A recommendation is NOT approval. Collect seven choices in one user response, reconcile dependencies, then create v5.6 only after owner approval.

## Unchanged authoritative product invariants

- D-022 Request Changes and Reject REASON MANDATORY; D-028 both self-signup and platform-admin agency creation, self-signup immediately Pending and manual Super Admin review; NO mandatory KYC/docs/verified email/physical business proof.
- D-029 + D-033: FIRST public site Live automatically when manual approval AND essentials readiness fulfilled. Approved-but-unready remains NONPUBLIC, zero properties valid. No initial owner Submit/Publish or extra gate.
- D-053 + D-063: Once site is already Live, saved website section/theme and eligible saved property edits remain draft until deliberate authorized owner Publish Updates; no new Super Admin review for every update.
- D-064 queue-first dashboard; D-065 one-page Agency Review Detail; D-066 confirmation presentation only.
- D-057–D-062 property basics (six required fields), optional photo gallery with max 10, 5MB JPEG/PNG/WebP, whole-record Save + Save/Discard/Stay, internal Available/Sold/Rented + reversible Archive/Restore, no permanent delete MVP remain.
- Phase 0: root npm workspaces, FOUR apps only: `frontend` Next.js 4000, `admin` Next.js 4001, `super-admin` Next.js 4002, `backend` Express/TypeScript/Mongoose 4003. Placeholder scaffolding only previously authorized, completion unverified. Old pnpm apps/packages examples superseded for Phase 0.

## Major outstanding technical and product decisions

Exact review state enums/transitions/error retries/race, reason validation/retention/visibility, correction/reopen, admin permissions/tenant isolation/auth, blocked/deactivated access and site effects, notifications/audit, property public eligibility and Sold/Rented/Archived public behavior, D-033 readiness recheck and first-snapshot behavior, Publish Updates validation/rollback/cache, Photo processing EXIF/privacy and incomplete uploads, profile sync, CRM pilot inclusion, final copy/routes/numerical breakpoints, QA/staging/deployment/backups.

**Next request to user:** Decide all seven D-067–D-073 A/B/C options in one reply. Do NOT start business-feature coding based on proposal.

---

## HISTORICAL v5.4 CURRENT STATE — AUDIT ONLY



# EstateOS — CURRENT STATE v5.4 (AUTHORITATIVE)

**Date:** 2026-10-21 | **Product:** EstateOS pilot planning | **Code boundary:** Phase 0 four-app scaffold ONLY was previously owner-authorized in Codex, completion unverified; no product feature implementation approved.

## Latest D-065 — CONFIRMED Option A

One-page responsive Super Admin Agency Review Detail starts with existing agency/owner/contact information and separate agency review-status / D-033 site-readiness indicators; supports **authorized PRIVATE saved-draft website Preview** (not public), and clearly separated **Approve / Request Changes / Reject** action area. D-022 still requires reasons for Request Changes and Reject. **This approves only screen information hierarchy and action placement;** actual decision UX, permissions, confirmations, status transitions, error/audit/notifications and final labels/routes/breakpoints **remain OPEN**. Canonical `docs/AGENCY-REVIEW-DETAIL-D065-CONFIRMED.md`. D-065 A/B/C proposal historical.

## NEXT D-066 — PROPOSED ONLY

Decide review decision flow and confirmation/reason-entry presentation: **A compact action-specific dialogs/sheets (recommended)**, **B inline decision panel**, **C dedicated decision step/page**. See `docs/AGENCY-REVIEW-ACTIONS-D066-PROPOSAL.md`. Nothing approved yet.

## Preserved invariants and setup

- **D-064** queue-first pending agency reviews, direct Review, All Agencies secondary.
- **D-028** lean signup / immediate Pending, existing manual Super Admin review; no mandatory verification/KYC/map/doc gate. **D-022** reasons required for change request/reject.
- **D-029 + D-033** first public Live **AUTOMATIC** only after actual Super Admin agency approval AND site readiness. If approved but unready, website private; zero-property valid; no owner initial Publish/Submit.
- **D-053 + D-063** on already-Live sites, deliberate owner **Publish Updates** for saved sections/theme/eligible property changes; a simple Save does not update public site.
- **Phase 0 development only:** root `frontend/` Next.js 4000, `admin/` Next.js 4001, `super-admin/` Next.js 4002, `backend/` Express TS/Mongoose 4003, root npm workspaces. Codex scaffold request issued, but no proof of execution/build in this archive.

## Still OPEN

D-066 action confirmations/reason fields and statuses/transitions; permission/audit/notifications/error & concurrency, private preview access, agency management, content/property publication edge cases, tenant auth security, Profile sync, labels/routes/breakpoints, CRM and pilot QA/deployment. Historical statuses below must not override this latest snapshot.

---

## HISTORICAL v5.3 AND EARLIER CURRENT-STATE LOGS — AUDIT ONLY

# EstateOS — CURRENT STATE v5.3 (HISTORICAL SNAPSHOT)

**Date:** 2026-10-21 | **Stage:** Pilot product UX + Phase 0 scaffolding | **Implementation boundary:** Only Phase 0 skeleton expressly authorized; NO business features until separately approved.

## Latest owner approval: D-064 Option A — CONFIRMED

The Super Admin's main dashboard **leads with actual pending agency review queue**, one clear `Review` entry action per queued record, and the All Agencies directory / other management tools SECONDARY. No analytics-first or directory-first dashboard. **Only layout/information priority approved; review-detail UI, exact actions/confirmations, queues/filters/status transitions/permissions/notifications remain OPEN.** Canonical `docs/SUPER-ADMIN-DASHBOARD-D064-CONFIRMED.md`. Prior D-064 A/B/C proposal historical.

## CONFIRMED operational development setup / Phase 0 only

Owner explicitly handed Codex initial repository scaffold prompt: root application directories `backend/` (Node/Express/TypeScript/Mongoose; port **4003**), `admin/` (Next.js TypeScript Tailwind; **4001**), `super-admin/` (Next.js; **4002**), `frontend/` (single Next.js tenant-capable shell, no tenant-routing implementation yet; **4000**). Use **npm workspaces**. Legacy `apps/*`/`packages/*`/pnpm proposal SUPERSEDED for Phase 0. Documentation root is allowed alongside four app directories. See `docs/PHASE-0-DEV-SETUP-CONFIRMED.md`. **The planning ZIP contains specifications, not a verified run of Codex's generated code.** No authentication, agency/property API, website builder, tenancy or billing implementation authorization.

## NEXT D-065 PROPOSED ONLY

`docs/AGENCY-REVIEW-DETAIL-D065-PROPOSAL.md`: choose A **one-page Agency Summary + clearly separated Review Actions area (recommended)**; B Information/Decision tabs; C Details→Private Preview→Decision wizard. Do not assume any option is selected. Supporting `docs/AGENCY-REVIEW-ACTIONS-D065-DISCUSSION.md` discusses already-existing Approve, Request Changes, Reject actions and D-022 reason requirement, but exact reason UI/status machine and review-confirmation/error behavior OPEN.

## Hard project invariants (do not reinterpret)

- D-028 immediate Pending self-signup and manual Super Admin review; no mandatory email verification/KYC/docs/map/logo gate, while D-022 reason-based Request Changes/Reject approved historically.
- D-029 + D-033: FIRST website auto-go-live only on manual Super Admin approval **AND** actual site readiness; approved-but-unready remains private; no initial owner Publish/Submit, properties optional/zero accepted.
- D-053 + D-063: ALREADY-LIVE saved website section/theme and eligible property changes require one deliberate owner **Publish Updates**; a Save Property is private, not publication; no admin re-review required on every update.
- D-058 required six property fields; D-059/D-060 optional max 10 photos at 5MB JPEG/PNG/WebP; D-061 whole property Save + Save/Discard/Stay; D-062 available/sold/rented + Archive/Restore, no permanent MVP Delete.
- Property public eligibility / Sold-Rented-Archived behavior, agency and property status enum/transitions, Profile save/sync, image privacy/transforms/errors, publish rollback/cache, exact routes/labels/pixels/CRM pilot inclusion, auth/tenancy/DB schema/API/security/deployment choices all remain OPEN.

## Priority for next session

Request D-065 A/B/C layout selection, then create versioned v5.4 planning bundle and update Claude/Cursor/Codex. In coding environment, inspect Phase 0 scaffold and update docs after actual command results; do not pretend scaffolding ran based on this ZIP. Current headers supersede all historical snapshots below.

---

## HISTORICAL v5.2 AND EARLIER — AUDIT ONLY

# EstateOS — CURRENT STATE v5.2 (AUTHORITATIVE)

**Date:** 2026-10-21 | **Stage:** M00 product discovery / UX decisions | **MODE: PLANNING ONLY — NO APP CODE**

## Latest owner approval — D-063 Option A CONFIRMED

For an **already-Live** agency website, the D-061 explicit Save Property persists a property's record in the **private saved draft only**. **D-053's existing deliberate Publish Updates action** is extended to **eligible saved individual-property changes**, together with eligible previously-saved section and applied-theme changes. The Live public website is not updated by Save Property alone. No separate default per-property Publish button, no automatic property public synchronization and no new Super Admin review for every update. Canonical `docs/PROPERTY-PUBLIC-PUBLISHING-D063-CONFIRMED.md`; previous D-063 proposal is HISTORICAL.

**Critical exceptions / not-yet-decided:** exact property eligibility/first-launch snapshot, public behavior for Sold, Rented, Archived/Restored, preview sync, site update transaction/scope, validation, failures/rollback, cache and permission checks all OPEN. D-062 internal status/Archive approval does not resolve these.

## NEXT — D-064 PROPOSED ONLY: Super Admin dashboard hierarchy

Read `docs/SUPER-ADMIN-DASHBOARD-D064-PROPOSAL.md` and `docs/SUPER-ADMIN-SCREENS-v5.2-DISCUSSION.md`. Options A **Pending Review Queue first** (recommended), B All Agencies directory first, C Analytics first. **NONE approved.** Approval/review workflows and status gates do not change merely because these screens are proposed.

## Invariants from approved decisions

- **D-029 FIRST automatic go-live** after manual Super Admin agency approval + D-033 site minimum readiness, **no owner initial Publish/Submit**; zero-property sites valid. Pending agency may privately edit/preview; Approved-but-unready is not public.
- **D-028 lean pilot** with small signup/Pending queue and no new mandatory email, KYC, proof, map or logo gate. Super Admin manual decision established; preserve relevant D-022 structured review rules without inventing exact UI.
- **D-049–D-054:** candidate theme preview/noncommitting until Apply; explicit per-section Save; Save/Discard/Stay dirty guard; saved-draft-only private site Preview; deliberate Publish Updates for later changes; My Website compact Live + Unpublished Changes when genuinely saved updates differ from public version.
- **D-055–D-062:** one-page Agency Profile layout; responsive Admin property cards; Basics-first one-page Add/Edit with expandable Details/Photos; six required fields **Title, Sale/Rent, Property Type, Price PKR, City, Area**; optional gallery/cover up to **10 JPEG/PNG/WebP files of max 5 MB each** and per-file errors; one Save Property and Save/Discard/Stay; internal Available/Sold/Rented and reversible Archive/Restore, no permanent MVP Delete.
- **D-063 newly confirmed:** no property Save auto-publication; existing subsequent **Publish Updates** includes eligible property changes; exact public property eligibility/status/archive effects deferred.
- **OPEN:** property status enums/defaults/transitions/confirmations/archive list, publishing eligibility/rollback/caching/preview, media privacy/EXIF/upload retry, Agency Profile save/sync, exact label/routes/breakpoint pixels, and CRM/Inquiries pilot scope.

## Cross-AI precedence

Current latest D-063 confirmed specification and **this top section** outrank older historical narrative below; previous version snapshots preserved for audit. Never treat a *-PROPOSAL as an owner-approved implementation instruction. Next owner decision is **D-064 only**. Preserve all 127 prior file paths and make a versioned ZIP. **No application coding authorized.**

---

## HISTORICAL v5.1 AND EARLIER SNAPSHOTS (SUPERSEDED WHERE INCONSISTENT)

# EstateOS — CURRENT STATE v5.1 (HISTORICAL SNAPSHOT)

**Date:** 2026-10-21 | **Stage:** M00 planning & UX decisions | **MODE: PLANNING ONLY — NO APP CODE**

## Latest CONFIRMED: D-062 Option A — Available/Sold/Rented + Archive/Restore

Agency Admin property availability has **Available / Sold / Rented** owner-facing concepts and separate **reversible Archive/Restore**. No permanent Delete in MVP. Exact technical enums, intent restrictions, transition validation/defaults, confirmation and archived-list UI still OPEN. Read `docs/PROPERTY-STATUS-ARCHIVE-D062-CONFIRMED.md` as current authority; the D-062 A/B/C proposal is HISTORICAL.

## NEXT D-063 PROPOSED ONLY — property PUBLIC publishing

Read `docs/PROPERTY-PUBLIC-PUBLISHING-D063-PROPOSAL.md`. Options: A (recommended) treat property changes as saved private draft then include in existing explicit **Publish Updates** for already-Live site; B separate per-property Publish/Unpublish; C automatic public property sync on Save/status/archive. **NONE APPROVED.** D-062 must not be read as approval of public visibility or removing public listings.

## Invariants

- D-056 responsive Admin property cards; D-057 Basics-first one-page form with optional Details/Photos; D-058 six required to Save: **Title, Sale/Rent intent, Property Type, Price PKR, City, Area**.
- D-059 optional multi-photo cover/reorder/remove, D-060 **max 10 photos, 5 MB each, JPEG/PNG/WebP, clear per-file errors**; photos and cover not required.
- D-061 **one manual whole-property Save + Save/Discard/Stay** unsaved guard; successful persistence required before leaving via Save. Save Property is NOT an approved public Publish.
- D-029 initial public WEBSITE auto-launch only after **manual Super Admin approval AND D-033 readiness**, no initial owner Publish/Submit, even with **zero properties**. D-053 separately confirms **explicit Publish Updates** on already-Live WEBSITE theme/content changes; whether that extends to individual properties is D-063 OPEN.
- D-054 Live/unpublished-status My Website hub, D-052 saved-draft preview and previous Agency Admin/navigation/typography/theme approvals remain.
- All exact status enum values/defaults/transitions/confirmation flows, archive filtered view & restore, publication/unpublication, property media privacy/upload transactions, save/upload failures/retry, public cache & rollback, final routes/copy, mobile breakpoint pixels, Profile persistence and CRM pilot scope remain OPEN.
- **User has NOT authorized application implementation.** New versions must preserve old project ZIP contents, append a confirmed spec, mark earlier proposals historical, update cross-AI handover and run ZIP validation.

---

## HISTORICAL v5.0 AND EARLIER SNAPSHOTS (SUPERSEDED WHERE INCONSISTENT)

# EstateOS — CURRENT STATE (authoritative for next AI)

**Date:** 2026-10-21 | **Bundle:** v5.0 | **Stage:** M00 Agency Admin / Property UX | **MODE: PLANNING ONLY — NO APPLICATION CODE**

## LATEST CONFIRMED: D-061 Option A — Add/Edit Property Manual Save + Unsaved Guard

The whole Add/Edit Property record uses **ONE explicit manual Save Property** action. On navigation while property form changes are unsaved, use **Save / Discard / Stay**: Save attempts persistence and proceeds ONLY after real success; Discard drops unsaved input only, leaving prior stored property intact; Stay retains input and cancels navigation. Do not introduce autosave or separate per-section Property saves. See `docs/PROPERTY-SAVE-UNSAVED-D061-CONFIRMED.md`; earlier `docs/PROPERTY-SAVE-UNSAVED-D061-PROPOSAL.md` is historical (B/C rejected).

## NEXT D-062 — PROPOSED ONLY: Availability Status and Archive/Delete

Read `docs/PROPERTY-STATUS-ARCHIVE-D062-PROPOSAL.md`. Candidate A (recommended) simple Available/Sold/Rented-style availability + reversible Archive/Restore, no permanent deletion in MVP; B Available/Off Market-style + reversible Archive; C availability states + recoverable Soft Delete. **NO STATUS/DELETE/ARCHIVE CHOICE HAS BEEN APPROVED**; exact enumerations and public-site effects remain OPEN.

## Invariants & strictly open

- D-056 responsive Admin cards, D-057 one-page Basics + expandable Details/Photos, D-058 six required Basics: **Title, Sale/Rent, Property Type, Price PKR, City, Area**; D-059 optional gallery with manual cover/reorder/remove, D-060 optional max 10 JPEG/PNG/WebP at 5 MB/image with per-file validation.
- D-029 and D-033: FIRST agency website Live automatically after manual Super Admin approval + website readiness; **NO initial owner Publish/Submit**, zero properties allowed.
- D-053: subsequent changes to already-live **website content/theme** require explicit Publish Updates; **individual-property publication is undecided** and Property Save does NOT imply public publication.
- OPEN: exact validators/enums/price rules, Save failures/errors/retries, pending image upload transaction handling, privacy/storage/EXIF/resizing, status/delete/restore, public property listing visibility, final routes/copy/numeric breakpoints, Agency Profile persistence, CRM/Inquiries pilot.
- **No application coding authorized.** Use this current header over historical snapshots below.

---

## HISTORICAL v4.9 AND EARLIER CURRENT STATE (SUPERSEDED WHERE INCONSISTENT)

# EstateOS — CURRENT STATE (authoritative for next AI)

**Date:** 2026-10-20 | **Bundle:** v4.9 | **Stage:** M00 Agency Admin / Property UX | **MODE: PLANNING ONLY — NO APPLICATION CODE**

## LATEST CONFIRMED — D-060 Option A, Property Photo Guardrails

**Maximum 10 optional photographs per property; maximum 5 MB per image; accepted JPEG/JPG, PNG, WebP.** Display constraints clearly and provide plain-language **per-file validation feedback** for oversized, unsupported and over-count files. Do not silently discard. Valid property records with all D-058 Basics can be saved without photos or cover. The exact photo processing, file sniffing/security handling, EXIF/privacy, dimensions, resizing/compression, progress/cancel/retry, transactional upload behaviour and attachment Save lifecycle are not approved. Canonical `docs/PROPERTY-PHOTO-LIMITS-D060-CONFIRMED.md`; old A/B/C proposal **HISTORICAL**.

## NEXT D-061 — PROPOSED ONLY, property form Save/unsaved navigation

Read `docs/PROPERTY-SAVE-UNSAVED-D061-PROPOSAL.md`: A whole-record manual Save Property plus Save/Discard/Stay guard (recommended); B manual Save with simple Leave/Keep Editing warning; C Property autosave. **Do not treat these choices as confirmed.** D-050/D-051 already cover WEBSITE SECTION editor, not Add/Edit Property form.

## Other active decisions and boundaries

- D-056 responsive Agency Admin Property cards and a friendly zero-property state; D-057 one-page Add/Edit Basics plus expandable Details/Photos; D-058 only six required property fields: **Title, Sale/Rent intent, Property Type, Price PKR, City, Area**; D-059 optional gallery with explicit cover, thumbnails and simple reorder/remove.
- **D-029/D-033 first agency-site activation remains automatic** on manual Super Admin agency approval **AND** website readiness, with NO initial owner Publish/Submit and ZERO properties still valid.
- **D-053 already-Live website CONTENT/THEME changes:** separate saved private draft and explicit Publish Updates. Individual-property publication is still independently OPEN; photo-upload success, Property Save or choosing cover does not imply immediate public listing.
- Precise enum/validators, Save/cancel/unsaved, property availability/status/delete, public record publishing, Profile save/public sync, final English labels/routes, responsive breakpoint numbers, pilot CRM and Super Admin UI details OPEN. **No application coding authorized.**

---

## HISTORICAL PRIOR CURRENT-STATE SNAPSHOT (v4.8 and before; overridden where inconsistent)


# EstateOS — CURRENT STATE (authoritative for next AI)

**Date:** 2026-10-20 | **Bundle:** v4.8 | **Milestone:** M00 Agency Admin / Property UX | **Mode:** PLANNING ONLY — NO APP CODING AUTHORIZED

## LATEST CONFIRMED — D-059 Option A: Optional photo gallery

Within the D-057 one-page Add/Edit Property page, the expandable Photos group offers optional **multiple photos** and **thumbnail previews**; owner can deliberately choose the **cover** and use simple reorder/remove controls. **ZERO photos including zero cover is valid.** Exact file quantity, size, types, upload workflow and errors are **NOT approved**. Canonical `docs/PROPERTY-PHOTOS-D059-CONFIRMED.md`; historical alternatives `docs/PROPERTY-PHOTOS-D059-PROPOSAL.md` are resolved.

## NEXT — D-060 UNAPPROVED: image limits and validation experience

`docs/PROPERTY-PHOTO-LIMITS-D060-PROPOSAL.md` proposes **A** up to 10, 5 MB/file, JPEG/PNG/WebP with clear per-file validation (**recommended**); **B** up to 6, 3 MB/file, JPEG/PNG; **C** up to 20, 10 MB/file, JPEG/PNG/WebP. All are **candidate configurations only**. Nothing numerical/formats currently final. Zero photos must stay valid.

## Critical invariants

- **D-056** Agency Admin responsive property cards; **D-057** Basics first + separately expandable Details and Photos; **D-058** exactly six required property Basics: Title, Sale/Rent Intent, Property Type, Price PKR, City, Area. Other details and ALL photos optional.
- Property photo management does NOT decide Property Save, unsaved navigation, uploading/processing, property status/delete or **individual property public publication**. No photo updates instant-public by implication.
- **D-029+D-033:** FIRST agency website activates automatically after **manual Super Admin approval AND website readiness**; no initial owner Publish/Submit; properties not required at all.
- **D-053:** after a website is already Live, saved WEBSITE CONTENT/THEME changes are private until an explicit Publish Updates; do NOT apply this rule to individual property records without a later decision.
- **D-049** theme candidate preview+Apply; **D-050** website section Save; **D-051** Save/Discard/Stay; **D-052** private saved-draft Preview. These are website editor rules, not yet property form save semantics.
- Profile Save/sync, precise labels/routes, numeric mobile breakpoints, pilot CRM/Inquiries and Super Admin screen workflows remain OPEN. No app code.

---

## Historical context (older snapshots, superseded where conflict)

## Rules for next AI

- D-056: responsive Admin listing CARDS; D-057: one-page Add/Edit Property with Basics always visible and expandable Details/Photos; **D-058 now decides only six required fields**. Do not conflate property Save with a public property publish: record persistence/unsaved prompts, statuses/archive/delete, **individual property public publishing** remain OPEN.
- D-029: first website Live automatically after **manual Super Admin approval AND D-033 site readiness**. NO owner initial Publish/Submit; zero-property agencies allowed. D-053 applies **explicit Publish Updates for already-live website content/themes**, not implicitly to property records.
- D-028 lean pilot, D-030 one template and three themes, D-045 nonblocking checklist, D-049 compare theme→Apply, D-050 per-section manual Save, D-051 Save/Discard/Stay, D-052 private saved-draft Preview, D-054 compact Live + Unpublished indicator, D-055 one-page Agency Profile still apply.
- Open: exact property type/intent enums, validation/price behavior, photo count/format/size, Property Save and dirty-state, status/delete, public listing publication, Profile save/sync, labels/routes/breakpoints, pilot CRM scope, production security and QA. **No application coding.**

---

> **HISTORICAL v4.6 SNAPSHOT BELOW:** Previous `D-058 proposed` and `no field requiredness approved` language applies to v4.6 only and is superseded by D-058 Option A as of v4.7. Read current above and D-058 canonical. Other dated historical decisions remain traceable.

# EstateOS — CURRENT STATE (authoritative for next AI)

**Date:** 2026-10-19 | **Bundle:** v4.6 | **Milestone:** M00 / Agency Admin UX | **Mode:** PLANNING ONLY — NO APP CODING AUTHORIZED

## LATEST CONFIRMED — D-057 Option A: one-page Add/Edit Property form

Owner approved **single responsive Add/Edit Property page**: **Basics immediately visible**, then **expandable/collapsible Property Details and Photos** sections. No wizard/tabs and no new requirement to add any property. Both Add and Edit use the same grouping. This is **FORM STRUCTURE ONLY**—not field schema, requiredness, photo mandates, Save/unsaved behavior, record visibility, deletion/status, or public property publication. Canonical `docs/PROPERTY-FORM-D057-CONFIRMED.md`; D-057 A/B/C proposal is HISTORICAL.

## NEXT — D-058 PROPOSED ONLY: minimum fields and requiredness

A six useful Basics fields: title, For Sale/For Rent, property type, asking price PKR, city, neighborhood (recommended); B ultra-lean title/intent/price/area; C larger required set including size, description, cover photo. NONE approved as required. `docs/PROPERTY-MINIMUM-FIELDS-D058-PROPOSAL.md` is an unapproved choice. Numeric validators/enums, media, Property Save/recovery, public property publishing and CRM still OPEN.

## Previously CONFIRMED — D-055 Option A: one-page Agency Profile

Agency Admin **Agency Profile** is one clear page, with visible essential agency/contact information and additional **optional** business details grouped lower in a secondary expandable area. No separate tabs/wizard and no new registration/KYC/approval/site-readiness gates. **Only the layout/hierarchy was approved**: exact fields, requiredness, Save/cancel/dirty-state, account versus agency data ownership, Profile-to-public-site synchronization and route/copy/breakpoints are OPEN. Canonical `docs/AGENCY-PROFILE-UX-D055-CONFIRMED.md`; A/B/C proposal historical.

**D-053/D-054 publishing unchanged:** Already-Live site has true public Live status; saved unpublished website changes indicate pending action and need explicit authorized Publish Updates; no false pending if unchanged. Private saved-draft Preview and explicit theme Apply/section Save remain. **D-029 FIRST go-live unchanged:** manual Super Admin approval + D-033 readiness ⇒ automatic initial activation, NO initial owner Publish/Submit. A Profile save may NOT be assumed to change the public already-Live website.

## Latest CONFIRMED — D-056 Option A: responsive optional Properties cards

Agency Admin Properties list uses cards on **both desktop and mobile**: responsive grid on desktop, single-column stacked cards on mobile; one reusable presentation pattern. Friendly zero-property empty state with optional Add Property; no property required for site launch. **LISTING UI ONLY**: exact fields/photos/prices/status/card actions/CRUD/public publication unapproved. Canonical `docs/PROPERTIES-LIST-D056-CONFIRMED.md`, original D-056 A/B/C proposal historical.

## HISTORICAL v4.5 — D-057 was then proposed; now CONFIRMED in v4.6

A single page: Basics first, secondary expandable Details and Photos (recommended); B short guided steps; C tabs. `docs/PROPERTY-FORM-D057-PROPOSAL.md` was UNAPPROVED at v4.5, now HISTORICAL, and example candidate fields `docs/PROPERTY-FORM-FIELDS-v4.5-DISCUSSION.md` are DISCUSSION ONLY. Save/unsaved, field requiredness, media limits, delete/status and property/public website publication remain OPEN.

## Previously CONFIRMED product invariants

- D-028 lean 2–3 agency pilot with basic registration, immediate Pending; heavy verification/KYC/map/document/email gates DEFERRED. D-014 Super Admin manual approval preserved.
- D-029 + D-033: automatic initial go-live only after Admin agency approval and essentials (selected ONE template, genuine agency name, genuine Hero heading, phone OR WhatsApp, proper uploaded OR truly licensed platform-default Hero photo). Logo/Properties/About/Services optional; zero-property agency site valid.
- D-030 ONE public template; D-031 nine sections; D-032 Header/Footer fixed, Hero/Contact CTA always visible, other five optional with Hide/Show + Move Up/Down.
- D-034 three theme presets, D-037 fixed curated palettes, D-042 four approved HEX tokens per preset, D-036/D-039 fonts (Manrope modern/dark headings, Playfair Warm display, Inter body/UI); D-038 shared geometry; D-040/D-041 fluid type Hero 40→72px, H2 28→44px, body 16px. Weights/numeric spacing/radii/interpolation OPEN.
- D-035 + D-043 full-bleed Hero with directional dark gradient, numeric settings OPEN.
- D-044 Task-first Agency Admin; D-045 four nonblocking checklist tasks; D-046 grouped navigation; D-047 status then ONE next-action CTA then checklist then optional Properties; D-048 My Website status/readiness then edit CTA and Theme/Editor/Preview shortcuts.
- D-049 preview candidate theme before explicitly Apply to saved draft; D-050 explicit per-current-section Save (not autosave or global Save All); D-051 Save/Discard/Stay protects navigation; D-052 private saved-draft Preview; **D-053 separate explicit Publish Updates for already-Live sites ONLY; D-054 compact truthful Live/draft status with contextual CTA**.

## Still OPEN

- D-054 pending-change detection/copy (layout confirmed); D-053 exact publishing scope/validation/permission, pending changes detection, success/failure/retry/rollback, revision history, atomicity and public cache invalidation.
- D-052 private preview URLs/auth/refresh/caching/consistency; D-051 exact warning modal text/browser lifecycle/save failures; safe media and concurrency handling.
- D-055 Profile exact field requiredness, Save/unsaved states and public sync; D-056 listing-card presentation confirmed; D-057 Add/Edit layout CONFIRMED; property data/requiredness and publication unapproved. D-029 Approved-but-unready readiness recheck/initial activation trigger; Block/Deactivate restrictions and UX.
- English labels, URL routes, numerical breakpoints, checklist progress persistence; optional Property fields, Inquiries/CRM pilot scope, practical Super Admin screens, backend/data design; remaining semantic design colors/a11y and numeric visual tokens.

## Cross-AI handover

Read `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/project.mdc`, `docs/DECISIONS.md`, `docs/POST-LIVE-UPDATES-D053-CONFIRMED.md`, `docs/MY-WEBSITE-DRAFT-LIVE-D054-CONFIRMED.md`, `docs/AGENCY-PROFILE-UX-D055-CONFIRMED.md`, `docs/PROPERTIES-LIST-D056-CONFIRMED.md`, and `docs/AI/HANDOVER-LATEST.md`. Latest confirmed specifications outrank historical proposals. Preserve old files for traceability. No app code; D-056 and D-057 are CONFIRMED; D-058 is the NEXT proposed owner choice only.

> **v4.8 OVERRIDE:** All earlier D-058 NEXT / D-059 PROPOSED references above are historical. D-059 is CONFIRMED; D-060 is next unapproved owner choice. Read this file’s first sections.
