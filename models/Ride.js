import mongoose from 'mongoose';

const RideSchema = new mongoose.Schema({
    passengerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver'
    },
    pickupLocation: {
        address: String,
        latitude: Number,
        longitude: Number
    },
    dropLocation: {
        address: String,
        latitude: Number,
        longitude: Number
    },
    status: {
        type: String,
        enum: ['Requested', 'Accepted', 'Active', 'Completed', 'Cancelled'],
        default: 'Requested'
    },
    fare: {
        type: Number,
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    vehicleType: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Wallet', 'Card'],
        default: 'Cash'
    },
    startedAt: {
        type: Date
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model('Ride', RideSchema);
