'use client';

import * as React from 'react';
import { useMemo, useState } from 'react';

type IconName =
  | 'search'
  | 'pin'
  | 'user'
  | 'heart'
  | 'bag'
  | 'arrow'
  | 'shield'
  | 'parcel'
  | 'download'
  | 'home'
  | 'grid'
  | 'orders'
  | 'star'
  | 'close'
  | 'minus'
  | 'plus';

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: (
      <>
        <circle cx="10.7" cy="10.7" r="6.7" />
        <path d="m16 16 4.2 4.2" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s6-5.2 6-11a6 6 0 0 0-12 0c0 5.8 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5.5 20c.4-4 2.8-6 6.5-6s6.1 2 6.5 6" />
      </>
    ),
    heart: <path d="M20 9c0 5-8 10-8 10S4 14 4 9a4.3 4.3 0 0 1 8-2.2A4.3 4.3 0 0 1 20 9Z" />,
    bag: (
      <>
        <path d="M5 8h14l-1 12H6L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m14 7 5 5-5 5" />
      </>
    ),
    shield: <path d="M12 3 19 6v5c0 4.7-2.9 8-7 10-4.1-2-7-5.3-7-10V6l7-3Zm-3 9 2 2 4-4" />,
    parcel: (
      <>
        <path d="m4 7 8-4 8 4v10l-8 4-8-4V7Z" />
        <path d="m4 7 8 4 8-4M12 11v10M8 5l8 4" />
      </>
    ),
    download: (
      <>
        <path d="M12 4v11m0 0 4-4m-4 4-4-4" />
        <path d="M5 19h14" />
      </>
    ),
    home: (
      <>
        <path d="m4 11 8-7 8 7" />
        <path d="M6 10v10h12V10M10 20v-6h4v6" />
      </>
    ),
    grid: (
      <>
        <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
      </>
    ),
    orders: (
      <>
        <path d="M6 3h12v18H6z" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </>
    ),
    star: <path d="m12 3 2.5 5.3 5.5.8-4 4.1.9 5.8-4.9-2.7L7.1 19l.9-5.8-4-4.1 5.5-.8L12 3Z" />,
    close: <path d="m5 5 14 14M19 5 5 19" />,
    minus: <path d="M5 12h14" />,
    plus: <path d="M12 5v14M5 12h14" />,
  };
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Logo() {
  return (
    <div className="logo" aria-label="Manga home">
      <svg viewBox="0 0 40 40" className="logo-mark" aria-hidden="true">
        <path d="M3 34V9l9-5 8 10L28 4l9 5v25H27V19l-7 9-7-9v15H3Z" fill="currentColor" />
        <path d="M16.4 11.5 20 16l3.6-4.5L20 7l-3.6 4.5Z" fill="#F6EDE0" />
      </svg>
      <span>Manga</span>
    </div>
  );
}

export interface VendorOffer {
  vendorId: string;
  vendorName: string;
  vendorRating: number;
  priceNgn: number;
  priceUsd: number;
  condition: string;
  deliveryTime: string;
  dispatchCity: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  seller: string;
  priceNgn: number;
  oldPriceNgn?: number;
  priceUsd: number;
  oldPriceUsd?: number;
  image?: string;
  tag: string;
  rating: string;
  type: 'physical' | 'digital';
  category: string;
  digitalVariant?: number;
  deliveryEstimate: string;
  otherOffers?: VendorOffer[];
}

