import { query } from './db';

const INIT_DDL = `
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS vendor;
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS offers;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS orders;
CREATE SCHEMA IF NOT EXISTS shipping;
CREATE SCHEMA IF NOT EXISTS payments;

-- 1. Identity
CREATE TABLE IF NOT EXISTS identity.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32),
    name VARCHAR(255),
    role VARCHAR(32) NOT NULL DEFAULT 'buyer',
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Vendors
CREATE TABLE IF NOT EXISTS vendor.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    business_name VARCHAR(255) NOT NULL,
    legal_entity_type VARCHAR(64) NOT NULL DEFAULT 'LLC',
    tier VARCHAR(32) NOT NULL DEFAULT 'tier_1',
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    rating NUMERIC(3,2) NOT NULL DEFAULT 4.90,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Categories
CREATE TABLE IF NOT EXISTS catalog.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(128) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    icon_url TEXT
);

-- 4. Products
CREATE TABLE IF NOT EXISTS catalog.master_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name VARCHAR(128),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES catalog.categories(id),
    status VARCHAR(32) NOT NULL DEFAULT 'published',
    image_url TEXT,
    gallery JSONB NOT NULL DEFAULT '[]',
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.9,
    reviews_count INT NOT NULL DEFAULT 100,
    attributes JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Variants
CREATE TABLE IF NOT EXISTS catalog.variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_product_id UUID NOT NULL REFERENCES catalog.master_products(id) ON DELETE CASCADE,
    sku_canonical VARCHAR(64) UNIQUE NOT NULL,
    option_values JSONB NOT NULL DEFAULT '{}',
    weight_g INT NOT NULL DEFAULT 500,
    dims_mm JSONB DEFAULT '{}'
);

-- 6. Offers
CREATE TABLE IF NOT EXISTS offers.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendor.vendors(id),
    variant_id UUID NOT NULL REFERENCES catalog.variants(id),
    condition VARCHAR(32) NOT NULL DEFAULT 'new',
    price_minor BIGINT NOT NULL CHECK (price_minor > 0),
    compare_at_minor BIGINT,
    currency VARCHAR(3) NOT NULL DEFAULT 'NGN',
    status VARCHAR(32) NOT NULL DEFAULT 'active'
);

-- 7. Orders
CREATE TABLE IF NOT EXISTS orders.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(64) UNIQUE NOT NULL,
    buyer_id UUID,
    buyer_email VARCHAR(255),
    status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    currency VARCHAR(3) NOT NULL DEFAULT 'NGN',
    totals JSONB NOT NULL DEFAULT '{}',
    address_snapshot JSONB NOT NULL DEFAULT '{}',
    payment_method VARCHAR(64) NOT NULL DEFAULT 'paystack',
    payment_ref VARCHAR(128),
    idempotency_key VARCHAR(128),
    placed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders.order_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders.orders(id) ON DELETE CASCADE,
    product_id UUID,
    product_title VARCHAR(255) NOT NULL,
    seller_name VARCHAR(255) NOT NULL,
    unit_price_minor BIGINT NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'NGN',
    qty INT NOT NULL CHECK (qty > 0),
    image_url TEXT
);

-- 8. Shipping
CREATE TABLE IF NOT EXISTS shipping.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders.orders(id) ON DELETE CASCADE,
    tracking_number VARCHAR(64) UNIQUE NOT NULL,
    carrier VARCHAR(64) NOT NULL DEFAULT 'Manga Express Fleet',
    status VARCHAR(32) NOT NULL DEFAULT 'in_transit',
    estimated_delivery TIMESTAMPTZ,
    events JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

const SEED_DATA_SQL = `
-- Categories
INSERT INTO catalog.categories (id, slug, name, icon_url)
VALUES
  ('55555555-5555-5555-5555-555555555551', 'computing', 'Phones & Computing', 'fa-laptop'),
  ('55555555-5555-5555-5555-555555555552', 'electronics', 'Electronics & Audio', 'fa-headphones'),
  ('55555555-5555-5555-5555-555555555553', 'fashion', 'Fashion & Streetwear', 'fa-shirt'),
  ('55555555-5555-5555-5555-555555555554', 'home', 'Home & Appliances', 'fa-couch'),
  ('55555555-5555-5555-5555-555555555555', 'digital', 'Software & Digital Assets', 'fa-code')
ON CONFLICT (slug) DO NOTHING;

