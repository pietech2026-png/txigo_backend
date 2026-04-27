import express from 'express';
const router = express.Router();
import { getRides, getActiveRides, getRideDetails, cancelRide, completeRide } from '../controllers/rideController.js';
import { protect } from '../middleware/authMiddleware.js';

router.use(protect);

router.get('/', getRides);
router.get('/active', getActiveRides);
router.get('/:id', getRideDetails);
router.post('/:id/cancel', cancelRide);
router.post('/:id/complete', completeRide);

export default router;
