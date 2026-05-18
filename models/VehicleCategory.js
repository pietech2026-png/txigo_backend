import mongoose from 'mongoose';

const VehicleCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
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
    seater: {
        type: Number,
        default: 4
    },
    capacity: {
        type: Number,
        default: 4
    },
    iconUrl: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, { timestamps: true });

export default mongoose.model('VehicleCategory', VehicleCategorySchema);
