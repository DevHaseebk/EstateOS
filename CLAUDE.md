# Claude Code — EstateOS (current v5.8)

Follow AGENTS.md and the current planning sources: docs/PLANNING-INDEX-LOCKED-v5.8.md, docs/IMPLEMENTATION-READINESS-v5.8-CONFIRMED-MAP.md, docs/DECISIONS.md, docs/AI/CURRENT-STATE.md and docs/AI/HANDOVER-LATEST.md. Read the active milestone. Proposals and earlier version snapshots are historical when they conflict with confirmed v5.8 policy.

The owner authorized Phase 0.5 verification, minor foundation fixes, AI instruction and handover reconciliation, and a local commit in the existing root Git repository. Do not initialize Git, change its remote, create nested repositories or push without explicit owner permission. Four root npm workspaces use ports 4000/4001/4002/4003 (frontend/admin/super-admin/backend). Business-feature code remains out of scope: no auth, agency or property APIs/models, CRUD or publishing implementation.

Preserve every confirmed decision by referring to its canonical spec. Key invariants: D-028 lean Pending/manual review without KYC or verified-email gate; D-022 required review reasons; D-029/D-033/D-077/D-084 automatic first Live after approval and readiness with zero properties allowed and eligible saved properties included; D-053/D-063/D-079 deliberate atomic Publish Updates after Live; D-081–D-087 confirmed session, slug, restriction, first snapshot, Profile mapping, media privacy and retry policies. D-088–D-094 remain proposed.

Inspect Git state before edits, use compatible Node, verify actual typecheck/lint/build and backend health, review the diff and staged content, and record observed results in docs/AI/CURRENT-STATE.md and docs/AI/HANDOVER-LATEST.md. Do not claim unrun checks passed.
