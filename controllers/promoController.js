import PromoCode from '../models/PromoCode.js';

// @desc    Get all promo codes
// @route   GET /api/admin/promotions
// @access  Private
export const getPromos = async (req, res) => {
    try {
        const promos = await PromoCode.find().sort({ createdAt: -1 });
        res.json(promos);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new promo code
// @route   POST /api/admin/promotions
// @access  Private
export const createPromo = async (req, res) => {
    try {
        const promo = await PromoCode.create(req.body);
        res.status(201).json(promo);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a promo code
// @route   PATCH /api/admin/promotions/:id
// @access  Private
export const updatePromo = async (req, res) => {
    try {
        const promo = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!promo) {
            return res.status(404).json({ message: 'Promo not found' });
        }
        res.json(promo);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
