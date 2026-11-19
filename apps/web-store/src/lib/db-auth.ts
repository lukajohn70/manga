import { query } from './db';
import { ensureDatabaseReady } from './db-schema-init';
import {
  hashPassword,
  verifyPassword,
  validateEmail,
  validatePasswordStrength,
  sanitizeString,
  createPasswordResetToken,
  hashResetToken,
} from './security';

export interface DbUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'BUYER' | 'VENDOR' | 'ADMIN';
  status: string;
}

/**
 * Authenticates buyer, vendor, or administrator against PostgreSQL identity.users.
 * Uses secure scrypt verification and automatically upgrades legacy SHA-256 hashes to scrypt.
 */
export async function authenticateDbUser(
  email: string,
  password?: string
): Promise<{ success: boolean; user?: DbUser; message?: string }> {
  try {
    if (!email || !password) {
      return { success: false, message: 'Email and password are required.' };
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!validateEmail(cleanEmail)) {
      return { success: false, message: 'Invalid email address format.' };
    }

    await ensureDatabaseReady();

    const sql = `
      SELECT id, name, email, phone, role, password_hash, status
      FROM identity.users
      WHERE email ILIKE $1
      LIMIT 1;
    `;

    const res = await query(sql, [cleanEmail]);

    if (!res.rows || res.rows.length === 0) {
      return { success: false, message: 'Invalid email or password.' };
    }

    const row = res.rows[0];

    // Cryptographic verification (scrypt or legacy sha256 with auto-upgrade)
    const isValid = verifyPassword(password, row.password_hash);
    if (!isValid) {
      return { success: false, message: 'Invalid email or password.' };
    }

    // Auto-upgrade legacy hash to modern scrypt
    if (!row.password_hash.startsWith('scrypt$')) {
      try {
        const upgradedHash = hashPassword(password);
        await query('UPDATE identity.users SET password_hash = $1 WHERE id = $2', [upgradedHash, row.id]);
      } catch (upgradeErr: any) {
        console.warn('[DB Auth] Failed to auto-upgrade legacy hash:', upgradeErr.message);
      }
    }

    const roleMap: Record<string, 'BUYER' | 'VENDOR' | 'ADMIN'> = {
      buyer: 'BUYER',
      vendor_admin: 'VENDOR',
      vendor_staff: 'VENDOR',
      admin: 'ADMIN',
    };

    const user: DbUser = {
      id: row.id,
      name: row.name || cleanEmail.split('@')[0],
      email: row.email,
      phone: row.phone || '+234 800 000 0000',
      role: roleMap[row.role] || 'BUYER',
      status: row.status || 'active',
    };

    return { success: true, user };
  } catch (err: any) {
    console.error('[DB Auth] Authentication error:', err.message);
    return { success: false, message: 'Authentication service temporarily unavailable. Please try again.' };
  }
}

/**
 * Registers a new buyer in identity.users in PostgreSQL with strict server-side validation.
 */
export async function registerDbUser(input: {
  email: string;
  password?: string;
  name?: string;
  phone?: string;
}): Promise<{ success: boolean; user?: DbUser; message?: string }> {
  try {
    const cleanEmail = (input.email || '').toLowerCase().trim();
    if (!validateEmail(cleanEmail)) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    const pwdCheck = validatePasswordStrength(input.password);
    if (!pwdCheck.valid) {
      return { success: false, message: pwdCheck.reason || 'Password does not meet security requirements.' };
    }

    await ensureDatabaseReady();

    const name = sanitizeString(input.name || cleanEmail.split('@')[0]);
    const phone = sanitizeString(input.phone || '+234 800 000 0000');
    const pwdHash = hashPassword(input.password!);

    // Check if user already exists
    const checkRes = await query('SELECT id FROM identity.users WHERE email ILIKE $1', [cleanEmail]);
    if (checkRes.rows && checkRes.rows.length > 0) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const insertSql = `
      INSERT INTO identity.users (email, phone, name, role, password_hash, status)
      VALUES ($1, $2, $3, 'buyer', $4, 'active')
      RETURNING id, email, phone, name, role, status;
    `;

    const res = await query(insertSql, [cleanEmail, phone, name, pwdHash]);
    const row = res.rows[0];

    const user: DbUser = {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      role: 'BUYER',
      status: row.status,
    };

    return { success: true, user };
  } catch (err: any) {
    console.error('[DB Auth] Registration error:', err.message);
    return { success: false, message: 'Unable to complete registration. Please try again.' };
  }
}

