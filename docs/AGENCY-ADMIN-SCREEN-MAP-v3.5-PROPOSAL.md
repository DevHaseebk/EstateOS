> **v4.3 CURRENT:** D-054 Option A already-Live My Website compact Live/unpublished status confirmed; this old screen map remains PROPOSED historical context. Profile layout D-055 and Properties details UNAPPROVED; newer discussion `docs/AGENCY-PROFILE-PROPERTIES-UX-v4.3-DISCUSSION.md`.

> **v3.9 ACTIVE — D-050 OPTION A CONFIRMED (2026-10-19):** Guided Website Editor uses **explicit section-level manual `Save Changes`** on the current section. No ordinary autosave or global Save All as the main model. Save success means **persisted authorized draft/edit, NOT automatic production republish**. D-049 theme Apply stays separate. Canonical `docs/WEBSITE-EDITOR-SAVING-D050-CONFIRMED.md`. **NEXT D-051 PROPOSED ONLY:** unsaved-section navigation protection (`docs/WEBSITE-EDITOR-UNSAVED-D051-PROPOSAL.md`). Unsaved warnings, Preview sync, post-live publication, exact English labels/routes, pixel breakpoints and pilot CRM scope remain OPEN. **PLANNING ONLY — NO APP CODE.**

> **v3.8 D-049 current override:** Theme picker previews candidates without saving, with explicit Apply/Save to commit. Cancel/Back preserves the saved style. Confirmed: `docs/THEME-SELECTION-D049-CONFIRMED.md`. D-050 editor content save is UNAPPROVED (`docs/WEBSITE-EDITOR-SAVING-D050-PROPOSAL.md`). Historical proposals below may use older undecided wording; do not infer post-live publication or new approval gates.

> **v3.6 OVERRIDE:** D-047 Overview hierarchy Option A is **CONFIRMED** (status + one CTA first). All other detailed screen fields, labels, Save behavior and routes below remain PROPOSED. Canonical D-047: `docs/AGENCY-ADMIN-OVERVIEW-D047-CONFIRMED.md`. Next D-048 hub layout is NOT approved.

# Agency Admin — Screen-by-Screen UX and Key Actions (PROPOSED)

**Bundle:** v3.5 | **Status:** PLANNING / PROPOSED, not a new owner-approved decision | **Depends on:** D-044 Task-First; D-045 four-task nonblocking checklist; D-046 grouped navigation.

This document intentionally records **candidate** screen details to discuss individually. D-046 approved **navigation grouping**, not these proposed screens' exact layouts, labels, routes, fields or workflow steps. Do not implement proposals before separate owner approval.

## Shared navigation principle (D-046 CONFIRMED)

Desktop: compact sidebar with few main destinations. Mobile: compact clear menu exposing the same destinations; labels/icons accessible, no deep multi-layer menus. Theme, Guided Editor and Preview are **inside the My Website area**. Agencies can freely change modules; checklist shortcuts are direct navigation.

## Candidate screens and their main job

| Candidate screen | What owner sees | Proposed primary action | Proposed secondary actions | Mobile suggestion / state |
|---|---|---|---|---|
| **Overview** | Actual agency approval/site status; next meaningful task; D-045 4-task checklist; small optional property shortcut | `Customize Website` / `Continue Setup` conditionally | `Preview Website`; `View Live Site` only when actually live; `Add Property` optional | Status + one clear CTA first, checklist underneath, single column |
| **My Website (hub)** | Selected fixed theme; website readiness essentials; relevant editor and preview entry points; valid public link only when live | `Edit Website` | `Choose Theme`, `Preview Website`, `Open Live Website` when live | Stacked action cards, simple copy, no complex tabs required |
| **Theme selection** (within My Website) | Modern Light / Warm Editorial / Contemporary Dark, one shared template, no independent palettes/font size inputs | `Select Theme` | Preview a candidate appearance | Vertical theme cards on mobile; saved vs previewed distinction remains to decide |
| **Guided Website Editor** (within My Website) | Core nine sections with Header/Footer fixed, Hero + Contact CTA visible, five optional rearrangeable sections; per-section forms | `Save Draft` (proposed label; post-live semantics OPEN) | Edit section, Move Up/Down, visibility toggle where allowed, Preview | One section editor at a time; no drag-only ordering; upload errors recoverable |
| **Preview / site status** (within My Website) | Authenticated private draft preview while Pending; website status; actual URL if published | `Back to Editor` or `Open Live Website` when live | Copy actual live link if valid | Full-width preview with obvious Back, no public URL for Pending/unready |
| **Properties** | Existing listings or honest zero-properties message, no forced creation | `Add Property` | View/Edit an existing property when present | Card/list state without dense horizontal data table |
| **Add/Edit Property** (subview of Properties) | Short grouped property fields, images and validation feedback (exact fields TBD) | `Save` | Cancel / Return | Progressive grouped form, camera-friendly upload; property publication policy OPEN |
| **Agency Profile** | Agency details and usable phone/WhatsApp; no KYC-heavy pilot forms | `Save Changes` | Return to setup | Single-column or short grouped inputs; D-033 readiness checks independent |
| **Settings** | A small number of account preferences (details TBD) | `Save Settings` | Account/profile access | Clear forms; do not invent billing, staff permissions or integrations |
| **Inquiries** | **NOT APPROVED in pilot** | None defined | Pilot inclusion and scope TBD | Do not show in approved navigation until a separate decision |

## Overview status-dependent example (D-047 hierarchy CONFIRMED Option A; example labels/actions still proposed)

- **Pending:** `Pending Approval`, one useful setup action, `Preview Website` explicitly private; do not show public link. Submission to a fresh approval queue is not required: D-020 immediate Pending.
- **Approved but unready:** identify missing D-033 essential details (approved template, real agency name, Hero heading, usable phone OR WhatsApp, suitable uploaded OR licensed default Hero image). No dummy URL; retry rule TBD.
- **Live (Approved and Ready):** `Website Live`, real `Open Website`/Copy Link affordance, optional edit/property actions. **Post-live changes and republishing still require later approval.**
- **Blocked/Deactivated:** ensure not mistaken for Live; exact access and feedback TBD, do not design fake status promises.

## Candidate cross-screen flow

`Register (6 basic fields) -> Pending Overview -> choose any checklist task -> My Website: Theme / Editor / Private Preview -> Super Admin approves -> initial auto-live only when site ready -> Overview/My Website show actual link`. A profile may be edited while Pending; Properties can remain empty throughout. Super Admin workflows are a separate upcoming specification.

## Open UX items to lock one at a time

1. **D-047 CONFIRMED Option A:** Overview status-first + one primary CTA, then checklist, then optional Properties. See `docs/AGENCY-ADMIN-OVERVIEW-D047-CONFIRMED.md`. This document remains proposed for individual screen details.
2. My Website hub arrangement and theme-picker selection/preview behavior.
3. Guided Editor save, validation, navigation, section controls and post-live edit policy.
4. Property list/add/edit actual required fields and media.
5. Profile vs Settings field allocation, exact final English copy, empty/success/error states.
6. Mobile menu mechanism, page widths and responsive breakpoints.
7. Pilot Inquiries/CRM inclusion; if included, specify tenant/privacy rules.

**This screen map is proposed only. No app source code, deployments or runtime behavior authorized.**
