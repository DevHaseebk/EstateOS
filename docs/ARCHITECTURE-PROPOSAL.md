> **v5.3 CURRENT / AUTHORITATIVE — D-064 OPTION A CONFIRMED (2026-10-21):** Super Admin dashboard prioritizes **Pending Agency Review queue**, with one obvious **Review** action per agency and **All Agencies directory secondary**. This approves hierarchy **ONLY**; detailed review screen/actions/status transitions, moderation permissions/audit/notifications, filters/copy/routes/breakpoints remain OPEN. Canonical `docs/SUPER-ADMIN-DASHBOARD-D064-CONFIRMED.md`. Prior D-064 A/B/C proposal HISTORICAL. **NEXT D-065 PROPOSED ONLY:** `docs/AGENCY-REVIEW-DETAIL-D065-PROPOSAL.md` (A single-page summary + separate decision panel recommended; B two tabs; C wizard). **Phase 0 OWNER-AUTHORIZED scaffold only:** `backend/` Express/TS/Mongoose 4003; `admin/` Next.js 4001; `super-admin/` Next.js 4002; `frontend/` Next.js 4000; **npm workspaces** at root. Old pnpm + `apps/*` / `packages/*` scaffolding examples are SUPERSEDED for Phase 0; read `docs/PHASE-0-DEV-SETUP-CONFIRMED.md`. Codex has been prompted for skeleton; successful execution NOT VERIFIED; no other application features authorized. **D-028 lean signup and D-022 review reasons, D-029 + D-033 first automatic site go-live (no initial Publish/Submit, zero properties valid), and D-053 + D-063 already-Live owner Publish Updates are UNCHANGED.** Public property eligibility, admin agency transitions and CRM scope OPEN.

> **CURRENT v2.2 MVP PRIORITY:** D-033 Option A site readiness is CONFIRMED: template selected, genuine agency name/Hero heading, usable phone OR WhatsApp and suitable uploaded OR permitted default Hero visual. **No mandatory logo, About/Services/Properties, email verification, identity proof, or map pin for MVP initial publication.** Historical stricter architecture prose below is future-only under D-028, and no code is authorized. See `docs/SITE-READINESS-D033-CONFIRMED.md`.


> **v2.5 / ACTIVE D-035 + D-036:** Full-Bleed Image Hero CONFIRMED on all three presets (`docs/HERO-D035-CONFIRMED.md`); Editorial Contrast typography CONFIRMED Option B (`docs/TYPOGRAPHY-D036-CONFIRMED.md`): Warm Editorial serif DISPLAY headings + sans body/UI; other two presets sans headings/body. Any old D-035/D-036 OPEN references in historical notes are superseded. Exact font names, HEX colors, overlay metrics, media rules and breakpoint values remain OPEN; next D-037 color controls are PROPOSED only.


> **Latest design status (v2.3):** D-032 field/visibility controls, D-033 Essential Website Readiness and D-034 three curated preset names/count are CONFIRMED. Exact hex/font tokens, Hero layout and media limits remain OPEN. This document contains earlier planning snapshots; use canonical D-032/D-033/D-034 docs when any old statement conflicts.


> **ACTIVE MVP NOTE (v1.8):** D-028 defers detailed verification/email gates. D-029 confirms automatic publication of a ready website after Super Admin approval; any old wording below requiring separate initial owner Publish is historical future-scope. Read `docs/WEBSITE-ACTIVATION-D029.md`.

# Architecture proposal — NOT APPROVED

> **2026-10-17 D-030 active override:** ONE premium customizable section-based template with theme presets is CONFIRMED. D-031 Core 9 sections and D-034 three curated style presets are now CONFIRMED. Exact theme hex/font values, Hero layout and renderer implementation remain OPEN. **Important:** any D-018/D-021/D-023..D-027 *must verify proof/email/map before approval* language below is historical/deferred for MVP, regardless of past CONFIRMED labels. Do not implement those gates for the pilot.

> **MVP SCOPE UPDATE (D-028):** Any historical requirement in this document to verify email/proofs/map as an approval prerequisite is **deferred for the 2–3 agency pilot**. Current active product scope: `docs/MVP-RESET-v1.7.md`.


The owner has approved having a main repository with distinct application areas, not the exact names/stack below.

```text
estateos/
├── apps/
│   ├── public-web/         # tenant public agency website
│   ├── agency-admin/       # agency workspace + site builder
│   ├── super-admin/        # platform operations
│   └── api/                # single modular backend
├── packages/
│   ├── ui/                 # shared design system
│   ├── shared/             # shared TypeScript contracts/validation
│   └── config/             # lint/tsconfig/theme config
├── docs/
│   ├── AI/
│   └── milestones/
├── .cursor/rules/
├── AGENTS.md
├── CLAUDE.md
└── README.md
```

