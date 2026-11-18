export interface ScannableBenefit {
  benefit: string;
  explanation: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface SizingGuide {
  fitNotes: string;
  modelStats?: string;
  chart?: Array<{
    label: string;
    metric: string;
    imperial?: string;
  }>;
}

export interface TrustShippingInfo {
  warrantyDuration: string;
  returnPolicy: string;
  kadunaSameDay: boolean;
  nationwideDelivery: string;
  sellerAccredited: boolean;
  escrowProtected: boolean;
}

export interface ProductDetailItem {
  id: string;
  sku: string;
  title: string;
  brand: string;
  category: string;
  categoryName: string;
  priceNgn: number;
  oldPriceNgn?: number;
  priceUsd: number;
  oldPriceUsd?: number;
  image: string;
  gallery: string[];
  rating: number;
  reviewsCount: number;
  storeName: string;
  vendorTier?: string;
  vendorRating?: number;
  vendorLocation?: string;
  type: 'physical' | 'digital';
  stockLeft: number;
  deliveryEstimate: string;
  warranty: string;
  description: string;
  
  // 10 Core High-Converting Components
  hook: string; // 2. Engaging Hook / Value Proposition
  scannableBenefits: ScannableBenefit[]; // 3. Scannable Bullet Points (Features & Benefits)
  narrativeStory: string; // 4. Detailed Narrative Description
  specs: Array<{ label: string; value: string }>; // 5. Technical Specifications Matrix
  sizingGuide?: SizingGuide; // 6. Sizing & Fit Guide
  boxContents: string[]; // 7. "What's in the Box" (Package Contents)
  trustShipping: TrustShippingInfo; // 8. Trust Signals, Warranty & Shipping Info
  faq: ProductFaq[]; // 10. Social Proof & FAQ

  highlights: string[];
  variants: Array<{
    id: string;
    name: string;
    sku?: string;
    priceNgn?: number;
    priceUsd?: number;
    inStock: boolean;
    stockQuantity?: number;
  }>;
  offerId?: string;
  otherOffers?: Array<{
    vendorId: string;
    vendorName: string;
    vendorRating?: number;
    priceNgn: number;
    priceUsd: number;
    condition: string;
    deliveryTime?: string;
    dispatchCity?: string;
  }>;
}

export const CATALOG_PRODUCTS_MAP: Record<string, ProductDetailItem> = {
  // ══════════════════════════════════════════════════════════════════════════
  // PRODUCT 1: SONY WH-1000XM5 HEADPHONES
  // ══════════════════════════════════════════════════════════════════════════
  '66666666-6666-6666-6666-666666666661': {
    id: '66666666-6666-6666-6666-666666666661',
    sku: 'SNY-WH1000XM5-BLK',
    // 1. Product Title: [Brand] + [Product Name] + [Key Differentiator/Material] + [Size/Color/Model]
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Over-Ear Headphones – Carbon Fiber Drivers, Black',
    brand: 'Sony',
    category: 'electronics',
    categoryName: 'Electronics & Audio',
    priceNgn: 450000,
    oldPriceNgn: 580000,
    priceUsd: 320,
    oldPriceUsd: 399,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85',
    ],
    rating: 4.9,
    reviewsCount: 384,
    storeName: 'Sony Audio Official Store',
    vendorTier: 'Tier 1 Premier Partner',
    vendorRating: 4.9,
    vendorLocation: 'Ikeja Central Logistics Hub, Lagos',
    type: 'physical',
    stockLeft: 45,
    deliveryEstimate: 'Marketsquare Express • Tomorrow, by 5:00 PM',
    warranty: '1 Year Official Sony Nigeria Warranty & Replacement Guarantee',
    description:
      'The Sony WH-1000XM5 headphones rewrite the rules for distraction-free listening. Two processors control 8 microphones for unprecedented noise cancellation and exceptional call quality with four beamforming microphones.',
    
    // 2. Engaging Hook / Value Proposition (Short Summary)
    hook:
      'Silence chaotic commutes and open-plan offices instantly with industry-leading dual-processor noise cancellation, studio-grade High-Res audio, and 30 hours of ultra-plush listening comfort.',
    
    // 3. Scannable Bullet Points (Features & Benefits)
    scannableBenefits: [
      {
        benefit: 'Complete Acoustic Isolation',
        explanation: 'Dual QN1 processors and 8 beamforming microphones automatically silence engine roar, chatter, and ambient distraction in real time.',
      },
      {
        benefit: 'Audiophile Acoustic Precision',
        explanation: 'Custom 30mm carbon fiber composite dome drivers reproduce crisp highs and rich, punchy bass with LDAC high-resolution clarity.',
      },
      {
        benefit: 'All-Day Cloud Comfort',
        explanation: 'Featherlight 250g chassis wrapped in soft-fit synthetic leather minimizes temple pressure during 8+ hour marathon listening sessions.',
      },
      {
        benefit: 'Fast Power for Urgent Travel',
        explanation: 'Get 3 full hours of high-volume playback from a single 3-minute USB-PD quick charge.',
      },
      {
        benefit: 'Effortless Multipoint Switching',
        explanation: 'Stays seamlessly connected to your laptop and smartphone simultaneously, answering incoming calls without manual unpairing.',
      },
    ],

    // 4. Detailed Narrative Description
    narrativeStory:
      'Whether navigating the bustling streets of Lagos, powering through intensive study hours at Ahmadu Bello University, or boarding a long-haul flight, the Sony WH-1000XM5 creates an immediate personal oasis of pure sound. The redesigned stepless headband glides effortlessly into place with zero creaking, while the smart capacitive earcups allow you to pause playback or lower volume simply by cupping your hand over the right ear. Engineered with Sony’s proprietary Precise Voice Pickup technology, your callers will hear your natural voice clearly even in breezy outdoor environments.',

    // 5. Technical Specifications (Specs Table)
    specs: [
      { label: 'Model Number / SKU', value: 'WH-1000XM5 / SNY-WH1000XM5-BLK' },
      { label: 'Acoustic Design', value: 'Over-Ear, Closed-Back Dynamic' },
      { label: 'Driver Unit', value: '30mm, Carbon Fiber Composite Dome with Neodymium Magnets' },
      { label: 'Frequency Response', value: '4 Hz – 40,000 Hz (JEITA standard)' },
      { label: 'Battery Runtime', value: 'Up to 30 Hours (ANC On) / 40 Hours (ANC Off)' },
      { label: 'Fast Charge Duration', value: '3 Minutes charge = 3 Hours playback (via USB-PD)' },
      { label: 'Connectivity', value: 'Bluetooth 5.2 (LDAC, AAC, SBC) + 3.5mm Gold-Plated Aux' },
      { label: 'Dimensions (H × W × D)', value: '24.5 cm × 20.3 cm × 7.6 cm' },
      { label: 'Net Weight', value: '250 grams (8.8 oz)' },
      { label: 'Materials', value: 'Recycled ABS Automotive Plastic & Soft-Fit Synthetic Leather' },
      { label: 'Country of Origin', value: 'Japan (Assembled in Malaysia)' },
    ],

    // 6. Sizing & Fit Guide
    sizingGuide: {
      fitNotes: 'Ergonomic circum-aural design. Fits securely around all ear shapes without cartilage pinching. Adjustable stepless slider accommodates hat or cap wearers.',
      modelStats: 'Tested for universal comfort across 100+ head shapes; clamping force balanced at 4.2N.',
      chart: [
        { label: 'Earcup Inner Height', metric: '6.5 cm', imperial: '2.56 in' },
        { label: 'Earcup Inner Width', metric: '4.5 cm', imperial: '1.77 in' },
        { label: 'Headband Extension Range', metric: '0 – 4.2 cm per side', imperial: '0 – 1.65 in' },
      ],
    },

    // 7. "What's in the Box" (Package Contents)
    boxContents: [
      '1× Sony WH-1000XM5 Wireless Noise Cancelling Headphones (Black)',
      '1× Collapsible Premium Magnetic Hard Travel Case',
      '1× 3.5mm Gold-Plated Audio Cable (1.2m / 3.9ft)',
      '1× USB-A to USB-C Fast-Charging Cable',
      '1× Sony Nigeria Official Warranty Card & Quick Setup Guide',
    ],

    // 8. Trust Signals, Warranty & Shipping Info
    trustShipping: {
      warrantyDuration: '1-Year Official Sony Manufacturer Warranty with direct authorized service center support.',
      returnPolicy: '7-Day Hassle-Free Return or Replacement Guarantee if factory seals are uncompromised.',
      kadunaSameDay: true,
      nationwideDelivery: 'Dispatched within 24h via Manga Verified Express. Delivered in 24-72h nationwide.',
      sellerAccredited: true,
      escrowProtected: true,
    },

    // 10. Social Proof & FAQ
    faq: [
      {
        question: 'Is this unit 100% genuine with an active Sony Nigeria warranty?',
        answer: 'Yes. All units are sourced directly from Sony Authorized Distributors and come with verifiable serial numbers and a 1-year official manufacturer warranty.',
      },
      {
        question: 'Can I use these headphones when the battery is completely dead?',
        answer: 'Yes! The included 3.5mm gold-plated audio cable allows passive wired listening even when the battery is drained.',
      },
      {
        question: 'How fast is delivery to Kaduna or Abuja?',
        answer: 'Orders within Kaduna metropolis qualify for same-day delivery (under 4 hours). Deliveries to Abuja, Kano, and Lagos arrive within 24–48 hours.',
      },
      {
        question: 'Does the microphone isolate background noise during Zoom/WhatsApp calls?',
        answer: 'Extremely well. The 4 beamforming microphones utilize an AI-trained noise-reduction algorithm to isolate your voice from wind, fans, and street chatter.',
      },
    ],

    highlights: [
      'Industry-leading noise cancellation optimized by Auto NC Optimizer',
      'Magnificent sound engineered to perfection with High-Resolution Audio',
      'Crystal clear hands-free calling with 4 beamforming microphones',
      'Up to 30-hour battery life with 3-minute quick charging for 3 hours of playback',
      'Ultra-comfortable, lightweight design in soft fit leather',
      'Multipoint connection lets you pair two Bluetooth devices simultaneously',
    ],
    variants: [
      { id: 'v1', name: 'Black (Standard Edition)', sku: 'SNY-WH1000XM5-BLK', priceNgn: 450000, priceUsd: 320, inStock: true, stockQuantity: 45 },
      { id: 'v2', name: 'Silver Platinum', sku: 'SNY-WH1000XM5-SLV', priceNgn: 460000, priceUsd: 325, inStock: true, stockQuantity: 18 },
      { id: 'v3', name: 'Midnight Blue Edition', sku: 'SNY-WH1000XM5-BLU', priceNgn: 475000, priceUsd: 335, inStock: true, stockQuantity: 9 },
    ],
    offerId: '88888888-8888-8888-8888-888888888881',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PRODUCT 2: SAMSUNG GALAXY S24 ULTRA
  // ══════════════════════════════════════════════════════════════════════════
  '66666666-6666-6666-6666-666666666662': {
    id: '66666666-6666-6666-6666-666666666662',
    sku: 'SAM-S24U-512-TI',
    // 1. Product Title
    title: 'Samsung Galaxy S24 Ultra 5G Flagship Smartphone – Grade 2 Titanium Frame with Embedded S-Pen, 512GB Titanium Black',
    brand: 'Samsung',
    category: 'computing',
    categoryName: 'Phones & Computing',
    priceNgn: 1850000,
    oldPriceNgn: 2100000,
    priceUsd: 1290,
    oldPriceUsd: 1450,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=85',
    ],
    rating: 4.8,
    reviewsCount: 96,
    storeName: 'Samsung Nigeria Official',
    vendorTier: 'Tier 1 Premier Partner',
    vendorRating: 4.9,
    vendorLocation: 'Victoria Island Hub, Lagos',
    type: 'physical',
    stockLeft: 28,
    deliveryEstimate: 'Marketsquare Express • Tomorrow, by 5:00 PM',
    warranty: '24 Months Official Samsung Care+ Warranty',
    description:
      'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity, and possibility. Built with a new titanium exterior and a 6.8" flat display.',
    
    // 2. Hook
    hook:
      'Harness cutting-edge Galaxy AI, an aerospace-grade titanium chassis, a peerless 200MP camera system, and the precision of the built-in S-Pen for maximum executive productivity.',
    
    // 3. Scannable Benefits
    scannableBenefits: [
      {
        benefit: 'Revolutionary Galaxy AI Suite',
        explanation: 'Instant Live Call Translation, Circle to Search with Google, and AI Note Assist summarize voice memos and documents automatically.',
      },
      {
        benefit: 'Pro-Grade 200MP Quad Tele System',
        explanation: 'Capture razor-sharp details in low light with optical-quality zoom up to 100x and 8K HDR video recording.',
      },
      {
        benefit: 'Rugged Aerospace Titanium Frame',
        explanation: 'Corning Gorilla Armor front glass cuts reflections by 75% while offering 4x superior scratch resistance over previous generations.',
      },
      {
        benefit: 'Desktop Performance in Your Pocket',
        explanation: 'Overclocked Snapdragon 8 Gen 3 with a 1.9x larger vapor chamber ensures zero thermal throttling during heavy multitasking or gaming.',
      },
    ],

    // 4. Narrative Story
    narrativeStory:
      'The Galaxy S24 Ultra is built for professionals who cannot afford downtime. From signing legal PDF contracts directly on the sunlight-readable 2,600-nit Dynamic AMOLED screen with the S-Pen, to shooting boardroom presentations with 200MP clarity, this device eliminates the need for carrying multiple tools. Backed by 7 full generations of guaranteed Android OS and security upgrades, your investment remains fast and secure well into the 2030s.',

    // 5. Specs
    specs: [
      { label: 'Model Number / SKU', value: 'SM-S928B/DS / SAM-S24U-512-TI' },
      { label: 'Display Specs', value: '6.8" Flat Dynamic AMOLED 2X, 1-120Hz LTPO, 2600 nits Peak' },
      { label: 'Processor', value: 'Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm Octa-Core)' },
      { label: 'Memory & Storage', value: '12GB LPDDR5X RAM / 512GB UFS 4.0' },
      { label: 'Rear Cameras', value: '200MP Main (OIS) + 50MP Periscope (5x) + 10MP Tele (3x) + 12MP Ultra-wide' },
      { label: 'Front Camera', value: '12MP Dual-Pixel AF with 4K60 video' },
      { label: 'Battery & Charging', value: '5,000 mAh, 45W Fast Wired, 15W Fast Wireless' },
      { label: 'Water & Dust Resistance', value: 'IP68 Certified (Submersible up to 1.5m for 30 mins)' },
      { label: 'Dimensions (H × W × D)', value: '162.3 mm × 79.0 mm × 8.6 mm' },
      { label: 'Weight', value: '232 grams' },
      { label: 'Country of Origin', value: 'South Korea' },
    ],

    // 6. Sizing & Fit
    sizingGuide: {
      fitNotes: 'Full-sized flagship phone with flat sides for enhanced grip security. Designed for one-handed S-Pen navigation and pocket carry in standard suit or trouser pockets.',
    },

    // 7. Box Contents
    boxContents: [
      '1× Samsung Galaxy S24 Ultra 5G (Titanium Black)',
      '1× Integrated S-Pen Stylus',
      '1× USB Type-C to Type-C 3A Cable',
      '1× Metal SIM Tray Ejector Tool',
      '1× Samsung Care+ 24-Month Warranty Certificate',
    ],

    // 8. Trust & Shipping
    trustShipping: {
      warrantyDuration: '24 Months Official Samsung Nigeria Care+ Warranty covering screen protection.',
      returnPolicy: '7-Day Return / Replacement Guarantee on unactivated devices.',
      kadunaSameDay: true,
      nationwideDelivery: 'Dispatched via Manga Insured Courier. Delivered within 24-48 hours.',
      sellerAccredited: true,
      escrowProtected: true,
    },

    // 10. FAQ
    faq: [
      {
        question: 'Does this model have physical Dual SIM and eSIM support?',
        answer: 'Yes, this is the official Nigerian dual-SIM variant supporting 2 physical nano-SIM cards plus multiple eSIM profiles.',
      },
      {
        question: 'Is the charging brick included in the box?',
        answer: 'In line with Samsung global packaging, only the USB-C to USB-C cable is included. Standard 45W Samsung PD chargers can be bundled at checkout.',
      },
      {
        question: 'How long will this phone receive software updates?',
        answer: 'Samsung officially guarantees 7 full years of Android OS version upgrades and monthly security patches until 2031.',
      },
    ],

    highlights: [
      'Armor Titanium frame with enhanced scratch and drop resistance',
      'Corning Gorilla Armor reduces reflections and improves visual clarity',
      '200MP Main Camera with AI-powered ProVisual Engine',
      'Built-in S-Pen with upgraded ultra-low latency writing feel',
      'Snapdragon 8 Gen 3 for Galaxy with optimized vapor chamber cooling',
    ],
    variants: [
      { id: 'v1', name: 'Titanium Black (512GB)', sku: 'SAM-S24U-512-TI-BLK', priceNgn: 1850000, priceUsd: 1290, inStock: true, stockQuantity: 28 },
      { id: 'v2', name: 'Titanium Gray (512GB)', sku: 'SAM-S24U-512-TI-GRY', priceNgn: 1850000, priceUsd: 1290, inStock: true, stockQuantity: 15 },
      { id: 'v3', name: 'Titanium Violet (1TB)', sku: 'SAM-S24U-1TB-TI-VIO', priceNgn: 2150000, priceUsd: 1500, inStock: true, stockQuantity: 6 },
    ],
    offerId: '88888888-8888-8888-8888-888888888882',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PRODUCT 3: APPLE MACBOOK AIR 15" M3
  // ══════════════════════════════════════════════════════════════════════════
  '66666666-6666-6666-6666-666666666663': {
    id: '66666666-6666-6666-6666-666666666663',
    sku: 'APL-MBA15-M3-MDN',
    // 1. Product Title
    title: 'Apple MacBook Air 15-inch Laptop – Apple M3 Chip Liquid Retina Display, 16GB RAM, 512GB SSD, Midnight',
    brand: 'Apple',
    category: 'computing',
    categoryName: 'Phones & Computing',
    priceNgn: 2100000,
    oldPriceNgn: 2350000,
    priceUsd: 1480,
    oldPriceUsd: 1650,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=900&q=85',
    ],
    rating: 4.9,
    reviewsCount: 112,
    storeName: 'Apple Authorized Store Nigeria',
    vendorTier: 'Tier 1 Premier Partner',
    vendorRating: 4.9,
    vendorLocation: 'Victoria Island Hub, Lagos',
    type: 'physical',
    stockLeft: 14,
    deliveryEstimate: 'Marketsquare Express • Delivered in 24 Hours',
    warranty: '1 Year Apple Official Warranty with AppleCare Support',
    description:
      'The 15-inch MacBook Air is impossibly thin and has a stunning Liquid Retina display. Supercharged by the M3 chip with up to 18 hours of battery life, it delivers incredible performance in an ultraportable design.',
    
    // 2. Hook
    hook:
      'Experience boundless creative power on an expansive 15.3" Liquid Retina screen, powered by the ultra-efficient Apple M3 chip with 18 hours of true silent battery life.',
    
    // 3. Scannable Benefits
    scannableBenefits: [
      {
        benefit: 'Next-Gen M3 Silicon Speed',
        explanation: 'Up to 60% faster than M1 MacBooks with hardware-accelerated mesh shading and ray tracing for swift 4K video rendering and code compilation.',
      },
      {
        benefit: 'True 18-Hour Battery Endurance',
        explanation: 'Work through an entire workday without reaching for your charger, perfect for off-grid flights or intermittent power.',
      },
      {
        benefit: 'Fanless Silent Operation',
        explanation: 'Delivers high sustained throughput without fan whine, keeping your workspace completely silent.',
      },
      {
        benefit: 'Immersive Six-Speaker Soundstage',
        explanation: 'Force-cancelling woofers with Spatial Audio and Dolby Atmos support provide studio-grade multimedia sound.',
      },
    ],

    // 4. Narrative Story
    narrativeStory:
      'Measuring just 11.5mm thin, the 15-inch MacBook Air redefines what a large-screen laptop can be. Crafted from 100% recycled aerospace aluminum with a groundbreaking anodization seal that actively resists fingerprints, this laptop slips effortlessly into your backpack while giving you the generous screen real estate needed to work across multiple side-by-side spreadsheets, timelines, or development windows.',

    // 5. Specs
    specs: [
      { label: 'Model Number / SKU', value: 'A3114 / APL-MBA15-M3-MDN' },
      { label: 'Processor', value: 'Apple M3 chip (8-core CPU: 4 performance + 4 efficiency, 10-core GPU, 16-core Neural Engine)' },
      { label: 'Unified Memory', value: '16GB High-Bandwidth Unified Memory (100GB/s)' },
      { label: 'Storage', value: '512GB PCIe-based Solid State Drive' },
      { label: 'Display', value: '15.3" Liquid Retina, 2880 × 1864 native resolution at 224 ppi, 500 nits, P3 Wide Color' },
      { label: 'Battery & Power', value: '66.5-watt-hour lithium-polymer, 35W Dual USB-C Adapter, MagSafe 3' },
      { label: 'External Displays', value: 'Supports up to two external displays with laptop lid closed' },
      { label: 'Dimensions (H × W × D)', value: '1.15 cm × 34.04 cm × 23.76 cm' },
      { label: 'Weight', value: '1.51 kg (3.3 lbs)' },
      { label: 'Keyboard & Trackpad', value: 'Backlit Magic Keyboard with Touch ID & Force Touch Trackpad' },
      { label: 'Country of Origin', value: 'Designed by Apple in California, Assembled in China' },
    ],

    // 6. Sizing & Fit
    sizingGuide: {
      fitNotes: 'Fits standard 15-inch and 16-inch laptop sleeves and backpacks. Ultra-slim 1.15 cm profile allows it to slide cleanly into slim briefcase compartments.',
      chart: [
        { label: 'Thickness', metric: '1.15 cm', imperial: '0.45 in' },
        { label: 'Width', metric: '34.04 cm', imperial: '13.40 in' },
        { label: 'Depth', metric: '23.76 cm', imperial: '9.35 in' },
      ],
    },

    // 7. Box Contents
    boxContents: [
      '1× 15-inch MacBook Air with Apple M3 chip (Midnight)',
      '1× 35W Dual USB-C Port Compact Power Adapter',
      '1× Color-Matched USB-C to MagSafe 3 Braided Cable (2m)',
      '1× Apple Official Warranty Certificate & Setup Guide',
    ],

    // 8. Trust & Shipping
    trustShipping: {
      warrantyDuration: '1-Year Official Apple Warranty with authorized worldwide AppleCare repair coverage.',
      returnPolicy: '7-Day Return / Replacement Guarantee on unopened factory-sealed packages.',
      kadunaSameDay: true,
      nationwideDelivery: 'Delivered in 24-48 hours via Manga Secure High-Value Escrow Delivery.',
      sellerAccredited: true,
      escrowProtected: true,
    },

    // 10. FAQ
    faq: [
      {
        question: 'Does this model feature 16GB of RAM or 8GB?',
        answer: 'This is the upgraded official 16GB Unified Memory model, delivering significantly faster performance for software engineering, design, and heavy browsing than the baseline 8GB configuration.',
      },
      {
        question: 'Can I connect two external monitors to this MacBook?',
        answer: 'Yes! The M3 MacBook Air officially supports up to two external monitors when the laptop lid is closed.',
      },
      {
        question: 'Does the Midnight color still attract fingerprints?',
        answer: 'Apple implemented a new anodization seal on the M3 Midnight finish that dramatically reduces visible fingerprints compared to the M2 generation.',
      },
    ],

    highlights: [
      'Apple M3 chip with 8-core CPU and 10-core GPU',
      '15.3-inch Liquid Retina display with True Tone and 500 nits brightness',
      '16GB unified memory for seamless multitasking',
      '512GB ultrafast SSD storage',
      'Up to 18 hours battery life with MagSafe 3 charging',
    ],
    variants: [
      { id: 'v1', name: 'Midnight (16GB / 512GB)', sku: 'APL-MBA15-M3-MDN-512', priceNgn: 2100000, priceUsd: 1480, inStock: true, stockQuantity: 14 },
      { id: 'v2', name: 'Space Gray (16GB / 512GB)', sku: 'APL-MBA15-M3-GRY-512', priceNgn: 2100000, priceUsd: 1480, inStock: true, stockQuantity: 10 },
      { id: 'v3', name: 'Starlight (24GB / 1TB)', sku: 'APL-MBA15-M3-STR-1TB', priceNgn: 2550000, priceUsd: 1800, inStock: true, stockQuantity: 4 },
    ],
    offerId: '88888888-8888-8888-8888-888888888883',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PRODUCT 4: IPHONE 16 PRO MAX
  // ══════════════════════════════════════════════════════════════════════════
  '66666666-6666-6666-6666-666666666664': {
    id: '66666666-6666-6666-6666-666666666664',
    sku: 'APL-IP16PM-256-DT',
    // 1. Product Title
    title: 'Apple iPhone 16 Pro Max Flagship Smartphone – Grade 5 Titanium Ceramic Shield with Camera Control, 256GB Desert Titanium',
    brand: 'Apple',
    category: 'computing',
    categoryName: 'Phones & Computing',
    priceNgn: 2250000,
    oldPriceNgn: 2450000,
    priceUsd: 1590,
    oldPriceUsd: 1720,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=900&q=85',
    ],
    rating: 4.9,
    reviewsCount: 78,
    storeName: 'Apple Authorized Store Nigeria',
    vendorTier: 'Tier 1 Premier Partner',
    vendorRating: 4.9,
    vendorLocation: 'Victoria Island Hub, Lagos',
    type: 'physical',
    stockLeft: 30,
    deliveryEstimate: 'Marketsquare Express • Delivered in 24 Hours',
    warranty: '1 Year Apple International Warranty',
    description:
      'iPhone 16 Pro Max. Featuring a stunning titanium design. Camera Control. 4K 120 fps Dolby Vision. And the A18 Pro chip that unlocks an unprecedented leap in battery life.',
    
    // 2. Hook
    hook:
      'Unleash cinematic 4K 120 fps Dolby Vision capture, tactile Camera Control, and Apple Intelligence with the power of the A18 Pro chip and a gorgeous 6.9-inch Super Retina XDR display.',
    
    // 3. Scannable Benefits
    scannableBenefits: [
      {
        benefit: 'Dedicated Tactile Camera Control',
        explanation: 'Instant slide-to-zoom, focus, and aperture adjustment via a sapphire crystal touch sensor on the phone side.',
      },
      {
        benefit: 'Hollywood 4K 120 fps Slow Motion',
        explanation: 'Record cinematic high-frame-rate Dolby Vision video and adjust playback speed afterwards in post-production.',
      },
      {
        benefit: 'Class-Leading Battery Life',
        explanation: 'Stream video for up to 33 hours continuously, representing the longest battery life ever in an iPhone.',
      },
      {
        benefit: 'Grade 5 Micro-Blasted Titanium',
        explanation: 'Remarkably strong yet noticeably lighter in hand with the thinnest borders of any Apple product.',
      },
    ],

    // 4. Narrative Story
    narrativeStory:
      'From shooting studio-grade content on location in Abuja to managing high-stakes trades, the iPhone 16 Pro Max provides the ultimate mobile experience. The advanced 48MP Fusion camera features a faster quad-pixel sensor that reads data twice as fast for zero shutter lag on 48MP ProRAW photos. Paired with 4 studio-quality microphones that cut wind noise, you capture broadcast-quality audio straight from your palm.',

    // 5. Specs
    specs: [
      { label: 'Model Number / SKU', value: 'A3296 / APL-IP16PM-256-DT' },
      { label: 'Display', value: '6.9" Super Retina XDR OLED, ProMotion 120Hz, Always-On, 2000 nits Outdoor Peak' },
      { label: 'Processor', value: 'A18 Pro chip with 6-core CPU, 6-core GPU, 16-core Neural Engine' },
      { label: 'Storage', value: '256GB High-Speed NVMe' },
      { label: 'Camera Array', value: '48MP Fusion (24/28/35mm) + 48MP Ultra Wide + 12MP 5x Telephoto' },
      { label: 'Video Capabilities', value: '4K Dolby Vision at 24/25/30/60/100/120 fps' },
      { label: 'Connector', value: 'USB-C with USB 3 speeds (up to 10Gb/s)' },
      { label: 'Dimensions (H × W × D)', value: '163.0 mm × 77.6 mm × 8.25 mm' },
      { label: 'Weight', value: '227 grams' },
      { label: 'Water Resistance', value: 'IP68 (6 meters up to 30 mins)' },
      { label: 'Country of Origin', value: 'Designed by Apple in California, Assembled in India' },
    ],

    // 6. Sizing & Fit
    sizingGuide: {
      fitNotes: 'Slimmer bezels maximize the 6.9" display without significantly increasing outer dimensions. Ergonomically contoured titanium edges prevent palm fatigue.',
    },

    // 7. Box Contents
    boxContents: [
      '1× Apple iPhone 16 Pro Max (Desert Titanium)',
      '1× USB-C Charge Cable (1m Braided)',
      '1× Documentation with Apple Logo Decals',
    ],

    // 8. Trust & Shipping
    trustShipping: {
      warrantyDuration: '1-Year Official Apple Warranty with verified serial activation upon unboxing.',
      returnPolicy: '7-Day Return / Replacement Guarantee on factory sealed units.',
      kadunaSameDay: true,
      nationwideDelivery: 'Dispatched via Manga Insured Armored Courier with live tracking.',
      sellerAccredited: true,
      escrowProtected: true,
    },

    // 10. FAQ
    faq: [
      {
        question: 'Is this phone unlocked to work on MTN, Airtel, Glo, and 9mobile?',
        answer: 'Yes, this unit is 100% factory unlocked and supports all Nigerian 5G and 4G LTE frequency bands.',
      },
      {
        question: 'Does this model have a physical SIM tray?',
        answer: 'Yes, this official international model includes one physical nano-SIM tray plus full support for multiple eSIMs.',
      },
      {
        question: 'Can I record ProRes video directly to an external SSD?',
        answer: 'Yes! The USB-C port supports high-speed USB 3 transfers up to 10Gb/s, allowing direct external drive recording.',
      },
    ],

    highlights: [
      'Forged in Grade 5 Titanium with stunning 6.9-inch Super Retina XDR display',
      'Camera Control button gives you an easier way to quickly access camera tools',
      '48MP Fusion camera with 4K 120 fps Dolby Vision recording',
      'Supercharged by A18 Pro chip with breakthrough power and battery efficiency',
      'Up to 33 hours video playback — the best battery life ever on an iPhone',
    ],
    variants: [
      { id: 'v1', name: 'Desert Titanium (256GB)', sku: 'APL-IP16PM-256-DT', priceNgn: 2250000, priceUsd: 1590, inStock: true, stockQuantity: 30 },
      { id: 'v2', name: 'Natural Titanium (256GB)', sku: 'APL-IP16PM-256-NT', priceNgn: 2250000, priceUsd: 1590, inStock: true, stockQuantity: 18 },
      { id: 'v3', name: 'Black Titanium (512GB)', sku: 'APL-IP16PM-512-BT', priceNgn: 2550000, priceUsd: 1800, inStock: true, stockQuantity: 8 },
    ],
    offerId: '88888888-8888-8888-8888-888888888884',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PRODUCT 5: ARTISAN KANO LEATHER RUCKSACK (APPAREL & LEATHER SIZING)
  // ══════════════════════════════════════════════════════════════════════════
  '66666666-6666-6666-6666-666666666665': {
    id: '66666666-6666-6666-6666-666666666665',
    sku: 'MNG-KANO-LTR-BRN',
    // 1. Product Title
    title: 'Artisan Kano Handcrafted Leather Rucksack – Full-Grain Cowhide with 16" Laptop Sleeve, Laterite Brown',
    brand: 'Artisan Kano',
    category: 'fashion',
    categoryName: "Men's Fashion & Leather",
    priceNgn: 165000,
    oldPriceNgn: 195000,
    priceUsd: 115,
    oldPriceUsd: 135,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
    ],
    rating: 4.9,
    reviewsCount: 64,
    storeName: 'Northern Leather Guild Flagship',
    vendorTier: 'Master Artisan Guild',
    vendorRating: 5.0,
    vendorLocation: 'Kofar Wambai Tannery District, Kano',
    type: 'physical',
    stockLeft: 18,
    deliveryEstimate: 'Marketsquare Express • Delivered in 24 Hours',
    warranty: '5-Year Craftsmanship & Seam Warranty',
    description:
      'Hand-cut and saddle-stitched in Kano from vegetable-tanned, full-grain Nigerian cowhide. Ages into a deep, rich patina with every journey.',
    
    // 2. Hook
    hook:
      'Travel with timeless dignity using handcrafted full-grain Nigerian leather that develops a stunning rich patina, featuring dedicated protection for your 16" laptop and daily essentials.',
    
    // 3. Scannable Benefits
    scannableBenefits: [
      {
        benefit: 'Authentic Kano Vegetable Tanning',
        explanation: 'Naturally treated using acacia bark and vegetable oils for unmatched suppleness, water resistance, and an earthy natural aroma.',
      },
      {
        benefit: 'Shock-Absorbing 16" Laptop Chamber',
        explanation: 'Suspended padded sleeve cradles MacBook Pro 16" or Dell XPS securely off the ground.',
      },
      {
        benefit: 'Unbreakable Solid Brass Hardware',
        explanation: 'Cast solid brass buckles and heavy-duty YKK antique brass zippers that never jam or corrode.',
      },
      {
        benefit: 'Ergonomic Weighted Shoulder Straps',
        explanation: 'Dual-layered padded leather straps distribute weight evenly across your shoulders for fatigue-free travel.',
      },
    ],

    // 4. Narrative Story
    narrativeStory:
      'Rooted in centuries-old tanneries along Kano’s ancient city walls, each rucksack is meticulously cut and saddle-stitched by third-generation master craftsmen. Unlike synthetic bags that peel and crack after a rainy season, full-grain cowhide self-heals minor scuffs and absorbs oils, growing more distinguished with every trip from Kaduna to London. The interior is lined with durable Hausa handloom cotton to safeguard tech screens from scratches.',

    // 5. Specs
    specs: [
      { label: 'Model Number / SKU', value: 'KANO-RUCK-01 / MNG-KANO-LTR-BRN' },
      { label: 'Primary Material', value: '100% Full-Grain Vegetable-Tanned Cowhide Leather (1.8mm thickness)' },
      { label: 'Hardware', value: 'Solid Sand-Cast Brass with Antique Finish' },
      { label: 'Zippers', value: 'Heavy-Duty YKK #8 Brass Dual-Slide Zippers' },
      { label: 'Internal Capacity', value: '24 Liters' },
      { label: 'Laptop Sleeve Capacity', value: 'Accommodates up to 16.2-inch laptops (Dimensions: 36 × 26 × 2.5 cm)' },
      { label: 'External Dimensions', value: '44 cm (H) × 32 cm (W) × 16 cm (D)' },
      { label: 'Empty Weight', value: '1.45 kg' },
      { label: 'Care Instructions', value: 'Wipe with dry microfiber cloth. Condition with natural beeswax or leather balm twice yearly.' },
      { label: 'Country of Origin', value: 'Nigeria (Kano State)' },
    ],

    // 6. Sizing & Fit Guide
    sizingGuide: {
      fitNotes: 'Generous 24L capacity ideal for daily office commuting, weekend getaways, or airline carry-on under-seat storage. Shoulder straps adjust from 55cm to 85cm.',
      modelStats: 'Tested on models 5’7” to 6’3”; fits comfortably against lower back with zero sag.',
      chart: [
        { label: 'Overall Height', metric: '44 cm', imperial: '17.3 in' },
        { label: 'Overall Width', metric: '32 cm', imperial: '12.6 in' },
        { label: 'Base Depth', metric: '16 cm', imperial: '6.3 in' },
        { label: 'Max Laptop Diagonal', metric: '40.6 cm', imperial: '16.0 in' },
      ],
    },

    // 7. Box Contents
    boxContents: [
      '1× Artisan Kano Handcrafted Leather Rucksack (Laterite Brown)',
      '1× Breathable Natural Cotton Dust Storage Bag',
      '1× 50ml Artisan Beeswax Leather Conditioner Tin',
      '1× Certificate of Authenticity signed by Kano Master Tanner',
    ],

    // 8. Trust & Shipping
    trustShipping: {
      warrantyDuration: '5-Year Craftsmanship Guarantee covering stitching, rivets, and brass hardware.',
      returnPolicy: '7-Day Satisfaction Return Guarantee.',
      kadunaSameDay: true,
      nationwideDelivery: 'Ships directly from Kano/Kaduna fulfillment hub within 24 hours.',
      sellerAccredited: true,
      escrowProtected: true,
    },

    // 10. FAQ
    faq: [
      {
        question: 'Will this leather rucksack stain my white shirts in hot weather?',
        answer: 'No. Our leather is thoroughly dried and hot-waxed to seal all vegetable dyes, preventing color bleeding onto clothing.',
      },
      {
        question: 'Is the bag water resistant in heavy Nigerian rainstorms?',
        answer: 'The full-grain leather naturally repels water droplets. For torrential downpours, applying the included beeswax conditioner enhances surface impermeability.',
      },
      {
        question: 'How do I care for scuffs and scratches on the leather?',
        answer: 'Simply rub the scratch with warm fingers or a dab of the included beeswax balm. The natural oils in the leather will blend the mark into the patina.',
      },
    ],

    highlights: [
      'Handcrafted from premium Northern Nigerian full-grain cowhide leather',
      'Dedicated padded compartment fits up to 16-inch laptops',
      'Ages gracefully with a rich, unique patina over time',
      'Reinforced saddle stitching with heavy-duty brass hardware',
      'Breathable padded back panel and adjustable shoulder straps',
    ],
    variants: [
      { id: 'v1', name: 'Laterite Brown', sku: 'MNG-KANO-LTR-BRN', priceNgn: 165000, priceUsd: 115, inStock: true, stockQuantity: 18 },
      { id: 'v2', name: 'Onyx Charcoal', sku: 'MNG-KANO-LTR-BLK', priceNgn: 165000, priceUsd: 115, inStock: true, stockQuantity: 7 },
    ],
    offerId: '88888888-8888-8888-8888-888888888885',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PRODUCT 6: MANGA FIGMA DESIGN SYSTEM
  // ══════════════════════════════════════════════════════════════════════════
  '66666666-6666-6666-6666-666666666666': {
    id: '66666666-6666-6666-6666-666666666666',
    sku: 'DSG-FIGMA-SGL',
    // 1. Product Title
    title: 'Manga Marketsquare Design System & UI Kit for Figma – 1,200+ Liquid Glass Components & Autolayout V5, Single License',
    brand: 'Manga Labs',
    category: 'digital',
    categoryName: 'Digital & Software',
    priceNgn: 45000,
    oldPriceNgn: 65000,
    priceUsd: 32,
    oldPriceUsd: 45,
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=85',
    ],
    rating: 5.0,
    reviewsCount: 142,
    storeName: 'Manga Design Engineering Lab',
    vendorTier: 'Core Platform Team',
    vendorRating: 5.0,
    vendorLocation: 'Digital Cloud Delivery',
    type: 'digital',
    stockLeft: 9999,
    deliveryEstimate: 'Instant Digital Download • Delivered in Seconds',
    warranty: 'Lifetime Updates & Discord Community Support',
    description:
      'The complete production UI kit behind the Manga Marketsquare platform. Includes 1,200+ components, liquid glass navigation tokens, mobile app flows, and production-ready React Native mappings.',
    
    // 2. Hook
    hook:
      'Ship world-class fintech and e-commerce apps 10x faster with 1,200+ production-grade Figma components, tokens, liquid glass docks, and 1:1 React / React Native code mappings.',
    
    // 3. Scannable Benefits
    scannableBenefits: [
      {
        benefit: 'Complete Figma Variables & Tokens',
        explanation: 'Switch effortlessly between Light, Dark, and High-Contrast palettes with synchronized WCAG AAA compliant color tokens.',
      },
      {
        benefit: 'Modern 2026 Liquid Glass Architecture',
        explanation: 'Includes fluid floating navigation bars, morphing indicators, and iOS 26 frosted dock components.',
      },
      {
        benefit: 'Zero-Maintenance Auto-Layout V5',
        explanation: 'Fully responsive layouts that adapt dynamically to mobile, tablet, and desktop breakpoints without breaking.',
      },
      {
        benefit: 'Instant Automated Asset Delivery',
        explanation: 'Receive permanent Figma community duplication links and GitHub repository access immediately upon payment.',
      },
    ],

    // 4. Narrative Story
    narrativeStory:
      'Designed and battle-tested by the core engineering team behind Manga Marketsquare, this comprehensive kit bridges the divide between design and production. Every component mirrors its actual production code counterpart in React Native and Tailwind CSS, saving development teams hundreds of hours in UI prototyping, QA audits, and design-to-code handover.',

    // 5. Specs
    specs: [
      { label: 'File Format', value: '.FIG (Figma Native) + JSON Design Tokens' },
      { label: 'Component Count', value: '1,240 Components with Variants & Component Properties' },
      { label: 'Screen Templates', value: '64 Production Mobile & Web Application Screens' },
      { label: 'Auto Layout', value: '100% Auto Layout V5 with Min/Max Width Constraints' },
      { label: 'Typography', value: 'Inter & General Sans (Google Open Fonts)' },
      { label: 'License Terms', value: 'Commercial Royalty-Free (Single Developer or Agency Unlimited)' },
      { label: 'Updates', value: 'Free Lifetime Updates via Figma Community' },
    ],

    // 6. Sizing & Fit
    sizingGuide: {
      fitNotes: 'Optimized for Figma 2025/2026. Compatible with Free and Professional Figma accounts.',
    },

    // 7. Box Contents
    boxContents: [
      '1× Master Figma File (.fig) with 1,200+ Components',
      '1× Design Token JSON File compatible with Style Dictionary & Tailwind CSS',
      '1× Production React Native / Tailwind Component Reference Guide',
      '1× Lifetime Invitation to Manga Developer Community Discord',
    ],

    // 8. Trust & Shipping
    trustShipping: {
      warrantyDuration: 'Lifetime Updates & Continuous Design System Enhancements.',
      returnPolicy: 'Instant Digital Access Delivery Guarantee.',
      kadunaSameDay: false,
      nationwideDelivery: 'Instant Online Delivery via Email & Dashboard Download Link.',
      sellerAccredited: true,
      escrowProtected: true,
    },

    // 10. FAQ
    faq: [
      {
        question: 'Do I need a paid Figma subscription to use this kit?',
        answer: 'No. The kit works seamlessly on free Figma Starter plans as well as Figma Professional and Enterprise accounts.',
      },
      {
        question: 'Can I use this design system for commercial client projects?',
        answer: 'Yes! The license permits building unlimited commercial client web and mobile applications with no royalty fees.',
      },
      {
        question: 'How do I receive future updates?',
        answer: 'When new components or iOS updates are released, you will receive an email alert with a one-click Figma library update link.',
      },
    ],

    highlights: [
      '1,200+ auto-layout components with interactive Figma variants',
      'Complete color palette with WCAG AAA accessibility scores',
      'Includes Liquid Glass dock navigation and responsive web layouts',
      'Tailwind CSS v4 config and React Native design token exports',
      'Free lifetime updates and commercial client project usage',
    ],
    variants: [
      { id: 'v1', name: 'Single Developer License', sku: 'DSG-FIGMA-SGL', priceNgn: 45000, priceUsd: 32, inStock: true, stockQuantity: 9999 },
      { id: 'v2', name: 'Team / Agency License (Unlimited)', sku: 'DSG-FIGMA-TEAM', priceNgn: 125000, priceUsd: 90, inStock: true, stockQuantity: 9999 },
    ],
    offerId: '88888888-8888-8888-8888-888888888886',
  },
};

export function findProductById(id: string): ProductDetailItem {
  return (
    CATALOG_PRODUCTS_MAP[id] ||
    CATALOG_PRODUCTS_MAP['66666666-6666-6666-6666-666666666661']
  );
}
