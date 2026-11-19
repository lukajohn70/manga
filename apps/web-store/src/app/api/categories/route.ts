import { NextResponse } from 'next/server';
import { getDbCategories } from '../../../lib/db-catalog';

export async function GET() {
  const categories = await getDbCategories();
  return NextResponse.json({
    success: true,
    categories,
  });
}
