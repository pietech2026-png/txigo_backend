import express from 'express';
const router = express.Router();
import { 
    getCategories, 
    createCategory, 
    updatePricing, 
    getPricingRules, 
    upsertPricingRule, 
    deletePricingRule,
    getGlobalSettings,
    updateGlobalSetting
} from '../controllers/configController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/categories', getCategories);
router.post('/categories', protect, createCategory);
router.patch('/pricing', protect, updatePricing);

router.get('/pricing-rules', protect, getPricingRules);
router.post('/pricing-rules', protect, upsertPricingRule);
router.delete('/pricing-rules/:id', protect, deletePricingRule);

router.get('/settings', protect, getGlobalSettings);
router.post('/settings', protect, updateGlobalSetting);

export default router;
