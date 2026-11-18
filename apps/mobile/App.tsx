import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Platform,
  Switch,
  Animated,
  Easing,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  HomeIcon,
  CategoriesIcon,
  CartIcon,
  WishlistIcon,
  AccountIcon,
  LayoutGridIcon,
  ShoppingBagIcon,
  HeartIcon,
  UserIcon,
  ChevronRightIcon,
  SearchIcon,
  OrdersIcon,
  InboxIcon,
  ReviewsIcon,
  VoucherIcon,
  StoreIcon,
  EyeIcon,
  ArrowUpIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  TrashIcon,
  CloseIcon,
  ArrowLeftIcon,
  LocationPinIcon,
  BellIcon,
  LockIcon,
  CheckIcon,
  CopyIcon,
  StarIcon,
  PhoneIcon,
  ChevronDownIcon,
} from './src/components/Icons';

const { width } = Dimensions.get('window');

export interface MobileScannableBenefit {
  benefit: string;
  explanation: string;
}

export interface MobileProductFaq {
  question: string;
  answer: string;
}

export interface MobileSizingGuide {
  fitNotes: string;
  modelStats?: string;
  chart?: Array<{
    label: string;
    metric: string;
    imperial?: string;
  }>;
}

interface Product {
  id: string;
  title: string;
  priceNgn: number;
  compareAtNgn?: number;
  image: string;
  category: string;
  rating: number;
  reviewsCount: number;
  storeName: string;
  isOfficial?: boolean;
  isFlashDeal?: boolean;

  // 10 Core High-Converting Components
  hook?: string;
  scannableBenefits?: MobileScannableBenefit[];
  narrativeStory?: string;
  specs?: Array<{ label: string; value: string }>;
  sizingGuide?: MobileSizingGuide;
  boxContents?: string[];
  faq?: MobileProductFaq[];
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    // 1. Title: [Brand] + [Product Name] + [Key Differentiator] + [Color/Model]
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Over-Ear Headphones – Carbon Fiber Drivers, Black',
    priceNgn: 450000,
    compareAtNgn: 520000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    category: 'Electronics',
    rating: 4.9,
    reviewsCount: 148,
    storeName: 'Sony Audio Official Store',
    isOfficial: true,
    isFlashDeal: true,
    // 2. Hook
    hook: 'Silence chaotic commutes and open-plan offices instantly with dual-processor noise cancellation, studio-grade High-Res audio, and 30 hours of ultra-plush listening comfort.',
    // 3. Scannable Benefits
    scannableBenefits: [
      { benefit: 'Complete Acoustic Isolation', explanation: 'Dual QN1 processors and 8 microphones cancel ambient chatter and engine hum.' },
      { benefit: 'Audiophile Acoustic Precision', explanation: '30mm carbon fiber composite dome drivers reproduce crisp highs and deep punchy bass.' },
      { benefit: 'All-Day Cloud Comfort', explanation: 'Featherlight 250g chassis wrapped in soft-fit synthetic leather minimizes pressure.' },
      { benefit: 'Rapid Emergency Power', explanation: '3-minute USB-PD quick charge yields 3 full hours of high-volume playback.' },
    ],
    // 4. Narrative Story
    narrativeStory: 'Whether commuting across Kaduna, powering through exams at Ahmadu Bello University, or boarding a flight, the Sony WH-1000XM5 creates an immediate personal oasis. Precise Voice Pickup isolates your speech even in breezy outdoor weather.',
    // 5. Specs
    specs: [
      { label: 'Model / SKU', value: 'WH-1000XM5 / SNY-WH1000XM5-BLK' },
      { label: 'Acoustic Design', value: 'Over-Ear, Closed-Back Dynamic' },
      { label: 'Driver Unit', value: '30mm, Carbon Fiber Composite Dome' },
      { label: 'Battery Runtime', value: '30 Hours (ANC On) / 40 Hours (ANC Off)' },
      { label: 'Fast Charge', value: '3 Mins = 3 Hours (USB-PD)' },
      { label: 'Connectivity', value: 'Bluetooth 5.2 (LDAC, AAC, SBC) + 3.5mm Aux' },
      { label: 'Weight', value: '250 grams' },
      { label: 'Origin', value: 'Japan (Assembled in Malaysia)' },
    ],
    // 6. Sizing & Fit
    sizingGuide: {
      fitNotes: 'Ergonomic circum-aural design. Fits comfortably around all ear shapes without cartilage pressure. Stepless adjustable headband.',
      chart: [
        { label: 'Earcup Height', metric: '6.5 cm', imperial: '2.56 in' },
        { label: 'Earcup Width', metric: '4.5 cm', imperial: '1.77 in' },
      ],
    },
    // 7. Box Contents
    boxContents: [
      '1× Sony WH-1000XM5 Wireless Headphones (Black)',
      '1× Collapsible Premium Magnetic Hard Travel Case',
      '1× 3.5mm Gold-Plated Audio Cable (1.2m)',
      '1× USB-A to USB-C Fast-Charging Cable',
      '1× Official Sony Nigeria Warranty Card',
    ],
    // 10. FAQ
    faq: [
      { question: 'Is this unit 100% genuine with an active warranty?', answer: 'Yes, sourced directly from Sony Authorized Distributors with verifiable serial numbers and 1-year warranty.' },
      { question: 'Can I use them if the battery runs out?', answer: 'Yes! The included 3.5mm audio cable allows passive wired listening with zero battery.' },
      { question: 'How fast is delivery to Kaduna or Abuja?', answer: 'Kaduna metropolis qualifies for same-day delivery under 4 hours. Abuja arrives within 24-48 hours.' },
    ],
  },
  {
    id: '2',
    title: 'Apple MacBook Air 15-inch Laptop – Apple M3 Chip Liquid Retina Display, 16GB RAM, 512GB SSD, Midnight',
    priceNgn: 1850000,
    compareAtNgn: 2100000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    category: 'Computing',
    rating: 5.0,
    reviewsCount: 92,
    storeName: 'Apple Authorized Reseller',
    isOfficial: true,
    isFlashDeal: true,
    hook: 'Experience boundless creative power on an expansive 15.3" Liquid Retina screen, powered by the ultra-efficient Apple M3 chip with 18 hours of true silent battery life.',
    scannableBenefits: [
      { benefit: 'Next-Gen M3 Silicon', explanation: 'Up to 60% faster than M1 MacBooks with hardware-accelerated ray tracing.' },
      { benefit: '18-Hour True Battery', explanation: 'Work through an entire workday without reaching for your charger.' },
      { benefit: 'Fanless Silent Design', explanation: 'Zero fan whine, keeping your workspace completely silent.' },
      { benefit: 'Six-Speaker Sound', explanation: 'Spatial Audio with Dolby Atmos support delivers studio-grade depth.' },
    ],
    narrativeStory: 'Measuring just 11.5mm thin, the 15-inch MacBook Air redefines what a large-screen laptop can be. Crafted from 100% recycled aluminum with an anodization seal that actively resists fingerprints.',
    specs: [
      { label: 'Chip', value: 'Apple M3 (8-core CPU, 10-core GPU)' },
      { label: 'Unified Memory', value: '16GB High-Bandwidth Memory' },
      { label: 'Storage', value: '512GB PCIe SSD' },
      { label: 'Display', value: '15.3" Liquid Retina, 500 nits, P3 Color' },
      { label: 'Battery', value: 'Up to 18 Hours, MagSafe 3 Charging' },
      { label: 'Weight', value: '1.51 kg (3.3 lbs)' },
    ],
    boxContents: [
      '1× 15-inch MacBook Air M3 (Midnight)',
      '1× 35W Dual USB-C Port Compact Power Adapter',
      '1× USB-C to MagSafe 3 Braided Cable (2m)',
      '1× Apple Official Warranty Certificate',
    ],
    faq: [
      { question: 'Does this model have 16GB RAM?', answer: 'Yes, this is the upgraded official 16GB model for seamless multitasking and professional coding.' },
      { question: 'Can it connect to two external displays?', answer: 'Yes! The M3 MacBook Air officially supports up to two external displays with the lid closed.' },
    ],
  },
  {
    id: '3',
    title: 'Samsung Galaxy S24 Ultra 5G Flagship Smartphone – Grade 2 Titanium Frame with Embedded S-Pen, 512GB Titanium Black',
    priceNgn: 1650000,
    compareAtNgn: 1800000,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80',
    category: 'Computing',
    rating: 4.8,
    reviewsCount: 114,
    storeName: 'Samsung Direct Nigeria',
    isOfficial: true,
    isFlashDeal: true,
    hook: 'Harness cutting-edge Galaxy AI, an aerospace-grade titanium chassis, a peerless 200MP camera system, and the precision of the built-in S-Pen for maximum executive productivity.',
    scannableBenefits: [
      { benefit: 'Galaxy AI Suite', explanation: 'Circle to Search with Google, Live Call Translation, and AI Note Assist.' },
      { benefit: '200MP ProVisual Camera', explanation: 'Capture razor-sharp low-light photos with optical quality zoom up to 100x.' },
      { benefit: 'Titanium Armor Frame', explanation: 'Corning Gorilla Armor front glass cuts reflections by 75%.' },
      { benefit: 'Integrated S-Pen Stylus', explanation: 'Sign contracts, sketch, and take notes directly on the 2600-nit screen.' },
    ],
    narrativeStory: 'The Galaxy S24 Ultra is built for professionals who cannot afford downtime. Backed by 7 full generations of guaranteed Android OS upgrades, your investment remains fast and secure well into the 2030s.',
    specs: [
      { label: 'Display', value: '6.8" Flat Dynamic AMOLED 2X, 120Hz LTPO, 2600 nits' },
      { label: 'Processor', value: 'Snapdragon 8 Gen 3 for Galaxy' },
      { label: 'RAM / Storage', value: '12GB RAM / 512GB UFS 4.0' },
      { label: 'Rear Cameras', value: '200MP + 50MP Periscope + 10MP Tele + 12MP Ultra-wide' },
      { label: 'Battery', value: '5,000 mAh, 45W Fast Wired Charging' },
      { label: 'Water Resistance', value: 'IP68 Certified' },
    ],
    boxContents: [
      '1× Samsung Galaxy S24 Ultra 5G',
      '1× Integrated S-Pen Stylus',
      '1× USB Type-C to Type-C 3A Cable',
      '1× Metal SIM Tray Ejector Tool',
      '1× Samsung Care+ 24-Month Warranty Card',
    ],
    faq: [
      { question: 'Does this have Dual SIM support?', answer: 'Yes, supports 2 physical nano-SIM cards plus multiple eSIM profiles.' },
      { question: 'Is the charging adapter included?', answer: 'Only the USB-C cable is in the box; 45W adapters can be bundled at checkout.' },
    ],
  },
  {
    id: '4',
    title: "De'Longhi Dedica Deluxe Slim Espresso & Cappuccino Machine – 15-Bar Professional Pump, Stainless Steel",
    priceNgn: 320000,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    category: 'Home & Living',
    rating: 4.7,
    reviewsCount: 65,
    storeName: 'KitchenPro Nigeria',
    hook: 'Brew authentic Italian barista-quality espresso and velvety microfoam lattes at home in a sleek 6-inch ultra-slim stainless steel profile.',
    scannableBenefits: [
      { benefit: '15-Bar Professional Pump', explanation: 'Extracts rich crema and full-bodied aroma with optimal brewing pressure.' },
      { benefit: 'Premium Manual Frother', explanation: 'Crafts silky textured microfoam for lattes, flat whites, and cappuccinos.' },
      { benefit: 'Rapid 35-Second Heat-up', explanation: 'Thermoblock technology reaches perfect brewing temperature in under 40 seconds.' },
    ],
    narrativeStory: 'Enjoy the aroma of fresh cafe-quality espresso every morning. Its compact footprint fits any modern kitchen counter without taking up valuable prep space.',
    specs: [
      { label: 'Pump Pressure', value: '15 Bar Italian High Pressure' },
      { label: 'Heating System', value: 'Rapid Thermoblock Technology' },
      { label: 'Water Tank Capacity', value: '1.0 Liter (Removable)' },
      { label: 'Construction', value: 'Brushed Heavy-Duty Stainless Steel' },
    ],
    boxContents: [
      '1× De’Longhi Dedica Espresso Machine',
      '1× Professional Filter Holder with 3 Baskets',
      '1× Coffee Measuring Scoop & Tamper',
      '1× User Manual & Quick Start Guide',
    ],
    faq: [
      { question: 'Can I use coffee pods?', answer: 'Yes! It includes a dedicated E.S.E. (Easy Serving Espresso) pod filter basket.' },
    ],
  },
  {
    id: '5',
    title: 'Artisan Kano Handcrafted Leather Rucksack – Full-Grain Cowhide with 16" Laptop Sleeve, Laterite Brown',
    priceNgn: 165000,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    category: 'Fashion',
    rating: 4.9,
    reviewsCount: 42,
    storeName: 'Manga Signature Workshop',
    isOfficial: true,
    hook: 'Travel with timeless dignity using handcrafted full-grain Nigerian leather that develops a stunning rich patina, featuring dedicated protection for your 16" laptop and daily essentials.',
    scannableBenefits: [
      { benefit: 'Authentic Kano Tanning', explanation: 'Naturally treated using acacia bark and vegetable oils for water resistance and suppleness.' },
      { benefit: '16" Suspended Laptop Sleeve', explanation: 'Shock-absorbing padded compartment cradles your laptop securely off the ground.' },
      { benefit: 'Solid Cast Brass Hardware', explanation: 'Heavy-duty antique brass buckles and YKK zippers that never jam or rust.' },
    ],
    narrativeStory: 'Hand-cut and saddle-stitched by master tanners in Kano. As you travel, the leather absorbs oils and develops an enviable, deep patina that looks better with every year of use.',
    specs: [
      { label: 'Material', value: '100% Full-Grain Vegetable-Tanned Cowhide (1.8mm)' },
      { label: 'Capacity', value: '24 Liters' },
      { label: 'Laptop Fit', value: 'Up to 16.2" (36 × 26 cm)' },
      { label: 'Dimensions', value: '44 cm (H) × 32 cm (W) × 16 cm (D)' },
      { label: 'Weight', value: '1.45 kg' },
      { label: 'Origin', value: 'Nigeria (Kano State)' },
    ],
    sizingGuide: {
      fitNotes: 'Generous 24L capacity ideal for daily office commuting, university, or airline carry-on. Shoulder straps adjust from 55cm to 85cm.',
      chart: [
        { label: 'Height', metric: '44 cm', imperial: '17.3 in' },
        { label: 'Width', metric: '32 cm', imperial: '12.6 in' },
        { label: 'Depth', metric: '16 cm', imperial: '6.3 in' },
      ],
    },
    boxContents: [
      '1× Artisan Kano Leather Rucksack (Laterite Brown)',
      '1× Breathable Natural Cotton Dust Storage Bag',
      '1× 50ml Artisan Beeswax Leather Conditioner Tin',
    ],
    faq: [
      { question: 'Will the leather bleed dye onto clothes?', answer: 'No, all hides are thoroughly hot-waxed to seal vegetable dyes securely.' },
    ],
  },
  {
    id: '6',
    title: 'Manga Marketsquare Design System & UI Kit for Figma – 1,200+ Liquid Glass Components & Autolayout V5, Single License',
    priceNgn: 45000,
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    category: 'Digital',
    rating: 5.0,
    reviewsCount: 230,
    storeName: 'DesignCraft Studio',
    hook: 'Ship world-class fintech and e-commerce apps 10x faster with 1,200+ production-grade Figma components, tokens, liquid glass docks, and 1:1 React / React Native code mappings.',
    scannableBenefits: [
      { benefit: 'Complete Figma Variables', explanation: 'Switch effortlessly between Light, Dark, and High-Contrast palettes.' },
      { benefit: 'Modern Liquid Glass Dock', explanation: 'Includes fluid floating navigation bars, morphing pills, and frosted glass tokens.' },
      { benefit: '100% Auto-Layout V5', explanation: 'Fully responsive layouts that adapt dynamically to mobile, tablet, and desktop.' },
    ],
    narrativeStory: 'Designed and battle-tested by the core engineering team behind Manga Marketsquare, every component mirrors its actual production code counterpart in React Native and Tailwind CSS.',
    specs: [
      { label: 'File Format', value: '.FIG (Figma Native) + JSON Design Tokens' },
      { label: 'Component Count', value: '1,240 Components with Variants & Properties' },
      { label: 'Screen Templates', value: '64 Production Mobile & Web Application Screens' },
      { label: 'License', value: 'Commercial Royalty-Free' },
    ],
    boxContents: [
      '1× Master Figma File (.fig) with 1,200+ Components',
      '1× Design Token JSON File compatible with Tailwind CSS',
      '1× React Native Component Reference Guide',
    ],
    faq: [
      { question: 'Does it work with free Figma accounts?', answer: 'Yes! Fully compatible with free Figma Starter as well as Pro plans.' },
    ],
  },
];

const CATEGORY_LIST = [
  { id: 'All', name: 'All Departments', count: 6 },
  { id: 'Computing', name: 'Phones & Computing', count: 2 },
  { id: 'Electronics', name: 'Electronics & Audio', count: 1 },
  { id: 'Fashion', name: 'Fashion & Streetwear', count: 1 },
  { id: 'Home & Living', name: 'Home Appliances', count: 1 },
  { id: 'Digital', name: 'Digital UI Kits & Code', count: 1 },
];

type AccountSubScreen =
  | null
  | 'orders'
  | 'inbox'
  | 'reviews'
  | 'vouchers'
  | 'sellers'
  | 'recently_viewed'
  | 'address_book'
  | 'account_management'
  | 'close_account'
  | 'notifications'
  | 'privacy_policy'
  | 'terms_of_service'
  | 'buyer_protection'
  | 'return_policy';

interface OrderProduct {
  title: string;
  image: string;
  priceNgn: number;
  qty: number;
  storeName: string;
}

interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Out for Delivery' | 'Delivered' | 'Processing';
  statusColor: string;
  type: 'active' | 'completed';
  products: OrderProduct[];
  totalNgn: number;
  deliveryType: string;
  deliveryAddress: string;
  riderName?: string;
  riderPhone?: string;
  escrowStatus: string;
  timeline: { title: string; desc: string; done: boolean; active?: boolean }[];
}

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord-1',
    orderNumber: '#MNG-769149-F92D',
    date: 'Today, 8:15 AM',
    status: 'Out for Delivery',
    statusColor: '#C85A32',
    type: 'active',
    products: [
      {
        title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        priceNgn: 450000,
        qty: 1,
        storeName: 'Sony Audio Official Store',
      },
    ],
    totalNgn: 452500,
    deliveryType: 'Kaduna Same-Day Dispatch',
    deliveryAddress: '14 Isa Kaita Road, Malali, Kaduna, Kaduna State',
    riderName: 'Ibrahim Danladi',
    riderPhone: '+234 812 345 6789',
    escrowStatus: 'Payment held in Manga Escrow until buyer inspection',
    timeline: [
      { title: 'Order Placed', desc: 'Payment approved via Flutterwave', done: true },
      { title: 'Escrow Secured', desc: '₦452,500 protected in Manga Escrow Vault', done: true },
      { title: 'Picked Up from Hub', desc: 'Dispatched from Sony Kaduna Hub', done: true },
      { title: 'Out for Delivery', desc: 'Rider Ibrahim is 15 mins away in Malali', done: false, active: true },
    ],
  },
  {
    id: 'ord-2',
    orderNumber: '#MNG-520194-A12B',
    date: 'Nov 12, 2026',
    status: 'Delivered',
    statusColor: '#4F6B3A',
    type: 'completed',
    products: [
      {
        title: 'Apple MacBook Air 15-inch M3 (16GB RAM, 512GB SSD)',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
        priceNgn: 1850000,
        qty: 1,
        storeName: 'Apple Authorized Reseller',
      },
    ],
    totalNgn: 1850000,
    deliveryType: 'Kaduna Express Courier',
    deliveryAddress: '14 Isa Kaita Road, Malali, Kaduna, Kaduna State',
    riderName: 'Musa Abdullahi',
    riderPhone: '+234 802 987 6543',
    escrowStatus: 'Escrow released to vendor after buyer confirmation',
    timeline: [
      { title: 'Order Placed', desc: 'Nov 10, 2026', done: true },
      { title: 'Escrow Secured', desc: 'Funds verified', done: true },
      { title: 'Dispatched', desc: 'Nov 11, 2026', done: true },
      { title: 'Delivered & Confirmed', desc: 'Received & inspected by John Luka', done: true },
    ],
  },
  {
    id: 'ord-3',
    orderNumber: '#MNG-319402-C84E',
    date: 'Oct 28, 2026',
    status: 'Delivered',
    statusColor: '#4F6B3A',
    type: 'completed',
    products: [
      {
        title: 'Handcrafted Kano Vegetable-Tanned Leather Weekender Bag',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
        priceNgn: 165000,
        qty: 1,
        storeName: 'Manga Signature Workshop',
      },
    ],
    totalNgn: 167500,
    deliveryType: 'Northern Regional Delivery',
    deliveryAddress: 'Plot 7, Constitution Road, Kaduna Central',
    riderName: 'Garba Sani',
    riderPhone: '+234 803 555 1212',
    escrowStatus: 'Escrow released after 7-day inspection period',
    timeline: [
      { title: 'Order Placed', desc: 'Oct 26, 2026', done: true },
      { title: 'Artisan Crafted', desc: 'Inspected for quality', done: true },
      { title: 'Dispatched', desc: 'Oct 27, 2026', done: true },
      { title: 'Delivered', desc: 'Received by reception', done: true },
    ],
  },
  {
    id: 'ord-4',
    orderNumber: '#MNG-109283-K55F',
    date: 'Sep 15, 2026',
    status: 'Delivered',
    statusColor: '#4F6B3A',
    type: 'completed',
    products: [
      {
        title: "De'Longhi Dedica Deluxe Slim Espresso & Cappuccino Machine",
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
        priceNgn: 320000,
        qty: 1,
        storeName: 'KitchenPro Nigeria',
      },
    ],
    totalNgn: 322500,
    deliveryType: 'Kaduna Standard Delivery',
    deliveryAddress: '14 Isa Kaita Road, Malali, Kaduna',
    escrowStatus: 'Escrow completed successfully',
    timeline: [
      { title: 'Order Placed', desc: 'Sep 13, 2026', done: true },
      { title: 'Dispatched', desc: 'Sep 14, 2026', done: true },
      { title: 'Delivered', desc: 'Signed by John Luka', done: true },
    ],
  },
];

interface InboxMsg {
  id: string;
  title: string;
  tag: string;
  body: string;
  fullContent: string;
  time: string;
  unread: boolean;
  orderId?: string;
  actionText?: string;
}

const INITIAL_INBOX: InboxMsg[] = [
  {
    id: '1',
    title: 'Same-Day Delivery Dispatched (Kaduna)',
    tag: 'Order Dispatch',
    body: 'Your Sony WH-1000XM5 headphones are with our local rider for delivery in Kaduna today.',
    fullContent: 'Great news John! Rider Ibrahim Danladi (+234 812 345 6789) has collected your package from the Sony Audio Official Store. Delivery to 14 Isa Kaita Road, Malali, Kaduna is scheduled for today before 2:00 PM. Remember: Your payment is held securely in Manga Escrow and will only be released to the seller after you inspect and accept the delivery.',
    time: '15m ago',
    unread: true,
    orderId: 'ord-1',
    actionText: 'Track Order',
  },
  {
    id: '2',
    title: 'Official Store Annual Compliance',
    tag: 'Merchant Trust',
    body: 'Sony Audio Official Store has renewed annual compliance and genuine manufacturer warranty.',
    fullContent: 'MANGA MARKETSQUARE has completed the annual audit for Sony Audio Official Store. All serialized products are backed by a 1-year official manufacturer warranty and eligible for 7-day hassle-free returns under Kaduna consumer protection policies.',
    time: '3h ago',
    unread: false,
    actionText: 'View Store',
  },
  {
    id: '3',
    title: 'Exclusive Flash Deals Live',
    tag: 'Promotions',
    body: 'Up to 30% discount on selected gadgets from official stores.',
    fullContent: 'Get exclusive flash discounts on genuine Apple, Sony, and Samsung tech. Available for next 4 hours only. Use promo code SQUARE10 at checkout for an additional 10% discount.',
    time: '1d ago',
    unread: false,
    actionText: 'Explore Flash Deals',
  },
];

interface AddressItem {
  id: string;
  label: string;
  isDefault: boolean;
  name: string;
  phone: string;
  street: string;
  area: string;
  city: string;
  state: string;
  landmark: string;
  isKadunaEligible: boolean;
  instructions: string;
}

const INITIAL_ADDRESSES: AddressItem[] = [
  {
    id: 'addr-1',
    label: 'Home',
    isDefault: true,
    name: 'John Luka',
    phone: '+234 803 123 4567',
    street: '14 Isa Kaita Road',
    area: 'Malali',
    city: 'Kaduna',
    state: 'Kaduna State',
    landmark: 'Opposite State Library',
    isKadunaEligible: true,
    instructions: 'Call rider on arrival; ring gate bell 2B',
  },
  {
    id: 'addr-2',
    label: 'Office',
    isDefault: false,
    name: 'John Luka',
    phone: '+234 803 123 4567',
    street: 'Plot 7, Constitution Road',
    area: 'Kaduna Central',
    city: 'Kaduna',
    state: 'Kaduna State',
    landmark: 'Near Central Bank Building',
    isKadunaEligible: true,
    instructions: 'Leave with reception on 2nd floor',
  },
];

interface SellerItem {
  id: string;
  name: string;
  type: string;
  rating: string;
  followers: string;
  note: string;
  products: { id: string; title: string; priceNgn: number; image: string }[];
}

