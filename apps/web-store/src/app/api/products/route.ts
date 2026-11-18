import { NextResponse } from 'next/server';

interface BackendSearchItem {
  product_id: string;
  title: string;
  brand_name: string;
  category_id: string;
  min_price_minor: string;
  max_price_minor: string;
  currency: string;
  variant_count: string;
  offer_count: string;
}

const FALLBACK_PRODUCTS = [
  {
    id: '66666666-6666-6666-6666-666666666661',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    category: 'electronics',
    categoryName: 'Electronics & Audio',
    priceNgn: 450000,
    oldPriceNgn: 580000,
    priceUsd: 320,
    oldPriceUsd: 399,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
    rating: 4.9,
    reviewsCount: 384,
    storeName: 'Sony Audio Official Store',
    type: 'physical',
    deliveryEstimate: 'Manga Express • Tomorrow',
    offerId: '88888888-8888-8888-8888-888888888881',
    otherOffers: [
      {
        vendorId: 'vnd-apex-audio',
        vendorName: 'Apex Pro Sound Studio',
        vendorRating: 4.8,
        priceNgn: 460000,
        priceUsd: 325,
        condition: 'Factory Sealed with Hard Case',
        deliveryTime: 'Same Day in Lagos',
        dispatchCity: 'Lagos',
      },
    ],
  },
  {
    id: '66666666-6666-6666-6666-666666666662',
    title: 'Samsung Galaxy S24 Ultra 512GB Titanium Black with S-Pen & AI',
    category: 'computing',
    categoryName: 'Phones & Computing',
    priceNgn: 1850000,
    oldPriceNgn: 2100000,
    priceUsd: 1290,
    oldPriceUsd: 1450,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=85',
    rating: 4.8,
    reviewsCount: 96,
    storeName: 'Samsung Nigeria Official',
    type: 'physical',
    deliveryEstimate: 'Manga Express • 24 Hours',
    offerId: '88888888-8888-8888-8888-888888888882',
  },
  {
    id: '66666666-6666-6666-6666-666666666664',
    title: "De'Longhi Dedica Deluxe Slim Espresso & Cappuccino Pump Machine",
    category: 'home',
    categoryName: 'Home & Appliances',
    priceNgn: 320000,
    oldPriceNgn: 390000,
    priceUsd: 225,
    oldPriceUsd: 275,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=85',
    rating: 4.9,
    reviewsCount: 64,
    storeName: "De'Longhi Official Brand Store",
    type: 'physical',
    deliveryEstimate: 'Nationwide Delivery in 2–3 days',
    offerId: '88888888-8888-8888-8888-888888888884',
  },
  {
    id: '66666666-6666-6666-6666-666666666663',
    title: 'Apple MacBook Air 15" M3 Chip (16GB Unified Memory, 512GB SSD Midnight)',
    category: 'computing',
    categoryName: 'Phones & Computing',
    priceNgn: 2100000,
    oldPriceNgn: 2350000,
    priceUsd: 1480,
    oldPriceUsd: 1650,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85',
    rating: 5.0,
    reviewsCount: 118,
    storeName: 'Apple Authorized Nigeria',
    type: 'physical',
    deliveryEstimate: 'Manga Express • Tomorrow',
    offerId: '88888888-8888-8888-8888-888888888883',
  },
  {
    id: 'prod-logitech-mx3s',
    title: 'Logitech MX Master 3S Wireless Performance Ergonomic Mouse (Quiet Clicks)',
    category: 'computing',
    categoryName: 'Phones & Computing',
    priceNgn: 135000,
    oldPriceNgn: 175000,
    priceUsd: 95,
    oldPriceUsd: 119,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=85',
    rating: 4.8,
    reviewsCount: 220,
    storeName: 'Alpha Hardware Solutions',
    type: 'physical',
    deliveryEstimate: 'Manga Express • Tomorrow',
  },
  {
    id: '66666666-6666-6666-6666-666666666665',
    title: 'Handcrafted Kano Vegetable-Tanned Leather Travel Rucksack',
    category: 'fashion',
    categoryName: 'Fashion & Streetwear',
    priceNgn: 165000,
    oldPriceNgn: 210000,
    priceUsd: 115,
    oldPriceUsd: 150,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
    rating: 4.9,
    reviewsCount: 73,
    storeName: 'Manga Signature Leatherwork',
    type: 'physical',
    deliveryEstimate: 'Dispatched directly from Kano Guild in 48h',
    offerId: '88888888-8888-8888-8888-888888888885',
  },
  {
    id: 'prod-iphone-16-pro',
    title: 'Apple iPhone 16 Pro 256GB Natural Titanium (Unlocked with AppleCare+)',
    category: 'computing',
    categoryName: 'Phones & Computing',
    priceNgn: 2250000,
    oldPriceNgn: 2450000,
    priceUsd: 1580,
    oldPriceUsd: 1720,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=85',
    rating: 4.9,
    reviewsCount: 142,
    storeName: 'Apple Authorized Nigeria',
    type: 'physical',
    deliveryEstimate: 'Manga Express • Tomorrow',
  },
  {
    id: 'prod-heavyweight-hoodie',
    title: 'Oversized 480GSM French Terry Heavyweight Hoodie in Clay & Charcoal',
    category: 'fashion',
    categoryName: 'Fashion & Streetwear',
    priceNgn: 42000,
    oldPriceNgn: 55000,
    priceUsd: 30,
    oldPriceUsd: 40,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=85',
    rating: 4.7,
    reviewsCount: 51,
    storeName: 'Artisans Lagos',
    type: 'physical',
    deliveryEstimate: 'Delivered in 24h within Lagos',
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    title: 'SaaS UI Design System & Figma Pro Kit (400+ Components & Tokens)',
    category: 'digital',
    categoryName: 'Software & Digital Assets',
    priceNgn: 45000,
    oldPriceNgn: 70000,
    priceUsd: 32,
    oldPriceUsd: 50,
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=85',
    rating: 5.0,
    reviewsCount: 167,
    storeName: 'DesignCraft Labs',
    type: 'digital',
    deliveryEstimate: 'Instant digital download & license key',
    offerId: '88888888-8888-8888-8888-888888888886',
  },
  {
    id: 'prod-type-family',
    title: 'Studio Display Type Family (14 Weights • Variable OpenType & WebFont)',
    category: 'digital',
    categoryName: 'Software & Digital Assets',
    priceNgn: 60000,
    oldPriceNgn: 90000,
    priceUsd: 42,
    oldPriceUsd: 65,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=85',
    rating: 5.0,
    reviewsCount: 94,
    storeName: 'North Type Co.',
    type: 'digital',
    deliveryEstimate: 'Delivered instantly with commercial license',
  },
  {
    id: 'prod-flutter-starter',
    title: 'Complete Mobile Commerce Flutter Production Kit with Riverpod & GoRouter',
    category: 'digital',
    categoryName: 'Software & Digital Assets',
    priceNgn: 75000,
    oldPriceNgn: 110000,
    priceUsd: 52,
    oldPriceUsd: 80,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=85',
    rating: 4.9,
    reviewsCount: 81,
    storeName: 'CodeForge Global',
    type: 'digital',
    deliveryEstimate: 'Instant GitHub repository invite & license',
  },
];

