# Manga Platform: Implementation Tracker & Phase Checklist

**Document Version:** 1.0 | November 2026  
**Status Legend:**
- `[x]` **Completed & Verified** (tests passing, code committed)
- `[/]` **In Progress**
- `[ ]` **Pending / Queued**

---

## Progress Overview

| Phase / Milestone | Status | Completed / Total Tasks |
|---|---|:---:|
| **Milestone 0: Foundations & Monorepo** | **COMPLETE** | 7 / 7 (100%) |
| **Milestone 1: Catalog, Vendors & Inventory** | **COMPLETE** | 10 / 10 (100%) |
| **Milestone 2: Cart, Checkout, Payments & Ledger** | **COMPLETE** | 8 / 8 (100%) |
| **Milestone 3: Fulfilment, Shipping & Tracking** | **COMPLETE** | 8 / 8 (100%) |
| **Milestone 4: Returns, Disputes & Payouts** | **COMPLETE** | 8 / 8 (100%) |
| **Milestone 5: Hardening, Observability & Beta** | **QUEUED** | 0 / 7 (0%) |
| **Phase 2: Mobile Apps & Advanced Scale** | **PLANNED** | 0 / 7 (0%) |
| **Total Core Platform Progress** | | **41 / 55 (75%)** |

---

## Detailed Implementation Checklist

### Milestone 0: Foundations & Monorepo Setup (Weeks 1–4)
- [x] **M0.1 Monorepo Tooling:** `pnpm` workspaces + Turborepo with strict TypeScript configuration.
- [x] **M0.2 Core Domain Invariants:**
  - `MoneyUtil` in minor units using `bigint` (no floating-point money math).
  - `LedgerValidator` enforcing double-entry invariants (\(\sum \text{Debits} = \sum \text{Credits}\)).
  - Domain events taxonomy and typed payloads.
- [x] **M0.3 Shared Packages:**
  - `@manga/config` (base, Node, React tsconfigs).
  - `@manga/validation` (Zod schemas for address, money, checkout, offers).
  - `@manga/design-tokens` (color, typography, spacing tokens).
  - `@manga/ui` (reusable UI component library).
  - `@manga/api-client` (typed fetch client with RFC 9457 error handling).
  - `@manga/i18n` (localized formatters for currency and dates).
  - `@manga/analytics` (unified event taxonomy).
- [x] **M0.4 Database Schema Scaffolding:** `infra/init-schemas.sql` establishing schema-per-module isolation for all 15 bounded contexts.
- [x] **M0.5 Local Environment:** `infra/docker-compose.yml` (PostgreSQL 16 & Redis 7).
- [x] **M0.6 Property-Based Testing:** Fast-Check property test harness verifying ledger balance over 2,000 runs.
- [x] **M0.7 Architectural Decision Records:** Initial ADRs 001 and 003 authored and committed.

---

### Milestone 1: Catalog, Vendors & Inventory (Weeks 4–10)
- [x] **M1.1 Vendor Lifecycle & KYC:** `VendorService` with tiers (`tier_1`–`tier_3`), status transitions, and `MockKycProvider`.
- [x] **M1.2 Row-Level Security:** Vendor warehouse management with PostgreSQL RLS context (`SET LOCAL app.vendor_id = :id`).
- [x] **M1.3 Catalog Hierarchy & Dynamic Attributes:** Category management and attribute definitions with runtime type checks (`string`, `number`, `boolean`, `enum`) and mandatory constraints.
- [x] **M1.4 Master Products & Moderation:** Master product creation, JSONB attributes validation, and moderation pipeline emitting `product.published` outbox events.
- [x] **M1.5 Multi-Vendor Offers & Concurrency:** Variant offer management with condition grading and optimistic concurrency locking (`version` check).
- [x] **M1.6 Buy-Box Pricing Engine:** Real-time Buy-Box scoring algorithm prioritizing lowest price, handling speed, and vendor tier bonuses.
- [x] **M1.7 Atomic Stock Reservation:** Single-statement conditional reservation (`(on_hand - reserved - safety_stock) >= qty`) preventing overselling under concurrent load.
- [x] **M1.8 Audit Movements:** Append-only ledger in `inventory.movements` tracking every intake, reservation, and adjustment.
- [x] **M1.9 Reservation Expiry Sweeper:** Automatic cleanup of expired unfulfilled reservations with idempotent release.
- [x] **M1.10 Bulk CSV Import Pipeline:** Asynchronous import engine with dry-run validation, row-by-row error reporting, and atomic batch intake.

---

### Milestone 2: Cart, Checkout, Payments & Ledger (Weeks 8–16) — 100% COMPLETE
- [x] **M2.1 Multi-Vendor Checkout Saga:** Parcel-level order model grouping cart items into `ShipmentGroup` containers by vendor.
- [x] **M2.2 Snapshot Pricing:** Frozen price snapshots, 7.5% VAT tax snapshots, and dynamic commission snapshots (500 bps = 5%).
- [x] **M2.3 Atomic Saga Reservation:** All-or-nothing stock reservation across all vendors with automatic compensation on payment failure.
- [x] **M2.4 Payment Orchestration Layer:** `PaymentProvider` interface with Card (3DS) and Bank Transfer virtual account adapters.
- [x] **M2.5 Idempotency Engine:** `Idempotency-Key` header validation and lookup returning existing order on duplicate submissions.
- [x] **M2.6 Ledger Posting Rule 1 (Capture):** Double-entry capture journal entry:
  - Debit: `psp_clearing`
  - Credit: `buyer_funds_held` (gross)
