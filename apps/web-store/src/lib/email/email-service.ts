import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs';
import path from 'path';
import {
  renderOtpEmailTemplate,
  renderPasswordResetEmailTemplate,
  renderOrderConfirmationEmailTemplate,
  renderMerchantWelcomeEmailTemplate,
  renderTestEmailTemplate,
} from './email-templates';

export interface EmailConfig {
  host?: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  fromName: string;
  fromAddress: string;
  isConfigured: boolean;
}

// In-memory cache for loaded email configuration
let cachedConfig: EmailConfig | null = null;
let transporter: Transporter | null = null;
let fallbackTransporter: Transporter | null = null;

/**
 * Normalizes environment values by stripping matched surrounding single or double quotes
 * while preserving internal characters, special symbols, and spaces.
 */
function stripQuotes(val: string): string {
  const trimmed = val.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

/**
 * Normalizes mail hostname to avoid known DNS NXDOMAIN errors.
 * e.g. "mail.manga.jlm.com.ng" does not exist in DNS; cPanel uses "mail.jlm.com.ng".
 */
function normalizeMailHost(host?: string): string {
  if (!host) return 'mail.jlm.com.ng';
  const clean = host.trim().toLowerCase();
  if (
    clean === 'mail.manga.jlm.com.ng' ||
    clean === 'smtp.manga.jlm.com.ng' ||
    clean === 'manga.jlm.com.ng'
  ) {
    return 'mail.jlm.com.ng';
  }
  return host.trim();
}

/**
 * Loads SMTP configuration from process.env or .env files on disk (including cPanel root).
 * Does not freeze cache if configuration is incomplete, allowing dynamic detection on disk changes.
 */
export function getEmailConfig(forceRefresh: boolean = false): EmailConfig {
  if (!forceRefresh && cachedConfig && cachedConfig.isConfigured) {
    return cachedConfig;
  }

  // Attempt to scan .env files if SMTP_HOST or SMTP_PASS is missing or if refreshing
  try {
    const candidates = [
      path.join(process.cwd(), '.env'),
      path.join(process.cwd(), '..', '.env'),
      path.join(process.cwd(), '.env.local'),
      '/home/gwylvxeo/manga.jlm.com.ng/.env',
      '/home/gwylvxeo/manga.jlm.com.ng/apps/web-store/.env',
      '/home/gwylvxeo/.env',
    ];

    for (const file of candidates) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        for (const line of content.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx > 0) {
            const key = trimmed.slice(0, eqIdx).trim();
            const rawVal = trimmed.slice(eqIdx + 1);
            const val = stripQuotes(rawVal);
            if (val && (!process.env[key] || forceRefresh)) {
              process.env[key] = val;
            }
          }
        }
      }
    }
  } catch (err: any) {
    console.warn('[Email Service] Environment scan notice:', err.message);
  }

  const rawHost = process.env.SMTP_HOST || process.env.MAIL_HOST;
  const host = rawHost ? normalizeMailHost(rawHost) : undefined;
  const port = parseInt(process.env.SMTP_PORT || process.env.MAIL_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = stripQuotes(process.env.SMTP_USER || process.env.MAIL_USER || process.env.MAIL_USERNAME || '');
  const pass = stripQuotes(process.env.SMTP_PASS || process.env.MAIL_PASS || process.env.MAIL_PASSWORD || '');
  const fromName = stripQuotes(process.env.MAIL_FROM_NAME || 'MANGA MARKETSQUARE');
  const fromAddress = stripQuotes(process.env.MAIL_FROM_ADDRESS || user || 'support@manga.jlm.com.ng');

  const isConfigured = Boolean(
    host &&
    user &&
    pass &&
    pass !== 'YourEmailPasswordHere' &&
    pass !== 'YourActualPassword'
  );

  const config: EmailConfig = {
    host,
    port,
    secure,
    user,
    pass,
    fromName,
    fromAddress,
    isConfigured,
  };

  // Only cache if fully configured
  if (isConfigured) {
    cachedConfig = config;
  } else {
    cachedConfig = null;
    transporter = null;
    fallbackTransporter = null;
  }

  return config;
}

/**
 * Returns or creates the primary Nodemailer transporter (default Port 465 SSL).
 */
function getTransporter(): Transporter | null {
  const config = getEmailConfig();
  if (!config.isConfigured || !config.host) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      tls: {
        // Prevent cPanel wildcard / self-signed certificate mismatch drops
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }

  return transporter;
}

/**
 * Returns or creates a fallback transporter using Port 587 (STARTTLS)
 * in case Port 465 SSL is blocked or times out.
 */
