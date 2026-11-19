import { NextResponse } from 'next/server';
import { getDbProducts } from '../../../lib/db-catalog';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const typeParam = searchParams.get('type');
  const type = typeParam === 'digital' || typeParam === 'physical' ? typeParam : undefined;

  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  const result = await getDbProducts({
    q,
    category,
    type,
    limit,
    offset,
  });

  return NextResponse.json(result);
}
