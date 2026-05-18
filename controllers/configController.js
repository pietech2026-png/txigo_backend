import VehicleCategory from '../models/VehicleCategory.js';
import PricingRule from '../models/PricingRule.js';
import GlobalSetting from '../models/GlobalSetting.js';

// @desc    Get all vehicle categories
// @route   GET /api/admin/vehicles/categories
// @access  Public
export const getCategories = async (req, res) => {
    try {
        const categories = await VehicleCategory.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create new vehicle category
// @route   POST /api/admin/vehicles/categories
// @access  Private
export const createCategory = async (req, res) => {
    try {
        const category = await VehicleCategory.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update pricing for a vehicle category (Global Pricing in Category)
// @route   PATCH /api/admin/vehicles/pricing
// @access  Private
export const updatePricing = async (req, res) => {
    const { name, baseFare, perKmRate, perMinRate, seater } = req.body;

    try {
        const category = await VehicleCategory.findOne({ name });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        if (baseFare !== undefined) category.baseFare = baseFare;
        if (perKmRate !== undefined) category.perKmRate = perKmRate;
        if (perMinRate !== undefined) category.perMinRate = perMinRate;
        if (seater !== undefined) category.seater = seater;

        await category.save();
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all pricing rules (State/City wise)
export const getPricingRules = async (req, res) => {
    try {
        const rules = await PricingRule.find().populate('vehicleCategoryId');
        res.json(rules);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create or Update pricing rule
export const upsertPricingRule = async (req, res) => {
    const { vehicleCategoryId, scope, state, city, baseFare, perKmRate, perMinRate, advancePaymentPercentage } = req.body;
    try {
        const filter = { vehicleCategoryId, scope, state, city };
        const update = { baseFare, perKmRate, perMinRate, advancePaymentPercentage };
        const options = { new: true, upsert: true, setDefaultsOnInsert: true };
        
        const rule = await PricingRule.findOneAndUpdate(filter, update, options);
        res.json(rule);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete pricing rule
export const deletePricingRule = async (req, res) => {
    try {
        await PricingRule.findByIdAndDelete(req.params.id);
        res.json({ message: 'Pricing rule deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get global settings
export const getGlobalSettings = async (req, res) => {
    try {
        const settings = await GlobalSetting.find();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update global setting
export const updateGlobalSetting = async (req, res) => {
    const { key, value, description } = req.body;
    try {
        const setting = await GlobalSetting.findOneAndUpdate(
            { key },
            { value, description },
            { new: true, upsert: true }
        );
        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