function getFallbackTransporter(): Transporter | null {
  const config = getEmailConfig();
  if (!config.isConfigured || !config.host) return null;

  if (!fallbackTransporter) {
    fallbackTransporter = nodemailer.createTransport({
      host: config.host,
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: config.user,
        pass: config.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }

  return fallbackTransporter;
}

/**
 * Dispatches an email with automatic fallback logging if SMTP is not configured.
 */
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ success: boolean; simulated: boolean; messageId?: string; error?: string }> {
  const config = getEmailConfig();
  const tx = getTransporter();

  const from = `"${config.fromName}" <${config.fromAddress}>`;

  // 1. Live SMTP Mode
  if (tx && config.isConfigured) {
    try {
      const info = await tx.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      console.log(`[Email Service] Live email sent to ${options.to} via Port ${config.port}. MessageId: ${info.messageId}`);
      return {
        success: true,
        simulated: false,
        messageId: info.messageId,
      };
    } catch (primaryErr: any) {
      console.warn(`[Email Service] Primary SMTP port ${config.port} failed: ${primaryErr.message}. Attempting fallback port 587...`);

      // Attempt fallback on Port 587 (STARTTLS)
      const fallbackTx = getFallbackTransporter();
      if (fallbackTx && config.port !== 587) {
        try {
          const fbInfo = await fallbackTx.sendMail({
            from,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
          });

          console.log(`[Email Service] Fallback email sent to ${options.to} via Port 587. MessageId: ${fbInfo.messageId}`);
          return {
            success: true,
            simulated: false,
            messageId: fbInfo.messageId,
          };
        } catch (fallbackErr: any) {
          console.error(`[Email Service] Fallback port 587 also failed:`, fallbackErr.message);
          return {
            success: false,
            simulated: false,
            error: `Primary (port ${config.port}): ${primaryErr.message} | Fallback (port 587): ${fallbackErr.message}`,
          };
        }
      }

      return {
        success: false,
        simulated: false,
        error: primaryErr.message,
      };
    }
  }

  // 2. Simulated/Development Fallback Mode
  console.log(`
================================================================================
[Email Service — Simulated Dispatch (SMTP not configured or in dev mode)]
From: ${from}
To: ${options.to}
Subject: ${options.subject}
--------------------------------------------------------------------------------
${options.text}
================================================================================
  `.trim());

  return {
    success: true,
    simulated: true,
    messageId: `simulated-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
  };
}

/**
 * 1. Sends 6-Digit Email Verification OTP
 */
export async function sendVerificationOtpEmail(to: string, otp: string) {
  const template = renderOtpEmailTemplate(otp, to);
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * 2. Sends Password Reset Link & Token
 */
export async function sendPasswordResetEmail(to: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_STORE_URL || 'https://manga.jlm.com.ng';
  const resetUrl = `${baseUrl}/account/login?token=${encodeURIComponent(token)}&email=${encodeURIComponent(to)}`;
  const template = renderPasswordResetEmailTemplate(resetUrl, to, token);
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * 3. Sends Order Confirmation & Digital Receipt
 */
export async function sendOrderConfirmationEmail(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ title: string; quantity: number; price: number }>;
  totalAmount: number;
  deliveryAddress: string;
  isKadunaSameDay?: boolean;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_STORE_URL || 'https://manga.jlm.com.ng';
  const trackingUrl = `${baseUrl}/track-order?ref=${encodeURIComponent(order.orderNumber)}`;

  const template = renderOrderConfirmationEmailTemplate({
    ...order,
    trackingUrl,
  });

  return sendEmail({
    to: order.customerEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * 4. Sends Merchant Welcome Email
 */
export async function sendMerchantWelcomeEmail(merchant: {
  businessName: string;
  ownerName: string;
  email: string;
}) {
  const template = renderMerchantWelcomeEmailTemplate(merchant);
  return sendEmail({
    to: merchant.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * 5. Sends Test Diagnostic Email
 */
export async function sendTestEmail(to: string) {
  const template = renderTestEmailTemplate(to);
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Verifies SMTP Connection credentials with the mail server.
 */
export async function verifySmtpConnection(): Promise<{
  configured: boolean;
  connected: boolean;
  host?: string;
  port?: number;
  user?: string;
  error?: string;
}> {
  const config = getEmailConfig();
  if (!config.isConfigured) {
    return {
      configured: false,
      connected: false,
      host: config.host || 'Not configured',
      port: config.port,
      user: config.user || 'None',
      error: 'SMTP_HOST, SMTP_USER, or SMTP_PASS not set in environment or .env file.',
    };
  }

  const tx = getTransporter();
  if (!tx) {
    return {
      configured: false,
      connected: false,
      error: 'Could not initialize transporter.',
    };
  }

  try {
    await tx.verify();
    return {
      configured: true,
      connected: true,
      host: config.host,
      port: config.port,
      user: config.user,
    };
  } catch (primaryErr: any) {
    // Try fallback on Port 587
    const fallbackTx = getFallbackTransporter();
    if (fallbackTx && config.port !== 587) {
      try {
        await fallbackTx.verify();
        return {
          configured: true,
          connected: true,
          host: config.host,
          port: 587,
          user: config.user,
        };
      } catch (fbErr: any) {
        return {
          configured: true,
          connected: false,
          host: config.host,
          port: config.port,
          user: config.user,
          error: `Port ${config.port} failed: ${primaryErr.message} | Port 587 failed: ${fbErr.message}`,
        };
      }
    }

    return {
      configured: true,
      connected: false,
      host: config.host,
      port: config.port,
      user: config.user,
      error: primaryErr.message,
    };
  }
}
