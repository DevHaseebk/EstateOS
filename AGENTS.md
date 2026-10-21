# EstateOS — shared AI instructions (current: v5.8, Phase 0.5)

Read docs/AI/CURRENT-STATE.md, docs/DECISIONS.md (especially D-028), docs/MVP-RESET-v1.7.md, docs/AI/HANDOVER-LATEST.md, docs/OPEN-QUESTIONS.md, and the active milestone before work. For the approved policy and exact sources, use docs/PLANNING-INDEX-LOCKED-v5.8.md and docs/IMPLEMENTATION-READINESS-v5.8-CONFIRMED-MAP.md. Earlier version snapshots and proposals are historical when they conflict with v5.8.

## Current work boundary

The owner authorized Phase 0.5 verification, minor foundation fixes, instruction and handover reconciliation, and a local commit. The root Git repository already exists and has a remote. Inspect status, branch and recent commits first. Do not initialize Git, create nested repositories, alter remotes, or push without explicit owner permission.

The four root npm workspaces are frontend (4000), admin (4001), super-admin (4002), and backend (4003, /api/health). Phase 0.5 permits typecheck, lint, build, health verification and minor scaffold fixes. Authentication, database business models, agency APIs, property CRUD, publishing and other business features remain unauthorized. Do not interpret a confirmed policy decision as feature-coding permission.

## Confirmed policy to preserve

- D-022/D-028: lean signup immediately Pending, manual Super Admin review, mandatory reasons for Request Changes and Reject, and no mandatory KYC, verified email, map or document gate.
- D-029/D-033/D-077/D-084: first public Live is automatic after manual approval and genuine readiness; include eligible saved Available and non-Archived properties if any. Zero properties are valid. No first owner Publish or Submit step.
- D-030–D-063: one premium template, nine core sections, three curated themes, private saved-draft editing and Preview, optional properties, and deliberate owner Publish Updates for already-Live saved changes. Read the individual confirmed specifications for exact UX, fields and limits.
- D-064–D-073: confirmed Super Admin review, correction, directory, restriction, role and audit policies. D-074–D-080: confirmed session, tenant, public-site and publication policies; pilot internal CRM is deferred.
- D-081–D-087: host-scoped management sessions; stable pilot slug; Blocked and Deactivated sites non-public until eligible restoration; eligible properties in first Live snapshot; canonical Profile values stage into private site draft; validated privacy-safe optimized media; truthful atomic publish with safe idempotent retry that retains previous Live and draft on failure.
- D-088–D-094 are proposals only. Exact auth, schemas/APIs, state transitions, mappings, media processing, retry/cache mechanics, DNS, QA, deployment and billing remain open.

## Working rules

Prefer small, maintainable pilot work. Protect tenant isolation, private drafts and secure media when future feature work is explicitly authorized. Keep zero-property sites useful without fake listings. Work in the existing repository and do not overwrite another agent's changes. Verify commands and results honestly; review the diff and staged files for secrets before a permitted commit. Update docs/AI/CURRENT-STATE.md and docs/AI/HANDOVER-LATEST.md with actual results at the end of meaningful work. Preserve confirmed decision documents and historical planning records.
