import express from 'express';
const router = express.Router();
import { getUserProfile, updateWalletBalance } from '../controllers/userAppController.js';

router.get('/profile/:mobile', getUserProfile);
router.post('/wallet/update', updateWalletBalance);

export default router;
