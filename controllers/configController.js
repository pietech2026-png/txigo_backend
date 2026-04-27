import VehicleCategory from '../models/VehicleCategory.js';

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

// @desc    Update pricing for a vehicle category
// @route   PATCH /api/admin/vehicles/pricing
// @access  Private
export const updatePricing = async (req, res) => {
    const { name, baseFare, perKmRate, perMinRate } = req.body;

    try {
        const category = await VehicleCategory.findOne({ name });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        if (baseFare !== undefined) category.baseFare = baseFare;
        if (perKmRate !== undefined) category.perKmRate = perKmRate;
        if (perMinRate !== undefined) category.perMinRate = perMinRate;

        await category.save();
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
