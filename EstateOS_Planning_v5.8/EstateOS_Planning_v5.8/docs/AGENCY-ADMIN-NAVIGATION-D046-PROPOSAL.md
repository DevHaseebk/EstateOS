> **RESOLVED / HISTORICAL AS OF v3.5:** Owner confirmed **D-046 Option A — Grouped Navigation** on 2026-10-19. This file documents previously considered alternatives; do NOT implement B/C or treat this file as the active spec. Authoritative: `docs/AGENCY-ADMIN-NAVIGATION-D046-CONFIRMED.md`. Exact labels/routes/breakpoints and CRM scope remain OPEN. Next: D-047 (`docs/AGENCY-ADMIN-OVERVIEW-D047-PROPOSAL.md`) is **PROPOSED ONLY**.

# D-046 — PROPOSED: Agency Admin Navigation and Screen Grouping

**Status:** PROPOSED — not approved | **Version:** v3.4 | **Do not implement this proposal without approval**

## Context (already approved)

- D-044: task-first, premium-but-simple dashboard; conventional desktop sidebar and obvious compact mobile navigation.
- D-045: four-item, nonblocking setup checklist: Agency Details, Choose Theme, Customize Website, Preview Website. The checklist is a shortcut, **not** four mandatory navigation pages and not a step-gated wizard.
- D-030/31/32/34: one premium website template, Core 9 guided sections, three curated themes. Property listings optional, including zero-property website.
- D-029/D-033: Super Admin Approved + website Ready auto-live; Pending owner has private preview, not live link.
- MVP Inquiries/CRM inclusion remains undecided; mock menus must not silently include it as approved.

## Suggested screen inventory (all specific names/routes are PROPOSED)

| Candidate screen | Owner job | Primary action | Mobile pattern |
|---|---|---|---|
| Overview | See approval/live status, four-step checklist and next action | Customize Website | Single-column status + checklist |
| My Website | See current theme, editor entry, preview and live link only if live | Edit Website | Compact action cards |
| Theme Picker | Select one of 3 approved visual presets | Choose Theme | Stacked theme cards |
| Website Editor | Edit guided Core 9 sections | Edit/Save Draft | One section/form at a time; no drag-only ordering |
| Preview | Inspect private draft or live site | Back to Editor | Separate/full-width preview |
| Agency Profile | Update agency name and contacts | Save Changes | Clear grouped short form |
| Properties | View and manage optional listings | Add Property | Cards/empty state |
| Add/Edit Property | Enter property details (exact fields OPEN) | Save | Progressive short form |
| Account/Settings | Account/preferences | Save Settings | Minimal grouped controls |
| Inquiries | **ONLY if later approved for pilot** | View Request | Simple card list |

Super Admin is a distinct application area; its agency list, review, Approve, Block, Deactivate screens are not part of this Agency Admin navigation decision.

## D-046 decision alternatives

**Option A — Grouped Navigation (RECOMMENDED)**
- Top-level desktop sidebar: `Overview`, `My Website`, `Properties`, `Agency Profile`, and `Settings` as candidate labels; theme, editor, and preview are **inside My Website**, not extra top-level links.
- Four-step checklist on Overview deep-links to relevant screen.
- Mobile has a compact `Menu` entry exposing same choices; simple one-screen-at-a-time editor.
- No `Inquiries` item until its inclusion is separately approved.
- Strengths: 4–5 obvious modules, logical hierarchy, minimal clutter.

**Option B — Flat Navigation**
- Independent sidebar items for `Overview`, `Agency Profile`, `Choose Theme`, `Website Editor`, `Preview`, `Properties`, `Settings`.
- Easier direct access from menu, but longer and more intimidating for low-training agency users; extra mobile navigation complexity.

**Option C — Home-Hub Navigation**
- Main dashboard remains a large-card hub, top-level navigation limited to `Home`/`Menu` with module shortcuts rather than a persistent sidebar structure.
- Could work on phones, but conflicts somewhat with D-044's conventional desktop sidebar direction and increases backtracking.

### Recommended next approval flow

1. Ask owner to choose A/B/C for D-046 **navigation grouping only**.
2. Then separately approve exact screen names, page route map and key screen interactions.
3. Then mobile navigation mechanics/wireframes, accessibility QA, and finally optional Inquiries/CRM pilot inclusion.

**Still OPEN regardless of D-046 choice:** route strings, final English labels, breakpoint pixels, final form fields and media constraints, CRM pilot inclusion, post-live publication states, Block/Deactivate lifecycle, developer implementation approach.

**Planning only.**
