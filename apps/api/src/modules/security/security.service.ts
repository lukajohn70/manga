import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';

export interface EncryptedPayload {
  ciphertextHex: string;
  ivHex: string;
  authTagHex: string;
  keyVersion: number;
}

export interface RateLimitStatus {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

@Injectable()
export class SecurityService {
  // Simulated KMS Master Key (32 bytes = 256 bits)
  private readonly kmsMasterKey: Buffer = crypto.createHash('sha256').update('manga-kms-master-key-v1').digest();
  private readonly keyVersion = 1;

  // Rate Limiting buckets: key -> array of timestamps
  private readonly rateLimitBuckets = new Map<string, number[]>();

  /**
   * Field-level envelope encryption using AES-256-GCM (§12.2, OWASP ASVS L2)
   */
  public encryptField(plaintext: string): EncryptedPayload {
    const iv = crypto.randomBytes(12); // Standard 96-bit IV for GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', this.kmsMasterKey, iv);

    let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return {
      ciphertextHex: ciphertext,
      ivHex: iv.toString('hex'),
      authTagHex: authTag.toString('hex'),
      keyVersion: this.keyVersion,
    };
  }

  /**
   * Field-level decryption with GCM authentication tag verification
   */
  public decryptField(payload: EncryptedPayload): string {
    const iv = Buffer.from(payload.ivHex, 'hex');
    const authTag = Buffer.from(payload.authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.kmsMasterKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(payload.ciphertextHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Sliding window rate limiter for abuse prevention (§12.3)
   * e.g., max 10 requests per 60 seconds per IP
   */
  public checkRateLimit(key: string, maxRequests: number, windowSeconds: number): RateLimitStatus {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const windowStart = now - windowMs;

    let timestamps = this.rateLimitBuckets.get(key) || [];
    // Discard timestamps older than sliding window
    timestamps = timestamps.filter((t) => t > windowStart);

    if (timestamps.length >= maxRequests) {
      const oldest = timestamps[0];
      const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000);
      return {
        allowed: false,
        limit: maxRequests,
        remaining: 0,
        resetSeconds,
      };
    }

    timestamps.push(now);
    this.rateLimitBuckets.set(key, timestamps);

    return {
      allowed: true,
      limit: maxRequests,
      remaining: maxRequests - timestamps.length,
      resetSeconds: windowSeconds,
    };
  }

  /**
   * Enforces rate limiting or throws HTTP 429 Too Many Requests
   */
  public enforceRateLimit(key: string, maxRequests: number, windowSeconds: number): void {
    const status = this.checkRateLimit(key, maxRequests, windowSeconds);
    if (!status.allowed) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Retry in ${status.resetSeconds} seconds.`,
          retryAfterSeconds: status.resetSeconds,
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }
  }
}
