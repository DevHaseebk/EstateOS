> **v4.2 D-053 later decision (canonical override):** Changes to an **already-Live** website persist privately after section Save/theme Apply; owner must explicitly `Publish Updates` to change the public version. Exact publication validations/failure/sync remain OPEN. First D-029 go-live is still automatic after Super Admin approval and D-033 readiness with NO initial owner publish/submit. Canonical `docs/POST-LIVE-UPDATES-D053-CONFIRMED.md`. This file describes an earlier decision and does not override D-053.

# D-052 — CONFIRMED: Preview Successfully Saved Website Draft & Applied Theme (Option A)

**Decision:** D-052 | **Owner-approved:** Option A | **Status:** CONFIRMED | **Date:** 2026-10-19 | **Bundle:** v4.1 | **Milestone:** M00 / Agency Website UX | **Mode:** PLANNING ONLY — NO APP CODE

## Scope and approved behavior

1. **Saved content only.** The Agency Admin's `My Website → Preview Website` renders the agency's **latest successfully saved/persisted draft** for each website section, not temporarily typed or otherwise dirty editor form inputs. A section edited without a successful D-050 `Save Changes` retains its **previously saved content** in Preview. No Preview-triggered autosave, Global Save All or automatic flush of form fields is approved.
2. **Applied theme only.** Show the **currently committed theme preset** selected through D-049's explicit Apply/Save interaction. Previewing an un-applied theme candidate inside Theme Selection is a **different, noncommitting comparison**; do not change the saved draft Preview theme until the user intentionally applies the selection.
3. **Dirty-section guard applies before entry.** A user attempting to enter Preview while the current editor section has unsaved edits is governed by D-051 Save / Discard / Stay. **Save** persists the current section first and enters Preview **only after actual success**; **Discard** drops only that section's unsaved inputs, then Preview shows its already-saved version; **Stay** remains in the editor without dropping edits. Do not bypass the guard or pretend a failed Save succeeded.
4. **Private preview is distinct from the public site.** This is an authenticated/authorized draft-viewing experience, including for Pending agencies. Never imply that viewing the draft means the website is live, never leak tenant draft data, and never display an invented or unready public link. Real public link only after actual initial Live state produced by **Super Admin manual approval AND D-033 readiness** (D-029). No additional initial owner Submit/Publish gate.
5. **Same website system.** One D-030 premium shared template; D-031/D-032 nine Core section/visibility/reorder constraints, D-034–D-043 styling and D-048 Guided My Website hub remain intact. Properties remain optional; zero-property sites are valid. Desktop/mobile draft Preview follows the same content and applied theme rules.
6. **Not a post-live publication decision.** Even for an agency with an already-Live website, seeing a recently saved draft in private Preview does **not** itself mean those edits are public. D-053 must decide how a live site's saved updates become public. Theme Apply is likewise not permission to republish a live site. Initial D-029 auto-go-live is independent of this next decision.

## Example decision table (behavior-level, NOT a final UI implementation)

| Scenario | Private Preview source | Notes |
|---|---|---|
| Saved new Hero heading successfully | New persisted Hero heading | Only after successful D-050 Save |
| Edited Hero heading but has not saved | Old persisted Hero heading | D-051 guard before Preview entry |
| Discarded unsaved Hero text | Previously persisted Hero heading | Doesn't affect other saved sections |
| Selected candidate Warm Editorial, not applied | Currently applied theme | D-049 candidate comparison remains separate |
| Applied Warm Editorial explicitly | Persisted Warm Editorial theme | Other agency content unchanged |
| Pending agency with saved draft | Tenant-private saved draft | No publicly accessible/live website claim |
| Already-Live agency with saved edits | Saved draft in private Preview | Public update rules still pending D-053 |

## Open specifics (not approved by D-052)

- Preview route/link architecture and tenant authorization mechanism, security/expiry, exact Preview copy/status badges, opening and returning behavior.
- Cache invalidation/latency, sync/refresh details, concurrent edits, multi-tab conflict/ordering, error and retry experiences; no guarantees on propagation time or technology made by this vote.
- D-051 modal copy/layout, browser Back/reload/tab-close guards, dirty-check implementation, failed Save behavior, upload atomicity, image crop behavior.
- Already-live draft-to-public publication policy, theme changes and rollback/review permissions (next D-053); approved-but-unready later readiness reevaluation.
- Exact responsive breakpoints, semantic color/contrast, animation/media tokens, final navigation text/paths and CRM pilot inclusion.

## Precedence / implementation safety

- **Canonical for D-052:** this file, plus `docs/DECISIONS.md`.
- `docs/WEBSITE-EDITOR-PREVIEW-D052-PROPOSAL.md` is **historical/resolved**; Options B/C were discussed but NOT approved.
- D-050 and D-051 remain authoritative for section Save and unsaved navigation; D-049 for theme Apply; D-029/D-033 for *initial* activation.
- **No application code or production deployment authorized.**
