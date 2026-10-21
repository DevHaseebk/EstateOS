import type mongoose from 'mongoose';
import type { Types } from 'mongoose';
import { Property } from './models.js';

// Phase 5a property projections (docs/PHASE-5A-PROPERTIES-CONTRACT-APPROVED.md).
export const MAX_ACTIVE_PROPERTIES = 200;
type PropertyDoc = {
  _id: Types.ObjectId; title: string; intent: string; type: string; pricePkr: number; city: string; area: string;
  size?: { value: number; unit: string } | null; bedrooms?: number | null; bathrooms?: number | null; description?: string | null;
  availability: string; archivedAt?: Date | null; version?: number | null; createdAt?: Date; updatedAt?: Date;
};
const defined = <T extends object>(value: T) => Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== null)) as T;

/** D-078: only Available AND not archived properties are ever public. */
export const ELIGIBLE_FILTER = { availability: 'AVAILABLE', archivedAt: { $exists: false } } as const;

/** The fields shown publicly: no timestamps or internal state, so a no-op save never changes the fingerprint (4b). */
export function publicPropertyView(property: PropertyDoc) {
  return defined({
    key: String(property._id), title: property.title, intent: property.intent, type: property.type, pricePkr: property.pricePkr,
    city: property.city, area: property.area, size: property.size ? { value: property.size.value, unit: property.size.unit } : undefined,
    bedrooms: property.bedrooms, bathrooms: property.bathrooms, description: property.description,
  });
}

/** Full owner view of one property (form and cards). */
export function ownerPropertyView(property: PropertyDoc) {
  return {
    ...publicPropertyView(property), id: String(property._id), availability: property.availability,
    archived: Boolean(property.archivedAt), version: property.version ?? 0, createdAt: property.createdAt, updatedAt: property.updatedAt,
  };
}

/** Eligible properties for previews and revisions, newest first, at most 200 (D-084, D-063). */
export async function eligibleProperties(agencyId: Types.ObjectId | string, session?: mongoose.ClientSession) {
  const query = Property.find({ agencyId, ...ELIGIBLE_FILTER }).sort({ createdAt: -1, _id: -1 }).limit(MAX_ACTIVE_PROPERTIES).lean();
  if (session) query.session(session);
  return (await query).map(publicPropertyView);
}
