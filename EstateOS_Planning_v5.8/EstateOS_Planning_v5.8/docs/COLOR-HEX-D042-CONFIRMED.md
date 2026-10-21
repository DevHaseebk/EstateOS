# EstateOS — D-042 CONFIRMED: Refined Neutral Core HEX Palettes

**Decision:** D-042 | **Owner selected:** Option A — Refined Neutral | **Status:** CONFIRMED | **Date:** 2026-10-18 | **Bundle:** v3.1 | **Mode:** PLANNING ONLY

## Binding approval: 12 precise color values

The owner approved only these four **core semantic roles per theme**, exactly as proposed in v3.0. These fixed values are authoritative and should not be silently adjusted by implementation agents.

| Theme preset | `pageBackground` | `surface` | `primaryText` | `accent` |
|---|---|---|---|---|
| **Modern Light** | **`#F7F8F6`** | **`#FFFFFF`** | **`#222C31`** | **`#365D6A`** |
| **Warm Editorial** | **`#F8F2E9`** | **`#FFFDF8`** | **`#3C3029`** | **`#775639`** |
| **Contemporary Dark** | **`#171B1D`** | **`#24292C`** | **`#F4F1EB`** | **`#C6AA7A`** |

The role names above are descriptive planning labels. Final CSS variable names / code design have **not** been approved. All 12 HEX values **are approved**.

## Behavior and compatibility

- D-034: exactly 3 named presets; D-037: each has ONE fixed, curated palette, no color picker, alternate swatches, logo-derived accent, or agency-specific HEX editing.
- D-030/D-031/D-032: ONE shared premium template, Core 9 sections, Guided Customization. Theme selection changes the palette and D-036/D-039 typography, **not** section schema, layout/geometry or visibility controls (D-038).
- D-035: full-bleed photo Hero; do not assume any of these core colors specifies its image overlay, photo text color, gradient alpha, or CTA foreground.
- D-028/D-029/D-033: lean pilot, mandatory Super Admin approval for go-live, approved/ready automatic activation, and zero-property websites remain valid.
- Agency Admin / Super Admin dashboards may use a separate common UI system; D-042 applies specifically to public agency website theme presets.

## Specifically NOT decided by D-042 (OPEN)

1. `secondaryText` / `mutedText`, `onAccent`/button foreground, `border`, `link`, `focusRing`, hover/active/disabled states, input/status colors, and other full semantic token values.
2. Accessibility/contrast QA for **actual component pairs and interaction states**; WCAG testing and any necessary changes must be separately reviewed. No claim is made that every possible use of `primaryText` and `accent` will pass contrast on every surface.
3. Full-bleed Hero image overlay type, opacity, gradients, text positioning and crop behavior (next proposed D-043), as well as numerical Hero height.
4. Numerical section spacing, component radii, widths, shadows, breakpoints, animations, media upload limits.
5. Font weights, line heights, tracking, fluid interpolation/`clamp()` formulas and remaining typography tokens (D-039 families and D-041 endpoints are already confirmed).
6. Post-activation draft/publish process and other non-design operational questions.

## AI instructions

- Never replace these exact HEX values with historical illustrative swatches from old documents or visual examples.
- Do not treat the unselected B/C palettes in `docs/COLOR-HEX-D042-PROPOSAL.md` as alternatives to implement.
- Missing semantic colors are **PENDING**; do not silently infer them as additional approved token values.
- Planning only — no app coding/scaffolding until owner approval.
