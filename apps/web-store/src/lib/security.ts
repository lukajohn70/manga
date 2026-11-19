import crypto from 'crypto';

// ==============================================================================
// 1. CONFIGURATION & SECRETS
// ==============================================================================

/**
 * Returns the server-only cryptographic signing secret.
 * Falls back to an in-memory persistent secret if not provided in environment,
 * ensuring tokens cannot be forged by external callers.
 */
let inMemorySecret: string | null = null;
function getServerSecret(): string {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (process.env.JWT_SECRET && !process.env.JWT_SECRET.includes('REPLACE_WITH')) {
    return process.env.JWT_SECRET;
  }
  if (!inMemorySecret) {
    inMemorySecret = crypto.randomBytes(32).toString('hex');
  }
  return inMemorySecret;
}

export const SESSION_COOKIE_NAME = 'manga_session';
export const CSRF_COOKIE_NAME = 'manga_csrf';

export function getSessionCookieOptions(isProduction = process.env.NODE_ENV === 'production') {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  };
}

// ==============================================================================
// 2. PASSWORD HASHING & VERIFICATION (OWASP Scrypt + Salt)
// ==============================================================================

/**
 * Computes an OWASP-compliant scrypt hash with a cryptographically random 16-byte salt.
 * Result format: `scrypt$SALT_HEX$KEY_HEX`
 */
export function hashPassword(password: string): string {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

/**
 * Verifies a password against a stored hash using timing-safe comparison.
 * Supports legacy SHA-256 for seamless migration without lockout.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash || typeof password !== 'string' || typeof storedHash !== 'string') {
    return false;
  }

  // 1. Scrypt format: `scrypt$salt$hash`
  if (storedHash.startsWith('scrypt$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 3) return false;
    const [, salt, expectedHex] = parts;
    try {
      const derivedKey = crypto.scryptSync(password, salt, 64);
      const expectedBuf = Buffer.from(expectedHex, 'hex');
      if (derivedKey.length !== expectedBuf.length) return false;
      return crypto.timingSafeEqual(derivedKey, expectedBuf);
    } catch {
      return false;
    }
  }

  // 2. Legacy SHA-256 format (64-character hex string)
  if (/^[a-f0-9]{64}$/i.test(storedHash)) {
    const legacyHash = crypto.createHash('sha256').update(password).digest('hex');
    const legacyBuf = Buffer.from(legacyHash, 'utf8');
    const storedBuf = Buffer.from(storedHash, 'utf8');
    if (legacyBuf.length !== storedBuf.length) return false;
    return crypto.timingSafeEqual(legacyBuf, storedBuf);
  }

  return false;
}

// ==============================================================================
// 3. CRYPTOGRAPHIC SESSION TOKENS (HMAC-SHA256)
// ==============================================================================

export interface SessionPayload {
  userId: string;
  email: string;
  role: 'BUYER' | 'VENDOR' | 'ADMIN';
  name?: string;
  iat: number;
  exp: number;
}

/**
 * Creates a cryptographically signed session token.
 */
export function createSessionToken(user: { id: string; email: string; role: 'BUYER' | 'VENDOR' | 'ADMIN'; name?: string }): string {
  const secret = getServerSecret();
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 7 * 24 * 60 * 60; // 7 days expiration

  const payload: SessionPayload = {
    userId: user.id,
    email: user.email.toLowerCase().trim(),
    role: user.role,
    name: user.name,
    iat,
    exp,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payloadBase64).digest('base64url');

  return `${payloadBase64}.${signature}`;
}

/**
 * Validates and extracts the session payload from a signed token.
 * Returns null if token is missing, tampered, expired, or invalid.
 */
export function verifySessionToken(token?: string | null): SessionPayload | null {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return null;
  }

  const [payloadBase64, providedSig] = token.split('.');
  if (!payloadBase64 || !providedSig) return null;

  const secret = getServerSecret();
  const expectedSig = crypto.createHmac('sha256', secret).update(payloadBase64).digest('base64url');

  const providedBuf = Buffer.from(providedSig);
  const expectedBuf = Buffer.from(expectedSig);

  if (providedBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(providedBuf, expectedBuf)) return null;

  try {
    const payload: SessionPayload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return null; // Expired token
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Extracts session from Next.js Request via HttpOnly cookie or Authorization Bearer header.
 */
export function getSessionFromRequest(request: Request): SessionPayload | null {
  // 1. Try cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
  if (match && match[1]) {
    const session = verifySessionToken(decodeURIComponent(match[1]));
    if (session) return session;
  }

  // 2. Try Authorization header
  const authHeader = request.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    return verifySessionToken(token);
  }

  return null;
}

// ==============================================================================
// 4. RATE LIMITING (Sliding Window in memory)
// ==============================================================================

interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Enforces rate limiting on sensitive endpoints (e.g. login, registration, password reset).
 */
export function checkRateLimit(key: string, limit = 5, windowMs = 15 * 60 * 1000): {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (record.count >= limit) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, retryAfterSeconds: 0 };
}

export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key);
}

// ==============================================================================
// 5. CSRF PROTECTION
// ==============================================================================

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validates CSRF token or origin on mutating requests.
 */
export function verifyCsrf(request: Request): boolean {
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return true;

  // Header vs Cookie Double Submit
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${CSRF_COOKIE_NAME}=([^;]+)`));
  const cookieCsrf = match ? decodeURIComponent(match[1]) : null;

  const headerCsrf =
    request.headers.get('x-csrf-token') ||
    request.headers.get('csrf-token') ||
    request.headers.get('x-xsrf-token');

  if (cookieCsrf && headerCsrf) {
    if (cookieCsrf.length === headerCsrf.length && crypto.timingSafeEqual(Buffer.from(cookieCsrf), Buffer.from(headerCsrf))) {
      return true;
    }
  }

  // Same-origin verification fallback
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost === host) return true;
    } catch {}
  }

  // Allow Bearer token authenticated API calls without CSRF cookie
  const authHeader = request.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    return true;
  }

  return false;
}

// ==============================================================================
// 6. PASSWORD RESET TOKENS (Expiring, Single-Use)
// ==============================================================================

export interface PasswordResetRecord {
  token: string;
  hash: string;
  expiresAt: Date;
}

export function createPasswordResetToken(): PasswordResetRecord {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Exactly 15 minutes expiry
  return { token, hash, expiresAt };
}

export function hashResetToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// ==============================================================================
// 7. INPUT SANITIZATION & FORM VALIDATION (Server-Side)
// ==============================================================================

/**
 * Blocks XSS by HTML-encoding dangerous characters.
 */
export function sanitizeString(input: unknown): string {
  if (input === null || input === undefined) return '';
  const str = String(input);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Strict server-side email validation.
 */
export function validateEmail(email: unknown): boolean {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim();
  if (clean.length < 5 || clean.length > 254) return false;
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(clean);
}

/**
 * Strict server-side password strength validation (min 8 chars, letter + number).
 */
export function validatePasswordStrength(password: unknown): { valid: boolean; reason?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, reason: 'Password is required' };
  }
  if (password.length < 8) {
    return { valid: false, reason: 'Password must be at least 8 characters long' };
  }
  if (password.length > 128) {
    return { valid: false, reason: 'Password must not exceed 128 characters' };
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, reason: 'Password must contain both letters and numbers for adequate entropy' };
  }
  return { valid: true };
}

/**
 * Server-side phone number validation.
 */
export function validatePhone(phone: unknown): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+?[0-9]{7,16}$/.test(clean);
}
