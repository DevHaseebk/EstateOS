# EstateOS — D-040 PROPOSAL: Responsive Typography Scale

**Status: HISTORICAL PROPOSAL — RESOLVED by D-040 Option A (v2.9)** | **Originally bundle v2.8** | **PLANNING ONLY**

> **Do not implement alternatives B/C.** Canonical confirmation: `docs/TYPOGRAPHY-SCALE-D040-CONFIRMED.md`. This document is retained for audit context only.

## Previously approved (do not reopen)

- D-039: **Manrope** Modern Light/Contemporary Dark headings; **Playfair Display** Warm Editorial display headings; **Inter** all three presets' body/UI.
- D-038: one shared layout/geometry/spacing system for three presets; no theme-specific responsive structures.
- D-035: photo-backed Full-Bleed Hero with readable overlay heading + CTA on desktop and mobile.

## Owner choice for D-040 (ONE approach; numerical values still unapproved)

**Option A — Shared fluid responsive type scale (RECOMMENDED).** Shared semantic roles (`hero`, `h1`, `h2`, `h3`, `body`, `small`, `button`) using fluid CSS scaling (e.g., `clamp`) with sensible min/max values. All themes share size/line-height rules, while families change by preset. Fewer jumps between screen sizes, easier to keep premium + legible. Numeric scale & limits still require separate signoff.

**Option B — Shared breakpoint-based type scale.** Discrete mobile/tablet/desktop semantic sizes across all presets, same type-role hierarchy. Easy to predict but more visible jumps at breakpoints.

**Option C — Per-section art-directed typography sizes.** Individual sizes and placement per Hero/About/Team/etc., still avoiding theme-specific layout engines; more work and more QA risk, especially for long agency names.

## UX criteria for whichever approach is chosen

1. Hero heading overlays remain readable on light, dark and busy photos; no overflow at narrow mobile widths.
2. Buttons/links and forms remain accessible for low-computer-literacy agency users and visitors; clear focus/keyboard interactions.
3. Long headings, large system-font settings and slower mobile connections cannot break primary contact CTAs.
4. No fixed pixel-only text that prevents user zoom; no font-role picker for agencies.

## Explicitly still OPEN after D-040 strategy choice

Exact font sizes, line-heights, weights, tracking, responsive breakpoints, component dimensions, radius and spacing numbers, HEX palettes, Hero overlay opacity/cropping, motion and media limits. **This proposal is not permission to implement.**
