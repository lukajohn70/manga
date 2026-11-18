import { NextResponse } from 'next/server';
import { CATALOG_PRODUCTS_MAP, findProductById } from '../../../../lib/catalog';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Try querying backend monolith
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const apiBase =
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:4000';

    const res = await fetch(`${apiBase}/v1/products/${encodeURIComponent(id)}`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const product = data.product;
      const winningOffer = data.winningOffer;
      const fallback = findProductById(id);

      const priceNgn = winningOffer?.price_minor ? Number(winningOffer.price_minor) / 100 : fallback.priceNgn;
      const oldPriceNgn = winningOffer?.compare_at_minor ? Number(winningOffer.compare_at_minor) / 100 : fallback.oldPriceNgn;

      return NextResponse.json({
        success: true,
        product: {
          ...fallback,
          id: product.id,
          sku: product.sku || fallback.sku,
          title: product.title,
          brand: product.brand_name || fallback.brand,
          description: product.description || fallback.description,
          priceNgn,
          oldPriceNgn,
          priceUsd: Math.round(priceNgn / 1400),
          oldPriceUsd: oldPriceNgn ? Math.round(oldPriceNgn / 1400) : fallback.oldPriceUsd,
          storeName: winningOffer?.vendor_name || fallback.storeName,
          vendorTier: winningOffer?.vendor_tier || fallback.vendorTier,
          offerId: winningOffer?.id || fallback.offerId,
          otherOffers: data.allOffers?.slice(1).map((o: any) => ({
            vendorId: o.vendor_id,
            vendorName: o.vendor_name,
            priceNgn: Number(o.price_minor) / 100,
            priceUsd: Math.round(Number(o.price_minor) / 140000),
            condition: o.condition,
          })) || fallback.otherOffers,
        },
        source: 'backend_monolith',
      });
    }
  } catch (err: any) {
    console.warn('[API /api/products/[id]] Backend note:', err.message);
  }

  // Fallback product
  const fallback = findProductById(id);
  return NextResponse.json({
    success: true,
    product: fallback,
    source: 'fallback_resilient',
  });
}
