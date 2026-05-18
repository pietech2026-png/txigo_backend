import mongoose from 'mongoose';

const PricingRuleSchema = new mongoose.Schema({
    vehicleCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VehicleCategory',
        required: true
    },
    scope: {
        type: String,
        enum: ['Global', 'State', 'City'],
        default: 'Global'
    },
    state: {
        type: String,
        default: null // Only if scope is State or City
    },
    city: {
        type: String,
        default: null // Only if scope is City
    },
    baseFare: {
        type: Number,
        required: true
    },
    perKmRate: {
        type: Number,
        required: true
    },
    perMinRate: {
        type: Number,
        required: true
    },
    advancePaymentPercentage: {
        type: Number,
        default: 0 // Optional: can be set per rule
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, { timestamps: true });

// Ensure unique rules per category + scope + state + city
PricingRuleSchema.index({ vehicleCategoryId: 1, scope: 1, state: 1, city: 1 }, { unique: true });

export default mongoose.model('PricingRule', PricingRuleSchema);
