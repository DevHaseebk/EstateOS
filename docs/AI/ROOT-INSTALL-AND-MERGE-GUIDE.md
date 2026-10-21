# Putting EstateOS v5.8 planning into an existing Codex-built project root

**Important:** Two ZIP flavors are provided:

1. `EstateOS_Planning_v5.8.zip`: **full versioned historical archive** under a containing `EstateOS_Planning_v5.8/` folder, including legacy archival empty-folder `.gitkeep` markers for exact prior file coverage. Preserve a copy separately as the planning snapshot.
2. `EstateOS_v5.8_ROOT_READY.zip`: unzip content begins immediately with `docs/`, `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/project.mdc`, `README.md`, etc. Contains **all planning Markdown** but excludes ONLY old `apps/.gitkeep` and `packages/.gitkeep` to avoid creating unrelated application folders.

## Safe root installation

1. Check the Codex project state: **make a git commit or backup your working directory** first if any scaffold code exists. Never overwrite uncommitted code.
2. Extract the ROOT_READY ZIP to a **temporary empty folder** outside your project. Verify it contains `docs/` and the AI rules, not an extra `EstateOS_Planning_v5.8/` nesting folder.
3. Copy/merge `docs/` into your real EstateOS root. Review any changes to `docs/AI/CURRENT-STATE.md` and `docs/AI/HANDOVER-LATEST.md`: Phase 0's actual progress from Codex may be newer than this planning snapshot and must be retained.
4. Diff and reconcile `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/project.mdc` and `README.md` before replacement. Keep real operational scripts/status recorded by Codex, and merge current D-081…D-087 confirmed policy and read-only review rules. **Do not blindly overwrite** existing AI instructions or source code.
5. Do **not** move/replace/delete `frontend/`, `admin/`, `super-admin/`, `backend/`, `package.json`, `package-lock.json`, `.env`, source directories or migrations. These are not supplied by this planning ZIP.
6. Open Claude Code at EstateOS repo root and paste/read `docs/AI/CLAUDE-COMPREHENSIVE-REVIEW-PROMPT.md`. Request a read-only audit first; do NOT allow coding automatically.
7. Confirm next explicit feature milestone scope only after review. Existing Phase 0 skeleton authorization remains the sole previous code authorization.

## Historical confusion prevention

- Older specs contain literal outdated words `CURRENT` from their original version. **Current top-level authority** is v5.8 map, active decision log, current state and recent `*-CONFIRMED` specs.
- Old KYC/verified-email/map proof gates are not pilot requirements. Old pnpm + `apps/*` architecture is a historical proposal, not current workspace layout.
- Never copy historical archived `.gitkeep` placeholders into an active four-workspace repo merely for completeness. They remain in the full archive.

## How to check it was installed

At project root you should see `docs/IMPLEMENTATION-READINESS-v5.8-CONFIRMED-MAP.md`, `docs/IMPLEMENTATION-READINESS-D087-CONFIRMED.md`, `docs/AI/CLAUDE-COMPREHENSIVE-REVIEW-PROMPT.md` and all your existing app folders still intact. Exact app build success remains unknown unless separately verified.
