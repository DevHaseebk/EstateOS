> **v4.2 D-053 later decision (canonical override):** Changes to an **already-Live** website persist privately after section Save/theme Apply; owner must explicitly `Publish Updates` to change the public version. Exact publication validations/failure/sync remain OPEN. First D-029 go-live is still automatic after Super Admin approval and D-033 readiness with NO initial owner publish/submit. Canonical `docs/POST-LIVE-UPDATES-D053-CONFIRMED.md`. This file describes an earlier decision and does not override D-053.

> **v4.1 PREVIEW CLARIFICATION:** D-052 Option A is now CONFIRMED: private Website Preview renders only successfully persisted sections + applied theme. D-051 guards dirty editor exit; this does NOT settle updates to an already-Live public site (next D-053 PROPOSED). Canonical `docs/WEBSITE-EDITOR-PREVIEW-D052-CONFIRMED.md`.

> **v3.9 ACTIVE — D-050 OPTION A CONFIRMED (2026-10-19):** Guided Website Editor uses **explicit section-level manual `Save Changes`** on the current section. No ordinary autosave or global Save All as the main model. Save success means **persisted authorized draft/edit, NOT automatic production republish**. D-049 theme Apply stays separate. Canonical `docs/WEBSITE-EDITOR-SAVING-D050-CONFIRMED.md`. **NEXT D-051 PROPOSED ONLY:** unsaved-section navigation protection (`docs/WEBSITE-EDITOR-UNSAVED-D051-PROPOSAL.md`). Unsaved warnings, Preview sync, post-live publication, exact English labels/routes, pixel breakpoints and pilot CRM scope remain OPEN. **PLANNING ONLY — NO APP CODE.**

> **v3.8 D-049 current override:** Theme picker previews candidates without saving, with explicit Apply/Save to commit. Cancel/Back preserves the saved style. Confirmed: `docs/THEME-SELECTION-D049-CONFIRMED.md`. D-050 editor content save is UNAPPROVED (`docs/WEBSITE-EDITOR-SAVING-D050-PROPOSAL.md`). Historical proposals below may use older undecided wording; do not infer post-live publication or new approval gates.

# D-048 — CONFIRMED: Guided My Website Hub (Option A)

**Decision:** D-048 | **Status:** CONFIRMED | **Owner approval:** Option A | **Date:** 2026-10-19 | **Bundle:** v3.7 | **Mode:** PLANNING ONLY

## What the owner approved

The **My Website** landing area is a **guided, status/readiness-first hub**, rather than an editor-first screen or simple collection of equally important tabs. The hub is subordinate to the Agency Admin grouping approved in D-046, and does not replace the separate D-047 Agency Admin Overview screen.

1. **Website state and readiness first.** Communicate actual agency approval and actual website readiness/live availability accurately and separately. If essentials are missing, show concise next-step guidance based on the D-033 requirements; do not imply that agency approval means site is already Live.
2. **One visually primary website-edit action** suitable to the user's real state; examples like `Edit Website` or `Complete Website` are *illustrative, not final copy*. The hub must keep access to the website editor clear and simple. Restricted agency actions are subject to an unapproved Block/Deactivate policy; never promise an unavailable action.
3. **Three direct, obvious subordinate tools**, under/after the main status/CTA area: **Theme Selection**, **Guided Website Editor**, **Preview Website**. Users can enter these independently without a forced wizard; tools remain under My Website (D-046), not top-level sidebar destinations. The preview of a Pending or unready draft is **authenticated and private**.
4. **Only genuine Live websites get a real public link**, never an invented or placeholder URL. D-029 remains authoritative: initial publication happens automatically after *manual Super Admin approval* AND site readiness under D-033; no new owner Publish or Submit-for-Approval step is created.
5. **Responsive information hierarchy stays consistent**: compact but spacious desktop arrangement and a clear, touch-friendly stacked mobile layout. No hover-only controls; actual breakpoint values are not specified by this decision.

## Site essentials (readiness is not a new checklist gate)

Use the pre-existing D-033 essentials only: selected single approved template, real agency name, real Hero heading, **phone OR WhatsApp**, and appropriate owner-uploaded OR genuinely licensed platform-default Hero visual. Logo, About, Services, Team, Properties and their content are optional for initial activation. **Zero-property sites are valid**. The D-045 four nonblocking onboarding shortcuts are not a submit/publish prerequisite.

## Website-theme and editor boundaries (not approved by D-048)

- D-030: **ONE shared public-site template**; D-034: exactly three style presets (Modern Light, Warm Editorial, Contemporary Dark). D-037/D-042: fixed curated palettes; no custom HEX, custom accent or logo-derived palette.
- D-031/D-032: 9 public sections. Header/Footer fixed. Hero and Contact CTA cannot be hidden. Only eligible optional sections can be hidden/shown or moved with simple Move Up/Down controls; no drag-only interactions.
- D-035/D-043: full-bleed Hero with directional gradient; exact overlay/media/crop values are still OPEN.
- Choosing a theme, previewing before saving, undoing a change, previewing unsaved edits, and publishing edits after a site is Live **are undecided**. Do not convert the v3.7 discussion proposals into implementation requirements.

## Proposed conceptual screen hierarchy (not final copy or component specification)

`My Website` → accurate readiness/status → **one main edit/continue action** → direct `Theme / Editor / Preview` shortcuts → public `Open Website` link **only if genuinely Live**.

The actual design could use cards, rows or links; these visual choices and wording are not approved. No analytics, Inquiries/CRM, staff roles, marketing automation or new activation gates added.

## Acceptance criteria for eventual specification

- Pending agencies can orient themselves and find their **private** website draft/editor/preview without encountering a public link.
- Approved-but-unready agency sees missing essentials and no broken Live URL.
- Real Live URL only shown for an approved and ready **actually published** site.
- Single main website CTA and three clearly accessible, non-wizard tools are usable on mobile and desktop.
- Existing D-045 checklist, D-046 nav grouping, D-047 Overview hierarchy and optional Properties all remain intact.

## OPEN — future approvals required

Exact English labels and route paths; readiness UI treatment/status-specific CTA selection; authorized Block/Deactivate behavior; **D-049 Theme Selection interaction CONFIRMED; D-050 editor section Save CONFIRMED; other details (next proposal)**; editor save/unsaved/error/preview states; draft edits versus Live updates; precise mobile breakpoint and menu mechanism; onboarding progress persistence; Inquiries/CRM pilot scope; image limits and crop controls; outstanding design tokens and accessibility verification.

**Source proposal:** `docs/MY-WEBSITE-HUB-D048-PROPOSAL.md` (A/B/C alternatives; RESOLVED/HISTORICAL). **Next:** `docs/THEME-SELECTION-D049-PROPOSAL.md`. **Related editor discussion:** `docs/WEBSITE-EDITOR-D050-DISCUSSION.md`. Application coding is not authorized.
