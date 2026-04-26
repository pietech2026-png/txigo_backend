const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
    userType: {
        type: String,
        enum: ['Admin', 'User', 'Driver'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'userType'
    },
    action: {
        type: String,
        required: true // e.g., 'Update Status', 'Login', 'Verify Document'
    },
    details: {
        type: String // e.g., 'Status changed from Pending to Active'
    },
    ipAddress: String,
    deviceInfo: String
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
