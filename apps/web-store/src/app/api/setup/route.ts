import { NextResponse } from 'next/server';
import { query, checkDatabaseConnection, sanitizeConnectionString } from '../../../lib/db';
import { ensureDatabaseReady, purgeDatabaseAndSeedAdmin, ADMIN_EMAIL } from '../../../lib/db-schema-init';
import { getSessionFromRequest, verifyCsrf } from '../../../lib/security';

function isAuthorizedAdmin(request: Request): boolean {
  // 1. Check session cookie or Bearer token for ADMIN role
  const session = getSessionFromRequest(request);
  if (session && session.role === 'ADMIN') {
    return true;
  }

  // 2. Optional internal admin key for automated deployment scripts
  const adminKey = request.headers.get('x-admin-key');
  const expectedKey = process.env.ADMIN_SECRET_KEY;
  if (adminKey && expectedKey && adminKey === expectedKey) {
    return true;
  }

  return false;
}

export async function GET(request: Request) {
  try {
    // 1. Strict Administrator Authorization Guard
    if (!isAuthorizedAdmin(request)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access denied: Platform Administrator privileges required.',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';
    const action = searchParams.get('action');
    const conn = await checkDatabaseConnection();

    if (!conn.connected) {
      return NextResponse.json({
        success: false,
        database: 'PostgreSQL',
        driverInstalled: conn.driverInstalled,
        connected: false,
        error: 'Database connection failed',
        configuredTarget: conn.sanitizedUrl || 'not_configured',
      });
    }

    // Explicit purge action requested by authenticated admin
    let purgeMessage: string | null = null;
    if (action === 'purge' || searchParams.get('purge') === 'true') {
      const purgeRes = await purgeDatabaseAndSeedAdmin();
      purgeMessage = purgeRes.message;
    } else {
      await ensureDatabaseReady(force);
    }

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
        counts[table] = -1;
      }
    }

    let adminUserExists = false;
    try {
      const adminRes = await query('SELECT email, role FROM identity.users WHERE email ILIKE $1', [ADMIN_EMAIL]);
      adminUserExists = adminRes.rows && adminRes.rows.length > 0;
    } catch {}

    const rawUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
    const cleanUrl = sanitizeConnectionString(rawUrl);
    const maskedHost = cleanUrl ? cleanUrl.replace(/:[^:@]*@/, ':****@') : 'configured via environment';

    return NextResponse.json({
      success: true,
      database: 'PostgreSQL',
      connected: true,
      driverInstalled: true,
      version: conn.version,
      host: maskedHost,
      purgeMessage,
      adminEmail: ADMIN_EMAIL,
      adminConfigured: adminUserExists,
      tableCounts: counts,
      ready: true,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Operations diagnostic encountered an error.',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Strict Administrator Authorization Guard
    if (!isAuthorizedAdmin(request)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access denied: Platform Administrator privileges required.',
        },
        { status: 403 }
      );
    }

    // 2. CSRF verification
    if (!verifyCsrf(request)) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing CSRF token.' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    if (body.action === 'purge') {
      const result = await purgeDatabaseAndSeedAdmin();
      return NextResponse.json(result);
    }

    const result = await ensureDatabaseReady();
    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Setup operation failed.' },
      { status: 500 }
    );
  }
}
