# EstateOS — Locked Planning Index / Source-of-Truth Guide (v5.8)

**Read first:** `docs/ESTATEOS-PROJECT-OVERVIEW-FOR-CLAUDE.md`; `docs/DECISIONS.md` (latest/current TOP, historical below), `docs/AI/CURRENT-STATE.md`, `docs/AI/HANDOVER-LATEST.md`, `docs/IMPLEMENTATION-READINESS-v5.8-CONFIRMED-MAP.md`.

## Provenance & authority rules

- `*-CONFIRMED.md` files tied to user-approved IDs and latest confirmed decision map are active policy at their stated granularity. Root banner and canonical docs for most recent IDs take precedence over old inline snapshots.
- `*-PROPOSAL.md`, `*-DISCUSSION.md`, old `ARCHITECTURE-PROPOSAL.md` and legacy documents titled verification/proof/email are retained for transparency/audit, **not** permission to implement or revive deprecated pilot requirements.
- Current core exception: D-028 lean signup overrides earlier strict verified-email/KYC/maps/proof gates; approved D-022 required reasons still active; D-029 first-Live automatic after approval+readiness; D-053/D-063 post-Live owner publishing; D-075 subdomain and Phase 0 root folder plan override pnpm `apps/*` historical notes.
- V5.8 confirmed D-081–D-087, not the old proposed A/B/C; latest map and individual specs override older v5.7 text saying 'D081–D087 PROPOSED ONLY'.
- User owns approval: a recommended 'A' or Claude suggestion is never a confirmed decision until user explicitly says so. No business-code authorization follows merely from confirmed architecture choice.

## Topic index

| Topic | Authoritative entry points |
|---|---|
| Pilot and scope | `docs/MVP-RESET-v1.7.md`, `docs/PRODUCT-SCOPE.md`, `docs/PHASE-0-DEV-SETUP-CONFIRMED.md` |
| Signup/manual review | `docs/SUPER-ADMIN-REVIEW-LIFECYCLE-v5.6.md`, `docs/SUPER-ADMIN-D067-CONFIRMED.md`…`D073-CONFIRMED.md`, `docs/AGENCY-REVIEW-DETAIL-D065-CONFIRMED.md` |
| First website launch/readiness | `docs/WEBSITE-ACTIVATION-D029.md`, `docs/SITE-READINESS-D033-CONFIRMED.md`, `docs/IMPLEMENTATION-READINESS-D077-CONFIRMED.md`, `docs/IMPLEMENTATION-READINESS-D084-CONFIRMED.md` |
| Public website visual design | `docs/THEME-D034-CONFIRMED.md`, `docs/HERO-D035-CONFIRMED.md`, `docs/COLOR-HEX-D042-CONFIRMED.md`, `docs/FONT-FAMILIES-D039-CONFIRMED.md` |
| Website editing/publication | `docs/WEBSITE-EDITOR-SAVING-D050-CONFIRMED.md`, `docs/WEBSITE-EDITOR-UNSAVED-D051-CONFIRMED.md`, `docs/POST-LIVE-UPDATES-D053-CONFIRMED.md`, `docs/IMPLEMENTATION-READINESS-D079-CONFIRMED.md`, `docs/IMPLEMENTATION-READINESS-D087-CONFIRMED.md` |
| Property management | `docs/PROPERTIES-LIST-D056-CONFIRMED.md`, `docs/PROPERTY-FORM-D057-CONFIRMED.md`, `docs/PROPERTY-MINIMUM-FIELDS-D058-CONFIRMED.md`, `docs/PROPERTY-PHOTO-LIMITS-D060-CONFIRMED.md`, `docs/PROPERTY-STATUS-ARCHIVE-D062-CONFIRMED.md`, `docs/PROPERTY-PUBLIC-PUBLISHING-D063-CONFIRMED.md` |
| Media & privacy | `docs/PROPERTY-PHOTOS-D059-CONFIRMED.md`, `docs/IMPLEMENTATION-READINESS-D086-CONFIRMED.md` |
| Authentication / tenancy / domain | `docs/IMPLEMENTATION-READINESS-D074-CONFIRMED.md`…`D076-CONFIRMED.md`, D081–D083 canonical docs |
| Profile synchronization | `docs/AGENCY-PROFILE-UX-D055-CONFIRMED.md`, `docs/IMPLEMENTATION-READINESS-D085-CONFIRMED.md` |
| Deferred decisions | `docs/OPEN-QUESTIONS.md`, `docs/ROADMAP.md`, `docs/IMPLEMENTATION-READINESS-BATCH-D088-D094-PROPOSAL.md` |
| AI agents/working setup | `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/project.mdc`, `docs/AI/WORKFLOW.md`, `docs/AI/HANDOVER-LATEST.md` |

## Audit completeness

Full-versioned ZIP retains ALL previous file paths including historic `apps/.gitkeep`, `packages/.gitkeep` placeholders. Root-ready drop-in ZIP **excludes those two legacy placeholders only** so it does not create unapproved new app directories in an existing repository. No archived substantive Markdown specs are omitted from either planning bundle.