## PROPOSED design
- pnpm workspaces; consider Turborepo **only if** build orchestration genuinely needs it.
- Three web frontends using Next.js + TypeScript; one Node.js modular API backend.
- MongoDB with explicit tenant-scoped access. Consider Redis/queues only when requirement appears.
- Shared UI package for tokens, components, forms, tables; admin surfaces share primitives but can have distinct navigation.
- Store media externally, with ownership and upload restrictions; no binary property images in MongoDB.
- Use approved session/identity model and server-side RBAC; never trust caller-supplied tenant ID. **Confirmed signup data requirement D-016:** six initial self-service inputs after D-017 (owner full name, agency name, mobile, WhatsApp, email, password); store password securely using the eventual approved auth system, never plaintext. D-018 requires sending a signup verification link to the owner email and marking verified only after valid-link completion; other email events/recipients, token policy and delivery provider remain OPEN. Never treat email verification as Super Admin approval (D-014). **D-020**: on registration create Pending review status and make saved agency info/private website draft available to authorized Super Admin, with Approve/Reject/Request Changes actions. D-019 explicit owner submission gate superseded; **D-021 CONFIRMED** requires verified owner email before Super Admin Approve, with a server-enforced check. **D-023 CONFIRMED:** approval also needs server-checked detailed business profile completeness, required logo, exact map location and agency verification document(s); D-024/D-025 confirm acceptable proof type categories; precise validation/privacy policy is still OPEN. Keep contact numbers and potential marketing opt-in in distinct fields; a contact number does not imply promotional consent.
- Section builder stores validated section JSON; registry renders permitted components; maintain separate draft/published snapshots and publish revisions. **Confirmed business constraint D-015:** pending self-service owners can save site/property drafts and privately preview them, but neither site nor property may be publicly published until Super Admin approval (D-014). Enforcement must be server-side in future implementation.
- Separate property data from section settings; section references dynamic property queries instead of embedding full property records.
- One service per clear domain; avoid microservices, duplicated business rules and excessive abstraction.

### Email identity vs agency publishing gate (D-018 CONFIRMED, detail PROPOSED)

A verified email flag/timestamp, agency review status (Pending on registration under D-020), optional profile-completion indicator, and site publish status should be separately represented. **D-021 requires the email verification state to be checked server-side on every Approve attempt**; button-disabled UI alone is insufficient. There is no owner-initiated submission requirement (D-019 superseded). The exact schema, token storage/expiry and dashboard gating are proposals awaiting architecture/flow approval; refer to `docs/EMAIL-VERIFICATION.md`.

## Architecture decisions pending
- Apps count / deployment topology.
- Backend choice (e.g. Fastify vs NestJS) and data access style.
- Auth service and multi-tenant membership model.
- Template representation and upgrade behavior.
- Hosting strategy and domain routing.
- Subscription and payment integration.
- Media storage, notifications, observability, testing framework.

### Review state architecture note — D-022 confirmed business rules, persistence still proposed

Enforce non-empty reasons for Request Changes/Reject **server-side**; ensure owner correction submission acts only on a Changes Requested tenant, and explicit Super Admin reopen acts only on a Rejected tenant. Keep email verification as an independent prerequisite for Approve. Proposed audit events: review action, actor, tenant, reason, prior/next state and time. Exact schema, reopen status and retention remain OPEN.

### D-023 document and map architecture constraints (confirmed requirements; implementation proposed)

Store agency verification uploads as **private** tenant-scoped assets, **separate** from public website media (D-027 CONFIRMED). Owner and authorized Super Admin reviewer preview/download require server-side authorization on every access; no public URLs. Enforce approval checks for both verified email D-021 and D-023 required business profile/logo/map/document data server-side. Signed delivery mechanisms and upload scanning are **PROPOSED**, not approved technology choices. D-027 access rules are confirmed; exact map provider, storage vendor/delivery implementation, scanning and retention remain OPEN; do not introduce cloud services prematurely.

### D-024 confirmed flexible verification (v1.3)

For Super Admin approval, D-023's verification-document gate is met through **one acceptable business-or-office proof** under D-024; formal company registration is not mandatory and a documented alternative must exist for informal agencies. **D-025 confirms accepted categories and the manual alternative route. Exact matching and alternate-evidence acceptance criteria remain OPEN; D-026 confirms PDF/JPG/PNG, 10 MB per file and mobile camera upload.** A file upload alone never auto-approves an agency. Do not add proof fields to the six-field initial signup or delay immediate Pending visibility. See `docs/VERIFICATION-PROOF-POLICY.md`.

### D-025 accepted proof categories (confirmed)

**D-025 CONFIRMED — Accepted proof categories (Option A):** office rental/lease agreement; office ownership document; office utility bill; business registration certificate; or trade association membership proof. If none is available, an agency may submit alternative business/office evidence for **explicit manual Super Admin review**. Any **one acceptable proof** satisfies D-024; no universal formal registration requirement. Submission alone does not establish acceptability, verify an agency, or activate/publish its site. See `docs/ACCEPTED-VERIFICATION-DOCUMENTS.md`. Exact evidence matching and retention remain OPEN; D-026 confirms upload formats/size.

## D-026 (CONFIRMED) — verification-file upload boundary

For business/office proof uploaded **after minimal registration** (including alternative proof): **PDF (.pdf), JPG/JPEG (.jpg/.jpeg), PNG (.png)** only, **maximum 10 MB per individual file**, and a **mobile camera-photo upload option**. The file format/size approval does not automatically accept evidence or approve/publish the agency. **D-027 now CONFIRMS private storage and authorized owner/reviewer preview/download, with server-side tenant/role checks and no public URLs.** File count, storage vendor/delivery design, malware scanning, evidence matching and **retention/deletion (next D-028)** remain OPEN. See `docs/VERIFICATION-UPLOAD-RULES.md` and `docs/VERIFICATION-DOCUMENT-ACCESS.md`.
