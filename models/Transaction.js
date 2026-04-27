import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
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
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['Credit', 'Debit'],
        required: true
    },
    category: {
        type: String,
        enum: ['Ride Fare', 'Commission', 'Withdrawal', 'Wallet Topup', 'Adjustment', 'Cancellation Fee', 'Refund'],
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Completed'
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId
    }
}, { timestamps: true });

export default mongoose.model('Transaction', TransactionSchema);
