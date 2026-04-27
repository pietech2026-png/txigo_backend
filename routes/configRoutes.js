import express from 'express';
const router = express.Router();
import { getCategories, createCategory, updatePricing } from '../controllers/configController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/categories', getCategories);
router.post('/categories', protect, createCategory);
router.patch('/pricing', protect, updatePricing);

export default router;
