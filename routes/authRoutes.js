const express = require('express');
const router = express.Router();
const { loginAdmin, getAdminProfile, refreshAdminToken, registerAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.post('/register', registerAdmin);
router.post('/refresh', refreshAdminToken);
router.get('/profile', protect, getAdminProfile);

module.exports = router;
