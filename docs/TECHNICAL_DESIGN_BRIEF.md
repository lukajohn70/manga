# Manga: Technical Design Brief

Version 1.0 | November 2026
Companion to: *Manga Product & Technical Brief v1.2*
Scope: Phase 1 (web, PWA, vendor and admin consoles) with explicit design for Phase 2 (iOS/Android scaffolded from the same platform).

---

## 1. Purpose and Scope

This document defines **how** Manga will be built: architecture, domain design, data models, APIs, workflows, infrastructure, security, quality, and delivery. It is written so engineering can start sprint planning from it, and so decisions are explicit and reversible where possible.

**Out of scope here:** visual design (see Product Brief §18 and §27), business rules not affecting technical design, vendor commercial terms.

**Design goals (ranked)**
1. **Correctness of money and inventory** (no oversells, no unbalanced ledgers, no lost refunds)
2. **Operability** (any order, payment, or parcel can be traced and repaired from an admin tool)
3. **Evolvability** (new carriers, payment methods, markets, and mobile apps without rewrites)
4. **Performance on mid-range phones and unreliable networks**
5. **Cost efficiency at early scale**, with a clear path to scale

---

## 2. Architectural Principles

1. **Modular monolith first.** One deployable backend with strict module boundaries (no cross-module table access, communication via module APIs and domain events). Extract to services only when a module has distinct scaling, team, or reliability needs. Early extraction candidates: Search indexing, Tracking ingestion, Notifications.
2. **API-first, client-agnostic.** The web app, future mobile apps, vendor console, admin console, and external vendor integrations all use the same versioned APIs.
3. **Event-driven internally.** State changes emit domain events through a transactional outbox. Consumers are idempotent.
4. **Immutable facts, mutable projections.** Orders, payments, tracking events, and ledger entries are append-only facts; dashboards and lists are rebuildable projections.
5. **Snapshot, don't reference, for anything historical.** Prices, taxes, commission rules, and policies applied to an order are copied onto it.
6. **Idempotency everywhere that matters.** Every write endpoint that creates money, orders, shipments, refunds, or payouts accepts an idempotency key.
7. **Configuration as data.** Commission rules, return policies, shipping rules, vendor tiers, and feature flags are versioned records edited through admin tools, not code deployments.
8. **Secure by default.** Least privilege, deny by default, vendor-scoped data isolation enforced at the database layer.
9. **Observable by design.** Every request, event, and job carries correlation IDs; business-level SLOs are monitored alongside technical ones.
10. **Buy commodity, build differentiators.** Buy: payments/PSP, KYC, search engine (managed), email/SMS/WhatsApp delivery, tax engine (or rules), error tracking. Build: marketplace order model, ledger, policy engine, Promise Engine, vendor health scoring, returns workflows.

---

## 3. System Context

```
                         ┌─────────────────────────────┐
  Buyers (web/PWA) ─────▶│                             │──▶ PSPs (cards, transfer, wallets)
  Vendors (console) ────▶│        MANGA PLATFORM       │──▶ Payout provider
  Admin/Support ────────▶│   (API + workers + events)  │──▶ Carriers / aggregators
  Vendor systems (API) ─▶│                             │──▶ KYC/KYB providers
  Mobile apps (Phase 2) ▶│                             │──▶ Email / SMS / WhatsApp / Push
                         └─────────────────────────────┘──▶ Tax engine, fraud, maps/geocoding
                                      ▲
                       Webhooks in: PSP, carriers, KYC
```

---

## 4. High-Level Architecture

### 4.1 Layers

| Layer | Responsibility | Technology (recommended) |
|---|---|---|
| Edge | TLS, CDN, WAF, bot protection, rate limiting, image optimisation | Cloudflare (or CloudFront + WAF) |
| Web apps | Buyer storefront (SSR/ISR, PWA), vendor console (SPA), admin console (SPA) | Next.js + React + TypeScript |
| API gateway / BFF | Auth enforcement, request shaping, GraphQL for UIs, REST for partners | NestJS (GraphQL + REST) |
| Application core | Modular monolith (domain modules below) | Node.js + TypeScript (NestJS) |
| Workers | Async jobs, event consumers, schedulers, webhooks processing | BullMQ/Temporal workers |
| Workflow engine | Long-running sagas: checkout, returns, payouts, disputes | Temporal |
| Data | OLTP, cache, search, object store, warehouse | PostgreSQL, Redis, OpenSearch/Typesense, S3-compatible, ClickHouse/BigQuery |
| Messaging | Domain events, integration events | Kafka (or NATS/SQS+SNS at smaller scale) via outbox |
| Observability | Logs, metrics, traces, errors, uptime | OpenTelemetry → Grafana/Datadog; Sentry |
| Platform | Containers, orchestration, IaC, CI/CD, secrets | Docker, managed Kubernetes or ECS/Cloud Run, Terraform, GitHub Actions, Vault/Secrets Manager |

**Language note:** TypeScript end-to-end maximises code sharing (domain types, validation schemas, API clients) between backend, web, and Phase 2 React Native. The **Ledger** and **Tracking ingestion** modules should be written so they can be isolated and reimplemented in Go/Kotlin later if throughput demands.

### 4.2 Domain Modules (bounded contexts)

