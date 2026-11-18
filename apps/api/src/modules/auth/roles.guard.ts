import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, UserRole } from './roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

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

    // Extract role from header, authorization bearer, or query
    let userRole = (request.headers['x-user-role'] as string || '').toUpperCase() as UserRole;

    // Fallback: Check Bearer token payload if provided
    const authHeader = request.headers['authorization'] as string;
    if (!userRole && authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        const decoded = JSON.parse(Buffer.from(token.split('.')[1] || token, 'base64').toString('utf8'));
        if (decoded && decoded.role) {
          userRole = decoded.role.toUpperCase() as UserRole;
        }
      } catch {
        // Fallback or ignore
      }
    }

    if (!userRole) {
      throw new UnauthorizedException(
        'Authentication required: Please provide valid credentials with a user role claim (e.g. x-user-role or Authorization: Bearer <token>).'
      );
    }

    const hasRole = requiredRoles.includes(userRole);
    if (!hasRole) {
      throw new ForbiddenException(
        `Access Denied (RBAC): Your authenticated role [${userRole}] does not possess the required permission level [${requiredRoles.join(', ')}].`
      );
    }

    request.user = {
      ...(request.user || {}),
      role: userRole,
    };

    return true;
  }
}
