import { NextResponse } from 'next/server';
import { query, checkDatabaseConnection, sanitizeConnectionString } from '../../../lib/db';
import { ensureDatabaseReady } from '../../../lib/db-schema-init';

export async function GET() {
  try {
    const conn = await checkDatabaseConnection();

    if (!conn.connected) {
      return NextResponse.json({
        success: false,
        database: 'PostgreSQL',
        driverInstalled: conn.driverInstalled,
        connected: false,
        error: conn.error,
        configuredTarget: conn.sanitizedUrl || 'not_configured',
        instructions: !conn.driverInstalled
          ? 'The "pg" PostgreSQL driver module is missing in cPanel node_modules. Please click "Run NPM Install" in cPanel Setup Node.js App.'
          : 'Ensure DATABASE_URL is set in cPanel with host 127.0.0.1: postgres://USER:PASSWORD@127.0.0.1:5432/DB_NAME, then click the blue SAVE button at the top-right and RESTART.',
      });
    }

    // Database is connected! Ensure schemas & tables exist
    const initResult = await ensureDatabaseReady();

    // Inspect table row counts
    let counts: Record<string, number> = {};
    const tables = [
      'catalog.categories',
      'catalog.master_products',
      'catalog.variants',
      'offers.offers',
      'vendor.vendors',
      'identity.users',
      'orders.orders',
      'shipping.shipments',
    ];

    for (const table of tables) {
      try {
        const res = await query(`SELECT COUNT(*) as count FROM ${table}`);
        counts[table] = parseInt(res.rows[0]?.count || '0', 10);
      } catch {
        counts[table] = -1; // table might not exist yet
      }
    }

    // Get sample products
    let sampleProducts: any[] = [];
    try {
      const prodRes = await query(`
        SELECT mp.id, mp.title, c.name as category, v.business_name as seller, o.price_minor / 100 as price_ngn
        FROM catalog.master_products mp
        LEFT JOIN catalog.categories c ON c.id = mp.category_id
        LEFT JOIN catalog.variants var ON var.master_product_id = mp.id
        LEFT JOIN offers.offers o ON o.variant_id = var.id
        LEFT JOIN vendor.vendors v ON v.id = o.vendor_id
        WHERE mp.status = 'published'
        LIMIT 5
      `);
      sampleProducts = prodRes.rows;
    } catch {}

    const rawUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
    const cleanUrl = sanitizeConnectionString(rawUrl);
    const maskedHost = cleanUrl ? cleanUrl.replace(/:[^:@]*@/, ':****@') : 'configured via POSTGRES_* envs';

    return NextResponse.json({
      success: true,
      database: 'PostgreSQL',
      connected: true,
      driverInstalled: true,
      version: conn.version,
      host: maskedHost,
      initMessage: initResult.message,
      tableCounts: counts,
      sampleProducts,
      ready: true,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Unknown error occurred in /api/setup',
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
      },
      { status: 200 } // Return 200 with error details in JSON so browser never gets raw 500 HTML
    );
  }
}

export async function POST() {
  try {
    const result = await ensureDatabaseReady();
    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
