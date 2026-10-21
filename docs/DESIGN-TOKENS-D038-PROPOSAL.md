# EstateOS — D-038 PROPOSAL: Premium Component & Layout Token Strategy

**Status: HISTORICAL — RESOLVED by D-038 Option A on 2026-10-18. NOT the active specification.** | Originally proposed in v2.6. See `docs/DESIGN-TOKENS-D038-CONFIRMED.md`.

## Context — already confirmed

- D-030: one website template; D-031: Core 9 sections; D-032: guided section editor.
- D-034 and D-037: **three fixed curated theme palettes**, no owner-adjustable colors.
- D-035: full-bleed image Hero; D-036 Option B: editorial typography categories.
- D-033: logo, service/section content and property listing not mandatory for ready sites.
- Premium public design and easy low-literacy agency editing; equally strong on desktop and mobile.

## What D-038 chooses

**How shared layout/component design tokens vary across the three presets.** This does *not* select final pixels, radii, font families, font sizes, or HEX values.

### Option A — Unified geometry, premium theme colors/type (RECOMMENDED)

Use the same global spacing scale, card/button shape language, content widths, mobile breakpoints and component layouts for all three presets. Preset choice changes color tokens (D-037) and typography roles (D-036), not physical geometry. One design system, one QA matrix; easiest for 5–10 development hours/week. Still allows premium art direction through images and whitespace.

### Option B — Limited theme-specific geometry

Use a shared spacing/breakpoint baseline but allow **curated preset-specific card/button radius, border emphasis and section decoration**. Warm Editorial might be more squared/editorial; Modern Light more softly rounded; Dark subtly restrained. More differentiated, but increases visual testing. No owner-facing geometry controls.

### Option C — Independent visual geometry by theme

Each preset gets its own spacing scale, card style, button style and section treatment. Same template and content schema, but considerably more complexity and QA. Not recommended for the small pilot.

## Suggested baseline component families (not approved specs)

- Global page `container-width`, horizontal padding and vertical section rhythm.
- Button and input `height`, `radius`, `focus-ring`; cards `radius`, `border`, `shadow`.
- Body and display type scale (specific font family and pixel values remain open).
- Hero height and text block constraints, plus responsive stacking/cropping guidelines.
- Accessible theme contrast and reduced-motion support.

## Follow-up decisions after D-038 (current D-039: font families)

Review actual font families, tokenized HEX values and contrast proofs, responsive typography sizes, photo overlay/crop controls, and public-site post-approval publishing. Do not infer numerical design values from this proposal.

**No coding authorized.**
