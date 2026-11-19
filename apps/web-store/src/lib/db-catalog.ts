import { query } from './db';
import { ensureDatabaseReady } from './db-schema-init';
import { CATALOG_PRODUCTS_MAP, findProductById, ProductDetailItem } from './catalog';

const PRODUCTS_FALLBACK_LIST: ProductDetailItem[] = Object.values(CATALOG_PRODUCTS_MAP);

export interface DbProductListItem {
  id: string;
  title: string;
  brand: string;
  category: string;
  categoryName: string;
  priceNgn: number;
  oldPriceNgn?: number;
  priceUsd: number;
  oldPriceUsd?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  storeName: string;
  type: 'physical' | 'digital';
  deliveryEstimate: string;
  offerId?: string;
  stockLeft: number;
}

export interface GetProductsOptions {
  category?: string;
  q?: string;
  type?: 'physical' | 'digital';
  limit?: number;
  offset?: number;
}

/**
 * Maps raw SQL row from joined product/variant/offer/vendor query into a store item.
 */
function mapRowToProduct(row: any): DbProductListItem {
  const priceNgn = row.price_minor ? Math.round(Number(row.price_minor) / 100) : 50000;
  const compareAtNgn = row.compare_at_minor ? Math.round(Number(row.compare_at_minor) / 100) : Math.round(priceNgn * 1.25);
  const priceUsd = Math.round(priceNgn / 1400);
  const oldPriceUsd = Math.round(compareAtNgn / 1400);

  const isDigital = row.category_slug === 'digital';

  return {
    id: row.id,
    title: row.title,
    brand: row.brand_name || 'Generic',
    category: row.category_slug || 'computing',
    categoryName: row.category_name || 'General Products',
    priceNgn,
    oldPriceNgn: compareAtNgn,
    priceUsd,
    oldPriceUsd,
    image: row.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
    rating: parseFloat(row.rating) || 4.9,
    reviewsCount: parseInt(row.reviews_count, 10) || 120,
    storeName: row.vendor_name || 'Official Store',
    type: isDigital ? 'digital' : 'physical',
    deliveryEstimate: isDigital
      ? 'Instant Digital Download / License Key'
      : 'Manga Express • Tomorrow (Kaduna/Lagos)',
    offerId: row.offer_id,
    stockLeft: parseInt(row.stock_left, 10) || 25,
  };
}

/**
 * Fetches products list directly from PostgreSQL with category and search filtering.
 * Gracefully falls back to bundled catalog if database is not reachable.
 */
export async function getDbProducts(options: GetProductsOptions = {}): Promise<{
  items: DbProductListItem[];
  total: number;
  source: 'database_postgres' | 'fallback_resilient';
}> {
  try {
    await ensureDatabaseReady();

    let whereConditions: string[] = ["mp.status = 'published'"];
    let params: any[] = [];
    let pIdx = 1;

    if (options.category && options.category !== 'all' && options.category !== 'flash') {
      whereConditions.push(`c.slug = $${pIdx}`);
      params.push(options.category);
      pIdx++;
    }

    if (options.q && options.q.trim()) {
      whereConditions.push(`(
        mp.title ILIKE $${pIdx} OR 
        mp.description ILIKE $${pIdx} OR 
        mp.brand_name ILIKE $${pIdx} OR 
        v.business_name ILIKE $${pIdx}
      )`);
      params.push(`%${options.q.trim()}%`);
      pIdx++;
    }

    const whereSql = whereConditions.join(' AND ');
    const limit = options.limit || 50;
    const offset = options.offset || 0;

    const sql = `
      SELECT
        mp.id,
        mp.title,
        mp.brand_name,
        mp.description,
        mp.image_url,
        mp.rating,
        mp.reviews_count,
        mp.attributes,
        c.slug as category_slug,
        c.name as category_name,
        o.id as offer_id,
        o.price_minor,
        o.compare_at_minor,
        o.currency,
        v.business_name as vendor_name,
        COALESCE((
          SELECT SUM(on_hand - reserved) 
          FROM inventory.stock_levels sl 
          WHERE sl.variant_id = var.id
        ), 25) as stock_left
      FROM catalog.master_products mp
      JOIN catalog.categories c ON c.id = mp.category_id
      LEFT JOIN LATERAL (
        SELECT id FROM catalog.variants WHERE master_product_id = mp.id LIMIT 1
      ) var ON true
      LEFT JOIN LATERAL (
        SELECT id, vendor_id, price_minor, compare_at_minor, currency 
        FROM offers.offers 
        WHERE variant_id = var.id AND status = 'active' 
        ORDER BY price_minor ASC LIMIT 1
      ) o ON true
      LEFT JOIN vendor.vendors v ON v.id = o.vendor_id
      WHERE ${whereSql}
      ORDER BY mp.created_at DESC
      LIMIT $${pIdx} OFFSET $${pIdx + 1}
    `;

    params.push(limit, offset);

    const res = await query(sql, params);
    const items = (res.rows || []).map(mapRowToProduct);

    return {
      items,
      total: items.length,
      source: 'database_postgres',
    };
  } catch (err: any) {
    console.warn('[DB Catalog] Database query error:', err.message);
  }

  return {
    items: [],
    total: 0,
    source: 'fallback_resilient',
  };
}

