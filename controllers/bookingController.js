const Booking = require('../models/Booking');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private/Admin
const createBooking = async (req, res) => {
    try {
        const bookingData = req.body;
        
        // Map frontend fields if necessary (The user schema already matches mostly, 
        // but we ensure consistency here)
        const booking = new Booking({
            ...bookingData,
            timeline: [{
                status: 'Created',
                message: `Booking created by ${bookingData.customerName || 'Admin'}`
            }]
        });
        const createdBooking = await booking.save();
        
        res.status(201).json(createdBooking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all bookings with filters
// @route   GET /api/bookings
// @access  Public/Admin
const getBookings = async (req, res) => {
    try {
        const { status, serviceType, customerMobile, assignedDriverMobile, isAvailable, startDate, endDate } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }
        if (serviceType) query.serviceType = serviceType;
        if (customerMobile) query.customerMobile = customerMobile;
        if (assignedDriverMobile) query.assignedDriverMobile = assignedDriverMobile;
        
        if (isAvailable === 'true') {
            query.assignedDriverMobile = null;
            query.status = 'Pending';
        }
        
        if (startDate && endDate) {
            query.pickupTime = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const bookings = await Booking.find(query).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: error.message });
    }
};

const Driver = require('../models/Driver');

// @desc    Accept a booking (Driver Claim)
// @route   POST /api/bookings/:id/accept
// @access  Public
const acceptBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { driverMobile } = req.body;

        if (!driverMobile) {
            return res.status(400).json({ message: 'Driver mobile is required' });
        }

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const driver = await Driver.findOne({ mobile: driverMobile });
        const driverName = driver ? driver.fullName : driverMobile;

        if (booking.assignedDriverMobile) {
            return res.status(400).json({ message: 'Booking already accepted by another driver' });
        }

        // Atomically claim the booking
        booking.assignedDriverMobile = driverMobile;
        booking.status = 'Confirmed';
        booking.acceptedAt = new Date();
        
        booking.timeline.push({
            status: 'Accepted',
            message: `Pilot ${driverName} (${driverMobile}) accepted the ride`
        });

        const updatedBooking = await booking.save();

        // [ADD] Notification for Admin about Pilot acceptance
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString();

        await Notification.create({
            title: 'Driver accepted the ride',
            message: `Driver accepted the ride: ${driverName}, ${driverMobile}, ${dateStr}, ${timeStr}`,
            type: 'New Ride',
            relatedId: booking._id
        });

        res.json(updatedBooking);
    } catch (error) {
        console.error('Error accepting booking:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Public/Admin
const getBookingById = async (req, res) => {
// ... (rest remains same but I'll update module.exports)
    try {
        const booking = await Booking.findById(req.params.id);
        if (booking) {
            res.json(booking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        console.error('Error fetching booking details:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking (status, pilot, financials)
// @route   PATCH /api/bookings/:id
// @access  Private/Admin
const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (booking) {
            const updates = req.body;
            const previousStatus = booking.status;
            
            Object.keys(updates).forEach((key) => {
                if (typeof updates[key] === 'object' && updates[key] !== null && !Array.isArray(updates[key])) {
                    // Deep merge for nested objects like pricing or vehicle
                    booking[key] = { ...booking[key]._doc, ...updates[key] };
                } else {
                    booking[key] = updates[key];
                }
            });

            if (updates.status && updates.status !== previousStatus) {
                booking.timeline.push({
                    status: updates.status,
                    message: `Status updated from ${previousStatus} to ${updates.status}`
                });
            } else if (updates.allocatedPilot) {
                booking.timeline.push({
                    status: booking.status,
                    message: `Driver assigned: ${updates.allocatedPilot.name} (${updates.allocatedPilot.mobile})`
                });
            } else {
                booking.timeline.push({
                    status: booking.status,
                    message: `Booking details updated by Admin`
                });
            }

            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (booking) {
            await Booking.findByIdAndDelete(req.params.id);
            res.json({ message: 'Booking removed' });
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Cancel a booking (Driver Release)
// @route   POST /api/bookings/:id/cancel
// @access  Public
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Reset assignment and status to Pending
        const prevDriverMobile = booking.assignedDriverMobile;
        const driver = await Driver.findOne({ mobile: prevDriverMobile });
        const driverName = driver ? driver.fullName : prevDriverMobile;

        booking.assignedDriverMobile = null;
        booking.status = 'Pending';
        booking.acceptedAt = null;
        
        booking.timeline.push({
            status: 'Cancelled',
            message: `Pilot ${driverName} (${prevDriverMobile}) cancelled/released the ride. Reason: ${reason || 'No reason provided'}`
        });

        const updatedBooking = await booking.save();

        // [ADD] Notification for Admin about Pilot cancellation
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString();

        await Notification.create({
            title: 'Driver cancelled the ride',
            message: `Driver cancelled the ride: ${driverName}, ${prevDriverMobile}, reason of cancellation: ${reason || 'No reason provided'}, ${timeStr}, ${dateStr}`,
            type: 'Cancellation',
            relatedId: booking._id
        });

        res.json(updatedBooking);
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(400).json({ message: error.message });
    }
};

const userCancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status === 'Cancelled' || booking.status === 'Completed') {
            return res.status(400).json({ message: `Booking cannot be cancelled from status: ${booking.status}` });
        }

        // 1. Charge User Wallet
        const user = await User.findOne({ mobile: booking.customerMobile });
        if (user) {
            user.walletBalance = (user.walletBalance || 0) - 100;
            await user.save();

            // Create Transaction record
            await Transaction.create({
                userType: 'User',
                userId: user._id,
                amount: -100,
                type: 'Debit',
                category: 'Cancellation Fee',
                description: `Cancellation fee for Booking ${id}`,
                relatedId: booking._id,
                status: 'Completed'
            });
        }

        // 2. Update Booking Status
        booking.status = 'Cancelled';
        booking.cancellationReason = reason || 'Cancelled by User';
        booking.cancelledBy = 'User';
        
        booking.timeline.push({
            status: 'Cancelled',
            message: `User (${booking.customerName}) cancelled the ride. Reason: ${booking.cancellationReason}`
        });

        const updatedBooking = await booking.save();

        // 3. Create Notifications
        // For Admin
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString();

        await Notification.create({
            title: 'User cancelled the ride',
            message: `User cancelled the ride: ${booking.customerName}, ${booking.customerMobile}, reason of cancellation: ${booking.cancellationReason}, ${timeStr}, ${dateStr}`,
            type: 'Cancellation',
            relatedId: booking._id
        });

        // For assigned Pilot (if any)
        if (booking.assignedDriverMobile) {
             const driver = await Driver.findOne({ mobile: booking.assignedDriverMobile });
             if (driver) {
                 await Notification.create({
                     driverId: driver._id,
                     title: 'Assigned Ride Cancelled',
                     message: `The ride for ${booking.customerName} has been cancelled by the user.`,
                     type: 'Cancellation'
                 });
             }
        }

        res.json({ message: 'Booking cancelled and fee charged', booking: updatedBooking });
    } catch (error) {
        console.error('Error in user cancellation:', error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
    acceptBooking,
    cancelBooking,
    userCancelBooking
};
