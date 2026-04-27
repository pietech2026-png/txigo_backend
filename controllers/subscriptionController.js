import SubscriptionPlan from '../models/SubscriptionPlan.js';

// @desc    Get all subscription plans
// @route   GET /api/admin/subscriptions
// @access  Public
export const getPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find();
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new subscription plan
// @route   POST /api/admin/subscriptions
// @access  Private
export const createPlan = async (req, res) => {
    try {
        const plan = await SubscriptionPlan.create(req.body);
        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a subscription plan
// @route   PATCH /api/admin/subscriptions/:id
// @access  Private
export const updatePlan = async (req, res) => {
    try {
        const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
