import pg from 'pg';
const { Pool } = pg;

import { Kysely, PostgresDialect, sql } from 'kysely';
import { Database } from '../db/schema.js';
import { env } from '../config/env.js';

// Create PostgreSQL pool
const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: env.db.url,
  })
});

// Initialize Kysely with our schema
export const db = new Kysely<Database>({
  dialect,
});

// Helper function for connection testing
export async function testConnection() {
    try {
      // Test the connection with a simple query that doesn't require tables
      const pool = new Pool({
        connectionString: env.db.url,
      });
      await pool.query('SELECT 1');
      await pool.end();
      console.log('✅ Database connection successful');
      return true;
    } catch (error) {
      console.error('❌ Database connection error:', error);
      if (typeof error === 'object' && error !== null && 'message' in error) {
        console.error('   Error details:', (error as Error).message);
      }
      return false;
    }
  }

// Helper function for database initialization
export async function setupDatabase() {
  try {
    // Create users table if it doesn't exist
    await db.schema
      .createTable('users')
      .ifNotExists()
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('email', 'varchar(255)', (col) => col.notNull().unique())
      .addColumn('password', 'varchar(255)', (col) => col.notNull())
      .addColumn('name', 'varchar(255)')
      .addColumn('created_at', 'timestamp', (col) => 
        col.defaultTo(sql`now()`).notNull()
      )
      .addColumn('updated_at', 'timestamp', (col) => 
        col.defaultTo(sql`now()`).notNull()
      )
      .execute();
    
    // Add index for faster email lookups
    await db.schema
      .createIndex('idx_users_email')
      .on('users')
      .column('email')
      .ifNotExists()
      .execute();
    
    console.log('✅ Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    return false;
  }
}