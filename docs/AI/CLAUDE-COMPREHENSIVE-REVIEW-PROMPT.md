# Claude Code Prompt — EstateOS Complete Planning + Repository Read-Only Review

Copy the text below into Claude Code while opened in the **EstateOS project root** AFTER safely merging the latest planning files. This task is inspection/review only, not implementation.

---

You are a senior staff-level full-stack engineer, SaaS architect, security reviewer, product analyst, and UX lead. You are joining an ongoing project named **EstateOS**. I have already spent many iterations locking down product decisions and reviewing A/B/C choices. Do not redesign it from scratch and do not implement unapproved alternatives. Read my repository and planning files carefully and build an accurate shared understanding.

**STRICT MODE: READ-ONLY AUDIT.** Do not edit, create, delete, format, rename or move files. Do not run `npm install`, generate code, run migrations, start processes, touch secrets, commit, push or deploy. You MAY use read-only tools/commands (`pwd`, `ls`, `find`, `git status`, `git log`, `git diff --stat`, `cat`, `sed`, `rg`, package manifest inspection), and MAY ask for approval before any tests or commands that produce artifacts. Do not claim builds/tests passed if you did not run them. The application feature implementation is NOT yet authorized. Phase 0 scaffolding had separate limited authorization, but its completion is not presumed.

## Step 1: Establish exactly what is present

- Verify current working directory is EstateOS root. Inspect actual directory tree including hidden `.cursor` and `docs/`, and record whether `frontend/`, `admin/`, `super-admin/`, `backend/` actually exist. Inspect root `package.json` npm workspaces and exact script/port declarations if present. Do not invent working builds.
- Print git status and identify uncommitted/code-vs-planning changes; do not modify them. Note if files imported from planning conflict with Phase 0 files created by Codex.
- Verify there is a `docs/PLANNING-INDEX-LOCKED-v5.8.md` and `docs/IMPLEMENTATION-READINESS-v5.8-CONFIRMED-MAP.md`; if not, report what planning version is actually present rather than assuming v5.8.

## Step 2: Read ALL the relevant planning, systematically

In priority order:
1. `docs/ESTATEOS-PROJECT-OVERVIEW-FOR-CLAUDE.md`, `README.md`, `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/project.mdc`.
2. `docs/DECISIONS.md` **latest/current section first**; `docs/AI/CURRENT-STATE.md`; `docs/AI/HANDOVER-LATEST.md`; `docs/PLANNING-INDEX-LOCKED-v5.8.md`.
3. `docs/IMPLEMENTATION-READINESS-v5.8-CONFIRMED-MAP.md`; **each D-074 through D-087** `docs/IMPLEMENTATION-READINESS-D###-CONFIRMED.md` file.
4. The canonical `*-CONFIRMED.md` specs for website visual/theme, Agency Admin, Properties, Super Admin D-064 through D-073, signup/review/activation and Phase 0 setup. Pay special attention to `docs/MVP-RESET-v1.7.md`, `docs/WEBSITE-ACTIVATION-D029.md`, `docs/SITE-READINESS-D033-CONFIRMED.md`, `docs/POST-LIVE-UPDATES-D053-CONFIRMED.md`, `docs/PROPERTY-PUBLIC-PUBLISHING-D063-CONFIRMED.md`, `docs/SUPER-ADMIN-REVIEW-LIFECYCLE-v5.6.md`, `docs/PHASE-0-DEV-SETUP-CONFIRMED.md`.
5. `docs/OPEN-QUESTIONS.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`, `docs/milestones/M00-PLANNING.md`, `docs/AI/WORKFLOW.md`.
6. Inventory **EVERY** remaining file under `docs/` (including proposal, discussion, legacy verification and earlier bundle-validation history). Review their purpose and read older substantive documents in manageable batches. Note precise conflicts, not just counts. If needed split large Markdown files into ranges. Do not blindly paste massive concatenations and risk truncated context. Document what was fully read vs scanned or skipped.

**Critical precedence:** confirmed recent decisions override older versions. Old stricter email-verification/KYC/map/document requirements were deferred by D-028 for the first pilot. Old `apps/*` + pnpm project tree is historical; root four-app npm workspaces is current. A historical `CURRENT` heading inside preserved older versions does not override v5.8. `PROPOSED` is not `CONFIRMED`. If real repo code differs from specs, report discrepancy; do NOT silently "fix" either.

## Step 3: Demonstrate product understanding

Explain in your own words: EstateOS target customer/problem and 2–3 agency pilot; monetization/billing still open; all four apps and ports (public frontend 4000, Agency Admin 4001, Super Admin 4002, backend 4003); one shared multi-tenant Next.js website renderer; three theme presets, core 9 sections and premium style decisions; Owner registration/manual approval and correction/resubmit/reopen; automatic FIRST website go-live; private website/theme/profile/property drafts vs live; eligibility of public properties; post-Live atomic Publish Updates with safe retry; Super Admin Block/Deactivate vs property Archive; tenant and session isolation; optional media/photo rules; CRM deferred.

## Step 4: Review technical readiness without coding

Inspect actual Phase 0 source, if present. Mark each as IMPLEMENTED/VERIFIED, PRESENT BUT UNVERIFIED, MISSING or NOT IN SCOPE. Look at npm workspace wiring, Next.js framework configs, Express health, DB config, environment examples, CORS ports, TypeScript/lint/build scripts, Git status, secret exposure and accidental legacy `apps/` app creation. Do not treat an empty `.gitkeep` placeholder as an app.

Do a security/architecture feasibility review of server-side `agencyId` authorization; admin cookie/session origin boundaries with public tenant subdomains; platform DNS/TLS and slug constraints; profile source-of-truth mapping; initial activation idempotency; atomic snapshot/revision swap and CDN invalidation; image EXIF/GPS processing and private originals; reversible Block/Deactivate; audit records and failure recovery. Identify risks and decisions still needing the owner's permission.

## Step 5: Deliver one detailed structured review in chat ONLY

Use headings and tables as useful. Include:
A. **Executive summary**: do you understand the product and which planning version did you read?
B. **Architecture diagram in plain text** and app responsibility table, including ports.
C. **Confirmed product journeys**: registration/review; first publication; post-Live updates; properties; site restriction/reactivation.
D. **Decision traceability**: highlight D-022, D-028, D-029, D-033, D-053, D-063, D-067–D-087 with citations as exact repository file paths and decision IDs.
E. **Actual code audit** of Phase 0 and limitations; distinguish verified facts from assumptions.
F. **Conflicts, stale historical instructions, security/data leakage risks** with severity P0/P1/P2 and specific file paths/sections. No false positives from clearly labeled historical proposals.
G. **Outstanding blockers** required before the first safe feature implementation; distinguish must decide now vs can decide during later milestones.
H. **Proposed smallest Phase 1 development milestone** (e.g., secure tenant/session foundation) with dependency decisions, testable acceptance criteria, affected app folders and command-level verification plan. A proposal only — do NOT code.
I. **Short user-friendly Roman Urdu + English recap**: what is ready, what's missing and your recommended immediate next approval.
J. **Reading coverage report**: list docs actually read closely, scanned/indexed only, and any unread documents; never claim to have read files you did not read.

Do not auto-edit planning or issue commits. Do not invent production URLs, payment plans, tenant identities, completion percentages or test results. Ask only a short focused question at the end if something essential is unavailable. **Stop after the review and wait for explicit approval before any changes.**
