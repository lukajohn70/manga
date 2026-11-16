-- Manga Database Initialization
-- Strict schema-per-module boundary (ADR 001)

CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS vendor;
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS offers;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS cart;
CREATE SCHEMA IF NOT EXISTS orders;
CREATE SCHEMA IF NOT EXISTS shipping;
CREATE SCHEMA IF NOT EXISTS returns;
CREATE SCHEMA IF NOT EXISTS payments;
CREATE SCHEMA IF NOT EXISTS ledger;
CREATE SCHEMA IF NOT EXISTS payouts;
CREATE SCHEMA IF NOT EXISTS config;
CREATE SCHEMA IF NOT EXISTS trust;
CREATE SCHEMA IF NOT EXISTS outbox;

-- Transactional Outbox Table
CREATE TABLE IF NOT EXISTS outbox.events (
    id UUID PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    aggregate_type VARCHAR(64) NOT NULL,
    aggregate_id VARCHAR(64) NOT NULL,
    correlation_id VARCHAR(128) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Core Double-entry Ledger Tables
CREATE TABLE IF NOT EXISTS ledger.accounts (
    id UUID PRIMARY KEY,
    type VARCHAR(64) NOT NULL,
    owner_type VARCHAR(64) NOT NULL,
    owner_id VARCHAR(64) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ledger.transactions (
    id UUID PRIMARY KEY,
    ref_type VARCHAR(64) NOT NULL,
    ref_id VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    idempotency_key VARCHAR(128) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS ledger.entries (
    id UUID PRIMARY KEY,
    transaction_id UUID NOT NULL REFERENCES ledger.transactions(id),
    account_id UUID NOT NULL REFERENCES ledger.accounts(id),
    direction CHAR(1) NOT NULL CHECK (direction IN ('D', 'C')),
    amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
    currency VARCHAR(3) NOT NULL
);

-- Core Inventory Tables
CREATE TABLE IF NOT EXISTS inventory.stock_levels (
    variant_id UUID NOT NULL,
    warehouse_id UUID NOT NULL,
    on_hand INT NOT NULL DEFAULT 0 CHECK (on_hand >= 0),
    reserved INT NOT NULL DEFAULT 0 CHECK (reserved >= 0),
    safety_stock INT NOT NULL DEFAULT 0 CHECK (safety_stock >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (variant_id, warehouse_id)
);

CREATE TABLE IF NOT EXISTS inventory.reservations (
    id UUID PRIMARY KEY,
    order_ref VARCHAR(128) NOT NULL,
    variant_id UUID NOT NULL,
    warehouse_id UUID NOT NULL,
    qty INT NOT NULL CHECK (qty > 0),
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
