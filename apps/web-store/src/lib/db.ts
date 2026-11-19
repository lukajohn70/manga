import { Pool, PoolConfig, QueryResult, QueryResultRow } from 'pg';

let pool: Pool | null = null;

/**
 * Returns or initializes the PostgreSQL connection pool.
 */
export function getDbPool(): Pool {
  if (pool) return pool;

  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    '';

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

  const config: PoolConfig = connectionString
    ? {
        connectionString,
        ssl: sslConfig,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 6000,
      }
    : {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
        user: process.env.POSTGRES_USER || 'manga_user',
        password: process.env.POSTGRES_PASSWORD || 'manga_password',
        database: process.env.POSTGRES_DB || 'manga_db',
        ssl: sslConfig,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 6000,
      };

  pool = new Pool(config);

  pool.on('error', (err) => {
    console.warn('[DB] Unexpected error on idle PostgreSQL client:', err.message);
  });

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
 * Checks if the database is configured and reachable.
 */
export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  version?: string;
  error?: string;
}> {
  try {
    const res = await query('SELECT version()');
    return {
      connected: true,
      version: res.rows[0]?.version,
    };
  } catch (err: any) {
    return {
      connected: false,
      error: err.message,
    };
  }
}