| Module | Owns | Publishes events (examples) |
|---|---|---|
| Identity & Access | Users, roles, sessions, MFA, API keys, consent | `user.registered`, `session.revoked` |
| Vendor Management | Vendors, KYC/KYB, tiers, compliance docs, staff, warehouses | `vendor.approved`, `vendor.suspended`, `vendor.tier_changed` |
| Catalog | Master products, variants, attributes, taxonomy, media, brands, moderation | `product.published`, `listing.rejected` |
| Offers & Pricing | Vendor offers, price lists, buy-box ranking inputs | `offer.created`, `offer.price_changed` |
| Inventory | Stock levels, reservations, adjustments, warehouses | `stock.reserved`, `stock.released`, `stock.low` |
| Cart & Checkout | Carts, checkout sessions, totals calculation | `checkout.started`, `order.placed` |
| Orders | Orders, order lines, shipment groups, order timeline | `order.confirmed`, `order.cancelled`, `shipment_group.created` |
| Shipping & Tracking | Carrier adapters, shipments, parcels, tracking events, ETA | `shipment.label_created`, `shipment.status_changed`, `shipment.delivered`, `shipment.exception` |
| Returns & Disputes | Return requests, inspections, disputes, evidence | `return.requested`, `return.received`, `dispute.opened`, `dispute.resolved` |
| Payments | Payment intents, attempts, refunds, chargebacks, PSP routing | `payment.authorized`, `payment.captured`, `refund.completed` |
| Ledger | Accounts, entries, balances, holds, reserves | `ledger.entry_posted` |
| Payouts | Payout batches, statements, reconciliation | `payout.created`, `payout.paid`, `payout.failed` |
| Promotions & Loyalty | Coupons, campaigns, points, store credit | `promotion.applied`, `credit.issued` |
| Search & Discovery | Indexing pipelines, ranking config, recommendations | `index.updated` (internal) |
| Reviews & Q&A | Reviews, questions, answers, moderation | `review.published` |
| Messaging | Buyer–vendor threads, support threads | `message.sent` |
| Notifications | Templates, preferences, channel delivery, device registry | `notification.sent` |
| Trust & Risk | Fraud rules/scores, vendor health score, abuse reports | `risk.flagged`, `vendor.health_updated` |
| CMS | Pages, banners, collections, SEO metadata | `content.published` |
| Admin & Audit | Audit log, feature flags, configuration versions, case management | `config.changed` |
| Analytics | Event ingestion, warehouse sync | n/a |

**Boundary rules**
- A module may read another module's data only through its **public service interface** or a **read model** populated from events.
- No foreign keys across module boundaries; use IDs and eventual consistency (except inside the ordering saga where explicit orchestration is used).
- Each module has its own Postgres **schema** (e.g., `orders.*`, `ledger.*`) and its own migrations.
- Enforce with lint rules/architecture tests (e.g., dependency-cruiser, ArchUnit-style tests).

---

## 5. Client Architecture

### 5.1 Repository Layout (monorepo)

```
manga/
├─ apps/
│  ├─ web-store/          # Next.js buyer app (PWA)
│  ├─ web-vendor/         # Vendor console (React SPA)
│  ├─ web-admin/          # Admin console (React SPA)
│  ├─ api/                # NestJS modular monolith (HTTP/GraphQL)
│  ├─ worker/             # Async workers, event consumers, schedulers
│  └─ mobile/             # (Phase 2) React Native: buyer + seller
├─ packages/
│  ├─ design-tokens/      # Colors, type, spacing → CSS vars + RN theme
│  ├─ ui/                 # Component library (web), mirrors RN components
│  ├─ api-client/         # Generated GraphQL/REST clients + hooks
│  ├─ domain/             # Shared types, enums, state machines, money utils
│  ├─ validation/         # Zod schemas shared by client and server
│  ├─ i18n/               # Strings, formatting
│  ├─ analytics/          # Event taxonomy and tracker
│  └─ config/             # ESLint, TS, build configs
├─ infra/                 # Terraform, Helm/manifests, runbooks
└─ docs/                  # ADRs, API docs, diagrams
```
Tooling: pnpm workspaces + Turborepo (or Nx), TypeScript strict mode, Changesets for versioning shared packages.

### 5.2 Buyer Web App (Next.js, PWA)

- **Rendering strategy:** SSR/ISR for category, product, vendor, and landing pages (SEO + speed); client-side for cart, checkout, account. Edge caching with stale-while-revalidate on catalog pages; personalised fragments (price, delivery promise, wishlist state) fetched client-side or via edge-side includes.
- **State:** server state with TanStack Query (or Apollo) with persisted cache; minimal client state with Zustand/Context; form state with React Hook Form + shared Zod schemas.
- **Routing:** stable, human-readable URLs designed for deep-linking (`/p/{slug}-{id}`, `/v/{vendor-slug}`, `/orders/{id}`, `/track/{token}`, `/returns/{id}`), reused as universal links in Phase 2.
- **PWA:** service worker (Workbox) with strategies per route: app shell precache; stale-while-revalidate for catalog; network-first for cart/checkout; cache-first for static/media; **offline pages for order list, order detail, and tracking** (last known state, clearly marked "as of"); background sync for queued actions (messages, return requests) with idempotency keys; Web Push (VAPID) registered via the notification device registry; install prompt strategy after a successful order, not on first load.
- **Performance budgets (CI-enforced):** initial JS ≤ 170 KB gzip on PDP/category; LCP < 2.5s on mid-range Android over 4G; INP < 200ms; CLS < 0.1; image bytes via AVIF/WebP with responsive `srcset`; third-party script budget and deferral rules.
- **Accessibility:** WCAG 2.2 AA; automated (axe, Lighthouse CI) and manual (screen reader, keyboard) checks in CI/QA.
- **Internationalisation:** ICU message format, locale-aware currency/date/address/phone; RTL-ready CSS logical properties.
- **Error handling:** typed API errors with user-safe messages; error boundaries per route; retry with backoff for idempotent calls; offline banner.

### 5.3 Vendor Console

- SPA optimised for dense, task-driven workflows: data grids with virtualisation, saved views, inline editing, keyboard shortcuts, bulk actions.
- **Responsive for phone use** (pack/scan, order alerts) in Phase 1: camera barcode scanning via `BarcodeDetector`/ZXing, print via browser print/PDF label, installable PWA.
- Real-time updates (new orders, SLA timers) via Server-Sent Events or WebSocket channel scoped to vendor.
- Long-running tasks (CSV import, bulk price update, report export) run as jobs with progress UI, dry-run validation, and downloadable error reports.

### 5.4 Admin Console

- Same stack, separate deployment, stricter network and auth controls (SSO, mandatory MFA, IP allowlist optional).
- Configuration screens use **versioned drafts** with preview, diff, simulation ("impact on last 30 days"), maker-checker approval for finance- and policy-affecting changes, and scheduled activation.

### 5.5 Phase 2 Mobile Scaffolding Plan

