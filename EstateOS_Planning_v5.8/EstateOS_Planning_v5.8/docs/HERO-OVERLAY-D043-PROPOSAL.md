> **HISTORICAL / RESOLVED:** D-043 Option A directional dark gradient is CONFIRMED in `docs/HERO-OVERLAY-D043-CONFIRMED.md` (v3.2). Options B/C not selected. The three-option content below is kept for decision provenance, not as active instructions.

# EstateOS — D-043 PROPOSAL: Full-Bleed Hero Overlay Strategy

**Status:** PROPOSED / NOT APPROVED | **Prepared:** 2026-10-18 | **Bundle:** v3.1 | **Mode:** PLANNING ONLY

## Why this is next

D-035 confirms a **Full-Bleed Image Hero** with heading and CTA over a background photo. D-042 now fixes the 12 core HEX values, **but none defines the Hero overlay**. Different owner-uploaded property images may be too bright, dark, or busy for legible text, especially on mobile. We should agree an overlay strategy before numeric opacity, gradient stops or image crop coordinates.

## Three choices (owner to select ONE)

### Option A — Directional dark gradient (RECOMMENDED)
- Keep the full-width photo prominent.
- Add a dark-to-transparent or dark-to-lighter **gradient concentrated behind the text area**. Text/CTA readability takes priority.
- On mobile, adapt gradient direction/coverage to stacked text and changed image cropping.
- One **shared strategy across all 3 themes**; exact gradient alpha/HEX/stops and text alignment remain OPEN.
- Tradeoff: some photos have reduced visibility around text, but strong cinematic look and robust legibility.

### Option B — Uniform dark scrim
- Apply a consistent semi-transparent dark overlay across the entire Hero image.
- Simple, predictable treatment on both desktop and mobile.
- Tradeoff: overall image can become too dim even where no text appears.
- Exact opacity, colors and layering remain OPEN.

### Option C — Local text panel over background image
- Keep full-bleed image but place heading/CTA within a readable tinted or frosted panel.
- Reliable readability and can work on busy imagery.
- Tradeoff: more card-like than cinematic; requires attention to small screens.
- Exact panel background opacity, blur, padding and position remain OPEN.

## Shared constraints (already confirmed; not a new approval)

- ONE Hero composition across Modern Light / Warm Editorial / Contemporary Dark, no extra templates (D-030/D-034/D-035/D-038).
- Mobile/desktop must both work, headings remain readable at D-041 40px→72px endpoints and the CTA remains visible/tappable.
- Agency can use genuine uploaded photography or appropriately licensed platform default imagery (D-033); do not show fake property listings.
- Test with diverse photo brightness/crop scenarios and reduced-motion/accessibility preferences. No claim of contrast compliance before testing.
- D-042 HEX core tokens stay fixed; **Hero overlays and additional semantic colors are not finalized** by this decision.

## What remains OPEN even after choosing an option

Exact image-overlay metrics, positioning/crop controls, text color variants, accessibility/contrast review, and fallbacks; all numerical spacing/radius values, animations, media limits and remaining typography metrics. Any D-043 approval should lock only the chosen overlay **approach** unless the owner expressly confirms numeric values.
