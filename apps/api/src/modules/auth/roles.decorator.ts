import { SetMetadata } from '@nestjs/common';

export type UserRole = 'BUYER' | 'VENDOR' | 'ADMIN';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
