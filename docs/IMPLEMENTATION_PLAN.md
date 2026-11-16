# Manga Platform: Implementation & Delivery Plan

**Version:** 1.0 | November 2026  
**Companion to:** [docs/TECHNICAL_DESIGN_BRIEF.md](file:///Applications/MAMP/htdocs/manga/docs/TECHNICAL_DESIGN_BRIEF.md)  
**Scope:** Phase 1 (Web, PWA, Vendor Console, Admin Console, Modular Monolith API) with explicit runway for Phase 2 (Mobile Apps).

---

## 1. Executive Summary & Delivery Principles

This implementation plan operationalizes the **Manga Technical Design Brief v1.0** into a 32-week execution schedule across 6 milestones. It defines the sprint breakdown, work streams, acceptance gates, and technical deliverables required to launch Manga's multi-vendor marketplace platform.

### Core Delivery Principles
1. **Financial & Inventory Correctness First:** Double-entry ledger invariants (\(\sum \text{Debits} = \sum \text{Credits}\)) and atomic inventory reservations are built and property-tested before UI layers.
2. **Schema-Per-Module Monolith:** Strict boundary enforcement prevents monolithic decay while avoiding distributed transaction overhead.
3. **Idempotency by Design:** Every money, order, tracking, or refund mutation accepts an `Idempotency-Key` stored for 24h+.
4. **Iterative Phase Gating:** Each milestone must meet strict definition-of-done quality gates before advancing.

---

## 2. Team Topology (12 Engineers)

| Stream | Headcount | Primary Focus Areas |
|---|---|---|
| **Core Commerce & Ledger** | 3 Engineers | Orders saga, Checkout, Payments (PSP adapters), Double-Entry Ledger, Payouts |
| **Catalog & Inventory** | 2 Engineers | Categories, Attributes, Variants, Offers, Buy-Box, Stock reservations, CSV import |
| **Logistics & Fulfilment** | 2 Engineers | Carrier adapters, Shipping labels, Tracking ingestion pipeline, Returns workflow |
| **Storefront & PWA** | 2 Engineers | Buyer Next.js app, ISR/SSR, PWA offline caching, Cart & Checkout UI |
| **Consoles (Vendor & Admin)** | 2 Engineers | Vendor SPA (pack/scan, order timers), Admin SPA (audit log, ledger explorer, repair tools) |
| **Platform / DevOps** | 1 Engineer | CI/CD pipelines, Docker/IaC, PostgreSQL HA, Redis, Observability (OTel/Sentry) |

---

## 3. Master Milestone Timeline

```
Week 01-04:  [■■■■] Milestone 0: Foundations & Architecture
Week 04-10:     [■■■■■■] Milestone 1: Catalog, Vendors & Inventory
Week 08-16:         [■■■■■■■■] Milestone 2: Checkout, Payments & Ledger
Week 14-22:               [■■■■■■■■] Milestone 3: Fulfilment, Shipping & Tracking
Week 20-28:                     [■■■■■■■■] Milestone 4: Returns, Disputes & Payouts
Week 26-32:                           [■■■■■■] Milestone 5: Hardening, Security & Beta
```

---

## 4. Detailed Milestone Breakdown

### Milestone 0: Foundations & Monorepo Setup (Weeks 1–4)
**Goal:** Establish monorepo infrastructure, shared domain models, CI/CD baseline, and database schema isolation.

- [x] **M0.1 Repository Layout:** Setup `pnpm` workspaces + Turborepo for `apps/*` and `packages/*`.
- [x] **M0.2 Core Domain Package:** Implement `MoneyUtil` (minor units), `LedgerValidator` (double-entry invariants), and domain events taxonomy in [`packages/domain`](file:///Applications/MAMP/htdocs/manga/packages/domain).
- [x] **M0.3 Shared Packages:** Validation (`@manga/validation`), design tokens (`@manga/design-tokens`), UI kit (`@manga/ui`), API client (`@manga/api-client`), i18n (`@manga/i18n`), analytics (`@manga/analytics`).
- [x] **M0.4 Database Schema Scaffolding:** Create `infra/init-schemas.sql` establishing schema-per-module isolation (`identity`, `vendor`, `catalog`, `offers`, `inventory`, `orders`, `shipping`, `returns`, `ledger`, `outbox`).
- [x] **M0.5 Local Container Environment:** Configure `infra/docker-compose.yml` (PostgreSQL 16, Redis 7).
- [x] **M0.6 Property-Based Invariant Verification:** Setup `vitest` + `fast-check` proving ledger balance rules over 2,000 iterations.
- [x] **M0.7 Architectural Decision Records:** Author initial ADRs 001 and 003 in [`docs/adr/`](file:///Applications/MAMP/htdocs/manga/docs/adr).

---

### Milestone 1: Catalog, Vendors & Inventory (Weeks 4–10)
**Goal:** Enable vendor onboarding, category taxonomy, variant management, pricing offers, and oversell-proof inventory.

- [x] **M1.1 Vendor Lifecycle & KYC:**
  - Implement `VendorService` with tiers (`tier_1`–`tier_3`) and status transitions.
  - Pluggable `KycProvider` interface with automated sandbox verification.
  - Vendor warehouse registry with PostgreSQL Row-Level Security (`SET LOCAL app.vendor_id = :id`).
- [x] **M1.2 Catalog & Dynamic Attributes:**
  - Category hierarchy and attribute definitions with type validation (`string`, `number`, `boolean`, `enum`).
  - Master product creation with validation rejecting missing required attributes.
  - Moderation pipeline (`pending_moderation` \(\rightarrow\) `published`) emitting `product.published` outbox events.
- [x] **M1.3 Multi-Vendor Offers & Buy-Box Engine:**
  - Variant offer management with condition grading and handling time.
  - Optimistic concurrency control using version locking (`UPDATE ... WHERE version = :expected`).
  - Buy-Box scoring algorithm factoring in price, handling speed, and vendor tier.
- [x] **M1.4 Atomic Inventory & Oversell Prevention:**
  - Single-statement atomic reservations: `(on_hand - reserved - safety_stock) >= qty`.
  - Expiry sweeper job for unconfirmed reservations.
  - Append-only audit movements in `inventory.movements`.
- [x] **M1.5 Bulk CSV/XLSX Import Engine:**
  - Asynchronous import job supporting dry-run validation, row-by-row error reporting, and atomic batch intake.
- [x] **M1.6 Storefront Browse & PDP APIs:**
  - `/v1/search` with facet filters and `/v1/products/:id` with Buy-Box winner and delivery promise.

---

### Milestone 2: Cart, Checkout, Payments & Double-Entry Ledger (Weeks 8–16)
**Goal:** Implement resilient multi-vendor cart checkout, PSP payment orchestration, and immutable ledger capture.

- [x] **M2.1 Multi-Vendor Checkout Saga:**
  - Parcel-level order model grouping items into `ShipmentGroup` containers by vendor.
  - Frozen price snapshots, 7.5% VAT tax snapshots, and dynamic commission snapshots (500 bps = 5%).
  - All-or-nothing atomic stock reservation with compensation on payment failure.
- [x] **M2.2 Payment Orchestration Layer:**
  - `PaymentProvider` interface (`createIntent`, `capture`, `refund`).
  - Card PSP adapter with 3DS simulation and Bank Transfer virtual account adapter.
- [x] **M2.3 Idempotency Enforcement:**
  - Request hashing and `Idempotency-Key` header storage returning original order on duplicates.
- [x] **M2.4 Double-Entry Ledger Posting Rules:**
  - **Capture Posting:** Debit `psp_clearing` / Credit `buyer_funds_held` (gross).
  - Mathematical balance verification: \(\sum \text{Debits} = \sum \text{Credits}\).
- [ ] **M2.5 Notifications Fan-Out:**
  - Email and SMS order confirmation worker via transactional outbox events.

---

### Milestone 3: Fulfilment, Shipping & Tracking (Weeks 14–22)
**Goal:** Vendor packing workflows, automated label generation, and real-time tracking ingestion pipeline.

- [x] **M3.1 Shipment Group State Machine:**
  - Strict guard transitions: `pending_vendor_accept` \(\rightarrow\) `accepted` \(\rightarrow\) `packing` \(\rightarrow\) `ready_to_ship` \(\rightarrow\) `shipped` \(\rightarrow\) `in_transit` \(\rightarrow\) `out_for_delivery` \(\rightarrow\) `delivered`.
- [x] **M3.2 Carrier Adapter Interface:**
  - Carrier interface (`getRates`, `createShipment`, `mapCarrierStatus`).
  - Label generation and tracking number creation.
- [x] **M3.3 Tracking Ingestion Pipeline:**
  - Webhook ingestion with scan deduplication on `(shipment_id, source_event_id)`.
  - Out-of-order event protection (ordering by occurred time).
  - Automated escrow release on `delivered` status.
- [x] **M3.4 Delivery Confirmed Ledger Posting:**
  - Debit `buyer_funds_held` / Credit `vendor_payable` (net), `platform_revenue` (commission), `tax_payable`, `shipping_payable`.
- [ ] **M3.5 Vendor Console Scanning UI:**
  - Camera barcode scanning (`BarcodeDetector`/ZXing) and PDF label printing in vendor web app.

---

### Milestone 4: Returns, Disputes & Payouts (Weeks 20–28)
**Goal:** Policy-driven return requests, inspection grading, PSP refunds, and maker-checker vendor payouts.

- [x] **M4.1 Returns Policy Engine:**
  - Return requests validated against delivery state and frozen order policy snapshot.
  - Return item tracking with condition claimed vs graded.
- [x] **M4.2 Inspection & Refund Saga:**
  - Support agent grading flow (`like_new`, `used`, `damaged`).
  - Automated PSP refund API execution.
  - Ledger refund reversal posting: debiting `vendor_payable` and `platform_revenue`, crediting `buyer_funds_held`.
- [x] **M4.3 Vendor Payouts Engine:**
  - Batch generation aggregating mature `vendor_payable` ledger balances past hold period.
  - Dual maker-checker approval workflow for finance administrators.
  - Ledger payout posting: Debit `vendor_payable` / Credit `bank`.
- [ ] **M4.4 Dispute Center UI:**
  - Evidence submission bundle and mediation interface in admin console.

---

### Milestone 5: Hardening, Security, Observability & Beta (Weeks 26–32)
**Goal:** Production hardening, fraud engine v1, admin repair tools, load testing, and vendor beta launch.

- [ ] **M5.1 Admin Operational Repair Tools:**
  - Replay failed outbox events, manually release stuck inventory reservations, re-sync tracking.
- [ ] **M5.2 Fraud & Risk Engine v1:**
  - Velocity checks on cards/devices/addresses, shadow mode scoring.
- [ ] **M5.3 Observability & Business SLOs:**
  - OpenTelemetry distributed tracing across API and workers.
  - Zero unbalanced ledger alert detector (\(\sum \text{Debits} - \sum \text{Credits} \ne 0\)).
- [ ] **M5.4 Security & Compliance Review:**
  - OWASP ASVS L2 audit, envelope encryption for PII, pen-testing.
- [ ] **M5.5 Performance & Load Testing:**
  - k6 load tests validating 5x peak throughput, flash-sale SKU contention tests.
- [ ] **M5.6 Private Beta Launch:**
  - Onboard 20–50 pilot vendors with end-to-end commerce transactions in staging and production.

---

## 5. Phase 1 Definition of Done (Release Checklist)

1. [x] Zero floating-point money math across all packages (`bigint` minor units only).
2. [x] Double-entry ledger invariant verified by property-based testing.
3. [x] Atomic inventory reservation preventing overselling under concurrent load.
4. [x] Idempotency keys enforced on all money and order mutations.
5. [x] Multi-schema database isolation running with separate schemas per module.
6. [x] End-to-end test suite passing across checkout, fulfillment, returns, and payouts.
7. [ ] Admin repair tooling live for all saga failure modes.
8. [ ] Ledger daily automated reconciliation shows 0.00 unexplained variance for 14 consecutive days.
9. [ ] Initial JS bundle budget \(\le\) 170 KB gzip on buyer storefront PDP.
10. [ ] WCAG 2.2 AA accessibility compliance verified.
