# EstateOS — Phase 3e About and Team Photos Contract (APPROVED)

**Status:** APPROVED by the owner in chat on 2026-10-22, as written, including the confirmations in section 5 (D-115). Drafted by Claude Code the same day.
**Builds on:** Phase 3c (About and Team sections) and Phase 3d (upload pipeline, staging/attach, public images only from the Live revision).
**Decisions implemented:** D-032 (About supporting photo, Team agent photo), D-086, D-089, D-090, D-099/D-117 (consent spirit), D-106, D-110, D-115.

## 0. Scope in one line

The two remaining optional photo slots from D-032 — an **About** photo and a photo per **Team** member — use the existing 3d pipeline unchanged: content check, 5 MB, metadata stripped, WebP variants, private originals, staged until a save, public only through the Live revision.

## 1. Owner answers this contract is based on (approved 2026-10-22)

| # | Question | Recommended answer |
|---|---|---|
| 1 | Minimum sizes? | About photo: at least **800 × 500 px**. Team photo: at least **300 × 300 px**. Shown as a square crop. |
| 2 | Does a team photo need consent? | **Yes, like team numbers (3c).** Adding a member photo requires ticking "This person agreed to show their photo on the website". Without the tick the save is refused (422). This is a real person's image (D-117 spirit). |
| 3 | Are the photos required? | **No.** Both stay optional. Without a photo, About shows text only and Team keeps the initials (3c). Readiness is unchanged (D-033). |
| 4 | How many? | About: one photo. Team: one photo per member (max 12 members, as in 3c). |
| 5 | Upload limits? | The same as 3d: 60 uploads per agency per hour, purposes `ABOUT` and `TEAM` added. |

## 2. Data and API changes

- `Media.purpose` adds `ABOUT` and `TEAM`. The minimum sizes are from section 1 Q1.
- **About section:** body adds `photoMediaId` (nullable). The id must be this agency's `ABOUT` media; it is attached on save.
- **Team section:** each member adds `photoMediaId` (nullable) and `photoConsent`. If `photoMediaId` is set, `photoConsent` must be `true` (422 otherwise). The id must be this agency's `TEAM` media; it is attached on save.
- **Revisions:** `snapshotMediaIds` also collects the About and Team photos, so the public route can serve them once published.
- **BFF:** no new routes (the 3d upload and image routes already cover them).

## 3. Screens

- **Editor → About:** "Upload a photo" (with the size rule), preview, **Remove photo**.
- **Editor → Team:** per member, "Upload photo" with preview and **Remove**. The consent checkbox appears once a photo is chosen.
- **Template:**
  - About shows the photo next to the story on wide screens and above it on phones (`srcset` 480/960, `alt` = "Photo of <agency name>");
  - Team cards show a round photo instead of the initials when one exists (`alt` = member name).

## 4. Acceptance tests (D-093)

**Unit:** minimum sizes for `ABOUT` and `TEAM`; the team photo consent rule.

**API integration:**
1. About photo: upload → save → attached; removing it unlinks and keeps the media.
2. Team photo without consent → 422; with consent → saved and attached; a `PROPERTY` or another agency's media → 422.
3. On a Live site: About and Team photos are not public until **Publish updates**; then they are (public route 200), and they go back to 404 if the agency is blocked.
4. Readiness unchanged; sections without photos render exactly as in 3c.

**Template:** server-render with and without photos in the 3 themes (initials fallback kept).

**Gates:**
- typecheck, lint and build, plus `npm test -w backend`;
- an HTTPS end-to-end check on the 3d synthetic agency: add an About photo and one team photo with consent → publish → both visible publicly.

## 5. Owner confirmations (approved 2026-10-22)

The owner confirmed:

- The minimum sizes (About 800 × 500, Team 300 × 300).
- A team member photo requires the "agreed to show their photo" tick.
- Both photos stay optional; no readiness change.
