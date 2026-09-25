const express = require('express');
const authRoutes = require('./authRoutes');
const naukriRoutes = require('./naukriRoutes');
const linkedinRoutes = require('./linkedinRoutes');
const scrapesRoutes = require('./scrapesRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/scrapers', naukriRoutes);
router.use('/scrapers', linkedinRoutes);
router.use('/scrapes', scrapesRoutes);

module.exports = router;
