import * as crypto from 'crypto';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Encodes a buffer into RFC 4648 Base32 string (without padding)
 */
export function base32Encode(buffer: Buffer): string {
  let bits = '';
  for (let i = 0; i < buffer.length; i++) {
    bits += buffer[i].toString(2).padStart(8, '0');
  }

  let base32 = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5).padEnd(5, '0');
    base32 += BASE32_ALPHABET[parseInt(chunk, 2)];
  }

  return base32;
}

/**
 * Decodes an RFC 4648 Base32 string into a Buffer
 */
export function base32Decode(base32: string): Buffer {
  const cleaned = base32.replace(/[\s=-]/g, '').toUpperCase();
  let bits = '';
  for (let i = 0; i < cleaned.length; i++) {
    const val = BASE32_ALPHABET.indexOf(cleaned[i]);
    if (val === -1) {
      throw new Error(`Invalid base32 character in secret: ${cleaned[i]}`);
    }
    bits += val.toString(2).padStart(5, '0');
  }

  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }

  return Buffer.from(bytes);
}

/**
 * Generates a cryptographically secure 160-bit (20 bytes) Base32 TOTP secret
 */
export function generateTotpSecret(): string {
  const randomBytes = crypto.randomBytes(20);
  return base32Encode(randomBytes);
}

/**
 * Generates a 6-digit TOTP code conforming to RFC 6238 / RFC 4226 (Google Authenticator)
 */
export function generateTotpCode(
  secret: string,
  timeMs: number = Date.now(),
  stepSeconds: number = 30
): string {
  const counter = Math.floor(timeMs / 1000 / stepSeconds);
  const key = base32Decode(secret);
  const counterBuf = Buffer.alloc(8);
  counterBuf.writeBigUInt64BE(BigInt(counter), 0);

  const hmac = crypto.createHmac('sha1', key).update(counterBuf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const code = (binary % 1_000_000).toString().padStart(6, '0');
  return code;
}

/**
 * Verifies a 6-digit TOTP code with time-drift tolerance (RFC 6238)
 * Default window is 1 step (checking T-1, T, T+1, i.e., -30s to +30s)
 */
export function verifyTotpCode(
  secret: string,
  candidateCode: string,
  windowSteps: number = 1,
  timeMs: number = Date.now(),
  stepSeconds: number = 30
): boolean {
  if (!candidateCode || typeof candidateCode !== 'string') return false;
  const cleanCode = candidateCode.trim();
  if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) return false;

  const currentCounter = Math.floor(timeMs / 1000 / stepSeconds);

  for (let offset = -windowSteps; offset <= windowSteps; offset++) {
    const counter = currentCounter + offset;
    const testTime = counter * stepSeconds * 1000;
    const expected = generateTotpCode(secret, testTime, stepSeconds);
    if (crypto.timingSafeEqual(Buffer.from(cleanCode), Buffer.from(expected))) {
      return true;
    }
  }

  return false;
}

/**
 * Returns an otpauth:// URI for QR code generation / authenticator app import
 */
export function getOtpAuthUrl(email: string, secret: string, issuer: string = 'Manga Marketsquare'): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedEmail = encodeURIComponent(email);
  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}
