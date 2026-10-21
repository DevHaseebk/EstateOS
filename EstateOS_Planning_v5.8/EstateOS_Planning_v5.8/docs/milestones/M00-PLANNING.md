# M00 — v5.8 CURRENT PLANNING MILESTONE NOTE (2026-10-21)

D-081…D-087 Option A now CONFIRMED, D-074…D-080 unchanged. Phase 0 only has existing Codex code authorization, with execution unverified. No permission for business-feature development; D088…D094 are proposals only. Next action: install documentation carefully and run Claude **READ-ONLY** comprehensive review before seeking owner approval for Phase 1. See `docs/AI/CLAUDE-COMPREHENSIVE-REVIEW-PROMPT.md` and `docs/AI/ROOT-INSTALL-AND-MERGE-GUIDE.md`.

---

## v5.6 CURRENT MILESTONE STATUS

Owner approved D-067…D-073 Option A on Super Admin lifecycle/directory/block/roles/audit; feature code **NOT** authorized. Fast-track next D-074…D-080 is **PROPOSED ONLY**, no automatic option selection. Phase 0 four-app npm scaffolding at ports 4000–4003 was separately authorized but execution/build is unverified. `docs/PHASE-0-DEV-SETUP-CONFIRMED.md` governs this small scope. Preserve D-022/D-028/D-029/D-033/D-053/D-063.

---

> **v5.4 CURRENT / AUTHORITATIVE — D-065 OPTION A CONFIRMED (2026-10-21):** Super Admin **Agency Review Detail uses ONE responsive page**: agency/owner identity and contact summary, **agency review status displayed separately from D-033 website readiness**, an **authorized PRIVATE saved-draft Preview** shortcut, and a **distinct, clearly visible decision area** with existing **Approve / Request Changes / Reject** actions. Approval is **layout and placement only**. D-022 **Request Changes and Reject require reasons**; exact reason UI, approval confirmation, statuses/transitions, security permissions, review concurrency/audit/notifications and routes/breakpoints are OPEN. Canonical `docs/AGENCY-REVIEW-DETAIL-D065-CONFIRMED.md`; original D-065 A/B/C proposal is HISTORICAL. **NEXT D-066 PROPOSED ONLY** in `docs/AGENCY-REVIEW-ACTIONS-D066-PROPOSAL.md`: A action-specific confirmation dialogs/sheets (recommended), B in-page action panel, C dedicated decision step. **UNCHANGED** D-028 lean Pending signup (no new mandatory KYC/email verification), D-029 + D-033 FIRST public website go-live AUTOMATIC only after manual Super Admin agency approval AND website readiness (no owner initial Publish/Submit; zero properties allowed), and D-053/D-063 deliberate owner Publish Updates for already-Live saved theme/sections/eligible property changes. **Phase 0 only independently owner-authorized:** four root apps `backend/` Express/TS/Mongoose port 4003, `admin/` Next.js port 4001, `super-admin/` Next.js port 4002, `frontend/` Next.js port 4000; root npm workspaces. Codex scaffold execution NOT verified, no feature development authorized. All detailed review UX, property publishing edge cases and CRM pilot scope remain OPEN.

> **v5.3 HISTORICAL SNAPSHOT — D-064 OPTION A CONFIRMED (2026-10-21):** Super Admin dashboard prioritizes **Pending Agency Review queue**, with one obvious **Review** action per agency and **All Agencies directory secondary**. This approves hierarchy **ONLY**; detailed review screen/actions/status transitions, moderation permissions/audit/notifications, filters/copy/routes/breakpoints remain OPEN. Canonical `docs/SUPER-ADMIN-DASHBOARD-D064-CONFIRMED.md`. Prior D-064 A/B/C proposal HISTORICAL. **NEXT D-065 PROPOSED ONLY:** `docs/AGENCY-REVIEW-DETAIL-D065-PROPOSAL.md` (A single-page summary + separate decision panel recommended; B two tabs; C wizard). **Phase 0 OWNER-AUTHORIZED scaffold only:** `backend/` Express/TS/Mongoose 4003; `admin/` Next.js 4001; `super-admin/` Next.js 4002; `frontend/` Next.js 4000; **npm workspaces** at root. Old pnpm + `apps/*` / `packages/*` scaffolding examples are SUPERSEDED for Phase 0; read `docs/PHASE-0-DEV-SETUP-CONFIRMED.md`. Codex has been prompted for skeleton; successful execution NOT VERIFIED; no other application features authorized. **D-028 lean signup and D-022 review reasons, D-029 + D-033 first automatic site go-live (no initial Publish/Submit, zero properties valid), and D-053 + D-063 already-Live owner Publish Updates are UNCHANGED.** Public property eligibility, admin agency transitions and CRM scope OPEN.

