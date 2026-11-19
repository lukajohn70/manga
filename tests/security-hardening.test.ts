import { describe, it, expect, beforeEach } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  checkRateLimit,
  resetRateLimit,
  generateCsrfToken,
  verifyCsrf,
  createPasswordResetToken,
  hashResetToken,
  sanitizeString,
  validateEmail,
  validatePasswordStrength,
  validatePhone,
} from '../apps/web-store/src/lib/security';
import { validateUploadedBuffer, MAX_UPLOAD_SIZE_BYTES } from '../apps/web-store/src/lib/upload-security';

describe('Security Hardening & Protection Test Suite', () => {

  // ============================================================================
  // 1. Password Hashing & Real Authentication
  // ============================================================================
  describe('1. Password Hashing & Cryptographic Verification', () => {
    it('hashes passwords using scrypt with unique random salts', () => {
      const pwd = 'StrongPassword2026!';
      const hash1 = hashPassword(pwd);
      const hash2 = hashPassword(pwd);

      expect(hash1).toMatch(/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/);
      expect(hash2).toMatch(/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/);
      // Different salts mean different outputs for identical input
      expect(hash1).not.toBe(hash2);
    });

    it('successfully verifies correct password against scrypt hash', () => {
      const pwd = 'CorrectHorseBatteryStaple99#';
      const hash = hashPassword(pwd);
      expect(verifyPassword(pwd, hash)).toBe(true);
    });

    it('rejects incorrect password against scrypt hash', () => {
      const hash = hashPassword('CorrectPassword123!');
      expect(verifyPassword('WrongPassword123!', hash)).toBe(false);
      expect(verifyPassword('', hash)).toBe(false);
    });

    it('supports backward-compatible migration for legacy SHA-256 hashes without allowing plain text', () => {
      const crypto = require('crypto');
      const legacyPassword = 'OldPassword2025!';
      const legacySha256 = crypto.createHash('sha256').update(legacyPassword).digest('hex');

      expect(verifyPassword(legacyPassword, legacySha256)).toBe(true);
      expect(verifyPassword('WrongLegacy!', legacySha256)).toBe(false);

      // Rejects plain text string matching
      expect(verifyPassword('12', '12')).toBe(false);
    });
  });

  // ============================================================================
  // 2. Cryptographic Sessions & Session Cookies
  // ============================================================================
  describe('2. Session Token Signing, Validation & Expiration', () => {
    it('creates and verifies cryptographically signed session tokens', () => {
      const token = createSessionToken({
        id: 'usr-12345',
        email: 'shopper@manga.ng',
        role: 'BUYER',
        name: 'Amina Bello',
      });

      expect(typeof token).toBe('string');
      expect(token).toContain('.');

      const session = verifySessionToken(token);
      expect(session).not.toBeNull();
      expect(session?.userId).toBe('usr-12345');
      expect(session?.email).toBe('shopper@manga.ng');
      expect(session?.role).toBe('BUYER');
      expect(session?.name).toBe('Amina Bello');
    });

    it('rejects tampered or forged session tokens', () => {
      const token = createSessionToken({
        id: 'usr-12345',
        email: 'shopper@manga.ng',
        role: 'BUYER',
      });

      const [payload, sig] = token.split('.');
      // Tamper with payload by changing role to ADMIN
      const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
      decodedPayload.role = 'ADMIN';
      const forgedPayload = Buffer.from(JSON.stringify(decodedPayload)).toString('base64url');

      const tamperedToken = `${forgedPayload}.${sig}`;
      expect(verifySessionToken(tamperedToken)).toBeNull();
    });

    it('rejects expired session tokens', () => {
      // Craft expired token
      const expiredPayload = {
        userId: 'usr-old',
        email: 'expired@manga.ng',
        role: 'BUYER' as const,
        iat: Math.floor(Date.now() / 1000) - 10000,
        exp: Math.floor(Date.now() / 1000) - 10, // Expired 10s ago
      };
      const secret = 'test-secret';
      process.env.SESSION_SECRET = secret;

      const pBase64 = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
      const crypto = require('crypto');
      const sig = crypto.createHmac('sha256', secret).update(pBase64).digest('base64url');
      const expiredToken = `${pBase64}.${sig}`;

      expect(verifySessionToken(expiredToken)).toBeNull();
    });
  });

  // ============================================================================
  // 3. Rate Limiting (Login & Auth Protection)
  // ============================================================================
  describe('3. Rate Limiting Protection', () => {
    const testKey = 'test_ip_192_168_1_50';

    beforeEach(() => {
      resetRateLimit(testKey);
    });

    it('allows requests up to configured limit', () => {
      for (let i = 1; i <= 5; i++) {
        const res = checkRateLimit(testKey, 5, 60000);
        expect(res.allowed).toBe(true);
      }
    });

    it('blocks subsequent requests exceeding limit and provides retry window', () => {
      for (let i = 1; i <= 5; i++) {
        checkRateLimit(testKey, 5, 60000);
      }

      // 6th attempt is blocked
      const blocked = checkRateLimit(testKey, 5, 60000);
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
      expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // 4. CSRF Protection
  // ============================================================================
  describe('4. CSRF Protection', () => {
    it('permits safe read-only HTTP methods without CSRF token', () => {
      const getReq = new Request('https://manga.ng/api/products', { method: 'GET' });
      expect(verifyCsrf(getReq)).toBe(true);

      const headReq = new Request('https://manga.ng/api/products', { method: 'HEAD' });
      expect(verifyCsrf(headReq)).toBe(true);
    });

    it('validates matching Double-Submit CSRF cookie and header on mutating POST', () => {
      const csrfToken = generateCsrfToken();
      const postReq = new Request('https://manga.ng/api/checkout', {
        method: 'POST',
        headers: {
          'cookie': `manga_csrf=${csrfToken}`,
          'x-csrf-token': csrfToken,
        },
      });

      expect(verifyCsrf(postReq)).toBe(true);
    });

    it('rejects POST requests with mismatched or missing CSRF tokens from different origins', () => {
      const postReq = new Request('https://manga.ng/api/checkout', {
        method: 'POST',
        headers: {
          'origin': 'https://evil-attacker-site.com',
          'host': 'manga.ng',
        },
      });

      expect(verifyCsrf(postReq)).toBe(false);
    });
  });

  // ============================================================================
  // 5. Expiring Password Reset Links
  // ============================================================================
  describe('5. Password Reset Tokens', () => {
    it('generates 32-byte cryptographic reset tokens with 15-minute expiry', () => {
      const reset = createPasswordResetToken();
      expect(reset.token).toHaveLength(64); // 32 bytes hex
      expect(reset.hash).toHaveLength(64); // SHA-256 hash

      const expectedExpiry = Date.now() + 15 * 60 * 1000;
      const actualExpiry = reset.expiresAt.getTime();
      expect(Math.abs(actualExpiry - expectedExpiry)).toBeLessThan(2000);
    });

    it('hashes token identically for verification lookup', () => {
      const reset = createPasswordResetToken();
      const computedHash = hashResetToken(reset.token);
      expect(computedHash).toBe(reset.hash);
    });
  });

  // ============================================================================
  // 6. Server-Side Form Validation & XSS Sanitization
  // ============================================================================
  describe('6. Server-Side Validation & XSS Neutralization', () => {
    it('escapes dangerous HTML/JS characters to block XSS injection', () => {
      const malicious = '<script>alert("pwned")</script>';
      const sanitized = sanitizeString(malicious);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toBe('&lt;script&gt;alert(&quot;pwned&quot;)&lt;&#x2F;script&gt;');
    });

    it('validates emails strictly on the server', () => {
      expect(validateEmail('amina.bello@example.com')).toBe(true);
      expect(validateEmail('user+test@subdomain.manga.ng')).toBe(true);

      expect(validateEmail('plainaddress')).toBe(false);
      expect(validateEmail('<script>alert(1)</script>@manga.ng')).toBe(false);
      expect(validateEmail('@missingusername.com')).toBe(false);
      expect(validateEmail('spaces in email@manga.ng')).toBe(false);
    });

    it('validates password complexity (min 8 chars, letter + number)', () => {
      expect(validatePasswordStrength('Pass1234!').valid).toBe(true);
      expect(validatePasswordStrength('short1').valid).toBe(false);
      expect(validatePasswordStrength('allletterspassword').valid).toBe(false);
      expect(validatePasswordStrength('1234567890').valid).toBe(false);
    });

    it('validates telephone numbers strictly on the server', () => {
      expect(validatePhone('+2348031234567')).toBe(true);
      expect(validatePhone('08031234567')).toBe(true);
      expect(validatePhone('invalid-phone-string')).toBe(false);
    });
  });

  // ============================================================================
  // 7. File Upload Limitations & Binary Inspection
  // ============================================================================
  describe('7. File Upload Security & Magic Byte Inspection', () => {
    it('accepts legitimate JPEG image with valid magic bytes', () => {
      // JPEG magic bytes: FF D8 FF E0
      const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);
      const res = validateUploadedBuffer(jpegBuffer, 'receipt.jpg', 'image/jpeg');

      expect(res.valid).toBe(true);
      expect(res.detectedMime).toBe('image/jpeg');
      expect(res.safeFilename).toMatch(/^[a-f0-9\-]{36}\.jpg$/);
    });

    it('accepts legitimate PNG image with valid magic bytes', () => {
      // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
      const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
      const res = validateUploadedBuffer(pngBuffer, 'proof.png', 'image/png');

      expect(res.valid).toBe(true);
      expect(res.detectedMime).toBe('image/png');
    });

    it('accepts legitimate PDF document with valid magic bytes', () => {
      // PDF magic bytes: %PDF-
      const pdfBuffer = Buffer.from('%PDF-1.4\n%test content\n');
      const res = validateUploadedBuffer(pdfBuffer, 'invoice.pdf', 'application/pdf');

      expect(res.valid).toBe(true);
      expect(res.detectedMime).toBe('application/pdf');
    });

    it('blocks dangerous executable files disguised with fake extensions', () => {
      // Malicious PHP webshell renamed as avatar.png
      const fakePngWebshell = Buffer.from('<?php system($_GET["cmd"]); ?>');
      const res = validateUploadedBuffer(fakePngWebshell, 'avatar.png', 'image/png');

      expect(res.valid).toBe(false);
      expect(res.error).toContain('verification failed');
    });

    it('blocks disallowed file extensions (.php, .exe, .sh, .html, .svg)', () => {
      const buffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
      expect(validateUploadedBuffer(buffer, 'shell.php', 'image/jpeg').valid).toBe(false);
      expect(validateUploadedBuffer(buffer, 'malware.exe', 'image/jpeg').valid).toBe(false);
      expect(validateUploadedBuffer(buffer, 'script.sh', 'image/jpeg').valid).toBe(false);
      expect(validateUploadedBuffer(buffer, 'vector.svg', 'image/svg+xml').valid).toBe(false);
    });

    it('enforces maximum 5MB file upload limit', () => {
      const oversized = Buffer.alloc(MAX_UPLOAD_SIZE_BYTES + 1024);
      oversized[0] = 0xff;
      oversized[1] = 0xd8;
      oversized[2] = 0xff;

      const res = validateUploadedBuffer(oversized, 'huge.jpg', 'image/jpeg');
      expect(res.valid).toBe(false);
      expect(res.error).toContain('5MB');
    });
  });
});
