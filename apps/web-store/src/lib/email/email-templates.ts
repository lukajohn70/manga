/**
 * MANGA MARKETSQUARE — Responsive HTML Email Templates
 * Designed for optimal rendering across Gmail, Apple Mail, Outlook, and mobile clients.
 */

const BASE_STYLES = `
  body {
    margin: 0;
    padding: 0;
    background-color: #FAF6F0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #2A2320;
    -webkit-font-smoothing: antialiased;
  }
  .container {
    max-width: 600px;
    margin: 30px auto;
    background: #ffffff;
    border-radius: 20px;
    border: 1px solid #E7D5BC;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(42, 35, 32, 0.05);
  }
  .header {
    background: #2A2320;
    padding: 32px 24px;
    text-align: center;
    border-bottom: 3px solid #B5532E;
  }
  .logo-title {
    color: #FAF6F0;
    font-size: 22px;
    font-weight: 900;
    letter-spacing: 1.5px;
    margin: 0;
    text-transform: uppercase;
  }
  .logo-subtitle {
    color: #D9A441;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-top: 4px;
  }
  .content {
    padding: 36px 32px;
    line-height: 1.6;
    font-size: 14px;
    color: #4A3E39;
  }
  .heading {
    font-size: 20px;
    font-weight: 800;
    color: #2A2320;
    margin-top: 0;
    margin-bottom: 12px;
  }
  .otp-box {
    background: #FAF6F0;
    border: 2px dashed #B5532E;
    border-radius: 14px;
    padding: 24px;
    text-align: center;
    margin: 28px 0;
  }
  .otp-code {
    font-size: 34px;
    font-weight: 900;
    font-family: 'Courier New', monospace;
    letter-spacing: 8px;
    color: #B5532E;
    margin: 0;
  }
  .btn {
    display: inline-block;
    background: #B5532E;
    color: #ffffff !important;
    text-decoration: none;
    font-weight: bold;
    font-size: 14px;
    padding: 14px 32px;
    border-radius: 12px;
    margin: 20px 0;
  }
  .badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
  }
  .badge-green {
    background: #F0F6EE;
    color: #4F6B3A;
    border: 1px solid #D2E4CC;
  }
  .footer {
    background: #FAF6F0;
    padding: 24px 32px;
    text-align: center;
    font-size: 12px;
    color: #8C8279;
    border-top: 1px solid #E7D5BC;
  }
  .footer a {
    color: #B5532E;
    text-decoration: none;
    font-weight: 600;
  }
  table.items {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }
  table.items th {
    background: #FAF6F0;
    color: #2A2320;
    font-size: 12px;
    font-weight: bold;
    text-align: left;
    padding: 10px 12px;
    border-bottom: 1px solid #E7D5BC;
  }
  table.items td {
    padding: 12px;
    border-bottom: 1px solid #F0E6D8;
    font-size: 13px;
  }
`;

