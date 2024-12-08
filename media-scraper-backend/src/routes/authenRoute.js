const express = require('express');
const {scrapeURLs} = require('../controllers/scapeController');
const {login} = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);

module.exports = router;
