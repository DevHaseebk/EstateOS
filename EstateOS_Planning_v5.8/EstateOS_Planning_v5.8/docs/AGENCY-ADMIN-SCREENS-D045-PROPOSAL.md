> **v3.5 ACTIVE D-046 OVERRIDE:** Grouped Agency Admin navigation (Option A) CONFIRMED; Theme/Editor/Preview are **My Website** subordinate actions, not top-level links. See `docs/AGENCY-ADMIN-NAVIGATION-D046-CONFIRMED.md`. Detailed proposed screen inventory: `docs/AGENCY-ADMIN-SCREEN-MAP-v3.5-PROPOSAL.md`. D-047 Overview screen hierarchy is unapproved. Historical menu/UX descriptions below remain proposals where not explicitly confirmed; routes, labels, breakpoints, CRM scope open. Planning only.

> **RESOLVED / HISTORICAL as of v3.4:** D-045 Option A (nonblocking four-step checklist) is now CONFIRMED. This older A/B/C proposal is preserved for decision history only. Canonical: `docs/AGENCY-ONBOARDING-D045-CONFIRMED.md`. Exact navigation and screen structure remain PROPOSED in `docs/AGENCY-ADMIN-NAVIGATION-D046-PROPOSAL.md`.

# D-045 — PROPOSAL: Agency Admin screen map, onboarding checklist and responsive workflows

**Status:** PROPOSED / NOT APPROVED | **Prepared:** 2026-10-18 | **Planning:** M00, v3.3 | **No coding**

## Why now

D-044 CONFIRMED a task-first dashboard. Here we propose **which screens exist and how owners progress through them**, then ask the owner to approve the onboarding checklist approach. Do not infer that a proposed field/route/CTA is an approved requirement.

## Proposed screen map (all names/routes provisional)

| # | Screen | Main job | Proposed primary actions | Mobile adaptation | Scope check |
|---|---|---|---|---|---|
| 01 | Register / Sign in | Agency owner enters basic info and accesses dashboard | Create Account / Sign In | One-column form, number-friendly input | Six initial fields previously recorded; heavy email KYC NOT pilot approval gate under D-028 |
| 02 | Overview | Immediately understand agency/site state and next task | Customize Website / Preview; Visit Site only after live | Status + one main CTA above the fold | Confirmed task-first orientation D-044; copy/checklist details pending |
| 03 | Agency Profile | Update contact, company identity and branding | Save Changes | One-column grouped fields | Minimal pilot profile, NOT old mandatory document/map checks |
| 04 | Theme Selection | Choose ONE shared premium template and 3 fixed curated styles | Select Theme / Preview | Vertical theme cards | D-030, D-034, D-037 and D-042 approved; final selection UI pending |
| 05 | Website Editor | Edit nine Core section types without coding | Edit Section / Move Up / Move Down / Save Draft | Section list → individual form → Preview as distinct steps | D-031/D-032 approved; save/publish after activation is OPEN |
| 06 | Website Preview & Status | Compare current draft against published/live state | Preview / Return to Editor; Copy Link ONLY when live | Full-screen preview with Back/Edit | Private on Pending. Approved+ready auto-live D-029/D-033 |
| 07 | Properties List | See optional listings; useful when none exist | Add Property / Edit Property | Stacked cards rather than dense table | Property fields, limits and public visibility OPEN |
| 08 | Add/Edit Property | Simple entry, media and visibility | Save Draft / Save | Progressive grouped form; large image uploader | No mandatory property prerequisite; exact fields OPEN |
| 09 | Inquiries (conditional) | View basic contact requests if pilot CRM is approved | View Inquiry / Contact customer | Simple cards and one-touch contact | **Not committed to MVP**; CRM inclusion remains OPEN |
| 10 | Account / Settings | Owner credentials, agency contact and preferences | Save Settings | Clear short groups | Exact settings/actions pending |

The **Super Admin** is a different product area: agency list/review and Approve/Block/Deactivate must be specified separately. Do not count it as an Agency Admin screen.

## Example overview content (PROPOSED)

**Pending:** top status 'Pending Approval'; next action 'Finish Website Setup'; allow private Preview; NO public live link. Properties stay optional.

**Approved but not ready:** top message 'Complete Website Setup to Go Live'; show unmet D-033 essentials only; no fake URL. Precise automatic recheck timing remains OPEN.

**Live:** top status 'Website Live'; open/copy the actual live URL; offer website editing and optional property list. Post-live edits require an approved publishing policy before implementation.

**Blocked/Deactivated:** no live link shown as working; exact owner permissions, messaging and reactivation policy are OPEN.

## Candidate 4-item onboarding checklist (NOT CONFIRMED)

1. **Agency Details:** name, usable contact details (D-033).
2. **Choose a Style:** one shared template with one of three theme presets.
3. **Customize Website:** meaningful Hero heading and uploaded/legitimate default photo; About/services optional.
4. **Preview Website:** view privately; Super Admin approval + essential readiness controls go-live automatically.

`Add your first property` is always a separate **optional suggestion**, never a requirement or readiness checkbox. No additional manual initial 'Submit for Approval' step (D-019 superseded by D-020). No heavy document/email verification step in the lean pilot (D-028).

## Candidate navigation, details still OPEN

- Desktop: compact sidebar with clear icon+label; no icon-only core navigation; sticky top status/header optional.
- Mobile: top bar with **Menu**, full-height drawer or dedicated navigation sheet; most useful action visible on Overview; avoid nested menus.
- Site editor on mobile: one editing panel at a time, no drag-only ordering; separate preview.
- Lists: property cards and status chips instead of wide table; confirmation before destructive actions.
- General: loading/error/empty/success states, simple English, clear focus indicators and form error messages.

## D-045 decision alternatives — choose checklist guidance

**A — Compact nonblocking checklist (RECOMMENDED):** Overview shows 4 basic website setup tasks, each takes owner directly to corresponding screen. Owners may skip any optional content; checklist is not an extra formal approval submission. Hide/reduce once live.

**B — Step-by-step setup wizard:** On first login owners see a linear multi-step flow, with Back/Skip where appropriate. Later dashboard available; risk of more friction and state handling.

**C — No explicit checklist:** Dashboard only shows status plus large `Customize Website`/`Preview` actions; fewer components but less guidance for new users.

### Still OPEN after D-045

Exact menu labels, route names, onboarding step copy/required fields beyond D-033, UI wireframes, spacing/breakpoints, company-admin color system, editor mobile patterns, save/publish-after-live, role/team, inquiry/CRM scope, property fields, Super Admin state transitions and details.
