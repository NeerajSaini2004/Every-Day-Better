const express = require('express');
const Day = require('../models/Day');
const User = require('../models/User');
const Vocabulary = require('../models/Vocabulary');
const Quote = require('../models/Quote');
const daysRouter = require('./days');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, adminOnly);

// Days CRUD
router.post('/days', async (req, res) => {
  try {
    const day = await Day.create(req.body);
    res.status(201).json(day);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/days/:id', async (req, res) => {
  try {
    const day = await Day.findByIdAndUpdate(req.params.id, req.body, { new: true });
    daysRouter.bustCache();
    res.json(day);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/days/:id', async (req, res) => {
  try {
    await Day.findByIdAndDelete(req.params.id);
    daysRouter.bustCache();
    res.json({ message: 'Day deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Users management
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Vocabulary CRUD
router.post('/vocabulary', async (req, res) => {
  try {
    const word = await Vocabulary.create(req.body);
    res.status(201).json(word);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Quotes CRUD
router.post('/quotes', async (req, res) => {
  try {
    const quote = await Quote.create(req.body);
    res.status(201).json(quote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalDays = await Day.countDocuments();
    const totalVocab = await Vocabulary.countDocuments();
    res.json({ totalUsers, totalDays, totalVocab });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
