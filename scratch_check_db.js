import mongoose from 'mongoose';
import Driver from './models/Driver.js';
import dotenv from 'dotenv';
dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/txigo');
        console.log('Connected to DB');
        
        const count = await Driver.countDocuments({});
        console.log('Total Drivers:', count);
        
        const drivers = await Driver.find({}).limit(5);
        console.log('Recent Drivers:', JSON.stringify(drivers, null, 2));
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkDB();
