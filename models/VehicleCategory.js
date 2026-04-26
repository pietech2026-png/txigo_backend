const mongoose = require('mongoose');

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

module.exports = mongoose.model('VehicleCategory', VehicleCategorySchema);
