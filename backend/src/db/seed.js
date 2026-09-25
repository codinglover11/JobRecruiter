const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const env = require('../config/env');

async function seed() {
  if (env.seedUsers.length === 0) {
    console.warn('No SEED_USER_*_EMAIL / SEED_USER_*_PASSWORD pairs found in .env — nothing to seed.');
    await pool.end();
    return;
  }

  for (const user of env.seedUsers) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    await pool.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (email)
       DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [user.email.toLowerCase(), passwordHash]
    );
    console.log(`✅ Seeded/updated user: ${user.email}`);
  }

  await pool.end();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
