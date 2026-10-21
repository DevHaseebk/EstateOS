# EstateOS — Phase 3a Agency Admin Shell and Agency Profile Contract (APPROVED)

**Status:** APPROVED by the owner in chat on 2026-10-21, as written, including the confirmations in section 8 (D-115). Drafted by Claude Code the same day.
**Builds on:** `docs/PHASE-1-AUTH-CONTRACT-APPROVED.md`, `docs/PHASE-2A-REVIEW-CONTRACT-APPROVED.md`, `docs/PHASE-2B-DIRECTORY-RESTRICTIONS-CONTRACT-APPROVED.md`.
**Decisions implemented:** D-028, D-044, D-045 (partly), D-046, D-047, D-055, D-072, D-073, D-076, D-085 (Profile side only), D-089, D-099, D-100, D-102, D-109, D-110, D-115.

## 0. How Phase 3 is split (approved)

The Phase 2a contract put "Agency Profile editing, website editor, readiness, private preview" into Phase 3. That is too much for one safe step, so this contract proposes:

| Phase | Contents |
|---|---|
| **3a (this contract)** | Agency Admin app shell with grouped navigation; status-first Overview; one-page **Agency Profile** with Save Profile and unsaved-changes guard; public contact choice; Super Admin sees the profile. |
| 3b (later contract) | My Website hub, theme preset selection, Guided Website Editor (Hero first), image storage (Hero image and logo, D-105/D-108), website readiness (D-033), private preview (D-101), D-085 mapping of Profile into the private site draft, full D-045 checklist. |
| 4 (later) | First automatic Live activation, public agency website, Blocked/Deactivated public suppression (D-029, D-083, D-090, D-091, D-119). |
| 5 (later) | Properties (D-056–D-063, D-103–D-106). |

## 1. Owner answers this contract is based on (approved 2026-10-21)

| # | Question | Recommended answer |
|---|---|---|
| 1 | **Can an Approved agency edit its profile?** Phase 2a owner answer 4 said owners edit only while Pending or Changes Requested. That would stop an Approved (later Live) agency from ever changing its phone number. | **Change answer 4:** the owner may edit the profile while **Pending, Changes Requested or Approved**. **Rejected** stays view-only. **Blocked/Deactivated** stay as in Phase 2b (no access / read-only). |
| 2 | Where does the owner choose which number is public (D-099)? | On the Agency Profile, in a **"Shown on your website"** group: two checkboxes, "Show mobile number" and "Show WhatsApp number". Both are **off by default**. Choosing none is allowed when saving; it only affects website readiness later (3b). |
| 3 | Which fields does the Profile have? | **Essentials (always visible):** agency name, owner name, mobile, WhatsApp, the two "shown on website" choices, login email (read-only). **More details (collapsed):** short description, office address, city, service areas, public email. |
| 4 | Can the owner change the login email or upload a logo? | **Not in 3a.** Email changes stay with support. Logo upload needs image storage, which comes in 3b. |
| 5 | What does the navigation show before the website and property screens exist? | **Only screens that work:** Overview and Agency Profile. My Website and Properties are added when they are built. No dead links or "coming soon" pages. |
| 6 | Does editing the profile change the review status? | **No.** Saving never changes review, restriction or publication. Under Changes Requested the owner edits and then uses the existing **Resubmit for review** button. |

## 2. Scope

**In scope (3a):**
- **Agency Admin shell** (D-044, D-046):
  - after sign-in, a compact sidebar on desktop and a simple menu on mobile;
  - top-level destinations: **Overview** and **Agency Profile**;
  - the agency name, the owner name and a Sign out button.
- **Overview** (D-047):
  - the true **review status** and **website status** shown separately;
  - one primary next action;
  - the existing review card (reason, Resubmit) and the Deactivated notice.
- **Agency Profile** (D-055, D-100, D-099):
  - one page: Essentials visible, More details collapsible;
  - one **Save profile** button;
  - **Save / Discard / Stay** when leaving with unsaved changes.
- **Super Admin:** the agency page shows the saved profile (read-only) so a reviewer can check it.

