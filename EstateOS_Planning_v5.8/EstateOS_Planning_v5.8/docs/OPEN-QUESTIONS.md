# EstateOS — OPEN QUESTIONS v5.8 (AUTHORITATIVE)

## Resolved this turn — not open

**D-081 through D-087 all CONFIRMED Option A:** admin host/session separation; fixed pilot agency slug; Blocked AND Deactivated public website non-public; first automatic snapshot includes eligible successfully saved Available/non-Archived properties, zero valid; mapped Profile values stage private website draft; secure media with EXIF/GPS stripped public variants; safe idempotent explicit Publish Updates retry preserving old Live/draft. Earlier D081–87 A/B/C proposal is HISTORICAL, not unresolved.

## Still OPEN — do not infer implementation specifics

- Auth/CSRF/session store/expiry/password reset, cookie domain/SameSite/Secure localhost behavior and frontend-to-API transport.
- Tenant auth/query-scope code/contracts/tests, roles/permitted actions, Super Admin impersonation (not approved), route-level access, app-origin trust.
- Subdomain naming, collisions, exceptional Super Admin renames, wildcard DNS/certificates, frontend tenant resolver.
- Block/Deactivate exact transition/auth/session effects, cache/SEO and reactivation checks.
- Profile requiredness, its single-page Save/dirty guard, exact public mappings/conflicts and privacy/consent.
- Initial auto-Live transaction/idempotency, draft/properties availability during concurrent edits, first media/public snapshot validation.
- Publish Updates immutable snapshot/storage strategy, lock/collision, retries/status, cache/CDN/rollback and success confirmation semantics.
- Property type/price validation, image resize/format/storage/EXIF pipeline/failures, secure upload retrieval, future status transitions/Archive restore.
- Exact API endpoint/model schemas and indexes, audit event details/privacy/retention, reason length and validation, monitoring, notification UX.
- Final labels/routes/numeric responsive breakpoints, ARIA/a11y, QA/test/build criteria, Dev/Staging/Prod config, data migrations/backups/restore, billing pricing and launch cadence.
- D-088–D-094 options in proposal: none approved and no code features permitted under Phase 0-only authorization.

Older text below can mention D081–87 as "NEXT" or "OPEN" and is retained for historical context; THIS top entry supersedes it.

---

## HISTORICAL OPEN-QUESTION REGISTER BELOW

---

# EstateOS — OPEN QUESTIONS v5.7 (AUTHORITATIVE)

## JUST CONFIRMED — not open

D-074…D-080 are individually **CONFIRMED Option A**, for server cookie sessions, public platform-managed subdomains, shared MongoDB/trusted server `agencyId`, persisted-change-triggered first-Live readiness recheck, public Available AND non-Archived properties only, atomic owner Publish Updates post-Live, and deferred CRM pilot. Their old batch proposal is HISTORICAL. Read `docs/IMPLEMENTATION-READINESS-v5.7-CONFIRMED-MAP.md` and individual specs.

## NEXT UNAPPROVED BATCH: D-081 through D-087

- D-081 Management-portal session isolation and cookie host boundaries.
- D-082 Tenant subdomain slug lifecycle/rename policy.
- D-083 Block/Deactivate public website behavior.
- D-084 Property inclusion in FIRST automatic public snapshot.
- D-085 Agency Profile source-of-truth and public website draft synchronization.
- D-086 Media privacy/EXIF and processing baseline.
- D-087 Publish Updates failure, retry, progress and success messaging.

All A/B/C options remain **PROPOSED ONLY** (`docs/IMPLEMENTATION-READINESS-BATCH-D081-D087-PROPOSAL.md`).

## Other implementation-readiness and acceptance questions still OPEN

