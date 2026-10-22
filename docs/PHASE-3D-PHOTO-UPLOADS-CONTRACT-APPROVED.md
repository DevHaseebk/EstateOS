# EstateOS — Phase 3d Photo Uploads Contract (APPROVED)

**Status:** APPROVED by the owner in chat on 2026-10-22, as written, including the confirmations in section 7 (D-115). Drafted by Claude Code the same day.
**Builds on:** Phases 3b–5a: the draft sections, Hero readiness, property records, revisions and Publish updates.
**Decisions implemented:** D-033, D-035, D-059, D-060, D-084, D-086, D-089, D-090, D-105 (storage interface), D-106, D-107, D-108, D-110, D-111, D-115.

## 0. Why this phase matters now

An **uploaded Hero photo satisfies D-033/D-108 readiness**. Once 3d exists, a real agency can go Live with its own photo, without waiting for licensed platform defaults.

| Phase | Contents |
|---|---|
| **3d (this contract)** | Secure upload and processing; **Hero photo**, **logo** and the **property gallery** (max 10, cover, reorder, remove); private originals; public privacy-clean derivatives; media bound to revisions. |
| 3e (later, small) | About photo and Team member photos (same pipeline, other placements). |
| Deploy phase (later) | The managed object storage driver (S3-compatible, recommended Cloudflare R2) plus CDN, created with the owner's account (D-105, D-114). |

## 1. Owner answers this contract is based on (approved 2026-10-22)

| # | Question | Recommended answer |
|---|---|---|
| 1 | **Where are files stored now, without a cloud account?** | Behind one **storage interface**. In development and tests, a **local disk driver** writes to a gitignored folder (`backend/.media-dev/`). The **S3-compatible driver** (recommended Cloudflare R2) is added at deploy time, when you create the account; the rest of the code does not change (D-105). |
| 2 | New dependency? | **`sharp`** (image decoding, resizing, re-encoding). It is widely used, MIT-licensed, and installs a native binary from npm. No other new library: uploads are sent as the raw file body (no multipart parser). |
| 3 | What does processing do (D-086)? | It checks the **real file content** (magic bytes) is JPEG, PNG or WebP, ≤ 5 MB, and decodes fully (corrupt files are rejected). It applies the camera rotation, then **re-encodes** to WebP at widths **480, 960 and 1600** (never upscaled), quality 80. Re-encoding **drops EXIF/GPS and all other metadata**. The original is kept **private** and is never served. |
| 4 | Minimum sizes? | Hero: at least **1200 px wide and landscape** (a "suitable" Hero, D-108). Logo: at least **64 × 64 px**. Property photo: at least **400 × 300 px**. Too small → a clear per-file message. |
| 5 | How do uploads link to saves (D-106)? | Uploading creates **staged** media (private to the agency). It becomes **attached** only when the owner saves (Hero section save, Header save for the logo, or Save property). Staged media not attached within **24 hours** is deleted automatically. A failed save never loses the property, and the gallery just shows the error. |
| 6 | Property gallery rules (D-059/D-060)? | 0–10 photos per property. The **cover** is chosen explicitly ("Set as cover"); otherwise the first photo is the cover. **Move up / Move down / Remove** controls (no drag). Each invalid file gets its own reason, and valid files from the same selection are kept. |
| 7 | Who can see which image? | Owner: own staged and attached media through the Agency Admin. Super Admin: any agency's attached media (preview and review). **Public:** only derivatives referenced by the agency's **current Live revision**, and only while the agency is Live and unrestricted (D-083). Originals: nobody, ever. |
| 8 | Are media ever deleted? | Only staged media older than 24 hours. Attached media stays as long as any revision references it (revisions are append-only, D-090). Removing a photo from a property only unlinks it. |

## 2. Data model

**`Media` (new):**

| Field | Meaning |
|---|---|
| `id` | random 32-hex public id, not guessable |
| `agencyId` | owner agency, scoped by the session |
| `purpose` | `HERO`, `LOGO` or `PROPERTY` |
| `status` | `STAGED` → `ATTACHED` |
| `width`, `height`, `bytes`, `contentType` | of the original |
| `originalKey` | private storage key |
| `variants` | `[{ width, key, bytes }]` (WebP) |
| `createdAt`, `attachedAt` | — |

**Draft and properties:**
- `sections.hero.heroImage` gains `{ kind: 'UPLOAD', mediaId }`, next to the existing `PLATFORM_DEFAULT`;
- `sections.header.logoMediaId` (optional);
- `Property.photos: [mediaId]` in display order, plus `coverMediaId`.

**Revisions:** the snapshot carries the media ids it shows, and `PublishedRevision.mediaIds` (indexed) records them for the public media check.

## 3. Readiness change

`HERO_IMAGE` is met by a licensed platform default (as before) **or** an attached Hero upload of this agency.

