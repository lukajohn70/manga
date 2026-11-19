import { NextResponse } from 'next/server';
import { getDbOrderByRef } from '../../../../lib/db-orders';
import { getSessionFromRequest, sanitizeString } from '../../../../lib/security';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await params;
    const cleanRef = sanitizeString(decodeURIComponent(ref || '')).trim();

    if (!cleanRef || cleanRef.length < 3 || cleanRef.length > 64) {
      return NextResponse.json(
        { success: false, message: 'Invalid order tracking reference format.' },
        { status: 400 }
      );
    }

    const session = getSessionFromRequest(request);
    const dbOrder = await getDbOrderByRef(cleanRef);

    if (dbOrder) {
      const isOwner = session && (session.email === dbOrder.buyerEmail || session.role === 'ADMIN');

      // Mask sensitive personal identity and street addresses for anonymous/third-party trackers
      const safeData = {
        ...dbOrder,
        address: isOwner
          ? dbOrder.address
          : {
              city: dbOrder.address?.city || 'Kaduna',
              state: dbOrder.address?.state || 'Kaduna State',
              country: 'Nigeria',
            },
      };

      return NextResponse.json({
        success: true,
        data: safeData,
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
        message: 'Error looking up tracking details',
        data: null,
      },
      { status: 500 }
    );
  }
}
