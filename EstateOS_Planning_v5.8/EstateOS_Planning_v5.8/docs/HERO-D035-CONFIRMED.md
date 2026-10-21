> **v3.2 LATEST CONFIRMED — D-043 Option A:** Full-Bleed Hero has a **directional dark gradient concentrated behind Hero text and CTA** (all three themes; responsive coverage). Canonical `docs/HERO-OVERLAY-D043-CONFIRMED.md`. Older statements calling D-043 "proposed" are historic. **Exact overlay alpha/HEX/stops/crop, other semantic colors, contrast checks, numeric spacing/radii, animations, fluid interpolation remain OPEN.** **NEXT D-044 PROPOSED ONLY:** Agency Admin dashboard/home UX (`docs/DASHBOARD-UX-D044-PROPOSAL.md`). **PLANNING ONLY.**

# EstateOS — D-035 CONFIRMED: Full-Bleed Image Hero

> **v3.1 latest D-042 override:** The 12 core background/surface/primaryText/accent HEX values have been APPROVED as Refined Neutral (see `docs/COLOR-HEX-D042-CONFIRMED.md`). Any older statements below that these exact values are still OPEN are historical. Muted/on-accent/border/focus/interaction colors, accessibility QA, Hero overlay and numeric spacing/radii remain OPEN; D-043 overlay approach is next PROPOSED.


**Owner selection:** Option B — Full-Bleed Image Hero  
**Date:** 2026-10-18 · **Status:** CONFIRMED · **Milestone:** M00 Product Discovery  
**Scope:** The ONE D-030 premium website template and ALL THREE D-034 theme presets.

> **v2.5 CURRENT DESIGN OVERRIDE:** D-036 **Option B Editorial Contrast** is now CONFIRMED: sans headings/body in Modern Light & Contemporary Dark; serif **display** headings + sans body/UI in Warm Editorial. Canonical `docs/TYPOGRAPHY-D036-CONFIRMED.md`. Exact font family names/HEX values remain OPEN.

## Decision / behavior

- The primary Hero is a **full-width, image-backed composition** with the agency Hero heading and CTA **overlaid on the image**. It is not an editorial split (Option A) nor heading-above-image (Option C).
- The **same Hero composition** is used for Modern Light, Warm Editorial and Contemporary Dark. The styles may adjust design tokens; they do not become separate templates or alternative Hero layouts.
- Must accommodate the D-032 editable Hero fields: heading, optional subtitle, background image, button label and destination. D-033 ready check still only requires a nonempty genuine Hero heading, useful phone OR WhatsApp contact, an owner-uploaded OR licensed platform-default Hero image, real agency name and selected template; a logo and actual property listings are NOT compulsory.
- Full-width treatment applies on desktop and mobile. Mobile must preserve readable heading and a usable contact CTA while handling responsive image cropping. Long headings and varied image brightness must not make overlaid controls inaccessible.
- The image must be agency-owned/authorized or an appropriately licensed platform default. Do not fabricate agency properties or silently use unlicensed photos.

## Required implementation safeguards (not exact UI specifications)

- Background photo cannot be allowed to obscure heading, buttons, focus states or navigation. Use a tested responsive overlay/gradient or comparable contrast technique.
- Provide responsive positioning and safe text bounds; do not require desktop cropping to work unchanged on narrow phones.
- Support keyboard and touch use; respect accessibility. Image optimization / lazy loading outside first viewport should avoid harming first-content experience.
- Pending agencies must retain a **private** preview; this visual decision does not authorize publication. D-029 governs automatic initial site activation after Super Admin approval AND readiness.

## Not decided by D-035

- Exact overlay colors, opacity, gradient, image focal point editor, Hero height, text alignment, CTA label or target defaults, mobile breakpoints, font families/weights/scale, spacing, shadows, animations, aspect ratios, image formats/size limits, and post-live save/publish behavior.
- **Later decisions override older proposals:** D-036 Option B editorial typography categories and D-037 Option A fixed curated palette controls are CONFIRMED (`docs/TYPOGRAPHY-D036-CONFIRMED.md`, `docs/COLOR-PALETTES-D037-CONFIRMED.md`). Exact font families, HEX values and Hero overlay numeric settings remain OPEN. Historical `docs/TYPOGRAPHY-TOKENS-D036-PROPOSAL.md` is not the active source.
- No application implementation is authorized; remain in planning mode.

## Acceptance criteria to refine during design milestone

1. A text-over-image, full-bleed Hero is present in all three approved presets.
2. The heading and CTA remain readable with both bright and dark images at phone and desktop widths.
3. An agency can launch without uploading a logo or adding properties when other D-033 readiness checks pass.
4. Agency photo and authorized default asset paths both work; preview does not expose Pending sites publicly.
5. No image constraints or exact design tokens are treated as approved yet.
