import { NextResponse } from 'next/server';
import { getDbProductById } from '../../../../lib/db-catalog';

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

    return NextResponse.json(
      {
        success: false,
        message: 'Product not found',
        product: null,
      },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        product: null,
        error: err?.message,
      },
      { status: 500 }
    );
  }
}
