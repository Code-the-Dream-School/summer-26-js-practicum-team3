import { loadEnvFile } from 'node:process';
import { Pool } from 'pg';

try {
  loadEnvFile();
} catch {
  // Allow a silent failure
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
