import { NextResponse } from 'next/server';
import { getDbCategories } from '../../../lib/db-catalog';

export async function GET() {
  try {
    const categories = await getDbCategories();
    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      categories: [
        { id: '1', slug: 'computing', name: 'Phones & Computing', icon: 'fa-laptop', count: 8 },
        { id: '2', slug: 'electronics', name: 'Electronics & Audio', icon: 'fa-headphones', count: 6 },
        { id: '3', slug: 'fashion', name: 'Fashion & Streetwear', icon: 'fa-shirt', count: 5 },
        { id: '4', slug: 'home', name: 'Home & Appliances', icon: 'fa-couch', count: 4 },
        { id: '5', slug: 'digital', name: 'Software & Digital Assets', icon: 'fa-code', count: 3 },
      ],
      fallback: true,
      error: err?.message,
    });
  }
}
