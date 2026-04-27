import express from 'express';
const router = express.Router();
import { loginAdmin, getAdminProfile, refreshAdminToken, registerAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/login', loginAdmin);
router.post('/register', registerAdmin);
router.post('/refresh', refreshAdminToken);
router.get('/profile', protect, getAdminProfile);

export default router;
