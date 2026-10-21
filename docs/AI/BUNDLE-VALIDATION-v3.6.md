# v3.6 Planning Bundle Validation

**Date:** 2026-10-19 | **Scope:** Markdown artifacts, not runnable application.

## Checks

- Full source of truth: `/mnt/data/EstateOS_Planning_v3.5.zip`, **74 original files**, validated with Python `ZipFile.testzip()`.
- v3.6 unpacked all source files; no original source entry intentionally dropped.
- Added **4** new Markdown files: D-047 confirmed, D-048 proposal, v3.6 individual website UX flow proposal, this validation record.
- New count expected: **78** files. ZIP includes root folder `EstateOS_Planning_v3.6/` and all content.
- Post-build ZIP validation: archive CRC (`testzip()`), expected member count, preserved original relative paths/bytes where unchanged, presence of canonical decision/handover, D-047 consistency and D-048 unapproved state.
- All output is planning text: no source files or application code, no installation/build/runtime tests or deployment.
