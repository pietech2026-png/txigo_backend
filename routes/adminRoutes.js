const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const driverRoutes = require('./driverRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const userRoutes = require('./userRoutes');
const rideRoutes = require('./rideRoutes');
const configRoutes = require('./configRoutes');
const financialRoutes = require('./financialRoutes');
const supportRoutes = require('./supportRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');
const promoRoutes = require('./promoRoutes');
const walletRoutes = require('./walletRoutes');

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

module.exports = router;
