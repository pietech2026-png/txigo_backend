import express from 'express';
const router = express.Router();
import { registerDriver, getDriverStatus, reSubmitDriver } from '../controllers/driverController.js';

router.post('/register', registerDriver);
router.get('/status/:mobile', getDriverStatus);
router.patch('/re-submit/:mobile', reSubmitDriver);

export default router;