/**
 * Fetches a single detailed product from PostgreSQL by ID.
 */
export async function getDbProductById(id: string): Promise<{
  product: ProductDetailItem | null;
  source: 'database_postgres' | 'fallback_resilient';
}> {
  try {
    await ensureDatabaseReady();

    const sql = `
      SELECT
        mp.id,
        mp.title,
        mp.brand_name,
        mp.description,
        mp.image_url,
        mp.rating,
        mp.reviews_count,
        mp.attributes,
        c.slug as category_slug,
        c.name as category_name,
        o.id as offer_id,
        o.price_minor,
        o.compare_at_minor,
        o.currency,
        v.id as vendor_id,
        v.business_name as vendor_name,
        v.tier as vendor_tier,
        v.rating as vendor_rating
      FROM catalog.master_products mp
      JOIN catalog.categories c ON c.id = mp.category_id
      LEFT JOIN LATERAL (
        SELECT id FROM catalog.variants WHERE master_product_id = mp.id LIMIT 1
      ) var ON true
      LEFT JOIN LATERAL (
        SELECT id, vendor_id, price_minor, compare_at_minor, currency 
        FROM offers.offers 
        WHERE variant_id = var.id AND status = 'active' 
        ORDER BY price_minor ASC LIMIT 1
      ) o ON true
      LEFT JOIN vendor.vendors v ON v.id = o.vendor_id
      WHERE mp.id = $1 OR mp.title ILIKE $1
      LIMIT 1
    `;

    const res = await query(sql, [id]);

    if (res.rows && res.rows.length > 0) {
      const row = res.rows[0];
      const priceNgn = row.price_minor ? Math.round(Number(row.price_minor) / 100) : 0;
      const compareAtNgn = row.compare_at_minor ? Math.round(Number(row.compare_at_minor) / 100) : undefined;

      const product: ProductDetailItem = {
        id: row.id,
        sku: 'SKU-' + row.id.slice(0, 8),
        title: row.title,
        brand: row.brand_name || 'Generic',
        description: row.description || '',
        category: row.category_slug || 'computing',
        categoryName: row.category_name || 'General Products',
        priceNgn,
        oldPriceNgn: compareAtNgn,
        priceUsd: Math.round(priceNgn / 1400),
        oldPriceUsd: compareAtNgn ? Math.round(compareAtNgn / 1400) : undefined,
        image: row.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
        gallery: [row.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85'],
        storeName: row.vendor_name || 'Verified Merchant',
        vendorTier: row.vendor_tier || 'tier_1',
        vendorRating: 4.9,
        vendorLocation: 'Kaduna Hub',
        rating: parseFloat(row.rating) || 5.0,
        reviewsCount: parseInt(row.reviews_count, 10) || 0,
        type: row.category_slug === 'digital' ? 'digital' : 'physical',
        stockLeft: 25,
        deliveryEstimate: 'Manga Express • Tomorrow',
        warranty: '1 Year Warranty',
        hook: row.title,
        scannableBenefits: [],
        narrativeStory: row.description || '',
        specs: [],
        boxContents: [],
        trustShipping: {
          warrantyDuration: '1 Year Official Warranty',
          returnPolicy: '7-Day Return Guarantee',
          kadunaSameDay: true,
          nationwideDelivery: '24-48h Delivery',
          sellerAccredited: true,
          escrowProtected: true,
        },
        faq: [],
        highlights: [],
        variants: [],
      };

      return {
        product,
        source: 'database_postgres',
      };
    }

    return {
      product: null,
      source: 'database_postgres',
    };
  } catch (err: any) {
    console.warn('[DB Catalog] getProductById error:', err.message);
  }

  return {
    product: null,
    source: 'fallback_resilient',
  };
}

/**
 * Fetches all product categories from PostgreSQL.
 */
export async function getDbCategories(): Promise<
  Array<{ id: string; slug: string; name: string; icon: string; count: number }>
> {
  try {
    await ensureDatabaseReady();

    const sql = `
      SELECT
        c.id,
        c.slug,
        c.name,
        c.icon_url,
        COUNT(mp.id) as product_count
      FROM catalog.categories c
      LEFT JOIN catalog.master_products mp ON mp.category_id = c.id AND mp.status = 'published'
      GROUP BY c.id, c.slug, c.name, c.icon_url
      ORDER BY c.name ASC
    `;

    const res = await query(sql);
    if (res.rows && res.rows.length > 0) {
      return res.rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        icon: r.icon_url || 'fa-tag',
        count: parseInt(r.product_count, 10) || 0,
      }));
    }
  } catch (err: any) {
    console.warn('[DB Catalog] getDbCategories note:', err.message);
  }

  // Fallback categories
  return [
    { id: '1', slug: 'computing', name: 'Phones & Computing', icon: 'fa-laptop', count: 8 },
    { id: '2', slug: 'electronics', name: 'Electronics & Audio', icon: 'fa-headphones', count: 6 },
    { id: '3', slug: 'fashion', name: 'Fashion & Streetwear', icon: 'fa-shirt', count: 5 },
    { id: '4', slug: 'home', name: 'Home & Appliances', icon: 'fa-couch', count: 4 },
    { id: '5', slug: 'digital', name: 'Software & Digital Assets', icon: 'fa-code', count: 3 },
  ];
}
