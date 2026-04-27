import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// @desc    Authenticate admin & get token
// @route   POST /api/admin/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.comparePassword(password))) {
            const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'secret123', {
                expiresIn: '30d'
            });

            res.json({
                token,
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get admin profile
// @route   GET /api/admin/auth/profile
// @access  Private
const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).select('-password');
        if (admin) {
            res.json(admin);
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Refresh admin token
// @route   POST /api/admin/auth/refresh
// @access  Public
const refreshAdminToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET || 'secret123', {
            expiresIn: '30d'
        });

        res.json({ token: newToken });
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
};

// @desc    Register a new admin
// @route   POST /api/admin/auth/register
// @access  Public (Should be protected in production)
const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const adminExists = await Admin.findOne({ email });

        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = await Admin.create({
            name,
            email,
            password
        });

        if (admin) {
            res.status(201).json({
                id: admin._id,
                name: admin.name,
                email: admin.email,
                token: jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'secret123', {
                    expiresIn: '30d'
                })
            });
        } else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export { loginAdmin, getAdminProfile, refreshAdminToken, registerAdmin };
