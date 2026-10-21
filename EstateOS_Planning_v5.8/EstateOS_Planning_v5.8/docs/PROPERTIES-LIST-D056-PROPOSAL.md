> **HISTORICAL / RESOLVED IN v4.5:** Owner chose **D-056 Option A — responsive property cards on desktop/mobile** on 2026-10-19. This file preserves the A/B/C alternatives; do not use its earlier OPEN status as authority. Read `docs/PROPERTIES-LIST-D056-CONFIRMED.md`. D-057 Add/Edit form remains proposed only.

# D-056 — PROPOSED ONLY: Optional Properties Listing UX

**Status:** OPEN / UNAPPROVED | **Date:** 2026-10-19 | **Bundle:** v4.4 | **Mode:** PLANNING ONLY

## Owner decision needed

For the initial 2–3 small-agency pilot, which **Properties listing presentation** should the Agency Admin use? This is the listing/view approach only; it does **not** approve Add/Edit schema, photo requirements, individual property publication or CRM.

### Option A — Responsive Property Cards Everywhere (RECOMMENDED)

- Desktop uses a modest responsive card grid; mobile stacks clear full-width cards.
- Each card **could** show a cover photo/placeholder, property title, area, sale/rent, asking price, draft/status cue if later defined, and obvious Edit action.
- Very clear no-properties empty state with optional Add Property CTA; no first-property pressure, no dependency for site readiness.
- Calm, low-cognitive-load UX with reusable presentation components; no dense tables or horizontal scrolling.

### Option B — Desktop List Rows + Mobile Cards

- A compact desktop list with a clear row per property; responsive cards on mobile.
- Allows scanning many properties on desktop but needs two display treatments and corresponding QA.
- Fields/action placement remains proposed.

### Option C — Compact Table at All Sizes

- A traditional multi-column table with actions, condensed for smaller screens (or scrolling if unavoidable).
- Potentially useful for high-volume agency operations but less appropriate for the simple mobile-first pilot.

**Recommendation:** A, considering low-training owner workflows and limited initial listing volumes. Exact card count/columns, spacing, pagination, search, filters and field labels are OPEN.

## Properties listing user journeys to discuss

1. **Empty state:** friendly message; owner may choose Add Property or do nothing. Zero-property agency is still valid.
2. **Has data:** scan/manage cards or rows, edit a chosen property, optionally add another. No invented property statuses or public visibility promises.
3. **Add/Edit:** opens a clear basic-info-first editor. Detailed form buckets discussed separately in `docs/PROPERTIES-SCREENS-D056-DISCUSSION.md`.
4. **Mobile:** primary actions and fields reachable without cramped multi-column layouts.

## Invariants / OPEN boundaries

- D-031 optional Properties public section and D-032 Hide/Show remain. No property requirement for D-033 readiness or D-029 initial automatic first activation.
- D-053 controls saved website draft updates versus public Live site; property record persistence and how listings feed the site are **NOT defined** by D-053. Do not silently publish property additions/edits/removals on already-live sites.
- D-055 one-page Agency Profile is independently confirmed; do not conflate Profile form and Properties form.
- No inferred search, filters, bulk upload, gallery mandatory limits, listing statuses, delete/archive policy, price/size schema, data validation, SEO links, individual listing permissions or CRM/Inquiries inclusion. All remain to decide separately.
- D-056 is **NOT APPROVED** until user explicitly selects A/B/C. No code.
