> **v3.0 update:** D-041 CONFIRMED Option A Balanced Premium **size endpoints**: Hero 40→72px, major H2 28→44px, body 16px. Refer to `docs/TYPOGRAPHY-METRICS-D041-CONFIRMED.md` for active endpoint values. The statement below that D-041 is unapproved is historical; `clamp()` interpolation, weights, line heights and other numerical values remain OPEN.

# EstateOS — D-040 CONFIRMED: Shared Fluid Responsive Typography Scale

**Status: CONFIRMED — Option A** | **Approved: 2026-10-18** | **Planning bundle: v2.9** | **PLANNING ONLY — NO APPLICATION CODE**

## Owner-approved decision

All three public agency-site presets — **Modern Light**, **Warm Editorial** and **Contemporary Dark** — use **one shared fluid responsive typography scale**. All semantic text roles resize smoothly with viewport space, rather than only snapping between fixed mobile/tablet/desktop sizes. A CSS `clamp()`-style technique is suitable **when implementation is authorized**, but specific expressions and values remain unapproved.

- Use shared semantic typography roles for Hero display, page/section headings, subheadings, body text, small supporting text, links, form labels and buttons. Component hierarchy remains common to all themes (D-038).
- **D-039 fonts are unchanged**: Manrope heads for Modern Light & Contemporary Dark; Playfair Display for Warm Editorial's display headings; Inter for all themes' body and UI.
- Agency owners do **not** receive a font-size slider, font editor or per-section typography controls in the MVP.
- D-035 Full-Bleed Hero keeps overlaid text readable against diverse imagery. Scale smoothly while keeping the main CTA visible and usable on mobile.
- Test long property/agency headings, browser zoom, text-size preferences, narrow touch screens and overflow; avoid clipping or hiding essential contact actions.
- Text should respect accessibility settings; do not use purely fixed pixel type that defeats zoom. Reduced-motion preferences remain relevant to any future motion.

## Explicitly *not* approved by D-040

- **No exact min/preferred/max font sizes**, line heights, font weights, letter spacing, breakpoint values or `clamp()` formulas.
- No exact HEX color values, spacing units, radius/geometry measurements, Hero crop/overlay dimensions, animation speeds, media limits or content character caps.
- No new theme, separate layout, per-section art-direction system, independent scale per preset, agency-facing typography controls, or app code.

## Acceptance criteria for later implementation (planning requirements, no code yet)

1. All three themes use the same responsive type-role size system; only D-039 family treatment varies.
2. Viewports and long text do not cause horizontal overflow or overlap between title/description/CTA in Hero.
3. Mobile contact actions are discoverable, readable and adequately touch-friendly.
4. Browser zoom / system text resizing do not truncate essential user actions.
5. Values chosen in later decisions are centralized as design tokens, not scattered section-by-section.

## Next proposed decision

**D-041 — Numeric responsive typography sizing** (or agreed visual scale) is not yet approved. See `docs/TYPOGRAPHY-METRICS-D041-PROPOSAL.md`. Exact numeric sizes and weights remain OPEN until separately selected.
