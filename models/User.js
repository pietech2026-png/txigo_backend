import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    walletBalance: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Suspended'],
        default: 'Active'
    },
    totalRides: {
        type: Number,
        default: 0
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
