const express = require('express');
const router = express.Router();
const { getUsers, getUserDetails, updateUserStatus } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getUsers);
router.get('/:id', getUserDetails);
router.patch('/:id', updateUserStatus);

module.exports = router;
