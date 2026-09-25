const asyncHandler = require('../utils/asyncHandler');
const scrapeModel = require('../models/scrapeModel');
const { resultsToCsv } = require('../services/exportService');
const { formatTimestamp } = require('../utils/timestamp');

const listRuns = asyncHandler(async (req, res) => {
  const runs = await scrapeModel.listRuns();
  const withFormattedDates = runs.map((run) => ({
    ...run,
    formattedCreatedAt: formatTimestamp(run.created_at),
  }));
  res.json({ runs: withFormattedDates });
});

const getRunResults = asyncHandler(async (req, res) => {
  const runId = Number(req.params.runId);
  const run = await scrapeModel.getRun(runId);

  if (!run) {
    return res.status(404).json({ message: 'Scrape run not found' });
  }

  const results = await scrapeModel.getResultsForRun(runId);
  const withFormattedDates = results.map((r) => ({
    ...r,
    formattedCreatedAt: formatTimestamp(r.created_at),
  }));

  res.json({
    run: { ...run, formattedCreatedAt: formatTimestamp(run.created_at) },
    results: withFormattedDates,
  });
});

const exportRunResults = asyncHandler(async (req, res) => {
  const runId = Number(req.params.runId);
  const run = await scrapeModel.getRun(runId);

  if (!run) {
    return res.status(404).json({ message: 'Scrape run not found' });
  }

  const results = await scrapeModel.getResultsForRun(runId);
  const withFormattedDates = results.map((r) => ({
    ...r,
    formattedCreatedAt: formatTimestamp(r.created_at),
  }));

  const csv = resultsToCsv(withFormattedDates);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${run.source}-run-${run.id}.csv"`);
  res.send(csv);
});

module.exports = { listRuns, getRunResults, exportRunResults };
