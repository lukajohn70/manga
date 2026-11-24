import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'manga_session';
const CSRF_COOKIE_NAME = 'manga_csrf';

/**
 * Validates HMAC-SHA256 session token in Edge/Node middleware runtime.
 */
async function verifySessionRole(token: string | undefined, secret: string): Promise<{ valid: boolean; role?: string; email?: string }> {
  if (!token || !token.includes('.')) return { valid: false };

  const [payloadBase64, providedSig] = token.split('.');
  if (!payloadBase64 || !providedSig) return { valid: false };

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Convert base64url to Uint8Array
    const base64 = providedSig.replace(/-/g, '+').replace(/_/g, '/');
    const binStr = atob(base64);
    const sigBytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      sigBytes[i] = binStr.charCodeAt(i);
    }

    const dataBytes = encoder.encode(payloadBase64);
    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, dataBytes);
    if (!isValid) return { valid: false };

    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return { valid: false };
    }

    return { valid: true, role: payload.role, email: payload.email };
  } catch {
    return { valid: false };
  }
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const isProduction = process.env.NODE_ENV === 'production';

  // 1. Force HTTPS in production reverse proxy
  const proto = request.headers.get('x-forwarded-proto');
  const host = request.headers.get('host');
  if (isProduction && proto === 'http' && host && !host.startsWith('localhost') && !host.startsWith('127.0.0.1')) {
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const secret = process.env.SESSION_SECRET || process.env.JWT_SECRET || 'manga_default_secure_secret_fallback';

  // 2. Dedicated Admin Operations Routing (Separate from Buyer and Merchant)
  if (pathname.startsWith('/admin')) {
    const auth = await verifySessionRole(sessionCookie, secret);

    // If visiting the dedicated Admin Login page
    if (pathname === '/admin/login') {
      // If already authenticated as ADMIN, redirect straight to the Admin Hub
      if (auth.valid && auth.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      // Otherwise allow viewing the admin login gate
    } else {
      // For all protected /admin routes, strictly require ADMIN role
      if (!auth.valid || auth.role !== 'ADMIN') {
        const adminLoginUrl = new URL('/admin/login', request.url);
        if (pathname !== '/admin') {
          adminLoginUrl.searchParams.set('redirect', pathname);
        }
        return NextResponse.redirect(adminLoginUrl);
      }
    }
  }

  // 3. Dedicated Merchant Routing (Separate from Buyer and Admin)
  if (pathname === '/merchant/login' || pathname === '/sell/login') {
    const auth = await verifySessionRole(sessionCookie, secret);
    // If already authenticated as VENDOR or ADMIN, redirect straight to Merchant Console
    if (auth.valid && (auth.role === 'VENDOR' || auth.role === 'ADMIN')) {
      return NextResponse.redirect(new URL('/sell', request.url));
    }
  }

  // 4. Dedicated Customer Account Routing (Buyer Portal)
  if (pathname === '/account') {
    if (!sessionCookie) {
      const buyerLoginUrl = new URL('/account/login', request.url);
      buyerLoginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(buyerLoginUrl);
    }
  }

  // If already authenticated as a BUYER, visiting /account/login redirects to /account (unless custom redirect)
  if (pathname === '/account/login') {
    const auth = await verifySessionRole(sessionCookie, secret);
    if (auth.valid && auth.role === 'BUYER' && !url.searchParams.has('redirect')) {
      return NextResponse.redirect(new URL('/account', request.url));
    }
  }

  const response = NextResponse.next();

  // 4. Ensure CSRF cookie is provisioned for Double-Submit protection
  if (!request.cookies.has(CSRF_COOKIE_NAME)) {
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    const csrfToken = Array.from(randomBytes, (b) => b.toString(16).padStart(2, '0')).join('');
    response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
      httpOnly: false,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });
  }

  // 5. Apply Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|icons).*)',
  ],
};
