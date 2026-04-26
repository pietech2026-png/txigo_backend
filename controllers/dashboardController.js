const Driver = require('../models/Driver');
const User = require('../models/User');
const Ride = require('../models/Ride');
const Transaction = require('../models/Transaction');

// @desc    Get dashboard statistics summary
// @route   GET /api/admin/dashboard/stats
// @access  Private
const getStats = async (req, res) => {
    try {
        const totalDrivers = await Driver.countDocuments();
        const pendingVerifications = await Driver.countDocuments({ status: 'Pending' });
        const activeDrivers = await Driver.countDocuments({ status: 'Active' });
        const blockedDrivers = await Driver.countDocuments({ status: 'Blocked' });

        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'Active' });

        // Today's statistics
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const todaysRides = await Ride.countDocuments({
            createdAt: { $gte: startOfToday }
        });

        // Revenue calculation (Total Completed Rides Fare)
        const revenueData = await Ride.aggregate([
            { $match: { status: 'Completed' } },
            { $group: { _id: null, totalRevenue: { $sum: "$fare" } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        res.json({
            stats: {
                totalDrivers,
                pendingVerifications,
                activeDrivers,
                blockedDrivers,
                totalUsers,
                activeUsers,
                todaysRides,
                totalRevenue
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get growth metrics for charts
// @route   GET /api/admin/dashboard/growth
// @access  Private
const getGrowthMetrics = async (req, res) => {
    try {
        // Last 7 days growth data
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const rideGrowth = await Ride.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const userGrowth = await User.aggregate([
            { $match: { registeredAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$registeredAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            rides: rideGrowth,
            users: userGrowth
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getStats, getGrowthMetrics };
