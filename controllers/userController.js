const User = require('../models/User');

// @desc    Get all users (passengers)
// @route   GET /api/admin/users
// @access  Private
const getUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, search, city } = req.query;
    let query = {};

    if (status) query.status = status;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (search) {
        query.$or = [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { mobile: { $regex: search, $options: 'i' } }
        ];
    }

    try {
        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .sort({ registeredAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            total,
            page,
            users
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single user details
// @route   GET /api/admin/users/:id
// @access  Private
const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update user status
// @route   PATCH /api/admin/users/:id
// @access  Private
const updateUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = req.body.status || user.status;
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getUsers, getUserDetails, updateUserStatus };
