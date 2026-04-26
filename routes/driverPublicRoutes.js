const express = require('express');
const router = express.Router();
const { registerDriver, getDriverStatus, reSubmitDriver } = require('../controllers/driverController');

// Public routes for driver app
router.post('/register', registerDriver);
router.get('/status/:mobile', getDriverStatus);
router.patch('/re-submit/:mobile', reSubmitDriver);

module.exports = router;
