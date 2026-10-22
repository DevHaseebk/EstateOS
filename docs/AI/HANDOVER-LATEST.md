# EstateOS — Phase 3e About and Team photos: implemented and verified by Claude (2026-10-22)

## Current task
- Contract: `docs/PHASE-3E-ABOUT-TEAM-PHOTOS-CONTRACT-APPROVED.md`. The owner approved it in chat on 2026-10-22, including the section 5 confirmations.
- Git: branch `master`. Phase 3e committed as `a7e5cac` and pushed to `origin/master` on the owner's instruction.
- Decisions: D-032, D-033 (unchanged), D-086, D-089, D-090, D-099/D-117 (consent spirit), D-106, D-110, D-115.

## Work completed
- **Backend**
  - `media.ts`: purposes `ABOUT` (at least 800 × 500) and `TEAM` (at least 300 × 300). `models.ts`: the `Media.purpose` enum, About `photoMediaId`, Team member `photoMediaId` and `photoConsent`.
  - `validation.ts`: About `photoMediaId` (nullable); Team member `photoMediaId` and `photoConsent`, with a rule that a photo needs `photoConsent === true` (422 on `members.N.photoConsent`).
  - `website-routes.ts`: the About save attaches its ABOUT media; the Team save attaches all member photos as TEAM media in one call (a wrong-purpose or foreign id → 422 on `members.N.photoMediaId`, nothing attached). A consent tick without a photo is not stored.
  - `website.ts`: section views return the photo fields only when set, so sections without photos read exactly as in 3c.
  - `publication.ts`: `snapshotMediaIds` adds the About photo and the team photos **only when that section is shown**, so a hidden section's photo stays private.
- **site-template**: the About photo (`srcset` 480/960, `alt` "Photo of <agency name>") beside the story at 768 px and wider, above it on phones; round 56 px team photos with `alt` = member name; initials stay for members without a photo.
- **Agency Admin**: About "Upload a photo", preview and Remove photo; per team member "Upload photo", round preview, Remove, and the consent checkbox once a photo is chosen. The "later phase" hints were removed.

## Verification (Node v24.22.1)
- typecheck, lint and build (5 workspaces) → exit 0.
- `npm test -w backend` → **129/129** (new `test/about-team-photos.test.ts`, 6 tests: minimum sizes, the consent rule, About attach and remove, Team consent, wrong-purpose and foreign ids, Live visibility (publish, hidden section, block), readiness unchanged, and a server render in the 3 themes with and without photos).
- HTTPS end-to-end check on the 3d synthetic agency (`6ad99f399be17f0816ead34c`, credentials in the gitignored `backend/.env.e2e-3d-dev.local`):
  - About and Team uploads 201; Team save without consent → 422 `members.0.photoConsent`; with consent → 200; layout shows About and Team;
  - both images 404 publicly before publish; Publish (from revision 2) → 200;
  - the public page has the About photo with its `alt`, the round team photo with the member name, and the initials for the member without a photo; both public images are 200 image/webp;
  - the admin editor About and Team pages are 200.
- Not verified: a visual click-through in a browser.