- Secure backend sessions: CSRF, cookie hostname/SameSite/Secure, session store, auth endpoints, expiration/revocation, password recovery, login rate-limits, admin separation.
- Tenant routing: wildcard DNS/TLS, slug uniqueness/reserved collisions, Super Admin auth, private preview isolation, domain changes and identity-check threats.
- MongoDB: collections, schema/API contracts, indexes, global-versus-agency data, server auth and isolation tests, concurrency/transaction/revision ownership.
- First public Live: atomic initial content, property inclusion, retry/idempotent event, reconciliation, failures and pre-approved draft eligibility.
- Public property behavior: restore/change transitions, status defaults, archive published visibility after next explicit update, URL and indexing/caches.
- Website draft: Agency Profile requiredness + Save, exact public contact field mappings; Save/dirty and publish validations; rollback/CDN/cache race handling.
- Media: accepted D-060 count/size/formats, EXIF/privacy processing, storage security, progress/retry, pending upload with property Save.
- Super Admin: precise legal state transition/permission matrix, Block/Deactivate public and session effects, audit schema/retention/privacy, notifications and conflicts.
- Copy/routes/mobile numeric breakpoints, billing/pricing pilot model, release phases, CI/QA/security/backup/deployment, verification of separate Codex Phase 0 scaffold.

No business-feature coding authorization. D-029 first Live automatic and D-053/D-063 later Publish Updates deliberately separate; zero property site allowed.

---

## HISTORICAL v5.6 OPEN QUESTIONS BELOW — AUDIT ONLY

# EstateOS — OPEN QUESTIONS v5.6 (AUTHORITATIVE)

## Just CONFIRMED — no longer open

**D-067–D-073 all Option A**, respectively: separate Changes Requested, explicit correction-cycle owner Resubmit, Super Admin reopening Rejected, searchable/filterable All Agencies, distinct reversible reasoned Block/Deactivate, pilot Super Admin + Agency Owner only, persistent minimal audit + in-app status. See `docs/SUPER-ADMIN-REVIEW-LIFECYCLE-v5.6.md` and individual confirmed docs. Their earlier A/B/C comparison is HISTORICAL.

## NEXT batch — D-074 through D-080, ALL PROPOSED ONLY

- D-074 browser authentication/session approach.
- D-075 agency public subdomain/path/custom domain pilot approach.
- D-076 MongoDB tenant storage topology plus server authorization.
- D-077 automatic first-Live readiness recheck execution approach.
- D-078 public property Sold/Rented/Archived visibility policy.
- D-079 post-Live Publish Updates atomicity/partial success handling.
- D-080 CRM/inquiry scope for lean pilot.

Full A/B/C comparison `docs/IMPLEMENTATION-READINESS-BATCH-D074-D080-PROPOSAL.md`. No choice approved or coded.

## Still OPEN after D-067–D-073 approvals

- Review exact persisted state enum/default/mapping and legal transitions, double-submit/reopen race/idempotency, reason length/content/visibility; owner correction screen and permitted fields/validation.
- Admin and owner permission matrix, auth/sessions/password reset, tenant identity and isolation design, approval concurrency/conflict/error recovery.
- D-071 precise separate Block/Deactivate semantics, public website/session/invalidation/publishing effects and reactivation conditions. Do not assume block automatically unpublishes.
- D-073 audit event schema, retention, access, privacy, event integrity, transaction linkage; optional later notifications.
- D-033 automatic readiness recheck triggers, first Live snapshot and optional property inclusion; D-053/D-063 property public eligibility, Sold/Rented/Archived/Restore behavior, publish failure/atomicity/cache/rollback/versioning.
- Agency Profile field requiredness, Save/dirty, profile-to-public website synchronization; property exact types/price validators, processing/resizing/compression, EXIF/privacy, upload retry/transaction state.
- Domain routing/DNS/SSL, Mongo schema/API and security tests, exact UI copy/routes/responsive breakpoints, CRM/Inquiries/billing pilot scope, backups/staging/CI/QA/deployment acceptance criteria.
- Actual Codex Phase 0 scaffold/build status still unverified, and no owner permission for business-feature coding.

---

## HISTORICAL v5.5 OPEN QUESTIONS — AUDIT ONLY

# EstateOS — OPEN QUESTIONS v5.5 (AUTHORITATIVE)

## Just confirmed

D-066 Option A: action-specific compact confirmation dialogs/responsive mobile sheets for Approve, Request Changes and Reject, with D-022 required reasons for last two. Exact validation/copy/transitions/permissions NOT decided. `docs/AGENCY-REVIEW-ACTIONS-D066-CONFIRMED.md`.

