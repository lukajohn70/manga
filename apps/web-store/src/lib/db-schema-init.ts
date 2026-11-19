import { query } from './db';
import { hashPassword } from './security';

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

-- 1b. Password Reset Tokens (Expiring, Single-Use)
CREATE TABLE IF NOT EXISTS identity.password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON identity.password_resets(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_resets_email ON identity.password_resets(email);

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

const STANDARD_CATEGORIES_SQL = `
INSERT INTO catalog.categories (id, slug, name, icon_url)
VALUES
  ('55555555-5555-5555-5555-555555555551', 'computing', 'Phones & Computing', 'fa-laptop'),
  ('55555555-5555-5555-5555-555555555552', 'electronics', 'Electronics & Audio', 'fa-headphones'),
  ('55555555-5555-5555-5555-555555555553', 'fashion', 'Fashion & Streetwear', 'fa-shirt'),
  ('55555555-5555-5555-5555-555555555554', 'home', 'Home & Appliances', 'fa-couch'),
  ('55555555-5555-5555-5555-555555555555', 'digital', 'Software & Digital Assets', 'fa-code')
ON CONFLICT (slug) DO NOTHING;
`;

export const ADMIN_EMAIL = 'lukajohn70@gmail.com';
export const getAdminInitialPassword = () => process.env.ADMIN_INITIAL_PASSWORD || 'MangaAdmin2026!SecurePlatform#';
export const ADMIN_PASSWORD_HASH = hashPassword(getAdminInitialPassword());

let isInitialized = false;

/**
 * Purges all dummy products, offers, variants, orders, shipments, and dummy users from PostgreSQL.
 * Inserts the official platform administrator user (lukajohn70@gmail.com / password: 12).
 */
export async function purgeDatabaseAndSeedAdmin(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Ensure DDL tables exist
    await query(INIT_DDL);
    await query(STANDARD_CATEGORIES_SQL);

    // 2. Clear all dummy shipments and order data
    await query('TRUNCATE TABLE shipping.shipments CASCADE;');
    await query('TRUNCATE TABLE orders.order_lines CASCADE;');
    await query('TRUNCATE TABLE orders.orders CASCADE;');

    // 3. Clear all offers, variants, products, and vendors
    await query('TRUNCATE TABLE offers.offers CASCADE;');
    await query('TRUNCATE TABLE catalog.variants CASCADE;');
    await query('TRUNCATE TABLE catalog.master_products CASCADE;');
    await query('TRUNCATE TABLE vendor.vendors CASCADE;');

    // 4. Clear all dummy users
    await query('DELETE FROM identity.users WHERE email != $1;', [ADMIN_EMAIL]);

    // 5. Ensure the admin user lukajohn70@gmail.com exists with password '12'
    await query(
      `
      INSERT INTO identity.users (email, phone, name, role, password_hash, status)
      VALUES ($1, '+234 800 000 0000', 'Luka John', 'admin', $2, 'active')
      ON CONFLICT (email) DO UPDATE SET
        name = 'Luka John',
        role = 'admin',
        password_hash = $2,
        status = 'active';
      `,
      [ADMIN_EMAIL, ADMIN_PASSWORD_HASH]
    );

    console.log('[DB-Purge] Database purged. All products removed. Admin user created: lukajohn70@gmail.com');
    isInitialized = true;
    return {
      success: true,
      message: 'Database purged successfully. All products and dummy details removed. Admin user lukajohn70@gmail.com active.',
    };
  } catch (err: any) {
    console.error('[DB-Purge] Error purging database:', err.message);
    return { success: false, message: err.message };
  }
}

/**
 * Ensures schemas exist, standard categories are loaded, and the admin user is active.
 * Never re-seeds dummy products!
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
      await query(STANDARD_CATEGORIES_SQL);
    }

    // Auto-purge dummy data if admin lukajohn70@gmail.com is not yet seeded
    const adminCheck = await query('SELECT id FROM identity.users WHERE email ILIKE $1', [ADMIN_EMAIL]);
    if (!adminCheck.rows || adminCheck.rows.length === 0) {
      console.log('[DB-Init] Admin user lukajohn70@gmail.com not found. Triggering full database purge & admin provisioning...');
      const res = await purgeDatabaseAndSeedAdmin();
      return { initialized: res.success, message: res.message };
    }

    isInitialized = true;
    return { initialized: true, message: 'Database tables verified and admin user active.' };
  } catch (err: any) {
    console.warn('[DB-Init] Database check note:', err.message);
    return { initialized: false, message: err.message };
  }
}
