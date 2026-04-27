import express from 'express';
const router = express.Router();
import { getPlans, createPlan, updatePlan } from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/', getPlans);
router.post('/', protect, createPlan);
router.patch('/:id', protect, updatePlan);

export default router;
