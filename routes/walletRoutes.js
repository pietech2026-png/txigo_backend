const express = require('express');
const router = express.Router();
const { getWalletSummary } = require('../controllers/financialController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/summary', getWalletSummary);

module.exports = router;
