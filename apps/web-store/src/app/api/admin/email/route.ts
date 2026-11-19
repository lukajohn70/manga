import { NextResponse } from 'next/server';
import {
  getEmailConfig,
  verifySmtpConnection,
  sendTestEmail,
} from '../../../../lib/email/email-service';
import { getSessionFromRequest, verifyCsrf, validateEmail } from '../../../../lib/security';

function isAuthorizedAdmin(request: Request): boolean {
  const session = getSessionFromRequest(request);
  if (session && session.role === 'ADMIN') return true;

  const adminKey = request.headers.get('x-admin-key');
  const expectedKey = process.env.ADMIN_SECRET_KEY;
  if (adminKey && expectedKey && adminKey === expectedKey) return true;

  return false;
}

export async function GET(request: Request) {
  try {
    if (!isAuthorizedAdmin(request)) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Platform Administrator privileges required.' },
        { status: 403 }
      );
    }

    // Force fresh scan of .env files on disk
    const config = getEmailConfig(true);
    const verification = await verifySmtpConnection();

    return NextResponse.json({
      success: true,
      service: 'Manga Mailing System',
      configured: config.isConfigured,
      details: {
        host: config.host || 'Not set',
        port: config.port,
        secure: config.secure,
        user: config.user ? `${config.user.slice(0, 3)}***@${config.user.split('@')[1] || ''}` : 'Not set',
        fromName: config.fromName,
        fromAddress: config.fromAddress,
        mode: config.isConfigured ? 'Live SMTP Transport' : 'Resilient Simulated Dispatch (Dev/Offline)',
      },
      connection: verification,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to inspect email service status.', error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isAuthorizedAdmin(request)) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Platform Administrator privileges required.' },
        { status: 403 }
      );
    }

    if (!verifyCsrf(request)) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing CSRF token.' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const action = body.action || 'test-email';
    const recipient = (body.recipient || '').toLowerCase().trim();

    if (action === 'test-email') {
      if (!recipient || !validateEmail(recipient)) {
        return NextResponse.json(
          { success: false, message: 'Please provide a valid recipient email address.' },
          { status: 400 }
        );
      }

      // Force re-read of .env before test dispatch
      getEmailConfig(true);
      const result = await sendTestEmail(recipient);

      return NextResponse.json({
        success: result.success,
        simulated: result.simulated,
        messageId: result.messageId,
        message: result.success
          ? result.simulated
            ? `Simulated test email generated for ${recipient} (SMTP credentials not yet configured).`
            : `Live test email dispatched successfully to ${recipient} via SMTP!`
          : `Failed to dispatch test email: ${result.error}`,
        error: result.error,
      });
    }

    if (action === 'verify') {
      const verification = await verifySmtpConnection();
      return NextResponse.json({
        success: verification.connected,
        verification,
      });
    }

    return NextResponse.json({ success: false, message: 'Unsupported action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Mailing action failed.', error: err.message },
      { status: 500 }
    );
  }
}
