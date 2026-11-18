import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UserRole } from './roles.decorator.js';

export class LoginDto {
  email!: string;
  password!: string;
  requestedRole?: UserRole;
}

export class Verify2faDto {
  challengeToken!: string;
  method!: 'google_authenticator' | 'email';
  code!: string;
}

export class RequestEmailOtpDto {
  challengeToken!: string;
}

export class RegisterDto {
  name!: string;
  email!: string;
  password!: string;
  role?: UserRole;
}

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Primary authentication step: Validates email and password, checks role separation,
   * generates 2FA challenge and dispatches email OTP.
   */
  @Post('login')
  public async login(@Body() body: LoginDto) {
    if (!body || !body.email || !body.password) {
      throw new BadRequestException('Email and password are required for authentication.');
    }
    return await this.authService.login(body.email, body.password, body.requestedRole);
  }

  /**
   * Second-factor verification step: Verifies 6-digit Google Authenticator code or Email OTP.
   * Upon successful verification, returns verified Bearer JWT session token.
   */
  @Post('verify-2fa')
  public async verify2fa(@Body() body: Verify2faDto) {
    if (!body || !body.challengeToken || !body.method || !body.code) {
      throw new BadRequestException('Challenge token, 2FA method, and verification code are required.');
    }
    return await this.authService.verify2fa(body.challengeToken, body.method, body.code);
  }

  /**
   * Request / resend an email verification OTP for an active login challenge
   */
  @Post('request-email-otp')
  public async requestEmailOtp(@Body() body: RequestEmailOtpDto) {
    if (!body || !body.challengeToken) {
      throw new BadRequestException('Challenge token is required to dispatch an email OTP.');
    }
    return await this.authService.requestEmailOtp(body.challengeToken);
  }

  /**
   * Register a new user account with role assignment and 2FA credential initialization
   */
  @Post('register')
  public async register(@Body() body: RegisterDto) {
    if (!body || !body.name || !body.email || !body.password) {
      throw new BadRequestException('Name, email, and password are required for registration.');
    }
    return await this.authService.register(body.name, body.email, body.password, body.role);
  }

  /**
   * Verifies the authenticity and expiration of a Bearer session token
   */
  @Get('verify')
  public async verify(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header with Bearer token is required.');
    }
    const token = authHeader.slice(7).trim();
    const user = this.authService.verifyToken(token);
    return { valid: true, user };
  }

  /**
   * Returns metadata and capabilities per user role
   */
  @Get('roles-directory')
  public getRolesDirectory() {
    return {
      status: 'active',
      roles: this.authService.getRolesDirectory(),
    };
  }
}
