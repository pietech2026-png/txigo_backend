const mongoose = require('mongoose');

const WithdrawalSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    bankDetails: {
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        holderName: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Processed', 'Rejected'],
        default: 'Pending'
    },
    reason: {
        type: String, // Reason for rejection
        default: ""
    },
    processedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Withdrawal', WithdrawalSchema);
