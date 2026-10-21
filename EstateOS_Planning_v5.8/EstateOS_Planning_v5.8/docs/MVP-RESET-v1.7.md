# EstateOS — MVP reset (authoritative current pilot direction)


> **v2.4 / D-035 active Hero choice:** Full-Bleed Image Hero is CONFIRMED for all three presets (`docs/HERO-D035-CONFIRMED.md`). Any earlier notes labeling the *Hero layout itself* OPEN refer to historical planning only. The overlay numeric tokens, exact font/color values, media and mobile breakpoint limits remain OPEN; next D-036 typography proposal is NOT approved.


**Decisions D-028 + D-029 · CONFIRMED · 2026-10-17 · M00 planning only.**

> **D-029 UPDATE (v1.8):** approval **automatically activates a ready website** and shows its public working link. If unready, agency can be approved but site/link stays unpublished/hidden. No initial owner Publish click. Read `docs/WEBSITE-ACTIVATION-D029.md`.

## Why we changed direction

The initial verification and document workflow became excessive for a 2–3 agency pilot. The product owner wants to validate the branded agency-site builder and Super Admin agency controls first. Earlier detailed verification documentation is historical/future scope, **not an MVP prerequisite**.

## Minimal end-to-end journey (approved intent)

1. Agency created through Super Admin **or** self-service (both existing supported registration channels); the exact invite flow remains OPEN.
2. Agency starts **Pending**; Super Admin can see it immediately in agency listing.
3. Agency enters **basic business/contact details** in simple English (registration's six fields remain recorded in D-016/D-017, but we must decide which of those are truly essential in the simplified pilot).
4. Agency chooses a premium **template** and edits its dynamic section content: brand/logo, hero text and image, agency description, services, contact/social information and optional additional images. Editable fields depend on the template/sections selected.
5. Agency may add **zero or more properties**. Property management must never gate website readiness; a zero-property layout hides listings or shows an appropriate services/contact CTA, not fake data.
6. Before approval, the agency can save drafts and view a **private preview**; Super Admin can review saved agency data and private preview.
7. Super Admin can **Approve**, and also **Block** or **Deactivate** as a platform control. Existing Reject / Request Changes definitions are still historically approved but should not make pilot onboarding complex.
8. **Public agency link must not be shown or publicly usable before approval**. **D-029 confirmed:** automatically publish after admin approval if the website is ready and show the live URL; if unready, no live link. Exact definition of ready still OPEN.

## MVP keep / defer

| KEEP — launch priority | DEFER — future/not a launch gate |
|---|---|
| Basic agency account + Super Admin listing | KYC-like document review and retention policy |
| Pending/approved gating plus Block/Deactivate controls | Mandatory office proof, proof categories and map-location verification |
| Template selection + section-based content editing | Email verification as mandatory approval gate; OTP processes |
| Premium responsive agency site, logo/hero/media | Complex document upload and private reviewer dashboard |
| Zero-property website, optional property listings | Advanced CRM automation and multi-step sales pipelines |
| Private preview before approval | Multiple complex templates, AI builder, custom domains, billing automation |
| Basic tenant isolation / auth / secure storage | Heavy abstractions and unnecessary integrations |

**CRM note:** hybrid product vision (D-001) stays; exact pilot lead inbox vs deferred CRM needs an owner decision. Do not quietly remove the long-term CRM direction.

## Website content, proposed MVP schema (NOT YET APPROVED)

- Global: agency name, logo (editable), phone, WhatsApp, email, address/service area, brand colors.
- Hero: heading, supporting text, hero image, CTA text/link.
- About: heading, description, optional image.
- Services: list of buy/sell/rent/consultation offerings.
- Properties: section toggle, layout, selected/featured items when any exist.
- Contact: address/service area, WhatsApp and inquiry CTA.
- Sections: reorder, enable/disable, edit content; reuse templates/section variants.

## Non-negotiable security even for 2–3 agencies

- Authorization and tenant isolation on every API/data access.
- Pending or blocked/deactivated agencies must not leak unpublished/public site content.
- Media uploads need safe types/size checks; credential/password handling secure.
- No promotional WhatsApp messages without appropriate permission (separate from providing contact data).

## Open questions for next approval

1. **D-030 now CONFIRMED (v1.9):** one premium template + configurable sections + theme presets. Minimum readiness fields were later CONFIRMED in D-033; three theme presets later CONFIRMED in D-034 (D-029 conditional automatic activation also confirmed).
2. Which signup/basic company-profile inputs are required versus optional for pilot?
3. **Template count approved D-030:** ONE. Which precise section types are included and the design quality bar remain OPEN.
4. Exact Block vs Deactivate semantics and website access.
5. Should MVP include a tiny lead inbox or move it after website pilot?

## Change control / handover

All three AIs must read `docs/DECISIONS.md`, this file, `docs/AI/CURRENT-STATE.md` before proposing or implementing tasks. Historical verification specs remain for future reference, but must not be pulled into milestone estimates for MVP without a new owner approval. **NO CODE AUTHORIZED.**

> **2026-10-17 v1.9 addendum:** D-030 confirms exactly one premium template with configurable sections and theme presets. D-031 later confirmed the **Core 9** section catalog; see `docs/WEBSITE-SECTIONS-PROPOSAL.md`. Editable field/section controls remain proposed for D-032.


---

**Current v2.3 override (D-032/D-033/D-034 CONFIRMED):** Core 9 guided fields/visibility and Move Up/Down, Essential Website Readiness, and three named presets are APPROVED. Exact character/card/media limits, theme hex/font tokens, Hero layout and post-live publication rules remain OPEN. Read `docs/SECTION-FIELDS-D032-CONFIRMED.md`, `docs/SITE-READINESS-D033-CONFIRMED.md`, `docs/THEME-D034-CONFIRMED.md`. No coding authorized.
