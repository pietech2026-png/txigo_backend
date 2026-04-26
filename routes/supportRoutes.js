const express = require('express');
const router = express.Router();
const { 
    getTickets, 
    getTicketDetails, 
    replyTicket, 
    updateTicketStatus,
    deleteTicket 
} = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/tickets', getTickets);
router.get('/tickets/:id', getTicketDetails);
router.post('/tickets/:id/reply', replyTicket);
router.patch('/tickets/:id', updateTicketStatus);
router.delete('/tickets/:id', deleteTicket);

module.exports = router;
