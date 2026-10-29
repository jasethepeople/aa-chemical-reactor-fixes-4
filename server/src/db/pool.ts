// apps/server/src/db/pool.ts
//
// Single shared pg Pool. LicenseService and AuditService both need this;
// it didn't exist anywhere in the original tree.

import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  // Idle client errors shouldn't crash the process
  console.error('[db] unexpected error on idle client', err);
});
