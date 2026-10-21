# EstateOS v5.9 — Safe Root-Ready Merge Guide

**DO NOT blindly overwrite active Codex/Claude project files or run destructive Git operations.** User reports existing root Git and remote already pushed.

1. Make a fresh commit or backup of current local working tree; inspect `git status` first. Do not commit secrets.
2. Extract `EstateOS_v5.9_ROOT_READY.zip` to a separate TEMP directory (not directly into the source repo). It contains planning docs only; no application code, `package.json`, `node_modules`, `.git` or `.env`.
3. Compare current root `AGENTS.md`, `CLAUDE.md`, `README.md`, `.cursor/rules/project.mdc` and especially `docs/AI/CURRENT-STATE.md` and `docs/AI/HANDOVER-LATEST.md` against incoming versions. The incoming handover describes planning artifacts and does NOT contain the actual results of Codex/Claude current working sessions. MERGE the new policy header while retaining implementation progress, actual test status and blockers.
4. Copy new canonical `docs/MVP-D088-CONFIRMED.md` … `docs/MVP-D119-CONFIRMED.md`, v5.9 map/index and historical backups; do not delete old documents or active code.
5. Update project AI instructions to point at v5.9, preserving actual skill paths and active project rules. The original v5.8 root rules are retained under `docs/AI/HISTORY-v5.8-*` for provenance.
6. Inspect `git diff` for code/manifest/secret changes and verify local markdown links. Run application checks only using your existing development environment. Then commit documented planning merge locally; push only when explicitly requested.
7. Do not create `apps/` or `packages/` based on two historical `.gitkeep` placeholders from full archive; they are excluded from Root-Ready.

**Source-of-truth:** owner-confirmed v5.9 spec files and latest code handover; Phase 1 feature code remains subject to explicit milestone authorization and D-115 feature contract approval.
