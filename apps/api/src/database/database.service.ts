import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import pg from 'pg';

const { Pool } = pg;

export interface QueryOptions {
  vendorId?: string; // Enforce Postgres Row-Level Security
}

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: pg.Pool;

  constructor() {
    this.pool = new Pool({
      connectionString:
        process.env.DATABASE_URL ||
        'postgres://manga_user:manga_password@localhost:5432/manga_db',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    this.pool.on('error', (err) => {
      // Log connection error without crashing the process
      console.warn('[DatabaseService] Postgres Pool unexpected error:', err.message);
    });
  }

  public async onModuleInit(): Promise<void> {
    try {
      const client = await this.pool.connect();
      client.release();
      console.log('[DatabaseService] Connected to PostgreSQL successfully.');
    } catch (err: any) {
      console.warn(
        '[DatabaseService] PostgreSQL not reachable at startup; operations will retry on demand.',
        err.message
      );
    }
  }

  public async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }

  /**
   * Executes a parameterized query within optional vendor RLS context.
   */
  public async query<T extends pg.QueryResultRow = any>(
    sqlText: string,
    params: any[] = [],
    options?: QueryOptions
  ): Promise<pg.QueryResult<T>> {
    const client = await this.pool.connect();
    try {
      if (options?.vendorId) {
        // Enforce vendor row-level security isolation (ADR 001 & §7.8)
        await client.query('SET LOCAL app.vendor_id = $1', [options.vendorId]);
      }
      return await client.query<T>(sqlText, params);
    } finally {
      client.release();
    }
  }

  /**
   * Executes a multi-step callback within a single database transaction.
   */
  public async transaction<T>(
    callback: (client: pg.PoolClient) => Promise<T>,
    options?: QueryOptions
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      if (options?.vendorId) {
        await client.query('SET LOCAL app.vendor_id = $1', [options.vendorId]);
      }
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
