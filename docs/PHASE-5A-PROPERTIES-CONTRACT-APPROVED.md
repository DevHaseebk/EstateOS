# EstateOS — Phase 5a Properties (without photos) Contract (APPROVED)

**Status:** APPROVED by the owner in chat on 2026-10-22, as written, including the confirmations in section 6 (D-115). Drafted by Claude Code the same day.
**Builds on:** Phases 1–4b, especially the 3c layout (the reserved `properties` slot) and the 4a/4b revisions and Publish updates.
**Decisions implemented:** D-031, D-032 (Properties section), D-046, D-047 (optional Add Property), D-056, D-057, D-058, D-061, D-062, D-063, D-078, D-084, D-089, D-103, D-104, D-109, D-110, D-115.

## 0. How Phase 5 is split (approved)

| Phase | Contents |
|---|---|
| **5a (this contract)** | Property records (the six required Basics plus optional Details), Available/Sold/Rented, Archive/Restore (no delete); Agency Admin list cards and the one-page form; the public **Properties** section on the website; eligible properties go public through the first Live (D-084) and **Publish updates** (D-063). |
| 3d / 5b (later) | Photos: an optional gallery (max 10, 5 MB, JPEG/PNG/WebP, cover, reorder), together with the image storage of 3d (D-059, D-060, D-086, D-105, D-106). |

Photos are optional (D-058), so a property without a photo is complete. Cards show a neutral placeholder instead.

## 1. Owner answers this contract is based on (approved 2026-10-22)

