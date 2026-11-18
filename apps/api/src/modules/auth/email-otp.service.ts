import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

@Injectable()
export class EmailOtpService {
  private readonly otps = new Map<string, OtpRecord>();
  private readonly defaultExpiryMs = 10 * 60 * 1000; // 10 minutes
  private readonly maxAttempts = 5;

  /**
   * Generates and stores a new 6-digit email OTP for the recipient
   */
  public generateOtp(email: string): { code: string; expiresAt: Date } {
    const normalized = email.trim().toLowerCase();
    // Cryptographically secure 6-digit code
    const num = crypto.randomInt(100_000, 1_000_000);
    const code = num.toString();
    const expiresAt = Date.now() + this.defaultExpiryMs;

    this.otps.set(normalized, {
      code,
      expiresAt,
      attempts: 0,
    });

    return {
      code,
      expiresAt: new Date(expiresAt),
    };
  }

  /**
   * Verifies the email OTP with rate limiting and expiration check
   */
  public verifyOtp(email: string, candidateCode: string): boolean {
    const normalized = email.trim().toLowerCase();
    const record = this.otps.get(normalized);

    if (!record) {
      return false;
    }

    if (Date.now() > record.expiresAt) {
      this.otps.delete(normalized);
      return false;
    }

    record.attempts += 1;
    if (record.attempts > this.maxAttempts) {
      this.otps.delete(normalized);
      return false;
    }

    const cleanCandidate = (candidateCode || '').trim();
    if (cleanCandidate.length !== 6 || !/^\d{6}$/.test(cleanCandidate)) {
      return false;
    }

    const isMatch = crypto.timingSafeEqual(
      Buffer.from(cleanCandidate),
      Buffer.from(record.code)
    );

    if (isMatch) {
      // Consume OTP on successful verification to prevent replay
      this.otps.delete(normalized);
      return true;
    }

    return false;
  }

  /**
   * Invalidate OTP for an email
   */
  public invalidateOtp(email: string): void {
    this.otps.delete(email.trim().toLowerCase());
  }

  /**
   * Peek active OTP (for testing / development simulation)
   */
  public getActiveOtpForTesting(email: string): string | null {
    const record = this.otps.get(email.trim().toLowerCase());
    if (!record || Date.now() > record.expiresAt) return null;
    return record.code;
  }
}
