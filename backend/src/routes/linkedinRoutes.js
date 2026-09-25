const express = require('express');
const requireAuth = require('../middleware/authMiddleware');
const { runLinkedin } = require('../controllers/linkedinController');

const router = express.Router();

router.post('/linkedin', requireAuth, runLinkedin);

module.exports = router;
