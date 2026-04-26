const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Notification = require('./models/Notification');
const dotenv = require('dotenv');

dotenv.config();

const testUserCancel = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // 1. Create dummy user and booking
        const mobile = "9999999999";
        let user = await User.findOne({ mobile });
        if (!user) {
            user = await User.create({ fullName: "Test User", mobile, walletBalance: 500 });
        } else {
            user.walletBalance = 500;
            await user.save();
        }

        const booking = await Booking.create({
            customerName: "Test User",
            customerMobile: mobile,
            serviceType: "Outstation",
            pickupTime: new Date(),
            status: "Pending",
            pricing: { totalFare: 1000 }
        });

        console.log(`Created test booking: ${booking._id}`);
        console.log(`Initial wallet balance: ${user.walletBalance}`);

        // 2. Simulate call to user-cancel logic
        // (Instead of HTTP call, we'll try to find if we can just call the controller logic or similar)
        // For simplicity, let's just use a fetch if the server is running.
        // Or just run the logic manually here to verify models.
        
        // Actually, the server is running on port 5001 (from server.js)
        // I'll use fetch.
        const response = await fetch(`http://localhost:5001/api/bookings/${booking._id}/user-cancel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: "Testing cancellation" })
        });

        const result = await response.json();
        console.log("Cancellation Result:", result);

        // 3. Verify changes
        const updatedUser = await User.findOne({ mobile });
        console.log(`New wallet balance: ${updatedUser.walletBalance}`);
        
        const updatedBooking = await Booking.findById(booking._id);
        console.log(`Booking Status: ${updatedBooking.status}`);
        
        const transaction = await Transaction.findOne({ relatedId: booking._id });
        console.log(`Transaction amount: ${transaction?.amount}`);

        const notification = await Notification.findOne({ title: 'Ride Cancelled by User' }).sort({ createdAt: -1 });
        console.log(`Notification created: ${notification?.message}`);

        await mongoose.disconnect();
    } catch (err) {
        console.error("Test failed:", err);
    }
};

testUserCancel();
