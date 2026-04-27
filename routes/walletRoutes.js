import express from 'express';
const router = express.Router();
import { getWalletSummary } from '../controllers/financialController.js';
import { protect } from '../middleware/authMiddleware.js';

router.use(protect);
router.get('/summary', getWalletSummary);

export default router;
