> **RESOLVED / HISTORICAL (2026-10-20, v4.7):** Owner confirmed **D-058 Option A**: Title, Sale/Rent, Property Type, Price PKR, City, Area/Neighborhood **required** to save a property. All other Details and photos **optional**. This A/B/C comparison is retained for decision history only. **Authoritative:** `docs/PROPERTY-MINIMUM-FIELDS-D058-CONFIRMED.md`. **NEXT D-059 UNAPPROVED:** `docs/PROPERTY-PHOTOS-D059-PROPOSAL.md`. No code.

# D-058 — PROPOSED ONLY: Property Minimum Fields and Requiredness

**Status:** OWNER DECISION PENDING / NOT APPROVED | **Date:** 2026-10-19 | **Planning bundle:** v4.6 | **No application code**

## Purpose

D-056 confirmed responsive cards, and D-057 confirmed **one Add/Edit Property page, Basic Information visible first, Details/Photos expandable below**. But neither decision established an actual property data schema. **D-058 is the next independent owner choice: what is genuinely required to save a usable property record for a small Karachi/Pakistan-focused agency?** Examples are candidates only.

### Option A — Lean but Useful Core (RECOMMENDED)

**Candidate required Basics fields** (six):

1. **Property title** — short real listing description/name.
2. **Listing intent** — For Sale / For Rent.
3. **Property category/type** — e.g., House, Apartment, Plot, Commercial (exact enums not yet approved).
4. **Price (PKR)** — numeric positive asking price (specific validation/price-on-request exception open).
5. **City** — actual city, not a forced Karachi default.
6. **Area / neighborhood** — locality suitable for understanding the location without publishing a private address.

**Candidate optional:** size & unit, beds, baths, description, street address, property highlights, photos/cover, additional details. Do **not** make any photo required yet without a photo-specific decision. Exact option enums, validations, exceptions, internationalization, data retention and property publication rules still need work.

**Rationale:** Enough for a meaningful admin listing and later public property card, without making a new agent gather extensive data. A city and general area are more useful than a private street address.

### Option B — Ultra-Minimal Four Fields

**Candidate required:** property title, For Sale/For Rent, price (PKR), area/locality. Category/type and city optionally supplied. Less friction, but missing category and city could reduce browsing usefulness and complicate future searches.

### Option C — Detailed Listing From the Start

**Candidate required:** Option A six fields **plus** size + unit, description and at least one cover photo. Potentially richer public cards; greater onboarding friction and more complex photo validation. It is still **not** a website-activation requirement—zero properties remain valid.

## D-058 decision boundaries and follow-ups

Approval of one option would define its required-versus-optional *field categories*, **not** complete technical validators. Explicitly decide later:

- Exact category/type enums (residential/commercial etc.), rent frequency, zero/negotiable price behavior, local size units (gaz/sq yd, sq ft, marla, kanal), optional beds/baths by category.
- Photo formats, limits, cover fallback, upload mechanics and privacy.
- Property Save / unsaved warnings / validation errors / status / delete/archive and record permissions.
- Whether a successfully saved property appears publicly; D-053 website updates must not silently be presumed to govern property records.
- Actual card metadata layout, filtering/search, responsive pixel values, final labels/route paths, Inquiries/CRM pilot scope.

**Already confirmed and unchanged:** D-029 initial automatic go-live after manual Super Admin approval + D-033 website readiness, without owner initial Publish/Submit. Properties are fully optional; no extra KYC/photo gate for agency website readiness. D-053 later website content/theme update publishing stays intentional. D-056 responsive list cards and D-057 grouped one-page form stay fixed.

**Recommendation:** Option A for balanced listing usefulness and ease of use. Do not implement or mark any field required until user approves D-058.
