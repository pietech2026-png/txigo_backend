import mongoose from 'mongoose';

const SubscriptionPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    durationDays: {
        type: Number,
        required: true
    },
    features: [String],
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, { timestamps: true });

export default mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);
