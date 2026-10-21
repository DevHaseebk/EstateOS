# D-043 — Directional dark gradient behind Hero text (CONFIRMED)

**Status:** CONFIRMED — Option A | **Approved:** 2026-10-18 | **Planning bundle:** v3.2 | **Milestone:** M00 (PLANNING ONLY)

## Decision

All three public-agency style presets (Modern Light, Warm Editorial and Contemporary Dark) use **one shared directional dark gradient strategy behind the foreground Hero heading, supporting copy and contact CTA**. A single full-bleed background image remains visually prominent outside the text zone. **This is not a uniform full-image scrim and not a permanent translucent text panel.**

- Gradient emphasis follows the heading/CTA placement, creating contrast behind actual text rather than uniformly darkening the entire photograph.
- Mobile responsiveness must adapt gradient **direction and coverage** to text placement and image crop, keeping meaningful text and CTA readable/tappable.
- Applies to the ONE shared template's Full-Bleed Image Hero (D-030, D-035) and all THREE fixed curated styles (D-034/D-037); do not introduce independent hero layouts or agency-configurable gradient controls.
- Protect image subjects through careful fallback/default-image selection and later crop/focal positioning design. Agency sites with zero properties remain valid; no fake imagery/listings.
- Actual accessibility/contrast compliance must be **tested** with representative bright, dark and busy images at mobile and desktop sizes; no compliance claim is established by choosing a gradient style.

## Explicitly NOT approved by D-043

1. Numeric gradient opacity/alpha, gradient stop percentages, easing/angle/direction degrees or exact overlay HEX colors.
2. Hero height, text alignment, image crop/focal-point controls, mobile breakpoints or image formats/size limits.
3. Foreground/on-image semantic text/button colors, overlay fallbacks and WCAG pass/fail findings.
4. Spacing/radii/shadows, motion/animations and exact CSS or implementation-specific code.
5. Change to any D-042 **approved** base/surface/primary-text/accent HEX values; they remain authoritative in `docs/COLOR-HEX-D042-CONFIRMED.md`.

## Acceptance checks — planning requirements for future implementation

- A full-bleed image remains identifiable; heading, optional subtitle and primary CTA have legible contrast at common mobile/desktop widths.
- No site can become publicly accessible before Super Admin approval and D-033 essential readiness (D-029).
- Same layout and geometry across themes (D-038), with typography and approved palettes from D-039 through D-042.
- Implementation decisions on exact overlay values cannot be made silently; propose or record separate owner approval.

## Authority and historical alternatives

The prior `docs/HERO-OVERLAY-D043-PROPOSAL.md` is a **historical proposal only**. Its Option A has been selected; Options B and C were **not approved**. In case of conflict, this canonical CONFIRMED document overrides language in older proposals or AI handovers. Development remains unauthorized.
