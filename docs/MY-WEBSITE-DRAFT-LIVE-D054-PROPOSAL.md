> **RESOLVED/HISTORICAL — D-054 Option A CONFIRMED in v4.3 (2026-10-19).** The A/B/C below remain decision history, **not** implementation choices. Read `docs/MY-WEBSITE-DRAFT-LIVE-D054-CONFIRMED.md` for authoritative current scope. Next D-055 Agency Profile UX is proposal-only.

# D-054 — PROPOSED ONLY: Show Draft vs Live Status on My Website

**Decision:** D-054 | **Status:** OPEN / NOT APPROVED | **Proposed:** 2026-10-19 | **Bundle:** v4.2 | **Milestone:** M00 / Agency Website UX | **PLANNING ONLY**

## Why the next UX choice matters

**D-053 is now CONFIRMED:** For an **already-Live** website, current-section Save (D-050) and theme Apply (D-049) change only the saved private draft. D-052 Preview shows saved draft; live site remains on previously published version until **owner deliberately Publish Updates**. D-029 initial automatic go-live after manual Super Admin approval AND D-033 readiness is entirely separate, and **never** needs an initial owner Publish or Submit gate. We now need a simple way for nontechnical agency owners to understand the difference between what is saved and what is actually public.

The following A/B/C choices are **mutually exclusive recommendations for the primary My Website *landing* presentation**; implementation details (dirty detection, dates, comparison algorithms, failure statuses) are still OPEN.

## Option A — Compact Live Status + Unpublished Changes Indicator (RECOMMENDED)

- On already-Live My Website hub, display a clear *public status* (Live) separately from *private draft state* (e.g. Changes ready to publish), with **one prominent contextual `Publish Updates` action when relevant**. Access to Edit, Theme and saved-draft Preview stays visible under the main area (D-048).
- When saved draft does not differ from published version, don't imply a pending release; the exact empty/disabled state is future detail.
- For Pending/Approved-unready first-time websites, show their actual non-Live statuses and setup/edit guidance—not a Publish Updates gate.
- Advantages: smallest learning curve and compact mobile/desktop UI; avoids large change logs. Tradeoff: less detail about which sections changed.

## Option B — Changed-Sections Summary

- Make a summary of draft changes (e.g. Hero, About, Theme) the primary hub panel, then a separate intentional `Publish Updates` action. Needs accurate diff/change-count logic and may feel busy to small agencies.
- Still preserve D-048 status/readiness and D-053 explicit owner publication.

## Option C — Side-by-Side Draft vs Live Workspace

- The My Website hub shows separate visual representations of Saved Draft and Published Live site as its main concept, plus the deliberate publish action; more powerful review, heavier responsive UI and extra navigation complexity.
- Still no additional Super Admin approval gate or auto-publish.

## Regardless of chosen option — OPEN

- Exact labels/copy, routes, button placement, state detection, comparison/last-published timestamp, permission guards and blocked/deactivated behavior.
- Which saved content is included in one publish, validation/success/failure/rollback, cross-tab consistency and public caching; all details of D-053 mechanics.
- Mobile breakpoint values, UI accessibility/focus, Preview cache URLs and CRM pilot scope.

## Suggested owner follow-up

`EstateOS D-054 ke liye Option A/B/C approve karta hoon. D-054 CONFIRMED mark karke v4.3 planning ZIP aur AI handover update karo; exact wording/routes, state comparison, publish validation/recovery, breakpoints aur CRM scope pending rakho. Phir Agency Profile/Properties UX discuss karo.`

**Do not implement any D-054 choice until owner approves.**
