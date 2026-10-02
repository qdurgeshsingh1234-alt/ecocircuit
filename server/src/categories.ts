// Server-side category definitions — mirrors client/src/data/categories.ts slugs.
// Must stay in sync with the client canonical slug list.
// Source: CPCB India E-waste Management Rules 2022

export const CATEGORY_SLUGS = [
  'it-equipment',
  'mobiles-accessories',
  'batteries',
  'large-appliances',
  'small-appliances',
  'lighting',
  'cables-peripherals',
] as const;

export type CategorySlug = typeof CATEGORY_SLUGS[number];

// Default weight per collected item in each category (kg).
// Used to estimate impact in pickup requests.
// Source: GEM 2024 average item weights.
export const CATEGORY_WEIGHT_KG: Record<string, number> = {
  // Canonical slugs
  'it-equipment': 3.5,
  'mobiles-accessories': 0.2,
  'batteries': 0.3,
  'large-appliances': 20.0,
  'small-appliances': 1.5,
  'lighting': 0.1,
  'cables-peripherals': 0.4,

  // Legacy string keys for backward compatibility
  'IT Equipment': 3.5,
  'Mobiles & Accessories': 0.2,
  'Batteries': 0.3,
  'Large Appliances': 20.0,
  'Small Appliances': 1.5,
  'Lighting': 0.1,
  'Cables & Peripherals': 0.4,
};
