# EstateOS — D-039 CONFIRMED: Font Families by Theme

**Status: CONFIRMED — Option A** | **Approved: 2026-10-18** | **Bundle v2.8** | **PLANNING ONLY**

## Owner-approved family mapping

| Theme preset | Headings / display typography | Body, navigation and UI |
|---|---|---|
| Modern Light | **Manrope** | **Inter** |
| Warm Editorial | **Playfair Display** for display headings (Hero and prominent section titles) | **Inter** |
| Contemporary Dark | **Manrope** | **Inter** |

This is the **single shared premium template**, with D-031 Core 9 sections, D-035 Full-Bleed Hero, D-036 Editorial Contrast, D-037 one fixed palette per preset, and D-038 shared geometry. Font roles change; section hierarchy, CTA placement, theme switching, spacing approach and accessibility expectations do not.

## Implementation constraints when development is authorized

- Maintain two semantic font roles: heading/display and body/UI. Map heading role by selected preset; body/UI always Inter. For Warm Editorial, use Playfair Display on **display headings only** — not paragraphs, navigation, labels, buttons, data, form help, or admin UI.
- No agency-facing font picker, arbitrary font uploads, additional templates or theme-specific layout markup in MVP.
- Use robust fallbacks and verify availability/licensing/hosting, language coverage, font loading performance and layout stability before implementation. **No font files are included in this bundle.**
- Test long headings, small mobile widths, non-Latin input where relevant, text wrapping and contrast over image-backed Hero. Do not sacrifice accessible text sizing for the typography look.
- Super Admin and Agency Admin dashboard typography decisions are separately pending; this decision specifies **public agency website presets**, not dashboard font branding.

## OPEN; not approved by D-039

Font weights, exact responsive sizes/line-heights/tracking, actual font hosting & fallback details, exact color HEX values, numerical spacing/radii/breakpoints, Hero overlay intensity and crop controls, animations, image/media size limits, edit/publish after first activation. Font substitution needs explicit owner approval if a family proves unsuitable.

## Decision history

D-039 Option B (Plus Jakarta Sans / Inter / DM Serif Display) and Option C (Inter / Cormorant Garamond) were **not selected**. See `FONT-FAMILIES-D039-PROPOSAL.md` for historical alternatives only. D-036 earlier Option C was superseded by its approved Option B and does not affect this decision.

**Next:** D-040 proposal `TYPOGRAPHY-SCALE-D040-PROPOSAL.md` (no option approved yet).

> **v2.9 later decision D-040:** one shared fluid responsive typography scale is CONFIRMED across all three themes; D-039 font mappings unchanged. No numerical font metrics approved; see `docs/TYPOGRAPHY-SCALE-D040-CONFIRMED.md`.
