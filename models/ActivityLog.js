import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    details: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model('ActivityLog', ActivityLogSchema);