-- Vendors
INSERT INTO vendor.vendors (id, business_name, legal_entity_type, tier, status, rating)
VALUES
  ('33333333-3333-3333-3333-333333333331', 'Sony Audio Official Store', 'LLC', 'tier_1', 'active', 4.95),
  ('33333333-3333-3333-3333-333333333332', 'Samsung Nigeria Official', 'LLC', 'tier_1', 'active', 4.90),
  ('33333333-3333-3333-3333-333333333333', 'Apple Authorized Nigeria', 'LLC', 'tier_1', 'active', 4.98),
  ('33333333-3333-3333-3333-333333333334', 'De''Longhi Official Store', 'LLC', 'tier_1', 'active', 4.88),
  ('33333333-3333-3333-3333-333333333335', 'Manga Signature Workshop', 'LLC', 'tier_2', 'active', 4.92),
  ('33333333-3333-3333-3333-333333333336', 'DesignCraft Labs', 'LLC', 'tier_1', 'active', 4.96)
ON CONFLICT DO NOTHING;

-- Default Buyer User
INSERT INTO identity.users (id, email, phone, name, role, password_hash, status)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'buyer@manga.ng', '+2348031234567', 'Chidi Okonkwo', 'buyer', 'pbkdf2_demo_hash', 'active')
ON CONFLICT (email) DO NOTHING;

-- 1. Sony WH-1000XM5
INSERT INTO catalog.master_products (id, brand_name, title, description, category_id, status, image_url, rating, reviews_count, attributes)
VALUES (
  '66666666-6666-6666-6666-666666666661',
  'Sony',
  'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
  'Industry-leading noise cancellation with Auto NC Optimizer. Exceptional sound engineered to perfection with 30-hour battery life.',
  '55555555-5555-5555-5555-555555555552',
  'published',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
  4.9,
  384,
  '{"color": "Black", "connectivity": "Bluetooth 5.2", "warranty": "1 Year Official Sony Nigeria"}'
) ON CONFLICT DO NOTHING;

INSERT INTO catalog.variants (id, master_product_id, sku_canonical, option_values)
VALUES ('77777777-7777-7777-7777-777777777771', '66666666-6666-6666-6666-666666666661', 'SONY-WH1000XM5-BLK', '{"Color": "Black"}')
ON CONFLICT (sku_canonical) DO NOTHING;

INSERT INTO offers.offers (id, vendor_id, variant_id, condition, price_minor, compare_at_minor, currency, status)
VALUES ('88888888-8888-8888-8888-888888888881', '33333333-3333-3333-3333-333333333331', '77777777-7777-7777-7777-777777777771', 'new', 45000000, 58000000, 'NGN', 'active')
ON CONFLICT DO NOTHING;

-- 2. Samsung Galaxy S24 Ultra
INSERT INTO catalog.master_products (id, brand_name, title, description, category_id, status, image_url, rating, reviews_count, attributes)
VALUES (
  '66666666-6666-6666-6666-666666666662',
  'Samsung',
  'Samsung Galaxy S24 Ultra 512GB Titanium Black with S-Pen & AI',
  'Supercharged with Snapdragon 8 Gen 3 for Galaxy, titanium frame, 200MP camera system, and built-in Galaxy AI.',
  '55555555-5555-5555-5555-555555555551',
  'published',
  'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=85',
  4.8,
  96,
  '{"storage": "512GB", "ram": "12GB", "color": "Titanium Black"}'
) ON CONFLICT DO NOTHING;

INSERT INTO catalog.variants (id, master_product_id, sku_canonical, option_values)
VALUES ('77777777-7777-7777-7777-777777777772', '66666666-6666-6666-6666-666666666662', 'SAM-S24U-512-BLK', '{"Color": "Titanium Black"}')
ON CONFLICT (sku_canonical) DO NOTHING;

INSERT INTO offers.offers (id, vendor_id, variant_id, condition, price_minor, compare_at_minor, currency, status)
VALUES ('88888888-8888-8888-8888-888888888882', '33333333-3333-3333-3333-333333333332', '77777777-7777-7777-7777-777777777772', 'new', 185000000, 210000000, 'NGN', 'active')
ON CONFLICT DO NOTHING;

-- 3. Apple MacBook Air 15 M3
INSERT INTO catalog.master_products (id, brand_name, title, description, category_id, status, image_url, rating, reviews_count, attributes)
VALUES (
  '66666666-6666-6666-6666-666666666663',
  'Apple',
  'Apple MacBook Air 15" M3 Chip (16GB Unified Memory, 512GB SSD Midnight)',
  'Supercharged by Apple M3 8-core CPU and 10-core GPU. Liquid Retina display with 500 nits brightness and MagSafe 3 charging.',
  '55555555-5555-5555-5555-555555555551',
  'published',
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85',
  5.0,
  118,
  '{"memory": "16GB", "ssd": "512GB", "chip": "Apple M3"}'
) ON CONFLICT DO NOTHING;

