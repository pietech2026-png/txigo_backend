import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/txigo');
        console.log('MongoDB Connected');

        const users = await User.find({}, 'fullName mobile walletBalance');
        console.log('Users found:', users.length);
        users.forEach(user => {
            console.log(`${user.fullName} (${user.mobile}): Balance = ${user.walletBalance}`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
