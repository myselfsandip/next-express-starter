import { drizzle } from 'drizzle-orm/node-postgres';
import { Env } from '../config/env.config.js';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: Env.DATABASE_URL,
    max: 10,
    ssl: Env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
export const db = drizzle({ client: pool });
