import { Controller, Post, Get, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UserRole } from './roles.decorator.js';

export class LoginDto {
  email!: string;
  password?: string;
  requestedRole?: UserRole;
}

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(@Body() body: LoginDto) {
    return await this.authService.login(body.email, body.password, body.requestedRole);
  }

  @Get('verify')
  public async verify(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header with Bearer token is required.');
    }
    const token = authHeader.slice(7);
    const user = this.authService.verifyToken(token);
    return { valid: true, user };
  }

  @Get('roles-directory')
  public getRolesDirectory() {
    return {
      status: 'active',
      roles: this.authService.getRolesDirectory(),
    };
  }
}
