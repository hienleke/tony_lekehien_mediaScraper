const express = require('express');
const {getURLs , getURLDetail} = require('../controllers/urlController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(authMiddleware);
router.get('/urls', getURLs);
router.get('/urls/:id', getURLDetail);


module.exports = router;
