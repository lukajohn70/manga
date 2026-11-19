import { NextResponse } from 'next/server';
import { getDbOrdersByEmail, createDbOrder } from '../../../lib/db-orders';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { success: false, message: 'Buyer email query parameter is required.' },
      { status: 400 }
    );
  }

  const orders = await getDbOrdersByEmail(email);

  return NextResponse.json({
    success: true,
    orders,
    count: orders.length,
    source: 'database_postgres',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createDbOrder(body);

    return NextResponse.json({
      success: true,
      order: result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
