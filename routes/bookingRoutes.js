const express = require('express');
const router = express.Router();
const { 
    createBooking, 
    getBookings, 
    getBookingById, 
    updateBooking,
    acceptBooking,
    cancelBooking,
    userCancelBooking,
    deleteBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// GET routes are public for User App integration
router.get('/', getBookings);
router.get('/:id', getBookingById);

// Acceptance and Cancellation logic (public for driver claim/release flow)
router.post('/:id/accept', acceptBooking);
router.post('/:id/cancel', cancelBooking);
router.post('/:id/user-cancel', userCancelBooking);

// Creation and Updates remain protected for Admin use
router.post('/', protect, createBooking);
router.patch('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

module.exports = router;
