> **v3.9 ACTIVE — D-050 OPTION A CONFIRMED (2026-10-19):** Guided Website Editor uses **explicit section-level manual `Save Changes`** on the current section. No ordinary autosave or global Save All as the main model. Save success means **persisted authorized draft/edit, NOT automatic production republish**. D-049 theme Apply stays separate. Canonical `docs/WEBSITE-EDITOR-SAVING-D050-CONFIRMED.md`. **NEXT D-051 PROPOSED ONLY:** unsaved-section navigation protection (`docs/WEBSITE-EDITOR-UNSAVED-D051-PROPOSAL.md`). Unsaved warnings, Preview sync, post-live publication, exact English labels/routes, pixel breakpoints and pilot CRM scope remain OPEN. **PLANNING ONLY — NO APP CODE.**

> **v3.8 HISTORICAL SNAPSHOT — D-049 OPTION A CONFIRMED (2026-10-19):** Theme Selection under the D-048 My Website hub previews a candidate WITHOUT changing the currently saved preset. Only an intentional explicit **Apply/Save** saves the selected preset; Cancel/Back without applying preserves the previous saved theme. One template, all content preserved; private Pending preview only. **No post-live theme publication behavior approved.** Canonical `docs/THEME-SELECTION-D049-CONFIRMED.md`; old A/B/C proposal HISTORICAL. **NEXT D-050 PROPOSED ONLY:** Guided Editor content saving via section Save (A recommended), global Save All (B), or autosave (C), `docs/WEBSITE-EDITOR-SAVING-D050-PROPOSAL.md`. Exact English labels/routes, preview surface, editor/publish semantics, mobile breakpoint pixels, checklist progress and CRM pilot scope OPEN. **PLANNING ONLY / NO APP CODE.**

> **v3.2 LATEST CONFIRMED — D-043 Option A:** Full-Bleed Hero has a **directional dark gradient concentrated behind Hero text and CTA** (all three themes; responsive coverage). Canonical `docs/HERO-OVERLAY-D043-CONFIRMED.md`. Older statements calling D-043 "proposed" are historic. **Exact overlay alpha/HEX/stops/crop, other semantic colors, contrast checks, numeric spacing/radii, animations, fluid interpolation remain OPEN.** **NEXT D-044 PROPOSED ONLY:** Agency Admin dashboard/home UX (`docs/DASHBOARD-UX-D044-PROPOSAL.md`). **PLANNING ONLY.**

> **v3.0 typography priority:** D-041 Balanced Premium endpoints CONFIRMED (Hero 40→72px, H2 28→44px, body 16px) under D-040 fluid scaling, across all three theme presets. Interpolation, font weights/line heights, exact colors/spacing/motion and media limits are still UNAPPROVED. See `docs/TYPOGRAPHY-METRICS-D041-CONFIRMED.md`.

> **v3.1 latest D-042 override:** The 12 core background/surface/primaryText/accent HEX values have been APPROVED as Refined Neutral (see `docs/COLOR-HEX-D042-CONFIRMED.md`). Any older statements below that these exact values are still OPEN are historical. Muted/on-accent/border/focus/interaction colors, accessibility QA, Hero overlay and numeric spacing/radii remain OPEN; D-043 overlay approach is next PROPOSED.


> **v2.6 approved clarification:** D-037 Option A means website theme selection chooses one of three **fixed curated palettes**; no custom HEX picker, extra accent swatches or logo-derived colors. **Exact HEX values still OPEN.** See `docs/COLOR-PALETTES-D037-CONFIRMED.md`. Other items in this MVP proposal may remain PROPOSED.

# EstateOS — Website Builder MVP (D-030/D-031/D-032/D-033/D-034 confirmed; remaining details OPEN)


> **v2.5 / ACTIVE D-035 + D-036:** Full-Bleed Image Hero CONFIRMED on all three presets (`docs/HERO-D035-CONFIRMED.md`); Editorial Contrast typography CONFIRMED Option B (`docs/TYPOGRAPHY-D036-CONFIRMED.md`): Warm Editorial serif DISPLAY headings + sans body/UI; other two presets sans headings/body. Any old D-035/D-036 OPEN references in historical notes are superseded. Exact font names, HEX colors, overlay metrics, media rules and breakpoint values remain OPEN; next D-037 color controls are PROPOSED only.


**Planning v2.3.** **CONFIRMED D-030:** one premium section-based template, customizable sections and theme presets. **CONFIRMED D-031:** Core 9 section catalog. **CONFIRMED D-032:** initial editable field inventory and Guided Customization (fixed Header/Footer, always-visible Hero/Contact; other five sections hideable and Move Up/Down). **D-033 CONFIRMED:** selected template, real agency name, Hero heading, phone OR WhatsApp, and Hero visual (owner-uploaded OR legitimate platform-provided default) are minimum for first activation; logo/About/Services/Properties not required. **D-034 CONFIRMED:** exactly three named curated style presets — Modern Light, Warm Editorial, Contemporary Dark — on this same one template. **Still OPEN:** exact content limits, website-media constraints, hex colors, font families, Hero layout, animations, mobile breakpoints and post-live updates. D-029 conditional automatic initial activation remains confirmed.