## Owner-requested batch — ALL PROPOSED, NONE APPROVED

**D-067–D-073**: Review state model; correction-to-review trigger; rejected recovery; All Agencies directory; Block/Deactivate UX; pilot user roles; audit/notifications. All seven A/B/C choices and recommended A defaults are in `docs/SUPER-ADMIN-BATCH-D067-D073-PROPOSAL.md`.

## Additional unresolved decisions

- Status enums/default/transitions, reason content/length/persistence/owner visibility, approval confirmation exact copy, retry/failure and concurrency, queue sorting/filters/search, admin privileges/tenant isolation, audit retention/notifications, review reopening and suspension/site effects.
- D-033 readiness recheck after approval and initial website snapshot property eligibility; D-063 public Sold/Rented/Archived effect, partial changes, Publish Updates validation/rollback/cache.
- Profile edit/save + public sync, property media processing/security/EXIF/upload retry, authentication/API model, billing/CRM/Inquiries pilot scope, labels/routes/pixel breakpoints and acceptance tests/staging/backups.
- Phase 0 Codex scaffold/build unverified; ONLY skeleton app code previously authorized.

---

## HISTORICAL v5.4 OPEN QUESTIONS — AUDIT ONLY



# EstateOS — OPEN QUESTIONS v5.4 (AUTHORITATIVE)

## Just CONFIRMED

- **D-065 Option A** — one-page Super Admin Agency Review Detail with truthful agency/contact summary, separately displayed review state and website readiness, authorized PRIVATE saved-draft Preview, and visually separated Approve/Request Changes/Reject area. Layout and placement only; canonical `docs/AGENCY-REVIEW-DETAIL-D065-CONFIRMED.md`. Prior D-065 A/B/C proposal HISTORICAL.
- D-064 queue-first dashboard and approved Phase 0 four-app npm workspace ports 4000–4003 remain unchanged.

## NEXT D-066 — PROPOSED ONLY

Choose agency review **action confirmation and reason-entry UX**: A compact action-specific confirmation dialogs/responsive sheets (recommended), B in-page expanding decision panel, C dedicated decision step. `docs/AGENCY-REVIEW-ACTIONS-D066-PROPOSAL.md`. No option approved. D-022 reasons for Request Changes and Reject remain mandatory regardless of choice.

## Still OPEN — no decision authorized by D-065

- Exact action reason-entry UI, reason content/length/persistence/visibility, approval confirmation, success/error states and failed requests, backend review status enum/defaults/transitions, correction/reopen or Request Changes cycles, duplicates/concurrent reviews, audit, notifications and roles/permissions.
- Private saved-draft Preview access control/snapshot, preview failure, dashboard queue columns/search/filters, All Agencies views, Block/Deactivate and effects, exact labels/routes and numeric responsive breakpoints.
- D-033 site readiness rechecks after manual approval, D-029 first-public snapshot property eligibility (zero properties valid), D-063 property Sold/Rented/Archived/Restored public visibility and Publish Updates validation/rollback/cache/authorization.
- Profile Save/unsaved and private/public sync, photo processing/EXIF/privacy/storage/upload retry, domain/tenant isolation/authentication/API schema, QA/deployment/backups, CRM/Inquiries pilot inclusion.
- Phase 0 Codex scaffold actual presence/build/lint/typecheck/health endpoint not verified from planning archive; only skeleton development explicitly authorized.

---

## HISTORICAL v5.3 AND EARLIER OPEN QUESTIONS — AUDIT ONLY

# EstateOS — OPEN QUESTIONS v5.3

## Just resolved / approved

- **D-064 CONFIRMED Option A**: Super Admin dashboard is approval-queue-first, one direct Review action, agency directory secondary. `docs/SUPER-ADMIN-DASHBOARD-D064-CONFIRMED.md`. Old proposal historical.
- **Phase 0 scaffolding configuration confirmed / prompt handed to Codex**: four root app folders (`backend`, `admin`, `super-admin`, `frontend`) with npm workspaces and ports **4003, 4001, 4002, 4000** respectively. `docs/PHASE-0-DEV-SETUP-CONFIRMED.md`. Successful execution NOT yet verified. Prior `pnpm apps/* packages/*` proposal superseded for scaffold.

