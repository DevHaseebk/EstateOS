> **v3.5 ACTIVE D-046 OVERRIDE:** Grouped Agency Admin navigation (Option A) CONFIRMED; Theme/Editor/Preview are **My Website** subordinate actions, not top-level links. See `docs/AGENCY-ADMIN-NAVIGATION-D046-CONFIRMED.md`. Detailed proposed screen inventory: `docs/AGENCY-ADMIN-SCREEN-MAP-v3.5-PROPOSAL.md`. D-047 Overview screen hierarchy is unapproved. Historical menu/UX descriptions below remain proposals where not explicitly confirmed; routes, labels, breakpoints, CRM scope open. Planning only.

# D-045 — CONFIRMED: Simple Nonblocking Four-Step Onboarding Checklist

**Status:** CONFIRMED — Option A | **Date:** 2026-10-18 | **Bundle:** v3.4 | **Milestone:** M00 | **Planning only; no code authorized**

## Approved product behavior

Agency Admin Overview includes a **compact, always-optional-to-navigate, four-task website-setup checklist**. It helps a first-time owner find a useful next step without forcing a linear wizard, forbidding access to other pages, or adding a new approval submission process.

Approved four **semantic tasks** (the precise display wording is still open):

1. **Agency Details** — review/update basic business name and contact information (the exact editable fields remain a separate screen-level decision).
2. **Choose Theme** — use the existing ONE premium template and choose one of three fixed themes: Modern Light, Warm Editorial, Contemporary Dark.
3. **Customize Website** — edit approved Core 9 section configuration, especially Hero heading and image, and site contacts.
4. **Preview Website** — access a **private preview** while Pending, or inspect the resulting site when live; this does **not** constitute a publication or approval action.

Each task links directly to the relevant flow. Owners can access any module or task in any order and return later. Do not block screen access based on checklist sequence. **Properties are always optional**: `Add Property` can appear as a separate action, never a fifth required prerequisite or readiness check. The compact checklist may collapse/be deemphasized after activation; exact behavior is open.

## Status and security boundaries

- **Registered/Pending:** Super Admin can already see/review agency; owner can work on private drafts and previews (D-015/D-020). Do not show a public working site link.
- **Approved + ready:** website automatically goes live (D-029) if D-033 essential content is present. No initial Publish or Submit for Approval button created by the checklist.
- **Approved + unready:** no public link until basic readiness met. Exact recheck triggers and checklist progress calculations are OPEN.
- **Blocked/deactivated:** do not imply an active public link; exact owner permissions and lifecycle are OPEN.

Checklist completion tracking and the separate D-033 readiness check are **not equivalent**. For example, privately viewing a preview does not make an unready website publishable, and zero optional property listings never blocks go-live. Exact checklist statuses, progress percentages, completion triggers, persistence, notifications and copy remain OPEN.

## MVP usability and presentation constraints

- Task-first dashboard (D-044), **simple English**, low-training, accessible controls, desktop/mobile parity.
- Desktop: concise progress group on Overview, visible next-action CTA and navigation to relevant setup screen.
- Mobile: stacked or compact checklist; large tap targets; no forced horizontal scrolling or inaccessible drag-only actions.
- Keep UI efficient: one user action should take owner to the needed field without a confusing multistep wizard.
- No analytics-first dashboard, extra CRM gate, forced verification document/map check, or payment step.

## Explicit non-decisions / dependencies

D-045 **does not approve**:
- Exact labels, route paths or final screen count; menu structure (next D-046).
- Responsive pixel breakpoints, layout measurements, precise mobile drawer/bottom-navigation pattern.
- Checklist item completion logic, percent calculations, storage schema, auto-hide behavior.
- Final API behavior for post-live draft/publish changes or readiness rechecks.
- Whether Inquiries/CRM is within MVP, staff roles, precise property forms, or Super Admin Block/Deactivate flow.

Canonical sources: `docs/DECISIONS.md` (D-044 and D-045), `docs/DASHBOARD-UX-D044-CONFIRMED.md`, `docs/SITE-READINESS-D033-CONFIRMED.md`, `docs/AI/CURRENT-STATE.md`.

**No application code is authorized.**
