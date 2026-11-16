import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service.js';
import { CatalogService } from '../../catalog/catalog.service.js';
import { OffersService } from '../../offers/offers.service.js';
import { InventoryService } from '../../inventory/inventory.service.js';

export interface CsvImportRow {
  sku: string;
  title: string;
  description: string;
  categoryId: string;
  brandName?: string;
  condition: 'new' | 'refurbished_excellent' | 'refurbished_good' | 'used';
  priceMinor: string;
  currency: string;
  weightG: string;
  stockQty: string;
  warehouseCode: string;
}

export interface CsvImportReport {
  jobId: string;
  dryRun: boolean;
  totalRows: number;
  validRows: number;
  errorCount: number;
  errors: Array<{ row: number; field: string; message: string }>;
  createdVariantCount: number;
  createdOfferCount: number;
}

@Injectable()
export class CsvImportService {
  constructor(
    private readonly db: DatabaseService,
    private readonly catalog: CatalogService,
    private readonly offers: OffersService,
    private readonly inventory: InventoryService
  ) {}

  public parseCsvString(csvContent: string): CsvImportRow[] {
    const lines = csvContent
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) {
      throw new BadRequestException('CSV file is empty or missing headers.');
    }

    const headers = lines[0].split(',').map((h) => h.trim());
    const expectedHeaders = ['sku', 'title', 'categoryId', 'priceMinor', 'currency', 'stockQty'];
    for (const expected of expectedHeaders) {
      if (!headers.includes(expected)) {
        throw new BadRequestException(`CSV missing required header column: '${expected}'`);
      }
    }

    const rows: CsvImportRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const rowObj: any = {};
      headers.forEach((header, idx) => {
        rowObj[header] = values[idx] ?? '';
      });
      rows.push(rowObj as CsvImportRow);
    }

    return rows;
  }

  public async processImport(
    vendorId: string,
    rows: CsvImportRow[],
    dryRun: boolean = false
  ): Promise<CsvImportReport> {
    const jobId = crypto.randomUUID();
    const errors: Array<{ row: number; field: string; message: string }> = [];
    let validRows = 0;
    let createdVariantCount = 0;
    let createdOfferCount = 0;

    // 1. Fetch vendor's primary warehouse for inventory intake
    const warehouseRes = await this.db.query(
      `SELECT id, code FROM vendor.warehouses WHERE vendor_id = $1`,
      [vendorId]
    );
    const warehouses = warehouseRes.rows;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // account for 1-based index and header line

      // Row validation
      if (!row.sku || row.sku.length < 3) {
        errors.push({ row: rowNum, field: 'sku', message: 'SKU must be at least 3 characters' });
        continue;
      }

      if (!row.title || row.title.length < 3) {
        errors.push({ row: rowNum, field: 'title', message: 'Title is required' });
        continue;
      }

      const priceMinor = BigInt(row.priceMinor || '0');
      if (priceMinor <= 0n) {
        errors.push({ row: rowNum, field: 'priceMinor', message: 'Price must be greater than zero' });
        continue;
      }

      const stockQty = parseInt(row.stockQty || '0', 10);
      if (isNaN(stockQty) || stockQty < 0) {
        errors.push({ row: rowNum, field: 'stockQty', message: 'Stock quantity cannot be negative' });
        continue;
      }

      const warehouse = warehouses.find((w) => w.code === row.warehouseCode) || warehouses[0];
      if (!warehouse) {
        errors.push({
          row: rowNum,
          field: 'warehouseCode',
          message: `No active warehouse found for vendor ${vendorId}`,
        });
        continue;
      }

      validRows++;

      // If dry run, do not write to database
      if (dryRun) {
        continue;
      }

      // Execute atomic import transaction per valid row
      await this.db.transaction(async (client) => {
        // 1. Upsert master product
        const prodRes = await client.query(
          `INSERT INTO catalog.master_products (title, description, category_id, brand_name, status, attributes)
           VALUES ($1, $2, $3, $4, 'published', '{}')
           RETURNING id`,
          [row.title, row.description || row.title, row.categoryId, row.brandName ?? null]
        );
        const productId = prodRes.rows[0].id;

        // 2. Upsert variant
        const weightG = parseInt(row.weightG || '500', 10);
        const variantRes = await client.query(
          `INSERT INTO catalog.variants (master_product_id, sku_canonical, weight_g, option_values)
           VALUES ($1, $2, $3, '{}')
           ON CONFLICT (sku_canonical) DO UPDATE SET weight_g = EXCLUDED.weight_g
           RETURNING id`,
          [productId, row.sku, weightG]
        );
        const variantId = variantRes.rows[0].id;
        createdVariantCount++;

        // 3. Upsert offer
        const shippingProfileId = crypto.randomUUID();
        const policyTemplateId = crypto.randomUUID();

        const offerRes = await client.query(
          `INSERT INTO offers.offers (
            vendor_id, variant_id, condition, price_minor, currency,
            handling_time_hours, shipping_profile_id, policy_template_id, status, version
           ) VALUES ($1, $2, $3, $4, $5, 24, $6, $7, 'active', 1)
           RETURNING id`,
          [
            vendorId,
            variantId,
            row.condition || 'new',
            priceMinor.toString(),
            (row.currency || 'NGN').toUpperCase(),
            shippingProfileId,
            policyTemplateId,
          ]
        );
        createdOfferCount++;

        // 4. Initial stock intake
        if (stockQty > 0) {
          await client.query(
            `INSERT INTO inventory.stock_levels (variant_id, warehouse_id, on_hand, reserved, safety_stock, updated_at)
             VALUES ($1, $2, $3, 0, 0, NOW())
             ON CONFLICT (variant_id, warehouse_id)
             DO UPDATE SET on_hand = inventory.stock_levels.on_hand + EXCLUDED.on_hand,
                           updated_at = NOW()`,
            [variantId, warehouse.id, stockQty]
          );

          await client.query(
            `INSERT INTO inventory.movements (variant_id, warehouse_id, delta, reason, ref_type, ref_id, actor)
             VALUES ($1, $2, $3, 'intake', 'bulk_import', $4, $5)`,
            [variantId, warehouse.id, stockQty, jobId, `vendor:${vendorId}`]
          );
        }
      });
    }

    return {
      jobId,
      dryRun,
      totalRows: rows.length,
      validRows,
      errorCount: errors.length,
      errors,
      createdVariantCount,
      createdOfferCount,
    };
  }
}
