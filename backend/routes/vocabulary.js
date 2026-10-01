const express = require('express');
const Vocabulary = require('../models/Vocabulary');
const Quote = require('../models/Quote');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/available-days', protect, async (req, res) => {
  try {
    const days = await Vocabulary.distinct('dayNumber');
    res.json(days.sort((a, b) => a - b));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/daily-quote', protect, async (req, res) => {
  try {
    const count = await Quote.countDocuments();
    if (count === 0) return res.status(404).json({ message: 'No quotes found' });
    const random = Math.floor(Math.random() * count);
    const quote = await Quote.findOne().skip(random);
    res.json(quote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/quotes', protect, async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const { day, difficulty, page = 1, limit = 200 } = req.query;
    const filter = {};
    if (day) filter.dayNumber = Number(day);
    if (difficulty) filter.difficulty = difficulty;
    const words = await Vocabulary.find(filter)
      .limit(Math.min(Number(limit), 200))
      .skip((Number(page) - 1) * Math.min(Number(limit), 200))
      .lean();
    res.json(words);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch vocabulary' });
  }
});

module.exports = router;
