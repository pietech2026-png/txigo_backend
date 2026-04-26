const express = require('express');
const router = express.Router();
const { getStats, getGrowthMetrics } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getStats);
router.get('/growth', protect, getGrowthMetrics);

module.exports = router;
