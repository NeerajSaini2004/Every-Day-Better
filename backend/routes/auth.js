const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendPasswordResetEmail } = require('../utils/email');
const {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  onboardingRules,
  googleAuthRules,
} = require('../middleware/validate');

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
router.post('/register', authLimiter, registerRules, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email: email.toLowerCase().trim() })) return res.status(400).json({ message: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password: hashed });
    res.status(201).json({ token: generateToken(user._id), user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
router.post('/login', authLimiter, loginRules, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    // Use constant-time compare even if user not found to prevent timing attacks
    const match = user ? await bcrypt.compare(password, user.password) : await bcrypt.compare(password, '$2b$12$invalidhashtopreventtimingattack1234567890');
    if (!user || !match) return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: generateToken(user._id), user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Google OAuth — verifies Google ID token server-side
router.post('/google', authLimiter, googleAuthRules, async (req, res) => {
  try {
    const { credential } = req.body;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({ message: 'Google OAuth is not configured. Add GOOGLE_CLIENT_ID to backend/.env.' });
    }

    // Verify the ID token with Google's servers
    const client = new OAuth2Client(clientId);
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });
    } catch (verifyErr) {
      return res.status(401).json({ message: 'Invalid or expired Google token' });
    }

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.status(401).json({ message: 'Google token does not contain email' });
    }

    const { email, name, sub: googleId, picture: avatar } = payload;

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        googleId,
        avatar: avatar || '',
      });
    } else if (!user.googleId) {
      // Link existing email-password account with Google
      user.googleId = googleId;
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save();
    }

    res.json({ token: generateToken(user._id), user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ message: 'Google auth failed' });
  }
});

// Forgot Password
router.post('/forgot-password', authLimiter, forgotPasswordRules, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account with that email found' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 min
    await user.save();

    // Build reset URL — use CLIENT_URL if set, otherwise fall back to localhost for dev
    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:3000').split(',')[0].trim().replace(/\/+$/, '');
    const resetUrl = `${clientUrl}/reset-password/${token}`;

    // Attempt to send email; fall back to dev-mode response if SMTP not configured
    const emailSent = await sendPasswordResetEmail(email, resetUrl);

    if (emailSent) {
      return res.json({ message: 'Password reset link sent to your email' });
    }

    // Dev mode fallback — only expose token when email service is not available
    if (process.env.NODE_ENV !== 'production') {
      return res.json({ message: 'Reset link generated (dev mode — email not configured)', resetUrl, token });
    }

    // Production without email = bad config, but don't leak the token
    return res.status(503).json({ message: 'Email service not configured. Contact support.' });
  } catch (err) {
    res.status(500).json({ message: 'Request failed' });
  }
});

// Reset Password
router.post('/reset-password/:token', resetPasswordRules, async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    user.password = await bcrypt.hash(req.body.password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ token: generateToken(user._id), user: formatUser(user), message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Reset failed' });
  }
});

// Complete Onboarding
router.post('/onboarding', protect, onboardingRules, async (req, res) => {
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
