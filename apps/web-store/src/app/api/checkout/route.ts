import { NextResponse } from 'next/server';
import { createDbOrder } from '../../../lib/db-orders';

interface CheckoutPayload {
  buyerId?: string;
  items: Array<{
    id: string;
    offerId?: string;
    name: string;
    seller?: string;
    priceNgn: number;
    priceUsd: number;
    quantity: number;
    image?: string;
  }>;
  customer: {
    name: string;
    email: string;
    phone: string;
    state: string;
    lga?: string;
    address: string;
  };
  deliveryType?: 'doorstep' | 'pickup';
  paymentMethod?: string;
  paymentRef?: string;
  totals?: {
    subtotalNgn?: number;
    deliveryFeeNgn?: number;
    discountNgn?: number;
    totalNgn?: number;
    totalUsd?: number;
  };
}

export async function POST(request: Request) {
  try {
    const payload: CheckoutPayload = await request.json();

    const items = payload.items || [];
    const subtotal = items.reduce((acc, it) => acc + (it.priceNgn || 0) * (it.quantity || 1), 0);
    const deliveryFee = payload.deliveryType === 'doorstep' ? 2500 : 0;
    const totalNgn = payload.totals?.totalNgn || subtotal + deliveryFee;
    const totalUsd = payload.totals?.totalUsd || Math.round(totalNgn / 1400);

    const result = await createDbOrder({
      buyerId: payload.buyerId,
      buyerEmail: payload.customer.email,
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        seller: it.seller || 'Manga Verified Vendor',
        priceNgn: it.priceNgn,
        priceUsd: it.priceUsd,
        quantity: it.quantity,
        image: it.image,
      })),
      customer: {
        name: payload.customer.name,
        phone: payload.customer.phone,
        address: `${payload.customer.address}, ${payload.customer.lga || ''}`,
        city: payload.customer.lga || 'Ikeja',
        state: payload.customer.state,
      },
      deliveryType: payload.deliveryType || 'doorstep',
      paymentMethod: payload.paymentMethod || 'Paystack Escrow Card',
      paymentRef: payload.paymentRef,
      totals: {
        subtotalNgn: subtotal,
        deliveryFeeNgn: deliveryFee,
        discountNgn: 0,
        totalNgn,
        totalUsd,
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: result.orderNumber,
      orderId: result.orderId,
      status: result.status,
      currency: result.currency,
      paymentRef: result.paymentRef,
      placedAt: result.placedAt,
      message: 'Payment authorized and verified in database.',
      source: result.source,
    });
  } catch (error: any) {
    console.error('[API Checkout Error]', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Unable to process checkout. Please try again.',
      },
      { status: 400 }
    );
  }
}
