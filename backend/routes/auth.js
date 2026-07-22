const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 7d is enough — 30d is too long a window if a token is compromised
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many attempts. Try again in 15 minutes.' },
});

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  xp: user.xp,
  level: user.level,
  streak: user.streak,
  longestStreak: user.longestStreak,
  role: user.role,
  completedDays: user.completedDays,
  badges: user.badges,
  onboardingDone: user.onboardingDone,
  englishLevel: user.englishLevel,
  goal: user.goal,
  dailyTime: user.dailyTime,
});

// Register
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: 'All fields required' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
    if (await User.findOne({ email: email.toLowerCase().trim() })) return res.status(400).json({ message: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password: hashed });
    res.status(201).json({ token: generateToken(user._id), user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    // Use constant-time compare even if user not found to prevent timing attacks
    const match = user ? await bcrypt.compare(password, user.password) : await bcrypt.compare(password, '$2b$12$invalidhashtopreventtimingattack1234567890');
    if (!user || !match) return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: generateToken(user._id), user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Google OAuth — must come from real Google SDK in production (add token verification)
router.post('/google', async (req, res) => {
  try {
    const { name, email, googleId, avatar } = req.body;
    if (!email || !googleId) return res.status(400).json({ message: 'Invalid Google credentials' });
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) user = await User.create({ name, email: email.toLowerCase(), googleId, avatar });
    res.json({ token: generateToken(user._id), user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ message: 'Google auth failed' });
  }
});

// Forgot Password
router.post('/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account with that email found' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 min
    await user.save();

    // In production use nodemailer — for now return token in dev
    const resetUrl = `http://localhost:3000/reset-password/${token}`;
    if (process.env.NODE_ENV === 'development') {
      return res.json({ message: 'Reset link generated (dev mode)', resetUrl, token });
    }
    res.json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Request failed' });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    const { password } = req.body;
    if (!password || password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ token: generateToken(user._id), user: formatUser(user), message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Reset failed' });
  }
});

// Complete Onboarding
router.post('/onboarding', protect, async (req, res) => {
  try {
    const { englishLevel, goal, dailyTime } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { englishLevel, goal, dailyTime, onboardingDone: true },
      { new: true }
    );
    res.json({ user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