INSERT INTO catalog.variants (id, master_product_id, sku_canonical, option_values)
VALUES ('77777777-7777-7777-7777-777777777773', '66666666-6666-6666-6666-666666666663', 'APL-MBA15-M3-16-512', '{"Color": "Midnight"}')
ON CONFLICT (sku_canonical) DO NOTHING;

INSERT INTO offers.offers (id, vendor_id, variant_id, condition, price_minor, compare_at_minor, currency, status)
VALUES ('88888888-8888-8888-8888-888888888883', '33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777773', 'new', 210000000, 235000000, 'NGN', 'active')
ON CONFLICT DO NOTHING;

-- 4. De'Longhi Dedica
INSERT INTO catalog.master_products (id, brand_name, title, description, category_id, status, image_url, rating, reviews_count, attributes)
VALUES (
  '66666666-6666-6666-6666-666666666664',
  'De''Longhi',
  'De''Longhi Dedica Deluxe Slim Espresso & Cappuccino Pump Machine',
  'Premium 15-bar professional pressure with manual Cappuccino System for thick barista milk foam. Compact 6-inch slim stainless steel body.',
  '55555555-5555-5555-5555-555555555554',
  'published',
  'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=85',
  4.9,
  64,
  '{"pressure": "15 Bar", "finish": "Stainless Steel"}'
) ON CONFLICT DO NOTHING;

INSERT INTO catalog.variants (id, master_product_id, sku_canonical, option_values)
VALUES ('77777777-7777-7777-7777-777777777774', '66666666-6666-6666-6666-666666666664', 'DEL-DEDICA-SLIM', '{"Finish": "Steel"}')
ON CONFLICT (sku_canonical) DO NOTHING;

INSERT INTO offers.offers (id, vendor_id, variant_id, condition, price_minor, compare_at_minor, currency, status)
VALUES ('88888888-8888-8888-8888-888888888884', '33333333-3333-3333-3333-333333333334', '77777777-7777-7777-7777-777777777774', 'new', 32000000, 39000000, 'NGN', 'active')
ON CONFLICT DO NOTHING;

-- 5. Kano Handcrafted Leather Rucksack
INSERT INTO catalog.master_products (id, brand_name, title, description, category_id, status, image_url, rating, reviews_count, attributes)
VALUES (
  '66666666-6666-6666-6666-666666666665',
  'Manga Signature',
  'Handcrafted Kano Vegetable-Tanned Leather Travel Rucksack',
  'Handcrafted from genuine Northern Nigerian full-grain leather, tanned with traditional acacia bark extract in centuries-old Kano vats.',
  '55555555-5555-5555-5555-555555555553',
  'published',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
  4.9,
  73,
  '{"material": "Full-grain Kano Leather", "origin": "Kano, Nigeria"}'
) ON CONFLICT DO NOTHING;

INSERT INTO catalog.variants (id, master_product_id, sku_canonical, option_values)
VALUES ('77777777-7777-7777-7777-777777777775', '66666666-6666-6666-6666-666666666665', 'MNG-KANO-LTR-BRN', '{"Color": "Laterite Brown"}')
ON CONFLICT (sku_canonical) DO NOTHING;

INSERT INTO offers.offers (id, vendor_id, variant_id, condition, price_minor, compare_at_minor, currency, status)
VALUES ('88888888-8888-8888-8888-888888888885', '33333333-3333-3333-3333-333333333335', '77777777-7777-7777-7777-777777777775', 'new', 16500000, 21000000, 'NGN', 'active')
ON CONFLICT DO NOTHING;

-- 6. SaaS UI Design System & Figma Pro Kit
INSERT INTO catalog.master_products (id, brand_name, title, description, category_id, status, image_url, rating, reviews_count, attributes)
VALUES (
  '66666666-6666-6666-6666-666666666666',
  'DesignCraft',
  'SaaS UI Design System & Figma Pro Kit',
  'Comprehensive Figma UI component library with 2,400+ auto-layout components, light/dark modes, and WCAG AA accessible design tokens.',
  '55555555-5555-5555-5555-555555555555',
  'published',
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=900&q=85',
  4.9,
  128,
  '{"format": "Figma .FIG + React Tailwind Token Sync", "license": "Commercial SaaS"}'
) ON CONFLICT DO NOTHING;

