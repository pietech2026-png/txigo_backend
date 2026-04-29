import express from 'express';
const router = express.Router();
import { 
    createBooking, 
    getBookings, 
    getBookingById, 
    updateBooking,
    acceptBooking,
    cancelBooking,
    userCancelBooking,
    deleteBooking,
    completeBooking
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/', getBookings);
router.get('/:id', getBookingById);
router.post('/:id/accept', acceptBooking);
router.post('/:id/cancel', cancelBooking);
router.post('/:id/user-cancel', userCancelBooking);
router.post('/:id/complete', completeBooking);
router.post('/', protect, createBooking);
router.patch('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

export default router;
