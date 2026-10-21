---
name: estateos-security-review
description: Use for a requested EstateOS backend, API, authentication, session, tenant-data or publication security review.
---

# EstateOS security review

Read AGENTS.md, docs/AI/CURRENT-STATE.md, docs/OPEN-QUESTIONS.md and the applicable D-074–D-087 CONFIRMED specs. Inspect actual routes, middleware, data access and tests; do not infer security controls from policy documents.

Trace authentication boundaries, management host and session separation, role authorization, trusted server-derived agencyId on every tenant read/write, cross-tenant negative paths, input validation, configuration/secrets, data exposure, CSRF and session protection, private draft access, and safe first/public revision handling. Include media metadata/original access and Blocked/Deactivated public restrictions when relevant.

Separate confirmed policy from OPEN implementation contracts. Report scenarios, evidence, severity, verification limits and the smallest in-scope fix. Do not invent a final schema, endpoint, cookie topology or publish transaction design, and do not implement unapproved business features.
