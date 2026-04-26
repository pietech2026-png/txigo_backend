const express = require('express');
const router = express.Router();
const { getDriverProfile, updateSubscriptionPlan, updateDutyStatus, updateDriverWallet } = require('../controllers/driverController');

// Routes for mobile app
router.get('/profile/:mobile', getDriverProfile);
router.put('/update-plan', updateSubscriptionPlan);
router.put('/duty-status', updateDutyStatus);
router.post('/wallet/update', updateDriverWallet);

module.exports = router;
