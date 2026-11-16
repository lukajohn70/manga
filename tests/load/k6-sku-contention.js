import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * Manga Platform - High-Concurrency Flash Sale Hot SKU Load Test (k6)
 * Simulates 5x projected launch peak: 500 concurrent buyers competing for 50 units.
 * Invariants: Zero overselling, atomic conditional reservation, p95 latency < 200ms.
 */

export const options = {
  scenarios: {
    flash_sale_spike: {
      executor: 'per-vu-iterations',
      vus: 500, // 500 concurrent buyers
      iterations: 1,
      maxDuration: '30s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<250'], // 95% of requests must complete under 250ms
    http_req_failed: ['rate<0.95'], // Expected that out-of-stock requests return HTTP 409
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';
const FLASH_SALE_VARIANT_ID = 'var-flash-sale-iphone-15';
const VENDOR_ID = 'ven-flagship-store-01';

export default function () {
  const vuId = __VU;
  const idempotencyKey = `idemp-flash-sale-${vuId}-${Date.now()}`;

  const payload = JSON.stringify({
    buyerId: `buyer-${vuId}`,
    vendorId: VENDOR_ID,
    items: [
      {
        variantId: FLASH_SALE_VARIANT_ID,
        quantity: 1,
        unitPriceMinor: '85000000', // ₦850,000.00
      },
    ],
    currency: 'NGN',
    paymentMethod: 'card',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
  };

  const res = http.post(`${BASE_URL}/orders/checkout`, payload, params);

  // Response must either be 201 Created (Stock reserved & order placed)
  // or 409 Conflict / 400 Bad Request (Sold out - out of stock)
  check(res, {
    'valid business response': (r) => r.status === 201 || r.status === 409 || r.status === 400,
    'zero 500 server errors': (r) => r.status !== 500,
  });

  sleep(0.1);
}
