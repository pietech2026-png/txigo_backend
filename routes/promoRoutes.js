const express = require('express');
const router = express.Router();
const { getPromos, createPromo, updatePromo } = require('../controllers/promoController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getPromos);
router.post('/', createPromo);
router.patch('/:id', updatePromo);

module.exports = router;