## NEXT D-065 — PROPOSED ONLY

Agency Review Detail layout A summary-first single page + separate decision panel (recommended), B tabs, C wizard. `docs/AGENCY-REVIEW-DETAIL-D065-PROPOSAL.md`. No selection. Existing D-022 requires Request Changes/Reject reasons; the **UI for collecting reason, transitions and action confirmations** remains open, not automatically approved by D-065.

## Other still OPEN, not silently decided

- Super Admin: exact decision statuses, transitions, reasons form, queue columns/sort/filters/empty/permission states, review detail and private Preview visibility, Create Agency access, Block/Deactivate effects, audit/notifications, errors/concurrency and responsive pixel breakpoints.
- Website activation: first LIVE after manual approval + actual D-033 readiness still auto under D-029 with zero properties and no owner initial Publish/Submit. Exact readiness recheck when an already-approved site becomes ready is OPEN.
- Public property publication D-063: eligibility, first-go-live property snapshot, Sold/Rented/Archived/Restored public visibility, private Preview and Publish Updates validation/atomicity/rollback/cache/permissions/partial errors.
- Agency Profile save/unsaved semantics and Profile-to-public-site sync; photo processing/privacy/EXIF/storage/uploads retries and record transactionality; API/domain/tenant/auth/roles/MongoDB schema and security; numeric design tokens/mobile breakpoints; exact copy/routes; CRM/Inquiries pilot inclusion; QA/deploy/backup readiness.
- Phase 0: actual file output and typecheck/build/health checks, packages versions, DB connection and port occupancy need real environment verification. No business feature implementation permitted without separate owner approval.

---

## HISTORICAL v5.2 AND EARLIER OPEN-QUESTION SNAPSHOTS (AUDIT ONLY)

# EstateOS — OPEN QUESTIONS v5.2

## D-063 is CONFIRMED, not an open choice

The agency-owner approved **Option A: existing explicit Publish Updates for eligible saved property changes on ALREADY-LIVE sites**. Successful Save Property updates private saved draft, not the public website. Canonical `docs/PROPERTY-PUBLIC-PUBLISHING-D063-CONFIRMED.md`. Older `docs/PROPERTY-PUBLIC-PUBLISHING-D063-PROPOSAL.md` is HISTORICAL. D-029 initial automatic launch unchanged, no owner initial Publish/Submit, zero properties allowed.

## NEXT D-064 PROPOSED ONLY — Super Admin dashboard hierarchy

A Review Queue First (recommended), B Agency Directory First, C Metrics First. Details: `docs/SUPER-ADMIN-DASHBOARD-D064-PROPOSAL.md`. Nothing selected and no change to existing agency approval workflow.

## Still OPEN — no implicit decisions

- Property PUBLIC eligibility at first automatic go-live and subsequent Publish Updates; no decision about Sold/Rented/Archived/Restored public display, filter, hiding, or removal; public behavior if optional Properties section hidden.
- Saved property content/deltas in private Preview, pending changes detection, scope of site-level Publish Updates and all-or-nothing transaction, permission/approval blocked states, success/errors, retry, rollback, invalidation of public cache/CDN, conflicts/audit.
- D-062 exact availability enum/default/allowed transitions, Save vs immediate status edits, archive confirmation/filter/restore UX and errors.
- D-061 property record validation failures, upload transactions, media resizing/compression, security, EXIF/GPS privacy, upload progress/retry and storage.
- Agency Profile field requiredness, save/unsaved, public site sync; Super Admin queue ordering, review detail UI, permission roles, status/blocked effects and notifications; exact routes, labels and breakpoint pixels; CRM/Inquiries pilot scope.

---

## HISTORICAL v5.1 AND EARLIER QUESTION LOG

# EstateOS — OPEN QUESTIONS v5.1 (HISTORICAL)

## D-062 NOW CONFIRMED (not an open decision)

Approved Option A: **Available/Sold/Rented availability concepts + reversible Archive/Restore; no permanent MVP Delete**. Canonical `docs/PROPERTY-STATUS-ARCHIVE-D062-CONFIRMED.md`. Do **not** mistake D-062's historical A/B/C proposal for active requirements.

