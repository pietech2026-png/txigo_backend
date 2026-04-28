console.log("SERVER FILE LOADED");
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import driverPublicRoutes from './routes/driverPublicRoutes.js';
import supportPublicRoutes from './routes/supportPublicRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import driverAppRoutes from './routes/driverAppRoutes.js';
import userAppRoutes from './routes/userAppRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Static folder for uploaded files
app.use('/uploads', express.static('/tmp'));

// Logger for debugging
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

// Admin API Routes
app.use('/api/admin', adminRoutes);

// Public Driver API Routes
app.use('/api/drivers', driverPublicRoutes);

// Driver App API Routes
app.use('/api/driver', driverAppRoutes);

// User App API Routes
app.use('/api/user', userAppRoutes);

// Public Support API Routes
app.use('/api/support', supportPublicRoutes);

// File Upload Route
app.use('/api/upload', uploadRoutes);

// Booking Routes
app.use('/api/bookings', bookingRoutes);

// Notification Routes
import notificationRoutes from './routes/notificationRoutes.js';
app.use('/api/notifications', notificationRoutes);

// Debug Route
app.get('/create-admin', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash("Admin@123", 10);
        console.log("HASH:", hashedPassword);
        res.json({ password: hashedPassword });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Root Route
app.get('/', (req, res) => {
    res.send('Txigo Backend API is running on Vercel 🚀');
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

export default app;