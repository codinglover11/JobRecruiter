// src/services/apifyService.js
const axios = require('axios');
const env = require('../config/env');

const APIFY_BASE_URL = 'https://api.apify.com/v2';

/**
 * Runs an Apify actor synchronously and returns its dataset items.
 * Docs: https://docs.apify.com/api/v2#/reference/actors/run-actor-synchronously-and-get-dataset-items
 */
async function runActorAndGetItems(actorId, input) {
  const url = `${APIFY_BASE_URL}/acts/${actorId}/run-sync-get-dataset-items`;

  try {
    const response = await axios.post(url, input, {
      params: { token: env.apify.token },
      timeout: 5 * 60 * 1000, // scrapes can take a while
      headers: { 'Content-Type': 'application/json' },
    });

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    // Log Apify's actual validation message — never the token, never the
    // full axios config (which would include the token in query params).
    console.error(
      "Apify error:",
      JSON.stringify(error.response?.data, null, 2)
    );

    const message = error.response?.data?.error?.message || error.message || 'Apify request failed';
    const wrapped = new Error(message);
    wrapped.status = error.response?.status || 502;
    wrapped.expose = true;
    throw wrapped;
  }
}

module.exports = { runActorAndGetItems };
