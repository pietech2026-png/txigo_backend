const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Driver = require('../models/Driver');
const connectDB = require('../config/db');
require('dotenv').config();

const seed = async () => {
    try {
        await connectDB();

        // Clear existing data (optional, but good for reset)
        await Admin.deleteMany();
        await Driver.deleteMany();

        console.log('Data Cleared...');

        // Create Admin
        const admin = new Admin({
            name: 'Super Admin',
            email: 'admin@txigo.com',
            password: 'admin_password' // This will be hashed by the pre-save hook
        });
        await admin.save();
        console.log('Admin Created: admin@txigo.com / admin_password');

        // Create Sample Drivers
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
                type: 'regular',
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
                type: 'regular',
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
