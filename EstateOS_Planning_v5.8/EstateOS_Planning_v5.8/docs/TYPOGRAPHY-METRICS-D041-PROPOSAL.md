> **RESOLVED / HISTORICAL ONLY (v3.0):** D-041 Option A Balanced Premium endpoints were confirmed by the owner on 2026-10-18. Use `docs/TYPOGRAPHY-METRICS-D041-CONFIRMED.md` for the binding values. Options B/C below are not approved. Interpolation, weights, line heights and other tokens remain OPEN.

# EstateOS — D-041 PROPOSAL: Numeric Fluid Typography Sizes

**Status: PROPOSED / NOT APPROVED** | **Prepared: 2026-10-18** | **Bundle v2.9** | **PLANNING ONLY**

## Binding decisions

- D-040: one **shared fluid responsive** scale across all three themes (e.g., `clamp()` with numeric limits chosen later).
- D-039: Manrope for Modern Light/Dark heading roles; Playfair Display for Warm Editorial display; Inter for all body/UI.
- D-035: Full-Bleed Hero with readable text/CTA; D-038: identical geometry and type scale across presets.

## Next user choice: visual density of the numerical scale

The table values below are **sample candidate endpoints in CSS `rem` (assuming the browser default 16px) solely for comparison**. Selecting an option requires owner approval before any value becomes binding. Middle values/clamp interpolation, line heights, weights, letter spacing and exact styles are still independent decisions unless explicitly approved.

| Option | Feel | Example Hero heading mobile → desktop | Example section H2 mobile → desktop | Body |
|---|---|---|---|---|
| A — Balanced (recommended) | Premium but restrained, long-headline friendly | 2.5rem → 4.5rem | 1.75rem → 2.75rem | 1rem standard |
| B — Editorial Large | Dramatic campaign-style headings, more photo impact | 2.75rem → 5.5rem | 2rem → 3.25rem | 1rem standard |
| C — Compact Practical | Higher information density, quieter visuals | 2.125rem → 3.75rem | 1.5rem → 2.375rem | 1rem standard |

These are candidate endpoints only. They are **not approved colors, weights, spacings, breakpoints, line heights or complete `clamp` expressions**. Keep all font metrics unconfirmed in v2.9.

## Recommendation

**A — Balanced** tends to fit a broad mix of agency content and supports nontechnical owners who may write long headings; the Full-Bleed Hero can remain premium through photography and typography families without oversize copy. Check responsive previews at narrow/mobile/desktop and 200% zoom during eventual QA.

## Open after D-041 if strategy is approved

Final full token table and precise interpolation syntax; font weights/line heights/tracking, exact palette HEX, spacing, radius, Hero overlay/crop, motion and media limits. No coding without an explicit future implementation signoff.
