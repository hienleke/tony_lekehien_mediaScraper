const express = require('express');
const {scrapeURLs} = require('../controllers/scapeController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

router.post('/scrape', scrapeURLs);

module.exports = router;
