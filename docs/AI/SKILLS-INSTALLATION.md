# Project-local skills installation and verification

## UI/UX Pro Max provenance

- Upstream: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Reviewed npm package: ui-ux-pro-max-cli 2.15.0 from npm registry. Tarball SHA-256: 50966C6C1CF99DB6C9706222DF6A3094E8043413E8B94A477FF8339EBC3FEF52.
- The published package's codex.json targets .agents/skills/ui-ux-pro-max. Its source assets contain the generated SKILL.md, local CSV/JSON catalog and Python scripts. The package has no install lifecycle script; npm was run with --ignore-scripts in a temporary directory.
- The published 2.15.0 CLI does **not** expose --dry-run even though current upstream source documents it. We did not run the proposed npx dry-run against this repository. We inspected the package and ran its init command only in a temporary directory to preview output.
- A normal init would create six unrelated bundled skills alongside ui-ux-pro-max. Those were not copied into EstateOS. Only the generated UI/UX Pro Max SKILL.md, its data and the four Python modules needed by search.py were copied to .agents/skills/ui-ux-pro-max. The EstateOS boundary at the top of its SKILL.md is a local addition.
- No global installation, MCP registration, shell/network permission grant, root package change or EstateOS app code change was made. No CLI installer was executed in the repository.

## Discovery and sharing

Codex project skills live in .agents/skills/<name>/SKILL.md. Claude Code project skills live in .claude/skills/<name>/SKILL.md. The Claude wrappers point to the canonical Codex skill bodies; UI/UX Pro Max data and scripts have one shared project copy. Cursor reads .cursor/rules/project.mdc, which points to the same planning and working documents. Future assistant sessions should discover the files, but loading by another agent has not been observed here.

All ten project manifests passed the skill-creator quick validator with UTF-8 Python and PyYAML 6.0.3 installed **only in a temporary validator directory**. UI/UX Pro Max search.py returned local results for an accessibility/responsive-form query. Its Python scripts use the standard library for searches and do not install packages or make network requests. Python 3 is required for catalog search; the available bundled runtime was Python 3.12.14. If another machine lacks Python, use the skill's static guidance or arrange Python separately.

Do not run search.py with --persist during ordinary review: that writes a design-system directory. All catalog output is advisory. EstateOS confirmed UI decisions in docs/PLANNING-INDEX-LOCKED-v5.8.md and the individual CONFIRMED specs take precedence. Reinspect any new upstream CLI version before updating; do not run --force blindly.
