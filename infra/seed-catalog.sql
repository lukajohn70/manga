-- Seed Manga E-Commerce Marketplace Catalog & Vendors
-- Standard top-tier marketplace products with verified vendors, stock levels, and buybox offers

DO $$
DECLARE
  v_user_buyer UUID;
  v_user_v1 UUID;
  v_user_v2 UUID;
  v_user_v3 UUID;
  v_user_v4 UUID;
  v_user_v5 UUID;
  
  v_vnd_sony UUID;
  v_vnd_samsung UUID;
  v_vnd_apple UUID;
  v_vnd_delonghi UUID;
  v_vnd_manga UUID;
  
  v_wh_sony UUID;
  v_wh_samsung UUID;
  v_wh_apple UUID;
  v_wh_delonghi UUID;
  v_wh_manga UUID;

  v_cat_comp UUID;
  v_cat_elec UUID;
  v_cat_fash UUID;
  v_cat_home UUID;
  v_cat_digi UUID;

  v_prod_sony UUID;
  v_var_sony UUID;
  v_off_sony UUID;

  v_prod_s24 UUID;
  v_var_s24 UUID;
  v_off_s24 UUID;

  v_prod_delonghi UUID;
  v_var_delonghi UUID;
  v_off_delonghi UUID;

  v_prod_macbook UUID;
  v_var_macbook UUID;
  v_off_macbook UUID;

  v_prod_rucksack UUID;
  v_var_rucksack UUID;
  v_off_rucksack UUID;

  v_prod_figma UUID;
  v_var_figma UUID;
  v_off_figma UUID;
