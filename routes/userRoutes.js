import express from 'express';
const router = express.Router();
import { getUsers, getUserDetails, updateUserStatus } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.use(protect);

router.get('/', getUsers);
router.get('/:id', getUserDetails);
router.patch('/:id', updateUserStatus);

export default router;