## NEXT D-063 — OPEN: How individual properties become/stop being public

See `docs/PROPERTY-PUBLIC-PUBLISHING-D063-PROPOSAL.md`. A (recommended) saved property changes join explicit site-level Publish Updates for already-Live sites; B separate per-property publish/unpublish; C automatic public property sync. **NO OPTION CONFIRMED.** D-029 initial website auto-Live on Super Admin approval+readiness and D-053 later site-content/theme explicit Publish Updates remain approved as-is.

## Other open details

- Status enums/labels/defaults/for-sale-vs-rent constraints, status transitions and validation, whether status edits share the D-061 Save action, archive confirmation, archived-filter UX, restore placement and permissions.
- Public effect of status/Archive/Restore; initial snapshot eligibility of saved properties; individual record publish/unpublish validation, public visibility, failure/rollback, caching and audit trail.
- D-061 Save persistence and error recovery, pending image uploads and atomicity, D-060 media security/EXIF/processing/progress/retry, and property controls.
- Final property card fields, Profile Save/unsaved and public synchronization, exact English labels/routes, numerical breakpoints, CRM/Inquiries pilot scope.
- Zero-property website, optional photos, first auto-go-live rules unchanged; no new verification/KYC or initial Publish/Submit gate.

---

## Historical v5.0 and older open-question snapshots

# EstateOS — OPEN QUESTIONS (v5.0)

## D-061 CONFIRMED — do not reopen whole-property manual Save policy

**Option A APPROVED:** ONE explicit Save Property for complete Add/Edit record and Save/Discard/Stay on unsaved navigation (navigate after Save only on success; Discard leaves prior persisted record untouched; Stay preserves input). Canonical `docs/PROPERTY-SAVE-UNSAVED-D061-CONFIRMED.md`; old proposal historical. NO autosave, no per-group Property Save. Saving property NOT automatically publishing it publicly.

## NEXT D-062 — PROPOSED ONLY

`docs/PROPERTY-STATUS-ARCHIVE-D062-PROPOSAL.md`: A availability concepts + reversible Archive/Restore (recommended), B two simple visibility-style states + Archive/Restore, C detailed availability + recoverable soft Delete. **NO option approved, no status/archival semantics yet finalized.**

## Still open

- Exact field enums, validations/PKR exceptions, Save success/failure feedback, retry/recovery and in-flight uploading transaction handling.
- Gallery processing, sizing/compression, secure image decoding/EXIF/GPS/privacy, upload progress/cancel/retry/storage/quotas, rejected-file recovery. **D-060 count/MB/formats/per-file errors remain approved.**
- Property lifecycle/status/availability, archive/delete/restore filters, and **individual-property public publication & withdrawal** (independent of D-053 website content/theme post-live Publish Updates).
- Agency Profile requiredness/Save/public synchronization; first-time approval/blocked status UX; cache/rollback; final English labels/route paths/numerical responsive breakpoints; pilot CRM/Inquiries.
- D-029 first website goes live automatically after manual admin approval and D-033 readiness; zero-property websites allowed. **No app code.**

---

## HISTORICAL v4.9 AND EARLIER OPEN QUESTIONS (SUPERSEDED WHERE INCONSISTENT)

# EstateOS — OPEN QUESTIONS (v4.9)

## D-060 CONFIRMED — Do not reopen approved image count/format/size policy

D-060 Option A is confirmed: **10 photos maximum per Property; maximum 5 MB each; JPEG, PNG, WebP; clear per-file validation**. All images including cover remain optional. Canonical: `docs/PROPERTY-PHOTO-LIMITS-D060-CONFIRMED.md`. Earlier proposed B/C and old “D-060 not chosen” statements are HISTORICAL.

## NEXT D-061 PROPOSED ONLY — Property Save and Unsaved Changes

`docs/PROPERTY-SAVE-UNSAVED-D061-PROPOSAL.md` offers A one explicit whole-Property Save and Save/Discard/Stay navigation warning (recommended), B explicit Save and simpler Leave/Keep Editing warning, C property-form autosave. **No Save/dirty UX option is approved yet**; D-050/D-051 website-section form contract does not automatically apply.