function wrapTemplate(title: string, bodyContent: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    ${BASE_STYLES}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo-title">MANGA</h1>
      <div class="logo-subtitle">MARKETSQUARE • VERIFIED COMMERCE</div>
    </div>
    <div class="content">
      ${bodyContent}
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0;">
        &copy; ${new Date().getFullYear()} MANGA MARKETSQUARE. All rights reserved.
      </p>
      <p style="margin: 0 0 12px 0;">
        Same-Day Delivery in Kaduna • Reliable Nationwide Courier Dispatch
      </p>
      <p style="margin: 0;">
        <a href="https://manga.jlm.com.ng/privacy-policy">Privacy Policy</a> &bull;
        <a href="https://manga.jlm.com.ng/terms-of-service">Terms of Service</a> &bull;
        <a href="https://manga.jlm.com.ng/escrow-agreement">Buyer Protection</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * 1. Email Verification OTP Template
 */
export function renderOtpEmailTemplate(otp: string, email: string): { subject: string; html: string; text: string } {
  const subject = `${otp} is your Manga Marketsquare verification code`;

  const html = wrapTemplate(
    'Verify Your Email Address',
    `
      <div style="margin-bottom: 20px;">
        <span class="badge badge-green">&#10003; Verification Security</span>
      </div>
      <h2 class="heading">Verify Your Email Address</h2>
      <p>Hello,</p>
      <p>
        Thank you for choosing <strong>MANGA MARKETSQUARE</strong>. Use the 6-digit verification code below to verify your email address (<strong>${email}</strong>) and complete your buyer registration:
      </p>

      <div class="otp-box">
        <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; color: #8C8279; font-weight: bold; letter-spacing: 1px;">
          Your 6-Digit Code
        </p>
        <p class="otp-code">${otp}</p>
        <p style="margin: 8px 0 0 0; font-size: 11px; color: #8C8279;">
          Valid for <strong>15 minutes</strong> &bull; Single-use
        </p>
      </div>

      <p style="font-size: 12px; color: #8C8279; line-height: 1.5;">
        <strong>Security Notice:</strong> If you did not request this verification code, please ignore this email. Manga will never ask you for your code or password via phone or message.
      </p>
    `
  );

  const text = `MANGA MARKETSQUARE - Email Verification\n\nYour 6-digit verification code is: ${otp}\n\nThis code is valid for 15 minutes. If you did not request this code, please ignore this email.`;

  return { subject, html, text };
}

/**
 * 2. Password Reset Email Template
 */
export function renderPasswordResetEmailTemplate(
  resetUrl: string,
  email: string,
  token: string
): { subject: string; html: string; text: string } {
  const subject = 'Reset your Manga Marketsquare password';

  const html = wrapTemplate(
    'Password Reset Request',
    `
      <div style="margin-bottom: 20px;">
        <span class="badge" style="background: #FEF7ED; color: #B5532E; border: 1px solid #F3E2CB;">
          Account Security
        </span>
      </div>
      <h2 class="heading">Reset Your Password</h2>
      <p>Hello,</p>
      <p>
        We received a request to reset the password for your Manga account associated with <strong>${email}</strong>.
      </p>
      <p>Click the button below to set a new password. This link is single-use and valid for <strong>15 minutes</strong>:</p>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${resetUrl}" class="btn">Reset Password &rarr;</a>
      </div>

      <div style="background: #FAF6F0; border-radius: 12px; padding: 14px; font-size: 12px; color: #6B5E57; word-break: break-all;">
        <p style="margin: 0 0 6px 0; font-weight: bold; color: #2A2320;">Direct Link / Manual Token:</p>
        <p style="margin: 0 0 6px 0;">Token: <code style="font-family: monospace; font-weight: bold; color: #B5532E;">${token}</code></p>
        <p style="margin: 0;"><a href="${resetUrl}" style="color: #B5532E;">${resetUrl}</a></p>
      </div>

      <p style="font-size: 12px; color: #8C8279; margin-top: 24px;">
        If you did not request a password reset, you can safely disregard this message. Your account remains secure.
      </p>
    `
  );

  const text = `MANGA MARKETSQUARE - Password Reset\n\nReset your password here: ${resetUrl}\n\nReset Token: ${token}\n\nThis link is valid for 15 minutes. If you did not make this request, please ignore this email.`;

  return { subject, html, text };
}

/**
 * 3. Order Confirmation & Receipt Template
 */
export function renderOrderConfirmationEmailTemplate(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ title: string; quantity: number; price: number }>;
  totalAmount: number;
  deliveryAddress: string;
  isKadunaSameDay?: boolean;
  trackingUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = `Order Confirmed: ${order.orderNumber} — Manga Marketsquare`;

  const formattedTotal = Number(order.totalAmount).toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  });

  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td><strong>${item.title}</strong></td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right; font-weight: bold;">
            ${Number(item.price * item.quantity).toLocaleString('en-NG', {
              style: 'currency',
              currency: 'NGN',
              maximumFractionDigits: 0,
            })}
          </td>
        </tr>
      `
    )
    .join('');

  const html = wrapTemplate(
    'Order Confirmation',
    `
      <div style="margin-bottom: 20px;">
        <span class="badge badge-green">&#10003; Order Confirmed &amp; Protected</span>
        ${
          order.isKadunaSameDay
            ? '<span class="badge" style="background: #FEF7ED; color: #B5532E; border: 1px solid #F3E2CB; margin-left: 6px;">Kaduna Express Same-Day</span>'
            : ''
        }
      </div>

      <h2 class="heading">Thank you for your order, ${order.customerName}!</h2>
      <p>
        Your order <strong>#${order.orderNumber}</strong> has been received and is being prepared by our verified sellers under Manga Buyer Protection.
      </p>

      <table class="items">
        <thead>
          <tr>
            <th>Item</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr style="background: #FAF6F0; font-weight: 800;">
            <td colspan="2" style="font-size: 14px; color: #2A2320;">Order Total</td>
            <td style="text-align: right; font-size: 16px; color: #B5532E;">${formattedTotal}</td>
          </tr>
        </tbody>
      </table>

      <div style="background: #FAF6F0; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 12px;">
        <h4 style="margin: 0 0 6px 0; font-size: 13px; color: #2A2320;">Delivery Destination:</h4>
        <p style="margin: 0; color: #6B5E57;">${order.deliveryAddress}</p>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${order.trackingUrl}" class="btn">Track Order Live &rarr;</a>
      </div>

      <p style="font-size: 12px; color: #8C8279;">
        Need assistance with your delivery? Contact our 24/7 support desk at <a href="mailto:support@marketsquare.ng" style="color: #B5532E;">support@marketsquare.ng</a>.
      </p>
    `
  );

  const text = `MANGA MARKETSQUARE - Order Confirmation\n\nOrder Number: ${order.orderNumber}\nCustomer: ${order.customerName}\nTotal: ${formattedTotal}\n\nTrack your order: ${order.trackingUrl}`;

  return { subject, html, text };
}

/**
 * 4. Merchant Welcome Template
 */
export function renderMerchantWelcomeEmailTemplate(merchant: {
  businessName: string;
  ownerName: string;
  email: string;
}): { subject: string; html: string; text: string } {
  const subject = `Welcome to Manga Partner Network — ${merchant.businessName}`;

  const html = wrapTemplate(
    'Merchant Welcome',
    `
      <div style="margin-bottom: 20px;">
        <span class="badge badge-green">&#10003; Merchant Application Received</span>
      </div>

      <h2 class="heading">Welcome aboard, ${merchant.ownerName}!</h2>
      <p>
        Thank you for registering <strong>${merchant.businessName}</strong> on the Manga Marketsquare Merchant Partner Network.
      </p>

      <p>
        Our merchant verification team is reviewing your registration details. As a verified seller, you enjoy:
      </p>
      <ul style="padding-left: 20px; line-height: 1.8;">
        <li>Zero setup fees and instant product indexing.</li>
        <li>Doorstep rider pickups in Kaduna, Kano, Abuja, and nationwide.</li>
        <li>Guaranteed escrow disbursements upon confirmed customer delivery.</li>
      </ul>

      <div style="text-align: center; margin: 28px 0;">
        <a href="https://manga.jlm.com.ng/sell" class="btn">Access Merchant Console &rarr;</a>
      </div>

      <p style="font-size: 12px; color: #8C8279;">
        Have questions? Contact our Merchant Success team at <a href="mailto:vendors@manga.ng" style="color: #B5532E;">vendors@manga.ng</a>.
      </p>
    `
  );

  const text = `MANGA MARKETSQUARE - Merchant Registration\n\nWelcome ${merchant.ownerName} (${merchant.businessName}) to Manga Marketsquare Partner Network. Access your console: https://manga.jlm.com.ng/sell`;

  return { subject, html, text };
}

