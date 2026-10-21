> **RESOLVED/HISTORICAL (v3.3):** Owner chose D-044 **Option A — Task-First Dashboard**. Current authoritative spec: `docs/DASHBOARD-UX-D044-CONFIRMED.md`. Options B/C below remain archival only. Next D-045 proposal is `docs/AGENCY-ADMIN-SCREENS-D045-PROPOSAL.md`.

# D-044 — PROPOSAL: Agency Admin dashboard navigation & home experience

**Status:** PROPOSED / NOT APPROVED | **Prepared:** 2026-10-18 | **Planning bundle:** v3.2 | **Mode:** PLANNING ONLY

## What we are deciding

The pilot targets **2–3 small agencies (typically 1–10 agents)**, many users may not be comfortable with software, and both desktop and mobile are equally important (D-007, D-009, D-011). Agency Admin needs an intuitive way to complete the core journey: agency profile, website editor/preview, optional property listings and simple contact/inquiry handling. **This decision is about the navigation model and home-screen emphasis, not a technical UI implementation or final CRM scope.**

## Option A — Task-first dashboard + guided navigation (RECOMMENDED)

- Desktop: straightforward persistent left sidebar with clear words/icons: **Overview, My Website, Properties, Inquiries, Settings** (labels provisional).
- Mobile: compact header and one simple expandable menu; same destination labels and prominent single-tap action buttons. No crowded desktop-style tables.
- Overview emphasizes status: **Pending / Approved / Blocked / Deactivated** (exact status behavior beyond approved rules still pending), a clear **Website Setup** next step, private preview or live URL as appropriate, and **Add Property (optional)**.
- Minimize analytics noise. Use good empty states: “No properties yet — your website can still go live.” Avoid locked flows that assume mandatory property listings.
- Benefit: familiar navigation, easy mental model, scales as features arrive without redesigning the first screen.

## Option B — Large-card launcher home

- Landing screen is a grid of big touch-friendly cards: **Customize Website, Manage Properties, Inquiries, Agency Profile**.
- Each module uses its own simple screens; global navigation deemphasized.
- Benefit: extremely easy starting point. Tradeoff: repetitive navigation and less efficient switching between modules.

## Option C — Analytics-first SaaS dashboard

- Home prioritizes charts, visitor totals, property activity and lead metrics with navigation alongside.
- Benefit: traditional SaaS appearance. Tradeoff: more complexity, weaker fit for agencies without property data and the small pilot.

## Constraints already CONFIRMED

- Public website Hero D-043 directional gradient **does not set Agency Admin dashboard design**.
- Dashboard itself must look premium but be simple; use **simple English**, work equally well mobile/desktop, and provide useful status/next action without properties (D-007, D-011, D-012, D-003).
- Pending agencies can use private website draft and preview, but no live public website link (D-014/D-015/D-020). D-029/D-033 allow auto-live after Admin approval AND essential site readiness.
- Super Admin still needs approval/block/deactivate controls, but detailed action lifecycle and its UI are separate decisions.
- Do not introduce an elaborate CRM, complex analytics, microservices or extensive KYC gates as a condition of this design decision.

## What remains OPEN after selecting D-044

Exact sidebar menu labels, icons, screen-by-screen wireframes, dashboard analytics, Inquiries/CRM MVP boundary, navigation breakpoints, widths, admin-panel theme colors, font sizes, component specs, backend/API models, status edge cases and implementation schedule.

**Decision requested:** choose A, B or C. Once selected, record `D-044` in `docs/DECISIONS.md`, create a canonical confirmed document and update all AI handovers. **NO CODING**.
