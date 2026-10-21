# EstateOS — D-036 CONFIRMED: Editorial Contrast Typography

**Status: CONFIRMED** | **Owner's final choice: Option B** | **Date: 2026-10-18** | **Planning bundle v2.5** | **M00 / documentation only**

## Owner-approved strategy

The **single** D-030 premium website template and D-034 three curated theme presets have this typography behavior:

| Theme | Display / prominent headings | Body, forms, buttons, navigation, utility UI |
|---|---|---|
| **Modern Light** | Contemporary **sans-serif** | Readable **sans-serif** |
| **Warm Editorial** | Elegant, restrained **serif** for **display headings** | Readable **sans-serif** |
| **Contemporary Dark** | Contemporary **sans-serif** | Readable **sans-serif** |

- Keep the same **nine section types**, guided editor controls, theme switching infrastructure and Full-Bleed Image Hero (D-031/D-032/D-035). Typography changes **style**, not layouts, content requirements, tenant state or the number of templates.
- Apply the editorial serif only to Warm Editorial's display heading hierarchy (e.g., Hero heading and prominent section headings); **do not put decorative serif fonts in body paragraphs, buttons, labels, contact data or admin dashboards**.
- The agency owner selects one of the **three existing theme presets**, not a freeform font-family picker in the MVP. Curated font assignment must be predictable, legible and responsive.
- All styles need usable fallback fonts, reasonable webfont loading performance, clear small-screen text, and strong contrast over the Hero's background-photo overlay.
- This is a **directional decision**. It does **not** approve specific fonts, number of weights, webfont provider/license, CSS font sizes, line heights, breakpoints, exact design tokens, colors or animations.

## Reconciliation with prior message

Before this final approval, an earlier owner message proposed **Option C (distinct font pairing per theme)**, but the subsequent and latest owner instruction explicitly selects **Option B**. **Only Option B is active.** Preserve the history; never implement Option C simply because it appears in an earlier chat summary or historical proposal.

## Explicitly still OPEN (not implied by D-036)

1. Exact heading/body font family names, licensing, weights, fallback stacks, and hosting method.
2. Exact typography scale, line height/tracking, responsive font sizes and minimum touch/reading specifications.
3. Exact HEX color palettes and their mapping to semantic tokens (`page-bg`, `surface`, `text`, `accent`, `focus-ring`, Hero overlay roles, etc.).
4. Hero gradient opacity/geometry, focal-point selection, crop limits, image upload rules, animation duration, and responsive breakpoints.
5. Post-activation section edits and publishing/preview behavior.

**Next proposal:** `docs/COLOR-TOKENS-D037-PROPOSAL.md` — how the three approved themes expose/control semantic color palettes. That choice is **NOT YET APPROVED**.

No implementation, scaffolding, deployment, or application runtime tests authorized.

> **v2.7 cross-reference:** D-038 now CONFIRMED Option A unified component/layout geometry; typography roles above vary by theme without introducing new layouts. Actual font families were later CONFIRMED D-039 Option A (`docs/FONT-FAMILIES-D039-CONFIRMED.md`); numeric font metrics remain pending.

> **v2.8 later-decision cross-reference:** D-039 Option A confirms Manrope for Modern Light/Dark headings, Playfair Display for Warm Editorial display headings, and Inter for ALL body/UI. Exact weights/sizes/hosting remain OPEN; canonical `docs/FONT-FAMILIES-D039-CONFIRMED.md`.