const INITIAL_SELLERS: SellerItem[] = [
  {
    id: 's-1',
    name: 'Sony Audio Official Store',
    type: 'Official Flagship',
    rating: '4.9 ★ (148 reviews)',
    followers: '14,820 followers',
    note: 'Official warranty & genuine parts',
    products: [
      {
        id: '1',
        title: 'Sony WH-1000XM5 Wireless Headphones',
        priceNgn: 450000,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: 's-2',
    name: 'Apple Authorized Reseller',
    type: 'Official Flagship',
    rating: '5.0 ★ (92 reviews)',
    followers: '28,450 followers',
    note: 'Factory sealed genuine devices',
    products: [
      {
        id: '2',
        title: 'Apple MacBook Air 15-inch M3',
        priceNgn: 1850000,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: 's-3',
    name: 'Samsung Direct Nigeria',
    type: 'Official Store',
    rating: '4.8 ★ (114 reviews)',
    followers: '19,300 followers',
    note: 'Smartphones & tablets with warranty',
    products: [
      {
        id: '3',
        title: 'Samsung Galaxy S24 Ultra 512GB',
        priceNgn: 1650000,
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: 's-4',
    name: 'Manga Signature Workshop',
    type: 'Kaduna Artisan',
    rating: '4.9 ★ (42 reviews)',
    followers: '5,120 followers',
    note: 'Handcrafted genuine leather bags',
    products: [
      {
        id: '5',
        title: 'Handcrafted Kano Leather Bag',
        priceNgn: 165000,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'cart' | 'wishlist' | 'account'>('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart state: productId -> quantity
  const [cart, setCart] = useState<{ [id: string]: number }>({ '1': 1 });
  // Wishlist state: set of productIds
  const [wishlist, setWishlist] = useState<string[]>(['2', '5']);
  
  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  // Modals & Navigation
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [expandedFaqIdx, setExpandedFaqIdx] = useState<number | null>(0);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);
  const [accountSubScreen, setAccountSubScreen] = useState<AccountSubScreen>(null);

  // Authentication, Registration & Email Verification Flow
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [authStep, setAuthStep] = useState<'signin' | 'register' | 'verify_otp'>('signin');

  // Active User Profile
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Kaduna',
    memberSince: '2026',
  });

  // Sign In inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration inputs
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('Kaduna');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Verification OTP state
  const [generatedOtp, setGeneratedOtp] = useState('849201');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(45);

  useEffect(() => {
    let interval: any = null;
    if (authStep === 'verify_otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authStep, resendTimer]);

  // Orders State (Active & Completed with Details)
  const [orderTab, setOrderTab] = useState<'active' | 'completed'>('active');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);

  // Inbox State (Openable Messages & Unread Counter)
  const [inboxList, setInboxList] = useState<InboxMsg[]>(INITIAL_INBOX);
  const [selectedInboxMsg, setSelectedInboxMsg] = useState<InboxMsg | null>(null);

  // Followed Sellers State
  const [followedSellers, setFollowedSellers] = useState<SellerItem[]>(INITIAL_SELLERS);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({
    's-1': true,
    's-2': true,
    's-3': true,
    's-4': true,
  });

  // Address Book State
  const [addresses, setAddresses] = useState<AddressItem[]>(INITIAL_ADDRESSES);
  const [newAddrLabel, setNewAddrLabel] = useState('Home');
  const [newAddrName, setNewAddrName] = useState('John Luka');
  const [newAddrPhone, setNewAddrPhone] = useState('+234 803 123 4567');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrArea, setNewAddrArea] = useState('Malali');
  const [newAddrLandmark, setNewAddrLandmark] = useState('');
  const [newAddrInstructions, setNewAddrInstructions] = useState('');

  // Close Account Reason State
  const [closeReason, setCloseReason] = useState('Found another platform');

  // Account Interactive States
  const [notificationToggles, setNotificationToggles] = useState({
    orderUpdates: true,
    kadunaSameDay: true,
    flashDeals: true,
    whatsapp: true,
    newsletter: false,
  });

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [newAddressCity, setNewAddressCity] = useState('Kaduna');
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  // Scroll references for Back to Top
  const homeScrollRef = useRef<any>(null);
  const catScrollRef = useRef<any>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    setShowBackToTop((prev) => {
      const shouldShow = y > 200;
      return prev !== shouldShow ? shouldShow : prev;
    });
  };

  const cartTotalCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const wishlistCount = wishlist.length;

  // Tab index mapping & animated liquid bubble indicator values
  const tabIndexMap: Record<string, number> = {
    home: 0,
    categories: 1,
    cart: 2,
    wishlist: 3,
    account: 4,
  };
  const [dockWidth, setDockWidth] = useState(Math.min(width - 24, 420));
  const slotWidth = Math.max(1, (dockWidth - 12) / 5);

  const indicatorTranslateX = useRef(new Animated.Value(0)).current;
  const indicatorScaleX = useRef(new Animated.Value(1)).current;
  const indicatorScaleY = useRef(new Animated.Value(1)).current;

  const cartBadgeScale = useRef(new Animated.Value(1)).current;
  const wishlistBadgeScale = useRef(new Animated.Value(1)).current;

  const prevActiveTab = useRef(activeTab);
  useEffect(() => {
    const targetIndex = tabIndexMap[activeTab] ?? 0;
    prevActiveTab.current = activeTab;
    Animated.parallel([
      Animated.spring(indicatorTranslateX, {
        toValue: targetIndex * slotWidth,
        damping: 18,
        stiffness: 175,
        mass: 0.8,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(indicatorScaleX, {
          toValue: 1.22,
          duration: 110,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(indicatorScaleX, {
          toValue: 1,
          damping: 12,
          stiffness: 180,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(indicatorScaleY, {
          toValue: 0.92,
          duration: 110,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(indicatorScaleY, {
          toValue: 1,
          damping: 12,
          stiffness: 180,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [activeTab, slotWidth]);

  // Badge pop animations on count update
  const prevCartCount = useRef(cartTotalCount);
  useEffect(() => {
    if (prevCartCount.current !== cartTotalCount) {
      prevCartCount.current = cartTotalCount;
      Animated.sequence([
        Animated.spring(cartBadgeScale, {
          toValue: 1.35,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.spring(cartBadgeScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [cartTotalCount]);

  const prevWishlistCount = useRef(wishlistCount);
  useEffect(() => {
    if (prevWishlistCount.current !== wishlistCount) {
      prevWishlistCount.current = wishlistCount;
      Animated.sequence([
        Animated.spring(wishlistBadgeScale, {
          toValue: 1.35,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.spring(wishlistBadgeScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [wishlistCount]);

  const switchMobileTab = (tab: 'home' | 'categories' | 'cart' | 'wishlist' | 'account') => {
    setActiveTab(tab);
    setAccountSubScreen(null);
  };

  const scrollToTop = () => {
    if (activeTab === 'home') {
      homeScrollRef.current?.scrollTo({ y: 0, animated: true });
    } else if (activeTab === 'categories') {
      catScrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const addToCart = (product: Product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const next = current + delta;
      const updated = { ...prev };
      if (next > 0) {
        updated[productId] = next;
      } else {
        delete updated[productId];
      }
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const moveWishlistToCart = (productId: string) => {
    const prod = PRODUCTS.find((p) => p.id === productId);
    if (prod) {
      addToCart(prod);
      toggleWishlist(productId);
    }
  };

  const formatPrice = (ngn: number) => {
    return `₦${ngn.toLocaleString()}`;
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const cartSubtotalNgn = Object.entries(cart).reduce((sum, [id, qty]) => {
    const prod = PRODUCTS.find((p) => p.id === id);
    return sum + (prod ? prod.priceNgn * qty : 0);
  }, 0);

  const discountFactor = discountApplied ? 0.9 : 1.0;
  const deliveryFeeNgn = 2500;
  const totalNgn = Math.round(cartSubtotalNgn * discountFactor) + (cartSubtotalNgn > 0 ? deliveryFeeNgn : 0);

  const handleApplyPromo = () => {
    const cleaned = promoCode.trim().toUpperCase();
    if (cleaned === 'SQUARE10' || cleaned === 'MANGA10' || cleaned === 'KADUNA-FREE') {
      setDiscountApplied(true);
      Alert.alert('Coupon Applied', 'Discount applied to your order.');
    } else {
      Alert.alert('Invalid Code', 'Please enter a valid code: SQUARE10, MANGA10 or KADUNA-FREE');
    }
  };

  return (
    <View style={styles.rootContainer}>
      <StatusBar style={activeTab === 'account' && accountSubScreen !== null ? 'dark' : 'light'} />

      {/* TOP HEADER: Consistent Manga Brand Header (#2A2320) across all primary tabs */}
      <SafeAreaView style={{ backgroundColor: activeTab === 'account' && accountSubScreen !== null ? '#FAF6F0' : '#2A2320' }}>
        {activeTab === 'account' && accountSubScreen !== null ? null : activeTab === 'account' ? (
          /* Option A: Dedicated Brand Header for Account Tab (No misplaced search bar) */
          <View style={styles.accountHeader}>
            <View style={styles.brandContainer}>
              <View style={styles.brandIcon}>
                <Text style={styles.brandIconText}>M</Text>
              </View>
              <View>
                <Text style={styles.brandTitle}>MANGA</Text>
                <Text style={styles.brandSubtitle}>MARKETSQUARE</Text>
              </View>
            </View>

            <View style={styles.accountHeaderRight}>
              <View style={styles.accountTitleBadge}>
                <Text style={styles.accountTitleBadgeText}>{isLoggedIn ? 'My Account' : 'Sign In'}</Text>
              </View>
              {isLoggedIn && (
                <TouchableOpacity
                  style={styles.accountBellBtn}
                  onPress={() => setAccountSubScreen('inbox')}
                  activeOpacity={0.8}
                  accessibilityLabel="Notifications"
                >
                  <BellIcon size={20} color="#FAF6F0" />
                  <View style={styles.bellDot} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          /* Primary Brand Top Bar (Clean, without currency toggle) */
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.brandContainer}>
                <View style={styles.brandIcon}>
                  <Text style={styles.brandIconText}>M</Text>
                </View>
                <View>
                  <Text style={styles.brandTitle}>MANGA</Text>
                  <Text style={styles.brandSubtitle}>MARKETSQUARE</Text>
                </View>
              </View>

              {/* Clean Trust Tagline */}
              <View style={styles.trustTag}>
                <Text style={styles.trustTagText}>Official Stores</Text>
              </View>
            </View>

            {/* Global Search Bar */}
            <View style={styles.searchBar}>
              <SearchIcon size={18} color="#8C8279" />
              <TextInput
                placeholder="Search on MANGA MARKETSQUARE..."
                placeholderTextColor="#8C8279"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <CloseIcon size={16} color="#8C8279" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </SafeAreaView>

      {/* TAB CONTENT VIEWS */}
      <View style={styles.contentContainer}>
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <ScrollView
            ref={homeScrollRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Verified Sellers & Delivery Guarantee Banner */}
            <View style={styles.heroBanner}>
              <View style={styles.heroBadge}>
                <ShieldCheckIcon size={14} color="#D9A441" />
                <Text style={styles.heroBadgeText}>AUTHENTIC PRODUCTS</Text>
              </View>
              <Text style={styles.heroTitle}>Authentic Multi-Category Marketplace</Text>
              <Text style={styles.heroSub}>
                Curated authentic sellers. Same-day delivery is possible for orders within Kaduna, with reliable delivery nationwide.
              </Text>
            </View>

            {/* Category Quick Rail */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Departments</Text>
              <TouchableOpacity onPress={() => setActiveTab('categories')}>
                <Text style={styles.seeAllText}>View All &rarr;</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORY_LIST.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryPill,
                    selectedCategory === cat.id && styles.categoryPillActive,
                  ]}
                  onPress={() => {
                    setSelectedCategory(cat.id);
                    setActiveTab('categories');
                  }}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      selectedCategory === cat.id && styles.categoryPillTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Flash Sales Row */}
            <View style={styles.flashBanner}>
              <View style={styles.flashHeader}>
                <View style={styles.flashTitleRow}>
                  <Text style={styles.flashIconText}>⚡</Text>
                  <Text style={styles.flashTitle}>MANGA Flash Deals</Text>
                </View>
                <View style={styles.timerBadge}>
                  <Text style={styles.timerText}>ENDS IN 04:18:22</Text>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.flashRow}>
                {PRODUCTS.filter((p) => p.isFlashDeal).map((p) => (
                  <TouchableOpacity
                    key={`flash-${p.id}`}
                    style={styles.flashCard}
                    onPress={() => setSelectedProduct(p)}
                    activeOpacity={0.85}
                  >
                    <Image source={{ uri: p.image }} style={styles.flashImage} />
                    <View style={styles.discountTag}>
                      <Text style={styles.discountTagText}>UP TO 30% OFF</Text>
                    </View>
                    <Text style={styles.flashProdTitle} numberOfLines={1}>{p.title}</Text>
                    <Text style={styles.flashProdPrice}>{formatPrice(p.priceNgn)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Official Mall Banner */}
            <View style={styles.officialMallBar}>
              <StoreIcon size={18} color="#D9A441" />
              <Text style={styles.officialMallText}>
                MANGA Official Mall • Official Flagship Stores (Sony, Apple, Samsung)
              </Text>
            </View>

            {/* Product Catalog Grid (2 columns) */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {selectedCategory === 'All' ? 'Trending Products' : selectedCategory}
              </Text>
              <Text style={styles.itemCountText}>{filteredProducts.length} items</Text>
            </View>

            <View style={styles.grid}>
              {filteredProducts.map((p) => {
                const isSaved = wishlist.includes(p.id);
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.card}
                    onPress={() => setSelectedProduct(p)}
                    activeOpacity={0.88}
                  >
                    <View style={styles.imageWrapper}>
                      <Image source={{ uri: p.image }} style={styles.cardImage} />
                      {p.isOfficial && (
                        <View style={styles.officialBadge}>
                          <Text style={styles.officialBadgeText}>Official</Text>
                        </View>
                      )}
                      <TouchableOpacity
                        style={styles.wishlistBtn}
                        onPress={() => toggleWishlist(p.id)}
                      >
                        <WishlistIcon
                          size={18}
                          color={isSaved ? '#B5532E' : '#8C8279'}
                          fill={isSaved ? '#B5532E' : 'none'}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.cardContent}>
                      <Text style={styles.cardStore}>{p.storeName}</Text>
                      <Text style={styles.cardTitle} numberOfLines={2}>
                        {p.title}
                      </Text>
                      <View style={styles.ratingRow}>
                        <Text style={styles.starText}>★</Text>
                        <Text style={styles.ratingScore}>{p.rating.toFixed(1)}</Text>
                        <Text style={styles.reviewsCount}>({p.reviewsCount})</Text>
                      </View>
                      <View style={styles.priceContainer}>
                        <Text style={styles.price}>{formatPrice(p.priceNgn)}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => {
                          addToCart(p);
                          Alert.alert('Added to Bag', `${p.title} added to your cart.`);
                        }}
                      >
                        <Text style={styles.addBtnText}>+ Add to Bag</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Mini Footer Strip */}
            <View style={styles.homeFooterStrip}>
              <Text style={styles.homeFooterCopyright}>
                © {new Date().getFullYear()} MANGA MARKETSQUARE • Same-Day Delivery in Kaduna
              </Text>
            </View>
          </ScrollView>
        )}

        {/* TAB 2: CATEGORIES */}
        {activeTab === 'categories' && (
          <ScrollView
            ref={catScrollRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.catHeaderBanner}>
              <Text style={styles.catHeaderTitle}>Explore Departments</Text>
              <Text style={styles.catHeaderSub}>
                Browse genuine listings backed by seller verification
              </Text>
            </View>

            {/* Department Quick Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORY_LIST.map((cat) => (
                <TouchableOpacity
                  key={`cat-pill-${cat.id}`}
                  style={[
                    styles.categoryPill,
                    selectedCategory === cat.id && styles.categoryPillActive,
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      selectedCategory === cat.id && styles.categoryPillTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.catList}>
              {CATEGORY_LIST.filter((c) => c.id !== 'All').map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.catListItem,
                    selectedCategory === c.id && styles.catListItemSelected,
                  ]}
                  onPress={() => setSelectedCategory(c.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.catListItemLeft}>
                    <View style={[styles.catBulletSquare, selectedCategory === c.id && { backgroundColor: '#B5532E' }]} />
                    <View>
                      <Text style={[styles.catListItemTitle, selectedCategory === c.id && { color: '#B5532E', fontWeight: '800' }]}>{c.name}</Text>
                      <Text style={styles.catListItemSub}>{c.count} items</Text>
                    </View>
                  </View>
                  <ChevronRightIcon size={20} color={selectedCategory === c.id ? '#B5532E' : '#8C8279'} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Filtered Products in Selected Department */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {selectedCategory === 'All' ? 'All Products' : `${selectedCategory} (${filteredProducts.length})`}
              </Text>
              <Text style={styles.itemCountText}>
                {filteredProducts.length} items
              </Text>
            </View>

            <View style={styles.grid}>
              {filteredProducts.map((p) => {
                const isFav = wishlist.includes(p.id);
                return (
                  <TouchableOpacity
                    key={`cat-grid-${p.id}`}
                    style={styles.card}
                    onPress={() => setSelectedProduct(p)}
                    activeOpacity={0.88}
                  >
                    <View style={styles.imageWrapper}>
                      <Image source={{ uri: p.image }} style={styles.cardImage} />
                      <TouchableOpacity
                        style={styles.wishlistBtn}
                        onPress={() => toggleWishlist(p.id)}
                        activeOpacity={0.8}
                      >
                        <HeartIcon
                          size={18}
                          color={isFav ? '#B3261E' : '#75757A'}
                          fill={isFav ? '#B3261E' : 'none'}
                        />
                      </TouchableOpacity>
                      {p.isOfficial && (
                        <View style={styles.officialBadge}>
                          <Text style={styles.officialBadgeText}>Official Store</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardStore} numberOfLines={1}>
                        {p.storeName}
                      </Text>
                      <Text style={styles.cardTitle} numberOfLines={2}>
                        {p.title}
                      </Text>
                      <View style={styles.ratingRow}>
                        <Text style={styles.starText}>★</Text>
                        <Text style={styles.ratingScore}>{p.rating.toFixed(1)}</Text>
                        <Text style={styles.reviewsCount}>({p.reviewsCount})</Text>
                      </View>
                      <View style={styles.priceContainer}>
                        <Text style={styles.price}>{formatPrice(p.priceNgn)}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => {
                          addToCart(p);
                          Alert.alert('Added to Bag', `${p.title} added to your cart.`);
                        }}
                      >
                        <Text style={styles.addBtnText}>+ Add to Bag</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        )}

        {/* TAB 3: CART */}
        {activeTab === 'cart' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.screenTitleRow}>
              <Text style={styles.screenTitle}>Shopping Bag</Text>
              <Text style={styles.screenItemCount}>{cartTotalCount} items</Text>
            </View>

            {cartTotalCount === 0 ? (
              <View style={styles.emptyContainer}>
                <CartIcon size={64} color="#E7D5BC" />
                <Text style={styles.emptyTitle}>Your bag is empty</Text>
                <Text style={styles.emptySub}>
                  Explore genuine electronics, fashion, computing and digital goods.
                </Text>
                <TouchableOpacity
                  style={styles.primaryActionButton}
                  onPress={() => setActiveTab('home')}
                >
                  <Text style={styles.primaryActionText}>Start Shopping</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {/* Cart Items List */}
                {Object.entries(cart).map(([id, qty]) => {
                  const prod = PRODUCTS.find((p) => p.id === id);
                  if (!prod) return null;
                  return (
                    <View key={id} style={styles.cartItemCard}>
                      <Image source={{ uri: prod.image }} style={styles.cartItemImage} />
                      <View style={styles.cartItemDetails}>
                        <Text style={styles.cartItemTitle} numberOfLines={2}>
                          {prod.title}
                        </Text>
                        <Text style={styles.cartItemStore}>{prod.storeName}</Text>
                        <Text style={styles.cartItemPrice}>{formatPrice(prod.priceNgn)}</Text>

                        {/* Stepper + Delete */}
                        <View style={styles.stepperRow}>
                          <View style={styles.stepper}>
                            <TouchableOpacity
                              style={styles.stepBtn}
                              onPress={() => updateCartQty(id, -1)}
                            >
                              <Text style={styles.stepBtnText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.stepVal}>{qty}</Text>
                            <TouchableOpacity
                              style={styles.stepBtn}
                              onPress={() => updateCartQty(id, 1)}
                            >
                              <Text style={styles.stepBtnText}>+</Text>
                            </TouchableOpacity>
                          </View>

                          <TouchableOpacity
                            onPress={() => removeFromCart(id)}
                            style={styles.cartTrashBtn}
                          >
                            <TrashIcon size={18} color="#B5532E" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })}

                {/* Coupon Code Section */}
                <View style={styles.promoCard}>
                  <Text style={styles.promoLabel}>Have a promo code?</Text>
                  <View style={styles.promoInputRow}>
                    <TextInput
                      style={styles.promoInput}
                      placeholder="e.g. SQUARE10, MANGA10 or KADUNA-FREE"
                      placeholderTextColor="#8C8279"
                      value={promoCode}
                      onChangeText={setPromoCode}
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity
                      style={styles.promoBtn}
                      onPress={handleApplyPromo}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.promoBtnText}>Apply</Text>
                    </TouchableOpacity>
                  </View>
                  {discountApplied && (
                    <Text style={styles.promoSuccessText}>✓ 10% Discount applied successfully</Text>
                  )}
                </View>

                {/* Cost Breakdown */}
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryTitle}>Order Summary</Text>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>{formatPrice(cartSubtotalNgn)}</Text>
                  </View>
                  {discountApplied && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.discountLabel}>Coupon Discount (10%)</Text>
                      <Text style={styles.discountValue}>
                        -{formatPrice(Math.round(cartSubtotalNgn * 0.1))}
                      </Text>
                    </View>
                  )}
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Buyer Protection Guarantee</Text>
                    <Text style={styles.freeBadge}>FREE</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Delivery (Same-Day Kaduna Eligible)</Text>
                    <Text style={styles.summaryValue}>{formatPrice(deliveryFeeNgn)}</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.totalLabel}>Estimated Total</Text>
                    <Text style={styles.totalValue}>{formatPrice(totalNgn)}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={() => setIsCheckoutVisible(true)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.checkoutBtnText}>
                      Proceed to Checkout ({formatPrice(totalNgn)})
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {/* TAB 4: WISHLIST */}
        {activeTab === 'wishlist' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.screenTitleRow}>
              <Text style={styles.screenTitle}>Saved Wishlist</Text>
              <Text style={styles.screenItemCount}>{wishlistCount} items</Text>
            </View>

            {wishlistCount === 0 ? (
              <View style={styles.emptyContainer}>
                <WishlistIcon size={64} color="#E7D5BC" />
                <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
                <Text style={styles.emptySub}>
                  Save items you love by tapping the heart icon on any product.
                </Text>
                <TouchableOpacity
                  style={styles.primaryActionButton}
                  onPress={() => setActiveTab('home')}
                >
                  <Text style={styles.primaryActionText}>Browse Products</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {wishlist.map((id) => {
                  const prod = PRODUCTS.find((p) => p.id === id);
                  if (!prod) return null;
                  return (
                    <View key={`wish-${id}`} style={styles.cartItemCard}>
                      <Image source={{ uri: prod.image }} style={styles.cartItemImage} />
                      <View style={styles.cartItemDetails}>
                        <Text style={styles.cartItemTitle} numberOfLines={2}>
                          {prod.title}
                        </Text>
                        <Text style={styles.cartItemStore}>{prod.storeName}</Text>
                        <Text style={styles.cartItemPrice}>{formatPrice(prod.priceNgn)}</Text>
                        <View style={styles.wishlistActions}>
                          <TouchableOpacity
                            style={styles.moveToBagBtn}
                            onPress={() => moveWishlistToCart(id)}
                          >
                            <Text style={styles.moveToBagBtnText}>Move to Bag</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.removeWishBtn}
                            onPress={() => toggleWishlist(id)}
                          >
                            <TrashIcon size={18} color="#8C8279" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
        )}

        {/* TAB 5: ACCOUNT & ALL SUB-SCREENS */}
        {activeTab === 'account' && (
          <View style={{ flex: 1 }}>
            {!isLoggedIn ? (
              /* DEDICATED AUTHENTICATION & EMAIL VERIFICATION PORTAL */
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* 1. SIGN IN SCREEN */}
                {authStep === 'signin' && (
                  <View style={styles.authCard}>
                    <View style={styles.authLogoBox}>
                      <View style={styles.brandIconLarge}>
                        <Text style={styles.brandIconLargeText}>M</Text>
                      </View>
                      <Text style={styles.authTitle}>Sign in to Manga</Text>
                      <Text style={styles.authSub}>
                        Access your active orders, Kaduna same-day tracking, saved vouchers, and address book.
                      </Text>
                    </View>

                    <View style={styles.authForm}>
                      <View style={styles.authField}>
                        <Text style={styles.authLabel}>Email Address</Text>
                        <TextInput
                          style={styles.authInput}
                          placeholder="e.g. buyer@example.com"
                          placeholderTextColor="#8C8279"
                          autoCapitalize="none"
                          keyboardType="email-address"
                          value={loginEmail}
                          onChangeText={setLoginEmail}
                        />
                      </View>

                      <View style={styles.authField}>
                        <Text style={styles.authLabel}>Password</Text>
                        <TextInput
                          style={styles.authInput}
                          placeholder="••••••••••••"
                          placeholderTextColor="#8C8279"
                          secureTextEntry
                          value={loginPassword}
                          onChangeText={setLoginPassword}
                        />
                      </View>

                      <TouchableOpacity
                        style={styles.authPrimaryBtn}
                        onPress={() => {
                          const cleanEmail = loginEmail.trim();
                          if (!cleanEmail || !loginPassword.trim()) {
                            Alert.alert('Required Fields', 'Please enter your email and password.');
                            return;
                          }
                          const displayName = cleanEmail.split('@')[0];
                          setUserProfile({
                            name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
                            email: cleanEmail,
                            phone: '+234 800 000 0000',
                            city: 'Kaduna',
                            memberSince: '2026',
                          });
                          setIsLoggedIn(true);
                          Alert.alert('Welcome Back', `Signed in successfully.`);
                        }}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.authPrimaryBtnText}>Sign In</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.authToggleBtn}
                        onPress={() => setAuthStep('register')}
                      >
                        <Text style={styles.authToggleText}>
                          New to Manga Marketsquare? <Text style={styles.authToggleTextBold}>Create Account</Text>
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* 2. REGISTRATION SCREEN (Step 1 of 2) */}
                {authStep === 'register' && (
                  <View style={styles.authCard}>
                    <View style={styles.authLogoBox}>
                      <View style={styles.brandIconLarge}>
                        <Text style={styles.brandIconLargeText}>M</Text>
                      </View>
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepBadgeText}>Step 1 of 2: Details</Text>
                      </View>
                      <Text style={styles.authTitle}>Create Manga Account</Text>
                      <Text style={styles.authSub}>
                        Join Kaduna’s verified marketplace with escrow buyer protection on every order.
                      </Text>
                    </View>

                    <View style={styles.authForm}>
                      <View style={styles.authField}>
                        <Text style={styles.authLabel}>Full Name *</Text>
                        <TextInput
                          style={styles.authInput}
                          placeholder="e.g. Fatima Bello"
                          placeholderTextColor="#8C8279"
                          value={regFullName}
                          onChangeText={setRegFullName}
                        />
                      </View>

                      <View style={styles.authField}>
                        <Text style={styles.authLabel}>Email Address (for Verification Code) *</Text>
                        <TextInput
                          style={styles.authInput}
                          placeholder="e.g. fatima.bello@example.com"
                          placeholderTextColor="#8C8279"
                          autoCapitalize="none"
                          keyboardType="email-address"
                          value={regEmail}
                          onChangeText={setRegEmail}
                        />
                      </View>

                      <View style={styles.authField}>
                        <Text style={styles.authLabel}>Phone Number *</Text>
                        <TextInput
                          style={styles.authInput}
                          placeholder="+234 803 123 4567"
                          placeholderTextColor="#8C8279"
                          keyboardType="phone-pad"
                          value={regPhone}
                          onChangeText={setRegPhone}
                        />
                      </View>

                      <View style={styles.authField}>
                        <Text style={styles.authLabel}>Primary Delivery City</Text>
                        <View style={styles.cityPickerRow}>
                          {['Kaduna', 'Abuja', 'Kano', 'Lagos'].map((c) => (
                            <TouchableOpacity
                              key={c}
                              style={[styles.cityPill, regCity === c && styles.cityPillActive]}
                              onPress={() => setRegCity(c)}
                            >
                              <Text style={[styles.cityPillText, regCity === c && styles.cityPillTextActive]}>
                                {c} {c === 'Kaduna' ? '⚡ Same-Day' : ''}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      <View style={styles.authField}>
                        <Text style={styles.authLabel}>Password *</Text>
                        <TextInput
                          style={styles.authInput}
                          placeholder="At least 6 characters"
                          placeholderTextColor="#8C8279"
                          secureTextEntry
                          value={regPassword}
                          onChangeText={setRegPassword}
                        />
                      </View>

                      <View style={styles.authField}>
                        <Text style={styles.authLabel}>Confirm Password *</Text>
                        <TextInput
                          style={styles.authInput}
                          placeholder="Re-enter password"
                          placeholderTextColor="#8C8279"
                          secureTextEntry
                          value={regConfirmPassword}
                          onChangeText={setRegConfirmPassword}
                        />
                      </View>

                      <TouchableOpacity
                        style={styles.authPrimaryBtn}
                        onPress={() => {
                          if (!regFullName.trim()) {
                            Alert.alert('Missing Name', 'Please enter your full name.');
                            return;
                          }
                          if (!regEmail.trim() || !regEmail.includes('@')) {
                            Alert.alert('Invalid Email', 'Please enter a valid email address for verification.');
                            return;
                          }
                          if (regPassword.length < 6) {
                            Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
                            return;
                          }
                          if (regPassword !== regConfirmPassword) {
                            Alert.alert('Password Mismatch', 'Passwords do not match. Please re-enter.');
                            return;
                          }

                          // Generate 6-digit OTP code and proceed to step 2
                          const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
                          setGeneratedOtp(randomCode);
                          setEnteredOtp('');
                          setOtpError('');
                          setResendTimer(45);
                          setAuthStep('verify_otp');
                          Alert.alert(
                            'Verification Code Sent',
                            `A 6-digit verification code has been dispatched to ${regEmail.trim()}.\n\n(For testing: ${randomCode})`
                          );
                        }}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.authPrimaryBtnText}>Continue to Email Verification &rarr;</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.authToggleBtn}
                        onPress={() => setAuthStep('signin')}
                      >
                        <Text style={styles.authToggleText}>
                          Already have an account? <Text style={styles.authToggleTextBold}>Sign In</Text>
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* 3. EMAIL VERIFICATION OTP SCREEN (Step 2 of 2) */}
                {authStep === 'verify_otp' && (
                  <View style={styles.authCard}>
                    <View style={styles.authLogoBox}>
                      <View style={styles.otpIconBadge}>
                        <InboxIcon size={26} color="#B5532E" />
                      </View>
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepBadgeText}>Step 2 of 2: Verification</Text>
                      </View>
                      <Text style={styles.authTitle}>Verify Your Email</Text>
                      <Text style={styles.authSub}>
                        We have dispatched a 6-digit verification code to confirm ownership of your email address:
                      </Text>
                      <View style={styles.targetEmailBadge}>
                        <Text style={styles.targetEmailText}>{regEmail}</Text>
                        <TouchableOpacity onPress={() => setAuthStep('register')}>
                          <Text style={styles.changeEmailText}>Edit</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.authForm}>
                      <View style={styles.authField}>
                        <Text style={styles.authLabel}>Enter 6-Digit Code</Text>
                        <TextInput
                          style={styles.otpInput}
                          placeholder="• • • • • •"
                          placeholderTextColor="#C4B8AB"
                          keyboardType="number-pad"
                          maxLength={6}
                          value={enteredOtp}
                          onChangeText={(t) => {
                            setEnteredOtp(t);
                            if (otpError) setOtpError('');
                          }}
                        />
                      </View>

                      {otpError ? (
                        <Text style={styles.otpErrorText}>{otpError}</Text>
                      ) : null}

                      <TouchableOpacity
                        style={styles.authPrimaryBtn}
                        onPress={() => {
                          if (enteredOtp.trim() === generatedOtp) {
                            // Activation Success
                            const displayName = regFullName.trim();
                            setUserProfile({
                              name: displayName,
                              email: regEmail.trim().toLowerCase(),
                              phone: regPhone.trim(),
                              city: regCity,
                              memberSince: 'Nov 2026',
                            });

                            // Add welcome inbox message
                            const welcomeMsg: InboxMsg = {
                              id: `inbox-${Date.now()}`,
                              title: 'Account Activated & Verified',
                              tag: 'Welcome',
                              body: `Welcome to MANGA MARKETSQUARE, ${displayName}! Your email has been verified.`,
                              fullContent: `Hello ${displayName}! Your account has been verified and activated with Kaduna escrow protection. Use coupon code SQUARE10 at checkout for 10% off your first order.`,
                              time: 'Just now',
                              unread: true,
                              actionText: 'Explore Flash Deals',
                            };
                            setInboxList((prev) => [welcomeMsg, ...prev]);

                            // Add default city address
                            const userAddress: AddressItem = {
                              id: `addr-${Date.now()}`,
                              label: 'Primary Delivery',
                              isDefault: true,
                              name: displayName,
                              phone: regPhone.trim(),
                              street: '14 Ahmadu Bello Way',
                              area: 'Central District',
                              city: regCity,
                              state: `${regCity} State`,
                              landmark: 'Near City Gate',
                              isKadunaEligible: regCity === 'Kaduna',
                              instructions: 'Call recipient on arrival',
                            };
                            setAddresses([userAddress]);

                            setIsLoggedIn(true);
                            setAuthStep('signin');
                            Alert.alert('Account Verified!', `Welcome to MANGA MARKETSQUARE, ${displayName}!`);
                          } else {
                            setOtpError('Invalid code. Please enter the 6-digit code shown above or tap autofill.');
                          }
                        }}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.authPrimaryBtnText}>Verify Email & Activate Account</Text>
                      </TouchableOpacity>

                      {/* Resend Code Section */}
                      <View style={styles.resendSection}>
                        {resendTimer > 0 ? (
                          <Text style={styles.resendTimerText}>
                            Resend code in <Text style={{ fontWeight: '800', color: '#B5532E' }}>{resendTimer}s</Text>
                          </Text>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                              setGeneratedOtp(newCode);
                              setResendTimer(45);
                              Alert.alert('Code Resent', `New verification code dispatched to ${regEmail}.`);
                            }}
                          >
                            <Text style={styles.resendActiveText}>Resend Verification Code</Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      <TouchableOpacity
                        style={styles.authToggleBtn}
                        onPress={() => setAuthStep('register')}
                      >
                        <Text style={styles.authToggleText}>&larr; Back to Personal Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Trust & Policy Links for Guest Users */}
                <View style={styles.guestSupportCard}>
                  <Text style={styles.guestSupportTitle}>Customer Guarantees</Text>
                  <TouchableOpacity
                    style={styles.guestSupportItem}
                    onPress={() => setAccountSubScreen('buyer_protection')}
                  >
                    <ShieldCheckIcon size={18} color="#4F6B3A" />
                    <Text style={styles.guestSupportItemText}>Escrow Buyer Protection Guarantee</Text>
                    <ChevronRightIcon size={16} color="#8C8279" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.guestSupportItem}
                    onPress={() => setAccountSubScreen('return_policy')}
                  >
                    <DocumentTextIcon size={18} color="#B5532E" />
                    <Text style={styles.guestSupportItemText}>7-Day Hassle-Free Returns</Text>
                    <ChevronRightIcon size={16} color="#8C8279" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.guestSupportItem}
                    onPress={() => setAccountSubScreen('privacy_policy')}
                  >
                    <LockIcon size={18} color="#2A2320" />
                    <Text style={styles.guestSupportItemText}>NDPA Data Privacy & Protection</Text>
                    <ChevronRightIcon size={16} color="#8C8279" />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : accountSubScreen === null ? (
              /* MAIN ACCOUNT MENU SCREEN (Matching User Reference Image) */
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* User Profile Header Card */}
                <View style={styles.accountProfileCard}>
                  <View style={styles.accountAvatarRow}>
                    <View style={styles.accountAvatar}>
                      <Text style={styles.accountAvatarText}>
                        {userProfile.name
                          ? userProfile.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()
                          : 'M'}
                      </Text>
                    </View>
                    <View style={styles.accountInfo}>
                      <View style={styles.accountNameRow}>
                        <Text style={styles.accountWelcomeText}>
                          Welcome {userProfile.name ? userProfile.name.split(' ')[0] : 'Shopper'}!
                        </Text>
                        <View style={styles.memberPill}>
                          <Text style={styles.memberPillText}>Kaduna Member</Text>
                        </View>
                      </View>
                      <Text style={styles.accountEmailText}>{userProfile.email || 'Verified Account'}</Text>
                    </View>
                  </View>

                  {/* Quick Summary Stat Boxes */}
                  <View style={styles.accountStatsRow}>
                    <TouchableOpacity
                      style={styles.statBox}
                      onPress={() => setAccountSubScreen('orders')}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.statNumber}>{orders.filter(o => o.type === 'active').length}</Text>
                      <Text style={styles.statLabel}>Active Order</Text>
                    </TouchableOpacity>
                    <View style={styles.statDivider} />
                    <TouchableOpacity
                      style={styles.statBox}
                      onPress={() => setAccountSubScreen('vouchers')}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.statNumber}>3</Text>
                      <Text style={styles.statLabel}>Vouchers</Text>
                    </TouchableOpacity>
                    <View style={styles.statDivider} />
                    <TouchableOpacity
                      style={styles.statBox}
                      onPress={() => setActiveTab('wishlist')}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.statNumber}>{wishlist.length}</Text>
                      <Text style={styles.statLabel}>Saved Items</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Quick Actions List (Orders, Inbox, Reviews, Vouchers, Wishlist, Sellers, Viewed) */}
                <View style={styles.accountMenuGroup}>
                  <TouchableOpacity
                    style={styles.accountMenuItem}
                    onPress={() => setAccountSubScreen('orders')}
                  >
                    <View style={styles.accountMenuLeft}>
                      <OrdersIcon size={20} color="#2A2320" />
                      <Text style={styles.accountMenuLabel}>Orders</Text>
                    </View>
                    <ChevronRightIcon size={18} color="#8C8279" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.accountMenuItem}
                    onPress={() => setAccountSubScreen('inbox')}
                  >
                    <View style={styles.accountMenuLeft}>
                      <InboxIcon size={20} color="#2A2320" />
                      <Text style={styles.accountMenuLabel}>Inbox</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      {inboxList.filter(m => m.unread).length > 0 && (
                        <View style={styles.unreadCountBadge}>
                          <Text style={styles.unreadCountBadgeText}>
                            {inboxList.filter(m => m.unread).length}
                          </Text>
                        </View>
                      )}
                      <ChevronRightIcon size={18} color="#8C8279" />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.accountMenuItem}
                    onPress={() => setAccountSubScreen('reviews')}
                  >
                    <View style={styles.accountMenuLeft}>
                      <ReviewsIcon size={20} color="#2A2320" />
                      <Text style={styles.accountMenuLabel}>Ratings & Reviews</Text>
                    </View>
                    <ChevronRightIcon size={18} color="#8C8279" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.accountMenuItem}
                    onPress={() => setAccountSubScreen('vouchers')}
                  >
                    <View style={styles.accountMenuLeft}>
                      <VoucherIcon size={20} color="#2A2320" />
                      <Text style={styles.accountMenuLabel}>Vouchers</Text>
                    </View>
                    <ChevronRightIcon size={18} color="#8C8279" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.accountMenuItem}
                    onPress={() => setActiveTab('wishlist')}
                  >
                    <View style={styles.accountMenuLeft}>
                      <WishlistIcon size={20} color="#2A2320" />
                      <Text style={styles.accountMenuLabel}>Wishlist</Text>
                    </View>
                    <ChevronRightIcon size={18} color="#8C8279" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.accountMenuItem}
                    onPress={() => setAccountSubScreen('sellers')}
                  >
                    <View style={styles.accountMenuLeft}>
                      <StoreIcon size={20} color="#2A2320" />
                      <Text style={styles.accountMenuLabel}>Followed Sellers</Text>
                    </View>
                    <ChevronRightIcon size={18} color="#8C8279" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.accountMenuItem}
                    onPress={() => setAccountSubScreen('recently_viewed')}
                  >
                    <View style={styles.accountMenuLeft}>
                      <EyeIcon size={20} color="#2A2320" />
                      <Text style={styles.accountMenuLabel}>Recently Viewed</Text>
                    </View>
                    <ChevronRightIcon size={18} color="#8C8279" />
                  </TouchableOpacity>
                </View>

                {/* My Settings Section Header */}
                <View style={styles.settingsSectionHeader}>
                  <Text style={styles.settingsSectionTitle}>My Settings</Text>
                </View>

                {/* Settings & Legal List */}
                <View style={styles.accountMenuGroup}>
                  <TouchableOpacity
                    style={styles.accountMenuItem}
                    onPress={() => setAccountSubScreen('address_book')}
                  >
                    <Text style={styles.accountMenuLabelSimple}>Address Book</Text>
                    <ChevronRightIcon size={18} color="#8C8279" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.accountMenuItem}
                    onPress={() => setAccountSubScreen('account_management')}
                  >
                    <Text style={styles.accountMenuLabelSimple}>Account Management</Text>
                    <ChevronRightIcon size={18} color="#8C8279" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.accountMenuItem}
                    onPress={() => setAccountSubScreen('close_account')}
                  >
                    <Text style={styles.accountMenuLabelSimple}>Close Account</Text>
                    <ChevronRightIcon size={18} color="#8C8279" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.accountMenuItem}
                    onPress={() => setAccountSubScreen('notifications')}
                  >
                    <Text style={styles.accountMenuLabelSimple}>Notification Preferences</Text>
                    <ChevronRightIcon size={18} color="#8C8279" />
                  </TouchableOpacity>

                  {/* Legal Pages */}
                  <TouchableOpacity
                    style={styles.accountMenuItem}
                    onPress={() => setAccountSubScreen('privacy_policy')}
                  >
                    <Text style={styles.accountMenuLabelSimple}>Privacy Policy</Text>
                    <ChevronRightIcon size={18} color="#8C8279" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.accountMenuItem}
                    onPress={() => setAccountSubScreen('terms_of_service')}
                  >
                    <Text style={styles.accountMenuLabelSimple}>Terms of Service</Text>
                    <ChevronRightIcon size={18} color="#8C8279" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.accountMenuItem}
                    onPress={() => setAccountSubScreen('buyer_protection')}
                  >
                    <Text style={styles.accountMenuLabelSimple}>Buyer Protection Policy</Text>
                    <ChevronRightIcon size={18} color="#8C8279" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.accountMenuItem}
                    onPress={() => setAccountSubScreen('return_policy')}
                  >
                    <Text style={styles.accountMenuLabelSimple}>7-Day Return Policy</Text>
                    <ChevronRightIcon size={18} color="#8C8279" />
                  </TouchableOpacity>
                </View>

                {/* Logout Button (Opens Dedicated In-App Modal) */}
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => setShowLogoutConfirm(true)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>
              </ScrollView>
            ) : (
              /* DEDICATED SUB-SCREENS (2026 Best Practices) */
              <View style={{ flex: 1, backgroundColor: '#FAF6F0' }}>
                {/* Sub-Screen Navigation Top Bar */}
                <View style={styles.subScreenHeader}>
                  <TouchableOpacity
                    onPress={() => setAccountSubScreen(null)}
                    style={styles.subScreenBackBtn}
                  >
                    <ArrowLeftIcon size={20} color="#2A2320" />
                    <Text style={styles.subScreenBackText}>Back</Text>
                  </TouchableOpacity>
                  <Text style={styles.subScreenTitle}>
                    {accountSubScreen === 'orders' && 'My Orders'}
                    {accountSubScreen === 'inbox' && 'Inbox & Alerts'}
                    {accountSubScreen === 'reviews' && 'Ratings & Reviews'}
                    {accountSubScreen === 'vouchers' && 'Vouchers & Coupons'}
                    {accountSubScreen === 'sellers' && 'Followed Sellers'}
                    {accountSubScreen === 'recently_viewed' && 'Recently Viewed'}
                    {accountSubScreen === 'address_book' && 'Address Book'}
                    {accountSubScreen === 'account_management' && 'Account Management'}
                    {accountSubScreen === 'close_account' && 'Close Account'}
                    {accountSubScreen === 'notifications' && 'Notification Preferences'}
                    {accountSubScreen === 'privacy_policy' && 'Privacy Policy'}
                    {accountSubScreen === 'terms_of_service' && 'Terms of Service'}
                    {accountSubScreen === 'buyer_protection' && 'Buyer Protection'}
                    {accountSubScreen === 'return_policy' && '7-Day Return Policy'}
                  </Text>
                  <View style={{ width: 48 }} />
                </View>

                <ScrollView contentContainerStyle={styles.subScreenContent} showsVerticalScrollIndicator={false}>
                  
                  {/* SUB-SCREEN 1: ORDERS (Active & Completed Tabs with Details Modal) */}
                  {accountSubScreen === 'orders' && (
                    <View>
                      <View style={styles.orderFilterPills}>
                        <TouchableOpacity
                          style={[styles.filterPill, orderTab === 'active' && styles.filterPillActive]}
                          onPress={() => setOrderTab('active')}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.filterPillText, orderTab === 'active' && styles.filterPillTextActive]}>
                            Active ({orders.filter(o => o.type === 'active').length})
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.filterPill, orderTab === 'completed' && styles.filterPillActive]}
                          onPress={() => setOrderTab('completed')}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.filterPillText, orderTab === 'completed' && styles.filterPillTextActive]}>
                            Completed ({orders.filter(o => o.type === 'completed').length})
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {orders.filter(o => o.type === orderTab).map((order) => (
                        <TouchableOpacity
                          key={order.id}
                          style={styles.subCard}
                          onPress={() => setSelectedOrder(order)}
                          activeOpacity={0.88}
                        >
                          <View style={styles.orderCardHeader}>
                            <Text style={styles.orderRefNumber}>{order.orderNumber}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: order.type === 'active' ? '#FEF3EB' : '#EDF7ED', borderColor: order.statusColor }]}>
                              <Text style={[styles.statusBadgeText, { color: order.statusColor }]}>{order.status}</Text>
                            </View>
                          </View>

                          <View style={styles.orderItemRow}>
                            <Image
                              source={{ uri: order.products[0].image }}
                              style={styles.orderThumb}
                            />
                            <View style={{ flex: 1 }}>
                              <Text style={styles.orderItemName} numberOfLines={2}>
                                {order.products[0].title}
                              </Text>
                              <Text style={styles.orderItemVendor}>{order.products[0].storeName}</Text>
                              <Text style={styles.orderItemPrice}>
                                {formatPrice(order.totalNgn)} • Qty: {order.products[0].qty}
                              </Text>
                              <Text style={styles.orderDateSub}>Placed: {order.date}</Text>
                            </View>
                          </View>

                          {order.type === 'active' ? (
                            <View style={styles.stepperContainer}>
                              <View style={styles.stepDone}>
                                <CheckIcon size={12} color="#FFFFFF" />
                              </View>
                              <Text style={styles.stepTextDone}>Placed</Text>
                              <Text style={styles.stepArrow}>➔</Text>
                              <View style={styles.stepDone}>
                                <CheckIcon size={12} color="#FFFFFF" />
                              </View>
                              <Text style={styles.stepTextDone}>Escrow</Text>
                              <Text style={styles.stepArrow}>➔</Text>
                              <View style={styles.stepActive}>
                                <Text style={styles.stepActiveText}>●</Text>
                              </View>
                              <Text style={styles.stepTextActive}>Out for Delivery</Text>
                            </View>
                          ) : (
                            <View style={styles.completedBadgeStrip}>
                              <CheckIcon size={14} color="#4F6B3A" />
                              <Text style={styles.completedBadgeText}>
                                Delivered & Verified by John Luka
                              </Text>
                            </View>
                          )}

                          <View style={styles.orderCardFooterAction}>
                            <Text style={styles.viewDetailsText}>Tap to view receipt & tracking timeline &rarr;</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* SUB-SCREEN 2: INBOX (Openable Messages with Read States) */}
                  {accountSubScreen === 'inbox' && (
                    <View>
                      {inboxList.map((msg) => (
                        <TouchableOpacity
                          key={msg.id}
                          style={[styles.inboxItem, msg.unread && styles.inboxItemUnread]}
                          onPress={() => {
                            setInboxList(prev => prev.map(m => m.id === msg.id ? { ...m, unread: false } : m));
                            setSelectedInboxMsg(msg);
                          }}
                          activeOpacity={0.85}
                        >
                          <View style={[styles.inboxIconBox, msg.unread && { backgroundColor: '#FBEBE4' }]}>
                            <BellIcon size={20} color={msg.unread ? '#B5532E' : '#8C8279'} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <View style={styles.inboxTopRow}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                                <View style={styles.inboxCategoryTag}>
                                  <Text style={styles.inboxCategoryTagText}>{msg.tag}</Text>
                                </View>
                                <Text style={[styles.inboxTitle, msg.unread && { fontWeight: '800', color: '#2A2320' }]} numberOfLines={1}>
                                  {msg.title}
                                </Text>
                              </View>
                              {msg.unread && <View style={styles.unreadDot} />}
                            </View>
                            <Text style={styles.inboxBody} numberOfLines={2}>{msg.body}</Text>
                            <View style={styles.inboxMetaRow}>
                              <Text style={styles.inboxTime}>{msg.time}</Text>
                              <Text style={styles.inboxTapToOpen}>Tap to read message &rarr;</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* SUB-SCREEN 3: RATINGS & REVIEWS */}
                  {accountSubScreen === 'reviews' && (
                    <View>
                      <View style={styles.subCard}>
                        <Text style={styles.subCardTitle}>Pending Review</Text>
                        <Text style={styles.subCardSub}>Share your experience with verified sellers.</Text>
                        
                        <View style={styles.reviewItemPad}>
                          <Text style={styles.orderItemName}>{PRODUCTS[0].title}</Text>
                          <Text style={styles.orderItemVendor}>Sony Audio Official Store</Text>
                          
                          <View style={styles.starPickerRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <TouchableOpacity
                                key={star}
                                onPress={() => setReviewRating(star)}
                                style={{ padding: 4 }}
                              >
                                <StarIcon
                                  size={24}
                                  color="#D9A441"
                                  fill={star <= reviewRating ? '#D9A441' : 'none'}
                                />
                              </TouchableOpacity>
                            ))}
                          </View>

                          {reviewSubmitted ? (
                            <View style={styles.successBox}>
                              <Text style={styles.successBoxText}>✓ Review submitted successfully! Thank you.</Text>
                            </View>
                          ) : (
                            <TouchableOpacity
                              style={styles.cardActionBtn}
                              onPress={() => setReviewSubmitted(true)}
                            >
                              <Text style={styles.cardActionBtnText}>Submit 5-Star Review</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  )}

                  {/* SUB-SCREEN 4: VOUCHERS */}
                  {accountSubScreen === 'vouchers' && (
                    <View>
                      {[
                        {
                          code: 'KADUNA-FREE',
                          title: 'Free Delivery within Kaduna',
                          desc: 'Valid for all local orders dispatched in Kaduna city.',
                          exp: 'Exp: Dec 31, 2026',
                        },
                        {
                          code: 'SQUARE10',
                          title: '10% OFF Any Verified Seller Order',
                          desc: 'Apply at checkout for 10% instant discount.',
                          exp: 'Exp: Dec 31, 2026',
                        },
                        {
                          code: 'MANGA10',
                          title: '10% OFF Flash Deals',
                          desc: 'Extra 10% discount on all flash sale listings.',
                          exp: 'Exp: Dec 31, 2026',
                        },
                      ].map((v) => (
                        <View key={v.code} style={styles.voucherCard}>
                          <View style={{ flex: 1 }}>
                            <View style={styles.voucherPill}>
                              <Text style={styles.voucherPillText}>{v.code}</Text>
                            </View>
                            <Text style={styles.voucherTitle}>{v.title}</Text>
                            <Text style={styles.voucherDesc}>{v.desc}</Text>
                            <Text style={styles.voucherExp}>{v.exp}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.voucherCopyBtn}
                            onPress={() => {
                              setPromoCode(v.code);
                              setDiscountApplied(true);
                              Alert.alert('Voucher Copied & Applied', `${v.code} has been applied to your cart!`);
                            }}
                          >
                            <CopyIcon size={16} color="#B5532E" />
                            <Text style={styles.voucherCopyText}>Copy</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* SUB-SCREEN 5: FOLLOWED SELLERS (Interactive Storefronts & Product Strip) */}
                  {accountSubScreen === 'sellers' && (
                    <View>
                      {followedSellers.map((s) => {
                        const isFollowing = followingMap[s.id] ?? true;
                        return (
                          <View key={s.id} style={styles.sellerCardEnhanced}>
                            <View style={styles.sellerHeaderRow}>
                              <View style={styles.sellerAvatarBox}>
                                <Text style={styles.sellerAvatarText}>{s.name.charAt(0)}</Text>
                              </View>
                              <View style={{ flex: 1 }}>
                                <View style={styles.sellerBadgeRow}>
                                  <Text style={styles.sellerName} numberOfLines={1}>{s.name}</Text>
                                  <View style={styles.officialBadgeMini}>
                                    <Text style={styles.officialBadgeMiniText}>{s.type}</Text>
                                  </View>
                                </View>
                                <Text style={styles.sellerStatsLine}>{s.rating} • {s.followers}</Text>
                                <Text style={styles.sellerNote}>{s.note}</Text>
                              </View>
                            </View>

                            {/* Mini Product Showcase Strip */}
                            <View style={styles.sellerProductShowcase}>
                              <Text style={styles.sellerShowcaseLabel}>Featured Catalog Items:</Text>
                              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sellerProductRail}>
                                {s.products.map((p) => {
                                  const fullProd = PRODUCTS.find((prod) => prod.id === p.id);
                                  return (
                                    <TouchableOpacity
                                      key={p.id}
                                      style={styles.sellerProdMiniCard}
                                      onPress={() => {
                                        if (fullProd) setSelectedProduct(fullProd);
                                      }}
                                      activeOpacity={0.85}
                                    >
                                      <Image source={{ uri: p.image }} style={styles.sellerProdMiniImg} />
                                      <Text style={styles.sellerProdMiniTitle} numberOfLines={1}>{p.title}</Text>
                                      <Text style={styles.sellerProdMiniPrice}>{formatPrice(p.priceNgn)}</Text>
                                    </TouchableOpacity>
                                  );
                                })}
                              </ScrollView>
                            </View>

                            {/* Actions */}
                            <View style={styles.sellerActionsRow}>
                              <TouchableOpacity
                                style={styles.visitStoreBtn}
                                onPress={() => {
                                  setAccountSubScreen(null);
                                  setActiveTab('categories');
                                }}
                              >
                                <Text style={styles.visitStoreBtnText}>Visit Storefront</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[styles.followingToggleBtn, !isFollowing && styles.followBtnActive]}
                                onPress={() => {
                                  setFollowingMap(prev => ({ ...prev, [s.id]: !isFollowing }));
                                  Alert.alert(
                                    isFollowing ? 'Unfollowed' : 'Following',
                                    isFollowing ? `You will no longer receive alerts from ${s.name}.` : `You are now following ${s.name}.`
                                  );
                                }}
                              >
                                <Text style={[styles.followingToggleBtnText, !isFollowing && styles.followBtnActiveText]}>
                                  {isFollowing ? '✓ Following' : '+ Follow'}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}

                  {/* SUB-SCREEN 6: RECENTLY VIEWED (Fixed Image Wrapper + Full Details) */}
                  {accountSubScreen === 'recently_viewed' && (
                    <View style={styles.recentlyViewedGrid}>
                      {PRODUCTS.map((p) => (
                        <TouchableOpacity
                          key={`rec-${p.id}`}
                          style={styles.recentCard}
                          onPress={() => setSelectedProduct(p)}
                          activeOpacity={0.88}
                        >
                          <View style={styles.recentImageWrapper}>
                            <Image source={{ uri: p.image }} style={styles.cardImage} />
                            {p.isOfficial && (
                              <View style={styles.officialBadge}>
                                <Text style={styles.officialBadgeText}>Official</Text>
                              </View>
                            )}
                          </View>
                          <View style={styles.cardContent}>
                            <Text style={styles.cardStore}>{p.storeName}</Text>
                            <Text style={styles.cardTitle} numberOfLines={2}>{p.title}</Text>
                            <View style={styles.ratingRow}>
                              <Text style={styles.starText}>★</Text>
                              <Text style={styles.ratingScore}>{p.rating.toFixed(1)}</Text>
                              <Text style={styles.reviewsCount}>({p.reviewsCount})</Text>
                            </View>
                            <Text style={styles.price}>{formatPrice(p.priceNgn)}</Text>
                            <TouchableOpacity
                              style={styles.addBtn}
                              onPress={() => {
                                addToCart(p);
                                Alert.alert('Added to Bag', `${p.title} added to your bag.`);
                              }}
                            >
                              <Text style={styles.addBtnText}>+ Add to Bag</Text>
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* SUB-SCREEN 7: ADDRESS BOOK (Professional Address Management) */}
                  {accountSubScreen === 'address_book' && (
                    <View>
                      {addresses.map((addr) => (
                        <View key={addr.id} style={[styles.subCard, addr.isDefault && styles.subCardDefaultAddress]}>
                          <View style={styles.addressHeaderRow}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <LocationPinIcon size={18} color={addr.isDefault ? '#B5532E' : '#8C8279'} />
                              <Text style={styles.addressTitle}>{addr.label}</Text>
                              {addr.isDefault && (
                                <View style={styles.defaultAddressPill}>
                                  <Text style={styles.defaultAddressPillText}>DEFAULT SHIPPING</Text>
                                </View>
                              )}
                            </View>
                            {addr.isKadunaEligible && (
                              <View style={styles.kadunaPill}>
                                <Text style={styles.kadunaPillText}>Kaduna Same-Day Eligible</Text>
                              </View>
                            )}
                          </View>

                          <View style={styles.addressBody}>
                            <View style={styles.addressLineItem}>
                              <UserIcon size={14} color="#8C8279" />
                              <Text style={styles.addressNameBold}>{addr.name}</Text>
                            </View>
                            <View style={styles.addressLineItem}>
                              <PhoneIcon size={14} color="#8C8279" />
                              <Text style={styles.addressPhoneText}>{addr.phone}</Text>
                            </View>
                            <View style={styles.addressLineItem}>
                              <LocationPinIcon size={14} color="#8C8279" />
                              <Text style={styles.addressStreetText}>
                                {addr.street}, {addr.area}, {addr.city}, {addr.state}
                              </Text>
                            </View>
                            {addr.landmark ? (
                              <Text style={styles.addressLandmarkText}>Landmark: {addr.landmark}</Text>
                            ) : null}
                            {addr.instructions ? (
                              <View style={styles.deliveryNoteBox}>
                                <Text style={styles.deliveryNoteText}>Note: {addr.instructions}</Text>
                              </View>
                            ) : null}
                          </View>

                          {/* Address Action Bar */}
                          <View style={styles.addressActionBar}>
                            {!addr.isDefault && (
                              <TouchableOpacity
                                style={styles.setDefaultBtn}
                                onPress={() => {
                                  setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === addr.id })));
                                  Alert.alert('Default Updated', `${addr.label} set as your default delivery address.`);
                                }}
                              >
                                <Text style={styles.setDefaultBtnText}>Set as Default</Text>
                              </TouchableOpacity>
                            )}
                            <TouchableOpacity
                              style={styles.deleteAddrBtn}
                              onPress={() => {
                                if (addresses.length <= 1) {
                                  Alert.alert('Cannot Delete', 'You must maintain at least one delivery address.');
                                  return;
                                }
                                Alert.alert(
                                  'Delete Address',
                                  `Are you sure you want to delete ${addr.label} address?`,
                                  [
                                    { text: 'Cancel', style: 'cancel' },
                                    {
                                      text: 'Delete',
                                      style: 'destructive',
                                      onPress: () => {
                                        setAddresses(prev => prev.filter(a => a.id !== addr.id));
                                      },
                                    },
                                  ]
                                );
                              }}
                            >
                              <TrashIcon size={16} color="#B5532E" />
                              <Text style={styles.deleteAddrBtnText}>Delete</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}

                      {!showAddAddressForm ? (
                        <TouchableOpacity
                          style={styles.primaryActionButton}
                          onPress={() => setShowAddAddressForm(true)}
                        >
                          <Text style={styles.primaryActionText}>+ Add New Delivery Address</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.subCard}>
                          <Text style={styles.subCardTitle}>Add New Delivery Address</Text>
                          
                          <View style={styles.addressTypePillsRow}>
                            {['Home', 'Office', 'Other'].map((l) => (
                              <TouchableOpacity
                                key={l}
                                style={[styles.addrTypePill, newAddrLabel === l && styles.addrTypePillActive]}
                                onPress={() => setNewAddrLabel(l)}
                              >
                                <Text style={[styles.addrTypePillText, newAddrLabel === l && styles.addrTypePillTextActive]}>{l}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>

                          <TextInput
                            style={styles.formInput}
                            placeholder="Full Name"
                            placeholderTextColor="#8C8279"
                            value={newAddrName}
                            onChangeText={setNewAddrName}
                          />
                          <TextInput
                            style={styles.formInput}
                            placeholder="Phone Number (+234...)"
                            placeholderTextColor="#8C8279"
                            value={newAddrPhone}
                            onChangeText={setNewAddrPhone}
                          />
                          <TextInput
                            style={styles.formInput}
                            placeholder="Street Address (e.g. 24 Ahmadu Bello Way)"
                            placeholderTextColor="#8C8279"
                            value={newAddrStreet}
                            onChangeText={setNewAddrStreet}
                          />
                          <TextInput
                            style={styles.formInput}
                            placeholder="Area / District (e.g. Malali, Barnawa, GRA)"
                            placeholderTextColor="#8C8279"
                            value={newAddrArea}
                            onChangeText={setNewAddrArea}
                          />
                          <TextInput
                            style={styles.formInput}
                            placeholder="Landmark (Optional, e.g. Opposite State Library)"
                            placeholderTextColor="#8C8279"
                            value={newAddrLandmark}
                            onChangeText={setNewAddrLandmark}
                          />
                          <TextInput
                            style={styles.formInput}
                            placeholder="Delivery Rider Instructions (e.g. Ring flat 2B)"
                            placeholderTextColor="#8C8279"
                            value={newAddrInstructions}
                            onChangeText={setNewAddrInstructions}
                          />

                          <View style={styles.cityPickerRow}>
                            {['Kaduna', 'Abuja', 'Kano', 'Lagos'].map((c) => (
                              <TouchableOpacity
                                key={c}
                                style={[styles.cityPill, newAddressCity === c && styles.cityPillActive]}
                                onPress={() => setNewAddressCity(c)}
                              >
                                <Text style={[styles.cityPillText, newAddressCity === c && styles.cityPillTextActive]}>
                                  {c} {c === 'Kaduna' ? '⚡ Same-Day' : ''}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>

                          <View style={styles.formActionsRow}>
                            <TouchableOpacity
                              style={styles.cardActionBtn}
                              onPress={() => {
                                if (!newAddrStreet.trim()) {
                                  Alert.alert('Missing Street', 'Please enter your street address.');
                                  return;
                                }
                                const newEntry: AddressItem = {
                                  id: `addr-${Date.now()}`,
                                  label: newAddrLabel,
                                  isDefault: addresses.length === 0,
                                  name: newAddrName.trim() || 'John Luka',
                                  phone: newAddrPhone.trim() || '+234 803 123 4567',
                                  street: newAddrStreet.trim(),
                                  area: newAddrArea.trim() || 'Kaduna Central',
                                  city: newAddressCity,
                                  state: `${newAddressCity} State`,
                                  landmark: newAddrLandmark.trim(),
                                  isKadunaEligible: newAddressCity === 'Kaduna',
                                  instructions: newAddrInstructions.trim(),
                                };
                                setAddresses(prev => [...prev, newEntry]);
                                setShowAddAddressForm(false);
                                setNewAddrStreet('');
                                setNewAddrLandmark('');
                                setNewAddrInstructions('');
                                Alert.alert('Address Added', 'Your delivery address has been saved.');
                              }}
                            >
                              <Text style={styles.cardActionBtnText}>Save Address</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.cancelFormBtn}
                              onPress={() => setShowAddAddressForm(false)}
                            >
                              <Text style={styles.cancelFormBtnText}>Cancel</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  )}

                  {/* SUB-SCREEN 8: ACCOUNT MANAGEMENT */}
                  {accountSubScreen === 'account_management' && (
                    <View style={styles.subCard}>
                      <Text style={styles.subCardTitle}>Personal Details</Text>
                      <TextInput
                        style={styles.formInput}
                        defaultValue={userProfile.name}
                        placeholder="Full Name"
                        placeholderTextColor="#8C8279"
                        onChangeText={(t) => setUserProfile(prev => ({ ...prev, name: t }))}
                      />
                      <TextInput
                        style={styles.formInput}
                        defaultValue={userProfile.email}
                        placeholder="Email Address"
                        placeholderTextColor="#8C8279"
                        keyboardType="email-address"
                        onChangeText={(t) => setUserProfile(prev => ({ ...prev, email: t }))}
                      />
                      <TextInput
                        style={styles.formInput}
                        defaultValue={userProfile.phone}
                        placeholder="Phone Number"
                        placeholderTextColor="#8C8279"
                        keyboardType="phone-pad"
                        onChangeText={(t) => setUserProfile(prev => ({ ...prev, phone: t }))}
                      />

                      <View style={{ marginVertical: 10, height: 1, backgroundColor: '#E7D5BC' }} />
                      <Text style={styles.subCardTitle}>Security & Password</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="Current Password"
                        placeholderTextColor="#8C8279"
                        secureTextEntry
                      />
                      <TextInput
                        style={styles.formInput}
                        placeholder="New Password"
                        placeholderTextColor="#8C8279"
                        secureTextEntry
                      />

                      <TouchableOpacity
                        style={styles.cardActionBtn}
                        onPress={() => Alert.alert('Saved', 'Profile and security credentials updated.')}
                      >
                        <Text style={styles.cardActionBtnText}>Save Changes</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* SUB-SCREEN 9: CLOSE ACCOUNT (Functional NDPA Deletion) */}
                  {accountSubScreen === 'close_account' && (
                    <View style={styles.subCard}>
                      <Text style={styles.subCardTitle}>Close Customer Account</Text>
                      <Text style={styles.subCardSub}>
                        Under the Nigeria Data Protection Act (NDPA), you have the right to request full account erasure and removal of all transaction records.
                      </Text>
                      
                      <View style={styles.warningBox}>
                        <Text style={styles.warningBoxText}>
                          ⚠️ Warning: Closing your account will permanently delete:
                          {'\n'}• Your active Kaduna same-day order tracking
                          {'\n'}• Saved delivery addresses and payment profiles
                          {'\n'}• Unclaimed vouchers and loyalty tokens
                          {'\n'}• Escrow warranty dispute rights
                        </Text>
                      </View>

                      <Text style={styles.closeReasonLabel}>Please let us know why you are leaving:</Text>
                      <View style={styles.closeReasonPills}>
                        {[
                          'Found another platform',
                          'Moving outside Kaduna',
                          'Privacy concerns (NDPA)',
                          'Temporary break',
                          'Other',
                        ].map((r) => (
                          <TouchableOpacity
                            key={r}
                            style={[styles.closeReasonPill, closeReason === r && styles.closeReasonPillActive]}
                            onPress={() => setCloseReason(r)}
                          >
                            <Text style={[styles.closeReasonPillText, closeReason === r && styles.closeReasonPillTextActive]}>
                              {r}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <TouchableOpacity
                        style={styles.dangerBtn}
                        onPress={() =>
                          Alert.alert(
                            'Confirm Irreversible Account Deletion',
                            'Are you completely sure you want to permanently delete your account and all associated data under the Nigeria Data Protection Act?',
                            [
                              { text: 'Cancel', style: 'cancel' },
                              {
                                text: 'Permanently Close Account',
                                style: 'destructive',
                                onPress: () => {
                                  setIsLoggedIn(false);
                                  setCart({});
                                  setWishlist([]);
                                  setAccountSubScreen(null);
                                  Alert.alert(
                                    'Account Closed',
                                    'Your account and all associated personal data have been completely deleted in compliance with NDPA regulations.'
                                  );
                                },
                              },
                            ]
                          )
                        }
                      >
                        <Text style={styles.dangerBtnText}>Permanently Close My Account</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* SUB-SCREEN 10: NOTIFICATIONS */}
                  {accountSubScreen === 'notifications' && (
                    <View style={styles.subCard}>
                      <Text style={styles.subCardTitle}>Communication Preferences</Text>
                      
                      <View style={styles.toggleRow}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                          <Text style={styles.toggleTitle}>Order Status Updates (SMS)</Text>
                          <Text style={styles.toggleSub}>Receive SMS text alerts when your parcel is dispatched.</Text>
                        </View>
                        <Switch
                          value={notificationToggles.orderUpdates}
                          onValueChange={(v) => setNotificationToggles((prev) => ({ ...prev, orderUpdates: v }))}
                          trackColor={{ false: '#E7D5BC', true: '#B5532E' }}
                        />
                      </View>

                      <View style={styles.toggleRow}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                          <Text style={styles.toggleTitle}>Kaduna Same-Day Dispatch Alerts</Text>
                          <Text style={styles.toggleSub}>Instant push notification when a Kaduna delivery rider is en route.</Text>
                        </View>
                        <Switch
                          value={notificationToggles.kadunaSameDay}
                          onValueChange={(v) => setNotificationToggles((prev) => ({ ...prev, kadunaSameDay: v }))}
                          trackColor={{ false: '#E7D5BC', true: '#B5532E' }}
                        />
                      </View>

                      <View style={styles.toggleRow}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                          <Text style={styles.toggleTitle}>Verified Seller Flash Deals</Text>
                          <Text style={styles.toggleSub}>Exclusive vouchers and limited quantity weekend deals.</Text>
                        </View>
                        <Switch
                          value={notificationToggles.flashDeals}
                          onValueChange={(v) => setNotificationToggles((prev) => ({ ...prev, flashDeals: v }))}
                          trackColor={{ false: '#E7D5BC', true: '#B5532E' }}
                        />
                      </View>

                      <View style={styles.toggleRow}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                          <Text style={styles.toggleTitle}>WhatsApp Order Receipts</Text>
                          <Text style={styles.toggleSub}>Instant receipts and tracking links sent to your WhatsApp.</Text>
                        </View>
                        <Switch
                          value={notificationToggles.whatsapp}
                          onValueChange={(v) => setNotificationToggles((prev) => ({ ...prev, whatsapp: v }))}
                          trackColor={{ false: '#E7D5BC', true: '#B5532E' }}
                        />
                      </View>
                    </View>
                  )}

                  {/* SUB-SCREEN 11: PRIVACY POLICY */}
                  {accountSubScreen === 'privacy_policy' && (
                    <View style={styles.legalBody}>
                      <Text style={styles.legalHeading}>Nigeria Data Protection Regulation (NDPR) & NDPA</Text>
                      <Text style={styles.legalText}>
                        MANGA MARKETSQUARE protects your identity, delivery addresses, and payment tokens. All customer transactions are processed via 256-bit SSL encrypted PCI-DSS Level 1 certified infrastructure. We never sell your personal information to third parties.
                      </Text>
                      <Text style={styles.legalSubheading}>Data Collection & Rights</Text>
                      <Text style={styles.legalText}>
                        You have the right to request access, rectification, or complete deletion of your data via your Account &rarr; Close Account setting or by emailing privacy@manga.ng.
                      </Text>
                    </View>
                  )}

                  {/* SUB-SCREEN 12: TERMS OF SERVICE */}
                  {accountSubScreen === 'terms_of_service' && (
                    <View style={styles.legalBody}>
                      <Text style={styles.legalHeading}>Terms of Service</Text>
                      <Text style={styles.legalText}>
                        By purchasing on MANGA MARKETSQUARE, you agree to our verified seller standards and 7-day return terms.
                      </Text>
                      <Text style={styles.legalSubheading}>Verified Sellers Promise</Text>
                      <Text style={styles.legalText}>
                        All merchants must be identity-verified. Counterfeits and unauthorized goods result in immediate account termination.
                      </Text>
                      <Text style={styles.legalSubheading}>Delivery Terms</Text>
                      <Text style={styles.legalText}>
                        Same-day delivery is available for orders placed within Kaduna. Nationwide delivery is provided by certified couriers.
                      </Text>
                    </View>
                  )}

                  {/* SUB-SCREEN 13: BUYER PROTECTION */}
                  {accountSubScreen === 'buyer_protection' && (
                    <View style={styles.legalBody}>
                      <Text style={styles.legalHeading}>Buyer Protection Guarantee</Text>
                      <Text style={styles.legalText}>
                        Shop with complete confidence. Our buyer protection policy covers every order placed on the platform.
                      </Text>
                      <Text style={styles.legalSubheading}>1. Verified Marketplace Sellers</Text>
                      <Text style={styles.legalText}>
                        Every merchant undergoes thorough identity and registration checks before listing goods.
                      </Text>
                      <Text style={styles.legalSubheading}>2. Same-Day Delivery in Kaduna</Text>
                      <Text style={styles.legalText}>
                        Orders within Kaduna are prioritized for same-day delivery by local couriers.
                      </Text>
                      <Text style={styles.legalSubheading}>3. 7-Day Return Guarantee</Text>
                      <Text style={styles.legalText}>
                        If an item arrives damaged or defective, you are entitled to a full replacement or refund.
                      </Text>
                    </View>
                  )}

                  {/* SUB-SCREEN 14: RETURN POLICY */}
                  {accountSubScreen === 'return_policy' && (
                    <View style={styles.legalBody}>
                      <Text style={styles.legalHeading}>7-Day Hassle-Free Returns</Text>
                      <Text style={styles.legalText}>
                        Any item purchased from verified sellers may be returned within 7 calendar days of delivery if defective, damaged, or differing from description.
                      </Text>
                      <Text style={styles.legalSubheading}>Kaduna Doorstep Collection</Text>
                      <Text style={styles.legalText}>
                        For orders within Kaduna, our local courier can arrange doorstep pickup for eligible returns.
                      </Text>
                    </View>
                  )}

                </ScrollView>
              </View>
            )}
          </View>
        )}
      </View>

      {/* FLOATING BACK TO THE TOP BUTTON (Appears only when scrolling has commenced and ongoing) */}
      {showBackToTop && (activeTab === 'home' || activeTab === 'categories') && (
        <TouchableOpacity
          style={styles.floatingTopBtn}
          onPress={scrollToTop}
          activeOpacity={0.85}
        >
          <ArrowUpIcon size={18} color="#FAF6F0" />
        </TouchableOpacity>
      )}

      {/* =================================================================== */}
      {/* FLOATING iOS LIQUID GLASS E-COMMERCE NAVIGATION FOOTER              */}
      {/* =================================================================== */}
      <View style={styles.floatingFooterContainer} pointerEvents="box-none">
        <View
          style={styles.liquidGlassDock}
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            if (w > 0 && Math.abs(w - dockWidth) > 1) {
              setDockWidth(w);
            }
          }}
        >
          {/* Fluid Morphing Liquid Glass Selection Pill */}
          <Animated.View
            style={[
              styles.navIndicator,
              {
                width: slotWidth,
                transform: [
                  { translateX: indicatorTranslateX },
                  { scaleX: indicatorScaleX },
                  { scaleY: indicatorScaleY },
                ],
              },
            ]}
            pointerEvents="none"
          >
            <View style={styles.liquidBubble} />
          </Animated.View>

          {/* 1. Home */}
          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => switchMobileTab('home')}
            activeOpacity={0.85}
          >
            <View style={[styles.iconWrapper, activeTab === 'home' && styles.iconWrapperActive]}>
              <HomeIcon
                size={21}
                color={activeTab === 'home' ? '#B5532E' : '#8C8279'}
                strokeWidth={activeTab === 'home' ? 2.35 : 1.8}
              />
            </View>
            <Text style={[styles.dockLabel, activeTab === 'home' && styles.dockLabelActive]}>
              Home
            </Text>
          </TouchableOpacity>

          {/* 2. Categories */}
          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => switchMobileTab('categories')}
            activeOpacity={0.85}
          >
            <View style={[styles.iconWrapper, activeTab === 'categories' && styles.iconWrapperActive]}>
              <LayoutGridIcon
                size={21}
                color={activeTab === 'categories' ? '#B5532E' : '#8C8279'}
                strokeWidth={activeTab === 'categories' ? 2.35 : 1.8}
              />
            </View>
            <Text style={[styles.dockLabel, activeTab === 'categories' && styles.dockLabelActive]}>
              Categories
            </Text>
          </TouchableOpacity>

          {/* 3. Cart (with animated counter badge) */}
          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => switchMobileTab('cart')}
            activeOpacity={0.85}
          >
            <View style={[styles.iconWrapper, activeTab === 'cart' && styles.iconWrapperActive]}>
              <ShoppingBagIcon
                size={21}
                color={activeTab === 'cart' ? '#B5532E' : '#8C8279'}
                strokeWidth={activeTab === 'cart' ? 2.35 : 1.8}
              />
              {cartTotalCount > 0 && (
                <Animated.View
                  style={[
                    styles.cartBadge,
                    { transform: [{ scale: cartBadgeScale }] },
                  ]}
                >
                  <Text style={styles.badgeText}>{cartTotalCount}</Text>
                </Animated.View>
              )}
            </View>
            <Text style={[styles.dockLabel, activeTab === 'cart' && styles.dockLabelActive]}>
              Cart
            </Text>
          </TouchableOpacity>

          {/* 4. Wishlist (with animated heart badge) */}
          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => switchMobileTab('wishlist')}
            activeOpacity={0.85}
          >
            <View style={[styles.iconWrapper, activeTab === 'wishlist' && styles.iconWrapperActive]}>
              <HeartIcon
                size={21}
                color={activeTab === 'wishlist' ? '#B5532E' : '#8C8279'}
                strokeWidth={activeTab === 'wishlist' ? 2.35 : 1.8}
                fill={activeTab === 'wishlist' ? 'rgba(181, 83, 46, 0.18)' : 'none'}
              />
              {wishlistCount > 0 && (
                <Animated.View
                  style={[
                    styles.wishlistBadge,
                    { transform: [{ scale: wishlistBadgeScale }] },
                  ]}
                >
                  <Text style={styles.badgeText}>{wishlistCount}</Text>
                </Animated.View>
              )}
            </View>
            <Text style={[styles.dockLabel, activeTab === 'wishlist' && styles.dockLabelActive]}>
              Wishlist
            </Text>
          </TouchableOpacity>

          {/* 5. Account */}
          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => switchMobileTab('account')}
            activeOpacity={0.85}
          >
            <View style={[styles.iconWrapper, activeTab === 'account' && styles.iconWrapperActive]}>
              <UserIcon
                size={21}
                color={activeTab === 'account' ? '#B5532E' : '#8C8279'}
                strokeWidth={activeTab === 'account' ? 2.35 : 1.8}
              />
            </View>
            <Text style={[styles.dockLabel, activeTab === 'account' && styles.dockLabelActive]}>
              Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL 1: PRODUCT DETAIL */}
      {selectedProduct && (
        <View style={styles.fullScreenOverlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedProduct(null)} style={styles.closeBtn}>
                <CloseIcon size={20} color="#2A2320" />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>Product Details</Text>
              <TouchableOpacity onPress={() => toggleWishlist(selectedProduct.id)}>
                <WishlistIcon
                  size={22}
                  color={wishlist.includes(selectedProduct.id) ? '#B5532E' : '#2A2320'}
                  fill={wishlist.includes(selectedProduct.id) ? '#B5532E' : 'none'}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.modalImageContainer}>
                <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
                <View style={styles.modalOfficialBadge}>
                  <Text style={styles.modalOfficialBadgeText}>Verified Authentic</Text>
                </View>
              </View>

              <View style={styles.modalContentPad}>
                <View style={styles.modalStoreRow}>
                  <Text style={styles.modalStoreName}>{selectedProduct.storeName}</Text>
                  <View style={styles.officialPill}>
                    <Text style={styles.officialPillText}>Verified Merchant</Text>
                  </View>
                </View>

                {/* 1. PRODUCT TITLE */}
                <Text style={styles.modalTitle}>{selectedProduct.title}</Text>

                {/* PRICING ROW */}
                <View style={styles.modalPriceRow}>
                  <Text style={styles.modalPrice}>{formatPrice(selectedProduct.priceNgn)}</Text>
                  {selectedProduct.compareAtNgn && (
                    <Text style={styles.modalComparePrice}>
                      {formatPrice(selectedProduct.compareAtNgn)}
                    </Text>
                  )}
                  {selectedProduct.compareAtNgn && selectedProduct.compareAtNgn > selectedProduct.priceNgn && (
                    <View style={styles.modalDiscountPill}>
                      <Text style={styles.modalDiscountPillText}>
                        Save {Math.round(((selectedProduct.compareAtNgn - selectedProduct.priceNgn) / selectedProduct.compareAtNgn) * 100)}%
                      </Text>
                    </View>
                  )}
                </View>

                {/* 2. ENGAGING HOOK / VALUE PROPOSITION */}
                {selectedProduct.hook && (
                  <View style={styles.modalHookBox}>
                    <Text style={styles.modalHookSparkle}>✦</Text>
                    <Text style={styles.modalHookText}>{selectedProduct.hook}</Text>
                  </View>
                )}

                {/* 8. TRUST SIGNALS, WARRANTY & KADUNA SHIPPING */}
                <View style={styles.modalTrustBox}>
                  <View style={styles.modalTrustItem}>
                    <ShieldCheckIcon size={16} color="#B5532E" />
                    <Text style={styles.modalTrustItemText}>Kaduna Same-Day Delivery: Under 4h within Kaduna</Text>
                  </View>
                  <View style={styles.modalTrustItem}>
                    <CheckIcon size={15} color="#4F6B3A" />
                    <Text style={styles.modalTrustItemText}>7-Day Free Returns & Replacement Guarantee</Text>
                  </View>
                  <View style={styles.modalTrustItem}>
                    <LockIcon size={15} color="#8F3B1F" />
                    <Text style={styles.modalTrustItemText}>100% Genuine Escrow Protection via Paystack</Text>
                  </View>
                </View>

                {/* 3. SCANNABLE BULLET POINTS (FEATURES & BENEFITS) */}
                {selectedProduct.scannableBenefits && selectedProduct.scannableBenefits.length > 0 && (
                  <View style={styles.modalSectionCard}>
                    <Text style={styles.modalSectionCardTitle}>Key Features & Real-World Benefits</Text>
                    {selectedProduct.scannableBenefits.map((b, i) => (
                      <View key={i} style={styles.modalBenefitRow}>
                        <Text style={styles.modalBenefitCheck}>✓</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.modalBenefitTitle}>{b.benefit}</Text>
                          <Text style={styles.modalBenefitDesc}>{b.explanation}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* 4. DETAILED NARRATIVE DESCRIPTION */}
                {selectedProduct.narrativeStory && (
                  <View style={styles.modalSectionCard}>
                    <Text style={styles.modalSectionCardTitle}>In-Use Story & Craftsmanship</Text>
                    <Text style={styles.modalStoryText}>{selectedProduct.narrativeStory}</Text>
                  </View>
                )}

                {/* 5. TECHNICAL SPECIFICATIONS (SPECS TABLE) */}
                {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                  <View style={styles.modalSectionCard}>
                    <Text style={styles.modalSectionCardTitle}>Technical Specifications</Text>
                    <View style={styles.specsTable}>
                      {selectedProduct.specs.map((s, i) => (
                        <View key={i} style={[styles.specsRow, i % 2 === 1 && styles.specsRowAlt]}>
                          <Text style={styles.specsLabel}>{s.label}</Text>
                          <Text style={styles.specsVal}>{s.value}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* 6. SIZING & FIT GUIDE */}
                {selectedProduct.sizingGuide && (
                  <View style={styles.modalSectionCard}>
                    <Text style={styles.modalSectionCardTitle}>Sizing & Fit Guide</Text>
                    <Text style={styles.sizingFitNotes}>
                      <Text style={{ fontWeight: '800', color: '#B5532E' }}>Fit Notes: </Text>
                      {selectedProduct.sizingGuide.fitNotes}
                    </Text>
                    {selectedProduct.sizingGuide.chart && (
                      <View style={styles.specsTable}>
                        {selectedProduct.sizingGuide.chart.map((c, i) => (
                          <View key={i} style={[styles.specsRow, i % 2 === 1 && styles.specsRowAlt]}>
                            <Text style={styles.specsLabel}>{c.label}</Text>
                            <Text style={styles.specsVal}>{c.metric} ({c.imperial || '-'})</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {/* 7. WHAT'S IN THE BOX */}
                {selectedProduct.boxContents && selectedProduct.boxContents.length > 0 && (
                  <View style={styles.modalSectionCard}>
                    <Text style={styles.modalSectionCardTitle}>What's in the Box</Text>
                    {selectedProduct.boxContents.map((b, i) => (
                      <View key={i} style={styles.boxContentItem}>
                        <Text style={styles.boxContentBullet}>✓</Text>
                        <Text style={styles.boxContentText}>{b}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* 10. SOCIAL PROOF & FREQUENTLY ASKED QUESTIONS (FAQ) */}
                {selectedProduct.faq && selectedProduct.faq.length > 0 && (
                  <View style={styles.modalSectionCard}>
                    <Text style={styles.modalSectionCardTitle}>Frequently Asked Questions</Text>
                    {selectedProduct.faq.map((f, i) => {
                      const isOpen = expandedFaqIdx === i;
                      return (
                        <TouchableOpacity
                          key={i}
                          style={styles.mobileFaqItem}
                          onPress={() => setExpandedFaqIdx(isOpen ? null : i)}
                          activeOpacity={0.8}
                        >
                          <View style={styles.mobileFaqHeader}>
                            <Text style={styles.mobileFaqQText}>
                              <Text style={{ color: '#B5532E', fontWeight: '800' }}>Q: </Text>
                              {f.question}
                            </Text>
                            <ChevronDownIcon size={16} color="#8C8279" />
                          </View>
                          {isOpen && (
                            <View style={styles.mobileFaqAnswerBox}>
                              <Text style={styles.mobileFaqAText}>
                                <Text style={{ color: '#4F6B3A', fontWeight: '800' }}>Answer: </Text>
                                {f.answer}
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {/* ACTION BUTTONS */}
                <View style={styles.modalActionsRow}>
                  <TouchableOpacity
                    style={styles.modalAddBtn}
                    onPress={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                      Alert.alert('Added to Bag', 'Item added to your shopping bag.');
                    }}
                  >
                    <Text style={styles.modalAddBtnText}>Add to Bag</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalBuyNowBtn}
                    onPress={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                      setIsCheckoutVisible(true);
                    }}
                  >
                    <Text style={styles.modalBuyNowBtnText}>Buy Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      )}

      {/* MODAL 2: CHECKOUT SECURE */}
      {isCheckoutVisible && (
        <View style={styles.fullScreenOverlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsCheckoutVisible(false)} style={styles.closeBtn}>
                <CloseIcon size={20} color="#2A2320" />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>Secure Checkout</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.modalContentPad}>
                <View style={styles.checkoutTrustCard}>
                  <ShieldCheckIcon size={20} color="#B5532E" />
                  <Text style={styles.checkoutTrustText}>
                    All sellers on MANGA MARKETSQUARE are verified. Same-day delivery is available for orders within Kaduna.
                  </Text>
                </View>

                <Text style={styles.checkoutSectionTitle}>Delivery Address</Text>
                <View style={styles.checkoutCard}>
                  <Text style={styles.checkoutName}>John Luka (+234 803 123 4567)</Text>
                  <Text style={styles.checkoutAddress}>
                    14 Isa Kaita Road, Malali, Kaduna, Kaduna State
                  </Text>
                </View>

                <Text style={styles.checkoutSectionTitle}>Payment Method</Text>
                <View style={styles.paymentOptionActive}>
                  <Text style={styles.paymentOptionTitle}>Paystack / Debit Card / Bank Transfer</Text>
                  <Text style={styles.paymentOptionSub}>256-bit SSL Encrypted Secure Payment</Text>
                </View>

                <View style={styles.summaryCard}>
                  <Text style={styles.summaryTitle}>Payable Total</Text>
                  <View style={styles.summaryRow}>
                    <Text style={styles.totalLabel}>Total with Delivery</Text>
                    <Text style={styles.totalValue}>{formatPrice(totalNgn)}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={() => {
                    setIsCheckoutVisible(false);
                    setCart({});
                    Alert.alert(
                      'Order Placed Successfully!',
                      'Order Ref: MNG-894120-E3A\nVerified seller has been notified for same-day dispatch.',
                      [{ text: 'View Orders', onPress: () => {
                        setActiveTab('account');
                        setAccountSubScreen('orders');
                      }}]
                    );
                  }}
                >
                  <Text style={styles.checkoutBtnText}>Pay & Place Order</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      )}

      {/* MODAL 3: ORDER DETAILS & TRACKING */}
      {selectedOrder && (
        <View style={styles.fullScreenOverlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedOrder(null)} style={styles.closeBtn}>
                <CloseIcon size={20} color="#2A2320" />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>Order Details</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.modalContentPad}>
                {/* Header Status Strip */}
                <View style={styles.orderDetailHeaderCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={styles.orderDetailRef}>{selectedOrder.orderNumber}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: selectedOrder.type === 'active' ? '#FEF3EB' : '#EDF7ED', borderColor: selectedOrder.statusColor }]}>
                      <Text style={[styles.statusBadgeText, { color: selectedOrder.statusColor }]}>{selectedOrder.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.orderDetailDate}>Date: {selectedOrder.date}</Text>
                  <View style={styles.escrowStatusBox}>
                    <ShieldCheckIcon size={16} color="#4F6B3A" />
                    <Text style={styles.escrowStatusText}>{selectedOrder.escrowStatus}</Text>
                  </View>
                </View>

                {/* Tracking Timeline */}
                <Text style={styles.checkoutSectionTitle}>Delivery Timeline</Text>
                <View style={styles.orderTimelineCard}>
                  {selectedOrder.timeline.map((step: any, idx: number) => (
                    <View key={idx} style={styles.timelineRow}>
                      <View style={styles.timelineIconCol}>
                        <View style={[styles.timelineDot, step.done ? styles.timelineDotDone : step.active ? styles.timelineDotActive : styles.timelineDotPending]}>
                          {step.done ? (
                            <CheckIcon size={12} color="#FFFFFF" />
                          ) : (
                            <Text style={{ fontSize: 9, color: step.active ? '#FFFFFF' : '#8C8279' }}>●</Text>
                          )}
                        </View>
                        {idx < selectedOrder.timeline.length - 1 && (
                          <View style={[styles.timelineLine, step.done && styles.timelineLineDone]} />
                        )}
                      </View>
                      <View style={styles.timelineContent}>
                        <Text style={[styles.timelineTitle, step.active && styles.timelineTitleActive]}>{step.title}</Text>
                        <Text style={styles.timelineDesc}>{step.desc}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Items Purchased */}
                <Text style={styles.checkoutSectionTitle}>Purchased Items ({selectedOrder.products.length})</Text>
                {selectedOrder.products.map((p: any, idx: number) => (
                  <View key={idx} style={styles.orderItemCardDetailed}>
                    <Image source={{ uri: p.image }} style={styles.orderDetailThumb} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.orderDetailProdTitle}>{p.title}</Text>
                      <Text style={styles.orderDetailStore}>{p.storeName}</Text>
                      <Text style={styles.orderDetailPrice}>{formatPrice(p.priceNgn)} • Qty: {p.qty}</Text>
                    </View>
                  </View>
                ))}

                {/* Shipping & Rider Details */}
                <Text style={styles.checkoutSectionTitle}>Delivery Information</Text>
                <View style={styles.checkoutCard}>
                  <Text style={styles.deliveryMethodBold}>{selectedOrder.deliveryType}</Text>
                  <Text style={styles.checkoutAddress}>{selectedOrder.deliveryAddress}</Text>
                  {selectedOrder.riderName ? (
                    <View style={styles.riderBox}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <UserIcon size={14} color="#B5532E" />
                        <Text style={styles.riderNameText}>Assigned Rider: {selectedOrder.riderName}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.callRiderBtn}
                        onPress={() => Alert.alert('Calling Rider', `Dialing ${selectedOrder.riderName} (${selectedOrder.riderPhone})...`)}
                      >
                        <PhoneIcon size={14} color="#FAF6F0" />
                        <Text style={styles.callRiderBtnText}>Call Rider</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>

                {/* Payment Breakdown */}
                <Text style={styles.checkoutSectionTitle}>Payment Details</Text>
                <View style={styles.summaryCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>{formatPrice(selectedOrder.totalNgn - 2500)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Delivery Fee</Text>
                    <Text style={styles.summaryValue}>₦2,500</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.totalLabel}>Total Paid (Secured)</Text>
                    <Text style={styles.totalValue}>{formatPrice(selectedOrder.totalNgn)}</Text>
                  </View>
                </View>

                {/* Action CTA */}
                <TouchableOpacity
                  style={styles.modalPrimaryBtn}
                  onPress={() => {
                    if (selectedOrder.type === 'active') {
                      Alert.alert('Live Tracking', 'Rider Ibrahim Danladi is 1.4km away on Isa Kaita Road, Malali.');
                    } else {
                      Alert.alert('Invoice Download', `Tax invoice for ${selectedOrder.orderNumber} saved to documents.`);
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalPrimaryBtnText}>
                    {selectedOrder.type === 'active' ? 'Track Live Rider Location' : 'Download Invoice & Receipt'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      )}

      {/* MODAL 4: INBOX MESSAGE DETAIL */}
      {selectedInboxMsg && (
        <View style={styles.fullScreenOverlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedInboxMsg(null)} style={styles.closeBtn}>
                <CloseIcon size={20} color="#2A2320" />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>Message Details</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.modalContentPad}>
                <View style={styles.inboxDetailHeader}>
                  <View style={styles.inboxCategoryTag}>
                    <Text style={styles.inboxCategoryTagText}>{selectedInboxMsg.tag}</Text>
                  </View>
                  <Text style={styles.inboxDetailTime}>{selectedInboxMsg.time}</Text>
                </View>

                <Text style={styles.inboxDetailTitle}>{selectedInboxMsg.title}</Text>
                
                <View style={styles.inboxDetailBodyBox}>
                  <Text style={styles.inboxDetailBodyText}>{selectedInboxMsg.fullContent}</Text>
                </View>

                {selectedInboxMsg.orderId ? (
                  <TouchableOpacity
                    style={styles.modalPrimaryBtn}
                    onPress={() => {
                      const matchedOrder = orders.find(o => o.id === selectedInboxMsg.orderId);
                      setSelectedInboxMsg(null);
                      if (matchedOrder) {
                        setSelectedOrder(matchedOrder);
                      }
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalPrimaryBtnText}>View Dispatched Order</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.modalPrimaryBtn}
                    onPress={() => {
                      setSelectedInboxMsg(null);
                      if (selectedInboxMsg.actionText === 'Explore Flash Deals') {
                        setAccountSubScreen(null);
                        setActiveTab('home');
                      } else if (selectedInboxMsg.actionText === 'View Store') {
                        setAccountSubScreen(null);
                        setActiveTab('categories');
                      }
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalPrimaryBtnText}>{selectedInboxMsg.actionText || 'Close'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      )}

      {/* MODAL 5: LOGOUT CONFIRMATION */}
      {showLogoutConfirm && (
        <View style={styles.fullScreenOverlay}>
          <View style={styles.logoutModalSheet}>
            <View style={styles.logoutIconCircle}>
              <UserIcon size={24} color="#B5532E" />
            </View>
            <Text style={styles.logoutModalTitle}>Sign Out of Manga?</Text>
            <Text style={styles.logoutModalSub}>
              You are signed in as {userProfile.name} ({userProfile.email}). Signing out will pause your active session.
            </Text>
            <TouchableOpacity
              style={styles.confirmLogoutBtn}
              onPress={() => {
                setIsLoggedIn(false);
                setAccountSubScreen(null);
                setShowLogoutConfirm(false);
                setAuthStep('signin');
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmLogoutBtnText}>Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelLogoutBtn}
              onPress={() => setShowLogoutConfirm(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.cancelLogoutBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#FAF6F0', // Ivory page background extends through home indicator
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FAF6F0', // Ivory page background
  },
  scrollContent: {
    paddingBottom: 130, // Space for bottom dock and comfortable scrolling clearance
  },

  /* HEADER & BRAND BAR */
  header: {
    backgroundColor: '#2A2320',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3E3430',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#B5532E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconText: {
    color: '#FAF6F0',
    fontSize: 16,
    fontWeight: '900',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FAF6F0',
    letterSpacing: 1.2,
    lineHeight: 20,
  },
  brandSubtitle: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#D9A441',
    letterSpacing: 2,
    marginTop: 1,
  },
  trustTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(217, 164, 65, 0.15)',
    borderWidth: 1,
    borderColor: '#D9A441',
  },
  trustTagText: {
    color: '#D9A441',
    fontSize: 10,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 38,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#2A2320',
    paddingVertical: 0,
  },

  /* HERO BANNER */
  heroBanner: {
    backgroundColor: '#B5532E',
    margin: 14,
    borderRadius: 14,
    padding: 16,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: '#FAF6F0',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#FAF6F0',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  heroSub: {
    color: '#F6EDE0',
    fontSize: 12,
    lineHeight: 16,
  },

  /* SECTION HEADERS */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2A2320',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B5532E',
  },
  itemCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8C8279',
  },

  /* CATEGORY PILLS */
  categoryScroll: {
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7D5BC',
    marginHorizontal: 4,
  },
  categoryPillActive: {
    backgroundColor: '#B5532E',
    borderColor: '#B5532E',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A3E39',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* FLASH SALES ROW */
  flashBanner: {
    backgroundColor: '#C85A32', // Standout warm brand terracotta-orange
    marginHorizontal: 14,
    marginBottom: 14,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#C85A32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  flashHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  flashTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flashIconText: {
    fontSize: 16,
  },
  flashTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  timerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  timerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  flashRow: {
    flexDirection: 'row',
  },
  flashCard: {
    width: 140,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  flashImage: {
    width: '100%',
    height: 90,
    borderRadius: 6,
    marginBottom: 6,
  },
  discountTag: {
    backgroundColor: '#B5532E',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  discountTagText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  flashProdTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2A2320',
  },
  flashProdPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B5532E',
    marginTop: 2,
  },

  /* OFFICIAL MALL STRIP */
  officialMallBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2A2320',
    marginHorizontal: 14,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  officialMallText: {
    color: '#FAF6F0',
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },

  /* 2-COLUMN GRID */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  card: {
    width: (width - 32) / 2,
    marginHorizontal: 3,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 140,
    backgroundColor: '#F6EDE0',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  officialBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#2A2320',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  officialBadgeText: {
    color: '#FAF6F0',
    fontSize: 9,
    fontWeight: '800',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255,255,255,0.85)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 10,
  },
  cardStore: {
    fontSize: 10,
    color: '#8C8279',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2A2320',
    height: 32,
    lineHeight: 16,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 4,
  },
  starText: {
    color: '#D9A441',
    fontSize: 11,
  },
  ratingScore: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2A2320',
  },
  reviewsCount: {
    fontSize: 9,
    color: '#8C8279',
  },
  priceContainer: {
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '900',
    color: '#B5532E',
  },
  addBtn: {
    backgroundColor: '#FAF6F0',
    borderWidth: 1,
    borderColor: '#B5532E',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#B5532E',
    fontSize: 11,
    fontWeight: '800',
  },

  /* BACK TO TOP INLINE BAR */
  backToTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7D5BC',
  },
  backToTopBarText: {
    color: '#B5532E',
    fontSize: 12,
    fontWeight: '700',
  },

  /* HOME FOOTER STRIP */
  homeFooterStrip: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 4,
  },
  homeFooterCopyright: {
    fontSize: 10,
    color: '#8C8279',
  },

  /* FLOATING TOP BUTTON */
  floatingTopBtn: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 116 : 100,
    right: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#B5532E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2A2320',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 50,
  },

  /* CATEGORIES TAB */
  catHeaderBanner: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7D5BC',
  },
  catHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2A2320',
    marginBottom: 4,
  },
  catHeaderSub: {
    fontSize: 12,
    color: '#8C8279',
  },
  catList: {
    marginHorizontal: 14,
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    overflow: 'hidden',
  },
  catListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E2CB',
  },
  catListItemSelected: {
    backgroundColor: '#FEF7ED',
  },
  catListItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  catBulletSquare: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#B5532E',
  },
  catListItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2A2320',
  },
  catListItemSub: {
    fontSize: 11,
    color: '#8C8279',
    marginTop: 2,
  },

  /* CART & WISHLIST SCREENS */
  screenTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2A2320',
  },
  screenItemCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8C8279',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2A2320',
    marginTop: 16,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12,
    color: '#8C8279',
    textAlign: 'center',
    maxWidth: 240,
    marginBottom: 20,
    lineHeight: 18,
  },
  primaryActionButton: {
    backgroundColor: '#B5532E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    padding: 10,
    gap: 10,
  },
  cartItemImage: {
    width: 85,
    height: 85,
    borderRadius: 8,
    backgroundColor: '#F6EDE0',
  },
  cartItemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cartItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2A2320',
    lineHeight: 16,
  },
  cartItemStore: {
    fontSize: 10,
    color: '#8C8279',
  },
  cartItemPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: '#B5532E',
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF6F0',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E7D5BC',
  },
  stepBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stepBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2A2320',
  },
  stepVal: {
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 6,
    color: '#2A2320',
  },
  cartTrashBtn: {
    padding: 6,
  },
  wishlistActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  moveToBagBtn: {
    backgroundColor: '#B5532E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  moveToBagBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  removeWishBtn: {
    padding: 6,
  },

  /* PROMO CARD */
  promoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    padding: 12,
  },
  promoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2A2320',
    marginBottom: 6,
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    backgroundColor: '#FAF6F0',
    borderWidth: 1,
    borderColor: '#E7D5BC',
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#2A2320',
    height: 36,
  },
  promoBtn: {
    backgroundColor: '#2A2320',
    borderRadius: 6,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  promoBtnText: {
    color: '#FAF6F0',
    fontSize: 12,
    fontWeight: '700',
  },
  promoSuccessText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F6B3A',
    marginTop: 6,
  },

  /* SUMMARY CARD */
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginBottom: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    padding: 14,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2A2320',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B5E57',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2A2320',
  },
  discountLabel: {
    fontSize: 12,
    color: '#4F6B3A',
    fontWeight: '600',
  },
  discountValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F6B3A',
  },
  freeBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F6B3A',
    backgroundColor: '#F0F6EE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E7D5BC',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2A2320',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#B5532E',
  },
  checkoutBtn: {
    backgroundColor: '#B5532E',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  /* OPTION A: DEDICATED BRAND ACCOUNT HEADER & PROFILE */
  accountHeader: {
    backgroundColor: '#2A2320',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#3E3430',
  },
  accountHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accountTitleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(250, 246, 240, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(250, 246, 240, 0.16)',
  },
  accountTitleBadgeText: {
    color: '#FAF6F0',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  accountBellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C85A32',
    borderWidth: 1.5,
    borderColor: '#2A2320',
  },
  accountProfileCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  accountAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  accountAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#B5532E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B5532E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  accountAvatarText: {
    color: '#FAF6F0',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  accountInfo: {
    flex: 1,
  },
  accountNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  accountWelcomeText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2A2320',
  },
  memberPill: {
    backgroundColor: 'rgba(217, 164, 65, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D9A441',
  },
  memberPillText: {
    color: '#B5532E',
    fontSize: 9.5,
    fontWeight: '700',
  },
  accountEmailText: {
    fontSize: 13,
    color: '#8C8279',
  },
  accountStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF6F0',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#F0E6D8',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B5532E',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6E6259',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E7D5BC',
  },
  accountMenuGroup: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
  },
  accountMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F0F0',
  },
  accountMenuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  accountMenuLabel: {
    fontSize: 15,
    color: '#1C1C1E',
    fontWeight: '400',
  },
  accountMenuLabelSimple: {
    fontSize: 15,
    color: '#1C1C1E',
    fontWeight: '400',
  },
  settingsSectionHeader: {
    backgroundColor: '#F6F6F8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
  },
  settingsSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A4A4A',
  },
  logoutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: 16,
    marginBottom: 32,
    backgroundColor: '#F6F6F8',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
  },
  logoutButtonText: {
    color: '#F68B1E',
    fontSize: 15,
    fontWeight: '600',
  },

  /* SUB-SCREEN NAVIGATION BAR (2026 Standards) */
  subScreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E7D5BC',
  },
  subScreenBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingRight: 8,
  },
  subScreenBackText: {
    fontSize: 13,
    color: '#2A2320',
    fontWeight: '600',
  },
  subScreenTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2A2320',
  },
  subScreenContent: {
    padding: 14,
    paddingBottom: 120,
  },

  /* SUB-SCREEN COMPONENTS */
  subCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    padding: 14,
    marginBottom: 12,
  },
  subCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2A2320',
    marginBottom: 4,
  },
  subCardSub: {
    fontSize: 12,
    color: '#8C8279',
    marginBottom: 10,
    lineHeight: 16,
  },
  orderFilterPills: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7D5BC',
  },
  filterPillActive: {
    backgroundColor: '#B5532E',
    borderColor: '#B5532E',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A3E39',
  },
  filterPillTextActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderRefNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B5532E',
  },
  kadunaPill: {
    backgroundColor: '#FEF7ED',
    borderWidth: 1,
    borderColor: '#F3E2CB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  kadunaPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B5532E',
  },
  orderItemRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  orderThumb: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#F6EDE0',
  },
  orderItemName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2A2320',
  },
  orderItemVendor: {
    fontSize: 10,
    color: '#8C8279',
    marginTop: 2,
  },
  orderItemPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B5532E',
    marginTop: 4,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAF6F0',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  stepDone: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4F6B3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTextDone: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F6B3A',
  },
  stepArrow: {
    fontSize: 10,
    color: '#8C8279',
  },
  stepActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#B5532E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActiveText: {
    color: '#FFFFFF',
    fontSize: 8,
  },
  stepTextActive: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B5532E',
  },
  cardActionBtn: {
    backgroundColor: '#FAF6F0',
    borderWidth: 1,
    borderColor: '#B5532E',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cardActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B5532E',
  },

  /* INBOX ITEM */
  inboxItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  inboxIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inboxTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inboxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2A2320',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B5532E',
  },
  inboxBody: {
    fontSize: 11,
    color: '#6B5E57',
    marginTop: 2,
    lineHeight: 16,
  },
  inboxTime: {
    fontSize: 10,
    color: '#8C8279',
    marginTop: 4,
  },

  /* REVIEWS */
  reviewItemPad: {
    paddingTop: 8,
  },
  starPickerRow: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: 10,
  },
  successBox: {
    backgroundColor: '#F0F6EE',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D2E4CC',
    alignItems: 'center',
  },
  successBoxText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F6B3A',
  },

  /* VOUCHERS */
  voucherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    padding: 14,
    marginBottom: 10,
  },
  voucherPill: {
    backgroundColor: '#FEF7ED',
    borderWidth: 1,
    borderColor: '#F3E2CB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  voucherPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B5532E',
  },
  voucherTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2A2320',
  },
  voucherDesc: {
    fontSize: 11,
    color: '#8C8279',
    marginTop: 2,
  },
  voucherExp: {
    fontSize: 10,
    color: '#8C8279',
    marginTop: 4,
  },
  voucherCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FAF6F0',
    borderWidth: 1,
    borderColor: '#B5532E',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 10,
  },
  voucherCopyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B5532E',
  },

  /* SELLERS */
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    padding: 12,
    marginBottom: 8,
  },
  sellerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  sellerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2A2320',
  },
  verifiedTag: {
    backgroundColor: '#F0F6EE',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  verifiedTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4F6B3A',
  },
  sellerRating: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D9A441',
    marginTop: 2,
  },
  sellerNote: {
    fontSize: 10,
    color: '#8C8279',
    marginTop: 2,
  },
  followingBtn: {
    backgroundColor: '#2A2320',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  followingBtnText: {
    color: '#FAF6F0',
    fontSize: 11,
    fontWeight: '700',
  },

  /* ADDRESS */
  addressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  addressTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2A2320',
  },
  addressName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2A2320',
  },
  addressLine: {
    fontSize: 11,
    color: '#6B5E57',
    marginTop: 2,
    lineHeight: 16,
  },
  formInput: {
    backgroundColor: '#FAF6F0',
    borderWidth: 1,
    borderColor: '#E7D5BC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#2A2320',
    marginBottom: 8,
  },
  cityPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  cityPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FAF6F0',
    borderWidth: 1,
    borderColor: '#E7D5BC',
  },
  cityPillActive: {
    backgroundColor: '#B5532E',
    borderColor: '#B5532E',
  },
  cityPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4A3E39',
  },
  cityPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* NOTIFICATIONS */
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E2CB',
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2A2320',
  },
  toggleSub: {
    fontSize: 11,
    color: '#8C8279',
    marginTop: 2,
    lineHeight: 15,
  },

  /* WARNING & DANGER */
  warningBox: {
    backgroundColor: '#FDF2F2',
    borderWidth: 1,
    borderColor: '#F8B4B4',
    padding: 10,
    borderRadius: 8,
    marginVertical: 12,
  },
  warningBoxText: {
    fontSize: 11,
    color: '#9B1C1C',
    lineHeight: 16,
  },
  dangerBtn: {
    backgroundColor: '#9B1C1C',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  /* =================================================================== */
  /* FLOATING iOS LIQUID GLASS NAVIGATION FOOTER DOCK                    */
  /* =================================================================== */
  floatingFooterContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
    paddingTop: 8,
    alignItems: 'center',
    zIndex: 40,
  },
  liquidGlassDock: {
    width: '100%',
    maxWidth: 420,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.72)' : 'rgba(255, 255, 255, 0.90)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    padding: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 40,
    elevation: 12,
  },
  navIndicator: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    left: 6,
    padding: 2,
    zIndex: 0,
  },
  liquidBubble: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F6EDE0',
    shadowColor: '#B5532E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  dockItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderRadius: 24,
    zIndex: 1,
  },
  iconWrapper: {
    position: 'relative',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    transform: [{ translateY: -1 }, { scale: 1.08 }],
  },
  dockLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#8C8279',
    marginTop: 2,
    letterSpacing: -0.2,
  },
  dockLabelActive: {
    color: '#B5532E',
    fontWeight: '700',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    backgroundColor: '#B5532E',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  wishlistBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    backgroundColor: '#B3261E',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 11,
  },

  /* FULL SCREEN OVERLAYS */
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FAF6F0',
    zIndex: 999,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FAF6F0',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E7D5BC',
    backgroundColor: '#FFFFFF',
  },
  closeBtn: {
    padding: 4,
  },
  modalHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2A2320',
  },
  modalBody: {
    flex: 1,
  },
  modalImageContainer: {
    position: 'relative',
    width: '100%',
  },
  modalImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#F6EDE0',
    resizeMode: 'cover',
  },
  modalOfficialBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#B5532E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: '#2A2320',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalOfficialBadgeText: {
    color: '#FAF6F0',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalContentPad: {
    padding: 16,
    paddingBottom: 40,
  },
  modalStoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  modalStoreName: {
    fontSize: 12,
    color: '#8C8279',
    fontWeight: '600',
  },
  officialPill: {
    backgroundColor: '#F0F6EE',
    borderWidth: 1,
    borderColor: '#D2E4CC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  officialPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4F6B3A',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2A2320',
    lineHeight: 24,
    marginBottom: 10,
  },
  modalPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
  },
  modalPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#B5532E',
  },
  modalComparePrice: {
    fontSize: 14,
    color: '#8C8279',
    textDecorationLine: 'line-through',
  },
  modalDiscountPill: {
    backgroundColor: '#B3261E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 6,
  },
  modalDiscountPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  modalHookBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#F3E2CB',
    padding: 12,
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#D9A441',
  },
  modalHookSparkle: {
    color: '#B5532E',
    fontSize: 14,
    fontWeight: '800',
  },
  modalHookText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#2A2320',
    lineHeight: 18,
  },
  modalTrustBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    marginVertical: 10,
    gap: 8,
  },
  modalTrustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTrustItemText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2A2320',
    flex: 1,
  },
  modalSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    marginVertical: 8,
  },
  modalSectionCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2A2320',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E2CB',
    paddingBottom: 6,
  },
  modalBenefitRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  modalBenefitCheck: {
    color: '#4F6B3A',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  modalBenefitTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2A2320',
  },
  modalBenefitDesc: {
    fontSize: 11,
    color: '#665C54',
    marginTop: 1,
    lineHeight: 16,
  },
  modalStoryText: {
    fontSize: 12,
    color: '#4A3E39',
    lineHeight: 18,
  },
  specsTable: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E7D5BC',
  },
  specsRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  specsRowAlt: {
    backgroundColor: '#FAF6F0',
  },
  specsLabel: {
    width: '42%',
    fontSize: 11,
    fontWeight: '700',
    color: '#8C8279',
  },
  specsVal: {
    width: '58%',
    fontSize: 11,
    fontWeight: '600',
    color: '#2A2320',
  },
  sizingFitNotes: {
    fontSize: 11.5,
    color: '#2A2320',
    marginBottom: 8,
    lineHeight: 16,
  },
  boxContentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  boxContentBullet: {
    color: '#4F6B3A',
    fontSize: 12,
    fontWeight: '800',
  },
  boxContentText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#2A2320',
  },
  mobileFaqItem: {
    backgroundColor: '#FAF6F0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    padding: 10,
    marginBottom: 8,
  },
  mobileFaqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mobileFaqQText: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2A2320',
    paddingRight: 6,
  },
  mobileFaqAnswerBox: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E7D5BC',
  },
  mobileFaqAText: {
    fontSize: 11,
    color: '#665C54',
    lineHeight: 16,
  },
  modalTrustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F6EE',
    borderWidth: 1,
    borderColor: '#D2E4CC',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  modalTrustText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F6B3A',
    flex: 1,
  },
  specBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7D5BC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 18,
  },
  specTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2A2320',
    marginBottom: 6,
  },
  specItem: {
    fontSize: 12,
    color: '#4A3E39',
    marginBottom: 4,
    lineHeight: 18,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalAddBtn: {
    flex: 1,
    backgroundColor: '#FAF6F0',
    borderWidth: 1,
    borderColor: '#B5532E',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalAddBtnText: {
    color: '#B5532E',
    fontSize: 13,
    fontWeight: '800',
  },
  modalBuyNowBtn: {
    flex: 1,
    backgroundColor: '#B5532E',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBuyNowBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  /* CHECKOUT MODAL */
  checkoutTrustCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF7ED',
    borderWidth: 1,
    borderColor: '#F3E2CB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  checkoutTrustText: {
    fontSize: 11,
    color: '#8F3B1F',
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  checkoutSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2A2320',
    marginBottom: 6,
  },
  checkoutCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7D5BC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  checkoutName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2A2320',
    marginBottom: 2,
  },
  checkoutAddress: {
    fontSize: 12,
    color: '#6B5E57',
    lineHeight: 16,
  },
  paymentOptionActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#B5532E',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  paymentOptionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B5532E',
  },
  paymentOptionSub: {
    fontSize: 11,
    color: '#8C8279',
    marginTop: 2,
  },

  /* LEGAL BODY */
  legalBody: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7D5BC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  legalHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2A2320',
    marginBottom: 8,
  },
  legalSubheading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B5532E',
    marginTop: 14,
    marginBottom: 4,
  },
  legalText: {
    fontSize: 13,
    color: '#4A3E39',
    lineHeight: 20,
  },

  /* AUTHENTICATION & GUEST PORTAL */
  authCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  authLogoBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandIconLarge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#B5532E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#B5532E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  brandIconLargeText: {
    color: '#FAF6F0',
    fontSize: 26,
    fontWeight: '900',
  },
  authTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2A2320',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  authSub: {
    fontSize: 12,
    color: '#8C8279',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  authForm: {
    gap: 12,
  },
  authField: {
    gap: 4,
  },
  authLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A3E39',
  },
  authInput: {
    backgroundColor: '#FAF6F0',
    borderWidth: 1,
    borderColor: '#E7D5BC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2A2320',
  },
  authPrimaryBtn: {
    backgroundColor: '#B5532E',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 6,
  },
  authPrimaryBtnText: {
    color: '#FAF6F0',
    fontSize: 14,
    fontWeight: '800',
  },
  authToggleBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  authToggleText: {
    color: '#8C8279',
    fontSize: 12,
    fontWeight: '600',
  },
  guestSupportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    gap: 12,
  },
  guestSupportTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2A2320',
    marginBottom: 4,
  },
  guestSupportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  guestSupportItemText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#4A3E39',
  },

  /* INBOX UNREAD COUNT BADGE */
  unreadCountBadge: {
    backgroundColor: '#B5532E',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCountBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  /* ORDER ENHANCEMENTS */
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  orderDateSub: {
    fontSize: 10,
    color: '#8C8279',
    marginTop: 2,
  },
  completedBadgeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EDF7ED',
    padding: 8,
    borderRadius: 6,
    marginVertical: 8,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F6B3A',
  },
  orderCardFooterAction: {
    borderTopWidth: 1,
    borderTopColor: '#F3E2CB',
    paddingTop: 8,
    marginTop: 8,
  },
  viewDetailsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B5532E',
    textAlign: 'right',
  },

  /* INBOX DETAIL & OPENING */
  inboxItemUnread: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 3,
    borderLeftColor: '#B5532E',
  },
  inboxCategoryTag: {
    backgroundColor: 'rgba(181, 83, 46, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  inboxCategoryTagText: {
    color: '#B5532E',
    fontSize: 9,
    fontWeight: '700',
  },
  inboxMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  inboxTapToOpen: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B5532E',
  },
  inboxDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inboxDetailTime: {
    fontSize: 11,
    color: '#8C8279',
  },
  inboxDetailTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#2A2320',
    marginBottom: 12,
    lineHeight: 22,
  },
  inboxDetailBodyBox: {
    backgroundColor: '#FAF6F0',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    marginBottom: 16,
  },
  inboxDetailBodyText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#4A3E39',
  },

  /* FOLLOWED SELLERS ENHANCED */
  sellerCardEnhanced: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    padding: 14,
    marginBottom: 12,
  },
  sellerHeaderRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  sellerAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#B5532E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerAvatarText: {
    color: '#FAF6F0',
    fontSize: 18,
    fontWeight: '900',
  },
  officialBadgeMini: {
    backgroundColor: '#2A2320',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  officialBadgeMiniText: {
    color: '#FAF6F0',
    fontSize: 9,
    fontWeight: '700',
  },
  sellerStatsLine: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8C8279',
    marginTop: 2,
  },
  sellerProductShowcase: {
    borderTopWidth: 1,
    borderTopColor: '#F3E2CB',
    paddingTop: 10,
    marginBottom: 10,
  },
  sellerShowcaseLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2A2320',
    marginBottom: 8,
  },
  sellerProductRail: {
    flexDirection: 'row',
  },
  sellerProdMiniCard: {
    width: 100,
    marginRight: 10,
    backgroundColor: '#FAF6F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    padding: 6,
    alignItems: 'center',
  },
  sellerProdMiniImg: {
    width: 86,
    height: 60,
    borderRadius: 6,
    resizeMode: 'cover',
    marginBottom: 4,
  },
  sellerProdMiniTitle: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#2A2320',
    width: '100%',
  },
  sellerProdMiniPrice: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B5532E',
    marginTop: 2,
    width: '100%',
  },
  sellerActionsRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3E2CB',
    paddingTop: 10,
  },
  visitStoreBtn: {
    flex: 1,
    backgroundColor: '#FAF6F0',
    borderWidth: 1,
    borderColor: '#E7D5BC',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  visitStoreBtnText: {
    color: '#2A2320',
    fontSize: 11.5,
    fontWeight: '700',
  },
  followingToggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FEF3EB',
    borderWidth: 1,
    borderColor: '#F3E2CB',
    alignItems: 'center',
  },
  followingToggleBtnText: {
    color: '#B5532E',
    fontSize: 11.5,
    fontWeight: '700',
  },
  followBtnActive: {
    backgroundColor: '#B5532E',
    borderColor: '#B5532E',
  },
  followBtnActiveText: {
    color: '#FAF6F0',
  },

  /* RECENTLY VIEWED GRID */
  recentlyViewedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recentCard: {
    width: (width - 40) / 2,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    overflow: 'hidden',
  },
  recentImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 140,
    backgroundColor: '#F6EDE0',
    overflow: 'hidden',
  },

  /* ADDRESS BOOK PROFESSIONAL */
  subCardDefaultAddress: {
    borderColor: '#B5532E',
    borderWidth: 1.5,
  },
  defaultAddressPill: {
    backgroundColor: '#EDF7ED',
    borderWidth: 1,
    borderColor: '#C3E6CB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultAddressPillText: {
    color: '#2E7D32',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  addressBody: {
    marginVertical: 8,
    gap: 4,
  },
  addressLineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressNameBold: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2A2320',
  },
  addressPhoneText: {
    fontSize: 12,
    color: '#6B5E57',
  },
  addressStreetText: {
    fontSize: 12,
    color: '#4A3E39',
    lineHeight: 16,
    flex: 1,
  },
  addressLandmarkText: {
    fontSize: 11,
    color: '#8C8279',
    fontStyle: 'italic',
    marginLeft: 22,
  },
  deliveryNoteBox: {
    backgroundColor: '#FAF6F0',
    borderRadius: 6,
    padding: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#F0E6D8',
  },
  deliveryNoteText: {
    fontSize: 11,
    color: '#6E6259',
  },
  addressActionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3E2CB',
    paddingTop: 8,
    marginTop: 4,
  },
  setDefaultBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#B5532E',
  },
  setDefaultBtnText: {
    color: '#B5532E',
    fontSize: 11,
    fontWeight: '700',
  },
  deleteAddrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteAddrBtnText: {
    color: '#B5532E',
    fontSize: 11,
    fontWeight: '700',
  },
  addressTypePillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  addrTypePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    backgroundColor: '#FAF6F0',
  },
  addrTypePillActive: {
    backgroundColor: '#B5532E',
    borderColor: '#B5532E',
  },
  addrTypePillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#4A3E39',
  },
  addrTypePillTextActive: {
    color: '#FAF6F0',
    fontWeight: '700',
  },
  formActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  cancelFormBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelFormBtnText: {
    color: '#8C8279',
    fontSize: 12,
    fontWeight: '700',
  },

  /* CLOSE ACCOUNT REASON PILLS */
  closeReasonLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2A2320',
    marginBottom: 8,
    marginTop: 10,
  },
  closeReasonPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  closeReasonPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FAF6F0',
    borderWidth: 1,
    borderColor: '#E7D5BC',
  },
  closeReasonPillActive: {
    backgroundColor: '#FEF3EB',
    borderColor: '#B5532E',
  },
  closeReasonPillText: {
    fontSize: 11,
    color: '#6E6259',
  },
  closeReasonPillTextActive: {
    color: '#B5532E',
    fontWeight: '700',
  },

  /* ORDER DETAIL MODAL STYLES */
  orderDetailHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    marginBottom: 14,
  },
  orderDetailRef: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2A2320',
  },
  orderDetailDate: {
    fontSize: 11,
    color: '#8C8279',
    marginBottom: 8,
  },
  escrowStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F6EE',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D2E4CC',
  },
  escrowStatusText: {
    fontSize: 10.5,
    color: '#4F6B3A',
    fontWeight: '700',
    flex: 1,
  },
  orderTimelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    marginBottom: 14,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineIconCol: {
    alignItems: 'center',
    width: 20,
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  timelineDotDone: {
    backgroundColor: '#4F6B3A',
  },
  timelineDotActive: {
    backgroundColor: '#C85A32',
  },
  timelineDotPending: {
    backgroundColor: '#E7D5BC',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E7D5BC',
    marginVertical: 2,
  },
  timelineLineDone: {
    backgroundColor: '#4F6B3A',
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 14,
  },
  timelineTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2A2320',
  },
  timelineTitleActive: {
    color: '#C85A32',
    fontWeight: '800',
  },
  timelineDesc: {
    fontSize: 11,
    color: '#8C8279',
    marginTop: 1,
  },
  orderItemCardDetailed: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E7D5BC',
    marginBottom: 10,
  },
  orderDetailThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  orderDetailProdTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2A2320',
  },
  orderDetailStore: {
    fontSize: 11,
    color: '#8C8279',
    marginTop: 2,
  },
  orderDetailPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B5532E',
    marginTop: 4,
  },
  deliveryMethodBold: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#2A2320',
    marginBottom: 2,
  },
  riderBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF6F0',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F3E2CB',
  },
  riderNameText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2A2320',
  },
  callRiderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#B5532E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  callRiderBtnText: {
    color: '#FAF6F0',
    fontSize: 10.5,
    fontWeight: '800',
  },
  modalPrimaryBtn: {
    backgroundColor: '#B5532E',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  modalPrimaryBtnText: {
    color: '#FAF6F0',
    fontSize: 13.5,
    fontWeight: '800',
  },

  /* AUTHENTICATION & EMAIL VERIFICATION STYLES */
  authToggleTextBold: {
    color: '#B5532E',
    fontWeight: '800',
  },
  stepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3E2CB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8F3B1F',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  otpIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3E2CB',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  targetEmailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7D5BC',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  targetEmailText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2A2320',
  },
  changeEmailText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B5532E',
  },
  demoOtpCallout: {
    backgroundColor: '#FFF8F0',
    borderWidth: 1,
    borderColor: '#D9A441',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 18,
  },
  demoOtpCalloutTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#8C8279',
    marginBottom: 6,
  },
  demoOtpPill: {
    backgroundColor: '#FAF6F0',
    borderWidth: 1.5,
    borderColor: '#B5532E',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  demoOtpPillText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#B5532E',
    letterSpacing: 4,
  },
  demoOtpTapHint: {
    fontSize: 10.5,
    color: '#8C8279',
    marginTop: 4,
  },
  otpInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#B5532E',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 8,
    textAlign: 'center',
    paddingVertical: 14,
    color: '#2A2320',
    marginBottom: 8,
  },
  otpErrorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D9381E',
    textAlign: 'center',
    marginBottom: 10,
  },
  resendSection: {
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 6,
  },
  resendTimerText: {
    fontSize: 12.5,
    color: '#8C8279',
  },
  resendActiveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B5532E',
    textDecorationLine: 'underline',
  },

  /* LOGOUT CONFIRMATION MODAL */
  logoutModalSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '88%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#2A2320',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E7D5BC',
  },
  logoutIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3E2CB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoutModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2A2320',
    marginBottom: 8,
    textAlign: 'center',
  },
  logoutModalSub: {
    fontSize: 13,
    color: '#665C54',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  confirmLogoutBtn: {
    backgroundColor: '#B5532E',
    borderRadius: 10,
    paddingVertical: 13,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmLogoutBtnText: {
    color: '#FAF6F0',
    fontSize: 14,
    fontWeight: '800',
  },
  cancelLogoutBtn: {
    backgroundColor: '#FAF6F0',
    borderWidth: 1,
    borderColor: '#E7D5BC',
    borderRadius: 10,
    paddingVertical: 13,
    width: '100%',
    alignItems: 'center',
  },
  cancelLogoutBtnText: {
    color: '#2A2320',
    fontSize: 14,
    fontWeight: '700',
  },
});
