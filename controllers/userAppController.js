import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

// @desc    Get user profile
// @route   GET /api/user/profile/:mobile
// @access  Public
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ mobile: req.params.mobile });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({
            id: user._id,
            fullName: user.fullName,
            mobile: user.mobile,
            email: user.email,
            city: user.city,
            profilePic: user.profilePic,
            walletBalance: user.walletBalance || 0,
            status: user.status,
            rating: user.rating,
            totalRides: user.totalRides,
            registeredAt: user.registeredAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update user wallet balance
// @route   POST /api/user/wallet/update
export const updateWalletBalance = async (req, res) => {
    const { mobile, amount, category, description } = req.body;
    if (!amount || isNaN(amount)) return res.status(400).json({ message: 'Valid amount is required' });
    try {
        const user = await User.findOne({ mobile });
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.walletBalance = (user.walletBalance || 0) + parseFloat(amount);
        await user.save();
        await Transaction.create({
            userType: 'User',
            userId: user._id,
            amount: Math.abs(amount),
            type: amount >= 0 ? 'Credit' : 'Debit',
            category: category || 'Wallet Topup',
            description: description || 'Wallet balance update from app',
            status: 'Completed'
        });
        res.json({ message: 'Wallet updated successfully', walletBalance: user.walletBalance });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