## Handoff
- At deploy time: the S3-compatible (R2) `MediaStorage` driver plus CDN with the owner's account (D-105, D-114).
- Next: a deploy/staging phase (needs the owner's accounts and decisions).
- Preserve: originals are never served; public images only through the current Live revision; uploads are staged until a save attaches them; team photos need consent.

---

# EstateOS — Phase 3d photo uploads: implemented and verified by Claude (2026-10-22)

## Current task
- Contract: `docs/PHASE-3D-PHOTO-UPLOADS-CONTRACT-APPROVED.md`. The owner approved it in chat on 2026-10-22, including the section 7 confirmations.
- Git: branch `master`, Phase 3d committed as `ca6cc42` and pushed to `origin/master` on the owner's instruction.
- Decisions: D-033, D-035, D-059, D-060, D-084, D-086, D-089, D-090, D-105 (interface), D-106, D-107, D-108, D-110, D-111, D-115.

## Work completed
- **Dependency**: `sharp` ^0.35.5 in `backend` (prebuilt native binary; libvips 8.18.7). `.gitignore` adds `backend/.media-dev/`.
- **Backend**
  - `storage.ts`: `MediaStorage` interface plus a local-disk driver (`MEDIA_DIR` override; key validation). The S3/R2 driver comes at deploy time.
  - `media.ts`:
    - content sniffing (JPEG/PNG/WebP magic bytes) and the 5 MB limit;
    - a full decode (pixel limit 40 M, auto-orient); minimum sizes HERO 1200 px wide and landscape, LOGO 64², PROPERTY 400×300;
    - WebP q80 at 480/960/1600 (never upscaled; a smaller original gets one variant at its own width);
    - `stageUpload`, `attachMedia` (agency + purpose check), `pickVariant`, `cleanupStagedMedia` (STAGED older than 24 h, files too).
  - `models.ts`:
    - `Media` (random 32-hex `mediaId`, purpose, STAGED/ATTACHED, private `originalKey`, variants);
    - Hero `heroImage.kind` UPLOAD/`mediaId`; header `logoMediaId`; `Property.photos`/`coverMediaId`;
    - `PublishedRevision.mediaIds`.
  - `media-routes.ts`: `POST /owner/media?purpose=` (raw body via route-level `express.raw`; image-only CSRF types; 60/hour per agency; `WEBSITE_READ_ONLY`/`AGENCY_DEACTIVATED`), `GET /owner/media/:id/:w`, `GET /super-admin/media/:id/:w` (attached only).
  - `public-routes.ts`: `GET /public/media/:id/:w`, served only if the id is in the agency's current Live revision `mediaIds` and the agency is Live and unrestricted.
  - `auth.ts`: `requireCsrf` takes allowed content types; `countAttempt` exported; a body-too-large error maps to 422 `TOO_LARGE`.
  - Saves: Hero `heroUploadId` (exclusive with `heroImageId`); Header `logoMediaId`; property `photos` (≤10, unique) and `coverMediaId` (must be in photos; defaults to the first).
  - Readiness: HERO_IMAGE is met by an UPLOAD or a licensed default. `snapshotMediaIds` is stored on revisions. The server runs an hourly staged-media cleanup.
- **BFF**: the owner facade forwards raw bytes for all mutations and adds the upload and image routes; image responses pass through as bytes. The Super Admin facade adds the image route. `frontend/app/media/[mediaId]/[width]/route.ts` proxies the public image route with the public key only.
- **site-template**: `siteModelFromWebsite(site, theme, { mediaUrl })`; the Hero `<img>` with `srcset` under the overlay; the header logo; property cover `<img>` with `srcset` and `alt` = title.
- **Agency Admin**: `ImageUpload` (Hero/logo), `PhotoGallery` (multi-upload, per-file errors, cover, move, remove; Save is blocked while uploading), `lib/media.ts`, `ownerMediaUrl`, card cover thumbnails.

## Verification (Node v24.22.1)
- typecheck, lint and build (5 workspaces) → exit 0.
- `npm test -w backend` → **123/123** (new `test/media.test.ts`, 11 tests, including EXIF/GPS stripping, sniffing, sizes, staging and visibility, the public revision rule, cleanup and rate limit; `bff.test.ts` +1; the 3a BFF assertion now decodes the raw bytes).
- HTTPS end-to-end check with a **new synthetic agency** (`6ad99f399be17f0816ead34c`, credentials in the gitignored `backend/.env.e2e-3d-dev.local`), **no fixture**:
  - a text file uploaded as JPEG → UNSUPPORTED_TYPE;
  - Hero upload (synthetic JPEG with GPS EXIF) → the owner variant is WebP 1600×889 with `exif=false`; not public before Live (404);
  - Hero save → ready; Approve → Live; the public page uses `/media/<id>/1600` and the srcset; the public image is 200 image/webp;
  - property photo → saved (404 publicly before publish) → publish → the cover is 200 and on the page;
  - Super Admin image 200; the admin editor and properties pages 200.
- Not verified: a visual click-through in a browser.

## Handoff
- At deploy time: implement the S3-compatible (R2) `MediaStorage` driver plus CDN with the owner's account (D-105, D-114).
- Next small phase: 3e About/Team photos (same pipeline). Then a deploy/staging phase.
- Preserve: originals are never served; public images only through the current Live revision; uploads are staged until a save attaches them.

---

# EstateOS — Phase 5a Properties (without photos): implemented and verified by Claude (2026-10-22)

## Current task
- Contract: `docs/PHASE-5A-PROPERTIES-CONTRACT-APPROVED.md`. The owner approved it in chat on 2026-10-22, including the section 6 confirmations.
- Git: branch `master`, Phase 5a committed as `200bf0b` and pushed to `origin/master` on the owner's instruction.
- Decisions: D-031, D-032, D-046, D-047, D-056–D-058, D-061–D-063, D-078, D-084, D-089, D-103, D-104, D-109, D-110, D-115.

## Work completed
- **Backend**
  - `models.ts`: `Property` (title, intent, type, pricePkr, city, area, size {value, unit}, bedrooms, bathrooms, description, availability, archivedAt, version); the draft adds `sections.properties` {heading, displayCount 3|6}; the layout adds `visible.properties`.
  - `properties.ts`: `ELIGIBLE_FILTER` (Available and not archived), public/owner views, `eligibleProperties` (newest first, max 200).
  - `property-routes.ts`:
    - owner list/get/create/update (whole form plus availability with `expectedVersion`) and archive/restore;
    - 404 for another agency's ids; `PROPERTIES_READ_ONLY`; `PROPERTY_LIMIT` (200 active); `PROPERTY_CONFLICT`; `INVALID_TRANSITION`;
    - Super Admin read-only list.
  - `validation.ts`: `createPropertySchema`, `updatePropertySchema` (Sold only for Sale, Rented only for Rent), the properties section schema, and `visible.properties` (default false).
  - `publication.ts`: `buildSnapshot` is now async and includes the eligible properties, used by first Live and Publish updates (fingerprint included).
  - `website-routes.ts`: the properties section save; showing Properties needs an eligible property; the owner and Super Admin website GETs include `properties` for previews.
- **site-template**:
  - `property.ts` (labels, `formatPrice`, `propertyFacts`, `PublicProperty`);
  - the model's properties block (only visible plus eligible, sliced to `displayCount`);
  - public property cards with an Enquire link (WhatsApp with a prefilled message, else phone) and CSS.
- **BFF**: the owner property routes plus the properties section; Super Admin `agencies/:id/properties`.
- **Agency Admin**:
  - navigation adds Properties; `/properties` (cards, Active/Archived, empty state), `/properties/new`, `/properties/[id]`;
  - `PropertyForm` (Basics; expandable Details and Photos placeholder; availability; Save property with guard; Archive/Restore confirmation);
  - the editor's Properties section; the Layout Properties row; Overview "Add a property" (optional); post-Live notes.
- **Super Admin**: `AgencyProperties` read-only panel.

## Verification (Node v24.22.1)
- typecheck, lint and build (5 workspaces) → exit 0.
- `npm test -w backend` → **111/111** (new `properties.test.ts`, 11 tests; `bff.test.ts` +1). Two 3c assertions were updated: the Properties section path is now valid, and the layout default includes `properties: false`.
- Server-render: the Properties section in all 3 themes (`displayCount` slice, prices, Enquire WhatsApp link, nav); a section shown with no eligible properties is absent.
- HTTPS end-to-end check on the synthetic Live agency (backend temporarily on the photo fixture, then restarted normally). The first attempt failed because the internet IP had changed; the owner added it in Atlas → Network Access.
  - add a sale house and a rent flat → 201; Sold on a Rent listing → 422;
  - show Properties → 200; unpublishedChanges = true, preview shows 2, public shows none;
  - publish → revision 3; the public page shows both, the prices "PKR 45,000,000" and "PKR 85,000 / month", and the WhatsApp Enquire link;
  - mark the house Sold → the public page is unchanged until publish → after publish (revision 4) it is gone;
  - the Super Admin list shows AVAILABLE and SOLD; the Agency Admin property pages → 200.
- Not verified: a visual click-through in a browser.

## Handoff
- **Owner note:** the Atlas access list also has a pending `0.0.0.0/0` (allow from anywhere) entry. It is not needed now that the owner's current IP entry is Active, and is safer removed.
- **Owner action still open:** licensed Hero photos.
- Next: 3d (uploads; storage account), which also adds property photos.

---

# EstateOS — Phase 4b Publish Updates: implemented and verified by Claude (2026-10-22)

## Current task
- Contract: `docs/PHASE-4B-PUBLISH-UPDATES-CONTRACT-APPROVED.md`. The owner approved it in chat on 2026-10-22, including the section 7 confirmations.
- Git: branch `master`, Phase 4b committed as `b12d832` and pushed to `origin/master` on the owner's instruction.
- Decisions: D-053, D-054, D-063 (website part), D-079, D-087, D-089, D-090, D-092, D-102, D-107, D-110, D-115.

## Work completed
- **Backend**
  - `models.ts`: `PublishedRevision` adds `reason PUBLISH_UPDATES`, `requestId` (unique partial `(agencyId, requestId)`) and `contentHash`; the audit adds `WEBSITE_PUBLISH_UPDATES`.
  - `publication.ts`:
    - `snapshotFromDraft` (shared with first activation); `contentFingerprint` (sha256 of canonical JSON without `version` keys);
    - `livePublicationDetails` (liveRevision, publishedAt, unpublishedChanges);
    - `publishUpdates`, in one transaction: replay by requestId → LIVE check → edit rule → expected revision → readiness (NOT_READY result) → nothing to publish → insert n+1 → compare-and-swap pointer → audit. A duplicate-key race resolves to the same result; any other error gives 503 `PUBLISH_FAILED` with nothing changed.
  - `website-routes.ts`: `POST /owner/website/publish` (422 `NOT_READY` with an issue map). The owner website GET and the Super Admin detail include the Live details.
  - `validation.ts`: `publishSchema` (`expectedLiveRevision` ≥ 1, `requestId` as a UUID).
- **BFF (owner)**: `POST /owner/website/publish`.
- **Agency Admin**:
  - `PublishDialog` (confirmation; the requestId is kept until success, so "Try again" reuses it);
  - hub: an Unpublished changes badge, with Publish updates as the main action only when there are changes, plus Preview;
  - `websiteStatus` hint (up to date / unsaved-to-live);
  - post-Live notes on the editor and theme pages.
- **Super Admin**: "Live revision N, published …, Unpublished changes: yes/no"; a history label for publish.

## Verification (Node v24.22.1)
- typecheck, lint and build (5 workspaces) → exit 0.
- `npm test -w backend` → **99/99** (new `publish.test.ts`, 9 tests; `bff.test.ts` +1; the 4a publication-shape assertion was updated for the new fields).
- HTTPS end-to-end check on the 4a synthetic agency (backend temporarily on the photo fixture, then restarted normally):
  - unpublishedChanges was true (from the 4a private edit);
  - publish → revision 2, and the public page shows the new heading;
  - the same requestId → 200 with no duplicate; then `NOTHING_TO_PUBLISH`; a stale revision → `PUBLISH_CONFLICT`;
  - the Super Admin detail shows rev 2 and the history.
- The synthetic owner's password was reset through the audited support-reset CLI and stored in the gitignored `backend/.env.e2e-live-dev.local`.
- Not verified: a visual click-through in a browser.

## Handoff
- Owner action still open: licensed Hero photos.
- Next: 3d (uploads; needs a storage account) or 5 (Properties). Each needs a contract.
- Preserve: publish only for Live sites (never a first-Live gate); the whole draft at once; requestId idempotency; revisions are append-only.

---

# EstateOS — Phase 4a automatic first Live and public website: implemented and verified by Claude (2026-10-22)

## Current task
- Contract: `docs/PHASE-4A-FIRST-LIVE-CONTRACT-APPROVED.md`. The owner approved it in chat on 2026-10-22, including the section 8 confirmations.
- Git: branch `master`, Phase 4a committed as `190b325` and pushed to `origin/master` on the owner's instruction.
- Decisions: D-029, D-033, D-048, D-054 (Live part), D-075, D-077, D-081–D-084, D-088–D-092, D-094 (dev hosts), D-102, D-111, D-115, D-119.

## Work completed
- **Backend**
  - `models.ts`:
    - `publicationStatus` is now NEVER_PUBLISHED / ACTIVATION_PENDING / LIVE, with `publication` {slug (unique partial index), liveRevisionId, firstLiveAt, lastActivationError, activationAttempts};
    - append-only `PublishedRevision` (site snapshot, unique `(agencyId, revision)`);
    - the audit allows `actorRole: SYSTEM`, `axis: PUBLICATION` and `WEBSITE_FIRST_LIVE`.
  - `publication.ts`:
    - slug rules (`slugBase`, `slugCandidate`, reserved words);
    - `tryFirstActivation`: one transaction doing the slug, revision 1, the conditional pointer update and the audit; it retries a slug collision and on any other error sets ACTIVATION_PENDING with an error code;
    - `afterReadinessChange`, `reconcileActivations`, `startReconciler` (every 5 minutes, `unref`), and the views.
  - Triggers: Approve, Restore, Profile PUT, and the theme, section and layout PUTs (after commit; they never fail the request).
  - `public-routes.ts`: `publicGuard` (`x-public-api-key`; must differ from the internal key) and `GET /api/v1/public/sites/:slug`, which gives one identical 404 `NOT_AVAILABLE`. Mounted before `apiGuard`.
  - `config/env.ts`: `PUBLIC_API_KEY`, `PUBLIC_SITE_DOMAIN`. New CLI `npm run reconcile:activations -w backend`. The server starts the reconciler.
  - The owner website GET includes `publication`. The Super Admin directory adds `publicUrl`; the detail adds `publication` (with the error).
- **frontend/**
  - `lib/tenant.ts` (host → slug) and `lib/public-api.ts` (server-side fetch with the public key, `no-store`);
  - `page.tsx` (server-renders the Live revision, falling back to the platform placeholder) and `not-found.tsx`;
  - template fonts and CSS; `transpilePackages`; dev server bound to 127.0.0.1.
- **site-template**: `SiteContent` type (renders a draft or a frozen revision); `WebsiteData.publication`.
- **Agency Admin**: one `websiteStatus` helper used by the hub and Overview (Not live / Going live / Live with "Open your website"; after Live, a note that edits stay private until 4b).
- **Super Admin**: website label (Not ready / Ready / Going live / Live), "Open site" link, the activation error, and the system actor in the history.
- **Dev**: the Caddyfile wildcard `*.sites.estateos.localhost` → 4000; the public key is generated into the gitignored `backend/.env` and `frontend/.env.local`; `docs/LOCAL-DEV-SETUP.md` is updated.

## Verification (Node v24.22.1)
- typecheck, lint and build (5 workspaces) → exit 0.
- `npm test -w backend` → **89/89** (new `publication.test.ts`, 10 tests; `frontend-public.test.ts`, 3 tests).
  - The bootstrap test now spawns the CLI asynchronously; it hit the same mongod pipe stall as before.
  - The 3b test was updated: approved + ready now goes LIVE.
- HTTPS end-to-end check with a **new synthetic agency** (`6ad91009481f3343c38f29d7`, slug `e2e-synthetic-homes-1792610312`), with the backend temporarily on the test photo fixture and then restarted normally:
  - not live before Approve; LIVE right after Approve;
  - the public page shows the name, Live heading, dark theme and WhatsApp link; no cookies; no key in the page;
  - a private edit after Live does not leak;
  - Block → 404; Restore → 200; unknown host → 404;
  - the history shows WEBSITE_FIRST_LIVE.
  - That agency stays Live in the dev DB, as approved.
- Not verified: a visual click-through in a browser.

## Handoff
- **Owner action still open:** licensed Hero photos. Without them no real agency can go Live.
- Next: Phase 4b Publish Updates (D-053, D-054, D-079, D-087, D-107), 3d uploads, or 5 Properties. Each needs a contract.
- Preserve:
  - first Live is only ever automatic (never an owner button);
  - revisions are append-only;
  - the public portal is read-only with its own key;
  - one identical 404 for all non-public cases.

---

# EstateOS — Phase 3c optional website sections: implemented and verified by Claude (2026-10-22)

## Current task
- Contract: `docs/PHASE-3C-OPTIONAL-SECTIONS-CONTRACT-APPROVED.md`. The owner approved it in chat on 2026-10-21, including the section 7 confirmations.
- Git: branch `master`, Phase 3c committed as `c006a66` and pushed to `origin/master` on the owner's instruction.
- Decisions: D-031, D-032, D-033, D-050, D-051, D-052, D-089, D-099, D-109, D-110, D-115, D-117.

## Work completed
- **`site-template/`**
  - types `SITE_ICONS` (12), `OPTIONAL_SECTIONS`, `OptionalBlock`; `icons.tsx` (inline line SVGs);
  - `siteModelFromWebsite` builds the optional blocks in layout order, keeping only sections that are shown **and** have their minimum content;
  - `SiteTemplate` renders About, card grids (1/2/3 columns) and Team (initials, consented numbers), plus header in-page nav (from 768 px wide).
- **Backend**
  - `models.ts`: draft sections `about`, `services`, `whyChooseUs`, `team` (each with a version) and `layout` (order, visible, version).
  - `validation.ts`: section limits; `siteIcon`; team consent refine; `layoutSchema` (a permutation of the 5 keys).
  - `website.ts`: `hasMinimumContent`, `layoutView`, and the new section views.
  - `website-routes.ts`:
    - a table-driven `sectionUpdate`;
    - `versionFilter`, where a missing version counts as 0, so pre-3c drafts still save;
    - a shown section can't be emptied (422, enforced atomically with a `layout.visible.<key> != true` filter);
    - `PUT /owner/website/layout` (422 when showing a section without content; the content filter is in the same write; `LAYOUT_CONFLICT`).
- **BFF (owner)**: section paths for about/services/whyChooseUs/team, and `/owner/website/layout`.
- **Agency Admin editor**
  - `useDraftForm` hook (save, dirty, 409/422 and the guard, shared by all forms);
  - `forms.tsx`: `BasicSectionForm` (header/hero/contact/about), `CardsForm`, `TeamForm`, `LayoutPanel`;
  - the section list shows Shown/Hidden badges and has a Layout entry. Styles are in `website.css`.

## Verification (Node v24.22.1)
- typecheck, lint and build (5 workspaces) → exit 0.
- `npm test -w backend` → **76/76** (new `test/website-sections.test.ts`, 9 tests; `bff.test.ts` +1).
- Server-render: sections appear in layout order; hidden and shown-but-empty sections are absent; icons, initials and nav are present in all 3 themes.
- HTTPS end-to-end check with the synthetic test owner:
  - showing an empty section → 422; saving Services, then showing it with a new order → 200;
  - team number without consent → 422; emptying a shown section → 422;
  - the Super Admin view reflects the changes; editor pages → 200.
  - The test draft was then deleted.
- Not verified: a visual click-through in Chrome or Edge.

## Handoff
- Owner action still open: licensed default Hero photos (3b).
- Next: 3d (uploads; needs an object storage account) or Phase 4 (first Live).
- Preserve: optional sections never affect readiness; a section is rendered only if it is visible **and** has content.

---

# EstateOS — Phase 3b My Website foundation: implemented and verified by Claude (2026-10-21)

## Current task
- Contract: `docs/PHASE-3B-WEBSITE-FOUNDATION-CONTRACT-APPROVED.md`. The owner approved it in chat on 2026-10-21, including the section 10 confirmations.
- Git: branch `master`, Phase 3b committed as `b7cbbcc` and pushed to `origin/master` on the owner's instruction.
- Decisions: D-030–D-043, D-045, D-046, D-048–D-052, D-085, D-089, D-099, D-101, D-102, D-108, D-109, D-110, D-115.

## Work completed
- **`site-template/`** (new library workspace; no app, no port):
  - `SiteTemplate` renders Header, Hero, Contact and Footer, using container queries so a 390 px preview behaves like a phone;
  - `template.css` holds the D-042 HEX values, the D-039 fonts (supplied by the host app as CSS variables) and the contract section 8 values. Sizes use `cqi` instead of `vw`, which is the same at full width;
  - `siteModelFromWebsite` builds the render model from the API data;
  - `assets/hero-defaults.json` (empty) and `assets/LICENSES.md` explain how to add licensed photos; `src/hero-images.ts` maps ids to static imports.
  - Root `workspaces` now lists it first. The Admin and Super Admin portals have `transpilePackages` and a dependency on it; the backend depends on it only to resolve `hero-defaults.json`.
- **Backend**
  - `models.ts`: `WebsiteDraft` (unique `agencyId`, theme {preset, version}, sections header/hero/contact each with its own version, `mapped`).
  - `website.ts`:
    - `licensedHeroDefaults` (entries with every licence field; `HERO_DEFAULTS_PATH` override for tests);
    - `mapFromAgency` (D-085/D-099), `ensureDraft`, `virtualDraft`;
    - `getReadinessIssues` (the single D-033 rule), and the views.
  - `website-routes.ts`:
    - `GET /owner/website`, `PUT /owner/website/theme`, `PUT /owner/website/sections/:section`;
    - `GET /super-admin/agencies/:id/website` (read-only; never creates a draft);
    - errors `THEME_CONFLICT`, `SECTION_CONFLICT`, `WEBSITE_READ_ONLY`, `AGENCY_DEACTIVATED`, plus field-level 422 for an unlicensed photo or a non-public preferred contact.
  - Profile PUT upserts `mapped` in the same transaction. The Super Admin directory and detail compute `websiteReadiness` and `readinessIssues`.
- **BFF**: the owner facade allows the website GET, the theme PUT and the PUTs for the header/hero/contact sections. The Super Admin facade allows `agencies/:id/website`.
- **Agency Admin**
  - Navigation: Overview, My Website, Agency profile.
  - `/website` hub; `/website/theme` (candidate preview, Apply, Cancel); `/website/editor?section=` (per-section Save, with Save / Discard / Stay through the shell guard `useGuardedAction`); `/website/preview` (desktop and mobile width).
  - Overview shows the D-045 checklist. New `OwnerPage` wrapper, `lib/website.ts` and `website.css`.
- **Super Admin**: readiness badges; missing-items list on the agency page; `/agencies/[id]/preview` (read-only).

## Verification (Node v24.22.1)
- typecheck, lint and build (5 workspaces) → exit 0.
- `npm test -w backend` → **66/66** (new `test/website.test.ts`, 13 tests, with fixture `test/fixtures/hero-defaults.test.json`; `bff.test.ts` +1).
- The template server-renders all 3 themes. Only the chosen contacts appear, and with no public contact there are no CTA buttons.
- HTTPS end-to-end check with the synthetic test owner:
  - draft created; Apply theme; stale theme → `THEME_CONFLICT`;
  - Hero saved, issues reduced to PUBLIC_CONTACT and HERO_IMAGE; unlicensed photo → 422; injected agencyId → 422;
  - Super Admin website view and readiness; owner → Super Admin route → 404;
  - all new pages → 200.
  - The test draft was then deleted from the dev DB.
- Not verified: a visual click-through in Chrome or Edge (in-app browser blocks `*.localhost`). The automated contrast check named in contract section 9 was done as computed ratios only (section 8), not with an in-browser tool.

## Handoff
- **Owner action:** licensed default Hero photos. Until then every site lacks HERO_IMAGE and cannot be READY.
- Next: Phase 3c (optional sections) and 3d (uploads, object storage account needed), or Phase 4 (first Live). Each needs a contract.
- Preserve: drafts are only ever reached by session-derived agencyId; a Super Admin read never creates a draft; readiness is computed, never stored.

---

# EstateOS — Phase 3a Agency Admin shell and Agency Profile: implemented and verified by Claude (2026-10-21)

## Current task
- Contract: `docs/PHASE-3A-AGENCY-PROFILE-CONTRACT-APPROVED.md`. The owner approved it in chat on 2026-10-21, including the section 8 confirmations.
- The amendment to Phase 2a owner answer 4 is recorded in `docs/PHASE-2A-REVIEW-CONTRACT-APPROVED.md`.
- Git: branch `master`, Phase 3a committed as `1a1697b` and pushed to `origin/master` on the owner's instruction.
- Decisions: D-044, D-045 (part), D-046, D-047, D-055, D-085 (Profile side), D-089, D-099, D-100, D-102, D-109, D-110, D-115.

## Work completed
- **Backend**
  - `models.ts`: Agency adds `publicContact` ({showMobile, showWhatsapp}, both false by default), `profile` (description, officeAddress, city, serviceAreas, publicEmail), `profileVersion` and `profileUpdatedAt`.
  - `review.ts`: `ownerCanEdit` now covers Pending, Changes Requested and **Approved** while unrestricted.
  - `profile-routes.ts` (new):
    - `GET /owner/profile` and `PUT /owner/profile`;
    - the PUT saves the whole form in one transaction: Agency plus the owner's `User.name`, a version check, and `PROFILE_CONFLICT` / `PROFILE_READ_ONLY` / `AGENCY_DEACTIVATED`;
    - the agency comes from the session only.
  - `validation.ts`: `profileSchema` (strict; empty optional text is stored as absent; email is lower-cased).
  - The Super Admin detail adds `profile` and `publicContact`. The owner session adds `agency.name`.
  - The migration also backfills `profileVersion` and `publicContact`.
- **BFF (owner)**: `GET` and `PUT /owner/profile`; `PUT` method exported.
- **Agency Admin UI**
  - `components/AppShell.tsx`:
    - sidebar from `lg` (1024 px) up and a Menu button below it;
    - navigation lists only Overview and Agency profile;
    - an unsaved-changes guard context with a Save / Discard / Stay dialog on navigation and Sign out.
  - `components/Overview.tsx`: review status and website status shown separately, a Deactivated notice, one primary action to the Profile, and the review card.
  - `components/ProfileForm.tsx`:
    - one page with Essentials, "Shown on your website" checkboxes, a read-only login email and a collapsible More details section;
    - one Save profile button, field-level 422 errors, a 409 conflict message, a `beforeunload` prompt, and read-only mode.
  - New `lib/api.ts` and `lib/session.ts`. `/` shows the Overview when signed in; new `/profile` route.
- **Super Admin UI**: the agency page shows "Shown on website", city, address, areas served, public email and the description.

## Verification (Node v24.22.1)
- typecheck, lint and build (all 4 workspaces) → exit 0.
- `npm test -w backend` → **52/52** (new `test/profile.test.ts`, 11 tests; `bff.test.ts` +1).
  - The 2a unit test was updated for the amended `ownerCanEdit`.
  - The 2b migration test now expects 4 updates, because its legacy document also lacks the 3a fields.
- `migrate:review-axes` on Atlas dev: 4 updates, then 0.
- HTTPS end-to-end check with the synthetic test owner:
  - GET defaults; PUT saves (version 1, city and WhatsApp public);
  - stale PUT → `PROFILE_CONFLICT`; injected agencyId → 422;
  - the Super Admin detail shows the profile; owner → Super Admin route → 404;
  - the original values were restored; `/` and `/profile` → 200.
- Not verified: a visual click-through in Chrome or Edge, in particular the mobile menu and the Save / Discard / Stay dialog.

## Handoff
- Next: the Phase 3b contract (My Website hub, theme preset, Hero editor, image storage D-105/D-108, D-033 readiness, D-101 private preview, D-085 Profile → site-draft mapping, full D-045 checklist). It needs approval before any code.
- Preserve:
  - the profile is saved only as a whole form, with `expectedProfileVersion`;
  - public contact is private unless chosen;
  - the navigation lists only screens that are built.

---

# EstateOS — Phase 2b All Agencies directory and Block / Deactivate: implemented and verified by Claude (2026-10-21)

## Current task
- Contract: `docs/PHASE-2B-DIRECTORY-RESTRICTIONS-CONTRACT-APPROVED.md`. The owner approved it in chat on 2026-10-21, including the section 9 confirmations.
- Git: branch `master`, Phase 2b committed as `002b095` and pushed to `origin/master` on the owner's instruction.
- Decisions: D-070, D-071, D-072, D-073, D-074, D-081, D-083, D-089, D-092, D-102, D-115.

## Work completed
- **Backend**
  - `models.ts`: `restrictionStatus` is now NONE/BLOCKED/DEACTIVATED; adds `restrictionVersion`, `latestRestriction` and the directory indexes. The audit gets an `axis` field (REVIEW/RESTRICTION) and the `RESTRICT_*` actions.
  - `restriction.ts` (new): transition table, views, and `applyRestrictionTransition`, which in one transaction does the version/state check, the conditional update, owner session revocation on Block, and the audit entry.
  - `review.ts`: any review transition on a restricted agency → 409 `AGENCY_RESTRICTED`; the conditional update also requires `restrictionStatus: NONE`.
  - `auth.ts`:
    - owner login on a Blocked agency → 403 `AGENCY_BLOCKED`, only after a correct password;
    - `currentSession` treats a Blocked agency as signed out (401, defence in depth);
    - `requireOwnerWritable` → 403 `AGENCY_DEACTIVATED`;
    - the owner session and agency responses include the restriction.
  - `review-routes.ts`: `GET /super-admin/agencies` (regex-escaped search over agency name and owner email; filters; newest-first cursor), detail `restriction` plus history `axis`, `POST …/restrictions`, and the Resubmit write guard.
  - `validation.ts`: `restrictionSchema` and `directoryQuerySchema`.
  - The migration CLI also sets `restrictionVersion` and the audit `axis`.
- **BFF**: the Super Admin allow-list adds the list and restrictions routes.
- **Super Admin UI**
  - Header navigation: Review queue first, then All agencies.
  - New `/agencies` directory: filters kept in the URL, desktop rows and mobile cards, View / Manage.
  - The agency page has an **Account status** panel with Deactivate, Block and Restore dialogs. While restricted, the decision area shows "Restore first". The history labels both axes.
- **Agency Admin UI**: Deactivated card with the reason, Resubmit hidden. When a session ends (Block), the page returns to sign-in with a notice. The Blocked sign-in message comes from the API.

## Verification (Node v24.22.1)
- typecheck, lint and build (all 4 workspaces) → exit 0.
- `npm test -w backend` → **40/40** (new `test/restriction.test.ts`, 13 tests; `bff.test.ts` +1).
- Test fix: both migration tests now spawn the CLI asynchronously. `spawnSync` blocked the test process, so the in-memory mongod's piped log filled up and it stalled (30 s timeout).
- `migrate:review-axes` on Atlas dev: 5 updates, then 0.
- HTTPS end-to-end check with the synthetic test owner:
  - directory search;
  - Deactivate: the owner sees the reason; Resubmit → `AGENCY_DEACTIVATED`; a decision → `AGENCY_RESTRICTED`;
  - Restore, then Block: the old cookie → 401; login → `AGENCY_BLOCKED`;
  - Restore again: login → 200;
  - owner → directory → 404.
  - The test agency ends **PENDING / NONE**. The owner's own registered agency was not touched.
- Not verified: a visual click-through of the new screens in Chrome or Edge.

## Handoff
- Contract clarification: section 8 test 6 says a Block racing an Approve leads to "exactly one succeeds". Block is valid on an approved agency, so both can succeed when the Approve lands first. The test asserts the real invariant instead: an approval is never recorded after a Block.
- Not in 2b: public-site suppression pages and cache (Phase 4, D-083); notifications; bulk actions.
- Preserve: restriction mutations need `expectedRestrictionVersion`; Block plus session revocation plus audit stay in one transaction; search input is always regex-escaped.

---

# EstateOS — Phase 2a Super Admin review lifecycle: implemented and verified by Claude (2026-10-21)

## Current task
- Contract: `docs/PHASE-2A-REVIEW-CONTRACT-APPROVED.md`. The owner approved it in chat on 2026-10-21, including the section 8 confirmations.
- Git: branch `master`, Phase 2a committed as `430e8d8` and pushed to `origin/master` on the owner's instruction.
- Decisions: D-022, D-064–D-069, D-072, D-073, D-092, D-102, D-115.

## Work completed
- **Backend**
  - `models.ts`: Agency adds `reviewVersion`, `submittedForReviewAt`, `latestReview`, `restrictionStatus` (NONE only) and `publicationStatus` (NEVER_PUBLISHED only), plus the queue index. New append-only `AgencyAudit` model; update/delete hooks throw `AUDIT_APPEND_ONLY`.
  - `review.ts`: transition table, `ownerCanEdit`, owner/review views, and `applyReviewTransition`, which checks the version and transition, does a conditional update and writes the audit in one transaction. Returns 409 `REVIEW_CONFLICT` or `INVALID_TRANSITION`.
  - `review-routes.ts`: `GET /super-admin/review-queue` (cursor pagination, counts), `GET /super-admin/agencies/:id`, `POST …/review-decisions`, `POST …/reopen`, `POST /owner/review-resubmissions`.
  - `auth.ts`: exports helpers and `apiGuard`, and the owner agency read includes the review view.
  - `validation.ts`: reasons are trimmed, 10–1000 characters, and APPROVE takes no reason.
  - `tenant.ts`: adds `superAdminScope`.
  - Migration CLI `npm run migrate:review-axes -w backend` (idempotent).
- **BFF**: allow-lists in both `app/api/v1/[...path]/route.ts`; cross-portal routes return 404.
- **Super Admin UI**: queue-first home (`components/ReviewQueue.tsx`); one-page `agencies/[agencyId]` review with review status and website readiness shown separately, a disabled private-preview placeholder, a decision area and history; `DecisionDialog.tsx` (desktop dialog, mobile bottom sheet, reason counter). A 409 shows a notice and reloads.
- **Agency Admin UI**: `components/ReviewStatusCard.tsx` shows a truthful status and the latest reason. Resubmit with confirmation appears only for Changes Requested.

## Verification (Node v24.22.1)
- `npm run typecheck`, `npm run lint` and `npm run build` (all 4 workspaces) → exit 0.
- `npm test -w backend` → **26/26** (new: `test/review.test.ts`, 13 tests; `bff.test.ts` +1). Covers:
  - the transition table, reason edges (9/10/1000/1001/whitespace), and one audit entry per decision;
  - 422 with no audit for bad reasons; 409 for an invalid transition and a stale version; parallel decisions where exactly one succeeds;
  - owner resubmit rules, and injected agencyId in the body or header → 422;
  - reopen requires a reason; owner sessions are rejected on Super Admin routes; CSRF and foreign Origin → 403;
  - queue order and pagination; unknown agency → 404;
  - a failed audit write rolls back the status change; audit update/delete are rejected;
  - the migration backfill is idempotent.
- `migrate:review-axes` on the Atlas dev DB: 4 field updates, then 0 on a re-run.
- HTTPS end-to-end check through Caddy with real cookies, using the synthetic test owner:
  - Super Admin login; the test agency appears in the queue; detail shows PENDING and NOT_READY;
  - a short reason → 422; Request Changes → 200; a stale repeat → `REVIEW_CONFLICT`;
  - the owner sees the reason and `canResubmit`; owner → Super Admin route → 404;
  - Resubmit → PENDING.
  - The dev agency is back in **PENDING**, with 2 audit entries.
- Not verified: a visual click-through in Chrome or Edge (the in-app browser refuses `*.localhost`).

## Handoff
- Not in Phase 2a: Block/Deactivate and the effects of Blocked/Deactivated sessions (Phase 2b), real website readiness, private preview, publishing, the All Agencies directory, notifications.
- Open: the audit `requestId` is a per-call UUID, not yet a request-wide correlation ID. Queue counts use a full aggregate (fine at pilot scale).
- Preserve: `reviewVersion` must be supplied on every mutation; audit and status change always happen in one transaction; agencyId never comes from a request.

---

# EstateOS — Local dev environment working (Claude, 2026-10-21)

- MongoDB Atlas free cluster `estateos-dev` (project `EstateOS`, Mumbai), app user `estateos_app`. Secrets only in gitignored `backend/.env`, `admin/.env.local`, `super-admin/.env.local`.
- First Super Admin bootstrapped via the CLI; dev password in gitignored `backend/.env.superadmin-dev.local`. A synthetic test owner and Pending agency exist (`backend/.env.testowner-dev.local`, gitignored).
- Local HTTPS through Caddy (`npm run proxy`, `dev/https/Caddyfile`; Caddy root CA trusted in the Windows CurrentUser store). Dev hosts were switched from `*.estateos.test` to `https://admin.estateos.localhost` and `https://control.estateos.localhost`, because hosts-file edits failed and browsers resolve `*.localhost` themselves. Code defaults, tests, env files and docs were updated. Guide: `docs/LOCAL-DEV-SETUP.md`.
- Verified through the proxy with real cookies: owner signup 201 Pending; login 200 setting `__Host-estateos_owner` (Secure, HttpOnly, SameSite=Lax, no Domain; token not in JSON); session shows the owner and a PENDING agency; foreign-Origin logout 403; cookies not accepted on the other portal (401); BFF blocks cross-portal routes (404); logout 204, then 401. The same checks pass for the Super Admin portal.
- Not verified: a visual click-through in a desktop browser. The Claude Code in-app browser refuses `*.estateos.localhost`; the owner should open both URLs in Chrome or Edge.
- Setup changes (Caddyfile, `proxy` script, `allowedDevOrigins`, loopback-only admin dev servers, `.localhost` hosts, docs) are uncommitted.

---

# EstateOS — Phase 1 auth & tenant foundation: implemented by Codex, verified by Claude (2026-10-21)

## Current task
- Agent: Codex implemented Prompt #02 (Phase 1 auth + tenant foundation); Claude Code reviewed, re-ran checks and applied small fixes at the owner's request.
- Git: branch `master`, base commit `d34b57a`. **All Phase 1 work is UNCOMMITTED.** Nothing pushed (`origin/master` is still `3fe80da`).
- Decisions followed: D-028, D-072, D-074, D-076, D-081, D-088, D-089, D-093, D-095–D-098, D-111, D-115.
- **Contract:** the owner approved the Phase 1 contract in chat on 2026-10-21. The original Prompt #01 text was never saved, so Claude wrote the as-built version from the verified code: `docs/PHASE-1-AUTH-CONTRACT-APPROVED.md` (D-115).

## Work completed
- Backend (`backend/src/`): `models.ts` (Agency PENDING, User, AuthSession, AuthRateLimit, AuthAudit); `auth.ts` (signup, owner/Super Admin login, session, logout, owner agency read, support-reset completion); `security.ts` (argon2id, zxcvbn, CSRF HMAC); `tenant.ts` (server-derived agency scope); `validation.ts` (zod, six signup fields); CLIs `cli/bootstrap-super-admin.ts` and `cli/issue-reset.ts`. The backend binds to 127.0.0.1 and accepts only callers holding `INTERNAL_API_KEY`; `cors` was removed.
- BFF: `admin/app/api/v1/[...path]/route.ts` and `super-admin/.../route.ts` (route allow-list, exact Origin check, `__Host-` HttpOnly Secure host-only cookies, session token never sent to the browser).
- UI: simple sign-in / register / reset-code screens in `admin/app/page.tsx` and `super-admin/app/page.tsx`. No dashboards or review actions.
- Tests: `backend/test/auth.test.ts`, `backend/test/bff.test.ts`. Runtime notes: `docs/AI/PHASE-1-RUNTIME.md`.
- Claude fixes: login now verifies a throwaway hash for unknown emails, so timing does not reveal which emails are registered (`auth.ts`); a listen failure now exits with an error instead of logging success (`server.ts`); auth screens show the backend's field-level validation message instead of only "Invalid request" (both `page.tsx`); removed the legacy root `apps/.gitkeep` and `packages/.gitkeep` that the v5.9 doc merge had recreated.

## Verification (Claude, Node v24.14.0 from Codex's bundled runtime; system default is v22.0.0, below `engines`)
- `npm run typecheck` (all 4) → exit 0. `npm run lint` (all 4) → exit 0. `npm run build` (all 4) → exit 0; rebuilt admin, super-admin and backend after the fixes → exit 0.
- `npm test -w backend` → **12/12 pass**: health without DB, direct-call rejection, Pending signup, CSRF and foreign-Origin rejection, normalized duplicate email (409), cross-tenant 404, agencyId injected via query/header/body (422), cross-portal tokens (401), logout revocation, idle and absolute expiry, reset revoking sessions plus replay rejection, login throttling (429), one-time audited bootstrap, BFF cookie flags, and cross-portal routes.
- Not run: a browser end-to-end test over the HTTPS `*.estateos.localhost` proxy, and a real MongoDB replica set (tests use mongodb-memory-server). Diff reviewed: no `.env` files or secrets.

## Handoff
- Open items, not blocking local development:
  - Login throttling is per email+IP and per IP, with no per-account cap across many IPs.
  - Both facades share one `INTERNAL_API_KEY`; separate keys per portal would be stronger.
  - The CLIs run through `tsx` (a devDependency), so production operators need dev dependencies installed.
  - Install Node ≥22.13 (or 24 LTS) as the system default.
- Next: the owner reviews the diff and saves the approved contract file, then makes a local commit. After that, the Phase 2 contract (Super Admin review lifecycle, D-064–D-073, D-092, D-102) needs approval under D-115 before any code. Do not start Approve/Reject.
- Preserve: ports 4000–4003, the `__Host-` cookie names, the loopback-only backend, and the rule that agencyId never comes from a request.

---

# EstateOS — AI HANDOVER LATEST (v5.9 · 2026-10-21)

## Latest approved work

The owner approved **32 D-088–D-119 Option A** product/architecture policies in one turn. The v5.9 planning ZIP was generated from the complete v5.8 ZIP. Canonical individual docs, a new confirmed map, decisions, open questions and concise AI rule entry points were updated. **No application code or current developer Git repository was modified here.**

## Read first

1. Root `AGENTS.md` and agent-specific `CLAUDE.md` or Cursor rule.
2. `docs/PLANNING-INDEX-LOCKED-v5.9.md`; `docs/DECISIONS.md`; `docs/IMPLEMENTATION-READINESS-v5.9-CONFIRMED-MAP.md`.
3. `docs/AI/CURRENT-STATE.md`; `docs/OPEN-QUESTIONS.md`.
4. Applicable canonical specs, especially D-088/D-089/D-095–D-098/D-115 before any auth milestone.

## Safeguards

- Keep D-028 immediate Pending manual review, D-029 first auto-Live approval + readiness/opt-in public contact and zero properties, D-053/D-063 post-Live explicit Publish Updates.
- No tenant data query may rely on user-supplied agencyId; use authenticated server scope.
- Public subdomains must not receive privileged admin cookies. Localhost PORTS alone are not cookie boundaries.
- Original proposal letters for D-088–D-094 differ: current owner selected final batch Option A supersedes proposals, not prior CONFIRMED decisions.
- D-113 free curated pilot does not disable D-028 self-service registration.

## Next agent operational requirements

- Inspect real project Git status, Node version, lint/build/tests and existing Codex/Claude skill configuration; don't assume planning archive is the code repo.
- Before writing Phase 1 business logic, produce concrete auth/tenant/security/schema/API/negative-test contract for owner approval as required by D-115.
- No reinitializing Git, installing global packages, pushing remotes, deleting existing code or rewriting live secrets without explicit authorization.
- At end of each task update concise CURRENT-STATE and HANDOVER-LATEST with files changed, checks actually run, blockers and next requested scope.

## Historical context

Verbatim older v5.8 handover: `docs/AI/HISTORY-v5.8-docs-AI-HANDOVER-LATEST.md`. User had separately provided Claude's read-only review; that report is evidence of static repo inspection, not fresh verification in this planning bundle.