## Primary user outcome

An agent with little computer experience chooses a template and sees a beautiful default design. They edit simple text and upload logo/hero/other images via clearly labeled forms; preview both desktop/mobile, save draft, and have website auto-activated once Super Admin approves **if ready**. Adding properties is optional. User should not need page design knowledge.

## D-030 selected direction (CONFIRMED)

- **One** carefully polished template for the pilot, configurable content sections and theme presets.
- This is one template with flexible settings, **not** a commitment to ship separate Modern/Luxury/Corporate implementations.
- Preset quantity/names are CONFIRMED D-034; exact colors, typography, Hero layout and additional appearance controls remain proposals. D-032 controls section visibility/order.
- A zero-property site must still look premium; optimize desktop and mobile equally.

## D-031 Core 9 catalog — CONFIRMED; field types and guided controls CONFIRMED D-032

| Section | Suggested fields | Remarks |
|---|---|---|
| Header (global) | Agency logo/name; phone/WhatsApp; navigation | Simple preset navigation |
| Hero | Headline, subheading, background image, CTA text/target | Aim for premium visuals with image crop preview |
| About | Heading, paragraph, optional image | Simple text input, no rich editor initially |
| Services | Service cards (e.g. Buy, Sell, Rent), reorder labels/text | Works with no listings |
| Featured Properties | On/off, section title, number of cards | Automatically hide if zero; never placeholder fake listings |
| Why Choose Us / Trust | 2–4 benefit cards | Keep claims editable and honest |
| Team | Agent names, roles, real portraits | No fabricated team members; zero team gracefully handled |
| Contact / CTA | WhatsApp, phone, email, address/area | Primary conversion objective |
| Footer (global) | Logo/name, agency contact, socials | Generated/edited centrally |

### Guided controls CONFIRMED D-032; screen details still PROPOSED

- Select a section in a left-hand list; edit fields in clear forms; immediate safe preview.
- Toggle section visibility and reorder permitted sections. No pixel-level drag-and-drop/page canvas.
- On mobile, editor uses step-by-step tabs/list and full-screen preview rather than cramming three columns.
- Show loading, empty and validation feedback in simple English.
- Public website and editor preview should share same section-renderer components in future design.

## D-033 minimum website readiness — CONFIRMED

Option A essential requirements: selected MVP template; genuine agency name; nonempty Hero heading; usable public phone OR WhatsApp; owner-uploaded suitable Hero image OR a legitimate platform-provided default visual. Uploaded logo, About, Services, Team and Properties are optional; text agency-name branding is acceptable. Read the canonical `docs/SITE-READINESS-D033-CONFIRMED.md`; preset hex values/font choices, Hero layout and image limits remain OPEN.

## Future technical direction — not approved

Typed registry of section types, schema-versioned JSON config, draft/live snapshots, tenant-aware public resolver, image object storage, responsive theme tokens, shared UI package and server-side publication checks. Favor the smallest maintainable implementation, not generalized Webflow-like architecture.

## Approval sequence

1. [x] D-030 — one initial premium template with customizable sections and theme presets.
2. [x] D-031 — Core 9 catalog (Header, Hero, About, Services, optional Properties, Why Choose Us, Team, Contact CTA, Footer).
3. [x] D-032 — initial field inventory and guided section visibility/ordering confirmed.
4. [x] D-033 — essential website readiness (Option A) confirmed.
5. [x] D-034 — exactly three curated presets on same website template.
6. [ ] D-035 next — approve Hero composition; visual tokens/fonts, media rules, animation and post-activation edit/publish remain separately OPEN.

No app code authorized.

See `docs/WEBSITE-SECTIONS-PROPOSAL.md` for the **confirmed** Core 9 list and `docs/SECTION-FIELDS-D032-PROPOSAL.md` for historical proposals; canonical D-032 approval is `docs/SECTION-FIELDS-D032-CONFIRMED.md`.

> **v2.7 styling constraint (CONFIRMED D-038):** all three theme presets reuse ONE layout/component geometry, spacing scale, and responsive rules; only fixed color palette values (D-037) and approved typography roles (D-036) vary. Numerical tokens and font family choices remain OPEN.

> **v2.8 later-decision cross-reference:** D-039 Option A confirms Manrope for Modern Light/Dark headings, Playfair Display for Warm Editorial display headings, and Inter for ALL body/UI. Exact weights/sizes/hosting remain OPEN; canonical `docs/FONT-FAMILIES-D039-CONFIRMED.md`.

> **v2.9 typography decision D-040:** all three preset styles must use one shared fluid responsive type scale (D-039 font mapping unchanged). Numerical type tokens not approved; see `docs/TYPOGRAPHY-SCALE-D040-CONFIRMED.md`. Do not treat older proposal checklists as current status.
