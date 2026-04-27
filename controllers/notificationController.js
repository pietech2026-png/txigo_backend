import Notification from '../models/Notification.js';

// @desc    Get notifications for a driver or user
// @route   GET /api/notifications
// @access  Public
export const getNotifications = async (req, res) => {
    try {
        const { driverId, userId, bookingId } = req.query;
        let query = {};

        if (bookingId) {
            query.relatedId = bookingId;
        } else if (driverId) {
            query.driverId = driverId;
        } else if (userId) {
            query.userId = userId;
        } else {
            query.isRead = false;
        }

        const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(20);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Public
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification) {
            notification.isRead = true;
            await notification.save();
            res.json({ message: 'Notification marked as read' });
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
