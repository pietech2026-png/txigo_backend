import express from 'express';
const router = express.Router();
import { 
    getTransactions, 
    getWithdrawals, 
    processWithdrawal, 
    adjustWallet 
} from '../controllers/financialController.js';
import { protect } from '../middleware/authMiddleware.js';

router.use(protect);

router.get('/transactions', getTransactions);
router.get('/withdrawals', getWithdrawals);
router.post('/withdrawals/:id/process', processWithdrawal);
router.post('/wallet/adjust', adjustWallet);

export default router;
