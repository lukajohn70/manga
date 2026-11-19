import { NextResponse } from 'next/server';
import { getDbOrderByRef } from '../../../../lib/db-orders';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await params;
    const cleanRef = decodeURIComponent(ref).trim();

    const dbOrder = await getDbOrderByRef(cleanRef);

    if (dbOrder) {
      return NextResponse.json({
        success: true,
        data: dbOrder,
        source: dbOrder.source,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'No shipment found matching reference ' + cleanRef,
        data: null,
      },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Error looking up tracking details',
        data: null,
      },
      { status: 500 }
    );
  }
}