| Concern | Phase 1 decision that enables Phase 2 |
|---|---|
| Code reuse | Domain, validation, api-client, i18n, analytics, tokens are framework-agnostic packages |
| UI | Component library designed with matching React Native components; tokens exported to RN theme |
| Auth | OAuth2/OIDC + PKCE, refresh tokens, device sessions; biometric unlock layered on refresh token in secure storage |
| Push | Notification service already abstracts channels; add APNs/FCM providers and token registry |
| Deep links | Route table shared; `apple-app-site-association` and `assetlinks.json` hosted |
| Payments | PSP integration via hosted/redirect or SDK; abstraction already isolates method-specific UI |
| Offline | Query cache persistence pattern and idempotent mutation queue reused |
| Versioning | API version headers + minimum-supported-client policy in place |
| Release | Feature flags and remote config used by web already apply to apps |

Mobile stack (Phase 2): React Native (Expo with custom dev client) + TypeScript, React Navigation, native modules for camera/barcode, maps, biometrics, secure storage; EAS Build/Update for CI and OTA; Sentry for crashes.

---

## 6. API Design

### 6.1 Styles
- **GraphQL** for first-party UIs (flexible, fewer round trips on PDP/cart/order screens); persisted queries, query cost/depth limits, field-level authorisation.
- **REST (OpenAPI 3.1)** for the public **Vendor API**, webhooks, carrier/PSP callbacks, and integrations.
- **Webhooks (outbound)** for vendors with HMAC signatures, retries with exponential backoff, replay UI, and event log.