INSERT INTO catalog.variants (id, master_product_id, sku_canonical, option_values)
VALUES ('77777777-7777-7777-7777-777777777776', '66666666-6666-6666-6666-666666666666', 'DSG-FIGMA-SGL', '{"License": "Single Developer"}')
ON CONFLICT (sku_canonical) DO NOTHING;

INSERT INTO offers.offers (id, vendor_id, variant_id, condition, price_minor, compare_at_minor, currency, status)
VALUES ('88888888-8888-8888-8888-888888888886', '33333333-3333-3333-3333-333333333336', '77777777-7777-7777-7777-777777777776', 'new', 4500000, 7500000, 'NGN', 'active')
ON CONFLICT DO NOTHING;

-- Seed Sample Order
INSERT INTO orders.orders (id, order_number, buyer_id, buyer_email, status, currency, totals, address_snapshot, payment_method, payment_ref)
VALUES (
  '99999999-9999-9999-9999-999999999991',
  'MNG-2611-48K2F',
  '11111111-1111-1111-1111-111111111111',
  'buyer@manga.ng',
  'in_transit',
  'NGN',
  '{"subtotal": 450000, "deliveryFee": 0, "grandTotal": 450000}',
  '{"recipientName": "Chidi Okonkwo", "phone": "+234 803 123 4567", "street": "24 Admiralty Way, Lekki Phase 1", "city": "Lagos", "state": "Lagos State"}',
  'Paystack Card (Mastercard •••• 4242)',
  'PSK-LIVE-8891'
) ON CONFLICT (order_number) DO NOTHING;

INSERT INTO orders.order_lines (order_id, product_id, product_title, seller_name, unit_price_minor, currency, qty, image_url)
VALUES (
  '99999999-9999-9999-9999-999999999991',
  '66666666-6666-6666-6666-666666666661',
  'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
  'Sony Audio Official Store',
  45000000,
  'NGN',
  1,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85'
) ON CONFLICT DO NOTHING;

INSERT INTO shipping.shipments (order_id, tracking_number, carrier, status, estimated_delivery, events)
VALUES (
  '99999999-9999-9999-9999-999999999991',
  'MNG-2611-48K2F',
  'Manga Express Fleet',
  'in_transit',
  NOW() + INTERVAL '1 day',
  '[
    {"status": "label_created", "location": "Ikeja Depot", "time": "2026-11-16T14:30:00Z", "description": "Shipping label created by vendor"},
    {"status": "picked_up", "location": "Lagos Hub", "time": "2026-11-16T17:00:00Z", "description": "Package picked up by Manga Logistics"},
    {"status": "in_transit", "location": "Kaduna Sort Facility", "time": "2026-11-17T08:15:00Z", "description": "Package in transit to delivery station"}
  ]'
) ON CONFLICT (tracking_number) DO NOTHING;
`;

let isInitialized = false;

/**
 * Automatically initializes database schemas and seeds standard catalog if missing.
 */
export async function ensureDatabaseReady(
  force = false
): Promise<{ initialized: boolean; message: string }> {
  if (isInitialized && !force) {
    return { initialized: true, message: 'Already initialized in-memory' };
  }

  try {
    // 1. Check if catalog.master_products table already exists
    const checkRes = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'catalog' 
        AND table_name = 'master_products'
      );
    `);

    const tableExists = checkRes.rows[0]?.exists === true;

    if (!tableExists) {
      console.log('[DB-Init] Tables missing. Auto-creating database schemas...');
      await query(INIT_DDL);
      console.log('[DB-Init] Schemas created. Auto-seeding catalog and vendor data...');
      await query(SEED_DATA_SQL);
      console.log('[DB-Init] Database schemas and seed data applied successfully.');
      isInitialized = true;
      return { initialized: true, message: 'Database schemas and seed data created from scratch.' };
    }

    // Check if products count is 0, seed if empty
    const countRes = await query('SELECT COUNT(*) as count FROM catalog.master_products');
    if (parseInt(countRes.rows[0]?.count || '0', 10) === 0) {
      console.log('[DB-Init] Tables exist but catalog empty. Seeding catalog...');
      await query(SEED_DATA_SQL);
    }

    isInitialized = true;
    return { initialized: true, message: 'Database tables verified and ready.' };
  } catch (err: any) {
    console.warn('[DB-Init] Database auto-initialization note:', err.message);
    return { initialized: false, message: err.message };
  }
}
