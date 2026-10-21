# EstateOS — Phase 4b Publish Updates Contract (APPROVED)

**Status:** APPROVED by the owner in chat on 2026-10-22, as written, including the confirmations in section 7 (D-115). Drafted by Claude Code the same day.
**Builds on:** Phase 4a (`docs/PHASE-4A-FIRST-LIVE-CONTRACT-APPROVED.md`): revisions, the Live pointer, the public read.
**Decisions implemented:** D-053, D-054, D-063 (website part; properties come in Phase 5), D-079, D-087, D-089, D-090, D-092, D-102, D-107, D-110, D-115.

## 0. Scope in one line

For an **already-Live** website only: a deliberate owner **Publish updates** action turns the saved private draft into the next public revision, all-or-nothing. An **Unpublished changes** indicator appears only when the saved draft really differs from what is Live. The first Live stays automatic (D-029); 4b adds **no** button before first Live.

## 1. Owner answers this contract is based on (approved 2026-10-22)

| # | Question | Recommended answer |
|---|---|---|
| 1 | What does Publish updates publish? | **The whole saved draft**: theme, all sections, layout and the Profile values mapped into it, as one new revision. No picking of single sections (simpler and always consistent, D-079). |
| 2 | Must the draft still be "ready" to publish? | **Yes.** If a D-033 essential is now missing (for example the owner unticked every public number), publishing is refused with the same missing-items list. The Live site stays as it is. |
| 3 | How is "Unpublished changes" decided? | By comparing the **content** of the saved draft with the Live revision: a fingerprint that ignores internal version counters. Saving the same text again does not create a false "unpublished changes". Unsaved form input and un-applied theme candidates never count (D-054). |
| 4 | What happens on a double click, two tabs, or a network retry? | Every publish carries the Live revision it expects **and** a request id. The same request id returns the same result and never makes a second revision. A different expected revision → **409** "Your website was updated in another window" (D-087, D-107). |
| 5 | What happens on failure? | Nothing public changes, and the saved draft is kept. The owner sees "Publishing failed. Your live website and saved changes are unchanged." and a **Try again** button that reuses the same request id (D-087). |
| 6 | Can the owner undo or roll back to an older revision? | **Not in 4b.** All revisions are kept (append-only), so rollback can be added later without data loss. |
| 7 | Who can publish? | The agency owner while unrestricted (Approved and Live). Deactivated → 403; Blocked → no session. No Super Admin re-review of each update (D-053). |

## 2. Data model

**`PublishedRevision` (append-only, as in 4a):**
- `reason` adds `PUBLISH_UPDATES`;
- new optional `requestId`, with a unique partial index on `(agencyId, requestId)`;
- new `contentHash`: sha256 of the canonical site content without version counters, also computed for revision 1 when it is read.

**`AgencyAudit`:** new action `WEBSITE_PUBLISH_UPDATES` (`axis: PUBLICATION`, actor: the owner, `fromStatus`/`toStatus` both `LIVE`, reason empty). It is written in the same transaction as the pointer switch.

No change to the draft: it stays the single source for publishing (D-085).

## 3. Publish — one function, atomic and idempotent

`publishUpdates(agency, { expectedLiveRevision, requestId })`:
1. If a revision with this `requestId` already exists for the agency → return it as the result (safe retry).
2. Check, in this order:
   - the agency is `LIVE`, otherwise **409 `NOT_LIVE`**;
   - the owner can edit, otherwise **403**;
   - the current Live revision number equals `expectedLiveRevision`, otherwise **409 `PUBLISH_CONFLICT`**;
   - the draft is ready, otherwise **422 `NOT_READY`** with the issues;
   - the draft fingerprint differs from the Live one, otherwise **409 `NOTHING_TO_PUBLISH`**.
3. In **one transaction**:
   - insert revision n+1 (`reason PUBLISH_UPDATES`, `requestId`, `contentHash`, site snapshot, `properties: []` until Phase 5);
   - **compare-and-swap** the pointer (`publication.liveRevisionId` must still be the old id);
   - write the audit entry.
   If the swap matches nothing, the transaction aborts → 409 `PUBLISH_CONFLICT`.
