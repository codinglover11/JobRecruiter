// src/config/env.js
require('dotenv').config();

function required(name, fallback = undefined) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',

  db: process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: required('PGHOST'),
        port: parseInt(process.env.PGPORT || '5432', 10),
        database: required('PGDATABASE'),
        user: required('PGUSER'),
        password: required('PGPASSWORD'),
      },

  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  apify: {
    // APIFY_API_TOKEN is the primary/expected variable name. APIFY_TOKEN is
    // kept as a fallback only so an existing .env from before this change
    // keeps working — never hardcode a token here.
    token: required('APIFY_API_TOKEN', process.env.APIFY_TOKEN),
    naukriActorId: process.env.APIFY_NAUKRI_ACTOR_ID || 'muhammetakkurtt~naukri-job-scraper',
    linkedinActorId: process.env.APIFY_LINKEDIN_ACTOR_ID || 'curious_coder~linkedin-jobs-scraper',
  },

  seedUsers: [
    {
      email: process.env.SEED_USER_1_EMAIL,
      password: process.env.SEED_USER_1_PASSWORD,
    },
    {
      email: process.env.SEED_USER_2_EMAIL,
      password: process.env.SEED_USER_2_PASSWORD,
    },
  ].filter((u) => u.email && u.password),
};

module.exports = env;
