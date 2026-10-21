# EstateOS — Phase 3c Optional Website Sections Contract (APPROVED)

**Status:** APPROVED by the owner in chat on 2026-10-21, as written, including the confirmations in section 7 (D-115). Drafted by Claude Code the same day.
**Builds on:** Phase 3b (`docs/PHASE-3B-WEBSITE-FOUNDATION-CONTRACT-APPROVED.md`): the draft, per-section Save, guard, preview and template.
**Decisions implemented:** D-031, D-032 (optional sections), D-033, D-050, D-051, D-052, D-089, D-099, D-109, D-110, D-115, D-117.

## 0. Why 3c now

- 3c needs nothing from outside.
- 3d (image uploads) needs a storage account, and Phase 4 (going Live) is more useful once licensed Hero photos exist.
- **Properties** stays in Phase 5. Its slot in the section order is reserved but not shown.

## 1. Owner answers this contract is based on (approved 2026-10-21)

| # | Question | Recommended answer |
|---|---|---|
| 1 | Which sections are added? | **About**, **Services**, **Why Choose Us**, **Team** (D-032). Each is optional and does **not** affect website readiness (D-033). |
| 2 | Are new sections shown by default? | **No, all start hidden.** A section can be switched on only once it has its minimum content (below). The template never shows an empty section (D-032). |
| 3 | How are show/hide and order saved? | One **Layout** panel at the top of the editor: a Show/Hide switch plus **Move up / Move down** for each optional section, saved with its own **Save layout** button and version. It is separate from content saves (D-050 left this open). |
| 4 | Photos (About photo, Team photos)? | **Not in 3c.** They come with uploads in 3d. Team cards show initials until then. |
| 5 | Icons for Services / Why Choose Us? | A fixed list of **12 simple icons** drawn in the template (home, key, building, handshake, document, map pin, search, chart, shield, star, phone, people). No icon uploads. |
| 6 | Can Team members show their own phone/WhatsApp? | **Yes, optionally.** Entering a number requires ticking "This person agreed to show this number on the website" (D-099/D-117 spirit). Without the tick, the save is refused. |
| 7 | Limits (D-032 left them open)? | See section 3. |

## 2. Scope

**In scope:**
- Content forms for the 4 optional sections, each with its own **Save changes** and the existing Save / Discard / Stay guard (D-050/D-051).
- Repeatable cards with **Add**, **Remove** and **Move up/down**. No drag-only controls (D-032).
- The **Layout** panel (show/hide and order of the optional sections).
- Template rendering for all 4 sections in the 3 themes. The header gets simple in-page links for the sections that are shown.
- Super Admin preview shows them automatically (read-only).

**Out of scope:** photos (3d); Properties (5); testimonials, FAQ or any new section type; public site and Live (4).

## 3. Data and limits

New `WebsiteDraft.sections.*` entries, each with its own `version` (as in 3b):

| Section | Fields and limits | Minimum to show |
|---|---|---|
| `about` | heading 3–60 (default "About us"); story 20–1200 | story present |
| `services` | heading 3–60 (default "Our services"); 1–6 cards: title 2–40, description 0–160, icon from the list | 1 card |
| `whyChooseUs` | heading 3–60 (default "Why choose us"); 1–6 cards: title 2–40, detail 0–160, icon | 1 card |
| `team` | heading 3–60 (default "Our team"); 1–12 members: name 2–60, role 0–60, phone? / whatsapp? (signup phone rule) + `contactConsent: true` required when any number is given | 1 member |

**Layout (new):** `layout: { order: ['about','services','properties','whyChooseUs','team'], visible: { about, services, whyChooseUs, team }, version }`.
- Default order is the D-032 order. Everything starts hidden.
- `properties` keeps its place but is never shown before Phase 5.
- Header, Hero, Contact and Footer are fixed and not in the layout (D-032).

**Rules:**
- Saving a section's content to below its minimum while it is shown → `422`. The owner must hide it first; the message says so.
- Showing a section that is below its minimum → `422` naming the section.
- Readiness is unchanged: optional sections never block or count (D-033).

## 4. Versioned REST API — additions

| Method & path | Request | Success |
|---|---|---|
| `PUT /owner/website/sections/:section` *(extended)* | `section` adds `about`, `services`, `whyChooseUs`, `team`; body = that section's fields + `expectedVersion` | `200 { section, readiness }` |
| `PUT /owner/website/layout` | `{ order: [5 keys, each once], visible: { about, services, whyChooseUs, team }, expectedLayoutVersion }` | `200 { layout }` |
| `GET /owner/website`, `GET /super-admin/agencies/:id/website` *(extended)* | — | add the 4 sections and `layout` |

**Errors and checks:**
- `SECTION_CONFLICT` / `LAYOUT_CONFLICT` (409, stale version);
- 422 for limits, minimums, missing consent, unknown icon or unknown order keys;
- the 3b permissions apply unchanged (Rejected read-only, Deactivated 403, Blocked 401, no `agencyId` input).

**BFF:** the owner facade allows the 4 new section paths and `/owner/website/layout`.

## 5. Screens

- **Editor** (`/website/editor`):
  - The section list adds About, Services, Why Choose Us and Team, each marked "Shown" or "Hidden".
  - A **Layout** entry at the top opens the show/hide and Move up/down panel with **Save layout**.
  - Card editors show one card per row:
    - fields;
    - an icon picker (radio buttons with icon and name);
    - **Move up / Move down / Remove**;
    - **Add service / Add reason / Add member** while under the limit.
  - Team number fields show the consent checkbox as soon as a number is typed.
- **Preview / template:**
  - shown sections render in layout order between Hero and Contact;
  - responsive card grids: 1 column on phones, 2 on tablets, 3 on desktop;
  - text-only team cards with initials;
  - header links: "About", "Services", "Why us", "Team" for shown sections, plus "Contact";
  - the same D-042/section 8 design values, with no new colours.

## 6. Acceptance tests (D-093)

**Unit:** schemas at every limit (just inside and just outside); the minimum-to-show rule; the layout order must hold exactly the 5 keys; the consent rule; icon list membership; the template renders nothing for hidden or empty sections.

**API integration:**
1. Each new section saves with its own version, a stale version → `SECTION_CONFLICT`, and saving one section never changes another.
2. Layout: save order and visibility; stale → `LAYOUT_CONFLICT`; showing a section below its minimum → 422; emptying a shown section → 422.
3. Team numbers without consent → 422; with consent, they are saved and returned.
4. Readiness is the same before and after any 3c save.
5. Permissions and tenant isolation, as in 3b (Rejected, Deactivated, Blocked, injected `agencyId`, owner A vs B).
6. The Super Admin website view includes the new sections and layout; it creates no draft.

**BFF:** the new paths are allowed only on the owner portal.

**Gates:**
- typecheck, lint and build (5 workspaces), plus `npm test -w backend`;
- server-render of all sections in all 3 themes;
- an HTTPS end-to-end check with the synthetic test owner, deleting its test draft afterwards.

## 7. Owner confirmations (approved 2026-10-21)

The owner confirmed:

- New optional sections start hidden, and each needs minimum content before it can be shown.
- Show/hide and order are saved separately with **Save layout**.
- Photos are not in 3c; Team cards show initials until 3d.
- Team member numbers need the "agreed to show" tick.
- The limits in section 3 and the 12-icon list.
