"use strict";exports.id=940,exports.ids=[940],exports.modules={90940:(a,b,c)=>{c.d(b,{xn:()=>m,JD:()=>s,m_:()=>r,J1:()=>q,FI:()=>t,TM:()=>p,s7:()=>u});var d=c(7005),e=c(29021),f=c.n(e),g=c(33873),h=c.n(g);let i=`
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
`;function j(a,b){return`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${a}</title>
  <style>
    ${i}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo-title">MANGA</h1>
      <div class="logo-subtitle">MARKETSQUARE • VERIFIED COMMERCE</div>
    </div>
    <div class="content">
      ${b}
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
  `.trim()}let k=null,l=null;function m(){if(k)return k;if(!process.env.SMTP_HOST)try{for(let a of[h().join(process.cwd(),".env"),h().join(process.cwd(),"..",".env"),h().join(process.cwd(),".env.local"),"/home/gwylvxeo/manga.jlm.com.ng/.env","/home/gwylvxeo/manga.jlm.com.ng/apps/web-store/.env"])if(f().existsSync(a))for(let b of f().readFileSync(a,"utf8").split(/\r?\n/)){let a=b.trim();if(!a||a.startsWith("#"))continue;let c=a.indexOf("=");if(c>0){let b=a.slice(0,c).trim(),d=a.slice(c+1).trim().replace(/^["']|["']$/g,"");!process.env[b]&&d&&(process.env[b]=d)}}}catch{}let a=process.env.SMTP_HOST||process.env.MAIL_HOST,b=parseInt(process.env.SMTP_PORT||process.env.MAIL_PORT||"465",10),c="true"===process.env.SMTP_SECURE||465===b,d=process.env.SMTP_USER||process.env.MAIL_USER||process.env.MAIL_USERNAME,e=process.env.SMTP_PASS||process.env.MAIL_PASS||process.env.MAIL_PASSWORD,g=process.env.MAIL_FROM_NAME||"MANGA MARKETSQUARE",i=process.env.MAIL_FROM_ADDRESS||d||"support@manga.jlm.com.ng";return k={host:a,port:b,secure:c,user:d,pass:e,fromName:g,fromAddress:i,isConfigured:!!(a&&d&&e)}}function n(){let a=m();return a.isConfigured?(l||(l=d.Ay.createTransport({host:a.host,port:a.port,secure:a.secure,auth:{user:a.user,pass:a.pass},tls:{rejectUnauthorized:!1}})),l):null}async function o(a){let b=m(),c=n(),d=`"${b.fromName}" <${b.fromAddress}>`;if(c&&b.isConfigured)try{let b=await c.sendMail({from:d,to:a.to,subject:a.subject,html:a.html,text:a.text});return console.log(`[Email Service] Live email sent to ${a.to}. MessageId: ${b.messageId}`),{success:!0,simulated:!1,messageId:b.messageId}}catch(b){return console.error(`[Email Service] Failed to send live email to ${a.to}:`,b.message),{success:!1,simulated:!1,error:b.message}}return console.log(`
================================================================================
[Email Service — Simulated Dispatch (SMTP not configured or in dev mode)]
From: ${d}
To: ${a.to}
Subject: ${a.subject}
--------------------------------------------------------------------------------
${a.text}
================================================================================
  `.trim()),{success:!0,simulated:!0,messageId:`simulated-${Date.now()}-${Math.random().toString(36).substring(2,9)}`}}async function p(a,b){let c=function(a,b){let c=`${a} is your Manga Marketsquare verification code`;return{subject:c,html:j("Verify Your Email Address",`
      <div style="margin-bottom: 20px;">
        <span class="badge badge-green">&#10003; Verification Security</span>
      </div>
      <h2 class="heading">Verify Your Email Address</h2>
      <p>Hello,</p>
      <p>
        Thank you for choosing <strong>MANGA MARKETSQUARE</strong>. Use the 6-digit verification code below to verify your email address (<strong>${b}</strong>) and complete your buyer registration:
      </p>

      <div class="otp-box">
        <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; color: #8C8279; font-weight: bold; letter-spacing: 1px;">
          Your 6-Digit Code
        </p>
        <p class="otp-code">${a}</p>
        <p style="margin: 8px 0 0 0; font-size: 11px; color: #8C8279;">
          Valid for <strong>15 minutes</strong> &bull; Single-use
        </p>
      </div>

      <p style="font-size: 12px; color: #8C8279; line-height: 1.5;">
        <strong>Security Notice:</strong> If you did not request this verification code, please ignore this email. Manga will never ask you for your code or password via phone or message.
      </p>
    `),text:`MANGA MARKETSQUARE - Email Verification

Your 6-digit verification code is: ${a}

This code is valid for 15 minutes. If you did not request this code, please ignore this email.`}}(b,a);return o({to:a,subject:c.subject,html:c.html,text:c.text})}async function q(a,b){var c,d,e;let f=process.env.NEXT_PUBLIC_STORE_URL||"https://manga.jlm.com.ng",g=(c=`${f}/account/login?token=${encodeURIComponent(b)}&email=${encodeURIComponent(a)}`,d=a,e=b,{subject:"Reset your Manga Marketsquare password",html:j("Password Reset Request",`
      <div style="margin-bottom: 20px;">
        <span class="badge" style="background: #FEF7ED; color: #B5532E; border: 1px solid #F3E2CB;">
          Account Security
        </span>
      </div>
      <h2 class="heading">Reset Your Password</h2>
      <p>Hello,</p>
      <p>
        We received a request to reset the password for your Manga account associated with <strong>${d}</strong>.
      </p>
      <p>Click the button below to set a new password. This link is single-use and valid for <strong>15 minutes</strong>:</p>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${c}" class="btn">Reset Password &rarr;</a>
      </div>

      <div style="background: #FAF6F0; border-radius: 12px; padding: 14px; font-size: 12px; color: #6B5E57; word-break: break-all;">
        <p style="margin: 0 0 6px 0; font-weight: bold; color: #2A2320;">Direct Link / Manual Token:</p>
        <p style="margin: 0 0 6px 0;">Token: <code style="font-family: monospace; font-weight: bold; color: #B5532E;">${e}</code></p>
        <p style="margin: 0;"><a href="${c}" style="color: #B5532E;">${c}</a></p>
      </div>

      <p style="font-size: 12px; color: #8C8279; margin-top: 24px;">
        If you did not request a password reset, you can safely disregard this message. Your account remains secure.
      </p>
    `),text:`MANGA MARKETSQUARE - Password Reset

Reset your password here: ${c}

Reset Token: ${e}

This link is valid for 15 minutes. If you did not make this request, please ignore this email.`});return o({to:a,subject:g.subject,html:g.html,text:g.text})}async function r(a){let b=process.env.NEXT_PUBLIC_STORE_URL||"https://manga.jlm.com.ng",c=`${b}/track-order?ref=${encodeURIComponent(a.orderNumber)}`,d=function(a){let b=`Order Confirmed: ${a.orderNumber} — Manga Marketsquare`,c=Number(a.totalAmount).toLocaleString("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}),d=a.items.map(a=>`
        <tr>
          <td><strong>${a.title}</strong></td>
          <td style="text-align: center;">${a.quantity}</td>
          <td style="text-align: right; font-weight: bold;">
            ${Number(a.price*a.quantity).toLocaleString("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0})}
          </td>
        </tr>
      `).join("");return{subject:b,html:j("Order Confirmation",`
      <div style="margin-bottom: 20px;">
        <span class="badge badge-green">&#10003; Order Confirmed &amp; Protected</span>
        ${a.isKadunaSameDay?'<span class="badge" style="background: #FEF7ED; color: #B5532E; border: 1px solid #F3E2CB; margin-left: 6px;">Kaduna Express Same-Day</span>':""}
      </div>

      <h2 class="heading">Thank you for your order, ${a.customerName}!</h2>
      <p>
        Your order <strong>#${a.orderNumber}</strong> has been received and is being prepared by our verified sellers under Manga Buyer Protection.
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
          ${d}
          <tr style="background: #FAF6F0; font-weight: 800;">
            <td colspan="2" style="font-size: 14px; color: #2A2320;">Order Total</td>
            <td style="text-align: right; font-size: 16px; color: #B5532E;">${c}</td>
          </tr>
        </tbody>
      </table>

      <div style="background: #FAF6F0; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 12px;">
        <h4 style="margin: 0 0 6px 0; font-size: 13px; color: #2A2320;">Delivery Destination:</h4>
        <p style="margin: 0; color: #6B5E57;">${a.deliveryAddress}</p>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${a.trackingUrl}" class="btn">Track Order Live &rarr;</a>
      </div>

      <p style="font-size: 12px; color: #8C8279;">
        Need assistance with your delivery? Contact our 24/7 support desk at <a href="mailto:support@marketsquare.ng" style="color: #B5532E;">support@marketsquare.ng</a>.
      </p>
    `),text:`MANGA MARKETSQUARE - Order Confirmation

Order Number: ${a.orderNumber}
Customer: ${a.customerName}
Total: ${c}

Track your order: ${a.trackingUrl}`}}({...a,trackingUrl:c});return o({to:a.customerEmail,subject:d.subject,html:d.html,text:d.text})}async function s(a){let b=function(a){let b=`Welcome to Manga Partner Network — ${a.businessName}`;return{subject:b,html:j("Merchant Welcome",`
      <div style="margin-bottom: 20px;">
        <span class="badge badge-green">&#10003; Merchant Application Received</span>
      </div>

      <h2 class="heading">Welcome aboard, ${a.ownerName}!</h2>
      <p>
        Thank you for registering <strong>${a.businessName}</strong> on the Manga Marketsquare Merchant Partner Network.
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
    `),text:`MANGA MARKETSQUARE - Merchant Registration

Welcome ${a.ownerName} (${a.businessName}) to Manga Marketsquare Partner Network. Access your console: https://manga.jlm.com.ng/sell`}}(a);return o({to:a.email,subject:b.subject,html:b.html,text:b.text})}async function t(a){var b;let c=(b=a,{subject:"Test Dispatch: Manga Marketsquare Mail Service is Active",html:j("Mailing System Test",`
      <div style="margin-bottom: 20px;">
        <span class="badge badge-green">&#10003; SMTP Delivery Verified</span>
      </div>

      <h2 class="heading">Mailing System Operational</h2>
      <p>Hello,</p>
      <p>
        This is an automated diagnostic test from <strong>MANGA MARKETSQUARE</strong>. If you are reading this email, your mailing configuration (SMTP / Node Transport) is configured and dispatching successfully to <strong>${b}</strong>.
      </p>

      <div style="background: #FAF6F0; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 12px; font-family: monospace;">
        <div><strong>Timestamp:</strong> ${new Date().toISOString()}</div>
        <div><strong>Platform:</strong> Next.js 15 / Manga Mail Service</div>
        <div><strong>Status:</strong> Delivered via TLS/SSL</div>
      </div>
    `),text:`MANGA MARKETSQUARE - Test Email

Your mailing configuration is active and working. Sent to: ${b} at ${new Date().toISOString()}`});return o({to:a,subject:c.subject,html:c.html,text:c.text})}async function u(){let a=m();if(!a.isConfigured)return{configured:!1,connected:!1,host:a.host||"Not configured",port:a.port,user:a.user||"None",error:"SMTP_HOST, SMTP_USER, or SMTP_PASS not set in environment or .env file."};let b=n();if(!b)return{configured:!1,connected:!1,error:"Could not initialize transporter."};try{return await b.verify(),{configured:!0,connected:!0,host:a.host,port:a.port,user:a.user}}catch(b){return{configured:!0,connected:!1,host:a.host,port:a.port,user:a.user,error:b.message}}}}};