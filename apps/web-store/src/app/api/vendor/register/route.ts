import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { ensureDatabaseReady } from '../../../../lib/db-schema-init';
import { sendMerchantWelcomeEmail } from '../../../../lib/email/email-service';
import {
  hashPassword,
  validateEmail,
  validatePasswordStrength,
  validatePhone,
  sanitizeString,
  verifyCsrf,
  getSessionFromRequest,
} from '../../../../lib/security';

export async function POST(request: Request) {
  try {
    // 1. CSRF Protection
    if (!verifyCsrf(request)) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing CSRF token / cross-origin request rejected.' },
        { status: 403 }
      );
    }

    const session = getSessionFromRequest(request);
    const body = await request.json().catch(() => ({}));
    const { businessName, ownerName, email, phone, password } = body;

    // 2. Server-Side Form Validation
    const cleanBusiness = sanitizeString(businessName);
    if (!cleanBusiness || cleanBusiness.length < 2 || cleanBusiness.length > 100) {
      return NextResponse.json(
        { success: false, message: 'Store Name must be between 2 and 100 characters.' },
        { status: 400 }
      );
    }

    const cleanName = sanitizeString(ownerName);
    if (!cleanName || cleanName.length < 2 || cleanName.length > 100) {
      return NextResponse.json(
        { success: false, message: 'Contact Person name must be between 2 and 100 characters.' },
        { status: 400 }
      );
    }

    const cleanEmail = (email || '').toLowerCase().trim();
    if (!validateEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid business email address.' },
        { status: 400 }
      );
    }

    const cleanPhone = sanitizeString(phone || '+234 800 000 0000');
    if (!validatePhone(cleanPhone)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid telephone number.' },
        { status: 400 }
      );
    }

    await ensureDatabaseReady();

    // 3. User Resolution & Authorization
    let userId: string | null = null;
    const userRes = await query('SELECT id, role, email FROM identity.users WHERE email ILIKE $1 LIMIT 1', [cleanEmail]);

    if (userRes.rows && userRes.rows.length > 0) {
      const existingUser = userRes.rows[0];

      // Prevent unauthorized role hijack: require existing user to be signed in
      if (!session || session.email !== existingUser.email) {
        return NextResponse.json(
          {
            success: false,
            message: 'An account with this email already exists. Please log in first to register your merchant store.',
          },
          { status: 401 }
        );
      }

      userId = existingUser.id;

      // Upgrade existing authenticated user to vendor_admin
      await query(
        `UPDATE identity.users 
         SET role = 'vendor_admin', 
             name = COALESCE(NULLIF(name, ''), $1), 
             phone = COALESCE(NULLIF(phone, ''), $2) 
         WHERE id = $3`,
        [cleanName, cleanPhone, userId]
      );
    } else {
      // New user registration requires a strong password
      const pwdCheck = validatePasswordStrength(password);
      if (!pwdCheck.valid) {
        return NextResponse.json(
          { success: false, message: pwdCheck.reason || 'A secure password is required for merchant registration.' },
          { status: 400 }
        );
      }

      const pwdHash = hashPassword(password);
      const insertUser = await query(
        `INSERT INTO identity.users (email, phone, name, role, password_hash, status)
         VALUES ($1, $2, $3, 'vendor_admin', $4, 'active')
         RETURNING id;`,
        [cleanEmail, cleanPhone, cleanName, pwdHash]
      );
      if (insertUser.rows && insertUser.rows.length > 0) {
        userId = insertUser.rows[0].id;
      }
    }

    // 4. Vendor Store Record Creation (Parameterized query)
    const vendorCheck = await query(
      'SELECT id, business_name FROM vendor.vendors WHERE user_id = $1 OR business_name ILIKE $2 LIMIT 1',
      [userId, cleanBusiness]
    );

    let vendorId: string;
    if (vendorCheck.rows && vendorCheck.rows.length > 0) {
      vendorId = vendorCheck.rows[0].id;
    } else {
      const insertVendor = await query(
        `INSERT INTO vendor.vendors (user_id, business_name, legal_entity_type, tier, status, rating)
         VALUES ($1, $2, 'Enterprise Partner', 'tier_1', 'active', 4.95)
         RETURNING id;`,
        [userId, cleanBusiness]
      );
      vendorId = insertVendor.rows[0]?.id || `ven-${Date.now().toString(36)}`;
    }

    // 5. Dispatch Merchant Welcome Email
    sendMerchantWelcomeEmail({
      businessName: cleanBusiness,
      ownerName: cleanName,
      email: cleanEmail,
    }).catch((emailErr) => {
      console.warn('[Vendor Registration] Welcome email dispatch note:', emailErr.message);
    });

    return NextResponse.json({
      success: true,
      vendorId,
      businessName: cleanBusiness,
      message: `Welcome aboard, ${cleanBusiness}! Your merchant partner store is registered and verified.`,
    });
  } catch (err: any) {
    console.error('[Vendor Registration Error]', err.message);
    return NextResponse.json(
      { success: false, message: 'Failed to process vendor registration. Please try again.' },
      { status: 500 }
    );
  }
}
