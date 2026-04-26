console.log("SERVER FILE LOADED");
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const driverPublicRoutes = require('./routes/driverPublicRoutes');
const supportPublicRoutes = require('./routes/supportPublicRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const driverAppRoutes = require('./routes/driverAppRoutes');
const userAppRoutes = require('./routes/userAppRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const path = require('path');
const bcrypt = require('bcryptjs');

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logger for debugging (as requested in original file)
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

// Admin API Routes
app.use('/api/admin', adminRoutes);

// Public Driver API Routes
app.use('/api/drivers', driverPublicRoutes);

// Driver App API Routes (Profile, Plan)
app.use('/api/driver', driverAppRoutes);

// User App API Routes (Profile, Wallet)
app.use('/api/user', userAppRoutes);

// Public Support API Routes (Ticket Creation)
app.use('/api/support', supportPublicRoutes);

// File Upload Route
app.use('/api/upload', uploadRoutes);

// Booking Routes
app.use('/api/bookings', bookingRoutes);

// Notification Routes
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

// Debug Route to generate hash
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
    res.send('Txigo Backend API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});