- [x] **M2.7 Transactional Outbox:** Atomic staging of `order.confirmed` event within primary database transaction.
- [x] **M2.8 Notifications Fan-Out:** Outbox worker dispatching order confirmation emails, SMS, and WhatsApp alerts with fallback routing and preference enforcement.

---

### Milestone 3: Fulfilment, Shipping & Tracking (Weeks 14–22) — 100% COMPLETE
- [x] **M3.1 Shipment Group State Machine:** Enforced state progression (`pending_vendor_accept` \(\rightarrow\) `accepted` \(\rightarrow\) `packing` \(\rightarrow\) `ready_to_ship` \(\rightarrow\) `shipped` \(\rightarrow\) `in_transit` \(\rightarrow\) `out_for_delivery` \(\rightarrow\) `delivered`).
- [x] **M3.2 Carrier Adapter Interface:** Pluggable carrier interface (`getRates`, `createShipment`, `mapCarrierStatus`).
- [x] **M3.3 Label & Tracking Generation:** Automated carrier label PDF and tracking number generation.
- [x] **M3.4 Tracking Ingestion Pipeline:** Webhook receiver mapping carrier-specific scans to canonical statuses.
- [x] **M3.5 Scan Deduplication:** Unique constraint on `(shipment_id, source_event_id)` preventing duplicate tracking updates.
- [x] **M3.6 Automated Escrow Settlement:** Delivery confirmation scan triggers payout hold clock.
- [x] **M3.7 Ledger Posting Rule 2 (Delivery Confirmed):**
  - Debit: `buyer_funds_held`
  - Credit: `vendor_payable` (net of commission)
  - Credit: `platform_revenue` (commission)
  - Credit: `tax_payable`
  - Credit: `shipping_payable`
- [x] **M3.8 Vendor Pack/Scan Console UI:** Camera barcode scanning (`BarcodeDetector`/ZXing), parcel weight capture, and browser PDF label printing dialog in vendor web app.

---

### Milestone 4: Returns, Disputes & Payouts (Weeks 20–28) — 100% COMPLETE
- [x] **M4.1 Returns Policy Engine:** Return requests validated against delivery state and frozen order policy snapshot.
- [x] **M4.2 Condition Grading & Inspection:** Support agent grading flow (`like_new`, `used`, `damaged`, `ineligible`).
- [x] **M4.3 Automated PSP Refund:** Gateway refund API execution linked to return request.
- [x] **M4.4 Ledger Posting Rule 4 (Refund Reversal):**
  - Debit: `vendor_payable` (net refund deduction)
  - Debit: `platform_revenue` (commission reversal)
  - Credit: `buyer_funds_held` / clearing (gross refund)
- [x] **M4.5 Scheduled Payout Batching:** Batch generation aggregating mature `vendor_payable` ledger balances past hold period.
- [x] **M4.6 Dual Maker-Checker Payout Approval:** Two-person approval threshold before payout execution.
- [x] **M4.7 Ledger Posting Rule 3 (Payout Execution):**
  - Debit: `vendor_payable`
  - Credit: `bank` (via payout clearing)
- [x] **M4.8 Dispute Center UI:** Evidence submission and mediation dashboard in admin console with automated evidence bundle compilation, binding resolution, and double-entry refund ledger posting.

---

### Milestone 5: Hardening, Observability & Beta (Weeks 26–32)
- [ ] **M5.1 Admin Operational Repair Tools:**
  - Outbox event manual replay interface.
  - Stuck inventory reservation manual release and audit tool.
  - Search document force-refresh trigger.
- [ ] **M5.2 Fraud & Risk Engine v1:** Synchronous checkout velocity rules and async shadow-mode risk scoring.
- [ ] **M5.3 Observability & Business SLOs:** OpenTelemetry distributed tracing across web, API, and workers.
- [ ] **M5.4 Real-Time Unbalanced Ledger Detector:** Continuous detector triggering critical P0 alert if \(\sum \text{Debits} - \sum \text{Credits} \ne 0\).
- [ ] **M5.5 Security Hardening & ASVS L2:** Envelope KMS encryption for PII, pen-testing, and vulnerability remediation.
- [ ] **M5.6 Load & Concurrency Stress Testing:** k6 test harness simulating 5x peak flash-sale SKU contention.
- [ ] **M5.7 Private Vendor Beta:** Pilot onboarding of 20–50 vendors with end-to-end commerce transactions in staging/production.

---

### Phase 2: Mobile Applications & Advanced Scale (Scaffolded)
- [ ] **P2.1 React Native / Expo Monorepo Package:** Mobile app scaffold sharing `@manga/domain`, `@manga/validation`, `@manga/api-client`, and `@manga/design-tokens`.
- [ ] **P2.2 Push Notification Registry:** APNs and FCM device token registry.
- [ ] **P2.3 Universal Deep Links:** Hosted `apple-app-site-association` and `assetlinks.json`.
- [ ] **P2.4 Buyer Mobile App:** iOS and Android native buyer storefront.
- [ ] **P2.5 Courier Mobile App:** Mobile scan and proof-of-delivery (POD) app for dispatch couriers.
- [ ] **P2.6 Promise Engine v2:** Gradient-boosted machine learning model for lane ETA predictions.
- [ ] **P2.7 Vendor Health Score Engine:** Daily composite 0–100 score driving search boost and tier standing.
