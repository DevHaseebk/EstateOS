# EstateOS — Phase 3b My Website Foundation Contract (APPROVED)

**Status:** APPROVED by the owner in chat on 2026-10-21, as written, including the confirmations in section 10 (D-115). Drafted by Claude Code the same day.
**Builds on:** Phase 1, 2a, 2b and 3a contracts (`docs/PHASE-*-APPROVED.md`).
**Decisions implemented:** D-030, D-031, D-032 (required sections), D-033, D-034–D-043, D-045, D-046, D-048, D-049, D-050, D-051, D-052, D-085, D-089, D-099, D-101, D-102, D-108, D-109, D-110, D-115.

## 0. How the rest of Phase 3 is split (approved)

| Phase | Contents |
|---|---|
| **3b (this contract)** | Private website draft; **My Website** hub; theme preset selection; Guided Editor for the four **required** sections (Header, Hero, Contact, Footer); the real D-033 readiness check; private preview for the owner and the Super Admin; the D-045 checklist on Overview; Profile values flowing into the draft (D-085). |
| 3c | Optional sections About, Services, Why Choose Us, Team: show/hide, Move up/down, repeatable cards. |
| 3d | Image uploads (Hero photo, logo, About and Team photos) with managed object storage (D-105, D-086). Needs an owner-created storage account. |
| 4 | First automatic Live activation and the public agency website (D-029, D-077, D-090, D-091, D-119). |
| 5 | Properties. |

The Properties section stays out until Phase 5. A site without it is fully valid (zero properties, D-033).

## 1. Owner answers this contract is based on (approved 2026-10-21)

| # | Question | Recommended answer |
|---|---|---|
| 1 | **Where does the website design code live?** The same template must render in the owner's private preview, in the Super Admin preview, and later in the public site (`frontend/`). | Add one shared **library** workspace at the root, `site-template/`, holding the template components and theme tokens. It is not an app and has no port. The four apps and ports stay unchanged. |
| 2 | **Which Hero photo counts as a "legitimate platform default" (D-108)?** | A small curated set of photos that **you supply**, each with its licence recorded in `site-template/assets/LICENSES.md` (source, author, licence, date). Until at least one is added, the Hero image item stays "not met", and Claude adds no photos on its own. |
| 3 | Is a theme preselected for new agencies? | **No.** D-033 requires a template to be *selected*, so "Choose a theme" stays unmet until the owner applies one. The preview shows Modern Light marked "Theme not chosen yet". |
| 4 | Which text limits apply (D-032 left them open)? | Hero heading 3–80, subtitle 0–160, button label 2–30; Contact heading 3–80, message 0–300; Header contact button label 2–30 characters. |
| 5 | Which design values fill the gaps D-038/D-042/D-043 left open? | The values in **section 8**. They follow the approved fonts, sizes and colours and are checked for WCAG AA contrast. You approve them with this contract and can change them later. |
| 6 | When the agency is Approved and the site is ready, what happens in 3b? | **Nothing public yet.** The hub says "Ready — going live comes in the next phase". Automatic first Live is Phase 4. It never claims "Live" early. |

## 2. Scope

**In scope (3b):**
- **Website draft** (one per agency, private), created on first use:
  - the applied theme preset;
  - Header, Hero and Contact section content;
  - values mapped from the Profile.
- **Agency Admin → My Website** (now in the navigation, D-046), with:
  - a hub (D-048);
  - Theme selection (D-049);
  - the Guided Editor for Header, Hero and Contact (D-050, D-051);
  - Preview (D-052, D-101).
- **Readiness** (D-033): one server function, the same messages for owner and Super Admin.
- **Overview:** the D-045 four-task checklist with real completion.
- **Super Admin:**
  - real readiness in the directory and the agency page;
  - the **Private preview** button becomes active (D-065, D-101).

**Out of scope:** everything in the 3c, 3d, 4 and 5 rows; post-Live Publish Updates (D-053); notifications.

## 3. Data model

**`WebsiteDraft` (new collection; one per agency, unique `agencyId`; always tenant-scoped, D-089):**

| Field | Contents |
|---|---|
| `agencyId` | from the session only |
| `theme` | `{ preset: 'MODERN_LIGHT' \| 'WARM_EDITORIAL' \| 'CONTEMPORARY_DARK' \| null, version }`, starting `null` / 0 |
| `sections.header` | `{ contactButtonLabel, preferredContact: 'WHATSAPP' \| 'PHONE', version }` |
| `sections.hero` | `{ heading, subtitle?, ctaLabel, heroImage: { kind: 'PLATFORM_DEFAULT', assetId } \| null, version }` (CTA target is always Contact until Properties exist) |
| `sections.contact` | `{ heading, message?, version }` |
| `mapped` | values copied from the Profile (D-085): `agencyName`, `phone?`, `whatsapp?`, `publicEmail?`, `officeAddress?`, `city?`, and `mappedAt` |

