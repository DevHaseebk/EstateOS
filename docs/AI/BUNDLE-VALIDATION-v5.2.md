# EstateOS v5.2 — Planning Bundle Validation

**Status:** Planning-only. **No application code is created.** Date 2026-10-21.

## Changes introduced

- D-063 Option A CONFIRMED; canonical `docs/PROPERTY-PUBLIC-PUBLISHING-D063-CONFIRMED.md`: Save Property remains private; on already-Live sites, eligible saved property changes share the *existing* owner Publish Updates alongside theme/content updates.
- Original D-063 proposal marked historical. **NEXT D-064 PROPOSED ONLY** Super Admin dashboard layout; discussion screens are unapproved. No alteration to review/eligibility rules.
- D-029 initial automatic Live after manual Super Admin agency approval + D-033 readiness (no initial owner Submit/Publish; no property mandate) unchanged. D-053 explicit post-live action and D-062 internal statuses/Archive unchanged.

## Expected integrity checks

- Source: verified v5.1 ZIP **127 files**. New v5.2 bundle should contain **131 files**, with ALL 127 source relative paths preserved.
- ZIP central directory root prefix `EstateOS_Planning_v5.2/`; `ZipFile.testzip()` must return `None` and no duplicate names.
- Cursor `.cursor/rules/project.mdc` frontmatter must be the FIRST bytes and have `alwaysApply: true`.
- Decision log + current state + handover + root AI instructions reflect D-063 CONFIRMED/D-064 PROPOSED, never the reverse.
- Historical A/B/C alternatives remain as reference only; unknown property eligibility and public Sold/Rented/Archived behavior remain OPEN.
- No app-specific code or implementation milestones have been authorized.
