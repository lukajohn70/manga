import { NextResponse } from 'next/server';
import { getDbProductById } from '../../../../lib/db-catalog';
import { findProductById } from '../../../../lib/catalog';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await getDbProductById(id);

    if (result.product) {
      return NextResponse.json({
        success: true,
        product: result.product,
        source: result.source,
      });
    }

    const fallback = findProductById(id);
    return NextResponse.json({
      success: true,
      product: fallback,
      source: 'fallback_resilient',
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      product: findProductById('66666666-6666-6666-6666-666666666661'),
      source: 'fallback_resilient',
      error: err?.message,
    });
  }
}
