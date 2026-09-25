const env = require('../config/env');
const { runActorAndGetItems } = require('./apifyService');

// Maps our form fields to the curious_coder/linkedin-jobs-scraper actor's
// input schema: { urls: string[], scrapeCompany?: bool, count?: int, ... }
function buildActorInput(formValues) {
  const { searchUrl, count, scrapeCompany } = formValues;

  if (!searchUrl) {
    const err = new Error('searchUrl is required — paste the URL from linkedin.com/jobs/search/');
    err.status = 400;
    err.expose = true;
    throw err;
  }

  const input = { urls: [searchUrl] };

  if (count) input.count = Number(count);
  if (typeof scrapeCompany === 'boolean') input.scrapeCompany = scrapeCompany;

  return input;
}

// The actor's exact output field names can vary by run/build, so we check
// a few likely candidates for each display field and fall back to null.
function firstDefined(item, keys) {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null && item[key] !== '') {
      return item[key];
    }
  }
  return null;
}

function normalizeItem(item) {
  return {
    title: firstDefined(item, ['title', 'jobTitle', 'position']),
    company: firstDefined(item, ['companyName', 'company', 'company_name']),
    location: firstDefined(item, ['location', 'jobLocation']),
    url: firstDefined(item, ['url', 'jobUrl', 'link']),
    raw: item,
  };
}

async function runLinkedinScrape(formValues) {
  const input = buildActorInput(formValues);
  const items = await runActorAndGetItems(env.apify.linkedinActorId, input);
  return { input, items: items.map(normalizeItem) };
}

module.exports = { runLinkedinScrape, buildActorInput, normalizeItem };
