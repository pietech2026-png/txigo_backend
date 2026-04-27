import mongoose from 'mongoose';

const SupportTicketSchema = new mongoose.Schema({
    userType: {
        type: String,
        enum: ['User', 'Driver'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'userType'
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    replies: [
        {
            senderType: { type: String, enum: ['Admin', 'User', 'Driver'] },
            message: String,
            createdAt: { type: Date, default: Date.now }
        }
    ],
    closedAt: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model('SupportTicket', SupportTicketSchema);