## Still undecided

- Exact image processing/resolution/resizing/compression, privacy stripping of EXIF/GPS, security scanning/decoding, storage/storage quotas, file upload progress/cancel/retry, server errors, attachment transactional semantics, thumbnails metadata, rejection recovery and permanent deletion.
- Property form Save/Cancel/unsaved, validation details, enums and PKR price exceptions, statuses/sold/rented/archive/delete, cards/search/filters and **individual property public listing visibility/synchronization**.
- Agency Profile requiredness/save/public sync; D-053 post-live website content/theme publishing failure/retry/cache; public property publication separately open; final labels/routes, mobile breakpoint pixels, CRM pilot scope and Super Admin screens.
- First agency site goes automatically Live when D-029+D-033 approval/readiness satisfied; zero-property website allowed. No application code authorized.

---

## HISTORICAL v4.8 AND EARLIER OPEN-QUESTIONS SNAPSHOTS (SUPERSEDED WHERE INCONSISTENT)


# EstateOS — OPEN QUESTIONS (v4.8)

## D-059 CONFIRMED — Photo gallery interaction, NOT technical limits

Owner approved optional **multi-photo Property gallery**, thumbnails, explicit owner cover selection and simple reorder/remove within the D-057 one-page form. All photos are optional, including cover; D-058 six required Basics still sufficient. Canonical: `docs/PROPERTY-PHOTOS-D059-CONFIRMED.md`. Prior A/B/C is historical.

## NEXT D-060 PROPOSED ONLY — File count / size / type / validation

Decide between proposed A (10 photos, 5 MB each, JPEG/PNG/WebP and per-file messages, recommended), B (6 / 3 MB / JPEG+PNG), C (20 / 10 MB / JPEG+PNG/WebP). **No one selected yet**. Actual processing, EXIF/geolocation privacy, storage, MIME/content checking design, errors/retry, unsaved/pending-upload navigation and deletion/retention still OPEN. See `docs/PROPERTY-PHOTO-LIMITS-D060-PROPOSAL.md`.

## Other still-unresolved decisions

Property Save/cancel/unsaved, listing status/delete, **individual property public publishing**, title/type/price/city validation, public listings/SEO, profile Save/sync, exact labels/routes/breakpoints, accessibility, CRM pilot scope, Super Admin screens. D-029 initial auto-go-live and D-053 website content/theme update semantics unaffected. No app coding authorized.

---

## Historical previous open questions (as of v4.7; superseded by D-059 where inconsistent)

# EstateOS — OPEN QUESTIONS (v4.7)

## D-057 CONFIRMED — Property form grouping (layout only)

Option A approved: ONE responsive Add/Edit Property page with Basics initially visible, and expandable Details and Photos. See `docs/PROPERTY-FORM-D057-CONFIRMED.md`. Not an approved field inventory, property saving rule, photo mandate or public publication policy.

## D-058 CONFIRMED — Property minimum fields and requiredness

**Option A approved:** required to save a property record: **Title, Sale/Rent, Property Type, Price PKR, City, Area/Neighborhood**. Size/unit, beds/baths, description and **all photos including cover** are optional. See `docs/PROPERTY-MINIMUM-FIELDS-D058-CONFIRMED.md`; earlier proposal historical. **Exact** enums/validators, rent-period/price exceptions, save/retry/unsaved guards, listing-status/delete and individual property public publication OPEN.

## NEXT D-059 PROPOSED ONLY — Property Photos UX

Select A optional gallery with thumbnail previews, explicit cover and simple reorder (recommended); B single optional cover; C optional gallery with first photo automatically cover. See `docs/PROPERTY-PHOTOS-D059-PROPOSAL.md`. **No photos required.** Technical upload limits/formats/privacy/error behaviors still OPEN.

**D-054 Option A CONFIRMED:** Already-Live My Website hub displays true Live public status; if there are actual **saved** unpublished changes, also display a clear separate indicator and contextual Publish Updates action. No false pending state when saved draft matches current Live. D-053 post-live edits require explicit subsequent Publish Updates, D-029 FIRST activation remains automatic after manual admin approval + D-033 readiness—no new initial owner Publish/Submit gate. Canonical `docs/MY-WEBSITE-DRAFT-LIVE-D054-CONFIRMED.md`. PLANNING ONLY.

