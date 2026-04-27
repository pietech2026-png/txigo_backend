import express from 'express';
const router = express.Router();
import { getNotifications, markAsRead } from '../controllers/notificationController.js';

router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);

export default router;
