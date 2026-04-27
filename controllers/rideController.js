import Ride from '../models/Ride.js';
import Driver from '../models/Driver.js';
import Transaction from '../models/Transaction.js';

// @desc    Get all rides (history)
// @route   GET /api/admin/rides
// @access  Private
export const getRides = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, vehicleType } = req.query;
    let query = {};

    if (status) query.status = status;
    if (vehicleType) query.vehicleType = vehicleType;

    try {
        const total = await Ride.countDocuments(query);
        const rides = await Ride.find(query)
            .populate('passengerId', 'fullName mobile')
            .populate('driverId', 'fullName mobile vehicleType')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            total,
            page,
            rides
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get live active rides
// @route   GET /api/admin/rides/active
// @access  Private
export const getActiveRides = async (req, res) => {
    try {
        const rides = await Ride.find({ status: { $in: ['Requested', 'Accepted', 'Active'] } })
            .populate('passengerId', 'fullName mobile')
            .populate('driverId', 'fullName mobile vehicleType')
            .sort({ createdAt: -1 });

        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single ride details
// @route   GET /api/admin/rides/:id
// @access  Private
export const getRideDetails = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id)
            .populate('passengerId', 'fullName email mobile')
            .populate('driverId', 'fullName email mobile vehicleType rcNumber');
        
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Cancel a ride
// @route   POST /api/admin/rides/:id/cancel
// @access  Private
export const cancelRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.status === 'Completed') {
            return res.status(400).json({ message: 'Cannot cancel a completed ride' });
        }

        ride.status = 'Cancelled';
        await ride.save();

        res.json({ message: 'Ride cancelled successfully', ride });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Complete a ride and calculate commission
// @route   POST /api/admin/rides/:id/complete
// @access  Private
export const completeRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.status === 'Completed') {
            return res.status(400).json({ message: 'Ride is already completed' });
        }

        const driver = await Driver.findById(ride.driverId);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        const commissionRate = driver.subscriptionPlan === 'Prime' ? 0.05 : 0.15;
        const commissionAmount = ride.fare * commissionRate;
        const driverEarnings = ride.fare - commissionAmount;

        driver.walletBalance = (driver.walletBalance || 0) + driverEarnings;
        await driver.save();

        await Transaction.create({
            userType: 'Driver',
            userId: driver._id,
            amount: -commissionAmount,
            type: 'Debit',
            category: 'Commission',
            description: `Commission for ride ${ride._id} (${driver.subscriptionPlan} plan: ${(commissionRate * 100).toFixed(0)}%)`,
            relatedId: ride._id,
            status: 'Completed'
        });

        await Transaction.create({
            userType: 'Driver',
            userId: driver._id,
            amount: ride.fare,
            type: 'Credit',
            category: 'Ride Fare',
            description: `Fare for ride ${ride._id}`,
            relatedId: ride._id,
            status: 'Completed'
        });

        ride.status = 'Completed';
        ride.completedAt = Date.now();
        await ride.save();

        res.json({ 
            message: 'Ride completed and commission processed', 
            ride,
            commissionAmount,
            driverEarnings,
            newWalletBalance: driver.walletBalance
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
