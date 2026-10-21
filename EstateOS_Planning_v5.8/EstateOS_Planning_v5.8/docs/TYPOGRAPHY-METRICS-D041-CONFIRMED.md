# EstateOS — D-041 CONFIRMED: Balanced Premium Typography Endpoints

> **v3.1 latest D-042 override:** The 12 core background/surface/primaryText/accent HEX values have been APPROVED as Refined Neutral (see `docs/COLOR-HEX-D042-CONFIRMED.md`). Any older statements below that these exact values are still OPEN are historical. Muted/on-accent/border/focus/interaction colors, accessibility QA, Hero overlay and numeric spacing/radii remain OPEN; D-043 overlay approach is next PROPOSED.


**Status: CONFIRMED — Option A** | **Approved: 2026-10-18** | **Bundle: v3.0** | **PLANNING ONLY — no application code authorized**

## Owner-approved choice

The owner approved **Balanced Premium** responsive typography **size endpoints** only, shared across the **single website template** and all three existing theme presets. This extends D-040's shared fluid scale; it does not choose interpolation formulas, weights or line heights.

| Semantic role | Narrow/mobile endpoint | Wide/desktop endpoint | CSS rem equivalents at 16px root |
|---|---:|---:|---|
| Hero heading / display | **40px** | **72px** | **2.5rem → 4.5rem** |
| Major section heading / H2 | **28px** | **44px** | **1.75rem → 2.75rem** |
| Standard body text | **16px** | **16px** | **1rem → 1rem** |

These endpoints describe approved intended design bounds, **not** fixed physical-pixel text immune to browser zoom. Use zoom-friendly units when implementation is approved. D-040 still requires responsive fluid scaling for headings; **exact `clamp()` formulas, interpolation slopes, viewport thresholds and other semantic sizes are OPEN**. A 16px default root is assumed for the conversion shown above, but this does **not** mandate locking the root font size or overriding user accessibility settings.

## Other decisions still binding

- D-039: **Manrope** headings on Modern Light and Contemporary Dark; **Playfair Display** prominent display/section headings on Warm Editorial; **Inter** body/navigation/forms/buttons in all three themes.
- D-038: shared component geometry and typography sizing roles across themes.
- D-035: full-bleed image Hero with accessible text/CTA overlay on desktop and mobile.
- D-032: agency owners do not receive size editing controls. Limited guided customization only.
- D-028: tiny 2–3 agency pilot, avoid adding unnecessary complexity.

## Explicitly NOT approved in D-041

- **Font weights, line heights, letter spacing, intermediate heading/text roles** or automatic scaling `clamp()` calculations and breakpoints.
- **Exact HEX palette values**, numeric spacing/radii/content widths, animation timing, Hero overlay opacity/crop/height, media upload limitations, and agency post-go-live publishing behavior.
- A new template, typography variants per section, or per-agency font controls.

## Later implementation acceptance criteria (not permission to code)

1. The same role-size endpoints and fluid system apply to all three themes; typography families follow D-039.
2. At realistic narrow-screen, tablet and desktop widths, long agency-supplied Hero text does not clip or obstruct the CTA.
3. Browser zoom, text resizing and accessibility requirements are supported; avoid horizontal overflow.
4. Token values are defined centrally, not repeated as arbitrary one-off constants in section components.
5. Actual fluid interpolation and supporting sizes must be signed off in a future decision.

**Next proposed decision: D-042 — exact curated color HEX values** (not approved). See `docs/COLOR-HEX-D042-PROPOSAL.md`.
