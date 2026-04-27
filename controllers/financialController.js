import Transaction from '../models/Transaction.js';
import Withdrawal from '../models/Withdrawal.js';
import User from '../models/User.js';
import Driver from '../models/Driver.js';

// @desc    Get all transactions
// @route   GET /api/admin/transactions
// @access  Private
export const getTransactions = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { type, category, userId } = req.query;
    let query = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (userId) query.userId = userId;

    try {
        const total = await Transaction.countDocuments(query);
        const transactions = await Transaction.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'fullName mobile');

        res.json({
            total,
            page,
            transactions
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all withdrawal requests
// @route   GET /api/admin/withdrawals
// @access  Private
export const getWithdrawals = async (req, res) => {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    try {
        const withdrawals = await Withdrawal.find(query)
            .populate('driverId', 'fullName mobile email')
            .sort({ createdAt: -1 });

        res.json(withdrawals);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Process a withdrawal request
// @route   POST /api/admin/withdrawals/:id/process
// @access  Private
export const processWithdrawal = async (req, res) => {
    const { status, reason } = req.body;

    try {
        const withdrawal = await Withdrawal.findById(req.params.id);
        if (!withdrawal) {
            return res.status(404).json({ message: 'Withdrawal request not found' });
        }

        if (withdrawal.status !== 'Pending') {
            return res.status(400).json({ message: 'Withdrawal already processed' });
        }

        withdrawal.status = status;
        withdrawal.reason = reason || "";
        withdrawal.processedAt = Date.now();

        await withdrawal.save();
        res.json({ message: 'Withdrawal status updated', withdrawal });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Manual wallet adjustment
// @route   POST /api/admin/wallet/adjust
// @access  Private
export const adjustWallet = async (req, res) => {
    const { userType, userId, amount, category, description } = req.body;

    try {
        let account;
        if (userType === 'User') {
            account = await User.findById(userId);
        } else if (userType === 'Driver') {
            account = await Driver.findById(userId);
        } else {
            return res.status(400).json({ message: 'Invalid userType' });
        }

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const prevBalance = account.walletBalance || 0;
        account.walletBalance = prevBalance + amount;
        await account.save();

        await Transaction.create({
            userType,
            userId,
            amount,
            type: amount >= 0 ? 'Credit' : 'Debit',
            category: category || 'Adjustment',
            description: description || 'Manual admin adjustment',
            status: 'Completed'
        });

        res.json({ 
            message: 'Wallet adjusted successfully', 
            newBalance: account.walletBalance 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get wallet summary
// @route   GET /api/admin/wallet/summary
// @access  Private
export const getWalletSummary = async (req, res) => {
    try {
        const stats = await Driver.aggregate([
            {
                $group: {
                    _id: null,
                    totalSystemBalance: { $sum: { $ifNull: ["$walletBalance", 0] } },
                    totalNegativeBalances: { 
                        $sum: { 
                            $cond: [
                                { $lt: [{ $ifNull: ["$walletBalance", 0] }, 0] }, 
                                { $ifNull: ["$walletBalance", 0] }, 
                                0
                            ] 
                        }
                    },
                    onlineCount: {
                        $sum: {
                            $cond: [
                                { $and: [
                                    { $eq: ["$dutyStatus", "Online"] },
                                    { $lt: [{ $ifNull: ["$walletBalance", 0] }, 100] }
                                ]},
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const result = stats.length > 0 ? stats[0] : {
            totalSystemBalance: 0,
            totalNegativeBalances: 0,
            onlineCount: 0
        };

        res.json({
            totalSystemBalance: result.totalSystemBalance,
            totalNegativeBalances: Math.abs(result.totalNegativeBalances),
            onlineDriversWithLowBalanceCount: result.onlineCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
