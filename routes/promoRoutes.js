import express from 'express';
const router = express.Router();
import { getPromos, createPromo, updatePromo } from '../controllers/promoController.js';
import { protect } from '../middleware/authMiddleware.js';

router.use(protect);

router.get('/', getPromos);
router.post('/', createPromo);
router.patch('/:id', updatePromo);

export default router;