- **Defaults** (shown as empty fields with helpful placeholders, never saved as fake content):
  - heading empty;
  - Header button label "Contact us";
  - Contact heading "Get in touch";
  - preferred contact = WhatsApp when it is public, otherwise Phone.
- **D-085 mapping:**
  - every successful **Profile save** refreshes `mapped` in the **same transaction**;
  - a number is mapped only if it is chosen as public (D-099).
  - Before Live this is equivalent to reading the Profile. After Live (Phase 4) it keeps public changes behind Publish Updates.
- **Migration:** the same idempotent CLI creates nothing for existing agencies. Drafts appear on first use.

## 4. Readiness (D-033) — one server function

`getReadinessIssues(agency, draft)` returns a list. The site is ready only when the list is empty:

| Key | Met when | Owner message (example) |
|---|---|---|
| `THEME` | `theme.preset` is set | "Choose a theme for your website." |
| `AGENCY_NAME` | the agency name is non-empty | "Add your agency name." |
| `HERO_HEADING` | the Hero heading is saved and non-empty | "Write a main heading for your website." |
| `PUBLIC_CONTACT` | a mapped public phone or WhatsApp exists | "Choose a phone or WhatsApp number to show on your website (Agency profile)." |
| `HERO_IMAGE` | the Hero has a platform photo **that is listed with a licence** | "Choose a main photo for your website." |

- Readiness is **computed on every read, never stored**. Phase 4 adds the first-Live trigger.
- Super Admin directory and detail: `websiteReadiness: 'READY' | 'NOT_READY'` plus the same issue list.
- Readiness never changes review, restriction or publication status.

## 5. Permissions

- Same rule as the Profile: `ownerCanEdit` (Pending, Changes Requested or Approved, and unrestricted) for theme and section saves.
  - Rejected: read-only (`403 WEBSITE_READ_ONLY`).
  - Deactivated: read-only (`403 AGENCY_DEACTIVATED`).
  - Blocked: no session.
- Preview is allowed whenever the owner can sign in (also read-only states). The Super Admin can preview any agency, read-only.
- There is **no public URL** in 3b. Draft data is served only to authenticated management sessions through the BFFs (D-101).

## 6. Versioned REST API — additions to `/api/v1`

| Method & path | Portal | Request | Success |
|---|---|---|---|
| `GET /owner/website` | OWNER | — | `200 { theme, sections, mapped, readiness: { ready, issues[] }, heroDefaults: [{ id, label }], canEdit }` (also used to render the preview) |
| `PUT /owner/website/theme` | OWNER | `{ preset, expectedThemeVersion }` | `200 { theme, readiness }` |
| `PUT /owner/website/sections/:section` | OWNER | `section` ∈ `header`, `hero`, `contact`; body = that section's fields + `expectedVersion` | `200 { section, readiness }` |
| `GET /super-admin/agencies/:id/website` | SUPER_ADMIN | — | same shape as the owner GET, with `canEdit: false` |
| Directory and detail *(extended)* | SUPER_ADMIN | — | real `websiteReadiness` and `readinessIssues` |

**Validation:**
- strict schemas with the limits from section 1 Q4;
- `heroImage.assetId` must be in the licensed default list;
- `preferredContact` must point to a number that is public;
- unknown fields → 422; any `agencyId` → 422.

**Errors:**

| Code | Status | Meaning |
|---|---|---|
| `THEME_CONFLICT` | 409 | stale theme version |
| `SECTION_CONFLICT` | 409 | stale section version |
| `WEBSITE_READ_ONLY` | 403 | Rejected |
| `AGENCY_DEACTIVATED` | 403 | Deactivated |

**BFF:** the owner facade adds the three owner routes; the Super Admin facade adds the website GET.

## 7. Screens

**Agency Admin** (navigation: Overview, **My Website**, Agency profile):

| Route | Screen |
|---|---|
| `/website` | **Hub** (D-048): website status and readiness first (the missing items with links), **one** main action ("Choose a theme" / "Continue setup" / "Preview your website"), then three tools: Theme, Edit website, Preview. No public link in 3b. |
| `/website/theme` | The three presets as cards. The **saved** one is marked. Selecting another one shows a non-saved candidate preview. **Apply theme** saves it; **Cancel** keeps the saved one (D-049). |
| `/website/editor` | List of sections: Header, Hero, Contact (editable) and Footer (built from the Profile, with a link to Agency profile). One section open at a time, each with its own **Save changes** (D-050). Leaving a section, entering Preview or leaving the page with unsaved edits asks **Save / Discard / Stay** (D-051). |
| `/website/preview` | Full-width rendering of the **saved** draft with the **applied** theme (D-052), with a bar saying "Private preview — not public" and a desktop/mobile width toggle. |

