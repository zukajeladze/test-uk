// Option 1: Default import
import pg from 'pg';
const { Pool } = pg;

import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('Available environment variables:', Object.keys(process.env));
  throw new Error('DATABASE_URL must be set. Did you forget to provision a database?');
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });