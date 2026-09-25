const { Pool } = require('pg');
const env = require('./env');

// Supabase (and most managed Postgres providers) hand you a single
// connection string instead of separate host/user/password values, and
// require SSL. If DATABASE_URL is set, prefer it; otherwise fall back to
// the discrete PG* variables for a plain local/self-hosted Postgres.
const pool = env.db.connectionString
  ? new Pool({
      connectionString: env.db.connectionString,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: env.db.host,
      port: env.db.port,
      database: env.db.database,
      user: env.db.user,
      password: env.db.password,
    });

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error on idle client', err);
  process.exit(1);
});

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = { pool, query };
