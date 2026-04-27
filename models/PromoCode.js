import mongoose from 'mongoose';

const PromoCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    discountType: {
        type: String,
        enum: ['Percentage', 'Flat'],
        required: true
    },
    discountAmount: {
        type: Number,
        required: true
    },
    maxDiscount: {
        type: Number,
        default: 0
    },
    minOrderAmount: {
        type: Number,
        default: 0
    },
    expiryDate: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        default: 100
    },
    usedCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Expired'],
        default: 'Active'
    }
}, { timestamps: true });

export default mongoose.model('PromoCode', PromoCodeSchema);
