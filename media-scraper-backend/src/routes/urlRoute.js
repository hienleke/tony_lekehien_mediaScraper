const express = require('express');
const {getURLs , getURLDetail , getAllURLDetails} = require('../controllers/urlController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(authMiddleware);
router.get('/urls', getURLs);
router.get('/urls/:id', getURLDetail);
router.get('/urlmedias', getAllURLDetails);




module.exports = router;
