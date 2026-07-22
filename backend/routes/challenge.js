const express = require('express');
const DailyChallenge = require('../models/DailyChallenge');
const User = require('../models/User');
const Vocabulary = require('../models/Vocabulary');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get today's challenge question
router.get('/today', protect, async (req, res) => {
  try {
    const count = await DailyChallenge.countDocuments();
    if (count === 0) return res.status(404).json({ message: 'No challenges available' });
    const start = new Date('2024-01-01');
    const today = new Date();
    const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    const idx = diff % count;
    const challenge = await DailyChallenge.findOne().skip(idx);
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit answer
router.post('/submit', protect, async (req, res) => {
  try {
    const { challengeId, selectedIndex } = req.body;
    const challenge = await DailyChallenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    const correct = selectedIndex === challenge.correctIndex;
    const user = await User.findById(req.user._id);
    const today = new Date().toDateString();
    const alreadyDone = user.lastChallengeDate?.toDateString() === today;

    let xpEarned = 0;
    if (!alreadyDone && correct) {
      xpEarned = 15;
      user.xp += xpEarned;
      user.level = Math.floor(user.xp / 500) + 1;
      user.totalChallengesCompleted += 1;
      user.challengeStreak += 1;
      user.lastChallengeDate = new Date();
      await user.save();
    }

    res.json({
      correct,
      correctIndex: challenge.correctIndex,
      explanation: challenge.explanation,
      hindiExplanation: challenge.hindiExplanation,
      xpEarned,
      alreadyDone,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SRS — get words due for review
router.get('/srs/due', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('srsWords.wordId');
    const now = new Date();
    const due = user.srsWords
      .filter((s) => s.nextReview <= now && s.wordId)
      .slice(0, 10)
      .map((s) => ({ ...s.wordId.toObject(), srsId: s._id, interval: s.interval }));
    res.json(due);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SRS — add word to review queue
router.post('/srs/add', protect, async (req, res) => {
  try {
    const { wordId } = req.body;
    const user = await User.findById(req.user._id);
    const exists = user.srsWords.find((s) => s.wordId?.toString() === wordId);
    if (!exists) {
      user.srsWords.push({ wordId, nextReview: new Date(), interval: 1 });
      await user.save();
    }
    res.json({ message: 'Word added to review queue' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SRS — submit review result (SM-2 algorithm)
router.post('/srs/review', protect, async (req, res) => {
  try {
    const { srsId, quality } = req.body; // quality: 0=fail, 1=hard, 2=easy
    const user = await User.findById(req.user._id);
    const srsWord = user.srsWords.id(srsId);
    if (!srsWord) return res.status(404).json({ message: 'SRS word not found' });

    if (quality === 0) {
      srsWord.interval = 1;
      srsWord.repetitions = 0;
    } else {
      srsWord.repetitions += 1;
      if (srsWord.repetitions === 1) srsWord.interval = 1;
      else if (srsWord.repetitions === 2) srsWord.interval = 3;
      else srsWord.interval = Math.round(srsWord.interval * srsWord.easeFactor);
      srsWord.easeFactor = Math.max(1.3, srsWord.easeFactor + 0.1 - (2 - quality) * 0.08);
    }

    const next = new Date();
    next.setDate(next.getDate() + srsWord.interval);
    srsWord.nextReview = next;
    await user.save();
    res.json({ nextReview: next, interval: srsWord.interval });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