> **v5.2 AUTHORITATIVE — D-063 OPTION A CONFIRMED (2026-10-21):** For **already-Live** agency websites, successful whole-record **Save Property** adds/edits saved property draft ONLY; it does **not** immediately update public listings. Reuse the EXISTING explicit owner **Publish Updates** (D-053) for **eligible saved property changes together with saved section/theme changes**; no default per-property Publish button and no automatic public sync. D-062 Available/Sold/Rented + reversible Archive/Restore unchanged; **public eligibility, visibility of Sold/Rented/Archived, unpublishing, publish scope/validation/retry/rollback/cache are STILL OPEN**. **D-029 FIRST agency website go-live is automatic** only after manual Super Admin approval + D-033 readiness; **never add initial owner Publish/Submit gate; ZERO properties are allowed**. Canonical `docs/PROPERTY-PUBLIC-PUBLISHING-D063-CONFIRMED.md`; original D-063 proposal is HISTORICAL. **NEXT D-064 PROPOSED ONLY:** `docs/SUPER-ADMIN-DASHBOARD-D064-PROPOSAL.md` (Super Admin queue-first vs directory-first vs analytics-first). Exact review UX/status transitions, labels/routes/breakpoints and pilot CRM open. **PLANNING ONLY — NO APPLICATION CODE.**

> **v5.1 CURRENT — D-062 OPTION A CONFIRMED (2026-10-21):** Property availability concepts **Available / Sold / Rented** plus a SEPARATE, reversible **Archive / Restore** action. **NO permanent Delete in MVP**. This decides internal property-management UX, **NOT per-property public visibility**, exact enum values, transition rules, confirmation/restore details, or Save interactions. Canonical `docs/PROPERTY-STATUS-ARCHIVE-D062-CONFIRMED.md`; original A/B/C proposal is **HISTORICAL**. **NEXT D-063 PROPOSED ONLY:** `docs/PROPERTY-PUBLIC-PUBLISHING-D063-PROPOSAL.md` asks how saved properties/availability/archive affect public agency sites; NONE of its A/B/C alternatives approved. D-061 one whole-record Save + Save/Discard/Stay, D-058 required six fields, D-059/D-060 optional up to 10 photos at 5 MB JPEG/PNG/WebP UNCHANGED. D-029 FIRST site activation automatic after manual Super Admin approval + D-033 readiness, no initial owner Publish/Submit and ZERO properties permitted. D-053 explicit Publish Updates for already-Live **website content/theme** UNCHANGED; do not automatically extend it to property records. Still OPEN: public-property publication/unpublication, status validators/transitions/defaults, archive/restore UX, failure/rollback, image security/upload handling, exact labels/routes/breakpoints and CRM. **PLANNING ONLY — NO APPLICATION CODE.**

> **v4.6 CURRENT — D-057 OPTION A CONFIRMED (2026-10-19):** Agency Admin **Add/Edit Property form is ONE responsive page**, Basics visible first, **Property Details and Photos in expandable/collapsible groups** below; no wizard/tabs. **FORM LAYOUT ONLY**; actual fields/requiredness, Save/unsaved behavior, photo limits, property record status/delete and public property listing publication remain OPEN. D-056 responsive Agency Admin property cards and zero-property valid site remain. Canonical `docs/PROPERTY-FORM-D057-CONFIRMED.md`; D-057 A/B/C proposal now HISTORICAL. **NEXT D-058 PROPOSED ONLY:** choose required/optional property fields (`docs/PROPERTY-MINIMUM-FIELDS-D058-PROPOSAL.md`): A six useful basics (recommended), B ultra-lean four, C detailed photo/size required. D-029 first website go-live automatic (manual Super Admin approval + D-033 readiness; no owner Publish/Submit); D-053 subsequent website content/theme Publish Updates still explicit; individual property publication NOT decided. **PLANNING ONLY, NO CODE.**

