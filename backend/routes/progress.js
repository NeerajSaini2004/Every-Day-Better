const express = require('express');
const Progress = require('../models/Progress');
const User = require('../models/User');
const Day = require('../models/Day');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all progress for user — lean projection, no full task arrays
router.get('/', protect, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id })
      .select('dayNumber day isCompleted completionPercentage totalXPEarned tasks.taskId tasks.completed tasks.xpEarned')
      .lean();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch progress' });
  }
});

// Get progress for specific day
router.get('/:dayNumber', protect, async (req, res) => {
  try {
    const dayNum = Number(req.params.dayNumber);
    if (isNaN(dayNum)) return res.status(400).json({ message: 'Invalid day number' });
    const day = await Day.findOne({ dayNumber: dayNum });
    if (!day) return res.status(404).json({ message: 'Day not found' });
    let progress = await Progress.findOne({ user: req.user._id, day: day._id });
    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        day: day._id,
        dayNumber: day.dayNumber,
        tasks: day.tasks.map((t) => ({ taskId: t._id, taskType: t.type, completed: false, xpEarned: 0 })),
      });
    }
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch progress' });
  }
});

// Update task completion
router.put('/:dayNumber/task/:taskId', protect, async (req, res) => {
  try {
    const { completed } = req.body;
    const day = await Day.findOne({ dayNumber: req.params.dayNumber });
    if (!day) return res.status(404).json({ message: 'Day not found' });

    let progress = await Progress.findOne({ user: req.user._id, day: day._id });
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    const task = day.tasks.id(req.params.taskId);
    const taskProgress = progress.tasks.find((t) => t.taskId?.toString() === req.params.taskId);

    if (taskProgress) {
      taskProgress.completed = completed;
      taskProgress.xpEarned = completed ? task.xp : 0;
      if (completed) taskProgress.completedAt = new Date();
    }

    const completedCount = progress.tasks.filter((t) => t.completed).length;
    progress.completionPercentage = Math.round((completedCount / progress.tasks.length) * 100);
    progress.totalXPEarned = progress.tasks.reduce((sum, t) => sum + t.xpEarned, 0);
    progress.isCompleted = progress.completionPercentage === 100;
    if (progress.isCompleted && !progress.completedAt) progress.completedAt = new Date();

    await progress.save();

    // Update user XP, completedDays and STREAK
    const user = await User.findById(req.user._id);
    const allProgress = await Progress.find({ user: req.user._id });
    user.xp = allProgress.reduce((sum, p) => sum + p.totalXPEarned, 0);
    user.level = Math.floor(user.xp / 500) + 1;
    user.completedDays = allProgress.filter((p) => p.isCompleted).map((p) => p.dayNumber);
    user.totalTasksCompleted = allProgress.reduce((sum, p) => sum + p.tasks.filter((t) => t.completed).length, 0);

    // Streak — only update once per calendar day to prevent multi-task inflation
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const last = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    if (last) last.setHours(0, 0, 0, 0);
    const diffDays = last ? Math.floor((today - last) / 86400000) : null;
    const alreadyCountedToday = diffDays === 0;
    if (!alreadyCountedToday) {
      if (!last || diffDays === 1) {
        user.streak += 1;
        if (user.streak > user.longestStreak) user.longestStreak = user.streak;
      } else {
        user.streak = 1;
      }
      user.lastActiveDate = new Date();
    }

    // Award badges
    if (user.completedDays.length >= 1 && !user.badges.includes('first_day')) user.badges.push('first_day');
    if (user.completedDays.length >= 7 && !user.badges.includes('week_warrior')) user.badges.push('week_warrior');
    if (user.completedDays.length >= 30 && !user.badges.includes('month_master')) user.badges.push('month_master');
    if (user.completedDays.length >= 60 && !user.badges.includes('champion')) user.badges.push('champion');
    if (user.streak >= 7 && !user.badges.includes('streak_7')) user.badges.push('streak_7');

    await user.save();
    res.json({ progress, user: { xp: user.xp, level: user.level, completedDays: user.completedDays, badges: user.badges, streak: user.streak, longestStreak: user.longestStreak } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
