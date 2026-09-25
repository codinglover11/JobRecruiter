const express = require('express');
const requireAuth = require('../middleware/authMiddleware');
const { listRuns, getRunResults, exportRunResults } = require('../controllers/scrapesController');

const router = express.Router();

router.get('/', requireAuth, listRuns);
router.get('/:runId', requireAuth, getRunResults);
router.get('/:runId/export', requireAuth, exportRunResults);

module.exports = router;