### 6.2 Conventions
- Versioning: `/v1/...` for REST; GraphQL evolves additively with deprecation windows (min. 90 days).
- **Idempotency:** `Idempotency-Key` header on POSTs that create resources/money movement; stored with request hash and response for 24h+.
- **Pagination:** cursor-based; stable ordering.
- **Errors:** RFC 9457 problem details with machine-readable `code`, human `message`, `traceId`, and field errors.
- **Concurrency:** ETag/`If-Match` or version numbers for optimistic locking on edit screens.
- **Rate limits:** per IP, per user, per API key, per endpoint class; clear `Retry-After`.
- **Money:** integers in minor units + ISO 4217 currency code; never floats. Shared `Money` type and rounding policy (documented, banker's rounding where law requires).
- **Time:** UTC ISO 8601 everywhere; display conversion in clients.
- **IDs:** ULIDs/UUIDv7 (sortable, non-guessable); human-friendly order numbers separate (e.g., `MNG-2611-48K2F`).

### 6.3 Key Endpoints (illustrative)

**Buyer**
```
GET   /v1/search?q=&filters=&sort=&deliverTo=
GET   /v1/products/{id}                       # includes offers, buy-box, delivery promise
POST  /v1/carts / PATCH /v1/carts/{id}/lines
POST  /v1/checkout/sessions                   # computes totals, shipping options per parcel
POST  /v1/checkout/sessions/{id}/confirm      # idempotent; starts order saga
GET   /v1/orders / GET /v1/orders/{id}
GET   /v1/orders/{id}/tracking                # per parcel timeline
GET   /v1/track/{token}                       # public tracking, masked data
POST  /v1/orders/{id}/returns                 # eligibility checked by policy engine
GET   /v1/returns/{id} / POST /v1/returns/{id}/evidence
POST  /v1/disputes
```

**Vendor**
```
POST/PATCH /v1/vendor/products, /offers, /inventory/adjustments
POST  /v1/vendor/imports (CSV/XLSX) → job
GET   /v1/vendor/orders?needsAction=true
POST  /v1/vendor/shipment-groups/{id}/accept | /pack | /ship | /cancel
POST  /v1/vendor/shipments/{id}/labels
POST  /v1/vendor/returns/{id}/approve | /reject | /inspect
GET   /v1/vendor/finance/ledger | /payouts | /statements
POST  /v1/vendor/webhooks/endpoints
```

**Admin**
```
GET/POST /v1/admin/vendors/{id}/approve | suspend | tier
PUT   /v1/admin/config/commission-rules (draft → approve → schedule)
POST  /v1/admin/orders/{id}/interventions (audited)
GET   /v1/admin/ledger/accounts/{id}/entries
POST  /v1/admin/payouts/batches/{id}/approve
```

**Inbound webhooks:** `/hooks/psp/{provider}`, `/hooks/carrier/{carrier}`, `/hooks/kyc/{provider}`: signature verified, raw payload stored first, then processed asynchronously.

---

## 7. Core Data Design

PostgreSQL 16+, one logical database at launch, schema-per-module. Representative tables (not exhaustive).

### 7.1 Catalog and Offers
```
catalog.master_products(id, brand_id, title, description, gtin, category_id, status, attributes jsonb, created_at)
catalog.variants(id, master_product_id, sku_canonical, option_values jsonb, gtin, weight_g, dims_mm, hs_code)
catalog.attribute_definitions(id, category_id, key, type, constraints jsonb, facetable, required)
offers.offers(id, vendor_id, variant_id, condition, price_minor, currency, compare_at_minor,
              handling_time_hours, shipping_profile_id, policy_template_id, status, version)
```
- Attribute values typed and validated against `attribute_definitions`; facet values denormalised into the search index.
- Buy Box ranking inputs (price, promise date, vendor health, stock depth) computed asynchronously into `offers.buybox_scores`.

### 7.2 Inventory
```
inventory.stock_levels(variant_id, warehouse_id, on_hand, reserved, safety_stock, updated_at)  -- PK (variant_id, warehouse_id)
inventory.reservations(id, order_ref, variant_id, warehouse_id, qty, status, expires_at)
inventory.movements(id, variant_id, warehouse_id, delta, reason, ref_type, ref_id, actor, created_at)  -- append-only
```
**Oversell prevention:** reservation performed in a single transaction with `UPDATE stock_levels SET reserved = reserved + :q WHERE variant_id=:v AND warehouse_id=:w AND (on_hand - reserved - safety_stock) >= :q` (affected rows = 1 means success). Hot-SKU contention handled with row-level locks plus short transactions; if needed later, move to sharded counters or Redis-backed reservation with periodic reconciliation. Reservations expire via scheduled job; expiry and release are idempotent.

### 7.3 Orders (parcel-level model)
```
orders.orders(id, number, buyer_id, status, currency, totals jsonb, address_snapshot jsonb,
              tax_snapshot jsonb, placed_at, idempotency_key)
orders.order_lines(id, order_id, shipment_group_id, offer_id, variant_id, vendor_id, qty,
                   unit_price_minor, discount_minor, tax_minor, commission_snapshot jsonb,
                   policy_snapshot jsonb, title_snapshot, image_snapshot)
orders.shipment_groups(id, order_id, vendor_id, fulfillment_mode, status, promise_range tstzrange,
                       shipping_method, shipping_fee_minor, sla_deadlines jsonb)
orders.order_events(id, order_id, shipment_group_id, type, actor, payload jsonb, created_at)  -- append-only timeline
```
An **order** is a container; each **shipment group** is the unit of fulfilment, payout, return, and dispute.

### 7.4 Shipping and Tracking
```
shipping.shipments(id, shipment_group_id, carrier_id, service_code, tracking_number, label_url,
                   status, cost_minor, weight_g, pickup_ref, created_at)
shipping.parcels(id, shipment_id, dims_mm, weight_g, items jsonb)
shipping.tracking_events_raw(id, carrier_id, tracking_number, payload jsonb, received_at, signature_ok)
shipping.tracking_events(id, shipment_id, status_canonical, carrier_status, occurred_at, location, source_event_id, seq)
  UNIQUE (shipment_id, carrier_id, source_event_id)   -- dedup
```

### 7.5 Payments and Ledger (double-entry)
```
payments.payments(id, order_id, method, psp, psp_ref, status, amount_minor, currency, authorized_at, captured_at)
payments.refunds(id, payment_id, return_id, amount_minor, status, psp_ref)
ledger.accounts(id, type, owner_type, owner_id, currency)  -- types: buyer_funds_held, vendor_payable, platform_revenue,
                                                           -- tax_payable, shipping_payable, reserve, refunds_clearing, chargeback_loss, psp_clearing, bank
ledger.transactions(id, ref_type, ref_id, description, posted_at, idempotency_key UNIQUE)
ledger.entries(id, transaction_id, account_id, direction CHECK in ('D','C'), amount_minor > 0, currency)
```
**Invariants (enforced by DB constraints/deferred triggers + tests):**
- Every `transaction` has entries where Σdebits = Σcredits per currency.
- Entries and transactions are never updated or deleted; corrections are reversing transactions.
- Account balances are derived (materialised with periodic verification); negative vendor balances allowed only via configured rules.

**Typical postings**
1. *Capture:* D `psp_clearing` / C `buyer_funds_held` (gross)
2. *Delivery confirmed (+ hold period):* D `buyer_funds_held` / C `vendor_payable` (net of commission), `platform_revenue` (commission), `tax_payable`, `shipping_payable` as applicable
3. *Payout:* D `vendor_payable` / C `bank` (via payout provider clearing)
4. *Refund after release:* reverse proportionally, including commission reversal rules from the frozen commission snapshot
5. *Chargeback:* D `chargeback_loss` or `vendor_payable` per liability rule / C `psp_clearing`

### 7.6 Returns and Disputes
```
returns.return_requests(id, order_id, shipment_group_id, status, reason_code, resolution_requested, risk_score, policy_snapshot jsonb)
returns.return_items(id, return_request_id, order_line_id, qty, condition_claimed, condition_graded)
returns.return_shipments(id, return_request_id, carrier_id, tracking_number, label_url, status)
returns.inspections(id, return_request_id, grader_id, grade, notes, media jsonb, refund_amount_minor)
disputes.cases(id, type, order_id, shipment_group_id, opened_by, status, deadline_at, outcome, ledger_tx_id)
disputes.evidence(id, case_id, party, kind, uri, created_at)
```

### 7.7 Config and Policy (versioned, effective-dated)
```
config.commission_rules(id, version, scope jsonb, rate_bps, fixed_minor, tiers jsonb, valid_from, valid_to, status, approved_by)
config.return_policies(id, version, scope jsonb, window_days, conditions jsonb, shipping_payer_by_reason jsonb, ...)
config.shipping_rules(...), config.tax_rules(...), config.feature_flags(...)
```
Orders store resolved **snapshots**; rule evaluation uses the version effective at order time ("policy time travel").

### 7.8 Multi-tenancy and Data Isolation
- Vendor-owned tables carry `vendor_id`; **PostgreSQL Row-Level Security** policies bind queries to the authenticated vendor context (`SET app.vendor_id`) so a bug in application code cannot leak cross-vendor data.
- PII (addresses, phone, bank details) encrypted at field level (envelope encryption, KMS-managed keys); bank details tokenised via the payout provider where possible.
- Retention and deletion policies per table; soft-delete with scheduled hard-delete for privacy requests (ledger entries pseudonymised, not deleted).

---

## 8. Key Workflows (Sagas and State Machines)

### 8.1 Checkout and Order Placement (orchestrated saga)

```
Checkout confirm (idempotency key)
  1. Validate cart & re-price (offers, promos, tax, shipping) → lock totals
  2. Reserve inventory per shipment group (all-or-nothing; compensate on failure)
  3. Create order (status: pending_payment) + shipment groups + snapshots
  4. Create payment intent / charge with PSP (3DS/OTP handled client-side)
  5a. On success: mark order confirmed; post ledger capture; emit order.confirmed
  5b. On failure/timeout: release reservations; mark order payment_failed; notify
  6. Fan out: vendor notifications, fraud review (async), invoice generation
```
- Implemented as a **Temporal workflow** with compensations and timeouts (e.g., pending_payment expires in 30 min; async payment methods like bank transfer extend per method).
- PSP webhooks and client redirects are both treated as hints; the **source of truth is the PSP's verified status**, fetched server-side before state transitions.
- Duplicate submissions return the original order (idempotency).

### 8.2 Shipment Group State Machine
`pending_vendor_accept → accepted → packing → ready_to_ship → shipped → in_transit → out_for_delivery → delivered`
Side paths: `cancelled_by_vendor | cancelled_by_buyer (pre-ship) | delivery_failed → returned_to_sender | lost → claim`
Each transition: validated guard (e.g., can't `ship` without a valid tracking number), timestamp, actor, emits event, updates SLA timers.

### 8.3 Tracking Pipeline
1. Carrier webhook (or poller) → **raw event store** (verify signature, dedupe by carrier event ID, respond fast).
2. Worker normalises via the carrier adapter's mapping table → canonical status + location + timestamp.
3. **Ordering and dedupe:** insert with unique key; compute shipment's current status by latest-occurred valid event, not latest-received; ignore regressions unless the event type permits (e.g., `returned_to_sender`).
4. Emit `shipment.status_changed`; downstream consumers: order timeline, notifications, ETA recalculation, exception rules, delivery confirmation → payout hold clock.
5. **Polling fallback** for carriers without webhooks (scheduled with adaptive intervals by state); **stale-shipment detector** raises exceptions if no scan within configured hours.
6. **ETA engine:** v1 rules (carrier ETA + lane/zone historical median + cutoffs/holidays); v2 gradient-boosted model on historical lane performance, outputs date range + confidence.

### 8.4 Returns Workflow (Temporal)
`requested → [policy check] → auto_approved | pending_vendor → approved → label_issued → in_transit → received → inspected → refund_issued | exchange_shipped | credit_issued → closed`
- Timers: vendor response SLA (auto-approve or escalate on expiry per policy), return-shipping deadline, inspection SLA.
- Refund step posts ledger reversals and calls PSP refund API (idempotent); partial refunds supported via inspection grade.
- Rejection → buyer appeal → creates dispute case.

### 8.5 Payouts (scheduled saga)
1. Eligibility job selects shipment groups past hold period, no open dispute/return window (per policy), vendor in good standing.
2. Build payout batch from ledger `vendor_payable` balances (net of reserves, adjustments); generate statement.
3. **Maker-checker approval** (configurable thresholds; auto-approve for small, low-risk batches).
4. Submit to payout provider with idempotency keys per item; handle async success/failure webhooks; failures post reversing entries and alert.
5. Reconcile: payout provider report ↔ ledger ↔ bank statement; discrepancy queue.

### 8.6 Dispute Workflow
Case opened → evidence window (both parties, deadlines) → automated evidence bundle (order, tracking, POD, messages) → mediator decision or auto-rule → outcome executed as ledger transactions (refund from vendor / platform guarantee) → vendor health score updated.

---

## 9. Search and Discovery

- **Engine:** managed OpenSearch/Elasticsearch (or Typesense/Meilisearch at smaller scale) with vector search for similarity.
- **Indexing:** event-driven pipeline: `offer.*`, `product.*`, `stock.*`, `vendor.health_updated` → denormalised product documents (best offer, price range, facets, promise range by region bucket, vendor trust, sponsored flags). Near-real-time (< 30s) for price/stock; full reindex tooling with blue/green indices and aliases.
- **Delivery-aware filtering:** region buckets (e.g., state/LGA/postcode clusters) with precomputed promise ranges per bucket; user location resolved to bucket; exact promise computed on PDP/cart.
- **Ranking:** configurable function score = text relevance × availability × promise speed × vendor health × margin/boost × personalisation (later); all boosts logged and explainable; sponsored items labelled.
- **Typeahead:** edge-cached top queries + prefix index; spelling tolerance and synonyms managed in admin.
- **Quality loop:** search analytics (zero-result queries, reformulations, click-through), relevance test set, offline evaluation before ranking changes, A/B testing.
- **Fallback:** if search cluster degraded, serve cached category/collection pages and a reduced Postgres-backed search for top queries.

---

## 10. Promise Engine (delivery estimates)

**Inputs:** vendor handling time + cutoff + working days, warehouse location, carrier service transit tables by zone, historical on-time performance by lane, holiday calendars, current vendor backlog (open orders vs capacity), destination bucket.
**Output:** `{earliest, latest, confidence, breakdown}` per offer/destination/service.
**Delivery:** computed offline for region buckets (cached in Redis, refreshed on change) and exactly on demand at cart/checkout; promise stored on shipment group at order time.
**Enforcement:** SLA timers derived from the promise; breach triggers vendor warnings, buyer goodwill credit rule, and health score impact.

---

## 11. Notifications

- **Channels:** email, SMS, WhatsApp Business, web push (Phase 1), mobile push (Phase 2), in-app inbox.
- **Pipeline:** domain event → notification rules (who, which template, which channels, delay/quiet hours) → template render (localised, versioned) → provider adapter → delivery receipt webhook → status stored.
- **Preferences and compliance:** per-channel and per-category consent, unsubscribe handling, transactional vs marketing separation, regional sender rules.
- **Reliability:** idempotency per (event, recipient, channel), retry with fallback channel (e.g., push → SMS for delivery exceptions), provider failover.
- **Device registry:** `(user_id, device_id, platform, push_token|web_subscription, app_version, last_seen, locale)`.

---

## 12. Security Design

### 12.1 Identity and Access
- **Buyers:** email/phone + OTP or password, social login optional; session via short-lived access token + rotating refresh token (HttpOnly secure cookies on web, secure storage on mobile); device sessions listable and revocable; risk-based step-up (new device, high-value order, payout/address change).
- **Vendors/Admin:** mandatory MFA (TOTP/WebAuthn passkeys), SSO (OIDC/SAML) for staff, session timeouts, IP allowlists for finance roles.
- **Authorisation:** RBAC + resource scopes + attribute checks (vendor_id, warehouse_id); central policy module (e.g., Casbin/OPA-style) with tests; GraphQL field-level guards.
- **API keys (vendors):** scoped, rotatable, hashed at rest, per-key rate limits and IP restrictions, audit trail.

### 12.2 Data Protection
- TLS 1.2+ everywhere; HSTS; encryption at rest (DB, object storage, backups).
- Field-level encryption for PII and financial identifiers; keys in KMS with rotation; strict access logging on decrypt.
- **PCI:** card data handled only by PSP hosted fields/SDKs (SAQ-A); no PAN storage or logging.
- Secrets in a managed vault; no secrets in repos/images; short-lived CI credentials via OIDC.
- Data classification, minimisation, retention schedules; DSAR (export/delete) tooling; privacy-by-design reviews for new features.

### 12.3 Application Security
- OWASP ASVS L2 baseline; threat modelling for checkout, payouts, returns, and file uploads.
- Input validation (shared Zod schemas), output encoding, CSP with nonces, SameSite cookies, CSRF protection, SSRF-safe fetchers for image/URL imports.
- **Uploads:** pre-signed direct-to-storage, MIME/magic-byte checks, size limits, AV scanning, image re-encoding, EXIF stripping, quarantine bucket until scanned.
- **Webhooks in:** signature verification, timestamp tolerance, replay protection, IP allowlists where offered.
- **Webhooks out:** HMAC signatures, per-endpoint secrets, retry/backoff, disable-on-failure policy.
- Rate limiting and bot defence at edge and app (login, OTP, checkout, search scraping, promo abuse).
- Dependency scanning (SCA), SAST, container scanning, secret scanning in CI; signed images and SBOMs.
- Pen test before launch and annually; bug bounty after public launch.

### 12.4 Audit and Compliance
- Immutable **audit log** for admin/vendor-staff actions and all config changes (actor, time, IP, before/after, reason), write-once storage with retention.
- Separation of duties: maker-checker on commission/policy/payout changes; break-glass access with approval and alerts.
- Compliance targets: NDPA (Nigeria Data Protection Act) and GDPR where applicable, PCI DSS SAQ-A, consumer protection rules in launch markets; vendor KYC/AML obligations via providers.

---

## 13. Fraud and Risk Engine

- **Signals:** device fingerprint, IP/geo reputation, velocity (cards, addresses, phone, accounts), address/phone quality, order value vs history, promo usage patterns, return history, COD no-show history, vendor-side anomalies (price outliers, fake tracking numbers, review rings).
- **Architecture:** synchronous lightweight rules at checkout (allow/step-up/review/deny in < 100ms) + asynchronous scoring and review queue; rules stored as versioned config with shadow mode before enforcement; every decision logged with features and reason codes.
- **Actions:** require OTP/3DS, hold order for review, limit payment methods (e.g., no COD), restrict instant refund/exchange, delay payout, suspend listing/vendor.
- **Feedback loop:** analyst outcomes labelled → used to tune rules and train models (Phase 2+).

---

## 14. Vendor Health Score

Composite (0-100) recomputed daily (and on key events) from rolling windows:
- On-time handover rate, late shipment rate, cancellation rate
- On-time delivery rate by carrier/lane (attributed fairly)
- Defect/return rate by reason (weighted by vendor-attributable reasons)
- Dispute rate and loss rate
- Customer message response time, review sentiment, listing quality score
- Policy violations and compliance document currency

Stored in `trust.vendor_health(vendor_id, date, score, components jsonb)`. Drives Buy Box eligibility, search boost, payout speed/reserve, tier promotion/demotion, and vendor-facing "how to improve" guidance. Weights are config (versioned) and explainable.

---

## 15. Payments Integration Design

- **Payment orchestration layer:** internal `PaymentProvider` interface (`createIntent`, `confirm`, `capture`, `refund`, `getStatus`, `parseWebhook`, `listSettlements`) with adapters per PSP; routing rules by method, amount, region, success rate, and cost; automatic failover for eligible methods.
- **Methods (via adapters):** cards (3DS), bank transfer/virtual accounts, USSD, mobile money/wallets, Apple Pay/Google Pay, BNPL, pay-on-delivery (with deposit/limits), gift card/store credit (internal).
- **Async methods:** pending states with expiry, polling + webhook reconciliation, buyer-facing "waiting for payment" with deep link back.
- **Settlement reconciliation:** daily import of PSP settlement files; matching by PSP reference; mismatches create reconciliation cases; fees posted to ledger.
- **Refunds:** idempotent, linked to return/dispute; method-aware (original method, wallet, store credit with optional bonus).
- **Payouts:** separate payout provider adapter (bank transfer, mobile money); beneficiary verification (name match) before first payout; velocity and size limits; dual approval for large batches.

---

## 16. Carrier Integration Design

- **Adapter interface:** `getRates`, `createShipment`, `getLabel`, `schedulePickup`, `cancel`, `track`, `createReturn`, `parseWebhook`, plus capability flags (supports webhooks, pickup, COD, pickup points, proof of delivery).
- **Mapping tables:** carrier status/exception codes → canonical statuses (versioned, testable with fixtures from real payloads).
- **Rate engine:** zone and rate-card tables (for non-API carriers), dimensional weight calc, surcharges, fuel adjustments, per-vendor negotiated rates, rate shopping strategy (cheapest, fastest, balanced, preferred-carrier).
- **Address services:** normalisation, geocoding with confidence, landmark and phone capture where formal addresses are weak, pickup-point lookup with capacity.
- **Resilience:** circuit breakers, per-carrier queues and rate limits, fallback carrier routing, manual-label path when APIs are down.
- **Testing:** recorded-payload contract tests, sandbox integration tests, chaos tests (duplicate, delayed, out-of-order webhooks).

---

## 17. Infrastructure and Environments

### 17.1 Environments
`local` (docker-compose with Postgres, Redis, search, mock PSP/carriers) → `preview` (per pull request, ephemeral) → `staging` (production-like, sandbox integrations, anonymised data) → `production`.

### 17.2 Reference Deployment
- **Compute:** containers on managed Kubernetes (or ECS/Cloud Run for lean start); separate deployments for `api`, `worker`, `web-store` (SSR), consoles (static + CDN); autoscaling on CPU/RPS/queue depth.
- **Data:** managed PostgreSQL (HA, multi-AZ, PITR, read replica for reporting/search indexing), Redis (cache, rate limiting, queues), managed search, object storage + CDN, managed Kafka (or lighter queue), warehouse (ClickHouse/BigQuery).
- **Networking:** private subnets for data, WAF at edge, egress allowlist for outbound integrations, VPN/zero-trust for admin and ops access.
- **Region and data residency:** primary region chosen for latency to launch market and legal requirements; CDN edge for static/media; DR region with replicated backups and tested restore.
- **IaC:** Terraform for all infrastructure; Helm/Kustomize for workloads; no manual console changes.

### 17.3 CI/CD
- Trunk-based development, short-lived branches, required reviews, protected main.
- Pipeline: lint/typecheck → unit tests → contract tests → build → security scans (SAST/SCA/secrets/container) → preview deploy → e2e smoke → promote to staging → manual/auto approval → progressive production rollout (canary 5% → 25% → 100%) with automatic rollback on SLO breach.
- **Database migrations:** expand-and-contract pattern (backwards-compatible), run as separate step, reviewed for locking risk, tested on production-sized copy.
- Feature flags for all risky/new capabilities; kill switches for payments methods, carriers, search ranking changes.

### 17.4 Reliability Targets
| Service | Availability SLO | Notes |
|---|---|---|
| Checkout and payments | 99.9% | Graceful degradation, PSP failover |
| Storefront browse | 99.9% | CDN-cached, stale-while-error |
| Vendor console | 99.5% | |
| Tracking ingestion | 99.9% ingest; processing lag p95 < 60s | Raw store first, process later |
| Payout jobs | Correctness over speed | Zero silent failures |
RPO ≤ 5 minutes (PITR), RTO ≤ 1 hour for core services; quarterly restore and failover drills.

---

## 18. Observability and Operations

- **Telemetry:** OpenTelemetry traces across web → API → workers → integrations; structured JSON logs with trace/correlation IDs, user/vendor/order IDs (PII-scrubbed); RED/USE metrics; error tracking (Sentry) with release tracking; real-user monitoring for Core Web Vitals.
- **Business SLOs/alerts:** orders stuck in `pending_payment`; payment success rate by method/PSP; shipments without scan > N hours; webhook failure/lag; unbalanced ledger detector (must be zero); payout failures; reservation leaks (reserved > expected); search zero-result rate spikes; vendor SLA breach rate.
- **Runbooks and on-call:** documented per alert; incident management process (severity levels, comms templates, postmortems with action tracking).
- **Admin repair tools:** replay event, re-run saga step, resend notification, re-sync tracking, reverse ledger transaction (with approval), release/recompute reservation, force-refresh search document. All audited.
- **Cost monitoring:** per-service cost dashboards, budgets and alerts, tagging standards.

---

## 19. Performance and Scalability Design

| Concern | Approach |
|---|---|
| Catalog reads | CDN + ISR + Redis; search for lists; product document cache keyed by version |
| Cart/checkout | Redis-backed carts with durable persistence; stateless APIs; PSP calls off the critical DB transaction |
| Hot-SKU contention | Short transactions, row locks on stock row, queueing for flash sales, optional waiting-room |
| Write amplification | Outbox batching, event compaction for price/stock churn, debounced index updates |
| Read models | CQRS projections for order lists, vendor dashboards, admin explorers |
| DB growth | Partition large append-only tables (events, tracking, ledger entries) by time; archive cold partitions; read replicas for reporting |
| Background load | Separate queues by priority (payments > notifications > indexing > reports); per-tenant fairness for imports |
| Images/media | On-the-fly resize via CDN, AVIF/WebP, lazy loading, quality negotiation by network hints |
| Capacity plan | Load test at 5× projected launch peak; scale targets: 100k SKUs → 10M, 1k → 50k vendors, 1k → 100k orders/day without architecture change (add replicas, partitions, extract modules) |

---

## 20. Testing Strategy

| Level | Focus | Tooling |
|---|---|---|
| Unit | Domain logic, money math, policy engine, state machines | Vitest/Jest, property-based tests (fast-check) |
| Property tests | **Ledger always balances**, idempotent handlers, reservation invariants, state machine legality | fast-check |
| Contract | PSP/carrier adapters against recorded payloads and sandboxes; GraphQL schema compatibility; webhook formats | Pact, snapshot fixtures |
| Integration | Module + DB + queue flows (testcontainers) | Jest/Vitest + Testcontainers |
| E2E | Critical journeys: guest checkout, multi-vendor order, cancel, return + refund, payout, vendor import | Playwright (desktop + mobile emulation) |
| Concurrency/chaos | Last-unit purchase race, duplicate/out-of-order webhooks, PSP timeouts, worker crashes mid-saga | Custom harness, fault injection |
| Performance | Load (k6), soak, stress, spike (flash sale) | k6, Lighthouse CI |
| Security | SAST/SCA, DAST, authz tests (cross-vendor access attempts), pen test | ZAP, Semgrep, external testers |
| Accessibility | Automated + manual screen reader audits | axe, NVDA/VoiceOver |
| UAT | Real vendors/support agents in staging with seeded scenarios | Structured scripts |

Quality gates: ≥ 80% coverage on domain modules (100% branch coverage on ledger and policy engine), zero critical vulnerabilities, performance budgets met, accessibility checks passed.

---

## 21. Data and Analytics

- **Event tracking:** versioned event schema (`product_viewed`, `search_performed`, `checkout_step`, `payment_attempted`, `shipment_status_changed`, `return_step`, etc.), emitted client-side (consented) and server-side; one taxonomy for web and Phase 2 apps.
- **Pipeline:** events + CDC from Postgres → stream → warehouse (ClickHouse/BigQuery) → modelled layer (dbt) → BI (Metabase/Looker) and embedded vendor analytics.
- **Governance:** metric definitions in code, PII minimisation, role-based dataset access, retention policies.
- **ML readiness:** feature store basics (vendor health, lane performance, return risk) designed so Phase 3 models (ETA, recommendations, fraud) can be trained and served without re-plumbing.

---

## 22. Phase 1 Delivery Plan (technical)

**Milestone 0: Foundations (Weeks 1-4)**
Repo/monorepo, CI/CD, environments, IaC, design tokens + base UI kit, auth/identity, RBAC + RLS scaffolding, audit log, observability baseline, ADR process, outbox + event bus, Temporal setup.

**Milestone 1: Catalog, Vendors, Inventory (Weeks 4-10)**
Vendor onboarding + KYC adapter, catalog + attributes + moderation, offers, inventory + reservations, CSV import pipeline, search indexing + storefront browse/search/PDP.

**Milestone 2: Cart, Checkout, Payments, Ledger (Weeks 8-16)**
Cart, checkout totals (tax/shipping/promo), order saga, PSP adapters (2), webhook handling, double-entry ledger + posting rules, order timeline, notifications (email/SMS/web push).

**Milestone 3: Fulfilment, Shipping, Tracking (Weeks 14-22)**
Vendor order console (SLA timers, pack/scan, labels), carrier adapters (2) + rate engine, tracking pipeline + public tracking page, exception rules, delivery confirmation → payout hold.

**Milestone 4: Returns, Disputes, Payouts (Weeks 20-28)**
Policy engine, returns workflow + inspection, refunds (ledger + PSP), dispute center (basic), payout batches + statements + reconciliation, vendor finance views.

**Milestone 5: Hardening and Private Beta (Weeks 26-32)**
Fraud rules v1, admin repair tooling, load/chaos tests, security review/pen test, accessibility audit, PWA polish, runbooks, beta with 20-50 vendors.

(Weeks overlap by design; team size per Product Brief §22. Dates assume a team of ~12; adjust after discovery.)

**Phase 2 technical work:** Buy Box + Promise Engine v1, Vendor Health Score, mobile apps scaffolded from shared packages (Expo/React Native), APNs/FCM, deep links, pickup points, instant exchange, promotions engine, loyalty/store credit, vendor public API + webhook portal, WhatsApp channel, courier app.

---

## 23. Architecture Decision Records (initial)

| ADR | Decision | Rationale | Revisit when |
|---|---|---|---|
| 001 | Modular monolith, schema-per-module | Speed + consistency now; clear extraction seams | A module needs independent scaling/team |
| 002 | PostgreSQL as system of record | Strong consistency for orders/ledger, RLS, JSONB flexibility | Write volume exceeds single-primary capacity |
| 003 | Double-entry ledger, append-only | Auditability, reconciliation, marketplace splits | Never (core invariant) |
| 004 | Temporal for sagas/workflows | Durable timers, retries, compensation visibility | Operational cost outweighs benefit |
| 005 | Transactional outbox for events | No dual-write inconsistency | Move to CDC-based outbox at scale |
| 006 | GraphQL for first-party, REST for partners | UI flexibility vs. partner simplicity | Public GraphQL demand |
| 007 | TypeScript monorepo with shared packages | Enables web → mobile reuse | Team structure changes |
| 008 | Managed search + vector support | Avoid operating search at launch | Cost/latency at scale |
| 009 | Parcel-level order model (shipment groups) | Native multi-vendor returns/payouts | Never (core model) |
| 010 | Config-as-data with snapshots on orders | Reproducible disputes/audits | Never |
| 011 | PWA first, React Native in Phase 2 | Faster validation; reuse | Native-only features become critical sooner |
| 012 | PSP/carrier/payout adapters behind interfaces | Avoid lock-in; local method support | n/a |

---

## 24. Risks and Technical Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Ledger or payout error | Financial loss, vendor trust | Property tests, daily reconciliation, maker-checker, dry-run payouts, reversal-only corrections |
| Webhook duplication/out-of-order | Wrong statuses, duplicate notifications | Raw store + unique keys + ordering by occurred time, replay tooling |
| Overselling on hot items | Cancellations, support load | Atomic reservations, expiry jobs, reconciliation, waiting room for spikes |
| Carrier API instability | Missed labels, tracking gaps | Circuit breakers, fallback carriers, manual label path, polling backups |
| Poor address quality | Failed deliveries | Geocoding confidence, landmark fields, phone verification, pickup points, pre-dispatch address checks |
| Scope/complexity creep in monolith | Slower delivery | Boundary tests, ADR discipline, strict phase gates |
| PWA limitations on iOS | Reduced push/offline reliability | Plan Phase 2 apps early; progressive enhancement; email/SMS/WhatsApp fallbacks |
| Vendor data quality | Poor search/UX | Attribute validation, quality scores, moderation, import dry-runs |
| Cost overrun on managed services | Budget | Cost dashboards, right-sizing, reserved capacity after baseline |
| Key-person dependencies | Delivery risk | Pairing, documentation, runbooks, ADRs |

---

## 25. Open Technical Decisions

1. Cloud provider and region(s) given launch market latency, data residency, and PSP/carrier proximity
2. Managed Kubernetes vs. simpler container platform for Phase 1
3. Kafka vs. lighter messaging (NATS/SQS/SNS) at launch volume
4. Search engine choice (OpenSearch vs. Typesense/Meilisearch) and vector strategy
5. Temporal Cloud vs. self-hosted
6. PSP and payout provider shortlist and local method coverage; COD stance
7. Carrier and pickup-point partners; aggregator vs. direct integrations
8. Tax approach (external engine vs. internal rules) per market
9. KYC/KYB provider and fraud/device-intelligence vendor
10. WhatsApp Business provider and template approval lead times
11. Mobile framework confirmation for Phase 2 (React Native/Expo vs. alternatives) and how much UI code will be shared
12. Data warehouse and BI tooling
13. Build vs. buy for helpdesk/case management
14. Compliance scope per market (data protection, consumer protection, e-invoicing)

---

## 26. Definition of Done (Phase 1 Release)

- All acceptance criteria in Product Brief §24 pass in staging and production smoke tests
- Ledger reconciliation shows zero unexplained variance for 14 consecutive days in beta
- No P0/P1 defects open; no critical/high vulnerabilities; pen-test findings remediated
- SLO dashboards live; on-call rota and runbooks in place; backup restore and failover drill completed
- Performance budgets and WCAG 2.2 AA checks pass on buyer and vendor flows
- Admin repair tooling covers every saga step and integration failure mode
- Documentation: API reference, vendor integration guide, runbooks, ADRs, data dictionary
