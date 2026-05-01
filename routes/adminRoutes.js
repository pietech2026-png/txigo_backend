import express from 'express';
const router = express.Router();
import { adminLogin } from '../controllers/adminController.js';

router.post('/login', adminLogin);

import authRoutes from './authRoutes.js';
import driverRoutes from './driverRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import userRoutes from './userRoutes.js';
import rideRoutes from './rideRoutes.js';
import configRoutes from './configRoutes.js';
import financialRoutes from './financialRoutes.js';
import supportRoutes from './supportRoutes.js';
import subscriptionRoutes from './subscriptionRoutes.js';
import promoRoutes from './promoRoutes.js';
import walletRoutes from './walletRoutes.js';

router.use('/auth', authRoutes);
router.use('/drivers', driverRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);
router.use('/rides', rideRoutes);
router.use('/vehicles', configRoutes);
router.use('/financial', financialRoutes);
router.use('/support', supportRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/promotions', promoRoutes);
router.use('/wallet', walletRoutes);

export default router;