> **v4.5 HISTORICAL SNAPSHOT — D-056 OPTION A CONFIRMED (2026-10-19):** Agency Admin optional **Properties list uses responsive property CARDS on desktop and mobile** (grid desktop, single-column stacked mobile; exact counts/breakpoint pixel values TBD). Friendly empty state with optional Add Property; zero-property agencies may launch. This is **LISTING PRESENTATION ONLY**: card metadata, property schema/requiredness, photos, save/status/delete, public listing publishing, search/filters, routes and CRM scope remain OPEN. Canonical `docs/PROPERTIES-LIST-D056-CONFIRMED.md`; old D-056 A/B/C proposal HISTORICAL. **NEXT D-057 PROPOSED ONLY:** Add/Edit Property FORM grouping, see `docs/PROPERTY-FORM-D057-PROPOSAL.md` (A one-page essentials + expandable sections recommended; B short wizard; C tabs). D-029 initial automatic go-live and D-053 explicit post-live website-content/theme Publish Updates unchanged; do NOT invent how individual property records publish. **PLANNING ONLY, NO APP CODE.**

> **v4.3 ACTIVE — D-054 OPTION A CONFIRMED (2026-10-19):** For an **ALREADY-LIVE** agency site, the D-048 My Website hub shows **true Live public status separately from private saved-draft status**. When there are genuinely unpublished saved changes, show a clear **Unpublished Changes** indicator and **one contextual Publish Updates action** (D-053). When there are no unpublished saved changes, do not claim an update is pending. Normal Edit / Theme / Private Saved-Draft Preview remain accessible. **D-029 first-ever go-live remains AUTOMATIC** after manual Super Admin agency approval AND D-033 readiness, without initial owner Publish/Submit. Exact comparison/detection, labels, publish validation, failure/rollback/cache, permissions, routes/breakpoints, and CRM are OPEN. Canonical `docs/MY-WEBSITE-DRAFT-LIVE-D054-CONFIRMED.md`. **NEXT D-055 PROPOSED ONLY:** Agency Profile UX layout, `docs/AGENCY-PROFILE-UX-D055-PROPOSAL.md`; Properties field/workflow discussion remains UNAPPROVED. **PLANNING ONLY — NO APP CODE.**

> **v4.2 HISTORICAL SNAPSHOT — D-053 OPTION A CONFIRMED (2026-10-19):** For **ALREADY-LIVE** websites, `D-050` current-section Save and `D-049` theme Apply persist **private draft only**; `D-052` Preview shows saved draft. The Live public site does **NOT** change until an authorized owner deliberately chooses **Publish Updates**. Exact publish scope, validations, failure/rollback and cache behavior remain OPEN. **D-029 first-ever go-live stays AUTOMATIC** upon manual Super Admin agency approval **AND** D-033 readiness; NO new initial owner Publish/Submit gate. Canonical `docs/POST-LIVE-UPDATES-D053-CONFIRMED.md`. **NEXT D-054 PROPOSED ONLY:** choose My Website hub Draft-vs-Live status presentation, `docs/MY-WEBSITE-DRAFT-LIVE-D054-PROPOSAL.md`. Final labels/routes, responsive pixel breakpoints, Preview sync/retry and pilot CRM scope still OPEN. **PLANNING ONLY — NO APP CODE.**

> **v4.1 ACTIVE — D-052 OPTION A CONFIRMED (2026-10-19):** Agency Admin Website Preview renders **only successfully persisted section draft content** (D-050/D-051) plus the **currently saved/applied theme** (D-049). Unsaved form inputs and un-applied candidate themes do not appear in this committed-draft Preview; before leaving a dirty editor section D-051 **Save / Discard / Stay** guard applies. It is **private and not evidence of publication**; a Pending/unready agency has NO public site link. Canonical `docs/WEBSITE-EDITOR-PREVIEW-D052-CONFIRMED.md`. **NEXT D-053 PROPOSED ONLY:** post-live draft changes / publication behavior (`docs/POST-LIVE-UPDATES-D053-PROPOSAL.md`), and does not change D-029 first auto-activation. Exact Preview copy/routes, caching/refresh/synchronization, save-error handling, already-Live updates, responsive breakpoints and CRM pilot scope remain OPEN. **PLANNING ONLY — NO APP CODE.**

> **v4.0 HISTORICAL SNAPSHOT — D-051 OPTION A CONFIRMED (2026-10-19):** Guided Website Editor dirty-section navigation uses **Save / Discard / Stay** protection. Save commits **only the current section** (D-050) and proceeds **after actual success**; Discard abandons only current unsaved edits and proceeds; Stay cancels navigation and preserves edits. Applies to switching sections, leaving for My Website, and entering Preview; exact prompt/browser-navigation implementation and failure UX remain OPEN. Canonical `docs/WEBSITE-EDITOR-UNSAVED-D051-CONFIRMED.md`. **NEXT D-052 PROPOSED ONLY:** private Preview saved-draft synchronization (`docs/WEBSITE-EDITOR-PREVIEW-D052-PROPOSAL.md`). Theme Apply is separate (D-049); section Save is NOT post-live Publish; Pending preview private, real site link only when live after manual approval + readiness. English copy/routes, numeric breakpoints and CRM pilot scope OPEN. **PLANNING ONLY — NO APP CODE.**

