# EstateOS — D-032 CONFIRMED: Guided Section Editor & Fields


> **v2.4 / D-035 active Hero choice:** Full-Bleed Image Hero is CONFIRMED for all three presets (`docs/HERO-D035-CONFIRMED.md`). Any earlier notes labeling the *Hero layout itself* OPEN refer to historical planning only. The overlay numeric tokens, exact font/color values, media and mobile breakpoint limits remain OPEN; next D-036 typography proposal is NOT approved.


**Decision:** D-032 Option A · **CONFIRMED 2026-10-18** · Planning v2.1 · **M00 PLANNING ONLY**

## Approved scope

- Exactly **one premium website template** (D-030) with the **Core 9** section catalog (D-031).
- **Header and Footer:** global, always present; users cannot hide or reorder them. Branding/contact information can be edited.
- **Hero and Contact CTA:** always visible. They are not hideable. Guided homepage layout keeps Hero as the lead section and Contact CTA before Footer; no unrestricted page builder.
- **About, Services, Properties, Why Choose Us, Team:** each may be shown/hidden independently and reordered among the optional content sections using **Move Up / Move Down** (including accessible mobile equivalents). Reordering is not freeform canvas dragging.
- **Properties are optional**; zero-property agencies are valid and must not receive fake property cards or be blocked from launch.
- The **initial field inventory** from `SECTION-FIELDS-D032-PROPOSAL.md` is approved at the field-category/type level; details below are canonical for MVP planning.

## D-032 approved editable field inventory

| Section | Editable data / types | MVP editing policy |
|---|---|---|
| **Global Header** | Agency display name (short text), logo (image), contact button label (short text), preferred contact action: WhatsApp or phone (select) | Global; non-hideable, non-sortable. Navigation links generated from available public sections/routes; exact route mapping OPEN. |
| **Hero** | Main heading (short text), subtitle (short description), hero image (media upload), CTA label (short text), CTA target (Contact or Properties) | Always visible lead section. If Properties is empty/hidden, no broken Properties CTA; precise fallback remains a UI implementation detail to specify later. |
| **About** | Heading, agency description/story (textarea), supporting photo (optional image) | Optional and reorderable. Never invent company history. |
| **Services** | Heading; repeatable service cards with title, brief description and icon from a controlled list | Optional and reorderable. Defaults may suggest Buy/Sell/Rent but display only actual services. |
| **Properties** | Heading, section on/off, display-count preset (3 or 6), sort preference (newest or featured) | Optional and reorderable. Content comes from the agency's real published listings, not embedded demo properties. Exact zero-listing visibility treatment OPEN. |
| **Why Choose Us** | Heading; repeatable benefit cards with title, short detail and chosen icon | Optional and reorderable. No fabricated awards/statistics. |
| **Team** | Heading; repeatable agent cards with name, role, photo, optional phone/WhatsApp | Optional and reorderable. No invented staff; zero-member display handling OPEN. |
| **Contact CTA** | Heading, short message, public phone, public WhatsApp, public email, display address/city | Always visible. Owner controls what details are public; do not automatically expose private signup info. |
| **Global Footer** | Display name / logo reuse, office area/city, public phone/WhatsApp/email, optional social links | Global; non-hideable, non-sortable; reuse agency public branding where appropriate. |

**Important scope boundary:** approving the initial fields and types above is **not approval** of character counts, maximum repeatable card counts, supported website-image formats/sizes, image crop rules, exact theme palettes/fonts, template visual variants, go-live readiness requirements (now confirmed separately by D-033), contact-routing details, or post-activation draft/publish semantics.

## Core owner journey (approved behavior, proposed screen composition)

1. Agency opens **Customize Website** and sees a simple list of named sections.
2. Select section to edit text, contact fields, card rows or images; settings are plain-English form controls.
3. About / Services / Properties / Why Choose Us / Team can be toggled and moved up/down.
4. Header / Hero / Contact CTA / Footer remain available, with Header/Footer global and no section order controls.
5. Agency can privately preview its draft while Pending (D-015). Live-site rules follow D-029 once ready and approved.

Screen layout, auto-save timings and exact preview/publish buttons remain **proposed**, not approved by D-032.

## Acceptance criteria to carry into later milestone specifications

- Show/hide and Move Up/Down affect only the five optional content sections; required sections remain accessible.
- A hidden section must not leave empty visual whitespace or broken nav/CTA links in the eventual public rendering.
- Editor is usable on both desktop and mobile, with clearly labeled controls; no arbitrary HTML/CSS or pixel drag controls.
- No agency can edit another tenant's sections or media; enforce scope server-side when implementation is authorized.
- A site with no properties remains professional and functional; do not synthesize fake listing content.

## Explicitly OPEN for later approval

1. **D-033 CONFIRMED:** minimum website-readiness checklist in `docs/SITE-READINESS-D033-CONFIRMED.md`; logo/About/Services/Properties optional for go-live.
2. Content length and repeatable-card limits.
3. Website media: sizes, formats, cropping and optimization (separate from historical D-026 verification proof rules).
4. Theme preset count/names/colors, typography and visual design tokens.
5. Draft save/publish flow for edits after initial activation; version history/rollback.
6. Public page/route structure, explicit navigation behavior and zero-state rendering.

**No coding, scaffolding, deployment, or runtime testing authorized.**

## D-033 integration note (confirmed)

Do **not** treat an editable field as a mandatory publish field. Only the selected template, agency name, Hero heading, usable public phone OR WhatsApp, and suitable uploaded OR platform-provided Hero visual are required for MVP initial readiness. Logo and content sections may be left empty/hidden with safe fallbacks. See `docs/SITE-READINESS-D033-CONFIRMED.md`.
