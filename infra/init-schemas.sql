-- Manga Database Schema Definition (PostgreSQL 16+)
-- Modular Monolith Multi-Schema Isolation (ADR 001)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schemas
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS vendor;
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS offers;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS cart;
CREATE SCHEMA IF NOT EXISTS orders;
CREATE SCHEMA IF NOT EXISTS shipping;
CREATE SCHEMA IF NOT EXISTS returns;
CREATE SCHEMA IF NOT EXISTS disputes;
CREATE SCHEMA IF NOT EXISTS payments;
CREATE SCHEMA IF NOT EXISTS ledger;
CREATE SCHEMA IF NOT EXISTS payouts;
CREATE SCHEMA IF NOT EXISTS config;
CREATE SCHEMA IF NOT EXISTS trust;
CREATE SCHEMA IF NOT EXISTS outbox;
CREATE SCHEMA IF NOT EXISTS notifications;

-- ========================================================
-- 1. IDENTITY & ACCESS
-- ========================================================
CREATE TABLE IF NOT EXISTS identity.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32) UNIQUE,
    role VARCHAR(32) NOT NULL DEFAULT 'buyer', -- 'buyer', 'vendor_admin', 'vendor_staff', 'admin'
    password_hash VARCHAR(255) NOT NULL,
    mfa_secret VARCHAR(255),
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS identity.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,
    device_info JSONB,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================
-- 2. VENDOR MANAGEMENT
-- ========================================================
CREATE TABLE IF NOT EXISTS vendor.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES identity.users(id),
    business_name VARCHAR(255) NOT NULL,
    legal_entity_type VARCHAR(64) NOT NULL,
    tier VARCHAR(32) NOT NULL DEFAULT 'tier_1', -- 'tier_1', 'tier_2', 'tier_3'
    status VARCHAR(32) NOT NULL DEFAULT 'pending_verification', -- 'pending_verification', 'active', 'suspended'
    kyc_status VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    kyc_reference VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendor.warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendor.vendors(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address JSONB NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (vendor_id, code)
);

-- ========================================================
-- 3. CATALOG & ATTRIBUTES
-- ========================================================
CREATE TABLE IF NOT EXISTS catalog.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES catalog.categories(id),
    slug VARCHAR(128) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    icon_url TEXT
);

CREATE TABLE IF NOT EXISTS catalog.attribute_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES catalog.categories(id),
    key VARCHAR(64) NOT NULL,
    type VARCHAR(32) NOT NULL, -- 'string', 'number', 'boolean', 'enum'
    constraints JSONB,
    facetable BOOLEAN NOT NULL DEFAULT FALSE,
    required BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (category_id, key)
);

CREATE TABLE IF NOT EXISTS catalog.master_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name VARCHAR(128),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    gtin VARCHAR(64),
    category_id UUID NOT NULL REFERENCES catalog.categories(id),
    status VARCHAR(32) NOT NULL DEFAULT 'draft', -- 'draft', 'pending_moderation', 'published', 'rejected'
    attributes JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS catalog.variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_product_id UUID NOT NULL REFERENCES catalog.master_products(id) ON DELETE CASCADE,
    sku_canonical VARCHAR(64) UNIQUE NOT NULL,
    option_values JSONB NOT NULL DEFAULT '{}',
    gtin VARCHAR(64),
    weight_g INT NOT NULL,
    dims_mm JSONB,
    hs_code VARCHAR(32)
);