/**
 * Creates an expiring, single-use password reset link token.
 */
export async function createDbPasswordReset(
  email: string
): Promise<{ success: boolean; token?: string; expiresAt?: Date; message: string }> {
  try {
    const cleanEmail = (email || '').toLowerCase().trim();
    if (!validateEmail(cleanEmail)) {
      return { success: false, message: 'Invalid email address.' };
    }

    await ensureDatabaseReady();

    const userRes = await query('SELECT id FROM identity.users WHERE email ILIKE $1 LIMIT 1', [cleanEmail]);
    if (!userRes.rows || userRes.rows.length === 0) {
      // Do not disclose whether email exists (enumeration prevention)
      return {
        success: true,
        message: 'If an account exists with this email, a password reset link has been dispatched.',
      };
    }

    const { token, hash, expiresAt } = createPasswordResetToken();

    await query(
      `INSERT INTO identity.password_resets (email, token_hash, expires_at)
       VALUES ($1, $2, $3);`,
      [cleanEmail, hash, expiresAt]
    );

    return {
      success: true,
      token,
      expiresAt,
      message: 'If an account exists with this email, a password reset link has been dispatched.',
    };
  } catch (err: any) {
    console.error('[DB Auth] Reset token generation error:', err.message);
    return { success: false, message: 'Unable to initiate password reset at this time.' };
  }
}

/**
 * Resets user password using a verified single-use, non-expired token.
 */
export async function resetDbUserPassword(
  email: string,
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    const cleanEmail = (email || '').toLowerCase().trim();
    if (!validateEmail(cleanEmail)) {
      return { success: false, message: 'Invalid email address.' };
    }

    if (!token || typeof token !== 'string') {
      return { success: false, message: 'Password reset token is required.' };
    }

    const pwdCheck = validatePasswordStrength(newPassword);
    if (!pwdCheck.valid) {
      return { success: false, message: pwdCheck.reason || 'Password does not meet security requirements.' };
    }

    await ensureDatabaseReady();

    const tokenHash = hashResetToken(token);

    // Find valid, unexpired, unused reset record
    const resetRes = await query(
      `SELECT id, expires_at, used_at
       FROM identity.password_resets
       WHERE email ILIKE $1 AND token_hash = $2
       ORDER BY created_at DESC
       LIMIT 1;`,
      [cleanEmail, tokenHash]
    );

    if (!resetRes.rows || resetRes.rows.length === 0) {
      return { success: false, message: 'Invalid or expired password reset link.' };
    }

    const record = resetRes.rows[0];

    if (record.used_at) {
      return { success: false, message: 'This password reset link has already been used.' };
    }

    const now = new Date();
    if (new Date(record.expires_at) < now) {
      return { success: false, message: 'This password reset link has expired. Please request a new one.' };
    }

    // Hash new password using OWASP Scrypt
    const newHash = hashPassword(newPassword);

    // Update user password and mark token used in atomic transaction
    await query('BEGIN');
    try {
      await query('UPDATE identity.users SET password_hash = $1 WHERE email ILIKE $2', [newHash, cleanEmail]);
      await query('UPDATE identity.password_resets SET used_at = NOW() WHERE id = $1', [record.id]);
      await query('COMMIT');
    } catch (txnErr) {
      await query('ROLLBACK');
      throw txnErr;
    }

    return { success: true, message: 'Password has been updated successfully. You can now log in.' };
  } catch (err: any) {
    console.error('[DB Auth] Password reset error:', err.message);
    return { success: false, message: 'Failed to reset password. Please try again.' };
  }
}