- **Overview checklist** (D-045, not a gate), with completion computed from real data:
  - Agency details: done when a public number is chosen;
  - Choose theme: done when applied;
  - Customize website: done when the Hero heading is saved;
  - Preview website: a link only, with no completion tracking.

**Super Admin:**
- The directory badge shows "Website: ready / not ready".
- The agency page lists the readiness issues.
- **Private preview** opens `/agencies/[id]/preview` (read-only, same renderer).

**Template rendering (`site-template/`):**
- One responsive template with Header, Hero (full-bleed image, D-035), Contact and Footer.
- Hidden or empty optional parts leave no gaps or broken links.
- A text logo (the agency name) is shown when there is no logo.
- Fonts per D-039 (Manrope / Playfair Display / Inter) are self-hosted through each Next.js app.

All screens: plain English, responsive (D-109), WCAG 2.2 AA target (D-110).

## 8. Design values approved with this contract (fill D-038/D-042/D-043 gaps)

| Token | Value |
|---|---|
| Type sizes | Hero `clamp(2.5rem, 1.6rem + 3.2vw, 4.5rem)` (40→72 px, D-041), H2 `clamp(1.75rem, 1.35rem + 1.4vw, 2.75rem)` (28→44 px), body `1rem` (16 px) |
| Weights / line heights | headings 700, Warm Editorial display headings 600; body 400, buttons 600; line height headings 1.1, body 1.6 |
| Secondary text | `primaryText` at 72 % opacity on page and surface |
| Button on accent | white text on Modern Light `#365D6A` (7.17:1) and Warm Editorial `#775639` (6.62:1); `#171B1D` text on Contemporary Dark `#C6AA7A` (7.79:1). Base text on page background: 13.39 / 11.46 / 15.38:1 |
| Hero overlay (D-043) | desktop: left-to-right gradient `rgba(10,12,14,.72)` at 0 % → `rgba(10,12,14,.35)` at 55 % → transparent at 80 %; mobile (< 768 px): bottom-to-top with the same stops; Hero text white; min height 70 vh desktop / 80 vh mobile |
| Layout | container max 1200 px, side padding 20 px mobile / 32 px desktop; section spacing 64 px mobile / 96 px desktop; radius 12 px cards / 10 px buttons; button height 48 px; focus ring 3 px in `accent` (white on the Hero) |
| Breakpoints | Tailwind standard (D-109) |

Contrast is verified with automated checks on the real components. If any pair fails, Claude reports it before shipping and does not silently change approved HEX values.

## 9. Acceptance tests (D-093)

**Unit:**
- `getReadinessIssues` for every single missing item and for all items met;
- section schemas at their limits (just inside and just outside);
- a `heroImage` that is not on the licensed list is rejected;
- the `preferredContact` rule.

**API integration (in-memory replica set, synthetic data):**
1. The first GET creates an empty draft with no theme; the issues are `THEME`, `HERO_HEADING`, `PUBLIC_CONTACT` and `HERO_IMAGE`.
2. Apply theme → saved, version incremented, `THEME` issue gone. A stale version → 409 with nothing saved.
3. Section save for each section; stale → `SECTION_CONFLICT`; parallel saves → exactly one wins; saving one section never changes another.
4. A Profile save refreshes `mapped` in the same transaction. A number not chosen as public is never mapped.
5. Readiness becomes `READY` once all 5 are met (using a licensed test asset). Approved + ready still has `publicationStatus: NEVER_PUBLISHED`.
6. Permissions: Approved edits; Rejected → `WEBSITE_READ_ONLY`; Deactivated → `AGENCY_DEACTIVATED` but GET works; Blocked → 401.
7. Tenant isolation: an injected `agencyId` → 422; owner A never reads or writes B's draft.
8. Super Admin website GET and readiness in the directory and detail; an owner session on those routes is rejected.
9. Saves never change review, restriction or publication.

**BFF:** the new routes are allowed only on their portal; `PUT` only on the listed paths.

**UI checks:**
- the template renders without horizontal scrolling at 360, 768 and 1280 px;
- automated contrast checks for text and buttons on all three themes;
- keyboard-only use of the theme cards, the editor and the Save / Discard / Stay dialog.

**Gates:**
- root typecheck, lint and build (now including `site-template/`), plus `npm test -w backend`;
- an HTTPS end-to-end check with the synthetic test owner, restoring its draft afterwards.

## 10. Owner confirmations (approved 2026-10-21)

The owner confirmed:

- A new shared library workspace `site-template/` (no new app, no new port).
- **You provide the default Hero photos with licence details.** Until then the Hero image item stays unmet and no site can be "ready".
- No theme is preselected; the owner must choose one.
- The text limits in section 1 and the design values in section 8.
- Approved + ready shows "Ready — going live comes in the next phase". Nothing goes public in 3b.
