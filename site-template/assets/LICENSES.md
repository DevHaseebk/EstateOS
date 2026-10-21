# Platform default Hero photos — licence records (D-108)

Phase 3b contract §1 Q2: the owner supplies every default Hero photo and its licence. A photo counts toward website readiness (D-033) only when it is listed in `hero-defaults.json` **with all licence fields filled** and its file is in `assets/hero/`.

## How to add a photo

1. Put the file in `assets/hero/` (JPEG or WebP, landscape, at least 2400 px wide, no people's faces or private homes without permission).
2. Add an entry to `hero-defaults.json`:

```json
{
  "id": "city-skyline-1",
  "label": "City skyline at dusk",
  "file": "city-skyline-1.jpg",
  "source": "https://… (page the photo was obtained from)",
  "author": "Photographer name",
  "license": "Licence name and link (e.g. a paid stock licence number)",
  "recordedAt": "2026-10-21"
}
```

3. Add one import line for the file in `src/hero-images.ts`.
4. Record the photo below.

## Records

| id | Source | Author | Licence | Recorded |
|---|---|---|---|---|
| *(none yet)* | | | | |
