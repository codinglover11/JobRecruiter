const asyncHandler = require('../utils/asyncHandler');
const { runLinkedinScrape } = require('../services/linkedinService');
const scrapeModel = require('../models/scrapeModel');

const runLinkedin = asyncHandler(async (req, res) => {
  const run = await scrapeModel.createRun({
    source: 'linkedin',
    inputParams: req.body,
    requestedBy: req.user.id,
  });

  try {
    const { items } = await runLinkedinScrape(req.body);
    await scrapeModel.insertResults(run.id, items);
    const finishedRun = await scrapeModel.finishRun(run.id, { itemCount: items.length });

    res.status(201).json({ run: finishedRun, items });
  } catch (err) {
    await scrapeModel.finishRun(run.id, { itemCount: 0, status: 'failed', errorMessage: err.message });
    throw err;
  }
});

module.exports = { runLinkedin };
