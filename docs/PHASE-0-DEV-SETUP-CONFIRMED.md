# Phase 0 — CONFIRMED Development Scaffolding Setup (Owner operational authorization)

**Owner-authorized** initial infrastructure / skeleton task given to Codex. This is **NOT** application-feature implementation or approval of the older proposed architecture package. **Scaffolding execution is not yet verified here.**

## Approved project organization

Use a repository root with exactly **four top-level application folders**:

| Folder | Role | Phase 0 baseline |
|---|---|---|
| `backend/` | One Node.js/Express TypeScript backend API using Mongoose for MongoDB | minimal server, environment config, development scripts, `/api/health`; no product endpoints |
| `admin/` | Agency Admin | Next.js App Router, TypeScript, Tailwind; placeholder page only |
| `super-admin/` | Platform Super Admin | Next.js App Router, TypeScript, Tailwind; placeholder page only |
| `frontend/` | Multi-tenant public agency website renderer | Next.js App Router, TypeScript, Tailwind; placeholder page only, NO tenant-routing feature yet |

The repository may additionally contain **root configuration/docs** (`package.json`, lockfile, `.gitignore`, `.cursor/rules/project.mdc`, `AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/AI/...`), **NOT more application folders**, `apps/*` applications, or unnecessary `packages/*` shared component libraries during Phase 0. One tenant-capable frontend app is planned; no per-agency deployments requested.

## Confirmed workspace and local ports

- **npm workspaces** (NOT the historical `pnpm apps/* packages/*` proposal).
- `frontend` → `http://localhost:4000`
- `admin` → `http://localhost:4001`
- `super-admin` → `http://localhost:4002`
- `backend` → `http://localhost:4003`, health endpoint `http://localhost:4003/api/health`
- Application-specific scripts must explicitly pin ports; API URL and allowed local CORS origins use these values. Never fallback silently to 3000–3999. Actual free-port availability must be checked when running.
- Backend health endpoint must respond even if MongoDB is unavailable, with DB health indicated independently.
- Environment **examples** only, no committed secrets; strict TS where practical; minimal dependencies; verify build/lint/typechecks/startup when available.

## Precise scope boundary

Owner has **already given Codex the Phase 0 prompt**. It may install dependencies and generate the agreed FOUR app skeletons, build scripts, `.env.example` files and shared-AI handover. It may **NOT** create authentication flows, tenant domain routing logic, agency/property models/APIs, database seeders, functional dashboard/website editor, actual public landing features, queues, billing, CRM, Docker or production deployment merely under Phase 0 authorization. Future feature coding needs explicit task authorization; remaining product UX is still being planned.

## Migration/reconciliation notes

Earlier `docs/ARCHITECTURE-PROPOSAL.md` and `docs/DECISIONS.md` historical P-001/P-003 snippets mention **pnpm**, `apps/public-web`, `apps/agency-admin`, `apps/super-admin`, `apps/api`, or `packages/ui` etc. These are **superseded for initial implementation** by the owner-confirmed root four-app npm-workspaces Phase 0 setup above. Those older text passages remain for historical audit, not instruction. Any `.gitkeep` placeholders under `apps/` and `packages/` in prior **planning bundles** were archival documentation artifacts, **not** permission to create those folders as applications. Do not delete historical files from versioned planning ZIP.

Security/tenant isolation, authorization, schema design, real routing strategy, hosting choices, CI/CD, framework/package-version pinning, optional shared libraries, photo storage, test suite, staging/production boundaries all need separate approval.

## Cross-AI operating rule

`AGENTS.md`, `CLAUDE.md` and `.cursor/rules/project.mdc` must use this confirmed Phase 0 root-folder model as current authority. Every AI updates `docs/AI/CURRENT-STATE.md` and `docs/AI/HANDOVER-LATEST.md` after real Phase 0 work. Do NOT claim scaffolding has run or passed until actual outputs are inspected/tested. This planning ZIP itself is **documentation**, not the live code repository.
