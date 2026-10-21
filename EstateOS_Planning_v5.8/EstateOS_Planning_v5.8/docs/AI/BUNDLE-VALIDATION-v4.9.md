# EstateOS Planning v4.9 — Bundle Integrity & AI Handover Verification

**2026-10-20 | D-060 CONFIRMED | M00 PLANNING ONLY**

## Continuity

- Source of truth: **complete** `EstateOS_Planning_v4.8.zip`, exactly **118 distinct relative file paths**, ZIP integrity clean. Never rely on a partially mounted extracted folder as proof of the complete package.
- Preserve all 118 existing relative file paths in v4.9, editing only relevant Markdown references. Add 3 paths: `docs/PROPERTY-PHOTO-LIMITS-D060-CONFIRMED.md`, `docs/PROPERTY-SAVE-UNSAVED-D061-PROPOSAL.md`, `docs/AI/BUNDLE-VALIDATION-v4.9.md`. Expected **121 files** in completed ZIP, with `EstateOS_Planning_v4.9/` prefix.
- `.cursor/rules/project.mdc` keeps its initial YAML frontmatter (`---`, `description`, `alwaysApply`, `---`) before all injected notes.

## Decision assertions

- Canonical D-060 contains: **max 10** photos, **max 5 MB each**, **JPEG/PNG/WebP**, visible rules and **clear per-file validation**. **Zero images/cover mandatory.** D-059 cover/reorder retained. D-060 original alternatives marked historical.
- D-061 is a new **UNAPPROVED** Save/unsaved UX choice and no option is implicitly selected.
- All prior D-029 + D-033 agency activation prerequisites, D-053 live website content/theme publication distinction, D-058 six Basics, D-056 cards and D-057 one-page editor preserved. **Individual property public publishing remains open.**
- Processing/compression/security/privacy EXIF, upload progress/retries, record Save/unsaved, statuses/delete and CRM remain pending.

## Handover

- Root README/AGENTS/CLAUDE and Cursor instructions, `docs/DECISIONS.md`, `docs/AI/CURRENT-STATE.md`, `docs/AI/HANDOVER-LATEST.md`, `docs/OPEN-QUESTIONS.md`, `docs/CHANGELOG.md`, `docs/ROADMAP.md` reference **D-060 confirmed / D-061 proposed** at the top. Historical old text may retain previous wording explicitly labeled historical.
- Source and final ZIP integrity, root prefix consistency, file counts and no application code changes checked by packaging script.
