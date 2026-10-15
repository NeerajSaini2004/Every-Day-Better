const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { profileUpdateRules, changePasswordRules } = require('../middleware/validate');

const router = express.Router();

// Get profile
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

// Update profile
router.put('/profile', protect, profileUpdateRules, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change password
router.put('/change-password', protect, changePasswordRules, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const bcrypt = require('bcryptjs');
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Leaderboard
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit, 10) || 50), 100);

    const users = await User.find({ role: 'user' })
      .select('name xp level streak avatar badges completedDays')
      .sort({ xp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update streak
router.post('/streak', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    if (lastActive) lastActive.setHours(0, 0, 0, 0);

    const diffDays = lastActive ? Math.floor((today - lastActive) / 86400000) : null;

    if (!lastActive || diffDays === 1) {
      user.streak += 1;
      if (user.streak > user.longestStreak) user.longestStreak = user.streak;
    } else if (diffDays > 1) {
      user.streak = 1;
    }
    user.lastActiveDate = new Date();
    await user.save();
    res.json({ streak: user.streak, longestStreak: user.longestStreak });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
