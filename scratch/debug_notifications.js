const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const dotenv = require('dotenv');

dotenv.config();

const debugNotifications = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(10);
        console.log("Recent Notifications:", JSON.stringify(notifications, null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error("Debug failed:", err);
    }
};

debugNotifications();
