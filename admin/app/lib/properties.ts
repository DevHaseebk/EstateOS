import type { PropertyIntent, PropertyType, SizeUnit } from 'site-template';

// Phase 5a: the owner's view of one property record (GET /owner/properties[/:id]).
export type OwnerProperty = {
  id: string; key: string; title: string; intent: PropertyIntent; type: PropertyType; pricePkr: number; city: string; area: string;
  size?: { value: number; unit: SizeUnit }; bedrooms?: number; bathrooms?: number; description?: string;
  availability: 'AVAILABLE' | 'SOLD' | 'RENTED'; archived: boolean; version: number; createdAt: string; updatedAt: string;
  photos?: string[]; coverMediaId?: string;
};

export const AVAILABILITY_LABELS: Record<OwnerProperty['availability'], string> = { AVAILABLE: 'Available', SOLD: 'Sold', RENTED: 'Rented' };

/** Phase 5a §1 Q3: Sold only for For Sale, Rented only for For Rent. */
export function availabilityOptions(intent: PropertyIntent): OwnerProperty['availability'][] {
  return intent === 'SALE' ? ['AVAILABLE', 'SOLD'] : ['AVAILABLE', 'RENTED'];
}