> **v3.9 HISTORICAL SNAPSHOT — D-050 OPTION A CONFIRMED (2026-10-19):** Guided Website Editor uses **explicit section-level manual `Save Changes`** on the current section. No ordinary autosave or global Save All as the main model. Save success means **persisted authorized draft/edit, NOT automatic production republish**. D-049 theme Apply stays separate. Canonical `docs/WEBSITE-EDITOR-SAVING-D050-CONFIRMED.md`. **NEXT D-051 PROPOSED ONLY:** unsaved-section navigation protection (`docs/WEBSITE-EDITOR-UNSAVED-D051-PROPOSAL.md`). Unsaved warnings, Preview sync, post-live publication, exact English labels/routes, pixel breakpoints and pilot CRM scope remain OPEN. **PLANNING ONLY — NO APP CODE.**

> **v3.6 active owner decision:** D-047 Option A **CONFIRMED** Agency Overview status-first → one main CTA → D-045 four-item checklist → optional Add Property. D-048 My Website hub A/B/C **PROPOSED only**. Canonical `docs/AGENCY-ADMIN-OVERVIEW-D047-CONFIRMED.md`, `docs/MY-WEBSITE-HUB-D048-PROPOSAL.md`. Planning-only; no code.

> **v3.5 ACTIVE D-046 OVERRIDE:** Grouped Agency Admin navigation (Option A) CONFIRMED; Theme/Editor/Preview are **My Website** subordinate actions, not top-level links. See `docs/AGENCY-ADMIN-NAVIGATION-D046-CONFIRMED.md`. Detailed proposed screen inventory: `docs/AGENCY-ADMIN-SCREEN-MAP-v3.5-PROPOSAL.md`. D-047 Option A Overview screen hierarchy is CONFIRMED; D-048 hub screen hierarchy is proposed only. Historical menu/UX descriptions below remain proposals where not explicitly confirmed; routes, labels, breakpoints, CRM scope open. Planning only.

> **v3.4 CURRENT — D-045 Option A CONFIRMED:** Agency Admin Overview has a **compact, nonblocking four-step setup checklist** (Agency Details, Choose Theme, Customize Website, Preview Website); tasks can be visited in any order and Properties remain optional. Canonical: `docs/AGENCY-ONBOARDING-D045-CONFIRMED.md`. **NEXT D-046 PROPOSED ONLY**: navigation/screen grouping in `docs/AGENCY-ADMIN-NAVIGATION-D046-PROPOSAL.md`. Exact page labels/routes, responsive breakpoints and pilot CRM scope remain OPEN. **PLANNING ONLY / NO CODING.**

# M00 — Lean Pilot Product Discovery


> **v2.7 design status:** D-035 Full-Bleed Image Hero and D-036 Option B Editorial Contrast typography and D-037 Option A fixed curated palettes are CONFIRMED. Exact font names, HEX palettes, Hero overlay/crop metrics, media limits, animations and responsive sizes remain OPEN; D-038 shared geometry CONFIRMED; numeric token values pending.


Status: IN PROGRESS / PLANNING ONLY (v4.2, 2026-10-19)

## Approved

- Small agencies (1–10 agents); 2–3 agency pilot; 5–10 owner hours/week.
- Agency basic profile, premium template-specific section editing, hero/logo/media, OPTIONAL property records, zero-listing website.
- Pending immediately after self-registration; Super Admin sees all agencies, private site preview and can Approve/Block/Deactivate.
- Public link hidden/not usable until approval.
- No MVP email verification approval gate, office proof/map KYC or retention workflow; D-028 defers older verification decisions.
- Claude/Cursor/Codex shared docs, milestones, simple maintainable code, premium low-training UX, desktop/mobile parity.

## To confirm before implementation

