> **v4.2 HISTORICAL/RESOLVED NOTE:** Owner APPROVED D-053 **Option A** on 2026-10-19. Already-Live sites keep saved draft independent from public version until explicit owner `Publish Updates` (post-live only). D-029 initial activation remains automatic with NO owner Publish/Submit step. **Canonical active decision:** `docs/POST-LIVE-UPDATES-D053-CONFIRMED.md`. This A/B/C file is historical reference, not open options.

# D-053 — PROPOSED ONLY: Publishing Saved Changes on an Already-Live Website

**Decision:** D-053 | **Status:** OPEN / NOT APPROVED | **Proposed:** 2026-10-19 | **Bundle:** v4.1 | **Milestone:** M00 / Agency Website UX | **Mode:** PLANNING ONLY — NO APP CODE

## Critical distinction before choosing

**Already confirmed:** D-029 makes the website initially Live **automatically** when Super Admin manually approves the agency AND D-033 minimum website readiness is satisfied. No initial Agency Admin Submit or Publish button should be added. Pending / unready drafts remain private. D-050 saves current section; D-051 guards unsaved navigation; D-052 private Preview shows persisted draft sections + applied theme. **None of these settle what happens to an ALREADY-LIVE public site when the owner saves edits.** D-049 theme Apply also has no approved public-republishing effects. D-053 is only about **subsequent updates to already-Live sites**.

## Option A — Separate draft + explicit Publish Updates (RECOMMENDED)

- Agency can save individual sections using D-050, adjust applied theme through D-049, and privately preview D-052 latest saved draft **without changing the currently Live public site**.
- After checking changes, owner intentionally selects a **Publish Updates**-type action for already-Live sites, updating the public website with the saved draft. The exact readiness/permission/validation checks, release mechanism and failure/rollback messages must be specified separately; do **not** assume immediate success or make a second Super Admin approval mandatory.
- A new **post-live** update action is **not** an initial Publish/Submit gate, and must never appear as a prerequisite for D-029 first activation.
- Strengths: accidental updates less likely; matches explicit Save + private Preview. Cost: one more user action, requires draft/live separation and honest status.

## Option B — Saved edits automatically update the Live site

- Once a section Save succeeds (or a changed theme Apply succeeds), the already-Live website automatically receives the latest saved change after whatever validation/sync flow is approved later. Private Preview still only shows saved content.
- Strengths: least extra owner effort, minimal publish controls. Risk: accidental section saves or theme changes affect a public website without a review/Publish Updates moment. Public sync/failure/caching handling still needs design.

## Option C — Submit subsequent updates for Super Admin review

- Agent saves and previews a draft, then requests approval for post-live changes. Public site stays on last approved version until Admin approves.
- Strengths: maximum centralized editorial control. Costs: heavy queue burden and delay for a 2–3 agency pilot; does **not** imply extra verification documents, and still must be separated from initial D-029 approval. Exact review scope and audit/notification behavior undecided.

## Remain OPEN regardless of chosen option

- Which fields/changes can be published, validation and readiness checks, success/failure/retry and whether updates are atomic/partial.
- Already-Live status and draft/public version indications; rollback, revision history, conflicts, concurrent updates, publication rights and theme update handling.
- Initial approved-but-unready readiness reevaluation, Super Admin Block/Deactivate behavior, exact labels/routes, preview caching/access policies.
- Numerical breakpoints, upload/media UX, accessibility checks and pilot CRM scope.

## Suggested owner reply

`EstateOS D-053 ke liye Option A/B/C approve karta hoon. D-053 CONFIRMED mark karo, planning docs aur Claude/Cursor/Codex handover update karke v4.2 ZIP banao. D-029 first go-live automatic rakho. Detailed publish validation, failure/rollback, preview caching, routes/breakpoints aur CRM scope pending rakho. Phir next Agency Website UX decision discuss karo.`

**Do not implement before owner approval.**
