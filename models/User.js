const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String,
        default: ""
    },
    profilePic: {
        type: String,
        default: ""
    },
    walletBalance: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Blocked', 'Inactive'],
        default: 'Active'
    },
    rating: {
        type: Number,
        default: 5.0
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

module.exports = mongoose.model('User', UserSchema);
