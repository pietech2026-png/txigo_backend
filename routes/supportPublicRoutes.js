import express from 'express';
const router = express.Router();
import { createTicket, getUserTickets } from '../controllers/supportController.js';

router.post('/create', createTicket);
router.get('/my-tickets/:mobile', getUserTickets);

export default router;
