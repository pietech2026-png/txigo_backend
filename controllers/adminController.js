import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token (adding this to keep it compatible with existing system)
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d'
    });

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
          id: admin._id,
          email: admin.email
      },
      adminId: admin._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