/**
 * 5. Test Email Template (for diagnostics & SMTP setup validation)
 */
export function renderTestEmailTemplate(recipient: string): { subject: string; html: string; text: string } {
  const subject = 'Test Dispatch: Manga Marketsquare Mail Service is Active';

  const html = wrapTemplate(
    'Mailing System Test',
    `
      <div style="margin-bottom: 20px;">
        <span class="badge badge-green">&#10003; SMTP Delivery Verified</span>
      </div>

      <h2 class="heading">Mailing System Operational</h2>
      <p>Hello,</p>
      <p>
        This is an automated diagnostic test from <strong>MANGA MARKETSQUARE</strong>. If you are reading this email, your mailing configuration (SMTP / Node Transport) is configured and dispatching successfully to <strong>${recipient}</strong>.
      </p>

      <div style="background: #FAF6F0; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 12px; font-family: monospace;">
        <div><strong>Timestamp:</strong> ${new Date().toISOString()}</div>
        <div><strong>Platform:</strong> Next.js 15 / Manga Mail Service</div>
        <div><strong>Status:</strong> Delivered via TLS/SSL</div>
      </div>
    `
  );

  const text = `MANGA MARKETSQUARE - Test Email\n\nYour mailing configuration is active and working. Sent to: ${recipient} at ${new Date().toISOString()}`;

  return { subject, html, text };
}
