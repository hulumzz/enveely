// Commercial catalog. Prices live in one shared source so the storefront,
// checkout, and server-side verification agree on the amount that is due.

export const EXTENSION_FEE = 15_000;
export const UNIQUE_CODES = Object.freeze([111, 222, 333, 123, 321]);

const catalog = {
  'blocka-sky-party': { price: 150_000, tier: 'Premium', featured: true },
  'blocka-sunshine': { price: 170_000, tier: 'Premium', featured: false },
  'blocka-cloud-dancer': { price: 185_000, tier: 'Premium', featured: false },
  // Mayura shares the established Premium package levels.
  'mayura-jade': { price: 150_000, tier: 'Premium', featured: true },
  'mayura-garnet': { price: 170_000, tier: 'Premium', featured: false },
  'mayura-pearl': { price: 185_000, tier: 'Premium', featured: false },
  // Pusaka uses the existing Heritage package levels.
  'pusaka-sogan': { price: 135_000, tier: 'Heritage', featured: false },
  'pusaka-kencana': { price: 155_000, tier: 'Heritage', featured: true },
  'pusaka-nila': { price: 175_000, tier: 'Heritage', featured: false },
  'serena-paper': { price: 0, tier: 'Gratis', durationDays: 7, featured: false },
  'serena-modern-white': { price: 55_000, tier: 'Essential', featured: false },
  'serena-ink': { price: 65_000, tier: 'Essential', featured: false },
  'meadow-picnic': { price: 75_000, tier: 'Signature', featured: false },
  'meadow-garden': { price: 85_000, tier: 'Signature', featured: true },
  'meadow-film': { price: 95_000, tier: 'Signature', featured: false },
  'amora-garden': { price: 95_000, tier: 'Signature', featured: true },
  'amora-moonlit': { price: 110_000, tier: 'Signature', featured: false },
  'amora-vintage-rose': { price: 125_000, tier: 'Signature', featured: false },
  'nusantara-sagara': { price: 135_000, tier: 'Heritage', featured: false },
  'elysian-ivory': { price: 150_000, tier: 'Premium', featured: true },
  'nusantara-puspa': { price: 155_000, tier: 'Heritage', featured: true },
  'elysian-noir': { price: 170_000, tier: 'Premium', featured: false },
  'nusantara-terra': { price: 175_000, tier: 'Heritage', featured: false },
  'elysian-champagne': { price: 185_000, tier: 'Premium', featured: false },
  'lumiere-gallery': { price: 190_000, tier: 'Editorial', featured: true },
  'lumiere-film': { price: 210_000, tier: 'Editorial', featured: false },
  'lumiere-clean': { price: 220_000, tier: 'Editorial', featured: false },
  'botanica-dusty-rose': { price: 145_000, tier: 'Signature', featured: true },
  'botanica-mauve-intimate': { price: 160_000, tier: 'Premium', featured: false },
  'botanica-blush-cream': { price: 140_000, tier: 'Signature', featured: false },
};

export const templatePlans = Object.freeze(catalog);

// Photo allowance scales with the chosen design and package price. Keeping it
// here makes the editor, checkout, and future entitlement checks share one rule.
const GALLERY_LIMITS = Object.freeze({
  'blocka-sky-party': 10,
  'blocka-sunshine': 12,
  'blocka-cloud-dancer': 14,
  'mayura-jade': 10,
  'mayura-garnet': 12,
  'mayura-pearl': 14,
  'pusaka-sogan': 16,
  'pusaka-kencana': 20,
  'pusaka-nila': 18,
  'serena-paper': 6,
  'serena-modern-white': 8,
  'serena-ink': 8,
  'meadow-picnic': 14,
  'meadow-garden': 18,
  'meadow-film': 18,
  'amora-garden': 14,
  'amora-moonlit': 14,
  'amora-vintage-rose': 16,
  'nusantara-sagara': 16,
  'nusantara-puspa': 20,
  'nusantara-terra': 18,
  'elysian-ivory': 10,
  'elysian-noir': 12,
  'elysian-champagne': 14,
  'lumiere-gallery': 24,
  'lumiere-film': 24,
  'lumiere-clean': 16,
  'botanica-dusty-rose': 20,
  'botanica-mauve-intimate': 18,
  'botanica-blush-cream': 18,
});

export function getGalleryLimit(variantId) {
  return GALLERY_LIMITS[variantId] || 10;
}

export function getTemplatePlan(variantId) {
  const plan = templatePlans[variantId];
  if (!plan) return null;
  return {
    variantId,
    ...plan,
    paid: plan.price > 0,
    durationMonths: plan.price > 0 ? 3 : 0,
  };
}

export function getFamilyPriceRange(templateId) {
  const prices = Object.entries(templatePlans)
    .filter(([variantId]) => variantId.startsWith(`${templateId}-`))
    .map(([, plan]) => plan.price);
  if (!prices.length) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function calculatePackage(variantId, durationMonths = 3) {
  const plan = getTemplatePlan(variantId);
  if (!plan) return null;
  if (!plan.paid) {
    return { ...plan, durationMonths: 0, durationDays: 7, basePrice: 0, extensionFee: 0, subtotal: 0 };
  }
  const months = Number(durationMonths) === 6 ? 6 : 3;
  const extensionFee = months === 6 ? EXTENSION_FEE : 0;
  return {
    ...plan,
    durationMonths: months,
    durationDays: months === 6 ? 183 : 92,
    basePrice: plan.price,
    extensionFee,
    subtotal: plan.price + extensionFee,
  };
}

export function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function planDurationLabel(plan) {
  if (!plan) return '';
  return plan.paid ? `${plan.durationMonths || 3} bulan tayang` : 'Gratis 7 hari';
}
