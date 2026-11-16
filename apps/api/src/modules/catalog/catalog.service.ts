import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { OutboxService } from '../outbox/outbox.service.js';
import { DomainEventNames } from '@manga/domain';

export class CreateCategoryDto {
  slug!: string;
  name!: string;
  parentId?: string;
  iconUrl?: string;
}

export class DefineAttributeDto {
  categoryId!: string;
  key!: string;
  type!: 'string' | 'number' | 'boolean' | 'enum';
  constraints?: Record<string, any>;
  facetable?: boolean;
  required?: boolean;
}

export class CreateMasterProductDto {
  title!: string;
  description!: string;
  categoryId!: string;
  brandName?: string;
  gtin?: string;
  attributes!: Record<string, any>;
}

export class CreateVariantDto {
  masterProductId!: string;
  skuCanonical!: string;
  optionValues!: Record<string, string>;
  weightG!: number;
  dimsMm?: { length: number; width: number; height: number };
  gtin?: string;
  hsCode?: string;
}

@Injectable()
export class CatalogService {
  constructor(
    private readonly db: DatabaseService,
    private readonly outbox: OutboxService
  ) {}

  public async createCategory(dto: CreateCategoryDto): Promise<any> {
    const res = await this.db.query(
      `INSERT INTO catalog.categories (slug, name, parent_id, icon_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [dto.slug, dto.name, dto.parentId ?? null, dto.iconUrl ?? null]
    );
    return res.rows[0];
  }

  public async defineAttribute(dto: DefineAttributeDto): Promise<any> {
    const res = await this.db.query(
      `INSERT INTO catalog.attribute_definitions (category_id, key, type, constraints, facetable, required)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        dto.categoryId,
        dto.key,
        dto.type,
        JSON.stringify(dto.constraints ?? {}),
        dto.facetable ?? false,
        dto.required ?? false,
      ]
    );
    return res.rows[0];
  }

  public async createMasterProduct(dto: CreateMasterProductDto): Promise<any> {
    // 1. Fetch category attribute definitions for validation
    const attrDefsRes = await this.db.query(
      `SELECT * FROM catalog.attribute_definitions WHERE category_id = $1`,
      [dto.categoryId]
    );
    const defs = attrDefsRes.rows;

    // 2. Validate required attributes and type constraints
    for (const def of defs) {
      const val = dto.attributes[def.key];
      if (def.required && (val === undefined || val === null || val === '')) {
        throw new BadRequestException(
          `Missing required attribute '${def.key}' for category '${dto.categoryId}'`
        );
      }

      if (val !== undefined && val !== null) {
        if (def.type === 'number' && typeof val !== 'number') {
          throw new BadRequestException(`Attribute '${def.key}' must be a number`);
        }
        if (def.type === 'string' && typeof val !== 'string') {
          throw new BadRequestException(`Attribute '${def.key}' must be a string`);
        }
        if (def.type === 'boolean' && typeof val !== 'boolean') {
          throw new BadRequestException(`Attribute '${def.key}' must be a boolean`);
        }
      }
    }

    // 3. Insert Master Product
    const res = await this.db.query(
      `INSERT INTO catalog.master_products (title, description, category_id, brand_name, gtin, status, attributes)
       VALUES ($1, $2, $3, $4, $5, 'pending_moderation', $6)
       RETURNING *`,
      [
        dto.title,
        dto.description,
        dto.categoryId,
        dto.brandName ?? null,
        dto.gtin ?? null,
        JSON.stringify(dto.attributes),
      ]
    );

    return res.rows[0];
  }

  public async createVariant(dto: CreateVariantDto): Promise<any> {
    const res = await this.db.query(
      `INSERT INTO catalog.variants (master_product_id, sku_canonical, option_values, weight_g, dims_mm, gtin, hs_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        dto.masterProductId,
        dto.skuCanonical,
        JSON.stringify(dto.optionValues),
        dto.weightG,
        JSON.stringify(dto.dimsMm ?? {}),
        dto.gtin ?? null,
        dto.hsCode ?? null,
      ]
    );

    return res.rows[0];
  }

  public async moderateProduct(
    productId: string,
    status: 'published' | 'rejected'
  ): Promise<any> {
    const res = await this.db.query(
      `UPDATE catalog.master_products SET status = $1 WHERE id = $2 RETURNING *`,
      [status, productId]
    );

    if (res.rows.length === 0) {
      throw new NotFoundException(`Master product ${productId} not found`);
    }

    const product = res.rows[0];

    if (status === 'published') {
      await this.outbox.stageEvent({
        id: crypto.randomUUID(),
        name: DomainEventNames.PRODUCT_PUBLISHED,
        aggregateType: 'product',
        aggregateId: productId,
        correlationId: crypto.randomUUID(),
        timestamp: new Date(),
        payload: {
          productId,
          title: product.title,
          categoryId: product.category_id,
        },
      });
    }

    return product;
  }
}