| # | Question | Recommended answer |
|---|---|---|
| 1 | Exact field rules (D-058/D-103 left them open)? | See section 2. Type: House, Apartment, Plot, Shop, Office, Other. Price: a whole number of PKR, 1 to 10,000,000,000 (for Rent it means per month). City and Area: free text, 2–80 characters. |
| 2 | Optional Details? | Size (number) with unit **sq ft / sq yd / marla / kanal**; bedrooms 0–20; bathrooms 0–20; description up to 2,000 characters. |
| 3 | Which status fits which listing? | **Available** for both. **Sold** only for For Sale. **Rented** only for For Rent. Changing For Sale/For Rent with a status that no longer fits is refused (422). New properties start **Available** (D-104). |
| 4 | Is status saved with the form? | **Yes**, as part of the one **Save property** (D-061). **Archive / Restore** are separate actions, each with a confirmation (D-062). There is **no delete**. |
| 5 | When do properties reach the public website? | **Only through a revision:** the automatic first Live (D-084) or **Publish updates** (D-063). Saving, changing status, archiving or restoring a property marks "Unpublished changes" on a Live site; nothing changes publicly until the owner publishes. Only **Available and not archived** properties are ever public (D-078). |
| 6 | How is the public Properties section shown? | It is the reserved slot in **Layout** (3c), hidden by default. It can be shown only when at least one Available, non-archived property exists. Editable: heading (default "Our properties") and how many cards to show (**3 or 6**, D-032), newest first. Each card has an **Enquire** button: WhatsApp with a short prefilled message if WhatsApp is public, otherwise a phone call. No separate property pages in 5a. |
| 7 | Is there a limit per agency? | **200 non-archived properties** for the pilot (archived ones don't count). |

## 2. Data model and limits

**`Property` (new collection, always scoped by the session's `agencyId`, D-089):**

| Field | Rule |
|---|---|
| `title` | required, 3–100 characters |
| `intent` | required: `SALE` or `RENT` |
| `type` | required: `HOUSE`, `APARTMENT`, `PLOT`, `SHOP`, `OFFICE`, `OTHER` |
| `pricePkr` | required integer, 1 – 10,000,000,000 |
| `city`, `area` | required, 2–80 characters each |
| `size` | optional `{ value: >0 and ≤ 1,000,000 (up to 2 decimals), unit: SQ_FT, SQ_YD, MARLA or KANAL }` |
| `bedrooms`, `bathrooms` | optional integers 0–20 |
| `description` | optional, up to 2,000 characters, plain text |
| `availability` | `AVAILABLE` (default), `SOLD` (Sale only) or `RENTED` (Rent only) |
| `archivedAt` | set by Archive, removed by Restore |
| `version`, `createdAt`, `updatedAt` | — |

- **Draft:** the website draft adds `sections.properties { heading, displayCount: 3 | 6, version }`.
- **Snapshot:** a revision's `site.properties` becomes the list of **eligible** properties (Available and not archived), newest first, at most 200. Each entry holds only the fields shown publicly (no timestamps, no internal ids beyond a stable key).
- **Fingerprint:** "Unpublished changes" therefore also reflects property changes.

## 3. Versioned REST API — additions (owner portal unless noted)

| Method & path | Request | Success |
|---|---|---|
| `GET /owner/properties?archived=false\|true` | — | `200 { items: [card fields], counts: { active, archived } }`, newest first |
| `GET /owner/properties/:id` | — | `200 { property }`; another agency's id → **404** |
| `POST /owner/properties` | the whole form (section 2) | `201 { property }` (Available) |
| `PUT /owner/properties/:id` | the whole form + `availability` + `expectedVersion` | `200 { property }`; stale → `409 PROPERTY_CONFLICT` |
| `POST /owner/properties/:id/archive` / `/restore` | `{ expectedVersion }` | `200 { property }`; wrong state → `409 INVALID_TRANSITION` |
| `PUT /owner/website/sections/properties` | `{ heading 3–60, displayCount: 3\|6, expectedVersion }` | as for other sections |
| `GET /owner/website`, `GET /super-admin/agencies/:id/website` *(extended)* | — | add the section settings and the eligible-property list, so previews show them |
| `GET /super-admin/agencies/:id/properties` | SUPER_ADMIN, read-only | `200 { items }` for the review page |

**Other rules:**
- **Errors:** 422 for field rules, the status/intent rule and the 200 limit (`PROPERTY_LIMIT`). 403 when read-only (Rejected or Deactivated); Blocked → 401. Any `agencyId` input → 422.
- **Layout:** showing `properties` needs at least one eligible property; otherwise 422, same rule style as 3c.
- **BFF:** the owner facade allows the property routes and the properties section; the Super Admin facade allows the read-only list.

## 4. Screens

**Agency Admin:**
- The navigation adds **Properties** (D-046).
- Overview gets an optional secondary **Add property** shortcut (D-047); it is never required.
- `/properties` (D-056):
  - responsive **cards** (grid on desktop, one column on phones), each showing a placeholder image, title, For sale/For rent, type, area and city, price, and status;
  - an **Active / Archived** switch;
  - **Add property**; a friendly empty state ("No properties yet — your website works without them").
- `/properties/new` and `/properties/[id]` (D-057), one page:
  - **Basics** (the six required fields) visible;
  - **Details** (size and unit, bedrooms, bathrooms, description) expandable;
  - **Photos** expandable, saying "Photo upload comes in a later phase";
  - an **Availability** select (only the options that fit For Sale/For Rent);
  - one **Save property** with Save / Discard / Stay on leaving (D-061);
  - **Archive** or **Restore** with confirmation.
- **Editor:** a new **Properties** section (heading and number of cards). In **Layout** the Properties row becomes usable (shown only with an eligible property).
- **After Live:** property pages show the same note — "Changes reach your live website when you publish them from My Website."

**Public website (template):**
- Properties section between Hero and Contact, in layout order.
- Cards: placeholder visual, title, **For sale / For rent**, type · area, city, price ("PKR 25,000,000" or "PKR 85,000 / month"), optional size/beds/baths, and **Enquire**.
- 1/2/3 columns as in 3c; never empty, never fake listings (D-032).

**Super Admin:** the agency page gets a read-only **Properties** count and list (title, intent, price, status, archived).

All screens: plain English, responsive (D-109), WCAG 2.2 AA target (D-110).

## 5. Acceptance tests (D-093)

**Unit:**
- property schema at every limit (just inside and just outside);
- the status/intent rule;
- price and size formatting;
- the eligibility filter (Available and not archived only);
- the fingerprint changes when an eligible property changes and not for a no-op save.

**API integration:**
1. Create (Available default) → read → whole-form update with `expectedVersion`; stale → 409; parallel saves → exactly one wins.
2. Sold on a For Rent listing / Rented on a For Sale listing → 422; switching intent with an unfit status → 422.
3. Archive/Restore with versions; wrong state → 409; archived ones are excluded from the active list and the 200 limit; there is no delete route.
4. Tenant isolation: another agency's property id → 404 for GET, PUT, archive and restore; an injected `agencyId` → 422.
5. Permissions: Rejected/Deactivated read-only (403), Blocked 401; Approved and Pending can manage properties.
6. Publication:
   - first Live includes the eligible properties (D-084) and excludes Sold, Rented and Archived (D-078);
   - on a Live site, a property save or archive → `unpublishedChanges: true` with the public site unchanged → Publish updates → the public list changes;
   - zero properties still go Live.
7. Layout: showing Properties with no eligible property → 422; with one → 200; the section settings save with versions.
8. Super Admin read-only list; owner sessions are rejected on it.

**BFF:** the new routes are allowed only on their own portal.

**Gates:**
- typecheck, lint and build (5 workspaces), plus `npm test -w backend`;
- server-render of the Properties section in all 3 themes;
- an HTTPS end-to-end check on the synthetic Live agency: add properties → unpublished → publish → visible publicly; mark Sold → publish → gone. All data stays synthetic.

## 6. Owner confirmations (approved 2026-10-22)

The owner confirmed:

- Photos are not in 5a (they come with uploads); a placeholder is shown.
- The field rules in sections 1–2, including the Sold-only-for-Sale / Rented-only-for-Rent rule and the 200 active-property limit.
- Properties reach the public site only through first Live or Publish updates, and only Available and non-archived ones.
- Public cards with an Enquire button (WhatsApp or phone); no separate property pages yet.
- The synthetic Live agency gets synthetic properties and new revisions in the dev DB.
