import { NextResponse } from 'next/server';
import { getDbOrdersByEmail, createDbOrder } from '../../../lib/db-orders';
import { getSessionFromRequest, verifyCsrf, validateEmail } from '../../../lib/security';

export async function GET(request: Request) {
  try {
    // 1. Enforce authentication: lock database so people only see their own data
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required. Please sign in to access your order history.',
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const requestedEmail = (searchParams.get('email') || session.email).toLowerCase().trim();

    // 2. Strict ID/Email isolation: regular users cannot query other buyers' orders
    const isOwner = session.email === requestedEmail;
    const isAdmin = session.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access denied: You are only authorized to access your own account records.',
        },
        { status: 403 }
      );
    }

    const orders = await getDbOrdersByEmail(requestedEmail);

    return NextResponse.json({
      success: true,
      orders,
      count: orders.length,
      source: 'database_postgres',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve orders.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // CSRF verification on state-changing requests
    if (!verifyCsrf(request)) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing CSRF token.' },
        { status: 403 }
      );
    }

    const session = getSessionFromRequest(request);
    const body = await request.json();

    const buyerEmail = (body.buyerEmail || session?.email || '').toLowerCase().trim();
    if (!validateEmail(buyerEmail)) {
      return NextResponse.json(
        { success: false, message: 'Valid buyer email is required.' },
        { status: 400 }
      );
    }

    // If authenticated as non-admin, force the buyerEmail to match session
    if (session && session.role !== 'ADMIN' && session.email !== buyerEmail) {
      return NextResponse.json(
        { success: false, message: 'Authenticated user mismatch.' },
        { status: 403 }
      );
    }

    const result = await createDbOrder({
      ...body,
      buyerEmail,
      buyerId: session?.userId || body.buyerId,
    });

    return NextResponse.json({
      success: true,
      order: result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to create order.' },
      { status: 500 }
    );
  }
}
