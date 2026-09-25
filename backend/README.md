# Job Scraper — Backend

Node.js/Express + PostgreSQL API that authenticates two seeded users, triggers
Apify actors (Naukri and LinkedIn job scrapers) on demand, stores the results
with a timestamp, and exposes them for viewing/export as CSV.

## Setup

```bash
npm install
cp .env.example .env   # fill in real values, especially APIFY_TOKEN and PG* creds
npm run migrate        # creates tables
npm run seed           # inserts the 2 seed users from .env
npm run dev            # starts on PORT (default 5000)
```

## API overview

| Method | Path                      | Auth | Description                              |
|--------|---------------------------|------|-------------------------------------------|
| POST   | /api/auth/login           | no   | Login, returns JWT                        |
| GET    | /api/auth/me              | yes  | Current user                              |
| POST   | /api/scrapers/naukri      | yes  | Run Naukri actor with form filters        |
| POST   | /api/scrapers/linkedin    | yes  | Run LinkedIn actor with a search URL      |
| GET    | /api/scrapes              | yes  | List past scrape runs                     |
| GET    | /api/scrapes/:runId       | yes  | Get results for one run                   |
| GET    | /api/scrapes/:runId/export| yes  | Download results for one run as CSV       |

All protected routes require `Authorization: Bearer <token>`.
