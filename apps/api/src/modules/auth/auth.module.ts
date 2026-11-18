import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { RolesGuard } from './roles.guard.js';
import { EmailOtpService } from './email-otp.service.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService, EmailOtpService, RolesGuard],
  exports: [AuthService, EmailOtpService, RolesGuard],
})
export class AuthModule {}
