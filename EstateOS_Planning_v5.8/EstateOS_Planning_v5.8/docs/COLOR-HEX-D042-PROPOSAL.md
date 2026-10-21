# EstateOS — D-042 HISTORICAL PROPOSAL: Exact Curated Palette HEX Tokens

**Status: HISTORICAL / RESOLVED — D-042 Option A confirmed in v3.1** | **Originally prepared: 2026-10-18** | **PLANNING ONLY**

> **CURRENT DECISION OVERRIDE:** The owner has now APPROVED **Option A — Refined Neutral**, including its precise four HEX tokens per preset. Read **`docs/COLOR-HEX-D042-CONFIRMED.md`** for implementation-authoritative values. The B/C choices and all prior “not approved” labels below are historical as of v3.1; no additional semantic colors, accessibility claims or overlay values were approved.

## Binding context

D-034 names exactly three presets: Modern Light, Warm Editorial, Contemporary Dark. D-037 permits only **one fixed curated palette per preset** and no agent HEX/color customization. D-038 uses identical geometry/spacing across presets. D-035 requires a legible full-bleed Hero. D-041 approves Balanced Premium **typography endpoints only**, not colors.

## Next selection: exact color identity across the three themes

All options preserve the three preset names and template geometry. **The values below are candidates, not approved tokens.** Each candidate family lists `page background / surface / text / accent` HEX values; full semantic tokens (secondary text, on-accent, borders, status colors, states) require later design/contrast QA.

| Proposal | Modern Light (bg / surface / text / accent) | Warm Editorial (bg / surface / text / accent) | Contemporary Dark (bg / surface / text / accent) |
|---|---|---|---|
| **A — Refined Neutral (recommended)** | `#F7F8F6` / `#FFFFFF` / `#222C31` / `#365D6A` | `#F8F2E9` / `#FFFDF8` / `#3C3029` / `#775639` | `#171B1D` / `#24292C` / `#F4F1EB` / `#C6AA7A` |
| **B — Fresh Contemporary** | `#F4F8FA` / `#FFFFFF` / `#172B39` / `#255F82` | `#FBF5ED` / `#FFFFFF` / `#412E25` / `#906047` | `#121F2B` / `#20313F` / `#F6F6F2` / `#D2B17A` |
| **C — Quiet Monochrome** | `#FAF9F7` / `#FFFFFF` / `#222222` / `#535353` | `#F5F0E8` / `#FCFAF6` / `#342F2A` / `#766C60` | `#191919` / `#292929` / `#F5F4F0` / `#B8B5AC` |

**Recommendation:** A offers clean differentiation among modern, warm and dark styles without becoming flashy or imposing complex color pickers on owners. But confirm it as a single set before implementation, not by silent assumption.

## If a palette is selected later

- Add confirmed semantic mapping for page background, elevated surface, heading, body/muted, primary CTA, CTA foreground, borders, focus states and links.
- Verify WCAG AA contrast of all actual foreground/background pairs, including CTA states. If an illustrative candidate pairing fails, document any necessary correction for owner approval rather than silently adjusting an approved HEX value.
- Treat Hero overlay/opacity as its **own pending design decision**, not part of D-042 by default.
- Do **not** expose palette editors to agency owners or change D-038 shared layout.

## Unresolved, independent decisions

Secondary semantic token values and interactive states; font weights, line heights, fluid interpolation, spacing/radius/breakpoints, animations, media limits, Hero overlay/crop, and app-admin design system. **No app code.**
