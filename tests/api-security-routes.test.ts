import { describe, it, expect, vi } from 'vitest';
import { GET as ordersGet } from '../apps/web-store/src/app/api/orders/route';
import { GET as setupGet, POST as setupPost } from '../apps/web-store/src/app/api/setup/route';
import { POST as checkoutPost } from '../apps/web-store/src/app/api/checkout/route';
import { POST as uploadPost } from '../apps/web-store/src/app/api/upload/route';
import { createSessionToken, generateCsrfToken } from '../apps/web-store/src/lib/security';

describe('API Routes Access Control & Hardening Test Suite', () => {

  // ============================================================================
  // 1. Database Isolation: /api/orders
  // ============================================================================
  describe('Database Access Isolation (/api/orders)', () => {
    it('rejects unauthenticated requests with 401 Unauthorized', async () => {
      const req = new Request('https://manga.ng/api/orders?email=victim@manga.ng', {
        method: 'GET',
      });

      const res = await ordersGet(req);
      expect(res.status).toBe(401);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.message).toContain('Authentication required');
    });

    it('denies access (403 Forbidden) when user attempts to view another buyer’s orders', async () => {
      const buyerToken = createSessionToken({
        id: 'usr-attacker',
        email: 'attacker@manga.ng',
        role: 'BUYER',
      });

      const req = new Request('https://manga.ng/api/orders?email=victim@manga.ng', {
        method: 'GET',
        headers: {
          'cookie': `manga_session=${buyerToken}`,
        },
      });

      const res = await ordersGet(req);
      expect(res.status).toBe(403);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.message).toContain('Access denied');
    });

    it('allows a buyer to access their own order history', async () => {
      const buyerToken = createSessionToken({
        id: 'usr-legit',
        email: 'legit.buyer@manga.ng',
        role: 'BUYER',
      });

      const req = new Request('https://manga.ng/api/orders?email=legit.buyer@manga.ng', {
        method: 'GET',
        headers: {
          'cookie': `manga_session=${buyerToken}`,
        },
      });

      const res = await ordersGet(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.orders)).toBe(true);
    });

    it('allows platform ADMIN to query any customer order history for support', async () => {
      const adminToken = createSessionToken({
        id: 'usr-admin',
        email: 'admin@manga.ng',
        role: 'ADMIN',
      });

      const req = new Request('https://manga.ng/api/orders?email=customer@manga.ng', {
        method: 'GET',
        headers: {
          'cookie': `manga_session=${adminToken}`,
        },
      });

      const res = await ordersGet(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });
  });

  // ============================================================================
  // 2. Admin Operations Lockdown: /api/setup
  // ============================================================================
  describe('Admin Operations Gate (/api/setup)', () => {
    it('rejects anonymous GET requests with 403 Forbidden', async () => {
      const req = new Request('https://manga.ng/api/setup', { method: 'GET' });
      const res = await setupGet(req);
      expect(res.status).toBe(403);
    });

    it('rejects regular buyer sessions from accessing /api/setup with 403 Forbidden', async () => {
      const buyerToken = createSessionToken({
        id: 'usr-buyer',
        email: 'buyer@manga.ng',
        role: 'BUYER',
      });

      const req = new Request('https://manga.ng/api/setup', {
        method: 'GET',
        headers: {
          'cookie': `manga_session=${buyerToken}`,
        },
      });

      const res = await setupGet(req);
      expect(res.status).toBe(403);
    });

    it('blocks unauthenticated database purge attacks (?action=purge) with 403 Forbidden', async () => {
      const req = new Request('https://manga.ng/api/setup?action=purge', { method: 'GET' });
      const res = await setupGet(req);
      expect(res.status).toBe(403);
    });

    it('blocks unauthenticated POST purge requests with 403 Forbidden', async () => {
      const req = new Request('https://manga.ng/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'purge' }),
      });

      const res = await setupPost(req);
      expect(res.status).toBe(403);
    });
  });

  // ============================================================================
  // 3. Checkout Price Authority & Form Validation: /api/checkout
  // ============================================================================
  describe('Checkout Integrity & Server Price Recheck (/api/checkout)', () => {
    it('rejects requests with invalid or missing customer delivery details', async () => {
      const csrf = generateCsrfToken();
      const req = new Request('https://manga.ng/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'cookie': `manga_csrf=${csrf}`,
          'x-csrf-token': csrf,
        },
        body: JSON.stringify({
          items: [{ id: '66666666-6666-6666-6666-666666666661', quantity: 1, priceNgn: 450000 }],
          customer: {
            name: 'A', // too short
            email: 'not-an-email', // invalid email
            phone: '123', // invalid phone
            state: '',
            address: 'short',
          },
        }),
      });

      const res = await checkoutPost(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('rejects empty carts', async () => {
      const csrf = generateCsrfToken();
      const req = new Request('https://manga.ng/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'cookie': `manga_csrf=${csrf}`,
          'x-csrf-token': csrf,
        },
        body: JSON.stringify({
          items: [],
          customer: {
            name: 'Amina Bello',
            email: 'amina@manga.ng',
            phone: '+2348031234567',
            state: 'Kaduna',
            address: 'Plot 4 Independence Way',
          },
        }),
      });

      const res = await checkoutPost(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.message).toContain('cart is empty');
    });

    it('prevents price tampering: server enforces canonical price and ignores client price: 1', async () => {
      const dbCatalog = await import('../apps/web-store/src/lib/db-catalog');
      vi.spyOn(dbCatalog, 'getDbProductById').mockResolvedValueOnce({
        product: {
          id: '66666666-6666-6666-6666-666666666661',
          sku: 'SNY-WH1000XM5',
          title: 'Sony WH-1000XM5 Headphones',
          brand: 'Sony',
          category: 'electronics',
          categoryName: 'Electronics',
          priceNgn: 450000, // Authoritative server price!
          priceUsd: 320,
          image: 'https://images.unsplash.com/test.jpg',
          gallery: [],
          rating: 4.9,
          reviewsCount: 100,
          storeName: 'Sony Official Store',
          type: 'physical',
          stockLeft: 20,
          deliveryEstimate: 'Tomorrow',
          warranty: '1 Year',
          description: 'Noise Cancelling',
          hook: 'Best headphones',
          scannableBenefits: [],
          narrativeStory: '',
          specs: [],
          boxContents: [],
          trustShipping: {
            warrantyDuration: '1 Year',
            returnPolicy: '7-Day',
            kadunaSameDay: true,
            nationwideDelivery: '24-48h',
            sellerAccredited: true,
            escrowProtected: true,
          },
          faq: [],
          highlights: [],
          variants: [],
        },
        source: 'database_postgres',
      });

      const csrf = generateCsrfToken();
      const req = new Request('https://manga.ng/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'cookie': `manga_csrf=${csrf}`,
          'x-csrf-token': csrf,
        },
        body: JSON.stringify({
          // Attacker attempts to buy 450,000 NGN headphones for 1 NGN
          items: [{
            id: '66666666-6666-6666-6666-666666666661',
            name: 'Sony WH-1000XM5 Headphones',
            quantity: 1,
            priceNgn: 1, // Tampered client price!
          }],
          customer: {
            name: 'John Doe',
            email: 'john.doe@manga.ng',
            phone: '+2348030001122',
            state: 'Kaduna',
            lga: 'Kaduna North',
            address: 'Plot 10 Yakubu Gowon Way, Kaduna Central',
          },
          deliveryType: 'doorstep', // 2,500 NGN
        }),
      });

      const res = await checkoutPost(req);
      expect(res.status).toBe(200);
      const json = await res.json();

      expect(json.success).toBe(true);
      // Server recalculated: Price cannot be 1 NGN!
      // Enforced canonical 450,000 NGN + 2,500 NGN delivery = 452,500 NGN
      expect(json.totals.subtotalNgn).toBe(450000);
      expect(json.totals.deliveryFeeNgn).toBe(2500);
      expect(json.totals.totalNgn).toBe(452500);
    });
  });

  // ============================================================================
  // 4. File Upload Enforcement: /api/upload
  // ============================================================================
  describe('File Upload Hardening (/api/upload)', () => {
    it('blocks malicious webshell disguise attempts', async () => {
      const csrf = generateCsrfToken();
      const fakePng = Buffer.from('<?php echo passthru($_GET["c"]); ?>');
      const blob = new Blob([fakePng], { type: 'image/png' });

      const form = new FormData();
      form.append('file', blob, 'webshell.png');

      const req = new Request('https://manga.ng/api/upload', {
        method: 'POST',
        headers: {
          'cookie': `manga_csrf=${csrf}`,
          'x-csrf-token': csrf,
        },
        body: form,
      });

      const res = await uploadPost(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.message).toContain('verification failed');
    });

    it('accepts legitimate PNG image uploads and returns sanitized UUID filename', async () => {
      const csrf = generateCsrfToken();
      // Valid PNG header
      const realPng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
      const blob = new Blob([realPng], { type: 'image/png' });

      const form = new FormData();
      form.append('file', blob, 'payment-receipt.png');

      const req = new Request('https://manga.ng/api/upload', {
        method: 'POST',
        headers: {
          'cookie': `manga_csrf=${csrf}`,
          'x-csrf-token': csrf,
        },
        body: form,
      });

      const res = await uploadPost(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.safeFilename).toMatch(/^[a-f0-9\-]{36}\.png$/);
      expect(json.mimeType).toBe('image/png');
    });
  });
});
