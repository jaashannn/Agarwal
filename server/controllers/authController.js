import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Profile from '../models/Profile.js';
import crypto from 'crypto';
import { transporter } from '../index.js'; // adjust path if needed

const register = async (req, res) => {
  const { name, email, gender, mobile, creatorRole, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      gender,
      mobile,
      creatorRole,
      password: hashedPassword,
      verified: false
    });

    await user.save();

    // Create an empty profile for the user
    const profile = new Profile({
      user: user._id
    });

    await profile.save();

    // Update user with profile reference
    user.profile = profile._id;
    await user.save();

    res.status(201).json({ message: 'User and profile registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        gender: user.gender, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '10d' }
    );
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' })
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email); 
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: 'Your Password Reset OTP',
      text: `Your OTP is: ${otp}`,
    });

    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (
      !user ||
      user.resetOTP !== otp ||
      !user.resetOTPExpiry ||
      user.resetOTPExpiry < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    res.json({ message: 'OTP verified' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (
      !user ||
      user.resetOTP !== otp ||
      !user.resetOTPExpiry ||
      user.resetOTPExpiry < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { register, login, logout }