**Out of scope:** everything in the 3b, 4 and 5 rows above. Also out: the Settings page, email or password change by the owner, notifications, staff accounts (D-072), audit entries for profile edits (D-092 covers review and restriction actions only).

## 3. Edit permission (amends Phase 2a owner answer 4)

`ownerCanEdit(agency)` becomes:

| Review status | Restriction `NONE` | `DEACTIVATED` | `BLOCKED` |
|---|---|---|---|
| `PENDING` | edit | read-only | no access (401) |
| `CHANGES_REQUESTED` | edit | read-only | no access |
| `APPROVED` | **edit (new)** | read-only | no access |
| `REJECTED` | read-only | read-only | no access |

- One shared check is used by the API (enforced) and the screens (buttons hidden or disabled).
- Saving while read-only:
  - Deactivated → `403 AGENCY_DEACTIVATED` (Phase 2b);
  - Rejected → `403 PROFILE_READ_ONLY`.
- `canResubmit` is unchanged: Changes Requested and unrestricted only.

## 4. Data model changes

**`Agency`** — new fields (existing `name`, `mobileE164`, `whatsappE164` stay the source of truth):

| Field | Type / rule | Default |
|---|---|---|
| `publicContact` | `{ showMobile: boolean, showWhatsapp: boolean }` | both `false` (D-099: private unless chosen) |
| `profile.description` | string, trimmed, 0–600 chars, plain text | absent |
| `profile.officeAddress` | string, trimmed, 0–200 chars | absent |
| `profile.city` | string, trimmed, 0–80 chars | absent |
| `profile.serviceAreas` | string, trimmed, 0–200 chars (free text, e.g. "DHA, Clifton") | absent |
| `profile.publicEmail` | valid email, max 254 chars, lower-cased | absent |
| `profileVersion` | integer | 0 |
| `profileUpdatedAt` | date | absent |

**`User` (owner):** `name` becomes editable through the Profile (2–100 chars). `emailNormalized` is read-only.

- Agency name and owner name are saved **in one transaction** with the version check, so both are saved or neither.
- **Migration:** the same idempotent CLI (`npm run migrate:review-axes -w backend`) also sets `profileVersion: 0` and `publicContact: { showMobile: false, showWhatsapp: false }` where missing.

## 5. Versioned REST API — additions to `/api/v1`

| Method & path | Portal | Request | Success |
|---|---|---|---|
| `GET /owner/profile` | OWNER | — (agency from the session only) | `200 { agencyName, ownerName, loginEmail, mobile, whatsapp, publicContact: { showMobile, showWhatsapp }, profile: { description?, officeAddress?, city?, serviceAreas?, publicEmail? }, version, updatedAt, canEdit }` |
| `PUT /owner/profile` | OWNER | the **whole form**: `{ agencyName, ownerName, mobile, whatsapp, publicContact, profile, expectedProfileVersion }` | `200` with the same body as GET |
| `GET /super-admin/agencies/:id` *(extended)* | SUPER_ADMIN | — | adds `profile` and `publicContact` (read-only) |

**Validation (strict schemas):**
- Unknown fields → `422`. Any `agencyId` in the body, query or header → `422` (Phase 1 rule).
- Phone numbers use the signup rule (Pakistani `03…` or international `+…`).
- Optional texts: an empty string is saved as "not set".

**Errors:**

| Code | Status | Meaning |
|---|---|---|
| `PROFILE_CONFLICT` | 409 | stale `expectedProfileVersion` (saved in another tab) |
| `PROFILE_READ_ONLY` | 403 | Rejected |
| `AGENCY_DEACTIVATED` | 403 | Deactivated |

Existing: 401, 403 CSRF/Origin, 422.

**BFF:** the owner facade adds `GET /owner/profile` and `PUT /owner/profile`, and learns the `PUT` method. Everything else stays 404.

## 6. Screens (Agency Admin, `admin/`)

Routes use Next.js route groups (D-109):

| Route | Screen |
|---|---|
| `/` | sign-in / register / reset (unchanged) when signed out; **Overview** when signed in |
| `/profile` | Agency Profile; signed out → back to `/` |

