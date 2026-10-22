// Phase 5a (D-103): property labels and formatting shared by the public template and the Agency Admin.
export type PropertyIntent = 'SALE' | 'RENT';
export type PropertyType = 'HOUSE' | 'APARTMENT' | 'PLOT' | 'SHOP' | 'OFFICE' | 'OTHER';
export type SizeUnit = 'SQ_FT' | 'SQ_YD' | 'MARLA' | 'KANAL';

/** What a published revision holds for one property: only publicly shown fields (D-078 eligible records only). */
export type PublicProperty = {
  key: string; title: string; intent: PropertyIntent; type: PropertyType; pricePkr: number; city: string; area: string;
  size?: { value: number; unit: SizeUnit }; bedrooms?: number; bathrooms?: number; description?: string;
  /** Phase 3d: gallery media ids in display order and the cover (first photo when none chosen). */
  photos?: string[]; coverMediaId?: string;
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  HOUSE: 'House', APARTMENT: 'Apartment', PLOT: 'Plot', SHOP: 'Shop', OFFICE: 'Office', OTHER: 'Other',
};
export const INTENT_LABELS: Record<PropertyIntent, string> = { SALE: 'For sale', RENT: 'For rent' };
export const SIZE_UNIT_LABELS: Record<SizeUnit, string> = { SQ_FT: 'sq ft', SQ_YD: 'sq yd', MARLA: 'marla', KANAL: 'kanal' };

/** "PKR 25,000,000" for sale, "PKR 85,000 / month" for rent. */
export function formatPrice(pricePkr: number, intent: PropertyIntent): string {
  return `PKR ${pricePkr.toLocaleString('en-US')}${intent === 'RENT' ? ' / month' : ''}`;
}

/** "10 marla · 4 beds · 3 baths" (only the parts that are set). */
export function propertyFacts(property: Pick<PublicProperty, 'size' | 'bedrooms' | 'bathrooms'>): string {
  return [
    property.size ? `${property.size.value.toLocaleString('en-US')} ${SIZE_UNIT_LABELS[property.size.unit]}` : '',
    property.bedrooms !== undefined ? `${property.bedrooms} ${property.bedrooms === 1 ? 'bed' : 'beds'}` : '',
    property.bathrooms !== undefined ? `${property.bathrooms} ${property.bathrooms === 1 ? 'bath' : 'baths'}` : '',
  ].filter(Boolean).join(' · ');
}
