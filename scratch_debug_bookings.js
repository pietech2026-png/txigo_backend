import mongoose from 'mongoose';
import Booking from './models/Booking.js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/txigo');
        console.log("Connected to DB");
        
        const count = await Booking.countDocuments({ status: 'Cancelled' });
        console.log(`Total Cancelled bookings: ${count}`);
        
        const allCount = await Booking.countDocuments({});
        console.log(`Total bookings: ${allCount}`);
        
        const bookings = await Booking.find({ status: { $ne: 'Cancelled' } });
        console.log(`Bookings excluding Cancelled: ${bookings.length}`);
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