const products: StoreProduct[] = [
  {
    id: 'prod-1',
    name: 'Arc Mini Leather Bag',
    seller: 'Cedar & Hide',
    priceNgn: 185000,
    oldPriceNgn: 220000,
    priceUsd: 128,
    oldPriceUsd: 150,
    image: 'https://images.unsplash.com/photo-1603219527847-24c87f552a77?auto=format&fit=crop&w=900&q=85',
    tag: 'Bestseller',
    rating: '4.9',
    type: 'physical',
    category: 'Style',
    deliveryEstimate: 'Arrives in 2–3 days',
    otherOffers: [
      {
        vendorId: 'vnd-artisan-lagos',
        vendorName: 'Lagos Craft Guild',
        vendorRating: 4.8,
        priceNgn: 190000,
        priceUsd: 132,
        condition: 'Handmade New',
        deliveryTime: 'Tomorrow in Lagos',
        dispatchCity: 'Lagos',
      },
    ],
  },
  {
    id: 'prod-2',
    name: 'Mora Clay Vessel',
    seller: 'Atelier Noma',
    priceNgn: 120000,
    priceUsd: 84,
    image: 'https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?auto=format&fit=crop&w=900&q=85',
    tag: 'Made by hand',
    rating: '4.8',
    type: 'physical',
    category: 'Home & living',
    deliveryEstimate: 'Arrives in 3–4 days',
  },
  {
    id: 'prod-3',
    name: 'Form & Function, Vol. 02',
    seller: 'Field Notes Press',
    priceNgn: 26000,
    priceUsd: 18,
    tag: 'Instant download',
    rating: '4.9',
    type: 'digital',
    category: 'Digital',
    digitalVariant: 1,
    deliveryEstimate: 'Delivered instantly to your Library',
  },
  {
    id: 'prod-4',
    name: 'Studio Display Type Family',
    seller: 'North Type Co.',
    priceNgn: 60000,
    priceUsd: 42,
    tag: 'Commercial licence',
    rating: '5.0',
    type: 'digital',
    category: 'Digital',
    digitalVariant: 2,
    deliveryEstimate: 'Delivered instantly to your Library',
  },
  {
    id: 'prod-5',
    name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    seller: 'Apex Audio & Electronics',
    priceNgn: 450000,
    oldPriceNgn: 580000,
    priceUsd: 320,
    oldPriceUsd: 399,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
    tag: 'Top Rated Tech',
    rating: '4.9',
    type: 'physical',
    category: 'Tech',
    deliveryEstimate: 'Manga Express • Tomorrow',
    otherOffers: [
      {
        vendorId: 'vnd-slot-ikj',
        vendorName: 'Slot Systems Ikeja',
        vendorRating: 4.8,
        priceNgn: 465000,
        priceUsd: 330,
        condition: 'Brand New (Official Warranty)',
        deliveryTime: 'Same Day in Lagos',
        dispatchCity: 'Lagos',
      },
    ],
  },
  {
    id: 'prod-6',
    name: 'Logitech MX Master 3S Ergonomic Mouse',
    seller: 'Alpha Hardware Solutions',
    priceNgn: 135000,
    oldPriceNgn: 175000,
    priceUsd: 95,
    oldPriceUsd: 119,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=85',
    tag: 'Office Choice',
    rating: '4.8',
    type: 'physical',
    category: 'Tech',
    deliveryEstimate: 'Arrives in 1–2 days',
  },
  {
    id: 'prod-7',
    name: 'Handcrafted Kano Leather Travel Rucksack',
    seller: 'Heritage Leatherworks',
    priceNgn: 85000,
    oldPriceNgn: 120000,
    priceUsd: 60,
    oldPriceUsd: 85,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
    tag: 'Authentic Craft',
    rating: '4.9',
    type: 'physical',
    category: 'Style',
    deliveryEstimate: 'Arrives in 2–3 days',
  },
  {
    id: 'prod-8',
    name: 'CeraVe Hydrating Facial Cleanser 473ml',
    seller: 'DermaCare Pharmacy',
    priceNgn: 24500,
    oldPriceNgn: 35000,
    priceUsd: 18,
    oldPriceUsd: 25,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85',
    tag: 'Verified Pharmacy',
    rating: '4.8',
    type: 'physical',
    category: 'Beauty',
    deliveryEstimate: 'Manga Express • Tomorrow',
  },
];

const categories = [
  ['Home & living', 'Objects that make a space yours', 'home'],
  ['Style', 'Independent makers and labels', 'style'],
  ['Tech', 'Useful tools, thoughtfully made', 'tech'],
  ['Digital', 'Fonts, books, courses and more', 'digital'],
  ['Beauty', 'Care from trusted makers', 'beauty'],
];

function DigitalCover({ variant }: { variant: number }) {
  return (
    <div className={`digital-cover cover-${variant}`}>
      <span>{variant === 1 ? 'FIELD NOTES' : 'NORTH TYPE CO.'}</span>
      <strong>
        {variant === 1 ? (
          <>
            Form &<br />
            Function
          </>
        ) : (
          <>
            Studio
            <br />
            Display
          </>
        )}
      </strong>
      <small>{variant === 1 ? 'VOLUME 02 · 164 PAGES' : '14 WEIGHTS · VARIABLE FONT'}</small>
    </div>
  );
}

interface CartItem {
  id: string;
  name: string;
  seller: string;
  priceNgn: number;
  priceUsd: number;
  image?: string;
  type: 'physical' | 'digital';
  quantity: number;
}

