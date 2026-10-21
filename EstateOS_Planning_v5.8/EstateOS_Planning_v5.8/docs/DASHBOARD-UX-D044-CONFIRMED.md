> **v3.5 ACTIVE D-046 OVERRIDE:** Grouped Agency Admin navigation (Option A) CONFIRMED; Theme/Editor/Preview are **My Website** subordinate actions, not top-level links. See `docs/AGENCY-ADMIN-NAVIGATION-D046-CONFIRMED.md`. Detailed proposed screen inventory: `docs/AGENCY-ADMIN-SCREEN-MAP-v3.5-PROPOSAL.md`. D-047 Overview screen hierarchy is unapproved. Historical menu/UX descriptions below remain proposals where not explicitly confirmed; routes, labels, breakpoints, CRM scope open. Planning only.

# D-044 — CONFIRMED: Task-First Agency Admin Dashboard

**Status:** CONFIRMED (Option A) | **Approved by owner:** 2026-10-18 | **Planning package:** v3.3 | **No code authorized**

## Scope of approval

Agency Admin for the lean 2–3 agency pilot uses a **task-first dashboard**. A nontechnical agency owner should immediately identify agency/public-site status and the next useful action without navigating analytics. The experience must remain equally usable on desktop and mobile, with premium but uncluttered styling and **simple English**.

### Approved interaction principles

1. **Guided overview/home** prioritizes status, a clear next step, primary website actions and meaningful empty states. Website setup and preview are more prominent than analytics charts.
2. **Clear conventional navigation** between Overview, website setup/editing, optional property work, inquiries if included, and agency settings/profile. The list is illustrative: the exact menu labels, number of items, information architecture and inquiry pilot scope are **NOT** fixed by D-044.
3. **Desktop:** straightforward persistent/sidebar-style navigation is the selected direction. Avoid busy analytics-first dashboards.
4. **Mobile:** a compact menu or equivalent obvious navigation, vertically stacked concise status/actions, touch-friendly controls; do not force desktop tables or a crowded multi-column editor on phones.
5. **Primary homepage actions:** Customize Website, Preview Website, optional Add Property, and Visit Website / Copy Live Link **only when the site is actually live**. Final wording/order and context-specific disabled states remain subject to next UX approval.
6. **No property prerequisite:** zero property records still allows an agency website to become ready/live under D-033; any property empty state must explicitly say this.
7. **Private/public boundary:** Pending owner sees private preview, no publicly working site link. Approved + D-033-ready website auto-activates under D-029. Other statuses must not leak published pages when publishing is prohibited; exact Block/Deactivate lifecycle remains OPEN.
8. **Usability checks:** simple labels, prominent status messaging, validation near relevant inputs, meaningful loading/empty/error states and accessible keyboard/touch controls. Exact measurements and interaction-copy specifications remain pending.

## Proposed navigation shape — not final names or module acceptance

- `Overview`: status and next action; no dense charts.
- `My Website`: choose confirmed single template/three themes, edit Core 9 sections, private preview, see live status/link.
- `Properties`: optional listing manager and simple add/edit workflow; exact property fields/scope pending.
- `Inquiries`: **candidate** entry point only, because lead/CRM inclusion in the pilot is still OPEN; do not implement this module because it appears in a mock navigation.
- `Settings`: agency profile and contact details; team management remains separately OPEN.

## Screen-by-screen proposal

The exact pages, menus, onboarding checklist and responsive patterns are **PROPOSED ONLY** in `docs/AGENCY-ADMIN-SCREENS-D045-PROPOSAL.md`.

## Explicit NON-decisions

D-044 does **not** approve: final route map, exact menu labels, exact responsive breakpoints, dashboard theme palettes, chart widgets, CRM/inquiry scope, onboarding checklist mechanism, publishing of post-live edits, Block/Deactivate state transitions, mobile editor layout, backend models, animations, spacing or accessibility certification.

## Related confirmed decisions

- D-007 (premium but low-complexity UX); D-009 (small agencies), D-011 (mobile/desktop parity), D-012 (simple English).
- D-015 (Pending draft/private preview), D-020 (immediate Pending), D-028 (lean MVP overrides heavyweight verification), D-029 (approved+ready auto-live), D-033 (essential readiness), D-030–D-043 (public website builder/design).

**Status:** Planning only. Do not scaffold or code any application without explicit authorization.


## Follow-up confirmation (v3.4, D-045)

The first-run guidance is now **CONFIRMED Option A:** four-task nonblocking checklist in Overview (Agency Details, Choose Theme, Customize Website, Preview Website). This complements, but does not change, D-044 task-first dashboard. Canonical `docs/AGENCY-ONBOARDING-D045-CONFIRMED.md`. Navigation/screen grouping is still PROPOSED D-046; exact labels and routes OPEN.