- **Shell:**
  - desktop (≥ `lg` 1024 px): left sidebar with "Overview" and "Agency profile", the agency name on top, Sign out at the bottom;
  - mobile: a top bar with a **Menu** button that opens the same two links;
  - the current page is marked (`aria-current`); keyboard and screen-reader friendly (D-110).
- **Overview:**
  1. **Status:** "Agency review: Pending / Changes requested / Approved / Not approved" and, separately, "Website: not live yet — website setup comes next". The account notice appears when Deactivated.
  2. **One primary action:**
     - "Complete your agency details" when no number is chosen for the website, or when Changes are Requested;
     - otherwise "Review agency details".
     - Both open `/profile`. When the profile is read-only, the action is "View agency details".
  3. The existing review card with the reason and **Resubmit for review**.
- **Agency Profile:**
  - **Header:** "Agency profile", with one line explaining that these details are used for the agency's account and, later, its website.
  - **Essentials:**
    - Agency name, Owner name, Mobile number, WhatsApp number.
    - **Shown on your website**: two checkboxes, with the note "Nothing is shown publicly until you choose it. At least one is needed before your website can go live."
    - Login email (read-only, "Contact support to change it").
  - **More details** (collapsed by default, opens with a button): description (with a character counter), office address, city, service areas, public email.
  - **Save profile:**
    - disabled while nothing has changed;
    - shows "Saved" only after the server confirms;
    - field errors appear next to each field.
    - On 409 the page shows "These details were changed in another window. Reload to see the latest version." Your typed changes stay on screen until you reload.
  - **Unsaved changes guard:**
    - leaving through the app's own links or Sign out opens a **Save / Discard / Stay** dialog;
    - Save leaves only after a successful save;
    - browser close or refresh uses the browser's own "Leave site?" prompt.
  - **Read-only (Rejected or Deactivated):** the fields are shown but disabled, with a short reason and no Save button.

**Super Admin agency page:** the "Agency and owner" panel adds description, office address, city, service areas, public email and "Shown on website: Mobile / WhatsApp / none".

All screens: plain English, responsive (D-109), WCAG 2.2 AA target (D-110).

## 7. Acceptance tests (D-093)

**Unit:**
- `ownerCanEdit` for all 4 × 3 combinations from section 3;
- profile schema: phone formats, length limits (just inside and just outside each limit), empty optional strings become "not set", invalid public email, unknown field.

**API integration (in-memory replica set, synthetic data D-116):**
1. GET returns the owner's own profile with both public-contact choices off by default.
2. A PUT with the full form saves everything (agency and owner name), increments `version`, and GET returns the new values.
3. A stale `expectedProfileVersion` → 409 `PROFILE_CONFLICT` with nothing saved. Two parallel saves with the same version → exactly one succeeds.
4. An approved agency can save. A rejected agency → 403 `PROFILE_READ_ONLY`. A deactivated one → 403 `AGENCY_DEACTIVATED`. A blocked one → 401.
5. An injected `agencyId` (body, query, header) → 422. Owner A can never read or change agency B, and no endpoint takes an agency id.
6. Saving never changes `reviewStatus`, `reviewVersion`, `restrictionStatus` or `publicationStatus`.
7. Invalid input → 422 with field details and nothing saved.
8. The Super Admin detail includes the profile; an owner session on that route is rejected.
9. The migration is still idempotent and backfills `profileVersion` and `publicContact`.

**BFF:** `GET` and `PUT /owner/profile` allowed only on the owner portal; `PUT` to any other path → 404; foreign Origin on `PUT` → 403.

**Gates:**
- root typecheck, lint and build, plus `npm test -w backend`;
- migration on Atlas dev;
- an HTTPS end-to-end check through `https://admin.estateos.localhost` with the synthetic test owner, restoring its original values afterwards.

## 8. Owner confirmations (approved 2026-10-21)

The owner confirmed:

- **Phase 2a owner answer 4 is changed:** Approved agencies can edit their profile; Rejected stays view-only.
- Public phone/WhatsApp choices live on the Agency Profile, are off by default, and are not required to save.
- Login email changes and logo upload are not part of 3a.
- Navigation shows only working screens (Overview, Agency Profile) until My Website and Properties are built.
