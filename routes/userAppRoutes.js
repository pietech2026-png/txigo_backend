const express = require('express');
const router = express.Router();
const { getUserProfile, updateWalletBalance } = require('../controllers/userAppController');

// Routes for user mobile app
router.get('/profile/:mobile', getUserProfile);
router.post('/wallet/update', updateWalletBalance);

module.exports = router;
