const express = require('express');
const router = express.Router();
const { getPlans, createPlan, updatePlan } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPlans);
router.post('/', protect, createPlan);
router.patch('/:id', protect, updatePlan);

module.exports = router;
