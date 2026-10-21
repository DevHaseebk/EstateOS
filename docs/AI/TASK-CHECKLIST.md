# EstateOS development task checklist

## Before coding

- Check Git status, branch and recent commits. Read AGENTS.md, docs/AI/CURRENT-STATE.md and docs/AI/HANDOVER-LATEST.md.
- Identify approved milestone, decision IDs, canonical CONFIRMED specs and any OPEN choices. Inspect relevant implementation and tests.
- State the narrow authorized scope and expected checks. Do not convert a proposal into a feature.

## During coding

- Make the smallest maintainable change within scope. Use relevant project skills and treat external design catalog material as advisory.
- Keep authorization and trusted agency scoping on tenant data paths. Protect private drafts, public status and secure media according to confirmed policy.
- Avoid unrelated refactors, dependencies and application restructuring.

## After coding

- Run relevant typecheck, lint, tests, build and endpoint/browser checks. Record exact commands, runtime and pass/fail status; do not infer unrun results.
- Review changed files and staged diff for secrets, scope creep and unintended application changes.
- Update the current state and latest handover using docs/AI/HANDOVER-TEMPLATE.md. State incomplete work and a concrete next task.
- Commit locally only when authorized for the task. Never push without explicit owner permission.
