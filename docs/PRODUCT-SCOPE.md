## v5.6 CURRENT PILOT ROLE/NOTIFICATION SCOPE

D-072 pilot roles only **Super Admin and Agency Owner**; staff members/fine-grained RBAC deferred. D-073 basic authoritative audit history for critical admin review/operational actions and authorized in-app status, automated emails/SMS not mandatory. D-070 searchable agency directory, D-071 distinct reversible Block/Deactivate with reasons, exact public/site effects pending. CRM/Inquiries pilot scope remains **OPEN**, offered as unapproved D-080 choice in `docs/IMPLEMENTATION-READINESS-BATCH-D074-D080-PROPOSAL.md`. D-028 signup, D-029 first activation, D-053/D-063 later Publish Updates unchanged.

---

> **v5.4 CURRENT / AUTHORITATIVE — D-065 OPTION A CONFIRMED (2026-10-21):** Super Admin **Agency Review Detail uses ONE responsive page**: agency/owner identity and contact summary, **agency review status displayed separately from D-033 website readiness**, an **authorized PRIVATE saved-draft Preview** shortcut, and a **distinct, clearly visible decision area** with existing **Approve / Request Changes / Reject** actions. Approval is **layout and placement only**. D-022 **Request Changes and Reject require reasons**; exact reason UI, approval confirmation, statuses/transitions, security permissions, review concurrency/audit/notifications and routes/breakpoints are OPEN. Canonical `docs/AGENCY-REVIEW-DETAIL-D065-CONFIRMED.md`; original D-065 A/B/C proposal is HISTORICAL. **NEXT D-066 PROPOSED ONLY** in `docs/AGENCY-REVIEW-ACTIONS-D066-PROPOSAL.md`: A action-specific confirmation dialogs/sheets (recommended), B in-page action panel, C dedicated decision step. **UNCHANGED** D-028 lean Pending signup (no new mandatory KYC/email verification), D-029 + D-033 FIRST public website go-live AUTOMATIC only after manual Super Admin agency approval AND website readiness (no owner initial Publish/Submit; zero properties allowed), and D-053/D-063 deliberate owner Publish Updates for already-Live saved theme/sections/eligible property changes. **Phase 0 only independently owner-authorized:** four root apps `backend/` Express/TS/Mongoose port 4003, `admin/` Next.js port 4001, `super-admin/` Next.js port 4002, `frontend/` Next.js port 4000; root npm workspaces. Codex scaffold execution NOT verified, no feature development authorized. All detailed review UX, property publishing edge cases and CRM pilot scope remain OPEN.

> **v5.2 AUTHORITATIVE — D-063 OPTION A CONFIRMED (2026-10-21):** For **already-Live** agency websites, successful whole-record **Save Property** adds/edits saved property draft ONLY; it does **not** immediately update public listings. Reuse the EXISTING explicit owner **Publish Updates** (D-053) for **eligible saved property changes together with saved section/theme changes**; no default per-property Publish button and no automatic public sync. D-062 Available/Sold/Rented + reversible Archive/Restore unchanged; **public eligibility, visibility of Sold/Rented/Archived, unpublishing, publish scope/validation/retry/rollback/cache are STILL OPEN**. **D-029 FIRST agency website go-live is automatic** only after manual Super Admin approval + D-033 readiness; **never add initial owner Publish/Submit gate; ZERO properties are allowed**. Canonical `docs/PROPERTY-PUBLIC-PUBLISHING-D063-CONFIRMED.md`; original D-063 proposal is HISTORICAL. **NEXT D-064 PROPOSED ONLY:** `docs/SUPER-ADMIN-DASHBOARD-D064-PROPOSAL.md` (Super Admin queue-first vs directory-first vs analytics-first). Exact review UX/status transitions, labels/routes/breakpoints and pilot CRM open. **PLANNING ONLY — NO APPLICATION CODE.**

> **v3.5 ACTIVE D-046 OVERRIDE:** Grouped Agency Admin navigation (Option A) CONFIRMED; Theme/Editor/Preview are **My Website** subordinate actions, not top-level links. See `docs/AGENCY-ADMIN-NAVIGATION-D046-CONFIRMED.md`. Detailed proposed screen inventory: `docs/AGENCY-ADMIN-SCREEN-MAP-v3.5-PROPOSAL.md`. D-047 Overview screen hierarchy is unapproved. Historical menu/UX descriptions below remain proposals where not explicitly confirmed; routes, labels, breakpoints, CRM scope open. Planning only.

