# D-046 — CONFIRMED: Grouped Agency Admin Navigation

**Owner decision:** Option A — Grouped Navigation | **Status:** CONFIRMED | **Date:** 2026-10-19 | **Bundle:** v3.5 | **Mode:** PLANNING ONLY

## What the owner approved (structural navigation, not exact labels)

1. Agency Admin uses a **short set of top-level destinations** rather than making every website editing view a separate sidebar item. Candidate human-friendly module names for design discussion: **Overview, My Website, Properties, Agency Profile, Settings**. These strings are *examples* and **not final English copy or approved routes**.
2. **Theme selection, the guided Website Editor, and Preview live inside the My Website module**, available as clear subordinate views/actions, rather than three separate top-level destinations. Do not confuse these with separate selectable website templates: D-030 permits ONE template with three D-034 style presets.
3. The D-045 four setup checklist tasks on Overview act as direct links to relevant destinations; a user can also navigate freely via the menu. No enforced wizard or extra approval gate.
4. Desktop navigation uses a **compact, legible sidebar** as D-044 intended; mobile exposes the **same top-level destinations through a clear compact menu** with readable labels and touch-friendly controls. Avoid multiple competing nested drawers or icon-only core navigation. The exact mobile control (sheet/drawer/etc.) and numerical breakpoint remain OPEN.
5. The optional **Properties** module is discoverable even when an agency has zero listings. Creating any property is never required to get a site ready or live; show an honest zero-property state (not fake inventory).
6. **Inquiries/CRM is NOT a confirmed pilot navigation item.** Decide its inclusion separately. Super Admin has a distinct admin area and must not be merged into the agency sidebar.
7. Agency/site status and next action stay prominent on Overview as required by D-044. No analytics-first dashboard. The navigation grouping neither guarantees nor changes public publication: D-029 + D-033 still require Super Admin approval AND essential site readiness.

## Candidate information architecture (illustrative only)

```text
Agency Admin (top-level grouping CONFIRMED; labels PROPOSED)
├── Overview
│   ├── Agency approval / website-live status
│   └── D-045 nonblocking setup checklist + next action
├── My Website
│   ├── Theme Selection
│   ├── Guided Website Editor (D-031 / D-032)
│   └── Preview / Website Status (private while Pending)
├── Properties (optional content; zero-property support)
│   ├── Property List / Empty State
│   └── Add / Edit Property
├── Agency Profile
│   └── Agency and contact details
└── Settings
    └── Account preferences
```

**Not locked by D-046:** finalized sidebar order/names, whether a candidate screen has an independent URL, path patterns, breadcrumb design, action labels, mobile drawer/sheet behavior, menu expanded/collapsed persistence, breakpoint values, property form fields, all optional CRM inclusion, admin palette/style, specific page layouts, onboarding progress persistence, post-live republish/revert policy, Block/Deactivate semantics.

## Pilot states and safety constraints

- **Pending:** owner may edit drafts and use authenticated/private website preview; no publicly working site link. Super Admin can see private agency draft under admin authorization.
- **Approved + essential site ready:** D-029 initial auto-live and show the actual live URL.
- **Approved + unready:** no broken public link. Recheck/retry timing remains OPEN.
- **Blocked/deactivated:** preserve role/status authorization; precise lifecycle rules OPEN. Do not imply the same as a live agency.
- No mandatory email/KYC/proof/map gate from old D-018/D-021/D-023–D-027 (deferred by D-028).

## Definition of done for this planning decision

- Grouped top-level structure across desktop/mobile documented, with website tools nested under My Website.
- D-045 checklist routes users into relevant groups without mandatory sequence.
- Exact screen labels and route paths kept unapproved.
- Next independent decision: **D-047 Agency Admin Overview screen hierarchy and status/CTA placement**. See `docs/AGENCY-ADMIN-OVERVIEW-D047-PROPOSAL.md`.

**No application code is authorized.**
