import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import Driver from '../models/Driver.js';
import connectDB from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const seed = async () => {
    try {
        await connectDB();

        await Admin.deleteMany();
        await Driver.deleteMany();

        console.log('Data Cleared...');

        const admin = new Admin({
            name: 'Super Admin',
            email: 'admin@txigo.com',
            password: 'admin_password'
        });
        await admin.save();
        console.log('Admin Created: admin@txigo.com / admin_password');

        const sampleDrivers = [
            {
                fullName: 'Rahul Sharma',
                email: 'rahul.sharma@example.com',
                mobile: '7980641007',
                pincode: '700001',
                state: 'West Bengal',
                address: 'Kolkata, Park Street',
                vehicleType: 'car',
                rcNumber: 'WB04F1234',
                aadharNumber: '1234 5678 9012',
                panNumber: 'ABCDE1234F',
                dlNumber: 'DL-1234567890',
                status: 'Active',
                documents: {
                    aadharFront: { url: 'https://via.placeholder.com/150', status: 'verified' },
                    aadharBack: { url: 'https://via.placeholder.com/150', status: 'verified' },
                    panFront: { url: 'https://via.placeholder.com/150', status: 'verified' },
                    dlFront: { url: 'https://via.placeholder.com/150', status: 'verified' },
                    rcFront: { url: 'https://via.placeholder.com/150', status: 'verified' },
                    carFront: { url: 'https://via.placeholder.com/150', status: 'verified' }
                }
            },
            {
                fullName: 'Amit Kumar',
                email: 'amit.kumar@example.com',
                mobile: '9876543210',
                pincode: '110001',
                state: 'Delhi',
                address: 'Connaught Place',
                vehicleType: 'bike',
                rcNumber: 'DL01A1111',
                status: 'Pending',
                documents: {
                    aadharFront: { url: 'https://via.placeholder.com/150', status: 'pending' },
                    rcFront: { url: 'https://via.placeholder.com/150', status: 'pending' }
                }
            }
        ];

        await Driver.insertMany(sampleDrivers);
        console.log('Sample Drivers Created');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seed();
