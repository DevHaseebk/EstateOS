# EstateOS — D-037 CONFIRMED: Three Fixed Premium Curated Palettes

> **v3.1 latest D-042 override:** The 12 core background/surface/primaryText/accent HEX values have been APPROVED as Refined Neutral (see `docs/COLOR-HEX-D042-CONFIRMED.md`). Any older statements below that these exact values are still OPEN are historical. Muted/on-accent/border/focus/interaction colors, accessibility QA, Hero overlay and numeric spacing/radii remain OPEN; D-043 overlay approach is next PROPOSED.


**Decision ID:** D-037 | **Approved choice:** Option A | **Status:** CONFIRMED | **Date:** 2026-10-18 | **Planning bundle:** v2.6

## Agency-facing behavior approved for the lean 2–3 agency MVP

- The website editor offers **exactly three** named theme preset choices (previously D-034): **Modern Light**, **Warm Editorial**, and **Contemporary Dark**.
- **Each preset has one fixed, designer-curated and contrast-checked color palette.** Selecting a preset applies its whole color system to the **same underlying website template**, including all Core 9 sections and the Full-Bleed Hero (D-035).
- The agency owner **cannot separately edit individual palette colors** in the MVP. **No custom HEX/color picker, no extra accent swatches, and no logo-derived/accent extraction.** The agency owner only switches preset.
- Theme choice never changes the D-032 section field schema, D-033 go-live readiness, optional properties, or administrative approval flow.
- A logo is optional; absence of a logo must not cause theme-selection or activation failure.
- Public website styles must maintain text, controls, focus and Hero-overlay readability across theme choices, in mobile and desktop views. Ensure an image contrast strategy is planned separately; do not set numeric overlay values from this decision.
- The agency/super-admin dashboard can use a stable *separate* admin design system; public-site preset choice should not restyle or complicate admin controls.

## Related confirmed decisions (no change)

- **D-030:** one template; themes are styles, not separately maintained templates.
- **D-034:** names/count of three style presets.
- **D-035:** responsive full-bleed photo Hero with readable heading/contact overlay.
- **D-036 Option B:** Modern Light & Contemporary Dark sans-serif headings/body; Warm Editorial restrained serif display headings with sans body/UI.
- **D-028 / D-029 / D-033:** lean pilot, manual Super Admin approval, conditional auto-live if site ready.

## Semantic color token approach: PROPOSED implementation detail (not extra owner approval)

A designer can eventually define a fixed palette map per theme, using semantic roles like `page-bg`, `surface`, `text-primary`, `text-muted`, `accent`, `on-accent`, `border`, `link`, `focus-ring` and Hero contrast roles. This is a recommended engineering plan, **not approval of final token names, values or CSS architecture**.

## Explicitly still OPEN

- **Exact HEX values**, color contrasts and gradient/overlay opacity values.
- Specific font families, weights, numeric typography sizes, line heights.
- Numerical spacing, content width, radii, shadows and responsive breakpoints.
- Hero image positioning, crop UX, media limits, animation/motion, and live-site edit/publish behavior.
- Component geometry/spacing rule RESOLVED under **D-038 Option A unified design system**; see `docs/DESIGN-TOKENS-D038-CONFIRMED.md`. Exact numeric spacing/radius values remain OPEN.

**Do not treat previous reference swatches or moodboard screenshots as approved HEX values.** No app source code is authorized yet.

> **v2.8 later-decision cross-reference:** D-039 Option A confirms Manrope for Modern Light/Dark headings, Playfair Display for Warm Editorial display headings, and Inter for ALL body/UI. Exact weights/sizes/hosting remain OPEN; canonical `docs/FONT-FAMILIES-D039-CONFIRMED.md`.
