const express = require('express');
const requireAuth = require('../middleware/authMiddleware');
const { runNaukri } = require('../controllers/naukriController');

const router = express.Router();

router.post('/naukri', requireAuth, runNaukri);

module.exports = router;