## 4. Versioned REST API — additions

| Method & path | Portal | Request | Success |
|---|---|---|---|
| `POST /owner/media?purpose=HERO\|LOGO\|PROPERTY` | OWNER | raw image body (`Content-Type: image/jpeg\|png\|webp`), ≤ 5 MB | `201 { media: { id, purpose, width, height, status: 'STAGED' } }`; invalid → `422 { code: UNSUPPORTED_TYPE \| TOO_LARGE \| TOO_SMALL \| CORRUPT_IMAGE, message }` |
| `GET /owner/media/:id/:width` | OWNER | — | WebP variant (own agency, staged or attached) |
| `GET /super-admin/media/:id/:width` | SUPER_ADMIN | — | WebP variant (attached) |
| `GET /public/media/:id/:width` | PUBLIC | — | WebP variant **only if** it is in the agency's current Live revision and the agency is Live and unrestricted; otherwise 404 |
| Hero/Header section save, property create/update *(extended)* | OWNER | `heroUploadId`, `logoMediaId`, `photos: [mediaId]` (≤ 10), `coverMediaId` | Ids must be this agency's media with the right purpose; otherwise 422. On success they are marked `ATTACHED`. |

**Other rules:**
- Upload rate limit: 60 per agency per hour (abuse guard).
- **BFF:** the owner facade adds the media upload and image routes and forwards the raw body. The Super Admin facade adds the image route. `frontend/` serves `/media/:id/:width` by proxying the public route with the public key.
- Image responses use long caching, since keys are immutable. Other responses keep `no-store`.

## 5. Screens

**Agency Admin:**
- **Hero editor:** "Upload your own photo" (shows the size rule: JPEG/PNG/WebP, ≤ 5 MB, at least 1200 px wide, landscape). The preview appears after the upload succeeds, and you can choose an upload or a platform photo. Saving the Hero section attaches it.
- **Header editor:** "Upload logo" with "Remove logo". When there is no logo, the agency name is shown as text.
- **Property form → Photos (expandable, D-057):**
  - multi-select upload with per-file progress and per-file errors;
  - thumbnails with a **Cover** badge, **Set as cover**, **Move up / Move down**, **Remove**;
  - "Up to 10 photos, JPEG/PNG/WebP, 5 MB each";
  - an upload still in progress blocks **Save property** with a short note.
- **Property cards:** the cover thumbnail, or the placeholder.

**Public template:**
- the Hero uses the uploaded photo (`srcset` 960/1600) with the D-043 overlay;
- the header shows the logo when set;
- property cards show the cover (480/960) with `alt` = property title.

**Super Admin:** previews show the same images.

## 6. Acceptance tests (D-093)

**Unit:**
- content sniffing (a renamed `.exe` → UNSUPPORTED_TYPE; PNG bytes with `image/jpeg` → still checked by content);
- 5 MB boundary;
- minimum sizes per purpose;
- EXIF/GPS removed from every derivative (an image with GPS in → no metadata out);
- variants never upscale;
- corrupt file → CORRUPT_IMAGE.

**API integration:**
1. Upload → staged; owner can fetch it, another agency gets 404, the public route gets 404.
2. Hero section save with an upload → attached; the readiness `HERO_IMAGE` issue is gone; a ready and approved agency goes Live with it.
3. Property save with photos and cover:
   - order kept;
   - 11 photos → 422; another agency's media → 422; the wrong purpose → 422;
   - removing a photo unlinks it but keeps the media.
4. Public media: 200 only for media in the current Live revision; a draft-only (unpublished) photo → 404; Blocked/Deactivated → 404. After Publish updates the new photo is public.
5. Originals are never served by any route.
6. A staged-media cleanup run deletes staged media older than 24 hours (and their files) and never touches attached media.
7. Rate limit on uploads; Deactivated or Rejected → 403; Blocked → 401; an injected `agencyId` → 422.

**BFF and frontend:** the upload route forwards the binary body untouched; `/media/:id/:width` is proxied with the public key only.

**Gates:**
- typecheck, lint and build;
- `npm test -w backend`;
- an HTTPS end-to-end check on a **new synthetic agency**: upload a Hero → it becomes ready → approve → Live with the uploaded photo, publicly visible; add property photos → publish → the cover is visible publicly. **No fixture photos are needed any more.**

## 7. Owner confirmations (approved 2026-10-22)

The owner confirmed:

- Local-disk storage in development now; the S3-compatible (R2) driver and your account come at deploy time.
- Adding the `sharp` dependency.
- The processing rules (WebP 480/960/1600, metadata stripped, private originals) and the minimum sizes in §1 Q4.
- Staged uploads expire after 24 hours; attached media is kept while revisions reference it.
- Public images are served only when referenced by the current Live revision.
- About/Team photos follow in a small 3e.
