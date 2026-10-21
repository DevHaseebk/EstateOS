# EstateOS — Historical D-036 Typography Options (RESOLVED by Option B)

**Status: RESOLVED HISTORICAL PROPOSAL** · **D-036 Option B CONFIRMED in v2.5** · **No application code authorized**

> The owner's latest choice is **Option B — Editorial Contrast** (not Option C from an earlier message). Use `docs/TYPOGRAPHY-D036-CONFIRMED.md` as the authoritative rule. Exact fonts/HEX/scales/animations remain OPEN. Next active proposal is `docs/COLOR-TOKENS-D037-PROPOSAL.md`. The alternatives below are preserved ONLY as planning history.

## Decisions already locked

- D-030/D-031: ONE reusable premium template, Core 9 sections, with optional Properties and no fake content.
- D-032: guided editable sections, fixed global Header/Footer, always-visible Hero/Contact.
- D-033: simple essential website-readiness checks; owner-uploaded or licensed-default Hero visual accepted.
- D-034: Modern Light / Warm Editorial / Contemporary Dark styling presets, not separate templates.
- D-035: **Full-Bleed Image Hero** with readable overlay heading/contact CTA on ALL preset styles; responsive safe cropping and overlays are required.

## Design token structure to plan (not exact values)

Shared semantic roles should be used rather than hardcoded per-component hexes:

| Category | Proposed semantic tokens / behavior |
|---|---|
| Color | `page-bg`, `surface`, `surface-raised`, `text-primary`, `text-muted`, `border`, `accent`, `accent-contrast`, `focus-ring` |
| Hero overlay | `hero-overlay-start`, `hero-overlay-end`, `hero-text`, `hero-cta-bg`, `hero-cta-text` (ensure photo-independent readability) |
| Type | `font-display`, `font-body`, `text-hero`, `text-section`, `text-body`, `text-small`, `line-height`, `tracking` |
| Space | consistent spacing steps, section vertical padding, content maximum width, grid gaps |
| Components | button height/radius, card radius, form states, header height, focus treatment |
| Motion | possible minimal hover/reveal behavior, respecting reduced motion; no precise motion approved |

All three themes must achieve accessible foreground/background and CTA contrast, including Hero image overlays and dark backgrounds. Exact WCAG thresholds and test matrix to be specified in a later design acceptance checklist.

## D-036 — choose typography **direction** (one selection; exact font names remain OPEN)

### Option A — Consistent Modern Sans (simple)
- All 3 presets share a modern sans family for headings and body text.
- Hierarchy comes from scale/weight/spacing, not multiple font families.
- Lowest maintenance and consistent readability, but less differentiation for Warm Editorial.

### Option B — Editorial Contrast (RECOMMENDED)
- Modern Light and Contemporary Dark use modern sans for headings/body.
- Warm Editorial uses an elegant restrained serif **for display headings only**, with a clean sans body and interface text.
- Reuses one type scale and shared UX controls across themes, while giving Warm Editorial a more premium distinct identity.
- Specific serif/sans font families, licensing, font loading and fallbacks remain to be approved later.

### Option C — Distinct Type Pairing Per Theme
- Each preset can have its own curated heading/body font pairing.
- Most distinct visual character, but raises compatibility and maintenance/testing work for a 2–3 agency MVP.

## Important UX guardrails (recommendations, not numeric approvals)

- Keep plain-English buttons and form labels easy to read on phones; do not use decorative fonts for interface controls or paragraphs.
- Ensure Hero typography remains legible over bright/busy uploaded photos; title and CTA should have suitable text widths and responsive line breaking.
- Avoid giving agency owners freeform font-size/typeface CSS controls during MVP; preset changes should not break content.
- Plan typography with font loading/fallback performance and rights to any webfont assets.

## Subsequent separate decisions

- Exact serif/sans family choices, weights, license/hosting, font loading strategy.
- Exact HEX palettes and semantic role mappings per preset; Hero overlay contrast tokens.
- Exact scale/spacing/button/card tokens, mobile breakpoints and image sizing/media limits.
- Image alignment, focal point and crop-control UX for the chosen full-bleed Hero.
- Motion and transitions; editing/save/publishing after website activation.

**D-036 was approved as Option B on 2026-10-18.** This original three-option questionnaire is resolved; no other option is active.
