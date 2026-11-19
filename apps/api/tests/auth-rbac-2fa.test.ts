import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../src/modules/auth/auth.service.js';
import { EmailOtpService } from '../src/modules/auth/email-otp.service.js';
import { RolesGuard } from '../src/modules/auth/roles.guard.js';
import {
  generateTotpCode,
  verifyTotpCode,
  generateTotpSecret,
  getOtpAuthUrl,
} from '../src/modules/auth/totp.util.js';
import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('Milestone 6: Real Authentication, 2FA & Role-Based Access Control', () => {
  let authService: AuthService;
  let emailOtpService: EmailOtpService;
  let reflector: Reflector;
  let rolesGuard: RolesGuard;

  beforeEach(() => {
    emailOtpService = new EmailOtpService();
    authService = new AuthService(emailOtpService);
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector, authService);
  });

  describe('6.1 Google Authenticator RFC 6238 TOTP Engine', () => {
    it('generates consistent 6-digit TOTP codes for given secret and timestamp', () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      const timeMs = 1700000000000;
      const code1 = generateTotpCode(secret, timeMs);
      const code2 = generateTotpCode(secret, timeMs);

      expect(code1).toHaveLength(6);
      expect(/^\d{6}$/.test(code1)).toBe(true);
      expect(code1).toBe(code2);
    });

    it('validates correct TOTP code within standard time-drift window (±30s)', () => {
      const secret = generateTotpSecret();
      const now = Date.now();
      const currentCode = generateTotpCode(secret, now);

      // Verify current code
      expect(verifyTotpCode(secret, currentCode, 1, now)).toBe(true);

      // Verify code from previous step (-30s)
      const prevStepCode = generateTotpCode(secret, now - 30_000);
      expect(verifyTotpCode(secret, prevStepCode, 1, now)).toBe(true);

      // Verify code from next step (+30s)
      const nextStepCode = generateTotpCode(secret, now + 30_000);
      expect(verifyTotpCode(secret, nextStepCode, 1, now)).toBe(true);

      // Codes older than drift window should be rejected
      const expiredCode = generateTotpCode(secret, now - 120_000);
      expect(verifyTotpCode(secret, expiredCode, 1, now)).toBe(false);
    });

    it('rejects invalid, malformed or wrong-length TOTP codes', () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      expect(verifyTotpCode(secret, '12345')).toBe(false);
      expect(verifyTotpCode(secret, '1234567')).toBe(false);
      expect(verifyTotpCode(secret, 'abcdef')).toBe(false);
      expect(verifyTotpCode(secret, '999999')).toBe(false);
    });

    it('constructs valid otpauth URL for Google Authenticator QR setup', () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      const email = 'admin@manga.ng';
      const url = getOtpAuthUrl(email, secret, 'Manga Marketsquare');

      expect(url).toContain('otpauth://totp/');
      expect(url).toContain('secret=' + secret);
      expect(url).toContain('Manga%20Marketsquare');
      expect(url).toContain('admin%40manga.ng');
    });
  });

  describe('6.2 Email 2FA OTP Service', () => {
    it('generates a 6-digit numeric OTP and verifies it accurately', () => {
      const email = 'buyer@manga.ng';
      const { code } = emailOtpService.generateOtp(email);

      expect(code).toHaveLength(6);
      expect(/^\d{6}$/.test(code)).toBe(true);

      // First verification must succeed
      const valid = emailOtpService.verifyOtp(email, code);
      expect(valid).toBe(true);

      // Single-use guarantee: Replay must be rejected
      const replay = emailOtpService.verifyOtp(email, code);
      expect(replay).toBe(false);
    });

    it('locks out OTP after 5 failed verification attempts', () => {
      const email = 'security.test@manga.ng';
      const { code } = emailOtpService.generateOtp(email);

      for (let i = 0; i < 5; i++) {
        expect(emailOtpService.verifyOtp(email, '000000')).toBe(false);
      }

      // Even with correct code, 6th attempt is blocked because max attempts exceeded
      expect(emailOtpService.verifyOtp(email, code)).toBe(false);
    });
  });

  describe('6.3 Password Hashing & Constant-Time Verification', () => {
    it('generates distinct PBKDF2 hashes with different salts and verifies correctly', () => {
      const pass = 'SuperSecureP@ssw0rd2026';
      const salt1 = 'salt_abc_001';
      const salt2 = 'salt_xyz_002';

      const hash1 = authService.hashPassword(pass, salt1);
      const hash2 = authService.hashPassword(pass, salt2);

      expect(hash1).not.toBe(hash2);
      expect(authService.verifyPassword(pass, salt1, hash1)).toBe(true);
      expect(authService.verifyPassword('WrongPassword', salt1, hash1)).toBe(false);
      expect(authService.verifyPassword(pass, salt2, hash1)).toBe(false);
    });
  });

  describe('6.4 Full 2FA Authentication Flow (Step 1 + Step 2)', () => {
    it('Step 1: requires valid credentials and returns 2FA challenge', async () => {
      // Valid credentials
      const res = await authService.login('admin@manga.ng', 'AdminPass123!');
      expect(res.require2fa).toBe(true);
      expect(res.challengeToken).toBeDefined();
      expect(res.methods).toContain('google_authenticator');
      expect(res.methods).toContain('email');
      expect(res.user.role).toBe('ADMIN');
      expect(res.emailOtpSent).toBe(true);
    });

    it('Step 1: throws UnauthorizedException for invalid password', async () => {
      await expect(
        authService.login('admin@manga.ng', 'WrongPass!')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Step 1: throws UnauthorizedException for non-existent email', async () => {
      await expect(
        authService.login('unknown@manga.ng', 'SomePass123!')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Step 1: strictly enforces Role Separation when requestedRole does not match user role', async () => {
      // Buyer attempting to login to ADMIN portal
      await expect(
        authService.login('buyer@manga.ng', 'BuyerPass123!', 'ADMIN')
      ).rejects.toThrow(ForbiddenException);

      // Vendor attempting to login to ADMIN portal
      await expect(
        authService.login('vendor@manga.ng', 'VendorPass123!', 'ADMIN')
      ).rejects.toThrow(ForbiddenException);

      // Buyer attempting to login to VENDOR portal
      await expect(
        authService.login('buyer@manga.ng', 'BuyerPass123!', 'VENDOR')
      ).rejects.toThrow(ForbiddenException);

      // Admin logging in with role ADMIN succeeds
      const adminRes = await authService.login('admin@manga.ng', 'AdminPass123!', 'ADMIN');
      expect(adminRes.require2fa).toBe(true);
    });

    it('Step 2: successfully completes login via Google Authenticator TOTP', async () => {
      const challenge = await authService.login('admin@manga.ng', 'AdminPass123!');
      const totpCode = generateTotpCode(challenge.totpSecret);

      const loginResult = await authService.verify2fa(
        challenge.challengeToken,
        'google_authenticator',
        totpCode
      );

      expect(loginResult.success).toBe(true);
      expect(loginResult.token).toBeDefined();
      expect(loginResult.user.email).toBe('admin@manga.ng');
      expect(loginResult.user.role).toBe('ADMIN');
      expect(loginResult.user.permissions).toContain('admin:repair_tools');

      // Verify the generated Bearer JWT token
      const verified = authService.verifyToken(loginResult.token);
      expect(verified.email).toBe('admin@manga.ng');
      expect(verified.role).toBe('ADMIN');
    });

    it('Step 2: successfully completes login via Email OTP', async () => {
      const challenge = await authService.login('buyer@manga.ng', 'BuyerPass123!');
      const activeOtp = emailOtpService.getActiveOtpForTesting('buyer@manga.ng');
      expect(activeOtp).toBeDefined();

      const loginResult = await authService.verify2fa(
        challenge.challengeToken,
        'email',
        activeOtp!
      );

      expect(loginResult.success).toBe(true);
      expect(loginResult.user.role).toBe('BUYER');
    });

    it('Step 2: rejects invalid 2FA codes', async () => {
      const challenge = await authService.login('vendor@manga.ng', 'VendorPass123!');

      await expect(
        authService.verify2fa(challenge.challengeToken, 'google_authenticator', '000000')
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        authService.verify2fa(challenge.challengeToken, 'email', '000000')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Step 2: rejects tampered or expired challenge tokens', async () => {
      await expect(
        authService.verify2fa('invalid.token.structure', 'google_authenticator', '123456')
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('6.5 User Registration with 2FA Setup', () => {
    it('registers a new user with hashed credentials and generated TOTP secret', async () => {
      const regRes = await authService.register(
        'Ada Lovelace',
        'ada@manga.ng',
        'AdaStrongPass123!',
        'BUYER'
      );

      expect(regRes.user.email).toBe('ada@manga.ng');
      expect(regRes.user.role).toBe('BUYER');
      expect(regRes.totpSecret).toBeDefined();
      expect(regRes.otpAuthUrl).toContain('ada%40manga.ng');

      // Now authenticate as the newly registered user
      const challenge = await authService.login('ada@manga.ng', 'AdaStrongPass123!');
      const code = generateTotpCode(regRes.totpSecret);
      const verified = await authService.verify2fa(challenge.challengeToken, 'google_authenticator', code);
      expect(verified.success).toBe(true);
      expect(verified.user.name).toBe('Ada Lovelace');
    });

    it('prevents duplicate user registration with same email', async () => {
      await expect(
        authService.register('Duplicate', 'buyer@manga.ng', 'Pass123!')
      ).rejects.toThrow('An account with this email address already exists.');
    });
  });

  describe('6.6 RBAC RolesGuard Enforcement', () => {
    function mockExecutionContext(authHeader?: string, userRoleHeader?: string): ExecutionContext {
      const headers: Record<string, string> = {};
      if (authHeader) headers['authorization'] = authHeader;
      if (userRoleHeader) headers['x-user-role'] = userRoleHeader;

      return {
        getHandler: () => ({}),
        getClass: () => ({}),
        switchToHttp: () => ({
          getRequest: () => ({
            headers,
          }),
        }),
      } as unknown as ExecutionContext;
    }

    it('grants access when caller provides a verified JWT with required role', async () => {
      // Obtain valid admin token
      const challenge = await authService.login('admin@manga.ng', 'AdminPass123!');
      const code = generateTotpCode(challenge.totpSecret);
      const loginRes = await authService.verify2fa(challenge.challengeToken, 'google_authenticator', code);

      // Endpoint requiring ADMIN role
      reflector.getAllAndOverride = () => ['ADMIN'];

      const context = mockExecutionContext(`Bearer ${loginRes.token}`);
      const allowed = rolesGuard.canActivate(context);
      expect(allowed).toBe(true);
    });

    it('denies access (403 Forbidden) when user role is not authorized for endpoint', async () => {
      // Obtain valid buyer token
      const challenge = await authService.login('buyer@manga.ng', 'BuyerPass123!');
      const code = generateTotpCode(challenge.totpSecret);
      const loginRes = await authService.verify2fa(challenge.challengeToken, 'google_authenticator', code);

      // Endpoint requiring ADMIN role
      reflector.getAllAndOverride = () => ['ADMIN'];

      const context = mockExecutionContext(`Bearer ${loginRes.token}`);
      expect(() => rolesGuard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('denies access (401 Unauthorized) when no authorization header is provided', () => {
      reflector.getAllAndOverride = () => ['ADMIN'];
      const context = mockExecutionContext();
      expect(() => rolesGuard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('prevents role escalation: header spoofing without valid signed token fails', () => {
      reflector.getAllAndOverride = () => ['ADMIN'];
      // Malicious client tries to spoof `x-user-role: ADMIN` without token
      const context = mockExecutionContext(undefined, 'ADMIN');
      expect(() => rolesGuard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('rejects tampered or forged JWT tokens', () => {
      reflector.getAllAndOverride = () => ['ADMIN'];
      const fakeToken = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4ifQ.forged_signature';
      const context = mockExecutionContext(`Bearer ${fakeToken}`);
      expect(() => rolesGuard.canActivate(context)).toThrow(UnauthorizedException);
    });
  });
});
