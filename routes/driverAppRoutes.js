import express from 'express';
const router = express.Router();
import { getDriverProfile, updateSubscriptionPlan, updateDutyStatus, updateDriverWallet, getDrivers } from '../controllers/driverController.js';
import { getDriverBookings } from '../controllers/bookingController.js';
import { driverProtect } from '../middleware/authMiddleware.js';

router.get('/bookings', driverProtect, getDriverBookings);
router.get('/', getDrivers);
router.get('/profile/:mobile', getDriverProfile);
router.put('/update-plan', updateSubscriptionPlan);
router.put('/duty-status', updateDutyStatus);
router.post('/wallet/update', updateDriverWallet);

export default router;
