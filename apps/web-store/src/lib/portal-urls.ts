/**
 * Manga Portal Navigation & URL Resolver
 * 
 * Centralizes routing to the Merchant/Vendor Portal and Platform Admin Console.
 * - On production web deployment, links navigate cleanly to integrated routes (/sell and /admin).
 * - If custom external subdomains are configured via environment variables
 *   (NEXT_PUBLIC_VENDOR_URL, NEXT_PUBLIC_ADMIN_URL), those take precedence.
 * - In local development or standalone mode, dedicated Vite dev server URLs (3001, 3002) are supported.
 */

export const DEV_VENDOR_URL = 'http://localhost:3001';
export const DEV_ADMIN_URL = 'http://localhost:3002';

/**
 * Returns the resolved Vendor/Seller URL.
 * - Defaults to internal /sell route on production.
 * - Respects NEXT_PUBLIC_VENDOR_URL if a custom domain (e.g. vendor.manga.jlm.com.ng) is active.
 */
export function getVendorUrl(): string {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_VENDOR_URL) {
    return process.env.NEXT_PUBLIC_VENDOR_URL;
  }
  return '/sell';
}

/**
 * Returns the resolved Admin Operations Console URL.
 * - Defaults to internal /admin route on production.
 * - Respects NEXT_PUBLIC_ADMIN_URL if a custom domain (e.g. admin.manga.jlm.com.ng) is active.
 */
export function getAdminUrl(): string {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_ADMIN_URL) {
    return process.env.NEXT_PUBLIC_ADMIN_URL;
  }
  return '/admin';
}
