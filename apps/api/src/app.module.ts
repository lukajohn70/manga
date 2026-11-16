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
import { CheckoutService } from './modules/checkout/checkout.service.js';
import { ShippingService } from './modules/shipping/shipping.service.js';
import { ReturnsService } from './modules/returns/returns.service.js';
import { PayoutsService } from './modules/payouts/payouts.service.js';

@Module({
  imports: [],
  controllers: [
    VendorController,
    CatalogController,
    OffersController,
    SearchController,
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
  ],
})
export class AppModule {}