BEGIN
  -- 1. Users
  INSERT INTO identity.users (id, email, phone, role, password_hash, status)
  VALUES 
    ('11111111-1111-1111-1111-111111111111', 'buyer@manga.ng', '+2348011111111', 'buyer', 'hash', 'active')
  ON CONFLICT (email) DO NOTHING;

  INSERT INTO identity.users (id, email, phone, role, password_hash, status)
  VALUES 
    ('22222222-2222-2222-2222-222222222221', 'sony@manga.ng', '+2348022222221', 'vendor_admin', 'hash', 'active'),
    ('22222222-2222-2222-2222-222222222222', 'samsung@manga.ng', '+2348022222222', 'vendor_admin', 'hash', 'active'),
    ('22222222-2222-2222-2222-222222222223', 'apple@manga.ng', '+2348022222223', 'vendor_admin', 'hash', 'active'),
    ('22222222-2222-2222-2222-222222222224', 'delonghi@manga.ng', '+2348022222224', 'vendor_admin', 'hash', 'active'),
    ('22222222-2222-2222-2222-222222222225', 'crafts@manga.ng', '+2348022222225', 'vendor_admin', 'hash', 'active')
  ON CONFLICT (email) DO NOTHING;

  -- 2. Vendors
  INSERT INTO vendor.vendors (id, user_id, business_name, legal_entity_type, tier, status, kyc_status)
  VALUES
    ('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222221', 'Sony Audio Official Store', 'LLC', 'tier_1', 'active', 'verified'),
    ('33333333-3333-3333-3333-333333333332', '22222222-2222-2222-2222-222222222222', 'Samsung Nigeria Official', 'LLC', 'tier_1', 'active', 'verified'),
    ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222223', 'Apple Authorized Nigeria', 'LLC', 'tier_1', 'active', 'verified'),
    ('33333333-3333-3333-3333-333333333334', '22222222-2222-2222-2222-222222222224', 'De''Longhi Official Store', 'LLC', 'tier_1', 'active', 'verified'),
    ('33333333-3333-3333-3333-333333333335', '22222222-2222-2222-2222-222222222225', 'Manga Signature Workshop', 'LLC', 'tier_2', 'active', 'verified')
  ON CONFLICT DO NOTHING;

  -- 3. Warehouses
  INSERT INTO vendor.warehouses (id, vendor_id, code, name, address, is_primary)
  VALUES
    ('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333331', 'WH-SONY-LAGOS', 'Sony Ikeja Fulfillment Center', '{"city": "Ikeja", "state": "Lagos", "country": "NG"}', TRUE),
    ('44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333332', 'WH-SAM-VI', 'Samsung Victoria Island Depot', '{"city": "Victoria Island", "state": "Lagos", "country": "NG"}', TRUE),
    ('44444444-4444-4444-4444-444444444443', '33333333-3333-3333-3333-333333333333', 'WH-APL-IKJ', 'Apple Authorized Ikeja Depot', '{"city": "Ikeja", "state": "Lagos", "country": "NG"}', TRUE),
    ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333334', 'WH-DEL-LEK', 'De''Longhi Lekki Hub', '{"city": "Lekki", "state": "Lagos", "country": "NG"}', TRUE),
    ('44444444-4444-4444-4444-444444444445', '33333333-3333-3333-3333-333333333335', 'WH-MNG-KN', 'Manga Kano Workshop Depot', '{"city": "Kano", "state": "Kano", "country": "NG"}', TRUE)
  ON CONFLICT DO NOTHING;

  -- 4. Categories
  INSERT INTO catalog.categories (id, slug, name, icon_url)
  VALUES
    ('55555555-5555-5555-5555-555555555551', 'computing', 'Phones & Computing', 'fa-laptop'),
    ('55555555-5555-5555-5555-555555555552', 'electronics', 'Electronics & Audio', 'fa-headphones'),
    ('55555555-5555-5555-5555-555555555553', 'fashion', 'Fashion & Streetwear', 'fa-shirt'),
    ('55555555-5555-5555-5555-555555555554', 'home', 'Home & Appliances', 'fa-couch'),
    ('55555555-5555-5555-5555-555555555555', 'digital', 'Software & Digital Assets', 'fa-code')
  ON CONFLICT (slug) DO NOTHING;

  -- 5. Master Products
  -- Sony WH-1000XM5
  INSERT INTO catalog.master_products (id, brand_name, title, description, category_id, status, attributes)
  VALUES (
    '66666666-6666-6666-6666-666666666661',
    'Sony',
    'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    'Industry-leading noise cancellation optimized with two processors and 8 microphones. Up to 30-hour battery life with fast charging.',
    '55555555-5555-5555-5555-555555555552',
    'published',
    '{"color": "Black", "battery_hours": 30, "warranty": "1 Year Official Sony Nigeria Warranty"}'
  ) ON CONFLICT DO NOTHING;

  INSERT INTO catalog.variants (id, master_product_id, sku_canonical, option_values, weight_g, dims_mm)
  VALUES (
    '77777777-7777-7777-7777-777777777771',
    '66666666-6666-6666-6666-666666666661',
    'SONY-WH1000XM5-BLK',
    '{"Color": "Black"}',
    250,
    '{"length": 220, "width": 180, "height": 60}'
  ) ON CONFLICT (sku_canonical) DO NOTHING;

  INSERT INTO offers.offers (id, vendor_id, variant_id, condition, price_minor, currency, compare_at_minor, shipping_profile_id, policy_template_id, status)
  VALUES (
    '88888888-8888-8888-8888-888888888881',
    '33333333-3333-3333-3333-333333333331',
    '77777777-7777-7777-7777-777777777771',
    'new',
    45000000, -- 450,000 NGN in minor units
    'NGN',
    58000000,
    gen_random_uuid(),
    gen_random_uuid(),
    'active'
  ) ON CONFLICT DO NOTHING;

  INSERT INTO offers.buybox_scores (variant_id, winning_offer_id, score)
  VALUES ('77777777-7777-7777-7777-777777777771', '88888888-8888-8888-8888-888888888881', 98.50)
  ON CONFLICT (variant_id) DO UPDATE SET score = EXCLUDED.score;

  INSERT INTO inventory.stock_levels (variant_id, warehouse_id, on_hand, reserved, safety_stock)
  VALUES ('77777777-7777-7777-7777-777777777771', '44444444-4444-4444-4444-444444444441', 45, 0, 5)
  ON CONFLICT (variant_id, warehouse_id) DO UPDATE SET on_hand = 45;

  -- Samsung Galaxy S24 Ultra
  INSERT INTO catalog.master_products (id, brand_name, title, description, category_id, status, attributes)
  VALUES (
    '66666666-6666-6666-6666-666666666662',
    'Samsung',
    'Samsung Galaxy S24 Ultra 512GB Titanium Black with S-Pen & AI',
    'Equipped with Snapdragon 8 Gen 3 for Galaxy, titanium frame, 200MP camera system with ProVisual Engine, and built-in Galaxy AI.',
    '55555555-5555-5555-5555-555555555551',
    'published',
    '{"storage": "512GB", "color": "Titanium Black", "ram": "12GB"}'
  ) ON CONFLICT DO NOTHING;

  INSERT INTO catalog.variants (id, master_product_id, sku_canonical, option_values, weight_g, dims_mm)
  VALUES (
    '77777777-7777-7777-7777-777777777772',
    '66666666-6666-6666-6666-666666666662',
    'SAM-S24U-512-BLK',
    '{"Color": "Titanium Black", "Storage": "512GB"}',
    232,
    '{"length": 162, "width": 79, "height": 8.6}'
  ) ON CONFLICT (sku_canonical) DO NOTHING;

  INSERT INTO offers.offers (id, vendor_id, variant_id, condition, price_minor, currency, compare_at_minor, shipping_profile_id, policy_template_id, status)
  VALUES (
    '88888888-8888-8888-8888-888888888882',
    '33333333-3333-3333-3333-333333333332',
    '77777777-7777-7777-7777-777777777772',
    'new',
    185000000, -- 1,850,000 NGN
    'NGN',
    210000000,
    gen_random_uuid(),
    gen_random_uuid(),
    'active'
  ) ON CONFLICT DO NOTHING;

  INSERT INTO offers.buybox_scores (variant_id, winning_offer_id, score)
  VALUES ('77777777-7777-7777-7777-777777777772', '88888888-8888-8888-8888-888888888882', 99.00)
  ON CONFLICT (variant_id) DO UPDATE SET score = EXCLUDED.score;

  INSERT INTO inventory.stock_levels (variant_id, warehouse_id, on_hand, reserved, safety_stock)
  VALUES ('77777777-7777-7777-7777-777777777772', '44444444-4444-4444-4444-444444444442', 28, 0, 3)
  ON CONFLICT (variant_id, warehouse_id) DO UPDATE SET on_hand = 28;

  -- Apple MacBook Air 15 M3
  INSERT INTO catalog.master_products (id, brand_name, title, description, category_id, status, attributes)
  VALUES (
    '66666666-6666-6666-6666-666666666663',
    'Apple',
    'Apple MacBook Air 15" M3 Chip (16GB Unified Memory, 512GB SSD Midnight)',
    'Supercharged by Apple M3 8-core CPU and 10-core GPU. Liquid Retina display with 500 nits brightness and MagSafe 3 charging.',
    '55555555-5555-5555-5555-555555555551',
    'published',
    '{"cpu": "Apple M3", "ram": "16GB", "ssd": "512GB", "color": "Midnight"}'
  ) ON CONFLICT DO NOTHING;

  INSERT INTO catalog.variants (id, master_product_id, sku_canonical, option_values, weight_g, dims_mm)
  VALUES (
    '77777777-7777-7777-7777-777777777773',
    '66666666-6666-6666-6666-666666666663',
    'APL-MBA15-M3-16-512',
    '{"Color": "Midnight", "RAM": "16GB", "SSD": "512GB"}',
    1510,
    '{"length": 340, "width": 237, "height": 11.5}'
  ) ON CONFLICT (sku_canonical) DO NOTHING;

  INSERT INTO offers.offers (id, vendor_id, variant_id, condition, price_minor, currency, compare_at_minor, shipping_profile_id, policy_template_id, status)
  VALUES (
    '88888888-8888-8888-8888-888888888883',
    '33333333-3333-3333-3333-333333333333',
    '77777777-7777-7777-7777-777777777773',
    'new',
    210000000, -- 2,100,000 NGN
    'NGN',
    235000000,
    gen_random_uuid(),
    gen_random_uuid(),
    'active'
  ) ON CONFLICT DO NOTHING;

  INSERT INTO offers.buybox_scores (variant_id, winning_offer_id, score)
  VALUES ('77777777-7777-7777-7777-777777777773', '88888888-8888-8888-8888-888888888883', 97.80)
  ON CONFLICT (variant_id) DO UPDATE SET score = EXCLUDED.score;

  INSERT INTO inventory.stock_levels (variant_id, warehouse_id, on_hand, reserved, safety_stock)
  VALUES ('77777777-7777-7777-7777-777777777773', '44444444-4444-4444-4444-444444444443', 14, 0, 2)
  ON CONFLICT (variant_id, warehouse_id) DO UPDATE SET on_hand = 14;

  -- De'Longhi Dedica
  INSERT INTO catalog.master_products (id, brand_name, title, description, category_id, status, attributes)
  VALUES (
    '66666666-6666-6666-6666-666666666664',
    'De''Longhi',
    'De''Longhi Dedica Deluxe Slim Espresso & Cappuccino Pump Machine',
    'Premium 15-bar professional pressure with manual Cappuccino System for thick barista milk foam. Compact 6-inch slim stainless design.',
    '55555555-5555-5555-5555-555555555554',
    'published',
    '{"pressure": "15 bar", "material": "Stainless Steel"}'
  ) ON CONFLICT DO NOTHING;

  INSERT INTO catalog.variants (id, master_product_id, sku_canonical, option_values, weight_g, dims_mm)
  VALUES (
    '77777777-7777-7777-7777-777777777774',
    '66666666-6666-6666-6666-666666666664',
    'DEL-DEDICA-SLIM',
    '{"Color": "Metallic Steel"}',
    4200,
    '{"length": 330, "width": 149, "height": 303}'
  ) ON CONFLICT (sku_canonical) DO NOTHING;

  INSERT INTO offers.offers (id, vendor_id, variant_id, condition, price_minor, currency, compare_at_minor, shipping_profile_id, policy_template_id, status)
  VALUES (
    '88888888-8888-8888-8888-888888888884',
    '33333333-3333-3333-3333-333333333334',
    '77777777-7777-7777-7777-777777777774',
    'new',
    32000000, -- 320,000 NGN
    'NGN',
    39000000,
    gen_random_uuid(),
    gen_random_uuid(),
    'active'
  ) ON CONFLICT DO NOTHING;

  INSERT INTO offers.buybox_scores (variant_id, winning_offer_id, score)
  VALUES ('77777777-7777-7777-7777-777777777774', '88888888-8888-8888-8888-888888888884', 96.00)
  ON CONFLICT (variant_id) DO UPDATE SET score = EXCLUDED.score;

  INSERT INTO inventory.stock_levels (variant_id, warehouse_id, on_hand, reserved, safety_stock)
  VALUES ('77777777-7777-7777-7777-777777777774', '44444444-4444-4444-4444-444444444444', 35, 0, 4)
  ON CONFLICT (variant_id, warehouse_id) DO UPDATE SET on_hand = 35;

  -- Handcrafted Kano Leather Travel Rucksack
  INSERT INTO catalog.master_products (id, brand_name, title, description, category_id, status, attributes)
  VALUES (
    '66666666-6666-6666-6666-666666666665',
    'Manga Signature',
    'Handcrafted Kano Vegetable-Tanned Leather Travel Rucksack',
    'Vegetable-tanned full-grain cowhide from historic Kano tanneries with solid antique brass hardware and reinforced padded laptop sleeve.',
    '55555555-5555-5555-5555-555555555553',
    'published',
    '{"material": "Vegetable Tanned Leather", "origin": "Kano, Nigeria", "capacity": "25L"}'
  ) ON CONFLICT DO NOTHING;

  INSERT INTO catalog.variants (id, master_product_id, sku_canonical, option_values, weight_g, dims_mm)
  VALUES (
    '77777777-7777-7777-7777-777777777775',
    '66666666-6666-6666-6666-666666666665',
    'MNG-KANO-BAG-BRN',
    '{"Color": "Laterite Brown"}',
    1200,
    '{"length": 450, "width": 300, "height": 160}'
  ) ON CONFLICT (sku_canonical) DO NOTHING;

  INSERT INTO offers.offers (id, vendor_id, variant_id, condition, price_minor, currency, compare_at_minor, shipping_profile_id, policy_template_id, status)
  VALUES (
    '88888888-8888-8888-8888-888888888885',
    '33333333-3333-3333-3333-333333333335',
    '77777777-7777-7777-7777-777777777775',
    'new',
    16500000, -- 165,000 NGN
    'NGN',
    21000000,
    gen_random_uuid(),
    gen_random_uuid(),
    'active'
  ) ON CONFLICT DO NOTHING;

  INSERT INTO offers.buybox_scores (variant_id, winning_offer_id, score)
  VALUES ('77777777-7777-7777-7777-777777777775', '88888888-8888-8888-8888-888888888885', 99.50)
  ON CONFLICT (variant_id) DO UPDATE SET score = EXCLUDED.score;

  INSERT INTO inventory.stock_levels (variant_id, warehouse_id, on_hand, reserved, safety_stock)
  VALUES ('77777777-7777-7777-7777-777777777775', '44444444-4444-4444-4444-444444444445', 18, 0, 2)
  ON CONFLICT (variant_id, warehouse_id) DO UPDATE SET on_hand = 18;

  -- SaaS UI Design System & Figma Pro Kit
  INSERT INTO catalog.master_products (id, brand_name, title, description, category_id, status, attributes)
  VALUES (
    '66666666-6666-6666-6666-666666666666',
    'DesignCraft',
    'SaaS UI Design System & Figma Pro Kit (400+ Components & Tokens)',
    'Production Figma components, interactive variants, color tokens, and complete responsive dashboard layouts for modern SaaS web applications.',
    '55555555-5555-5555-5555-555555555555',
    'published',
    '{"type": "digital", "license": "Commercial Lifetime", "delivery": "Instant Download"}'
  ) ON CONFLICT DO NOTHING;

  INSERT INTO catalog.variants (id, master_product_id, sku_canonical, option_values, weight_g, dims_mm)
  VALUES (
    '77777777-7777-7777-7777-777777777776',
    '66666666-6666-6666-6666-666666666666',
    'DIGI-FIGMA-SAAS-PRO',
    '{"License": "Commercial Single-Developer"}',
    0,
    '{"length": 0, "width": 0, "height": 0}'
  ) ON CONFLICT (sku_canonical) DO NOTHING;

  INSERT INTO offers.offers (id, vendor_id, variant_id, condition, price_minor, currency, compare_at_minor, shipping_profile_id, policy_template_id, status)
  VALUES (
    '88888888-8888-8888-8888-888888888886',
    '33333333-3333-3333-3333-333333333335',
    '77777777-7777-7777-7777-777777777776',
    'new',
    4500000, -- 45,000 NGN
    'NGN',
    7000000,
    gen_random_uuid(),
    gen_random_uuid(),
    'active'
  ) ON CONFLICT DO NOTHING;

  INSERT INTO offers.buybox_scores (variant_id, winning_offer_id, score)
  VALUES ('77777777-7777-7777-7777-777777777776', '88888888-8888-8888-8888-888888888886', 100.00)
  ON CONFLICT (variant_id) DO UPDATE SET score = EXCLUDED.score;

  INSERT INTO inventory.stock_levels (variant_id, warehouse_id, on_hand, reserved, safety_stock)
  VALUES ('77777777-7777-7777-7777-777777777776', '44444444-4444-4444-4444-444444444445', 9999, 0, 0)
  ON CONFLICT (variant_id, warehouse_id) DO UPDATE SET on_hand = 9999;

END $$;
