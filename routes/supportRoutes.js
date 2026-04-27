import express from 'express';
const router = express.Router();
import { 
    getTickets, 
    getTicketDetails, 
    replyTicket, 
    updateTicketStatus,
    deleteTicket 
} from '../controllers/supportController.js';
import { protect } from '../middleware/authMiddleware.js';

router.use(protect);

router.get('/tickets', getTickets);
router.get('/tickets/:id', getTicketDetails);
router.post('/tickets/:id/reply', replyTicket);
router.patch('/tickets/:id', updateTicketStatus);
router.delete('/tickets/:id', deleteTicket);

export default router;