4. Any other error → nothing is changed; **503 `PUBLISH_FAILED`** with the truthful message. It is logged without private data.

## 4. Versioned REST API — additions

| Method & path | Portal | Request | Success |
|---|---|---|---|
| `POST /owner/website/publish` | OWNER | `{ expectedLiveRevision: number, requestId: uuid }` | `200 { publication }` |
| `GET /owner/website` *(extended)* | OWNER | — | `publication` adds `liveRevision`, `publishedAt`, `unpublishedChanges: boolean` (only when Live) |
| `GET /super-admin/agencies/:id` *(extended)* | SUPER_ADMIN | — | `publication` adds `liveRevision`, `publishedAt`, `unpublishedChanges` |

The usual rules apply: CSRF and Origin; any `agencyId` → 422; the agency comes only from the session. **BFF:** the owner facade allows `POST /owner/website/publish`.

## 5. Screens

**My Website hub (already Live), D-054:**
- **Website: Live**, with the link.
- When `unpublishedChanges`:
  - an **"Unpublished changes"** badge with one line: "You saved changes that are not on your live website yet.";
  - the **one main action** is **Publish updates**, with the secondary link "Preview your changes".
- When there are no changes: no badge; the main action is "Open your website".
- **Publish updates** opens a confirmation dialog ("Publish your saved changes to your live website? Visitors will see them right away.") with **Publish** and **Cancel**.
  - On success: "Your website is updated."
  - On failure: the truthful message plus **Try again** (same request id).
  - On 409 or 422: the matching message, and the hub reloads.

**Overview:** the website status line also shows "Unpublished changes" when true.

**Editor and theme pages, after Live:** a short note — "Saved changes stay private until you publish them from My Website."

**Super Admin agency page:** "Live revision N, published <date>", plus "Unpublished changes: yes/no" (read-only).

## 6. Acceptance tests (D-093)

**Unit:** the fingerprint ignores version counters and key order, and changes when any visible content, theme, layout or mapped contact changes.

**API integration:**
1. Not Live → 409 `NOT_LIVE`. A Pending agency, or one approved but not ready, can never use publish to go Live (D-029).
2. Live with no changes → `unpublishedChanges: false`, and publish → 409 `NOTHING_TO_PUBLISH`. Re-saving identical text keeps it false.
3. Saving a section, applying a theme, saving the layout or a Profile save → `unpublishedChanges: true`. Publish → revision 2, and the public read now shows the new content. An audit entry is written; the flag becomes false.
4. The same `requestId` sent twice (and in parallel) → one revision, both 200. A different request with a stale `expectedLiveRevision` → 409 `PUBLISH_CONFLICT`.
5. Forced failure inside the transaction → 503 `PUBLISH_FAILED`; the public read still shows the old revision; the draft is unchanged; a retry with the same `requestId` then succeeds once.
6. Draft no longer ready (public number unticked) → 422 `NOT_READY` with issues; the public site is unchanged.
7. Deactivated → 403; Blocked → 401; an injected `agencyId` → 422; owner A can never publish B.
8. The Super Admin detail shows the revision number, the date and the unpublished flag.

**BFF:** `POST /owner/website/publish` only on the owner portal.

**Gates:**
- typecheck, lint and build, plus `npm test -w backend`;
- an HTTPS end-to-end check on the existing synthetic Live agency from 4a: edit → badge → publish → the public page changes → re-publish → `NOTHING_TO_PUBLISH`.

## 7. Owner confirmations (approved 2026-10-22)

The owner confirmed:

- Publish updates publishes the **whole saved draft** at once; there is no section picking.
- Publishing requires the draft to still be ready (D-033).
- "Unpublished changes" is based on content, not save counters.
- No rollback to older revisions in 4b (they are kept for later).
- The 4a synthetic agency is used for the end-to-end check; it gets revision 2 (append-only, stays in the dev DB).
