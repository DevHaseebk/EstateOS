# EstateOS — D-038 CONFIRMED: Unified Design System Across All Three Themes

**Status: CONFIRMED — Option A** | **Approved: 2026-10-18** | **Planning v2.7** | **PLANNING ONLY**

## Owner decision

EstateOS's ONE premium agency website template uses a **unified component and layout design system** across its three fixed theme presets: **Modern Light**, **Warm Editorial**, **Contemporary Dark**.

- Shared across ALL presets: the spacing scale, content/container widths, horizontal/vertical rhythm, breakpoints, section layouts, reusable card/button/input geometry, border-radius rules, focus-ring geometry, and responsive placement behavior.
- The selected preset changes only its fixed curated **color-token values** (D-037) and its approved **typography roles/styles** (D-036). Do not create alternative theme-specific geometry or layouts.
- Full-Bleed Hero (D-035), Core 9 sections (D-031), Guided Customization (D-032), and minimal website readiness (D-033) remain unchanged. Theme switching must preserve section data/order/visibility; avoid content loss.
- No user-facing spacing, border-radius, button-shape or page-layout controls in the MVP. One tested responsive layout, three theme treatments.

## Shared token groups (names illustrative, values NOT approved)

| Shared layout/component token family | Examples of future values to specify |
|---|---|
| Container | maximum width, side padding, mobile gutters |
| Section spacing | vertical rhythm, inter-section gaps |
| Components | button/input heights, card geometry, radii and outlines |
| Responsive | breakpoints, stacking behavior, touch target geometry |
| Hero composition | layout dimensions, text max width, crop behavior |
| Interaction | focus states, hover positioning, accessible motion handling |

## Preset-specific allowed tokens

- **Modern Light:** fixed palette tokens + sans-serif heading/body roles.
- **Warm Editorial:** fixed palette tokens + restrained serif *display headings*, with sans-serif body/UI roles.
- **Contemporary Dark:** fixed palette tokens + sans-serif heading/body roles.

Accessibility and readability are non-negotiable across all three. Hero overlays may use theme color tokens, but **exact overlay values are still OPEN**.

## Explicitly NOT approved by D-038

No specific HEX colors; no actual font family, font weight, font size or line-height; no numeric spacing, radii, button dimensions, widths, breakpoints, overlay opacity/gradient, image/media limits, or animation timing. Options B/C from the historical D-038 proposal are **not selected**.

## Product/engineering impact

- Implement one reusable component library and design-token schema when coding is explicitly authorized.
- Keep QA focused on the same shared component geometry under three palettes + editorial typography.
- No multiple template engines or theme-specific structural markup purely for styling.
- Planning only: no application code, scaffolding, UI implementation, deployment or runtime tests authorized.

## Next planning decision

**D-039 now CONFIRMED Option A:** Manrope, Playfair Display, and Inter according to `docs/FONT-FAMILIES-D039-CONFIRMED.md`. D-040 proposes responsive typography scale; numeric metrics remain pending.

> **v2.8 later-decision cross-reference:** D-039 Option A confirms Manrope for Modern Light/Dark headings, Playfair Display for Warm Editorial display headings, and Inter for ALL body/UI. Exact weights/sizes/hosting remain OPEN; canonical `docs/FONT-FAMILIES-D039-CONFIRMED.md`.
