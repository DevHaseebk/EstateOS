> **v3.4 CURRENT — D-045 Option A CONFIRMED:** Agency Admin Overview has a **compact, nonblocking four-step setup checklist** (Agency Details, Choose Theme, Customize Website, Preview Website); tasks can be visited in any order and Properties remain optional. Canonical: `docs/AGENCY-ONBOARDING-D045-CONFIRMED.md`. **NEXT D-046 PROPOSED ONLY**: navigation/screen grouping in `docs/AGENCY-ADMIN-NAVIGATION-D046-PROPOSAL.md`. Exact page labels/routes, responsive breakpoints and pilot CRM scope remain OPEN. **PLANNING ONLY / NO CODING.**

# EstateOS — MVP scope proposal (revised after D-028)


> **v2.4 / D-035 active Hero choice:** Full-Bleed Image Hero is CONFIRMED for all three presets (`docs/HERO-D035-CONFIRMED.md`). Any earlier notes labeling the *Hero layout itself* OPEN refer to historical planning only. The overlay numeric tokens, exact font/color values, media and mobile breakpoint limits remain OPEN; next D-036 typography proposal is NOT approved.


> **Latest design status (v2.3):** D-032 field/visibility controls, D-033 Essential Website Readiness and D-034 three curated preset names/count are CONFIRMED. Exact hex/font tokens, Hero layout and media limits remain OPEN. This document contains earlier planning snapshots; use canonical D-032/D-033/D-034 docs when any old statement conflicts.


**M00 · PLANNING ONLY.** D-028 pilot scope, D-029 activation, and D-030 one template are CONFIRMED. **D-031 CONFIRMED Core 9 sections;** individual editable fields and section controls remain PROPOSED.

## Proposed smallest valuable pilot

| Module | MVP proposal | Not for pilot |
|---|---|---|
| Agency signup | Self-service + Super Admin creation, basic contact information; Pending queue | Document/KYC onboarding, mandatory OTP/email verification gate |
| Agency admin | Very simple responsive setup wizard: agency profile -> choose template -> customize sections -> preview | Advanced permissions/complex navigation |
| Website builder | **CONFIRMED: one premium template with configurable sections and theme presets.** PROPOSED: editable Hero, Logo, About, Services, Contact and optional Properties; show/hide/reorder behavior not yet approved | Webflow-style page designer; multiple advanced themes |
| Public site | Mobile/desktop polished pages and zero-property fallback | Marketplace, complex search, custom domain self-service |
| Properties | OPTIONAL add/edit and photos, sale/rent/status and property details | Bulk upload, integrations, advanced analytics |
| Super Admin | See all agencies, private preview, Approve, Block, Deactivate; Pending visibility immediately | Detailed document verification, complex review workflow and retention |
| CRM | Proposal: minimal contact inquiry inbox, no complicated pipeline | AI CRM, WhatsApp sync, automation; confirm whether inbox belongs in pilot |
| Infrastructure | Authentication, tenant isolation, basic safe uploads and logs | Microservices, paid subscriptions, elaborate queues |

**D-030 CONFIRMED:** one premium section-based template with theme presets, not multiple initial templates. **D-031 CONFIRMED:** Header, Hero, About, Services, optional Properties, Why Choose Us, Team, Contact CTA and Footer. **D-032 CONFIRMED:** section fields, visibility and ordering. **D-034 CONFIRMED:** three named presets on the one template; exact hex/font values OPEN.

**D-029 CONFIRMED:** only a Super Admin approved and **ready** website automatically goes live and receives a visible working public link. If unready, agency is approved but website unpublished; no dummy/broken URL. No mandatory owner initial Publish click. Exact readiness criteria are CONFIRMED D-033; post-approval editing and later auto-retry trigger remain OPEN. See `docs/SITE-READINESS-D033-CONFIRMED.md`.

## MVP definition of done (proposed)

A sample agency with **zero properties** registers, selects a template, adds logo and hero/service/contact content, views a private preview; Super Admin sees agency and approves; when website publication condition is met, customer can open polished branded website via agency link. Super Admin can block or deactivate access. Second tenant cannot access first tenant's drafts, images or properties. Desktop and mobile flows are both comfortable with little training.

## Out of MVP after D-028

D-018/D-021 email verification approval gate; D-023–D-027 required detailed proof documents/map pin, proof upload rules and document access features; D-028 original planned retention question is **not relevant until verification becomes in-scope again**. Detailed history remains in docs/future references.


---

**Current v2.3 override:** D-032 section fields/controls CONFIRMED; D-033 Essential Site Readiness CONFIRMED; D-034 three curated theme preset names/count CONFIRMED. Exact character/card/media limits, preset hex/font values, Hero layout and post-live publication remain OPEN. Sources: `docs/SECTION-FIELDS-D032-CONFIRMED.md`, `docs/SITE-READINESS-D033-CONFIRMED.md`, `docs/THEME-D034-CONFIRMED.md`. No coding.


## v3.3 D-044 Task-First Agency Admin direction (CONFIRMED)

The pilot's Agency Admin Overview is task-first: surface current status, next website setup action and simple access to edit/preview; properties remain optional. Prefer clear desktop sidebar-style navigation and a compact understandable mobile menu over analytics-first charts. **D-044 does not approve exact navigation labels, a screen list, an onboarding checklist, or CRM/Inquiries inclusion.** Canonical `docs/DASHBOARD-UX-D044-CONFIRMED.md`; next UX screen map/checklist proposal `docs/AGENCY-ADMIN-SCREENS-D045-PROPOSAL.md` is UNAPPROVED. All code remains unauthorized.


## v3.4 confirmed onboarding UX (D-045)

The lean MVP includes a compact, nonblocking four-step website setup checklist on Agency Admin Overview (agency details, one-of-three theme selection, website content editing, website preview). Steps open independently and do not gate dashboard access, approval, or publication beyond pre-existing D-014/D-029/D-033 checks. Property listing is optional. D-046 grouped/flat/home-hub navigation remains proposed, not confirmed.
