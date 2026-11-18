import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { UserRole } from './roles.decorator.js';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'manga-platform-secret-key-2026-v1';
    if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
      console.warn('[SECURITY WARNING] JWT_SECRET is not set in production! Using fallback secret.');
    }
  }

  // Seeded directory of role-enforced platform accounts
  private readonly users: AuthUser[] = [
    {
      id: 'usr-buyer-001',
      name: 'Chidi Okonkwo',
      email: 'buyer@manga.ng',
      role: 'BUYER',
      permissions: ['catalog:read', 'orders:create', 'orders:read_own', 'reviews:write'],
    },
    {
      id: 'usr-vendor-001',
      name: 'Apex Electronics Ltd',
      email: 'vendor@manga.ng',
      role: 'VENDOR',
      permissions: [
        'vendor:orders_read',
        'vendor:orders_accept',
        'vendor:barcode_pack',
        'vendor:inventory_write',
        'vendor:payouts_request',
      ],
    },
    {
      id: 'usr-admin-001',
      name: 'Manga Operations Admin',
      email: 'admin@manga.ng',
      role: 'ADMIN',
      permissions: [
        'admin:disputes_arbitrate',
        'admin:ledger_health',
        'admin:repair_tools',
        'admin:vendor_kyc',
        'admin:catalog_moderate',
      ],
    },
  ];

  public async login(email: string, password?: string, requestedRole?: UserRole): Promise<LoginResult> {
    const normalizedEmail = (email || '').trim().toLowerCase();

    let user = this.users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      // Dynamic customer registration if not in seeded list
      const role: UserRole = requestedRole || 'BUYER';
      const name = normalizedEmail.split('@')[0];
      user = {
        id: `usr-${Date.now().toString(36)}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: normalizedEmail,
        role: role,
        permissions:
          role === 'ADMIN'
            ? ['admin:disputes_arbitrate', 'admin:ledger_health', 'admin:repair_tools']
            : role === 'VENDOR'
            ? ['vendor:orders_read', 'vendor:inventory_write']
            : ['catalog:read', 'orders:create'],
      };
    }

    const token = this.generateToken(user);

    return {
      token,
      user,
    };
  }

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
    } catch {
      throw new UnauthorizedException('Invalid or expired authentication session token.');
    }
  }

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
        endpoints: ['POST /admin/repair/replay-outbox', 'POST /admin/repair/reverse-ledger-tx'],
      },
    ];
  }

  private generateToken(user: AuthUser): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
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