-- ========================================================
-- 4. OFFERS & PRICING
-- ========================================================
CREATE TABLE IF NOT EXISTS offers.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendor.vendors(id),
    variant_id UUID NOT NULL REFERENCES catalog.variants(id),
    condition VARCHAR(32) NOT NULL, -- 'new', 'refurbished_excellent', 'refurbished_good', 'used'
    price_minor BIGINT NOT NULL CHECK (price_minor > 0),
    currency VARCHAR(3) NOT NULL,
    compare_at_minor BIGINT,
    handling_time_hours INT NOT NULL DEFAULT 24,
    shipping_profile_id UUID NOT NULL,
    policy_template_id UUID NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active', -- 'active', 'paused', 'suspended'
    version INT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS offers.buybox_scores (
    variant_id UUID PRIMARY KEY REFERENCES catalog.variants(id) ON DELETE CASCADE,
    winning_offer_id UUID NOT NULL REFERENCES offers.offers(id),
    score NUMERIC(5, 2) NOT NULL,
    computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================
-- 5. INVENTORY
-- ========================================================
CREATE TABLE IF NOT EXISTS inventory.stock_levels (
    variant_id UUID NOT NULL REFERENCES catalog.variants(id),
    warehouse_id UUID NOT NULL REFERENCES vendor.warehouses(id),
    on_hand INT NOT NULL DEFAULT 0 CHECK (on_hand >= 0),
    reserved INT NOT NULL DEFAULT 0 CHECK (reserved >= 0),
    safety_stock INT NOT NULL DEFAULT 0 CHECK (safety_stock >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (variant_id, warehouse_id)
);

CREATE TABLE IF NOT EXISTS inventory.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_ref VARCHAR(128) NOT NULL,
    variant_id UUID NOT NULL REFERENCES catalog.variants(id),
    warehouse_id UUID NOT NULL REFERENCES vendor.warehouses(id),
    qty INT NOT NULL CHECK (qty > 0),
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory.movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES catalog.variants(id),
    warehouse_id UUID NOT NULL REFERENCES vendor.warehouses(id),
    delta INT NOT NULL,
    reason VARCHAR(64) NOT NULL,
    ref_type VARCHAR(64) NOT NULL,
    ref_id VARCHAR(64) NOT NULL,
    actor VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================
-- 6. ORDERS (Parcel-Level Model)
-- ========================================================
CREATE TABLE IF NOT EXISTS orders.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(64) UNIQUE NOT NULL,
    buyer_id UUID NOT NULL REFERENCES identity.users(id),
    status VARCHAR(32) NOT NULL DEFAULT 'pending_payment',
    currency VARCHAR(3) NOT NULL,
    totals JSONB NOT NULL,
    address_snapshot JSONB NOT NULL,
    tax_snapshot JSONB NOT NULL,
    placed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    idempotency_key VARCHAR(128) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS orders.shipment_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders.orders(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendor.vendors(id),
    fulfillment_mode VARCHAR(32) NOT NULL DEFAULT 'vendor_fulfilled',
    status VARCHAR(32) NOT NULL DEFAULT 'pending_vendor_accept',
    promise_range TSTZRANGE,
    shipping_method VARCHAR(64) NOT NULL,
    shipping_fee_minor BIGINT NOT NULL DEFAULT 0,
    sla_deadlines JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS orders.order_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders.orders(id) ON DELETE CASCADE,
    shipment_group_id UUID NOT NULL REFERENCES orders.shipment_groups(id) ON DELETE CASCADE,
    offer_id UUID NOT NULL REFERENCES offers.offers(id),
    variant_id UUID NOT NULL REFERENCES catalog.variants(id),
    vendor_id UUID NOT NULL REFERENCES vendor.vendors(id),
    qty INT NOT NULL CHECK (qty > 0),
    unit_price_minor BIGINT NOT NULL,
    discount_minor BIGINT NOT NULL DEFAULT 0,
    tax_minor BIGINT NOT NULL DEFAULT 0,
    commission_snapshot JSONB NOT NULL,
    policy_snapshot JSONB NOT NULL,
    title_snapshot TEXT NOT NULL,
    image_snapshot TEXT
);

CREATE TABLE IF NOT EXISTS orders.order_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders.orders(id) ON DELETE CASCADE,
    shipment_group_id UUID REFERENCES orders.shipment_groups(id),
    type VARCHAR(64) NOT NULL,
    actor VARCHAR(128) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================
-- 7. SHIPPING & TRACKING
-- ========================================================
CREATE TABLE IF NOT EXISTS shipping.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_group_id UUID NOT NULL REFERENCES orders.shipment_groups(id),
    carrier_id VARCHAR(64) NOT NULL,
    service_code VARCHAR(64) NOT NULL,
    tracking_number VARCHAR(128) NOT NULL,
    label_url TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'label_created',
    cost_minor BIGINT NOT NULL DEFAULT 0,
    weight_g INT NOT NULL,
    pickup_ref VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipping.parcels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID NOT NULL REFERENCES shipping.shipments(id) ON DELETE CASCADE,
    dims_mm JSONB,
    weight_g INT NOT NULL,
    items JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS shipping.tracking_events_raw (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carrier_id VARCHAR(64) NOT NULL,
    tracking_number VARCHAR(128) NOT NULL,
    payload JSONB NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    signature_ok BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS shipping.tracking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID NOT NULL REFERENCES shipping.shipments(id) ON DELETE CASCADE,
    status_canonical VARCHAR(64) NOT NULL,
    carrier_status VARCHAR(64) NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL,
    location JSONB,
    source_event_id VARCHAR(128) NOT NULL,
    seq INT NOT NULL,
    UNIQUE (shipment_id, source_event_id)
);

-- ========================================================
-- 8. PAYMENTS & DOUBLE-ENTRY LEDGER
-- ========================================================
CREATE TABLE IF NOT EXISTS payments.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders.orders(id),
    method VARCHAR(32) NOT NULL,
    psp VARCHAR(64) NOT NULL,
    psp_ref VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL,
    amount_minor BIGINT NOT NULL,
    currency VARCHAR(3) NOT NULL,
    authorized_at TIMESTAMPTZ,
    captured_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments.refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES payments.payments(id),
    return_id UUID,
    amount_minor BIGINT NOT NULL,
    status VARCHAR(32) NOT NULL,
    psp_ref VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ledger.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(64) NOT NULL,
    owner_type VARCHAR(64) NOT NULL,
    owner_id VARCHAR(64) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ledger.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ref_type VARCHAR(64) NOT NULL,
    ref_id VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    idempotency_key VARCHAR(128) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS ledger.entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES ledger.transactions(id),
    account_id UUID NOT NULL REFERENCES ledger.accounts(id),
    direction CHAR(1) NOT NULL CHECK (direction IN ('D', 'C')),
    amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
    currency VARCHAR(3) NOT NULL
);

-- ========================================================
-- 9. RETURNS & DISPUTES
-- ========================================================
CREATE TABLE IF NOT EXISTS returns.return_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders.orders(id),
    shipment_group_id UUID NOT NULL REFERENCES orders.shipment_groups(id),
    status VARCHAR(32) NOT NULL DEFAULT 'requested',
    reason_code VARCHAR(64) NOT NULL,
    resolution_requested VARCHAR(32) NOT NULL,
    risk_score INT NOT NULL DEFAULT 0,
    policy_snapshot JSONB NOT NULL,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS returns.return_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    return_request_id UUID NOT NULL REFERENCES returns.return_requests(id) ON DELETE CASCADE,
    order_line_id UUID NOT NULL REFERENCES orders.order_lines(id),
    qty INT NOT NULL CHECK (qty > 0),
    condition_claimed VARCHAR(64) NOT NULL,
    condition_graded VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS disputes.cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(64) NOT NULL,
    order_id UUID NOT NULL REFERENCES orders.orders(id),
    shipment_group_id UUID NOT NULL REFERENCES orders.shipment_groups(id),
    opened_by VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'opened',
    deadline_at TIMESTAMPTZ NOT NULL,
    outcome TEXT,
    ledger_tx_id UUID REFERENCES ledger.transactions(id)
);

