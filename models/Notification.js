import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: false
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Cancellation', 'New Ride', 'Account', 'Other'],
        default: 'Other'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId
    }
}, { timestamps: true });

export default mongoose.model('Notification', NotificationSchema);
