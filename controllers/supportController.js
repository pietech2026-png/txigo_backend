import SupportTicket from '../models/SupportTicket.js';
import User from '../models/User.js';
import Driver from '../models/Driver.js';

// @desc    Get all support tickets
// @route   GET /api/admin/support/tickets
// @access  Private
export const getTickets = async (req, res) => {
    const { status, priority, mobile } = req.query;
    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    try {
        if (mobile) {
            const user = await User.findOne({ mobile });
            const driver = await Driver.findOne({ mobile });
            const searchIds = [];
            if (user) searchIds.push(user._id);
            if (driver) searchIds.push(driver._id);

            if (searchIds.length > 0) {
                query.userId = { $in: searchIds };
            } else {
                return res.json([]);
            }
        }

        const tickets = await SupportTicket.find(query)
            .populate('userId', 'fullName mobile')
            .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get ticket details
// @route   GET /api/admin/support/tickets/:id
// @access  Private
export const getTicketDetails = async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id)
            .populate('userId', 'fullName mobile email');
        
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Reply to a ticket
// @route   POST /api/admin/support/tickets/:id/reply
// @access  Private
export const replyTicket = async (req, res) => {
    const { message } = req.body;
    try {
        const ticket = await SupportTicket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        ticket.replies.push({ senderType: 'Admin', message, createdAt: Date.now() });
        ticket.status = 'In-Progress';
        await ticket.save();
        res.json({ message: 'Reply sent successfully', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update ticket status
// @route   PATCH /api/admin/support/tickets/:id
// @access  Private
export const updateTicketStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const ticket = await SupportTicket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        ticket.status = status;
        if (status === 'Resolved' || status === 'Closed') {
            ticket.closedAt = Date.now();
        }
        await ticket.save();
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new support ticket (Public)
// @route   POST /api/support/create
export const createTicket = async (req, res) => {
    const { userType, mobile, subject, message, priority } = req.body;
    if (!userType || !mobile || !subject || !message) return res.status(400).json({ message: 'Please provide all required fields' });
    try {
        let user;
        if (userType === 'User') {
            user = await User.findOne({ mobile });
        } else if (userType === 'Driver') {
            user = await Driver.findOne({ mobile });
        }
        if (!user) return res.status(404).json({ message: `${userType} not found` });
        const ticket = new SupportTicket({ userType, userId: user._id, subject, message, priority: priority || 'Medium' });
        await ticket.save();
        res.status(201).json({ message: 'Ticket raised successfully', ticketId: ticket._id });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a ticket
export const deleteTicket = async (req, res) => {
    try {
        const ticket = await SupportTicket.findByIdAndDelete(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.json({ message: 'Ticket removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get tickets for a specific user (Public)
export const getUserTickets = async (req, res) => {
    const { mobile } = req.params;
    try {
        const user = await User.findOne({ mobile });
        const driver = await Driver.findOne({ mobile });
        const searchIds = [];
        if (user) searchIds.push(user._id);
        if (driver) searchIds.push(driver._id);
        if (searchIds.length === 0) return res.status(404).json({ message: 'User not found' });
        const tickets = await SupportTicket.find({ userId: { $in: searchIds } }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
