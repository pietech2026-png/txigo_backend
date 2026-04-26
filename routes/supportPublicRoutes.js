const express = require('express');
const router = express.Router();
const { createTicket, getUserTickets } = require('../controllers/supportController');

// Public route for creating tickets
router.post('/create', createTicket);

// Public route for users to see their tickets and admin replies
router.get('/my-tickets/:mobile', getUserTickets);

module.exports = router;
