import type { Pool, PoolConfig, QueryResult, QueryResultRow } from 'pg';

let pool: Pool | null = null;
let pgModule: any = null;
let pgLoadError: string | null = null;

/**
 * Dynamically and safely loads the PostgreSQL driver without throwing module-level errors.
 */
function getPgDriver(): { Pool: any } | null {
  if (pgModule) return pgModule;
  try {
    const loaded = require('pg');
    pgModule = loaded.Pool ? loaded : { Pool: loaded.default?.Pool || loaded };
    return pgModule;
  } catch (err: any) {
    pgLoadError = err.message || 'Cannot find module pg';
    return null;
  }
}

/**
 * Reads DATABASE_URL from process.env or looks for .env on disk.
 */
export function getRawDatabaseUrl(): string {
  let rawUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    '';

  // Ignore dummy template values from .env.example
  if (rawUrl.includes('REPLACE_WITH_SECURE_DATABASE_PASSWORD')) {
    rawUrl = '';
  }

  if (!rawUrl) {
    try {
      const fs = require('fs');
      const path = require('path');
      const candidates = [
        path.join(process.cwd(), '.env'),
        path.join(process.cwd(), '..', '.env'),
        '/home/gwylvxeo/manga.jlm.com.ng/.env',
        '/home/gwylvxeo/manga.jlm.com.ng/apps/web-store/.env',
      ];
      for (const f of candidates) {
        if (fs.existsSync(f)) {
          const content = fs.readFileSync(f, 'utf8');
          for (const line of content.split(/\r?\n/)) {
            const trimmed = line.trim();
            if (trimmed.startsWith('DATABASE_URL=')) {
              const val = trimmed.slice('DATABASE_URL='.length).trim().replace(/^["']|["']$/g, '');
              if (val && !val.includes('REPLACE_WITH_SECURE_DATABASE_PASSWORD')) {
                rawUrl = val;
                process.env.DATABASE_URL = rawUrl;
                break;
              }
            }
          }
          if (rawUrl) break;
        }
      }
    } catch {}
  }

  return rawUrl;
}

/**
 * Auto-corrects common formatting issues in DATABASE_URL:
 * - Accidental spaces (e.g. before/after @, :, /)
 * - Forces IPv4 '127.0.0.1' instead of 'localhost' / 'hostname' to avoid IPv6 '::1' pg_hba.conf rejection
 * - Unencoded '%' in passwords (which causes URIError: URI malformed)
 */
export function sanitizeConnectionString(raw: string): string {
  if (!raw) return '';
  let str = raw.trim();

  // Strip whitespaces around protocol, credentials, host, and port
  str = str.replace(/\s*@\s*/g, '@');
  str = str.replace(/\s*:\s*/g, ':');
  str = str.replace(/\s*\/\s*/g, '/');

  // Replace 'localhost' or 'hostname' with '127.0.0.1' so Node connects over IPv4
  // cPanel PostgreSQL default pg_hba.conf only permits 127.0.0.1/32 and rejects ::1
  str = str.replace(/@(localhost|hostname)([:\/]|$)/g, '@127.0.0.1$2');

  // Percent-encode any '%' in the password that is not followed by two valid hex digits
  const match = str.match(/^(postgres(?:ql)?:\/\/[^:]+:)(.+)(@[^@\/]+(?::\d+)?\/.*)$/);
  if (match) {
    const prefix = match[1];
    let pass = match[2];
    const rest = match[3];
    pass = pass.replace(/%(?![0-9a-fA-F]{2})/g, '%25');
    str = prefix + pass + rest;
  }

  return str;
}

/**
 * Returns or initializes the PostgreSQL connection pool.
 */
export function getDbPool(): Pool {
  if (pool) return pool;

  const driver = getPgDriver();
  if (!driver || !driver.Pool) {
    throw new Error(
      `PostgreSQL driver 'pg' is not loaded: ${pgLoadError || 'Cannot find module pg'}. Please run npm install in cPanel.`
    );
  }

  const rawUrl = getRawDatabaseUrl();
  const connectionString = sanitizeConnectionString(rawUrl);

  const isExplicitlyDisabled =
    process.env.DATABASE_SSL === 'false' || process.env.PGSSLMODE === 'disable';
  const isExplicitlyEnabled =
    process.env.DATABASE_SSL === 'true' || process.env.PGSSLMODE === 'require';

  const isCloudProvider =
    connectionString.includes('supabase') ||
    connectionString.includes('neon.tech') ||
    connectionString.includes('render.com') ||
    connectionString.includes('railway.app') ||
    connectionString.includes('pooler.supabase.com') ||
    connectionString.includes('rds.amazonaws.com') ||
    connectionString.includes('sslmode=require');

  const isLocal =
    connectionString.includes('localhost') ||
    connectionString.includes('127.0.0.1') ||
    (!connectionString &&
      (!process.env.POSTGRES_HOST ||
        process.env.POSTGRES_HOST === 'localhost' ||
        process.env.POSTGRES_HOST === '127.0.0.1'));

  const useSsl =
    !isExplicitlyDisabled &&
    (isExplicitlyEnabled || isCloudProvider || (!isLocal && process.env.NODE_ENV === 'production'));

  const sslConfig = useSsl ? { rejectUnauthorized: false } : undefined;

  // Always use 127.0.0.1 for host on cPanel to ensure IPv4 connection
  const host = (process.env.POSTGRES_HOST || '127.0.0.1').replace('localhost', '127.0.0.1');

  const config: PoolConfig = connectionString
    ? {
        connectionString,
        ssl: sslConfig,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 6000,
      }
    : {
        host,
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
        user: process.env.POSTGRES_USER || 'gwylvxeo_manga_user',
        password: process.env.POSTGRES_PASSWORD || 'manga_password',
        database: process.env.POSTGRES_DB || 'gwylvxeo_manga',
        ssl: sslConfig,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 6000,
      };

  const instance: Pool = new driver.Pool(config);

  instance.on('error', (err: any) => {
    console.warn('[DB] Unexpected error on idle PostgreSQL client:', err?.message || err);
  });

  pool = instance;
  return pool;
}

/**
 * Executes a parameterized SQL query against PostgreSQL.
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params: any[] = []
): Promise<QueryResult<T>> {
  const p = getDbPool();
  return p.query<T>(text, params);
}

/**
 * Checks if the database driver is present and connection is reachable.
 */
export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  driverInstalled: boolean;
  version?: string;
  sanitizedUrl?: string;
  error?: string;
}> {
  const driver = getPgDriver();
  if (!driver || !driver.Pool) {
    return {
      connected: false,
      driverInstalled: false,
      error: `PostgreSQL driver ('pg') is not installed in the server's node_modules directory (${pgLoadError || 'Cannot find module pg'}). Click 'Run NPM Install' in cPanel to install dependencies.`,
    };
  }

  const rawUrl = getRawDatabaseUrl();
  const cleanUrl = sanitizeConnectionString(rawUrl);
  const maskedHost = cleanUrl ? cleanUrl.replace(/:[^:@]*@/, ':****@') : 'configured via host/user/port';

  try {
    const res = await query('SELECT version()');
    return {
      connected: true,
      driverInstalled: true,
      version: res.rows[0]?.version,
      sanitizedUrl: maskedHost,
    };
  } catch (err: any) {
    return {
      connected: false,
      driverInstalled: true,
      sanitizedUrl: maskedHost,
      error: err.message,
    };
  }
}
