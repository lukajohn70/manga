import { describe, it, expect, beforeEach } from 'vitest';
import { MockDatabaseService } from './mock-database.service.js';
import { OutboxService } from '../src/modules/outbox/outbox.service.js';
import { VendorService } from '../src/modules/vendor/vendor.service.js';
import { InventoryService } from '../src/modules/inventory/inventory.service.js';
import { CatalogService } from '../src/modules/catalog/catalog.service.js';
import { OffersService } from '../src/modules/offers/offers.service.js';
import { CsvImportService } from '../src/modules/vendor/import/csv-import.service.js';

describe('Milestone 1: Vendor Management & Atomic Inventory', () => {
  let db: MockDatabaseService;
  let outbox: OutboxService;
  let vendorService: VendorService;
  let inventoryService: InventoryService;
  let catalogService: CatalogService;
  let offersService: OffersService;
  let csvImportService: CsvImportService;

  beforeEach(() => {
    db = new MockDatabaseService();
    outbox = new OutboxService();
    vendorService = new VendorService(db, outbox);
    inventoryService = new InventoryService(db, outbox);
    catalogService = new CatalogService(db, outbox);
    offersService = new OffersService(db, outbox);
    csvImportService = new CsvImportService(db, catalogService, offersService, inventoryService);
  });

  it('handles vendor registration and KYC verification lifecycle', async () => {
    const userId = crypto.randomUUID();
    const vendor = await vendorService.registerVendor({
      userId,
      businessName: 'Apex Electronics Ltd',
      legalEntityType: 'private_limited',
    });

    expect(vendor.status).toBe('pending_verification');
    expect(vendor.kyc_status).toBe('pending');

    // Submit KYC for verification
    const verifiedVendor = await vendorService.submitKyc({
      vendorId: vendor.id,
      businessName: vendor.business_name,
      legalEntityType: vendor.legal_entity_type,
      registrationNumber: 'RC-998822',
      beneficialOwners: [{ fullName: 'John Doe', dateOfBirth: '1985-06-15' }],
    });

    expect(verifiedVendor.status).toBe('active');
    expect(verifiedVendor.kyc_status).toBe('verified');
  });

  it('performs atomic inventory reservation and prevents overselling', async () => {
    const variantId = crypto.randomUUID();
    const warehouseId = crypto.randomUUID();

    // 1. Initial intake: 50 units with 5 safety stock
    await inventoryService.adjustStock({
      variantId,
      warehouseId,
      qty: 50,
      safetyStock: 5,
      reason: 'intake',
      refType: 'purchase_order',
      refId: 'PO-100',
      actor: 'warehouse_mgr',
    });

    // 2. Reserve 40 units -> Available is 50 - 0 - 5 = 45 units, so 40 succeeds
    const reservation = await inventoryService.reserveStock({
      orderRef: 'ORDER-101',
      variantId,
      warehouseId,
      qty: 40,
    });
    expect(reservation.status).toBe('pending');

    // 3. Attempt to reserve 10 units -> Available is 50 - 40 - 5 = 5 units, so 10 must fail
    await expect(
      inventoryService.reserveStock({
        orderRef: 'ORDER-102',
        variantId,
        warehouseId,
        qty: 10,
      })
    ).rejects.toThrow(/Insufficient available stock/);

    // 4. Idempotently release reservation 1 -> Restores available units
    await inventoryService.releaseReservation(reservation.id);

    // 5. Now reserving 10 units succeeds
    const nextReservation = await inventoryService.reserveStock({
      orderRef: 'ORDER-103',
      variantId,
      warehouseId,
      qty: 10,
    });
    expect(nextReservation.status).toBe('pending');
  });

  it('validates CSV imports in dry-run mode and flags invalid rows', async () => {
    const vendorId = crypto.randomUUID();
    // Add warehouse
    db.tables['vendor.warehouses'].push({
      id: crypto.randomUUID(),
      vendor_id: vendorId,
      code: 'WH-MAIN',
    });

    const csvContent = `sku,title,categoryId,priceMinor,currency,stockQty,warehouseCode
SKU-001,Valid Headphones,cat-1,1500000,NGN,20,WH-MAIN
X,Too Short Title,cat-1,50000,NGN,5,WH-MAIN
SKU-003,Zero Price Item,cat-1,0,NGN,10,WH-MAIN
SKU-004,Negative Stock Item,cat-1,200000,NGN,-5,WH-MAIN`;

    const rows = csvImportService.parseCsvString(csvContent);
    const report = await csvImportService.processImport(vendorId, rows, true);

    expect(report.dryRun).toBe(true);
    expect(report.totalRows).toBe(4);
    expect(report.validRows).toBe(1);
    expect(report.errorCount).toBe(3);

    // Ensure database remained untouched during dry-run
    expect(db.tables['catalog.variants'].length).toBe(0);
    expect(db.tables['offers.offers'].length).toBe(0);
  });
});