- [x] D-029: automatic initial go-live and link for approved + ready website.
- [x] D-030: one premium template, customizable sections and theme presets.
- [x] D-031 Core 9 section catalog (Header, Hero, About, Services, optional Properties, Why Choose Us, Team, Contact CTA, Footer).
- [x] D-032 initial editable field inventory, guided section visibility and Move Up/Down controls.
- [x] D-033 Option A: essential website readiness — template, agency name, Hero heading, phone/WhatsApp and licensed default OR owner Hero image; logo/About/Services/Properties optional.
- [x] D-034: three curated theme styles (Modern Light, Warm Editorial, Contemporary Dark) on one template.
- [x] D-035 Full-Bleed Image Hero across all themes.
- [x] D-036 Editorial Contrast typography direction; exact color/font tokens still open.
- [x] D-037 Option A: exactly one fixed curated color palette for each of the three presets; no owner custom colors or extra swatches.
- [x] D-038 Option A: unified spacing/layout/breakpoints/card-button geometry across presets (numeric values still OPEN).
- [x] D-039 Option A: Manrope headings for Modern Light/Dark, Playfair Display display headings for Warm Editorial, Inter all body/UI.
- [x] D-040 Option A: one shared fluid responsive typography strategy across three themes (no numeric values).
- [x] D-041 Option A Balanced Premium typography endpoints: Hero 40→72px, section H2 28→44px, body 16px.
- [x] D-042 Option A Refined Neutral — exact four-role HEX values per preset confirmed (`docs/COLOR-HEX-D042-CONFIRMED.md`).
- [x] D-043 Option A directional dark gradient Hero overlay approach CONFIRMED; exact numeric overlay settings still OPEN.
- [x] D-044 Agency Admin task-first dashboard/home navigation approach (Option A CONFIRMED; exact menu names/pages pending).
- [x] D-045 Option A: compact nonblocking four-step Agency Admin checklist CONFIRMED.
- [x] D-046 Agency Admin grouped navigation, Theme/Editor/Preview under My Website.
- [x] D-047 Status-first Overview with one CTA, nonblocking checklist and optional Property.
- [x] D-048 Guided My Website hub.
- [x] D-049 Candidate Theme Preview then explicit Apply/Save.
- [x] D-050 Per-section manual Save Changes for Guided Editor forms; no ordinary autosave/global Save All.
- [x] D-051 Save / Discard / Stay unsaved changes navigation guard.
- [x] D-052 Private Preview shows only saved section data and applied theme.
- [x] D-053 Already-Live public website updates via separate owner Publish Updates; NOT first go-live.
- [ ] D-054 My Website Draft-vs-Live primary status UI (PROPOSED ONLY).
- [ ] Remaining semantic tokens, interaction colors, actual accessibility/contrast checks; final fluid interpolation/weights/line heights remain separately open.
- [ ] Essential signup/profile fields and Super Admin-create flow.
- [ ] Exact character/card limits, remaining semantic theme colors, typography interpolation/weights/line heights (D-041 endpoints approved), Hero overlay/crop details, website-media rules and post-live draft save/publish behavior (field types, sections and template count approved).
- [ ] Block/Deactivate behavior and allowed status transitions.
- [ ] Optional property fields and list/detail UX.
- [ ] CRM/contact inquiry pilot inclusion.
- [ ] UX wireframes/design system, APIs/data model, monorepo, tech stack, QA/deploy plan.
- [ ] Owner expressly authorizes coding after planning milestones.

## Exit gate

A small complete pilot with clear acceptance criteria and explicit out-of-scope list agreed. **No coding yet.**

> **v2.8 D-039:** Font family names now CONFIRMED, while font weights/sizes, numeric tokens and D-040 typography scale approach remain OPEN.

> **Historical v2.9 D-040 (superseded by v3.0 below):** Option A shared fluid responsive typography CONFIRMED; numeric font sizing/weights/line heights remain OPEN; next D-041 proposed.

> **v3.0:** D-041 Option A endpoints CONFIRMED; numerical interpolation/weights/line heights not yet approved. Next D-042 proposed palette HEX selection. **No code authorization.**

> **v3.1 active milestone:** D-042 confirmed; next D-043 overlay strategy proposed only; no application code authorized.


> **v4.5 M00 current override:** D-054 Live+unpublished status, D-055 one-page Agency Profile and **D-056 Agency Admin responsive property cards** are all CONFIRMED. Any unchecked or older next-step D-054/D-055/D-056 references above are **historical**. **NEXT D-057 UNAPPROVED:** Add/Edit Property form organization (`docs/PROPERTY-FORM-D057-PROPOSAL.md`). Required fields/photos/status/delete and individual property public publishing OPEN. D-029 first auto-activation and D-053 deliberate later site updates stay. No app coding authorized.
