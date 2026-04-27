import express from 'express';
const router = express.Router();
import { getDriverProfile, updateSubscriptionPlan, updateDutyStatus, updateDriverWallet } from '../controllers/driverController.js';

router.get('/profile/:mobile', getDriverProfile);
router.put('/update-plan', updateSubscriptionPlan);
router.put('/duty-status', updateDutyStatus);
router.post('/wallet/update', updateDriverWallet);

export default router;
