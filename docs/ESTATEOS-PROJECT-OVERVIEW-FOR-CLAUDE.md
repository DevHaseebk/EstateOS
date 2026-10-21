# EstateOS — Complete Product Orientation for Claude Code, Codex and Cursor

**Current planning baseline: v5.8 / 2026-10-21. Authoritative details live in DECISIONS and individual CONFIRMED docs. This orientation is a summary; do not invent missing specifics.**

## What we're building / who uses it

EstateOS is a Pakistan-first, Karachi-oriented multi-tenant software-as-a-service platform for small real-estate agencies (typically 1–10 agents). The first targeted pilot is approximately 2–3 real agency businesses. Each agency gets an attractive branded public website without hiring a developer, an uncomplicated Agency Admin workspace and optional property listings. A central Super Admin manually reviews/manages agencies. Product priorities: genuine premium-looking design, ease of use on mobile and desktop, limited owner development time (~5–10 hours/week), and reversible/safe operations. This is not a marketplace cloning Zameen.com, nor a complex CRM at MVP.

## Approved development skeleton (Phase 0 ONLY code permission)

- `frontend/`: shared Next.js App Router public agency site renderer, port 4000 (NOT separate app per agency).
- `admin/`: Next.js Agency Admin, port 4001.
- `super-admin/`: Next.js Super Admin, port 4002.
- `backend/`: Express/Node.js TypeScript backend with Mongoose/MongoDB, port 4003; minimal `/api/health` scaffold.
- npm workspaces at repo root; ports 3000–3999 deliberately avoided. Additional root docs/config and `.cursor/rules/project.mdc` are fine. `apps/` and `packages/` in the historical ZIP contain only old archival `.gitkeep` placeholders and are NOT approved application layout. No actual Phase 0 execution has been verified here: inspect real project.
- AI collaboration uses `AGENTS.md`, `CLAUDE.md`, Cursor project rule, `docs/AI/CURRENT-STATE.md`, `docs/AI/HANDOVER-LATEST.md`; single AI edits shared working tree at a time by default.

## User journeys (approved high level)

**Signup & review:** self-service Owner signs up with name, agency name, mobile, WhatsApp, email and password; agency appears Pending immediately. An authorized Super Admin sees Pending queue first; Agency Review Detail on one page shows agency/contact info, review status separate from website readiness, private saved-draft preview and distinct Approve / Request Changes / Reject. Confirmation dialogs/sheets for each action; mandatory reasons for Request Changes/Reject. Changes Requested is separate; owner saves corrections then explicit Resubmit for Review returns agency to Pending manual review. Authorized Super Admin may reopen Rejected with reason history. Searchable/filterable All Agencies directory and distinct reasoned, reversible Block and Deactivate. Both restricted states make PUBLIC agency website non-public until eligible restoration. Pilot user roles: Super Admin and Agency Owner only, minimal durable audit and truthful in-app status. No mandatory KYC, business proof, verified-email, logo or office-map approval gate for pilot (historical older specs superseded).

**First website launch:** agency approved manually AND genuine readiness: one shared template selected, real agency name and Hero heading, phone OR WhatsApp, suitable uploaded OR correctly licensed default Hero image. When approval/readiness become true, first launch is automatic without owner Submit/Publish. Re-evaluate on successfully persisted relevant edits. Zero properties okay; eligible successfully saved Available/non-Archived properties, if any, included at first public snapshot. No second Super Admin review per normal site edit.

**Public website visual:** one customizable premium responsive shared template. Nine core sections: Header, Hero, About, Services, optional Properties, Why Choose Us, Team, Contact CTA, Footer. Header/Footer fixed and Hero/Contact CTA always shown; optional others may be shown/hidden and reordered via simple Move Up/Down. Three curated themes Modern Light, Warm Editorial, Contemporary Dark; full-bleed image Hero with directional contrast gradient. Manrope heading for Light/Dark, Playfair display heading for Warm Editorial, Inter body/UI. Responsive typography and approved palette tokens in canonical docs. Website editor manual Save per section, Save/Discard/Stay unsaved guard; preview saved draft only, not unsaved form edits or unapplied theme.

**Already-Live edits:** saved site/theme/eligible property changes belong to PRIVATE draft. Owner intentionally uses one Publish Updates action to atomically publish an eligible public snapshot. Previous Live stays intact on failure; private draft retains changes; explicit safe idempotent retry with truthful status. Profile is canonical for mapped business/contact data, stages those changes to private public-site draft, not immediately Live. Exact Profile save/requiredness/mapping still open. Restrict admin management cookies to their appropriate host/session, not public tenant subdomains.

**Properties (optional):** responsive cards grid/stack; one Add/Edit page: Basics first, Details and Photos expandable. Exactly six required to save an individual record: title, Sale/Rent intent, property type, PKR price, city, area/neighborhood. All additional size, bedrooms, bathrooms, description, photos optional. Up to 10 photos per property, each <=5MB, JPEG/PNG/WebP; thumbnail preview, explicit cover, simple reorder/remove, per-file errors. Uploaded media validated, optimized variants, remove EXIF/GPS metadata from public derivatives and protect originals. One Save Property persists whole private record; Save/Discard/Stay on dirty navigation. Availability concepts Available/Sold/Rented; Archive/Restore reversible, no MVP permanent Delete. Public sites show only eligible Available, non-Archived property records according to first-live or later explicit Publish Updates snapshots.

**Technical direction:** secure backend-validated server sessions in HttpOnly/Secure browser cookies; separate scoped management session boundaries; platform-managed agency subdomains fixed for pilot (exceptional admin correction), custom domains later; shared MongoDB but EVERY agency-owned read/write server-scope by trusted authorized agencyId; never trust agencyId from request/host alone; entire public site nonpublic for Blocked/Deactivated, with restoration recheck. Internal CRM/inquiry inbox deferred; public Contact/WhatsApp CTA retained.

## Things NOT approved and NOT to implement from assumption

Any code beyond Phase 0 unless separately authorized; exact tables/schemas/routes/endpoints/session infrastructure/CSRF rules; password reset, lockouts, final field enums/validators; subdomain naming/reserved words/DNS/SSL; render cache and atomic snapshot implementation; Profile Save and field mapping; media upload progress/storage/retention; publishing failures beyond policy; exact status transition matrix, audit schema, detailed error/notification UX; UI labels, breakpoints; pricing/billing, CRM, staff roles, custom agency domains, KYC gates and old `pnpm apps/*` layout.

## How to review / report

Start with `docs/AI/CLAUDE-COMPREHENSIVE-REVIEW-PROMPT.md` or use its command text. Read ALL docs responsibly: prioritize active canonical CONFIRMED files, then audit older proposals/version snapshots for conflicts. Check real repository code separately against documentation; do not claim scaffold exists or tests passed without examining/running them. Produce an evidence-based, prioritized gap analysis and a proposed Phase 1 scope for owner approval. DO NOT edit code, docs, config, Git, or install packages during read-only review.
