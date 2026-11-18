import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { UserRole } from './roles.decorator.js';
import {
  generateTotpCode,
  verifyTotpCode,
  generateTotpSecret,
  getOtpAuthUrl,
} from './totp.util.js';
import { EmailOtpService } from './email-otp.service.js';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

export interface InternalUser extends AuthUser {
  passwordHash: string;
  salt: string;
  totpSecret: string;
  is2faEnabled: boolean;
}

export interface LoginChallengeResult {
  require2fa: true;
  challengeToken: string;
  methods: ('google_authenticator' | 'email')[];
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  totpSecret: string;
  otpAuthUrl: string;
  emailOtpSent: boolean;
  testOtp?: string;
}

export interface LoginSuccessResult {
  success: true;
  token: string;
  user: AuthUser;
}

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly users: Map<string, InternalUser> = new Map();

  constructor(public readonly emailOtpService: EmailOtpService) {
    this.jwtSecret = process.env.JWT_SECRET || 'manga-platform-secret-key-2026-v1';
    this.seedUsers();
  }

  /**
   * Hashes a password with PBKDF2 using SHA-512 and unique salt
   */
  public hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
  }

  /**
   * Validates a password against stored salt and hash using timing-safe comparison
   */
  public verifyPassword(password: string, salt: string, expectedHash: string): boolean {
    const computed = this.hashPassword(password, salt);
    try {
      return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(expectedHash, 'hex'));
    } catch {
      return false;
    }
  }

  /**
   * Seed default role-enforced platform accounts with real hashed passwords and 2FA secrets
   */
  private seedUsers(): void {
    const defaultAccounts: Array<{
      id: string;
      name: string;
      email: string;
      password: string;
      role: UserRole;
      permissions: string[];
      totpSecret: string;
    }> = [
      {
        id: 'usr-buyer-001',
        name: 'Chidi Okonkwo',
        email: 'buyer@manga.ng',
        password: 'BuyerPass123!',
        role: 'BUYER',
        permissions: ['catalog:read', 'orders:create', 'orders:read_own', 'reviews:write'],
        totpSecret: 'JBSWY3DPEHPK3PXP', // Base32 test secret
      },
      {
        id: 'usr-vendor-001',
        name: 'Apex Electronics Ltd',
        email: 'vendor@manga.ng',
        password: 'VendorPass123!',
        role: 'VENDOR',
        permissions: [
          'vendor:orders_read',
          'vendor:orders_accept',
          'vendor:barcode_pack',
          'vendor:inventory_write',
          'vendor:payouts_request',
        ],
        totpSecret: 'KRSXG5CTMVRXEZLU',
      },
      {
        id: 'usr-admin-001',
        name: 'Manga Operations Admin',
        email: 'admin@manga.ng',
        password: 'AdminPass123!',
        role: 'ADMIN',
        permissions: [
          'admin:disputes_arbitrate',
          'admin:ledger_health',
          'admin:repair_tools',
          'admin:vendor_kyc',
          'admin:catalog_moderate',
        ],
        totpSecret: 'MFRGGZDFMZTWQ2LK',
      },
    ];

    for (const acc of defaultAccounts) {
      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = this.hashPassword(acc.password, salt);
      this.users.set(acc.email.toLowerCase(), {
        id: acc.id,
        name: acc.name,
        email: acc.email.toLowerCase(),
        role: acc.role,
        permissions: acc.permissions,
        passwordHash,
        salt,
        totpSecret: acc.totpSecret,
        is2faEnabled: true,
      });
    }
  }

  /**
   * Primary authentication step: verifies email and password, enforces role constraints,
   * generates 2FA challenge and dispatches email OTP.
   */
  public async login(
    email: string,
    password?: string,
    requestedRole?: UserRole
  ): Promise<LoginChallengeResult> {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail || !password) {
      throw new UnauthorizedException('Email and password are required.');
    }

    const user = this.users.get(normalizedEmail);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Verify password against stored hash
    const isValidPassword = this.verifyPassword(password, user.salt, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Strict Role Separation check
    if (requestedRole && user.role !== requestedRole) {
      throw new ForbiddenException(
        `Role mismatch: Your authenticated account role is [${user.role}], which is not permitted for the [${requestedRole}] portal.`
      );
    }

    // Generate short-lived challenge token (5 minutes)
    const challengeToken = this.generateChallengeToken(user);

    // Dispatch email OTP
    const emailOtp = this.emailOtpService.generateOtp(user.email);

    return {
      require2fa: true,
      challengeToken,
      methods: ['google_authenticator', 'email'],
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      totpSecret: user.totpSecret,
      otpAuthUrl: getOtpAuthUrl(user.email, user.totpSecret),
      emailOtpSent: true,
      testOtp: process.env.NODE_ENV !== 'production' ? emailOtp.code : undefined,
    };
  }

  /**
   * Second factor authentication step: verifies 6-digit TOTP (Google Authenticator) or Email OTP.
   * Upon success, issues the verified Bearer JWT session token.
   */
  public async verify2fa(
    challengeToken: string,
    method: 'google_authenticator' | 'email',
    code: string
  ): Promise<LoginSuccessResult> {
    if (!challengeToken || !method || !code) {
      throw new BadRequestException('Challenge token, method, and 2FA code are required.');
    }

    // Verify and decode challenge token
    const challengePayload = this.verifyChallengeToken(challengeToken);
    const user = this.users.get(challengePayload.email.toLowerCase());

    if (!user) {
      throw new UnauthorizedException('User session associated with this challenge not found.');
    }

    let isCodeValid = false;

    if (method === 'google_authenticator') {
      isCodeValid = verifyTotpCode(user.totpSecret, code.trim());
      if (!isCodeValid) {
        throw new UnauthorizedException(
          'Invalid Google Authenticator 2FA code. Please verify the code in your authenticator app.'
        );
      }
    } else if (method === 'email') {
      isCodeValid = this.emailOtpService.verifyOtp(user.email, code.trim());
      if (!isCodeValid) {
        throw new UnauthorizedException(
          'Invalid or expired Email verification code. Please check your inbox or request a new code.'
        );
      }
    } else {
      throw new BadRequestException(`Unsupported 2FA method: [${method}].`);
    }

    // Generate signed Bearer JWT token
    const token = this.generateToken(user);

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    };
  }

  /**
   * Request / resend an Email OTP for an active challenge session
   */
  public async requestEmailOtp(challengeToken: string): Promise<{ success: boolean; message: string; testOtp?: string }> {
    const payload = this.verifyChallengeToken(challengeToken);
    const otp = this.emailOtpService.generateOtp(payload.email);

    return {
      success: true,
      message: `A new 6-digit verification code was dispatched to ${payload.email}.`,
      testOtp: process.env.NODE_ENV !== 'production' ? otp.code : undefined,
    };
  }

  /**
   * Register a new user account with hashed password and generated 2FA secret
   */
  public async register(
    name: string,
    email: string,
    password: string,
    role: UserRole = 'BUYER'
  ): Promise<{ user: AuthUser; totpSecret: string; otpAuthUrl: string }> {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail || !password || !name) {
      throw new BadRequestException('Name, email, and password are required.');
    }

    if (this.users.has(normalizedEmail)) {
      throw new BadRequestException('An account with this email address already exists.');
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = this.hashPassword(password, salt);
    const totpSecret = generateTotpSecret();

    const newUser: InternalUser = {
      id: `usr-${Date.now().toString(36)}`,
      name: name.trim(),
      email: normalizedEmail,
      role,
      permissions:
        role === 'ADMIN'
          ? ['admin:disputes_arbitrate', 'admin:ledger_health', 'admin:repair_tools']
          : role === 'VENDOR'
          ? ['vendor:orders_read', 'vendor:orders_accept', 'vendor:barcode_pack', 'vendor:inventory_write']
          : ['catalog:read', 'orders:create', 'orders:read_own'],
      passwordHash,
      salt,
      totpSecret,
      is2faEnabled: true,
    };

    this.users.set(normalizedEmail, newUser);

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        permissions: newUser.permissions,
      },
      totpSecret,
      otpAuthUrl: getOtpAuthUrl(newUser.email, totpSecret),
    };
  }

  /**
   * Cryptographically verifies the Bearer JWT token signature and expiry
   */
  public verifyToken(token: string): AuthUser {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token structure');
      }

      const [headerB64, payloadB64, signature] = parts;
      const expectedSig = crypto
        .createHmac('sha256', this.jwtSecret)
        .update(`${headerB64}.${payloadB64}`)
        .digest('base64url');

      if (signature !== expectedSig) {
        throw new Error('Invalid signature');
      }

      const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new UnauthorizedException('Session token has expired. Please sign in again.');
      }

      return {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        permissions: payload.permissions || [],
      };
    } catch (err: any) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Invalid or expired authentication session token.');
    }
  }

  /**
   * Role Directory describing portal access per role
   */
  public getRolesDirectory() {
    return [
      {
        role: 'BUYER',
        portal: 'Customer Storefront (Port 3000)',
        description: 'Discovers verified items, manages shopping bag, executes escrow-protected checkout, tracks deliveries.',
        endpoints: ['GET /catalog', 'POST /checkout', 'GET /tracking/:ref'],
      },
      {
        role: 'VENDOR',
        portal: 'Merchant Seller Console (Port 3001)',
        description: 'Accepts orders within 18h SLA, scans warehouse barcodes, prints shipping labels, manages stock levels.',
        endpoints: ['GET /v1/vendor/:id/warehouses', 'POST /v1/vendor/:id/imports'],
      },
      {
        role: 'ADMIN',
        portal: 'Platform Operations Admin Console (Port 3002)',
        description: 'Dispute arbitration, double-entry ledger audits, vendor accreditation/KYC, dual-authorization balancing entries.',
        endpoints: ['POST /admin/repair/replay-outbox', 'POST /admin/repair/reverse-ledger-tx', 'POST /v1/admin/disputes/:id/resolve'],
      },
    ];
  }

  /**
   * Helper to generate a 2FA challenge token
   */
  private generateChallengeToken(user: InternalUser): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'CHALLENGE' })).toString('base64url');
    const payload = Buffer.from(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        role: user.role,
        type: '2fa_challenge',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 300, // 5 minutes
      })
    ).toString('base64url');

    const signature = crypto
      .createHmac('sha256', this.jwtSecret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    return `${header}.${payload}.${signature}`;
  }

  /**
   * Helper to verify a 2FA challenge token
   */
  private verifyChallengeToken(token: string): { sub: string; email: string; role: UserRole } {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid challenge token structure');
      const [headerB64, payloadB64, signature] = parts;
      const expectedSig = crypto
        .createHmac('sha256', this.jwtSecret)
        .update(`${headerB64}.${payloadB64}`)
        .digest('base64url');

      if (signature !== expectedSig) throw new Error('Invalid signature');

      const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
      if (payload.type !== '2fa_challenge') throw new Error('Not a 2FA challenge token');
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new UnauthorizedException('2FA challenge has expired. Please sign in again.');
      }

      return {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch (err: any) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Invalid or expired 2FA challenge token.');
    }
  }

  /**
   * Helper to generate full authenticated JWT Bearer token
   */
  public generateToken(user: AuthUser): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
        amr: ['pwd', '2fa'],
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days
      })
    ).toString('base64url');

    const signature = crypto
      .createHmac('sha256', this.jwtSecret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    return `${header}.${payload}.${signature}`;
  }
}
