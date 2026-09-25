-- Job Scraper database schema

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scrape_runs (
  id            SERIAL PRIMARY KEY,
  source        VARCHAR(20) NOT NULL CHECK (source IN ('naukri', 'linkedin')),
  input_params  JSONB NOT NULL,
  requested_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  item_count    INTEGER NOT NULL DEFAULT 0,
  status        VARCHAR(20) NOT NULL DEFAULT 'success',
  error_message TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scrape_results (
  id          SERIAL PRIMARY KEY,
  run_id      INTEGER NOT NULL REFERENCES scrape_runs(id) ON DELETE CASCADE,
  title       TEXT,
  company     TEXT,
  location    TEXT,
  url         TEXT,
  raw_data    JSONB NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scrape_results_run_id ON scrape_results(run_id);
CREATE INDEX IF NOT EXISTS idx_scrape_runs_source ON scrape_runs(source);