> **v3.4 CURRENT — D-045 Option A CONFIRMED:** Agency Admin Overview has a **compact, nonblocking four-step setup checklist** (Agency Details, Choose Theme, Customize Website, Preview Website); tasks can be visited in any order and Properties remain optional. Canonical: `docs/AGENCY-ONBOARDING-D045-CONFIRMED.md`. **NEXT D-046 PROPOSED ONLY**: navigation/screen grouping in `docs/AGENCY-ADMIN-NAVIGATION-D046-PROPOSAL.md`. Exact page labels/routes, responsive breakpoints and pilot CRM scope remain OPEN. **PLANNING ONLY / NO CODING.**

# EstateOS — Product Scope (current)


> **v2.5 / ACTIVE D-035 + D-036:** Full-Bleed Image Hero CONFIRMED on all three presets (`docs/HERO-D035-CONFIRMED.md`); Editorial Contrast typography CONFIRMED Option B (`docs/TYPOGRAPHY-D036-CONFIRMED.md`): Warm Editorial serif DISPLAY headings + sans body/UI; other two presets sans headings/body. Any old D-035/D-036 OPEN references in historical notes are superseded. Exact font names, HEX colors, overlay metrics, media rules and breakpoint values remain OPEN; next D-037 color controls are PROPOSED only.


Read `docs/MVP-RESET-v1.7.md` first. **M00 / planning only.**

## Long-term vision (confirmed D-001–D-003)
Hybrid multi-tenant real-estate agency SaaS: branded section-builder websites + optional property management + simple CRM, with platform Super Admin. Agencies must have useful premium websites even when they have **no properties**.

## Pilot MVP priority (confirmed direction D-028)
- Audience: small agencies (1–10 agents); 2–3 initial pilot users, user has 5–10 development hours/week.
- Agency via self-service or Super Admin creation; basic details. Immediately Pending and visible to Super Admin.
- Select a website template, fill template-specific content (logo, hero image/text, About, Services, Contact), preview privately; property entry optional.
- Super Admin reviews all agencies/data/private draft; can Approve, Block and Deactivate.
- No public link or public activation before manual approval.
- Website needs premium, simple, equally good desktop and mobile UX in plain English.
- Do not demand business proof, map pin or email verification as pilot approval gates; older detailed decisions are deferred to future via D-028.

## Proposed but not yet approved
- **CONFIRMED D-030:** ONE excellent section-based website template with editable sections and theme presets. **D-031 CONFIRMED Core 9 section catalog** (global Header/Footer; Hero, About, Services, optional Properties, Why Choose Us, Team, Contact CTA). D-032 approved initial field categories, guided show/hide and Move Up/Down; exact text/media/theme hex/font choices remain OPEN (D-034 preset count/moods confirmed); **D-033 CONFIRMED** minimum site readiness (selected template, real agency name, Hero heading, usable phone OR WhatsApp, uploaded OR legitimate default Hero image).
- **D-029 CONFIRMED:** admin approval automatically makes **ready** site live and shows working URL; no extra owner first Publish. Remaining OPEN: public routes, exact text/media limits, theme styles and later content change/publish workflow. Site readiness now follows D-033.
- Minimal CRM lead inbox in pilot versus next milestone.
- Super Admin action/status semantics for Block vs Deactivate.
- Technical stack and final repository layout.

## Non-negotiables
Tenant isolation, secure login and media, server-side permission enforcement, honest data, low-complexity maintainable architecture and shared Claude/Cursor/Codex docs. No implementation before explicit authorization.


## v2.3 current design scope (D-034 CONFIRMED)

The **single** MVP site template offers **Modern Light, Warm Editorial and Contemporary Dark** styling presets. This approval does **not** add new templates, property dependencies, full visual-builder controls or design tokens. Exact hex colors, font families, Hero layout and breakpoint values remain OPEN; see `docs/THEME-D034-CONFIRMED.md` and `docs/VISUAL-D035-PROPOSAL.md`.


## v3.3 D-044 Task-First Agency Admin direction (CONFIRMED)

The pilot's Agency Admin Overview is task-first: surface current status, next website setup action and simple access to edit/preview; properties remain optional. Prefer clear desktop sidebar-style navigation and a compact understandable mobile menu over analytics-first charts. **D-044 does not approve exact navigation labels, a screen list, an onboarding checklist, or CRM/Inquiries inclusion.** Canonical `docs/DASHBOARD-UX-D044-CONFIRMED.md`; next UX screen map/checklist proposal `docs/AGENCY-ADMIN-SCREENS-D045-PROPOSAL.md` is UNAPPROVED. All code remains unauthorized.


## v3.4 — Agency onboarding interaction (D-045 CONFIRMED)

Task-first Overview includes four nonblocking setup steps: Agency Details / Choose Theme / Customize Website / Preview Website. Property listing stays optional, nothing new required for Super Admin approval or ready-site automatic activation. Detailed navigation/grouping awaits D-046. No CRM features implied by sample screens. Canonical `docs/AGENCY-ONBOARDING-D045-CONFIRMED.md`.