## D-055 CONFIRMED — Agency Profile one-page layout only

Option A: one easily scannable page with essentials immediately visible and optional secondary business details in expandable area. Canonical `docs/AGENCY-PROFILE-UX-D055-CONFIRMED.md`. **Not approved:** exact field requiredness, save/unsaved behavior, public-site synchronization, final labels/routes and breakpoints.

## D-056 CONFIRMED — Responsive Properties listing cards

Option A confirmed: responsive Agency Admin cards (desktop grid; mobile single-column) and optional empty-state Add Property. Canonical `docs/PROPERTIES-LIST-D056-CONFIRMED.md`. **NOT approved:** what fields/cards show, Property Add/Edit, mandatory info, media, statuses/deletion, persistence and public listing publication.

## HISTORICAL v4.5 — D-057 was proposed; CONFIRMED in v4.6

Add/Edit Property form group organization: A one-page Basics + expandable Details/Photos (recommended), B guided steps, C tabs. `docs/PROPERTY-FORM-D057-PROPOSAL.md`. Candidate fields in `docs/PROPERTY-FORM-FIELDS-v4.5-DISCUSSION.md` discussion-only. Exact requiredness, photo limits and live-site mutation rules OPEN.

## Still OPEN

1. **Post-live publishing (D-053 principle confirmed):** exact publication scope (full saved snapshot or subset), who can publish, validating draft readiness, safety/permission, concurrency, all-or-nothing vs partial, submission/retry/rollback and errors, pending saved-vs-Live change detection, empty state, timestamps and audit/revision history, theme update and public-site cache invalidation.
2. **Saved draft Preview:** D-052 displays only successfully persisted section data + applied saved theme. Private Preview authorization/URL, refresh/caching, across tabs/versions, precise mobile/desktop controls are OPEN; no leakage of draft through public URL.
3. **Guided Editor:** D-050 current-section explicit Save; D-051 Save/Discard/Stay; exact prompt/dirty-field criteria, browser reload/back/unload, validation/error/retry, media upload safety, section toggle/reorder persistence, accessibility and concurrency.
4. **Initial activation and controls:** D-029 automatic initial activation after approval+readiness; Approved-but-unready recheck trigger; Block/Deactivate permission/public visibility UX pending. D-045 setup checklist is NOT a gate.
5. **Agency Admin content:** D-054 compact status layout confirmed but exact states/detection/copy OPEN; D-055 one-page profile layout confirmed (exact fields/Save/sync open); final plain-English labels, paths/routes, focus/keyboard/touch interactions, numerical responsive breakpoints, onboarding checklist progress persistence; D-047/D-048 approved hierarchy preserved.
6. **Other visuals:** muted/button/focus text semantic colors, WCAG contrast verification, font weights/line heights/clamp interpolation, spacing/radii, Hero gradient opacity/stops/crop, animations/media sizing.
7. **Properties & CRM:** Profile field requiredness/Save/sync and D-056 confirmed responsive cards (card visible fields TBD), D-057 Add/Edit form layout and fields, gallery limits/image validation, Inquiries/CRM pilot inclusion UNAPPROVED; zero-property sites valid.
8. **Super Admin:** lightweight agency approval/review/block/deactivate screens, practical access guards and minimal notifications/audit.
9. **Engineering:** authorization/isolation, data/hosting/APIs, milestones and deployment only after explicit app-coding permission.

## MVP guardrails

2–3 agency lean pilot, D-028 defers heavy email/KYC/map/doc approval gates; D-030 one template; D-031/D-032 nine sections; D-033 minimal readiness; D-045 nonblocking steps; D-049 draft-only theme Apply; D-050 section Save; D-051 unsaved protection; D-052 private Preview; **D-053 post-live explicit Publish Updates only; D-054 compact Live/unpublished-draft hub when relevant; D-055 one-page Profile layout only; D-056 responsive optional Admin Property cards only**. Historical proposals are not permission to implement.
