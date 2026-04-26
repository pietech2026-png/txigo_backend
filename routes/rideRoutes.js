const express = require('express');
const router = express.Router();
const { getRides, getActiveRides, getRideDetails, cancelRide, completeRide } = require('../controllers/rideController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getRides);
router.get('/active', getActiveRides);
router.get('/:id', getRideDetails);
router.post('/:id/cancel', cancelRide);
router.post('/:id/complete', completeRide);

module.exports = router;
