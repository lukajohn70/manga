import { NextResponse } from 'next/server';
import {
  authenticateDbUser,
  registerDbUser,
  createDbPasswordReset,
  resetDbUserPassword,
  createDbEmailVerificationOtp,
  verifyDbEmailVerificationOtp,
} from '../../../lib/db-auth';
import { getDbOrdersByEmail } from '../../../lib/db-orders';
import {
  createSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
  CSRF_COOKIE_NAME,
  generateCsrfToken,
  checkRateLimit,
  resetRateLimit,
  verifyCsrf,
  getSessionFromRequest,
} from '../../../lib/security';

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
}

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        role: session.role,
        name: session.name,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, error: 'Session check failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // 1. CSRF Protection
    if (!verifyCsrf(request)) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing CSRF token / cross-origin request rejected.' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const action = body.action || 'login';

    // 2. Action: LOGOUT
    if (action === 'logout') {
      const response = NextResponse.json({
        success: true,
        message: 'Signed out successfully.',
      });
      response.cookies.set(SESSION_COOKIE_NAME, '', {
        ...getSessionCookieOptions(),
        maxAge: 0,
      });
      return response;
    }

    // 3. Action: FORGOT PASSWORD (Request expiring reset link)
    if (action === 'forgot-password') {
      const rateLimitKey = `pw_reset:${clientIp}`;
      const rateCheck = checkRateLimit(rateLimitKey, 3, 15 * 60 * 1000);
      if (!rateCheck.allowed) {
        return NextResponse.json(
          {
            success: false,
            message: `Too many password reset requests. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
          },
          {
            status: 429,
            headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
          }
        );
      }

      const res = await createDbPasswordReset(body.email);
      return NextResponse.json({
        success: true,
        message: res.message,
        // In local/test mode, provide reset token for immediate verification testing
        resetToken: process.env.NODE_ENV !== 'production' ? res.token : undefined,
      });
    }

    // 4. Action: RESET PASSWORD (Consume single-use token)
    if (action === 'reset-password') {
      const rateLimitKey = `pw_confirm:${clientIp}`;
      const rateCheck = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
      if (!rateCheck.allowed) {
        return NextResponse.json(
          {
            success: false,
            message: `Too many attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
          },
          {
            status: 429,
            headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
          }
        );
      }

      const res = await resetDbUserPassword(body.email, body.token, body.password);
      if (!res.success) {
        return NextResponse.json({ success: false, message: res.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: res.message, email: res.email });
    }

    // 4b. Action: SEND EMAIL VERIFICATION OTP (Pre-registration verification)
    if (action === 'send-email-otp') {
      const rateLimitKey = `email_otp:${clientIp}`;
      const rateCheck = checkRateLimit(rateLimitKey, 5, 10 * 60 * 1000); // 5 requests per 10 mins
      if (!rateCheck.allowed) {
        return NextResponse.json(
          {
            success: false,
            message: `Too many verification requests. Please retry in ${rateCheck.retryAfterSeconds} seconds.`,
          },
          {
            status: 429,
            headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
          }
        );
      }

      const res = await createDbEmailVerificationOtp(body.email);
      if (!res.success) {
        return NextResponse.json({ success: false, message: res.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: res.message,
        token: res.token,
      });
    }

    // 4c. Action: VERIFY EMAIL OTP
    if (action === 'verify-email-otp') {
      const rateLimitKey = `verify_otp:${clientIp}`;
      const rateCheck = checkRateLimit(rateLimitKey, 10, 15 * 60 * 1000); // 10 attempts
      if (!rateCheck.allowed) {
        return NextResponse.json(
          {
            success: false,
            message: `Too many verification attempts. Please retry in ${rateCheck.retryAfterSeconds} seconds.`,
          },
          {
            status: 429,
            headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
          }
        );
      }

      const res = await verifyDbEmailVerificationOtp(body.email, body.otp);
      if (!res.success) {
        return NextResponse.json({ success: false, message: res.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: res.message,
        verificationToken: res.verificationToken,
      });
    }

    // 5. Action: REGISTRATION
    if (action === 'register') {
      const rateLimitKey = `register:${clientIp}`;
      const rateCheck = checkRateLimit(rateLimitKey, 10, 60 * 60 * 1000); // 10 per hour
      if (!rateCheck.allowed) {
        return NextResponse.json(
          {
            success: false,
            message: `Registration rate limit reached. Please retry in ${rateCheck.retryAfterSeconds} seconds.`,
          },
          {
            status: 429,
            headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
          }
        );
      }

      const res = await registerDbUser({
        email: body.email,
        password: body.password,
        name: body.name,
        phone: body.phone,
        verificationToken: body.verificationToken,
      });

      if (!res.success || !res.user) {
        return NextResponse.json({ success: false, message: res.message }, { status: 400 });
      }

      const sessionToken = createSessionToken(res.user);
      const csrfToken = generateCsrfToken();

      const response = NextResponse.json({
        success: true,
        user: res.user,
        token: sessionToken,
        csrfToken,
        message: 'Account registered successfully.',
      });

      // Secure Session Cookie
      response.cookies.set(SESSION_COOKIE_NAME, sessionToken, getSessionCookieOptions());
      response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
        httpOnly: false, // Accessible to client JS for double-submit header
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    // 6. Action: DEDICATED ADMIN LOGIN
    if (action === 'admin-login') {
      const rateLimitKey = `admin_login:${clientIp}`;
      const rateCheck = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
      if (!rateCheck.allowed) {
        return NextResponse.json(
          {
            success: false,
            message: `Too many administrative login attempts. Locked for ${rateCheck.retryAfterSeconds} seconds.`,
          },
          {
            status: 429,
            headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
          }
        );
      }

      const authRes = await authenticateDbUser(body.email, body.password);
      if (!authRes.success || !authRes.user) {
        return NextResponse.json(
          { success: false, message: authRes.message || 'Invalid administrator credentials.' },
          { status: 401 }
        );
      }

      if (authRes.user.role !== 'ADMIN') {
        return NextResponse.json(
          { success: false, message: 'Access denied: Administrator privileges required.' },
          { status: 403 }
        );
      }

      resetRateLimit(rateLimitKey);

      const sessionToken = createSessionToken(authRes.user);
      const csrfToken = generateCsrfToken();

      const response = NextResponse.json({
        success: true,
        user: authRes.user,
        token: sessionToken,
        csrfToken,
        message: 'Administrator authentication verified.',
      });

      response.cookies.set(SESSION_COOKIE_NAME, sessionToken, getSessionCookieOptions());
      response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    // 7. Action: PRIMARY LOGIN (Buyers & Merchants)
    const loginEmail = (body.email || '').toLowerCase().trim();
    const rateLimitKey = `login:${clientIp}:${loginEmail}`;
    const rateCheck = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many failed login attempts. Account temporarily locked for ${rateCheck.retryAfterSeconds} seconds.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
        }
      );
    }

    const authRes = await authenticateDbUser(loginEmail, body.password);
    if (!authRes.success || !authRes.user) {
      return NextResponse.json(
        { success: false, message: authRes.message || 'Authentication failed. Please check credentials.' },
        { status: 401 }
      );
    }

    // Login succeeded: reset failed rate counter
    resetRateLimit(rateLimitKey);

    const sessionToken = createSessionToken(authRes.user);
    const csrfToken = generateCsrfToken();

    // Fetch buyer's real orders strictly for this authenticated user
    const orders = await getDbOrdersByEmail(authRes.user.email);

    const response = NextResponse.json({
      success: true,
      user: authRes.user,
      token: sessionToken,
      csrfToken,
      orders,
      message: `Authentication successful. Welcome, ${authRes.user.name}!`,
    });

    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, getSessionCookieOptions());
    response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Authentication processing error. Please try again.' },
      { status: 500 }
    );
  }
}
