const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updatePricing } = require('../controllers/configController');
const { protect } = require('../middleware/authMiddleware');

// Get categories can be public if needed for the app, but here we group in admin routes
router.get('/categories', getCategories);

// Protected routes for management
router.post('/categories', protect, createCategory);
router.patch('/pricing', protect, updatePricing);

module.exports = router;
