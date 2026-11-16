import { Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service.js';
import { OutboxService } from './modules/outbox/outbox.service.js';
import { LedgerService } from './modules/ledger/ledger.service.js';
import { InventoryService } from './modules/inventory/inventory.service.js';
import { VendorService } from './modules/vendor/vendor.service.js';
import { CsvImportService } from './modules/vendor/import/csv-import.service.js';
import { VendorController } from './modules/vendor/vendor.controller.js';
import { CatalogService } from './modules/catalog/catalog.service.js';
import { CatalogController } from './modules/catalog/catalog.controller.js';
import { OffersService } from './modules/offers/offers.service.js';
import { OffersController } from './modules/offers/offers.controller.js';
import { SearchService } from './modules/search/search.service.js';
import { SearchController } from './modules/search/search.controller.js';
import { ShippingController } from './modules/shipping/shipping.controller.js';
import { DisputesService } from './modules/disputes/disputes.service.js';
import { DisputesController } from './modules/disputes/disputes.controller.js';
import { CheckoutService } from './modules/checkout/checkout.service.js';
import { ShippingService } from './modules/shipping/shipping.service.js';
import { ReturnsService } from './modules/returns/returns.service.js';
import { PayoutsService } from './modules/payouts/payouts.service.js';
import { AdminRepairService } from './modules/admin/repair/admin-repair.service.js';
import { AdminRepairController } from './modules/admin/repair/admin-repair.controller.js';
import { LedgerHealthDetectorService } from './modules/ledger/ledger-health.service.js';
import { RiskEngineService } from './modules/trust/risk-engine.service.js';
import { RiskEngineController } from './modules/trust/risk-engine.controller.js';
import { TelemetryService } from './modules/observability/telemetry.service.js';
import { SecurityService } from './modules/security/security.service.js';

@Module({
  imports: [],
  controllers: [
    VendorController,
    CatalogController,
    OffersController,
    SearchController,
    ShippingController,
    DisputesController,
    AdminRepairController,
    RiskEngineController,
  ],
  providers: [
    DatabaseService,
    OutboxService,
    LedgerService,
    InventoryService,
    VendorService,
    CsvImportService,
    CatalogService,
    OffersService,
    SearchService,
    CheckoutService,
    ShippingService,
    ReturnsService,
    PayoutsService,
    DisputesService,
    AdminRepairService,
    LedgerHealthDetectorService,
    RiskEngineService,
    TelemetryService,
    SecurityService,
  ],
  exports: [
    DatabaseService,
    OutboxService,
    LedgerService,
    InventoryService,
    VendorService,
    CatalogService,
    OffersService,
    SearchService,
    CheckoutService,
    ShippingService,
    ReturnsService,
    PayoutsService,
    DisputesService,
    AdminRepairService,
    LedgerHealthDetectorService,
    RiskEngineService,
    TelemetryService,
    SecurityService,
  ],
})
export class AppModule {}
