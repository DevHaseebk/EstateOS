# Three-AI workflow: Claude Code ↔ Cursor ↔ Codex

> **MVP SCOPE UPDATE (D-028):** Any historical requirement in this document to verify email/proofs/map as an approval prerequisite is **deferred for the 2–3 agency pilot**. Current active product scope: `docs/MVP-RESET-v1.7.md`.


## Source of truth
Git + Markdown files + actual repository state. Chat context is advisory, not authoritative.

## Session start protocol
1. Check Git status and current branch; identify any uncommitted changes.
2. Read `AGENTS.md`, `docs/AI/CURRENT-STATE.md`, `docs/DECISIONS.md`, `docs/AI/HANDOVER-LATEST.md` and relevant milestone spec.
3. Restate **confirmed** scope, active milestone, precise task, affected paths and acceptance checks.
4. Work only within the current owner-approved scope. Phase 0.5 verification, minor foundation fixes, documentation reconciliation and a local commit are authorized; business features are not.

## Execution protocol (when approved later)
1. Plan before changes, one small task at a time.
2. Make smallest safe change; avoid creating extra systems or dependencies without consent.
3. Reuse shared components; keep business logic out of UI when appropriate.
4. Verify actual relevant checks: typecheck, lint, tests, build; report failures honestly.
5. Report files touched and any changes to assumptions.
6. Make reviewable local commits when the owner has authorized them. Never push without explicit owner permission or overwrite another agent's uncommitted edits.

## Handover protocol — required after each unit, and before planned assistant switch
Update `docs/AI/CURRENT-STATE.md` and `docs/AI/HANDOVER-LATEST.md`:
- date/time, assistant name, branch and commit hash if available;
- approved task, status: completed / partial / blocked;
- exact files changed and why;
- testing commands and verified results (or 'NOT RUN');
- assumptions, defects, dependencies, open decisions;
- next steps, precise first action for incoming assistant.
If an assistant stops unexpectedly or hits a limit before handover, next assistant must reconstruct facts from Git status, diffs and docs; **never assume handover was written**.

## Parallel work
Default: only one coding AI edits the shared worktree at once. If genuinely parallel: isolated worktrees/branches, unambiguous file ownership, integration review. Do not let agents blindly overwrite each other.

## Decision control
An AI recommendation is not an approval. Log owner approvals as CONFIRMED; log alternative proposals as PROPOSED, noting tradeoffs. Scope changes need explicit owner confirmation.