CREATE TABLE IF NOT EXISTS disputes.evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES disputes.cases(id) ON DELETE CASCADE,
    party VARCHAR(32) NOT NULL, -- 'buyer', 'vendor', 'carrier', 'platform'
    kind VARCHAR(32) NOT NULL, -- 'photo', 'video', 'document', 'message_transcript'
    uri TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================
-- 10. TRANSACTIONAL OUTBOX
-- ========================================================
CREATE TABLE IF NOT EXISTS outbox.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    aggregate_type VARCHAR(64) NOT NULL,
    aggregate_id VARCHAR(64) NOT NULL,
    correlation_id VARCHAR(128) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================
-- 11. NOTIFICATIONS & DEVICE REGISTRY (§11)
-- ========================================================
CREATE TABLE IF NOT EXISTS notifications.device_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
    device_id VARCHAR(128) NOT NULL,
    platform VARCHAR(32) NOT NULL, -- 'web', 'ios', 'android'
    push_token TEXT NOT NULL,
    app_version VARCHAR(32),
    locale VARCHAR(16) NOT NULL DEFAULT 'en-NG',
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, device_id)
);

CREATE TABLE IF NOT EXISTS notifications.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
    channel VARCHAR(32) NOT NULL, -- 'email', 'sms', 'whatsapp', 'push'
    category VARCHAR(64) NOT NULL, -- 'order_updates', 'promotions', 'security_alerts'
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, channel, category)
);

CREATE TABLE IF NOT EXISTS notifications.dispatched_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    channel VARCHAR(32) NOT NULL,
    template_id VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'delivered',
    provider_receipt_ref VARCHAR(128),
    error_message TEXT,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (event_id, recipient, channel) -- Strict Delivery Idempotency (§11)
);
