'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../../context/StoreContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const {
    currency,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    cartCount,
    wishlistCount,
    toggleCurrency,
    showToast,
  } = useStore();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Gallery & Lightbox state
  const [currentGalleryIdx, setCurrentGalleryIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Selected Variant & Quantity state
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Customer Reviews state (clean live state)
  const [reviews, setReviews] = useState<Array<{
    name: string;
    rating: number;
    title: string;
    comment: string;
    date: string;
    isVerified?: boolean;
  }>>([]);

  // Review Form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    let active = true;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(productId)}`);
        if (res.ok) {
          const data = await res.json();
          if (active && data.product) {
            setProduct(data.product);
            if (!selectedVariantId && data.product.variants && data.product.variants.length > 0) {
              setSelectedVariantId(data.product.variants[0].id || data.product.variants[0].name);
            }
          } else if (active) {
            setProduct(null);
          }
        } else if (active) {
          setProduct(null);
        }
      } catch (err) {
        if (active) setProduct(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    } else {
      setLoading(false);
    }
    return () => {
      active = false;
    };
  }, [productId]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        navigateGallery(-1);
      } else if (e.key === 'ArrowRight') {
        navigateGallery(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const galleryImages: string[] = product
    ? [product.image, ...(product.gallery || [])].filter((v, i, a) => a.indexOf(v) === i)
    : [];

  const navigateGallery = (direction: number) => {
    if (galleryImages.length <= 1) return;
    setCurrentGalleryIdx((prev) => {
      let next = prev + direction;
      if (next < 0) next = galleryImages.length - 1;
      if (next >= galleryImages.length) next = 0;
      return next;
    });
  };

  const selectedVariant = product?.variants?.find(
    (v: any) => (v.id || v.name) === selectedVariantId
  ) || product?.variants?.[0];

  const currentPriceNgn = selectedVariant?.priceNgn || product?.priceNgn || 0;
  const currentPriceUsd = selectedVariant?.priceUsd || product?.priceUsd || 0;
  const currentSku = selectedVariant?.sku || product?.sku || `MNG-${(product?.id || 'PROD').slice(0, 8).toUpperCase()}`;
  const currentStock = selectedVariant?.stockQuantity || product?.stockLeft || 25;

  const discountPct =
    product?.oldPriceNgn && product.oldPriceNgn > currentPriceNgn
      ? Math.round(((product.oldPriceNgn - currentPriceNgn) / product.oldPriceNgn) * 100)
      : null;

  const inWish = product ? isInWishlist(product.id) : false;

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (!product) return;
    const sourceEl = document.getElementById('product-page-main-visual') || (e ? (e.currentTarget as HTMLElement) : null);
    addToCart(
      {
        ...product,
        title: selectedVariant ? `${product.title} (${selectedVariant.name})` : product.title,
        priceNgn: currentPriceNgn,
        priceUsd: currentPriceUsd,
      },
      quantity,
      sourceEl
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    setReviews([
      {
        name: reviewName.trim(),
        rating: reviewRating,
        title: reviewTitle.trim() || 'Verified Buyer Review',
        comment: reviewComment.trim(),
        date: 'Just now',
        isVerified: true,
      },
      ...reviews,
    ]);
    setReviewName('');
    setReviewTitle('');
    setReviewComment('');
    showToast('Thank you! Your verified review has been submitted.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-[#B5532E] mb-3"></i>
          <p className="text-sm font-medium text-[#78716C]">Loading product specifications & seller data...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1D1917]">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-black text-[#1D1917] mb-2 apple-heading">Product Not Found</h2>
          <p className="text-sm text-[#78716C] mb-6">The requested product could not be located in the marketplace catalog.</p>
          <Link
            href="/shop"
            className="inline-flex px-6 py-2.5 rounded-xl bg-[#B5532E] text-white font-bold text-xs hover:bg-[#8F3B1F] transition-all apple-pressable"
          >
            Browse Marketplace
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : (product.rating || 4.9).toFixed(1);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1D1917]">
      <Header />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-6 sm:py-10">
        
        {/* Breadcrumbs & Merchant Quick Action Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 text-xs text-[#78716C] overflow-hidden">
            <Link href="/" className="hover:text-[#1D1917] transition-colors">Home</Link>
            <span className="text-[#C5BDB5]">/</span>
            <Link href="/shop" className="hover:text-[#1D1917] transition-colors">Shop</Link>
            <span className="text-[#C5BDB5]">/</span>
            <Link
              href={`/shop?category=${product.category}`}
              className="hover:text-[#1D1917] capitalize transition-colors"
            >
              {product.categoryName || product.category}
            </Link>
            <span className="text-[#C5BDB5]">/</span>
            <span className="text-[#1D1917] font-semibold truncate max-w-xs sm:max-w-md">{product.title}</span>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/sell"
              className="px-3.5 py-1.5 bg-[#161311] hover:bg-[#2A2320] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 border border-white/10"
            >
              <i className="fas fa-pen-to-square text-[#D9A441]"></i>
              <span>Merchant Console</span>
            </Link>
          </motion.div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════════
             TOP HERO: PRODUCT SHOWCASE & PURCHASE CONTROLS (5 + 7 Grid)
             ════════════════════════════════════════════════════════════════════════ */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-start bg-white rounded-3xl border border-[#EAE3D9] p-4 sm:p-6 lg:p-8 shadow-xs">
          
          {/* Left: Product Image Gallery (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div
              id="product-page-main-visual"
              className="relative rounded-2xl overflow-hidden h-[320px] sm:h-[380px] bg-[#FAF7F2] border border-[#EAE3D9] flex items-center justify-center p-4 group"
            >
              <img
                src={galleryImages[currentGalleryIdx] || product.image}
                alt={product.title}
                onClick={() => setIsLightboxOpen(true)}
                className="w-full h-full object-contain cursor-zoom-in transition-all duration-200 group-hover:scale-[1.02]"
              />

              {/* Official Store Badge */}
              <span className="absolute top-3.5 left-3.5 px-3 py-1 bg-[#161311]/90 backdrop-blur-md text-white text-[11px] font-semibold rounded-full shadow-xs uppercase tracking-wider flex items-center gap-1.5 z-10 pointer-events-none border border-white/10">
                <i className="fas fa-certificate text-[#D9A441]"></i> Official Store
              </span>

              {/* Zoom Icon Button (Top-Right) */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                title="Click to zoom high-resolution photo"
                className="absolute top-3 right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/90 hover:bg-white text-[#1D1917] hover:text-[#B5532E] shadow-sm border border-[#EAE3D9] flex items-center justify-center transition-colors z-10 opacity-90 group-hover:opacity-100 cursor-pointer backdrop-blur-xs"
              >
                <i className="fas fa-magnifying-glass-plus text-xs"></i>
              </motion.button>

              {galleryImages.length > 1 && (
                <>
                  {/* Prev Arrow */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={() => navigateGallery(-1)}
                    title="Previous Angle"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-[#1D1917] shadow-sm border border-[#EAE3D9] flex items-center justify-center transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 z-10 cursor-pointer"
                  >
                    <i className="fas fa-chevron-left text-xs sm:text-sm"></i>
                  </motion.button>

                  {/* Next Arrow */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={() => navigateGallery(1)}
                    title="Next Angle"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-[#1D1917] shadow-sm border border-[#EAE3D9] flex items-center justify-center transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 z-10 cursor-pointer"
                  >
                    <i className="fas fa-chevron-right text-xs sm:text-sm"></i>
                  </motion.button>

                  {/* Dynamic Photo Counter Badge (Bottom-Right) */}
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-[#161311]/80 text-white text-[10px] sm:text-[11px] font-medium shadow-sm flex items-center gap-1.5 z-10 pointer-events-none backdrop-blur-xs border border-white/10">
                    <i className="fas fa-images text-[9px] text-[#D9A441]"></i>
                    <span>{currentGalleryIdx + 1} / {galleryImages.length}</span>
                  </div>
                </>
              )}
            </div>

            {/* Multi-Image Thumbnail Selector Strip */}
            {galleryImages.length > 1 ? (
              <div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {galleryImages.map((img, idx) => (
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      key={idx}
                      type="button"
                      onClick={() => setCurrentGalleryIdx(idx)}
                      onMouseEnter={() => setCurrentGalleryIdx(idx)}
                      className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 bg-white p-1 transition-all overflow-hidden cursor-pointer ${
                        currentGalleryIdx === idx
                          ? 'border-[#B5532E] shadow-sm ring-2 ring-[#B5532E]/20'
                          : 'border-[#EAE3D9] opacity-70 hover:opacity-100 hover:border-[#78716C]'
                      }`}
                      title={`View Angle ${idx + 1}`}
                    >
                      <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-contain pointer-events-none" />
                    </motion.button>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#78716C] mt-1 px-0.5">
                  <span className="flex items-center gap-1 text-[#1D1917] font-medium">
                    <i className="fas fa-hand-pointer text-[#B5532E]"></i> Click or hover thumbnail to switch angle
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    className="hover:text-[#B5532E] font-semibold flex items-center gap-1 transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    <i className="fas fa-expand text-[10px]"></i> Fullscreen
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs text-[#78716C] px-1">
                <span className="flex items-center gap-1 text-[11px] text-[#1D1917]">
                  <i className="fas fa-camera text-[#B5532E]"></i> 1 Photo Available
                </span>
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="text-[11px] hover:text-[#B5532E] font-semibold flex items-center gap-1 transition-colors bg-transparent border-0 cursor-pointer"
                >
                  <i className="fas fa-magnifying-glass-plus"></i> Click photo to zoom
                </button>
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Controls (7 Cols) */}
          <div className="lg:col-span-7">
            
            {/* Category, SKU & Rating Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B5532E]">
                  {product.categoryName || 'MARKETSQUARE Store'}
                </span>
                <span className="text-[#C5BDB5]">•</span>
                <span className="text-xs text-[#78716C] font-mono">
                  SKU: {currentSku}
                </span>
              </div>
              <a href="#reviews" className="flex items-center gap-1 text-xs text-[#D9A441] font-semibold hover:underline">
                <i className="fas fa-star"></i>
                <span>{avgRating}</span>
                <span className="text-[#78716C] font-normal">({reviews.length} reviews)</span>
              </a>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold apple-heading text-[#1D1917] mb-3 leading-tight tracking-tight">
              {product.title}
            </h1>

            {/* Pricing Bar */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] mb-4 flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#B5532E] tracking-tight">
                  {formatPrice(currentPriceNgn, currentPriceUsd)}
                </span>
                {product.oldPriceNgn && product.oldPriceNgn > currentPriceNgn && (
                  <>
                    <span className="text-sm text-[#78716C] line-through font-normal">
                      {formatPrice(product.oldPriceNgn, product.oldPriceUsd || 0)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#B3261E] text-white text-[11px] font-bold uppercase tracking-wider">
                      Save {discountPct}%
                    </span>
                  </>
                )}
              </div>

              {/* Dynamic Stock Indicator */}
              <div>
                {product.type === 'physical' ? (
                  currentStock > 10 ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#4F6B3A]/10 text-[#4F6B3A] border border-[#4F6B3A]/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4F6B3A]"></span> In Stock ({currentStock} units)
                    </span>
                  ) : currentStock > 0 ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#D9A441]/15 text-[#8F3B1F] border border-[#D9A441]/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441]"></span> Low Stock ({currentStock} left)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#B3261E]/10 text-[#B3261E] border border-[#B3261E]/20">
                      Out of Stock
                    </span>
                  )
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#3E5C76]/10 text-[#3E5C76] border border-[#3E5C76]/20 flex items-center gap-1.5">
                    <i className="fas fa-infinity text-[#3E5C76]"></i> Lifetime Access • Unlimited Downloads
                  </span>
                )}
              </div>
            </div>

            {/* Hook / Value Proposition */}
            {product.hook && (
              <div className="mb-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9]">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-[#B5532E]/10 text-[#B5532E] flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                    ✦
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-[#1D1917] leading-relaxed">
                    {product.hook}
                  </p>
                </div>
              </div>
            )}

            {/* Purchase Form with Dynamic Variations */}
            <div className="space-y-4">
              
              {/* Product Variations / Variety Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1D1917] flex items-center gap-2">
                      <i className="fas fa-sliders text-[#B5532E]"></i> Select Option
                    </h3>
                    <span className="text-xs text-[#78716C]">{product.variants.length} options</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.variants.map((v: any, idx: number) => {
                      const vId = v.id || v.name;
                      const isSelected = selectedVariantId === vId;
                      const vPriceNgn = v.priceNgn || currentPriceNgn;
                      const vPriceUsd = v.priceUsd || currentPriceUsd;
                      const vSku = v.sku || `${currentSku}-${idx + 1}`;
                      const vStock = v.stockQuantity || currentStock;

                      return (
                        <motion.div
                          whileTap={{ scale: 0.98 }}
                          key={vId}
                          onClick={() => setSelectedVariantId(vId)}
                          className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 bg-white ${
                            isSelected
                              ? 'border-[#B5532E] ring-1 ring-[#B5532E] shadow-xs'
                              : 'border-[#EAE3D9] hover:border-[#78716C]'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#1D1917] truncate">{v.name}</p>
                            <p className="text-[10px] text-[#78716C] font-mono">SKU: {vSku}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-bold text-[#B5532E] block">
                              {formatPrice(vPriceNgn, vPriceUsd)}
                            </span>
                            <span className="text-[10px] text-[#78716C]">{vStock} left</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add to Cart Action */}
              <div className="flex items-center gap-2 sm:gap-3">
                {product.type === 'physical' && (
                  <div className="w-24 sm:w-28 flex-shrink-0">
                    <div className="flex items-center border border-[#EAE3D9] rounded-xl bg-[#FAF7F2] overflow-hidden h-12">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 sm:w-9 h-full flex items-center justify-center text-[#78716C] hover:text-[#1D1917] transition-colors font-bold text-base bg-transparent border-0 cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                        min={1}
                        max={10}
                        className="w-full text-center font-bold text-sm bg-transparent border-0 focus:outline-none text-[#1D1917]"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                        className="w-8 sm:w-9 h-full flex items-center justify-center text-[#78716C] hover:text-[#1D1917] transition-colors font-bold text-base bg-transparent border-0 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  type="button"
                  onClick={(e) => handleAddToCart(e)}
                  className="flex-1 min-w-0 h-12 px-2 sm:px-4 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 sm:gap-2 border-0 cursor-pointer apple-pressable"
                >
                  <i className="fas fa-cart-plus text-xs"></i>
                  <span className="truncate">Add to Bag</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  type="button"
                  onClick={(e) => {
                    handleAddToCart(e);
                    router.push('/checkout');
                  }}
                  className="hidden sm:flex h-12 px-4 bg-[#161311] hover:bg-[#2A2320] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors items-center justify-center gap-1.5 border border-white/10 cursor-pointer apple-pressable"
                >
                  <span>Buy Now</span>
                </motion.button>

                {/* Save to Wishlist Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={(e) => {
                    const sourceEl = document.getElementById('product-page-main-visual') || (e.currentTarget as HTMLElement);
                    toggleWishlist(product.id, sourceEl, product);
                  }}
                  title={inWish ? 'Remove from Wishlist' : 'Save to Wishlist'}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center text-base sm:text-lg transition-colors flex-shrink-0 cursor-pointer apple-pressable ${
                    inWish
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-[#FAF7F2] border-[#EAE3D9] text-[#78716C] hover:text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  <i className={`${inWish ? 'fas text-rose-500' : 'far'} fa-heart`}></i>
                </motion.button>
              </div>
            </div>

            {/* Delivery, Returns & Merchant Information Box */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#B5532E]/10 text-[#B5532E] flex items-center justify-center flex-shrink-0 text-xs">
                  <i className="fas fa-truck-fast"></i>
                </div>
                <div>
                  <h5 className="font-bold text-[#1D1917]">Door Delivery Across Nigeria</h5>
                  <p className="text-[11px] text-[#78716C] mt-0.5">Dispatched within 24-72 hours across 36 states.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#4F6B3A]/10 text-[#4F6B3A] flex items-center justify-center flex-shrink-0 text-xs">
                  <i className="fas fa-rotate-left"></i>
                </div>
                <div>
                  <h5 className="font-bold text-[#1D1917]">7-Day Free Returns</h5>
                  <p className="text-[11px] text-[#78716C] mt-0.5">Hassle-free replacement or refund guarantee.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#D9A441]/15 text-[#8F3B1F] flex items-center justify-center flex-shrink-0 text-xs">
                  <i className="fas fa-shield-halved"></i>
                </div>
                <div>
                  <h5 className="font-bold text-[#1D1917]">100% Genuine Guaranteed</h5>
                  <p className="text-[11px] text-[#78716C] mt-0.5">Authentic sourced products with warranty.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#3E5C76]/10 text-[#3E5C76] flex items-center justify-center flex-shrink-0 text-xs">
                  <i className="fas fa-store"></i>
                </div>
                <div>
                  <h5 className="font-bold text-[#1D1917]">Verified Seller</h5>
                  <p className="text-[11px] text-[#78716C] mt-0.5 truncate max-w-[180px]">
                    {product.storeName || 'Authorized Vendor Partner'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Highlights Bullets */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="mt-4 pt-3.5 border-t border-[#EAE3D9]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1D1917] flex items-center gap-1.5">
                    <i className="fas fa-list-check text-[#B5532E]"></i> Key Feature Highlights
                  </h4>
                  <a href="#highlights" className="text-[11px] text-[#B5532E] font-semibold hover:underline flex items-center gap-1">
                    <span>View Full Specs</span> <i className="fas fa-arrow-down text-[10px]"></i>
                  </a>
                </div>
                <ul className="space-y-1.5 text-xs text-[#1D1917]">
                  {product.highlights.slice(0, 3).map((h: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-[11px] sm:text-xs leading-relaxed">
                      <span className="w-4 h-4 rounded bg-[#4F6B3A]/15 text-[#4F6B3A] flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">✓</span>
                      <span className="text-[#1D1917] line-clamp-1">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>

        {/* ════════════════════════════════════════════════════════════════════════
             LOWER SECTION: CATALOG DOSSIER (8 + 4 Grid)
             ════════════════════════════════════════════════════════════════════════ */}
        <div className="mt-10 grid lg:grid-cols-12 gap-8 items-start">

          {/* Left Main Column (8 Cols): In-Depth Product Dossier */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Features & Benefits */}
            {product.scannableBenefits && product.scannableBenefits.length > 0 ? (
              <div id="highlights" className="bg-white rounded-3xl border border-[#EAE3D9] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EAE3D9]">
                  <h2 className="text-base sm:text-lg font-bold text-[#1D1917] uppercase tracking-wider flex items-center gap-2.5">
                    <i className="fas fa-list-check text-[#B5532E]"></i> Features & Real-World Benefits
                  </h2>
                  <span className="text-[10px] font-semibold text-[#4F6B3A] bg-[#4F6B3A]/10 border border-[#4F6B3A]/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <i className="fas fa-check-circle"></i> High-Impact Value
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.scannableBenefits.map((b: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] flex items-start gap-3 transition-colors hover:border-[#B5532E]">
                      <span className="w-5 h-5 rounded-lg bg-[#4F6B3A]/15 text-[#4F6B3A] flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✓</span>
                      <div>
                        <strong className="block text-xs sm:text-sm font-bold text-[#1D1917] mb-1">{b.benefit}</strong>
                        <p className="text-xs text-[#78716C] leading-relaxed m-0">{b.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : product.highlights && product.highlights.length > 0 && (
              <div id="highlights" className="bg-white rounded-3xl border border-[#EAE3D9] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EAE3D9]">
                  <h2 className="text-base sm:text-lg font-bold text-[#1D1917] uppercase tracking-wider flex items-center gap-2.5">
                    <i className="fas fa-list-check text-[#B5532E]"></i> Key Features & Highlights
                  </h2>
                  <span className="text-[10px] font-semibold text-[#4F6B3A] bg-[#4F6B3A]/10 border border-[#4F6B3A]/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <i className="fas fa-check-circle"></i> Verified Specifications
                  </span>
                </div>

                <ul className="space-y-3.5">
                  {product.highlights.map((h: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#1D1917] leading-relaxed">
                      <span className="w-5 h-5 rounded-lg bg-[#4F6B3A]/15 text-[#4F6B3A] flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Detailed Narrative Description */}
            <div className="bg-white rounded-3xl border border-[#EAE3D9] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EAE3D9]">
                <h2 className="text-base sm:text-lg font-bold text-[#1D1917] uppercase tracking-wider flex items-center gap-2.5">
                  <i className="fas fa-align-left text-[#B5532E]"></i> Overview & Details
                </h2>
                <span className="text-[10px] font-semibold text-[#78716C] uppercase tracking-wider">Overview</span>
              </div>

              <div className="prose max-w-none text-[#1D1917]/85 leading-relaxed text-xs sm:text-sm space-y-4">
                {product.narrativeStory ? (
                  <>
                    <p className="text-sm leading-relaxed text-[#1D1917] font-medium">{product.narrativeStory}</p>
                    {product.description && product.description !== product.narrativeStory && (
                      <p className="text-xs text-[#78716C] leading-relaxed pt-2 border-t border-[#EAE3D9]">{product.description}</p>
                    )}
                  </>
                ) : (
                  <p>{product.description}</p>
                )}

                {product.warranty && (
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] flex items-center gap-3">
                    <i className="fas fa-certificate text-lg text-[#D9A441]"></i>
                    <p className="text-xs font-semibold text-[#1D1917] m-0">
                      <strong>Official Warranty:</strong> {product.warranty}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Technical Specifications */}
            {product.specs && product.specs.length > 0 && (
              <div className="bg-white rounded-3xl border border-[#EAE3D9] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EAE3D9]">
                  <h2 className="text-base sm:text-lg font-bold text-[#1D1917] uppercase tracking-wider flex items-center gap-2.5">
                    <i className="fas fa-microchip text-[#B5532E]"></i> Technical Specifications
                  </h2>
                  <span className="text-[10px] font-semibold text-[#78716C] uppercase tracking-wider flex items-center gap-1">
                    <i className="fas fa-certificate text-[#4F6B3A]"></i> Exact Dimensions & Data
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#EAE3D9] bg-white">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <tbody className="divide-y divide-[#EAE3D9]">
                      {product.specs.map((spec: any, idx: number) => (
                        <tr
                          key={idx}
                          className={`${idx % 2 === 1 ? 'bg-[#FAF7F2]' : 'bg-white'} transition-colors hover:bg-[#F5F0E8]`}
                        >
                          <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-[#78716C] w-2/5 border-r border-[#EAE3D9] text-[11px] sm:text-xs uppercase tracking-wider break-words">
                            {spec.label}
                          </td>
                          <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-medium text-[#1D1917] break-words">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sizing & Fit Guide */}
            {product.sizingGuide && (
              <div className="bg-white rounded-3xl border border-[#EAE3D9] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EAE3D9]">
                  <h2 className="text-base sm:text-lg font-bold text-[#1D1917] uppercase tracking-wider flex items-center gap-2.5">
                    <i className="fas fa-ruler-combined text-[#B5532E]"></i> Sizing & Fit Guide
                  </h2>
                  <span className="text-[10px] font-semibold text-[#8F3B1F] bg-[#F5EDE3] px-2.5 py-1 rounded-full">
                    Sizing Reference
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] mb-4 space-y-1.5">
                  <p className="text-xs sm:text-sm font-semibold text-[#1D1917] m-0">
                    <strong className="text-[#B5532E]">Fit Notes:</strong> {product.sizingGuide.fitNotes}
                  </p>
                  {product.sizingGuide.modelStats && (
                    <p className="text-xs text-[#78716C] m-0">
                      <strong>Model Reference:</strong> {product.sizingGuide.modelStats}
                    </p>
                  )}
                </div>

                {product.sizingGuide.chart && product.sizingGuide.chart.length > 0 && (
                  <div className="overflow-x-auto rounded-2xl border border-[#EAE3D9]">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-[#FAF7F2] text-[#78716C] uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="py-2.5 px-4 border-b border-[#EAE3D9]">Dimension</th>
                          <th className="py-2.5 px-4 border-b border-[#EAE3D9]">Metric (cm)</th>
                          <th className="py-2.5 px-4 border-b border-[#EAE3D9]">Imperial (in)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAE3D9]">
                        {product.sizingGuide.chart.map((row: any, i: number) => (
                          <tr key={i} className={i % 2 === 1 ? 'bg-[#FAF7F2]' : 'bg-white'}>
                            <td className="py-2.5 px-4 font-semibold text-[#1D1917]">{row.label}</td>
                            <td className="py-2.5 px-4 font-bold text-[#B5532E]">{row.metric}</td>
                            <td className="py-2.5 px-4 text-[#78716C]">{row.imperial || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* What's in the Box */}
            {product.boxContents && product.boxContents.length > 0 && (
              <div className="bg-white rounded-3xl border border-[#EAE3D9] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EAE3D9]">
                  <h2 className="text-base sm:text-lg font-bold text-[#1D1917] uppercase tracking-wider flex items-center gap-2.5">
                    <i className="fas fa-box-open text-[#B5532E]"></i> What's in the Box
                  </h2>
                  <span className="text-[10px] font-semibold text-[#4F6B3A] bg-[#4F6B3A]/10 border border-[#4F6B3A]/20 px-2.5 py-1 rounded-full">
                    Package Checklist
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#EAE3D9] text-[#1D1917] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                    <i className="fas fa-boxes-packing text-xs text-[#B5532E]"></i>
                  </div>
                  <div className="space-y-1.5 pt-0.5 flex-1">
                    {Array.isArray(product.boxContents) ? (
                      <ul className="space-y-2 text-xs sm:text-sm font-semibold text-[#1D1917] list-none p-0 m-0">
                        {product.boxContents.map((b: string, i: number) => (
                          <li key={i} className="flex items-center gap-2.5">
                            <span className="w-4 h-4 rounded-full bg-[#B5532E]/10 text-[#B5532E] text-[10px] font-bold flex items-center justify-center flex-shrink-0">✓</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs sm:text-sm font-medium text-[#1D1917] leading-relaxed">
                        {product.boxContents}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Frequently Asked Questions */}
            {product.faq && product.faq.length > 0 && (
              <div className="bg-white rounded-3xl border border-[#EAE3D9] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EAE3D9]">
                  <h2 className="text-base sm:text-lg font-bold text-[#1D1917] uppercase tracking-wider flex items-center gap-2.5">
                    <i className="fas fa-circle-question text-[#B5532E]"></i> Frequently Asked Questions
                  </h2>
                  <span className="text-[10px] font-semibold text-[#78716C] uppercase tracking-wider">
                    Buyer Doubts Handled
                  </span>
                </div>

                <div className="space-y-3">
                  {product.faq.map((item: any, idx: number) => {
                    const isOpen = openFaqIdx === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-[#EAE3D9] bg-[#FAF7F2] overflow-hidden transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                          className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#1D1917] flex items-center justify-between gap-3 bg-transparent border-0 cursor-pointer hover:text-[#B5532E] transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-[#B5532E] font-extrabold">Q:</span>
                            {item.question}
                          </span>
                          <i className={`fas fa-chevron-down text-xs text-[#78716C] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#B5532E]' : ''}`}></i>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[#1D1917]/80 leading-relaxed border-t border-[#EAE3D9] bg-white/50">
                            <p className="m-0"><strong className="text-[#4F6B3A]">Answer:</strong> {item.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Customer Reviews & Ratings Section */}
            <div id="reviews" className="bg-white rounded-3xl border border-[#EAE3D9] p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#EAE3D9]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold apple-heading text-[#1D1917] mb-1">
                    Customer Reviews & Ratings
                  </h2>
                  <p className="text-xs text-[#78716C]">Verified buyer feedback and authentic ratings.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center sm:text-right">
                    <div className="text-3xl font-extrabold text-[#1D1917] leading-none tracking-tight">{avgRating}</div>
                    <div className="flex items-center gap-1 text-xs text-[#D9A441] my-1 justify-center sm:justify-end">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <i
                          key={s}
                          className={`fas fa-star ${s <= Math.round(Number(avgRating)) ? 'text-[#D9A441]' : 'text-stone-300'}`}
                        ></i>
                      ))}
                    </div>
                    <div className="text-[11px] text-[#78716C] font-normal">
                      Based on {reviews.length} ratings
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Cards List */}
              <div className="py-6 space-y-4">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-[#1D1917]">{rev.name}</span>
                          {rev.isVerified && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#4F6B3A]/10 text-[#4F6B3A] border border-[#4F6B3A]/20 flex items-center gap-1">
                              <i className="fas fa-check-circle text-[9px]"></i> Verified Buyer
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[#D9A441]">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <i
                              key={s}
                              className={`fas fa-star ${s <= rev.rating ? 'text-[#D9A441]' : 'text-stone-300'} text-[11px]`}
                            ></i>
                          ))}
                          {rev.title && (
                            <span className="text-xs font-semibold text-[#1D1917] ml-1.5">{rev.title}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] text-[#78716C] font-mono">{rev.date}</span>
                    </div>
                    <p className="text-xs text-[#1D1917]/80 leading-relaxed mt-2">{rev.comment}</p>
                  </div>
                ))}
              </div>

              {/* Write a Review Form */}
              <div className="pt-6 border-t border-[#EAE3D9]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1D1917] mb-4">
                  Write a Customer Review
                </h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1D1917] uppercase tracking-wider mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        name="customer_name"
                        required
                        placeholder="Full Name"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B5532E] text-[#1D1917]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1D1917] uppercase tracking-wider mb-1">
                        Rating
                      </label>
                      <select
                        name="rating"
                        value={reviewRating}
                        onChange={(e) => setReviewRating(parseInt(e.target.value))}
                        className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B5532E] text-[#1D1917] cursor-pointer"
                      >
                        <option value="5">★★★★★ (5 - Excellent)</option>
                        <option value="4">★★★★☆ (4 - Very Good)</option>
                        <option value="3">★★★☆☆ (3 - Average)</option>
                        <option value="2">★★☆☆☆ (2 - Below Expectations)</option>
                        <option value="1">★☆☆☆☆ (1 - Poor)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1D1917] uppercase tracking-wider mb-1">
                      Review Headline
                    </label>
                    <input
                      type="text"
                      name="review_title"
                      placeholder="Summary of your experience"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B5532E] text-[#1D1917]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1D1917] uppercase tracking-wider mb-1">
                      Your Feedback
                    </label>
                    <textarea
                      name="comment"
                      rows={3}
                      required
                      placeholder="Detailed review of packaging, functionality, delivery, or build quality..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B5532E] text-[#1D1917]"
                    ></textarea>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    className="px-6 py-2.5 bg-[#B5532E] hover:bg-[#8F3B1F] text-white text-xs font-bold rounded-xl transition-colors shadow-xs border-0 cursor-pointer apple-pressable"
                  >
                    Submit Review
                  </motion.button>
                </form>
              </div>

            </div>

          </div>

          {/* Right Sticky Column (4 Cols): Delivery, Warranty & Seller Profile */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">

            {/* Delivery & Shipping Card */}
            <div className="bg-white rounded-3xl border border-[#EAE3D9] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1D1917] flex items-center gap-2">
                  <i className="fas fa-truck-fast text-[#B5532E]"></i> Delivery & Returns
                </h3>
                <span className="text-[10px] font-semibold text-[#4F6B3A] bg-[#4F6B3A]/10 px-2 py-0.5 rounded-full">
                  Express Available
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#B5532E]/10 text-[#B5532E] flex items-center justify-center flex-shrink-0 text-xs">
                    <i className="fas fa-location-dot"></i>
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1D1917]">Door Delivery Across Nigeria</h5>
                    <p className="text-[#78716C] text-[11px] mt-0.5">
                      Delivery within 24-72 hours across Lagos, Abuja, Port Harcourt, and 36 states.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE3D9]">
                  <div className="w-7 h-7 rounded-lg bg-[#B5532E] text-white flex items-center justify-center flex-shrink-0 text-xs shadow-xs">
                    <i className="fas fa-truck-fast"></i>
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1D1917]">Kaduna Same-Day Dispatch</h5>
                    <p className="text-[#78716C] text-[11px] mt-0.5">
                      Orders placed before 2:00 PM are delivered within 4 hours in Kaduna metropolis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#3E5C76]/10 text-[#3E5C76] flex items-center justify-center flex-shrink-0 text-xs">
                    <i className="fas fa-box"></i>
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1D1917]">Pickup Stations</h5>
                    <p className="text-[#78716C] text-[11px] mt-0.5">
                      Collect your package from 150+ verified pickup hubs nationwide.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#4F6B3A]/10 text-[#4F6B3A] flex items-center justify-center flex-shrink-0 text-xs">
                    <i className="fas fa-rotate-left"></i>
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1D1917]">7-Day Free Returns</h5>
                    <p className="text-[#78716C] text-[11px] mt-0.5">
                      Hassle-free replacement or full refund on defective items.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#D9A441]/15 text-[#8F3B1F] flex items-center justify-center flex-shrink-0 text-xs">
                    <i className="fas fa-shield-halved"></i>
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1D1917]">100% Genuine Guaranteed</h5>
                    <p className="text-[#78716C] text-[11px] mt-0.5">
                      Every unit is sourced directly from certified brands and authorized distributors.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Seller Information Card */}
            <div className="bg-white rounded-3xl border border-[#EAE3D9] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1D1917] flex items-center gap-2">
                  <i className="fas fa-store text-[#B5532E]"></i> Seller Information
                </h3>
                <span className="text-[10px] font-semibold text-[#4F6B3A] bg-[#4F6B3A]/10 border border-[#4F6B3A]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <i className="fas fa-check-circle"></i> Verified
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#B5532E] text-white flex items-center justify-center font-bold text-base shadow-xs">
                    <i className="fas fa-store"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1D1917]">{product.storeName}</h4>
                    <p className="text-[11px] text-[#78716C]">Authorized Merchant Partner</p>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-2xl grid grid-cols-2 gap-2 text-center border border-[#EAE3D9]">
                  <div>
                    <span className="text-xs font-extrabold text-[#4F6B3A]">98%</span>
                    <span className="text-[10px] text-[#78716C] block font-medium">Seller Score</span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-[#B5532E]">99.4%</span>
                    <span className="text-[10px] text-[#78716C] block font-medium">On-Time Dispatch</span>
                  </div>
                </div>

                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link
                    href={`/shop?q=${encodeURIComponent(product.storeName)}`}
                    className="w-full py-2.5 bg-[#FAF7F2] hover:bg-[#F5F0E8] text-[#1D1917] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-[#EAE3D9]"
                  >
                    <span>Visit Seller Store</span>
                    <i className="fas fa-arrow-right text-[10px]"></i>
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Merchant Quick Actions Card */}
            <div className="apple-glass-dark text-white rounded-3xl p-6 shadow-md space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-xs text-[#D9A441] border border-white/10">
                  <i className="fas fa-pen-ruler"></i>
                </span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Merchant Quick Actions</h4>
                  <p className="text-[10px] text-white/60">Catalog Listing Owner</p>
                </div>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Update prices, manage key features, variety options, and stock allocations directly in the seller console.
              </p>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/sell"
                  className="w-full py-3 bg-[#D9A441] hover:bg-[#D9A441]/90 text-[#161311] font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-pen-to-square"></i>
                  <span>Manage Product Listing</span>
                </Link>
              </motion.div>
            </div>

          </div>

        </div>

      </main>

      {/* Lightbox Modal with AnimatePresence */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsLightboxOpen(false);
            }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            {/* Close Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              title="Close (Esc)"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg transition-colors z-50 border border-white/20 cursor-pointer"
            >
              <i className="fas fa-xmark"></i>
            </motion.button>

            {/* Title & Index Header */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-3 text-white z-40 max-w-[80vw]">
              <span className="px-3 py-1 rounded-xl bg-white/10 text-xs font-mono font-semibold tracking-wider border border-white/10">
                {currentGalleryIdx + 1} / {galleryImages.length}
              </span>
              <span className="text-sm font-semibold truncate hidden sm:inline drop-shadow-sm">
                {product.title}
              </span>
            </div>

            {galleryImages.length > 1 && (
              <>
                {/* Prev Arrow */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => navigateGallery(-1)}
                  title="Previous Angle"
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg transition-colors z-40 border border-white/20 cursor-pointer"
                >
                  <i className="fas fa-chevron-left"></i>
                </motion.button>

                {/* Next Arrow */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => navigateGallery(1)}
                  title="Next Angle"
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg transition-colors z-40 border border-white/20 cursor-pointer"
                >
                  <i className="fas fa-chevron-right"></i>
                </motion.button>
              </>
            )}

            {/* Centered Image Container */}
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="max-w-4xl max-h-[75vh] w-full h-full flex items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages[currentGalleryIdx] || product.image}
                alt={product.title}
                className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl"
              />
            </motion.div>

            {galleryImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[92vw] overflow-x-auto p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2 z-40 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    key={idx}
                    type="button"
                    onClick={() => setCurrentGalleryIdx(idx)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white/5 cursor-pointer ${
                      currentGalleryIdx === idx
                        ? 'border-white ring-2 ring-white/50'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-contain p-0.5" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
