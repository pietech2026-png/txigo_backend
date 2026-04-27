import express from 'express';
const router = express.Router();
import { getStats, getGrowthMetrics } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/stats', protect, getStats);
router.get('/growth', protect, getGrowthMetrics);

export default router;