export function StorefrontClient() {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [buyBoxProduct, setBuyBoxProduct] = useState<StoreProduct | null>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [selectedCity, setSelectedCity] = useState('Lagos, NG');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toast, setToast] = useState('');
  const [saved, setSaved] = useState<string[]>(['Arc Mini Leather Bag', 'Sony WH-1000XM5 Noise Cancelling Headphones']);
  const [confirmedOrder, setConfirmedOrder] = useState<string | null>(null);

  // Cart items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'prod-1',
      name: 'Arc Mini Leather Bag',
      seller: 'Cedar & Hide',
      priceNgn: 185000,
      priceUsd: 128,
      image: products[0].image,
      type: 'physical',
      quantity: 1,
    },
    {
      id: 'prod-3',
      name: 'Form & Function, Vol. 02',
      seller: 'Field Notes Press',
      priceNgn: 26000,
      priceUsd: 18,
      type: 'digital',
      quantity: 1,
    },
  ]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotalNgn = cartItems.reduce((acc, item) => acc + item.priceNgn * item.quantity, 0);
  const subtotalUsd = cartItems.reduce((acc, item) => acc + item.priceUsd * item.quantity, 0);

  const formatPrice = (ngn: number, usd: number) => {
    return currency === 'NGN' ? `₦${ngn.toLocaleString()}` : `$${usd.toLocaleString()} USD`;
  };

  const results = useMemo(() => {
    let list = products;
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    }
    if (query) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.seller.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    return list;
  }, [query, selectedCategory]);

  function addItem(product: StoreProduct, customSeller?: string, customPriceNgn?: number, customPriceUsd?: number) {
    const seller = customSeller || product.seller;
    const priceNgn = customPriceNgn || product.priceNgn;
    const priceUsd = customPriceUsd || product.priceUsd;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.seller === seller);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.seller === seller ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          seller,
          priceNgn,
          priceUsd,
          image: product.image,
          type: product.type,
          quantity: 1,
        },
      ];
    });

    setToast(`${product.name} added to your bag`);
    window.setTimeout(() => setToast(''), 3000);
  }

  function updateQuantity(id: string, seller: string, newQty: number) {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((item) => !(item.id === id && item.seller === seller)));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id && item.seller === seller ? { ...item, quantity: newQty } : item))
    );
  }

  function toggleSaved(name: string) {
    setSaved((items) =>
      items.includes(name) ? items.filter((item) => item !== name) : [...items, name]
    );
  }

  const cities = ['Lagos, NG', 'Abuja, NG', 'Port Harcourt, NG', 'London, UK', 'Toronto, CA', 'New York, US'];

  return (
    <div className="app">
      {/* 1. Announcement Bar */}
      <header>
        <div className="announcement">
          <span>Welcome to Manga</span>
          <span>Protected payments · Clear returns · Live tracking</span>
          <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setCurrency(currency === 'NGN' ? 'USD' : 'NGN')}
              style={{ background: 'none', border: 'none', color: '#D9A441', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
            >
              Currency: {currency}
            </button>
            <a href="http://localhost:3001" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              Sell on Manga <Icon name="arrow" size={15} />
            </a>
          </div>
        </div>

        {/* 2. Main Header */}
        <div className="header-main">
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <span />
            <span />
          </button>

          <a href="/" style={{ textDecoration: 'none' }}>
            <Logo />
          </a>

          <div className="search-wrap">
            <Icon name="search" size={20} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search objects, makers and digital goods"
              aria-label="Search products"
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="Clear search" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Icon name="close" size={16} />
              </button>
            )}
          </div>

          <nav className="header-actions" aria-label="Account links">
            <button className="location" onClick={() => setLocationModalOpen(true)}>
              <Icon name="pin" size={20} />
              <span>
                Deliver to
                <br />
                <strong>{selectedCity}</strong>
              </span>
            </button>
            <button onClick={() => setToast('Signed in as verified customer')}>
              <Icon name="user" />
              <span>Account</span>
            </button>
            <button onClick={() => setToast(`${saved.length} items currently in your wishlist`)}>
              <Icon name="heart" />
              <span>Saved</span>
              {saved.length > 0 && <b style={{ position: 'absolute', top: '2px', right: '0', background: '#b5532e', color: '#fff', fontSize: '9px', padding: '1px 4px', borderRadius: '8px' }}>{saved.length}</b>}
            </button>
            <button className="bag-button" onClick={() => setCartOpen(true)}>
              <Icon name="bag" />
              <span>Bag</span>
              <b>{cartCount}</b>
            </button>
          </nav>
        </div>

        {/* Mobile Search Input */}
        <div className="mobile-search search-wrap">
          <Icon name="search" size={20} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Manga"
          />
        </div>

        {/* 3. Category Sub-Navigation */}
        <nav className="category-nav" aria-label="Shop departments">
          <a
            href="#new"
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory('all');
            }}
            style={{ fontWeight: selectedCategory === 'all' ? 700 : 500, color: selectedCategory === 'all' ? '#b5532e' : undefined }}
          >
            New & noteworthy
          </a>
          <a
            href="#categories"
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory('home');
            }}
            style={{ fontWeight: selectedCategory === 'home' ? 700 : 500, color: selectedCategory === 'home' ? '#b5532e' : undefined }}
          >
            Home & living
          </a>
          <a
            href="#categories"
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory('style');
            }}
            style={{ fontWeight: selectedCategory === 'style' ? 700 : 500, color: selectedCategory === 'style' ? '#b5532e' : undefined }}
          >
            Style
          </a>
          <a
            href="#categories"
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory('tech');
            }}
            style={{ fontWeight: selectedCategory === 'tech' ? 700 : 500, color: selectedCategory === 'tech' ? '#b5532e' : undefined }}
          >
            Tech
          </a>
          <a
            href="#digital"
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory('digital');
            }}
            style={{ fontWeight: selectedCategory === 'digital' ? 700 : 500, color: selectedCategory === 'digital' ? '#b5532e' : undefined }}
          >
            Digital goods
          </a>
          <a href="#makers">Independent makers</a>
          <a className="sale" href="#new" onClick={() => setToast('Displaying vetted promotional deals')}>
            Good prices
          </a>
        </nav>
      </header>

      {/* 4. Search Results Overlay */}
      {query && (
        <section className="search-results">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Search results</p>
              <h2>{results.length ? `Matches for “${query}”` : `No matches for “${query}”`}</h2>
            </div>
            <button onClick={() => setQuery('')}>Close</button>
          </div>
          {results.length ? (
            <div className="product-grid compact">
              {results.map((product) => (
                <ProductCardItem
                  key={product.id}
                  product={product}
                  currency={currency}
                  saved={saved.includes(product.name)}
                  onSave={() => toggleSaved(product.name)}
                  onAdd={() => addItem(product)}
                  onCompareOffers={() => setBuyBoxProduct(product)}
                />
              ))}
            </div>
          ) : (
            <p className="empty-copy">
              Try a broader term like “bag”, “vessel”, “font”, “headphones”, or “mouse”.
            </p>
          )}
        </section>
      )}

      {/* 5. Main Canvas */}
      <main className={query ? 'dimmed' : ''}>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">A marketplace without borders</p>
            <h1>
              Good things,
              <br />
              <em>found anywhere.</em>
            </h1>
            <p className="hero-copy">
              Shop considered objects, technology, and original digital work from independent sellers around the world.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#new">
                Explore what’s new <Icon name="arrow" size={18} />
              </a>
              <a className="text-link" href="#makers">
                Meet the makers
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?auto=format&fit=crop&w=1200&q=90"
              alt="Three handmade clay vessels arranged on a warm stone surface"
            />
            <div className="image-note">
              <span>Made in Kyiv, Ukraine</span>
              <strong>Mora clay series</strong>
              <a href="#new">
                Shop the collection <Icon name="arrow" size={15} />
              </a>
            </div>
          </div>
          <div className="hero-motif" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </section>

        {/* Promise Delivery Bar */}
        <section className="promise-bar">
          <div>
            <Icon name="pin" />
            <span>
              <b>Delivering to {selectedCity}</b>
              <small>Protected escrow payments · Dispatched with live tracking</small>
            </span>
          </div>
          <button onClick={() => setLocationModalOpen(true)}>
            Change location <Icon name="arrow" size={16} />
          </button>
        </section>

        {/* Category Rails */}
        <section className="category-section" id="categories">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Browse your way</p>
              <h2>Start somewhere interesting</h2>
            </div>
            <a href="#categories" onClick={() => setSelectedCategory('all')}>
              View all categories <Icon name="arrow" size={17} />
            </a>
          </div>
          <div className="category-rail">
            {categories.map(([name, description, kind], i) => (
              <a
                className={`category-card category-${kind}`}
                href="#new"
                key={name}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory(kind);
                  const el = document.getElementById('new');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="category-art">
                  {i === 0 && (
                    <img
                      src="https://images.unsplash.com/photo-1660721671073-e139688fa3cf?auto=format&fit=crop&w=600&q=80"
                      alt=""
                    />
                  )}
                  {i === 1 && (
                    <img
                      src="https://images.unsplash.com/photo-1603219527847-24c87f552a77?auto=format&fit=crop&w=600&q=80"
                      alt=""
                    />
                  )}
                  {i > 1 && (
                    <span className="abstract-art" aria-hidden="true">
                      {i === 2 ? '◫' : i === 3 ? 'Aa' : '○'}
                    </span>
                  )}
                </div>
                <h3>{name}</h3>
                <p>{description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Freshly Added Grid */}
        <section className="new-section" id="new">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Freshly added</p>
              <h2>Worth a closer look</h2>
            </div>
            <div className="section-arrows">
              <button aria-label="Previous">
                <Icon name="arrow" size={18} />
              </button>
              <button aria-label="Next">
                <Icon name="arrow" size={18} />
              </button>
            </div>
          </div>
          <div className="product-grid">
            {results.map((product) => (
              <ProductCardItem
                key={product.id}
                product={product}
                currency={currency}
                saved={saved.includes(product.name)}
                onSave={() => toggleSaved(product.name)}
                onAdd={() => addItem(product)}
                onCompareOffers={() => setBuyBoxProduct(product)}
              />
            ))}
          </div>
        </section>

        {/* Digital Goods Banner */}
        <section className="digital-banner" id="digital">
          <div className="digital-copy">
            <p className="eyebrow">Instantly yours</p>
            <h2>
              Ideas don’t need
              <br />a shipping label.
            </h2>
            <p>
              Discover typefaces, templates, books, music and courses from independent creators.
              Delivered straight to your Manga Library.
            </p>
            <a className="button light" href="#new" onClick={() => setSelectedCategory('digital')}>
              Explore digital goods <Icon name="arrow" size={18} />
            </a>
            <div className="digital-points">
              <span>
                <Icon name="download" size={18} /> Instant access
              </span>
              <span>
                <Icon name="shield" size={18} /> Clear licences
              </span>
            </div>
          </div>
          <div className="cover-stack" aria-label="Featured digital goods">
            <DigitalCover variant={1} />
            <DigitalCover variant={2} />
          </div>
        </section>

        {/* Independent Maker Story */}
        <section className="maker-section" id="makers">
          <div className="maker-photo">
            <img
              src="https://images.unsplash.com/photo-1677761640321-b80251be00ca?auto=format&fit=crop&w=1100&q=85"
              alt="Handmade ceramic vessels in a quiet sunlit studio"
            />
          </div>
          <div className="maker-story">
            <p className="eyebrow">Seller story · Lisbon</p>
            <blockquote>“I make objects that ask you to slow down and notice them.”</blockquote>
            <p>
              In her small Lisbon studio, Inês Almeida makes each piece in quiet batches. No two are
              exactly the same—and that is entirely the point.
            </p>
            <a className="text-link" href="#new">
              Visit Barro Studio <Icon name="arrow" size={16} />
            </a>
          </div>
        </section>

        {/* Trust & Guarantees */}
        <section className="trust-section">
          <p className="eyebrow">Shop with confidence</p>
          <div className="trust-grid">
            <div>
              <Icon name="shield" size={28} />
              <h3>Manga Protection</h3>
              <p>Your payment stays protected in escrow until your order arrives as expected.</p>
            </div>
            <div>
              <Icon name="parcel" size={28} />
              <h3>Know when it’s coming</h3>
              <p>Clear delivery windows, live tracking and pickup options across Nigerian & international hubs.</p>
            </div>
            <div>
              <Icon name="download" size={28} />
              <h3>Digital, without doubt</h3>
              <p>Know the format, licence and update policy before you buy.</p>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Footer */}
      <footer>
        <div className="footer-lead">
          <Logo />
          <p>
            From anywhere, to your door,
            <br />
            or to your library.
          </p>
        </div>
        <div>
          <b>Shop</b>
          <a href="#new">New arrivals</a>
          <a href="#categories">Categories</a>
          <a href="#digital">Digital goods</a>
          <a href="#makers">Independent makers</a>
        </div>
        <div>
          <b>About</b>
          <a href="#makers">Our story</a>
          <a href="#makers">Manga Protection</a>
          <a href="#makers">Delivery & Logistics</a>
          <a href="#makers">Dispute Resolution</a>
        </div>
        <div>
          <b>Sell</b>
          <a href="http://localhost:3001" target="_blank" rel="noreferrer">
            Start selling on Manga
          </a>
          <a href="#makers">Merchant fees</a>
          <a href="#makers">Seller handbook</a>
          <a href="#makers">Carrier dispatch</a>
        </div>
        <div className="footer-meta">
          <span>© 2026 Manga Technologies Limited. A Marketplace Without Borders.</span>
          <span>{selectedCity} · {currency} · English</span>
        </div>
      </footer>

      {/* 7. Mobile Bottom Navigation */}
      <nav className="mobile-bottom" aria-label="Mobile navigation">
        <a className="active" href="#">
          <Icon name="home" />
          <span>Home</span>
        </a>
        <a href="#categories">
          <Icon name="grid" />
          <span>Categories</span>
        </a>
        <button
          onClick={() => document.querySelector<HTMLInputElement>('.mobile-search input')?.focus()}
        >
          <Icon name="search" />
          <span>Search</span>
        </button>
        <button onClick={() => setToast('Opening orders history')}>
          <Icon name="orders" />
          <span>Orders</span>
        </button>
        <button onClick={() => setToast('Opening account profile')}>
          <Icon name="user" />
          <span>Account</span>
        </button>
      </nav>

      {/* 8. Slide-Out Cart Bag Drawer */}
      {cartOpen && <div className="scrim" onClick={() => setCartOpen(false)} />}
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen}>
        <div className="drawer-head">
          <div>
            <p className="eyebrow">Your bag</p>
            <h2>{cartCount} {cartCount === 1 ? 'item' : 'items'}</h2>
          </div>
          <button onClick={() => setCartOpen(false)} aria-label="Close bag">
            <Icon name="close" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {cartItems.length === 0 ? (
            <div style={{ padding: '3rem 0', textAlign: 'center', color: '#8c8279' }}>
              Your bag is currently empty.
            </div>
          ) : (
            <>
              {/* Physical items group */}
              {cartItems.some((i) => i.type === 'physical') && (
                <div className="cart-group">
                  <span>Physical delivery</span>
                  {cartItems
                    .filter((i) => i.type === 'physical')
                    .map((item) => (
                      <div key={`${item.id}-${item.seller}`} className="cart-line">
                        <img src={item.image} alt={item.name} />
                        <div>
                          <h3>{item.name}</h3>
                          <p style={{ color: '#8c8279', fontSize: '11px', margin: '2px 0 6px' }}>by {item.seller}</p>
                          <div className="quantity">
                            <button onClick={() => updateQuantity(item.id, item.seller, item.quantity - 1)}>
                              <Icon name="minus" size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.seller, item.quantity + 1)}>
                              <Icon name="plus" size={14} />
                            </button>
                          </div>
                        </div>
                        <strong>{formatPrice(item.priceNgn * item.quantity, item.priceUsd * item.quantity)}</strong>
                      </div>
                    ))}
                </div>
              )}

              {/* Digital goods group */}
              {cartItems.some((i) => i.type === 'digital') && (
                <div className="cart-group">
                  <span>Digital download (Instant library access)</span>
                  {cartItems
                    .filter((i) => i.type === 'digital')
                    .map((item) => (
                      <div key={`${item.id}-${item.seller}`} className="cart-line">
                        <div style={{ width: '70px', height: '85px', backgroundColor: '#3e5c76', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', textAlign: 'center', padding: '6px' }}>
                          DIGITAL
                        </div>
                        <div>
                          <h3>{item.name}</h3>
                          <p style={{ color: '#8c8279', fontSize: '11px', margin: '2px 0 6px' }}>by {item.seller}</p>
                          <div className="quantity">
                            <button onClick={() => updateQuantity(item.id, item.seller, item.quantity - 1)}>
                              <Icon name="minus" size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.seller, item.quantity + 1)}>
                              <Icon name="plus" size={14} />
                            </button>
                          </div>
                        </div>
                        <strong>{formatPrice(item.priceNgn * item.quantity, item.priceUsd * item.quantity)}</strong>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="drawer-total">
            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(subtotalNgn, subtotalUsd)}</strong>
            </div>
            <p>Shipping, duties and taxes calculated at checkout. Escrow guaranteed.</p>
            <button
              className="button primary"
              onClick={() => {
                setCartOpen(false);
                setCheckoutOpen(true);
              }}
            >
              Proceed to checkout <Icon name="arrow" size={18} />
            </button>
            <button className="continue" onClick={() => setCartOpen(false)}>
              Continue shopping
            </button>
          </div>
        )}
      </aside>

      {/* 9. Mobile Slide-Out Menu */}
      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} />}
      <aside className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="drawer-head">
          <Logo />
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <Icon name="close" />
          </button>
        </div>
        {categories.map(([name, _, kind]) => (
          <a
            key={name}
            href="#new"
            onClick={() => {
              setSelectedCategory(kind);
              setMenuOpen(false);
            }}
          >
            {name}
            <Icon name="arrow" size={18} />
          </a>
        ))}
        <div className="mobile-menu-foot">
          <a href="http://localhost:3001" target="_blank" rel="noreferrer">
            Sell on Manga
          </a>
          <button
            onClick={() => {
              setCurrency(currency === 'NGN' ? 'USD' : 'NGN');
              setMenuOpen(false);
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b5532e', fontWeight: 600 }}
          >
            Switch to {currency === 'NGN' ? 'USD' : 'NGN'}
          </button>
        </div>
      </aside>

      {/* 10. Multi-Vendor Buy-Box Modal */}
      {buyBoxProduct && (
        <div
          className="scrim"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setBuyBoxProduct(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fffdf9',
              borderRadius: '8px',
              maxWidth: '560px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(42,35,32,0.25)',
              border: '1px solid #e7d5bc',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <p className="eyebrow" style={{ margin: '0 0 4px' }}>Multi-Vendor Marketplace</p>
                <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '22px' }}>
                  Choose Your Seller
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6e635c' }}>
                  {buyBoxProduct.name}
                </p>
              </div>
              <button onClick={() => setBuyBoxProduct(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Icon name="close" size={20} />
              </button>
            </div>

            {/* Featured Primary Seller */}
            <div style={{ backgroundColor: '#f6ede0', padding: '14px', borderRadius: '6px', marginBottom: '12px', border: '1px solid #b5532e' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: '#b5532e' }}>
                    Featured Offer
                  </span>
                  <div style={{ fontWeight: 600, fontSize: '15px', color: '#2a2320', marginTop: '2px' }}>
                    {buyBoxProduct.seller}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6e635c', marginTop: '2px' }}>
                    Rating: ★ {buyBoxProduct.rating} • {buyBoxProduct.deliveryEstimate}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#2a2320' }}>
                    {formatPrice(buyBoxProduct.priceNgn, buyBoxProduct.priceUsd)}
                  </div>
                  <button
                    className="button primary"
                    style={{ minHeight: '32px', padding: '0 12px', fontSize: '11px', marginTop: '6px' }}
                    onClick={() => {
                      addItem(buyBoxProduct);
                      setBuyBoxProduct(null);
                    }}
                  >
                    Select Offer
                  </button>
                </div>
              </div>
            </div>

            {/* Competing Sellers */}
            {buyBoxProduct.otherOffers && buyBoxProduct.otherOffers.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#8c8279', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Other Independent Sellers ({buyBoxProduct.otherOffers.length})
                </span>
                {buyBoxProduct.otherOffers.map((offer) => (
                  <div
                    key={offer.vendorId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #e7d5bc',
                      backgroundColor: '#fff',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#2a2320' }}>
                        {offer.vendorName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6e635c' }}>
                        {offer.dispatchCity} • Rating: ★ {offer.vendorRating} • {offer.condition}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#2a2320' }}>
                        {formatPrice(offer.priceNgn, offer.priceUsd)}
                      </div>
                      <button
                        className="button light"
                        style={{ minHeight: '30px', padding: '0 10px', fontSize: '11px', marginTop: '4px', border: '1px solid #d8cbbc' }}
                        onClick={() => {
                          addItem(buyBoxProduct, offer.vendorName, offer.priceNgn, offer.priceUsd);
                          setBuyBoxProduct(null);
                        }}
                      >
                        Select Offer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 11. Delivery Location Switcher Modal */}
      {locationModalOpen && (
        <div
          className="scrim"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setLocationModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fffdf9',
              borderRadius: '8px',
              maxWidth: '420px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(42,35,32,0.25)',
              border: '1px solid #e7d5bc',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '20px' }}>
                Select Delivery Destination
              </h3>
              <button onClick={() => setLocationModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Icon name="close" size={18} />
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#6e635c', margin: '0 0 14px' }}>
              Delivery options, carriers, and local currency adapt to your destination.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    if (city.includes('NG')) setCurrency('NGN');
                    else setCurrency('USD');
                    setLocationModalOpen(false);
                    setToast(`Delivery set to ${city}`);
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '5px',
                    border: '1px solid #e7d5bc',
                    backgroundColor: city === selectedCity ? '#f6ede0' : '#fff',
                    color: '#2a2320',
                    fontWeight: city === selectedCity ? 600 : 400,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{city}</span>
                  {city === selectedCity && <Icon name="shield" size={16} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 12. Checkout Modal */}
      {checkoutOpen && (
        <div
          className="scrim"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setCheckoutOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fffdf9',
              borderRadius: '8px',
              maxWidth: '540px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px rgba(42,35,32,0.3)',
              border: '1px solid #e7d5bc',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <p className="eyebrow" style={{ margin: '0 0 4px' }}>Manga Escrow Protection</p>
                <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '24px' }}>
                  Complete Your Order
                </h3>
              </div>
              <button onClick={() => setCheckoutOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Icon name="close" size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: '#f6ede0', padding: '12px 16px', borderRadius: '6px', fontSize: '12px', color: '#514741', marginBottom: '18px' }}>
              Delivering to <strong>{selectedCity}</strong> • <strong>{cartCount} items</strong> • Total: <strong style={{ color: '#b5532e' }}>{formatPrice(subtotalNgn, subtotalUsd)}</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#766c65', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  defaultValue="Chidi Okonkwo"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '5px', border: '1px solid #d8cbbc', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#766c65', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Shipping Street Address
                </label>
                <input
                  defaultValue="24 Admiralty Way, Lekki Phase 1"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '5px', border: '1px solid #d8cbbc', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#766c65', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Payment Method
                </label>
                <select
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '5px', border: '1px solid #d8cbbc', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#fff' }}
                >
                  <option>Debit / Credit Card (3D-Secure Protected)</option>
                  <option>Instant Virtual Bank Transfer (Zero fees)</option>
                  <option>Pay on Delivery with Escrow Inspection</option>
                </select>
              </div>
            </div>

            <button
              className="button primary"
              style={{ width: '100%', minHeight: '46px' }}
              onClick={() => {
                const orderNum = `MNG-${Date.now().toString().slice(-6)}`;
                setCheckoutOpen(false);
                setCartItems([]);
                setConfirmedOrder(orderNum);
              }}
            >
              Authorize & Place Order <Icon name="arrow" size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 13. Order Confirmed Screen */}
      {confirmedOrder && (
        <div
          className="scrim"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setConfirmedOrder(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fffdf9',
              borderRadius: '8px',
              maxWidth: '460px',
              width: '100%',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(42,35,32,0.3)',
              border: '1px solid #e7d5bc',
            }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#f6ede0', color: '#b5532e', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
              <Icon name="shield" size={30} />
            </div>
            <p className="eyebrow" style={{ margin: '0 0 6px' }}>Order Placed</p>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '28px', margin: '0 0 8px' }}>
              #{confirmedOrder}
            </h2>
            <p style={{ fontSize: '13px', color: '#6e635c', lineHeight: 1.5, margin: '0 0 20px' }}>
              Your order is protected under Manga Guarantee. The merchant has received notification to pack and stage for dispatch.
            </p>
            <button
              className="button primary"
              style={{ width: '100%' }}
              onClick={() => setConfirmedOrder(null)}
            >
              Continue Shopping <Icon name="arrow" size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 14. Toast Alerts */}
      {toast && (
        <div className="toast">
          <Icon name="shield" size={19} />
          {toast}
          <button onClick={() => setToast('')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function ProductCardItem({
  product,
  currency,
  saved,
  onSave,
  onAdd,
  onCompareOffers,
}: {
  product: StoreProduct;
  currency: 'NGN' | 'USD';
  saved: boolean;
  onSave: () => void;
  onAdd: () => void;
  onCompareOffers: () => void;
}) {
  const priceDisplay = currency === 'NGN' ? `₦${product.priceNgn.toLocaleString()}` : `$${product.priceUsd}`;
  const oldPriceDisplay =
    product.oldPriceNgn && product.oldPriceUsd
      ? currency === 'NGN'
        ? `₦${product.oldPriceNgn.toLocaleString()}`
        : `$${product.oldPriceUsd}`
      : undefined;

  return (
    <article className="product-card">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <DigitalCover variant={product.digitalVariant || 1} />
        )}
        <span className="product-tag">
          {product.type === 'digital' && <Icon name="download" size={14} />}
          {product.tag}
        </span>
        <button
          className={`save-button ${saved ? 'saved' : ''}`}
          onClick={onSave}
          aria-label={saved ? 'Remove from saved' : 'Save product'}
        >
          <Icon name="heart" size={19} />
        </button>
        <button className="quick-add" onClick={onAdd}>
          Quick add <Icon name="plus" size={16} />
        </button>
      </div>

      <div className="product-info">
        <div>
          <h3>{product.name}</h3>
          <p>by {product.seller}</p>
        </div>
        <span className="rating">
          <Icon name="star" size={13} /> {product.rating}
        </span>
        <p className="price">
          {priceDisplay} {oldPriceDisplay && <s>{oldPriceDisplay}</s>}
        </p>
        <small>{product.deliveryEstimate}</small>

        {product.otherOffers && product.otherOffers.length > 0 && (
          <button
            onClick={onCompareOffers}
            style={{
              gridColumn: '1/-1',
              marginTop: '8px',
              padding: '4px 0',
              background: 'none',
              border: 'none',
              color: '#b5532e',
              fontSize: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Compare {product.otherOffers.length + 1} offers from other sellers</span>
            <Icon name="arrow" size={12} />
          </button>
        )}
      </div>
    </article>
  );
}
