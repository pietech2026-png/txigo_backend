const express = require('express');
const router = express.Router();
const { 
    getTransactions, 
    getWithdrawals, 
    processWithdrawal, 
    adjustWallet 
} = require('../controllers/financialController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/transactions', getTransactions);
router.get('/withdrawals', getWithdrawals);
router.post('/withdrawals/:id/process', processWithdrawal);
router.post('/wallet/adjust', adjustWallet);

module.exports = router;