const CATEGORY_MAP: Record<string, string> = {
  '55555555-5555-5555-5555-555555555551': 'computing',
  '55555555-5555-5555-5555-555555555552': 'electronics',
  '55555555-5555-5555-5555-555555555553': 'fashion',
  '55555555-5555-5555-5555-555555555554': 'home',
  '55555555-5555-5555-5555-555555555555': 'digital',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  try {
    const apiBase =
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:4000';
    const backendUrl = new URL(`${apiBase}/v1/search`);
    if (q) backendUrl.searchParams.set('q', q);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(backendUrl.toString(), {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const backendItems: BackendSearchItem[] = data.items || [];

      if (backendItems.length > 0) {
        // Merge backend live items with rich visual presentation
        const merged = backendItems.map((bi) => {
          const matchedFallback = FALLBACK_PRODUCTS.find((p) => p.id === bi.product_id);
          const priceNgn = bi.min_price_minor ? Number(bi.min_price_minor) / 100 : 0;
          const catSlug = CATEGORY_MAP[bi.category_id] || matchedFallback?.category || 'computing';

          return {
            id: bi.product_id,
            title: bi.title,
            brand: bi.brand_name,
            category: catSlug,
            categoryName: matchedFallback?.categoryName || 'General Goods',
            priceNgn: priceNgn || matchedFallback?.priceNgn || 50000,
            oldPriceNgn: matchedFallback?.oldPriceNgn || Math.round((priceNgn || 50000) * 1.2),
            priceUsd: matchedFallback?.priceUsd || Math.round((priceNgn || 50000) / 1400),
            oldPriceUsd: matchedFallback?.oldPriceUsd || Math.round(((priceNgn || 50000) * 1.2) / 1400),
            image: matchedFallback?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
            rating: matchedFallback?.rating || 4.9,
            reviewsCount: matchedFallback?.reviewsCount || 105,
            storeName: matchedFallback?.storeName || `${bi.brand_name} Official Store`,
            type: catSlug === 'digital' ? 'digital' : 'physical',
            deliveryEstimate: matchedFallback?.deliveryEstimate || 'Manga Express • Nationwide 24–48h',
            otherOffers: matchedFallback?.otherOffers || [],
            offerId: matchedFallback?.offerId,
          };
        });

        // Apply category filter if requested
        const filtered = category && category !== 'all' && category !== 'flash'
          ? merged.filter((item) => item.category === category)
          : merged;

        return NextResponse.json({
          items: filtered,
          total: filtered.length,
          source: 'backend_monolith',
        });
      }
    }
  } catch (err) {
    console.warn('[API /api/products] Backend not reachable, using fallback catalog:', (err as any).message);
  }

  // Fallback filtering
  const filtered = FALLBACK_PRODUCTS.filter((item) => {
    const matchesCategory =
      !category || category === 'all' || category === 'flash' || item.category === category;
    const matchesSearch =
      !q.trim() ||
      item.title.toLowerCase().includes(q.toLowerCase()) ||
      item.storeName.toLowerCase().includes(q.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return NextResponse.json({
    items: filtered,
    total: filtered.length,
    source: 'fallback_resilient',
  });
}
