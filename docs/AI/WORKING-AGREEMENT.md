# EstateOS AI working agreement

Codex, Claude Code and Cursor share one repository, current confirmed planning documents and the two live handover files. AGENTS.md is the common root rule; CLAUDE.md and .cursor/rules/project.mdc point back to it. Canonical decisions live in docs/DECISIONS.md and the CONFIRMED specs indexed by docs/PLANNING-INDEX-LOCKED-v5.8.md. An older CURRENT/ACTIVE banner is historical when the newer confirmed map contradicts it.

One agent edits the shared worktree at a time unless the owner coordinates isolated branches/worktrees. Before work, inspect Git status, latest handover, code and the approved milestone. Distinguish CONFIRMED policy, PROPOSED choices and OPEN implementation details. A confirmed product policy alone is not feature-coding authorization.

During authorized work, keep changes small, maintain tenant boundaries, avoid unrelated packages and preserve accepted UX. Afterward, run relevant checks, review the diff, record actual results and update docs/AI/CURRENT-STATE.md and docs/AI/HANDOVER-LATEST.md. A local commit requires authorization for that work; no push without explicit owner permission. Never claim another agent loaded a skill or ran a test without direct evidence.
