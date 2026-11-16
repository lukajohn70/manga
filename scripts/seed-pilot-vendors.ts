/**
 * Manga Platform - Private Vendor Beta Onboarding & Pilot Data Seeder
 * Seeds 20 pilot vendors across 6 commerce verticals with multi-warehouse configurations.
 * (§18, §19, Milestone 5.7)
 */

export interface PilotVendorSeed {
  businessName: string;
  category: string;
  tier: 'gold' | 'silver' | 'bronze';
  city: string;
  state: string;
  contactEmail: string;
  productCount: number;
  initialStockPerSku: number;
}

export const PILOT_BETA_VENDORS: PilotVendorSeed[] = [
  // 1-5: Consumer Electronics & Computing
  { businessName: 'Apex Electronics Nigeria', category: 'electronics', tier: 'gold', city: 'Ikeja', state: 'Lagos', contactEmail: 'ops@apexelectronics.ng', productCount: 15, initialStockPerSku: 40 },
  { businessName: 'Slot Systems Direct', category: 'electronics', tier: 'gold', city: 'Victoria Island', state: 'Lagos', contactEmail: 'b2b@slotsystems.ng', productCount: 25, initialStockPerSku: 50 },
  { businessName: 'Alaba Gadgets Hub', category: 'electronics', tier: 'silver', city: 'Ojo', state: 'Lagos', contactEmail: 'sales@alabagadgets.ng', productCount: 10, initialStockPerSku: 20 },
  { businessName: 'Abuja Tech Warehouse', category: 'electronics', tier: 'silver', city: 'Wuse II', state: 'Abuja FCT', contactEmail: 'info@abujatech.ng', productCount: 12, initialStockPerSku: 25 },
  { businessName: 'Silicon Lagoon Components', category: 'electronics', tier: 'bronze', city: 'Yaba', state: 'Lagos', contactEmail: 'hello@siliconlagoon.ng', productCount: 8, initialStockPerSku: 15 },

  // 6-9: Fashion & Apparel
  { businessName: 'AfroThreads Couture', category: 'fashion', tier: 'gold', city: 'Lekki Phase 1', state: 'Lagos', contactEmail: 'concierge@afrothreads.ng', productCount: 30, initialStockPerSku: 35 },
  { businessName: 'Zaria Leather Works', category: 'fashion', tier: 'silver', city: 'Zaria', state: 'Kaduna', contactEmail: 'leather@zariaworks.ng', productCount: 14, initialStockPerSku: 25 },
  { businessName: 'Lagos Streetwear Collective', category: 'fashion', tier: 'silver', city: 'Surulere', state: 'Lagos', contactEmail: 'drops@lagosstreetwear.ng', productCount: 18, initialStockPerSku: 40 },
  { businessName: 'Kano Textile Merchants', category: 'fashion', tier: 'bronze', city: 'Kano Municipal', state: 'Kano', contactEmail: 'trade@kanotextiles.ng', productCount: 20, initialStockPerSku: 50 },

  // 10-12: Books & Educational Supplies
  { businessName: 'Lantern Books & Media', category: 'books', tier: 'gold', city: 'Ibadan North', state: 'Oyo', contactEmail: 'distribution@lanternbooks.ng', productCount: 45, initialStockPerSku: 80 },
  { businessName: 'Odusote Bookstores', category: 'books', tier: 'silver', city: 'Ibadan', state: 'Oyo', contactEmail: 'sales@odusote.ng', productCount: 35, initialStockPerSku: 60 },
  { businessName: 'University Press Logistics', category: 'books', tier: 'silver', city: 'Nsukka', state: 'Enugu', contactEmail: 'orders@unipress.ng', productCount: 22, initialStockPerSku: 45 },

  // 13-15: Beauty, Skincare & Personal Care
  { businessName: 'Olori Botanicals Organic Skin', category: 'beauty', tier: 'gold', city: 'Ikoyi', state: 'Lagos', contactEmail: 'glow@oloribotanicals.ng', productCount: 16, initialStockPerSku: 30 },
  { businessName: 'Shea Origin Natural Care', category: 'beauty', tier: 'silver', city: 'Minna', state: 'Niger', contactEmail: 'wholesale@sheaorigin.ng', productCount: 12, initialStockPerSku: 40 },
  { businessName: 'Aura Glam Cosmetics', category: 'beauty', tier: 'bronze', city: 'Port Harcourt', state: 'Rivers', contactEmail: 'contact@auraglam.ng', productCount: 20, initialStockPerSku: 25 },

  // 16-18: Home, Kitchen & Appliances
  { businessName: 'Dufil Household Goods', category: 'home', tier: 'gold', city: 'Agbara', state: 'Ogun', contactEmail: 'logistics@dufilhome.ng', productCount: 28, initialStockPerSku: 60 },
  { businessName: 'Niger Crafts Woodworks', category: 'home', tier: 'silver', city: 'Benin City', state: 'Edo', contactEmail: 'crafts@nigercrafts.ng', productCount: 10, initialStockPerSku: 15 },
  { businessName: 'Calabar Ceramic & Glass', category: 'home', tier: 'bronze', city: 'Calabar', state: 'Cross River', contactEmail: 'orders@calabarceramic.ng', productCount: 14, initialStockPerSku: 30 },

  // 19-20: Fast Moving Groceries & Pantry
  { businessName: 'SuperMart Direct Fresh', category: 'groceries', tier: 'gold', city: 'Victoria Island', state: 'Lagos', contactEmail: 'fresh@supermart.ng', productCount: 50, initialStockPerSku: 100 },
  { businessName: 'Jos Agro Highland Farms', category: 'groceries', tier: 'silver', city: 'Jos', state: 'Plateau', contactEmail: 'produce@josagro.ng', productCount: 25, initialStockPerSku: 75 },
];

export function getPilotBetaSummary() {
  const totalSkus = PILOT_BETA_VENDORS.reduce((sum, v) => sum + v.productCount, 0);
  const totalStockUnits = PILOT_BETA_VENDORS.reduce((sum, v) => sum + v.productCount * v.initialStockPerSku, 0);

  return {
    vendorCount: PILOT_BETA_VENDORS.length,
    tierBreakdown: {
      gold: PILOT_BETA_VENDORS.filter((v) => v.tier === 'gold').length,
      silver: PILOT_BETA_VENDORS.filter((v) => v.tier === 'silver').length,
      bronze: PILOT_BETA_VENDORS.filter((v) => v.tier === 'bronze').length,
    },
    totalCatalogSkus: totalSkus,
    totalInitialInventoryUnits: totalStockUnits,
    statesCovered: Array.from(new Set(PILOT_BETA_VENDORS.map((v) => v.state))),
  };
}
