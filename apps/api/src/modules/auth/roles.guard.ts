import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  Inject,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, UserRole } from './roles.decorator.js';
import { AuthService, AuthUser } from './auth.service.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Optional() @Inject(AuthService) private authService?: AuthService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles specified on endpoint or controller, permit access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = (request.headers['authorization'] as string) || '';

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authentication required: Please provide a valid Bearer session token in the Authorization header.'
      );
    }

    const token = authHeader.slice(7).trim();
    let user: AuthUser;

    try {
      if (this.authService) {
        user = this.authService.verifyToken(token);
      } else {
        // Standalone fallback: verify signature using environment secret
        const crypto = require('crypto');
        const jwtSecret = process.env.JWT_SECRET || 'manga-platform-secret-key-2026-v1';
        const parts = token.split('.');
        if (parts.length !== 3) throw new Error('Invalid token structure');
        const [h, p, s] = parts;
        const expected = crypto.createHmac('sha256', jwtSecret).update(`${h}.${p}`).digest('base64url');
        if (s !== expected) throw new Error('Signature mismatch');
        const payload = JSON.parse(Buffer.from(p, 'base64url').toString('utf8'));
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
          throw new UnauthorizedException('Session token has expired.');
        }
        user = {
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          permissions: payload.permissions || [],
        };
      }
    } catch (err: any) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Authentication failed: Invalid or expired session token.');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Access Denied (RBAC): Your authenticated role [${user.role}] does not possess the required permission level [${requiredRoles.join(', ')}].`
      );
    }

    request.user = user;
    return true;
  }
}
