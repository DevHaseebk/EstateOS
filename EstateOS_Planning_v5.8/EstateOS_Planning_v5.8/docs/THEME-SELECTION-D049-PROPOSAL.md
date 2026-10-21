> **HISTORICAL / RESOLVED in v3.8:** Owner CONFIRMED D-049 **Option A — Preview candidate first, then explicit Apply/Save** on 2026-10-19. Alternatives B/C were not approved. This file preserves the earlier options only; the authoritative spec is `docs/THEME-SELECTION-D049-CONFIRMED.md`. Do not use the old “NOT APPROVED” status below as current D-049 status. Editor saving remains OPEN under D-050.

# D-049 — PROPOSED ONLY: Theme Selection Preview vs Save Behavior

**Status:** NOT APPROVED | **Bundle:** v3.7 | **Date:** 2026-10-19 | **Next owner decision:** D-049 | **Mode:** PLANNING ONLY

## Existing non-negotiable approvals

- D-048 **Guided My Website Hub** is confirmed; Theme Selection is a directly accessible child of the My Website hub, not a top-level menu link.
- D-030: **one** public template. Theme selector chooses style **only**, without changing sections/content/tenant ownership. D-034 themes are Modern Light, Warm Editorial, Contemporary Dark only.
- D-037/D-042 fixed premium palettes (four exact HEX tokens per theme), D-039 fonts, D-038 shared geometry: no free color picker, additional templates or theme-specific section layouts.
- D-033 site readiness only; logo and Properties remain optional. Pending site remains private; public link only when approved+ready/actually live under D-029. Theme selection behavior must not silently change initial publish or post-live editing rules.

## Independent decision: What happens when an owner taps a theme?

### Option A — Preview first; explicit apply/save (RECOMMENDED)

Three theme cards indicate the **currently saved selection**. Tapping a different card lets the owner visually **compare the candidate theme without changing the saved choice**. A clear, deliberate `Apply Theme`/`Save Theme` step then confirms the choice. `Cancel`/back preserves previously saved selection. Button words and exact preview mechanics remain unapproved. Ideal for nontechnical users: minimizes accidental permanent theme changes. Implementation must distinguish temporary comparison from saved data and not leak private drafts.

### Option B — Instant apply, with undo

Tapping any theme immediately changes the saved draft selection. Show clear saved state and a simple way to undo/change again. Fewer taps but increases accidental changes. Whether undo is time-limited or merely reselect is open.

### Option C — Select card, confirm in small dialog

Tap a card, then confirm in a simple confirmation dialog; no special candidate-theme visual comparison before saving. Straightforward but a modal can be unnecessary friction on mobile.

## Suggested candidate Theme Selection screen (all options, PROPOSAL)

- Three recognizable theme cards with name and small preview; one marked currently selected.
- One brief sentence: theme changes visual style, **not** the single template, agency data or section contents.
- Clean responsive layout: cards in desktop grid, accessible vertical stack on narrow screens, obvious keyboard/touch focus.
- Returning to the D-048 My Website hub is always obvious.
- A saved theme is a readiness input only insofar as already specified in D-033; no *additional* readiness gate.

## Still OPEN even if an option is approved

Theme picker exact CTA English labels, sample image source/licensing, exact preview surface (inline vs fullscreen), draft unsaved editor conflicts, request/error/toast states, responsive breakpoint pixels, post-live theme edits/re-publishing, theme change history, accessibility audits and complete persistence rules. No new owner-side Publish step.

**Owner reply example:** `EstateOS D-049 ke liye Option A/B/C approve karta hoon. D-049 CONFIRMED mark karke v3.8 Markdown ZIP aur AI handover update karo. Exact labels/routes, editor saving, post-live editing, mobile breakpoint numbers aur CRM scope pending rakho. Phir D-050 Guided Editor save behavior discuss karo.`
