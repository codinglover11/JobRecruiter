// src/services/naukriService.js
const env = require('../config/env');
const { runActorAndGetItems } = require('./apifyService');

// The actor enforces maxJobs >= 50, which is also the number we retain per run.
const APIFY_MAX_JOBS = 50;

// Every field the actor's CURRENT input schema accepts (from its published
// "Actor input Schema" on the Apify Store page). Copied over verbatim if
// present on the incoming form values — no renaming, no legacy aliases.
const PASSTHROUGH_FIELDS = [
  'jobBoard',       // 'naukri' (default, India) | 'naukrigulf' (Gulf/MENA)
  'keyword',
  'searchUrl',
  'jobIds',         // array of 12-digit job IDs or full job URLs
  'fetchDetails',   // boolean
  'sortBy',         // 'relevance' | 'date'
  'experience',     // 'all' | '0'..'30'
  'freshness',      // 'all' | '30' | '15' | '7' | '3' | '1'

  // Naukri.com-only filters
  'workMode',       // array of 'office' | 'remote' | 'hybrid'
  'cities',
  'department',
  'salaryRange',
  'companyType',
  'roleCategory',
  'role',
  'walkin',
  'walkinDate',
  'stipend',
  'duration',
  'ugCourse',
  'pgCourse',
  'postedBy',       // array of '1' (Company) | '2' (Consultant)
  'industry',
  'topCompanies',

  // NaukriGulf-only filters
  'location',
  'language',
  'nationality',
  'country',
  'gulfCity',
  'gulfIndustry',
  'gulfFunctionalArea',
  'gulfSalaryRange',
  'gender',
];

function isEmpty(value) {
  if (value === undefined || value === null || value === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

// Builds the exact input object the actor's current schema expects.
function buildActorInput(formValues = {}) {
  const input = {
    maxJobs: APIFY_MAX_JOBS,
    fetchDetails: formValues.fetchDetails !== false,
  };

  for (const field of PASSTHROUGH_FIELDS) {
    if (!isEmpty(formValues[field])) {
      input[field] = formValues[field];
    }
  }

  if (isEmpty(input.keyword) && isEmpty(input.searchUrl) && isEmpty(input.jobIds)) {
    const err = new Error('Provide at least one of: keyword, searchUrl, or jobIds');
    err.status = 400;
    err.expose = true;
    throw err;
  }

  return input;
}

// Naukri.com output uses `companyName` + `locations[]` + `jdURL`.
// NaukriGulf output uses `designation`, `company.name`, a flat `location`
// string, and `jdURL`. Handle both shapes defensively.
function normalizeItem(item) {
  const isGulf = item.jobBoard === 'naukrigulf' || Boolean(item.designation);

  const title = item.title || item.designation || null;
  const company = item.companyName || item.company?.name || null;
  const location = isGulf
    ? item.location || null
    : (Array.isArray(item.locations) && item.locations.length
        ? item.locations.map((l) => l.label).join(', ')
        : item.location || null);
  const url = item.jdURL || item.jobDetails?.staticUrl || null;

  return { title, company, location, url, raw: item };
}

async function runNaukriScrape(formValues) {
  const input = buildActorInput(formValues);
  const items = await runActorAndGetItems(env.apify.naukriActorId, input);
  return { input, items: items.map(normalizeItem) };
}

module.exports = { runNaukriScrape, buildActorInput, normalizeItem };
