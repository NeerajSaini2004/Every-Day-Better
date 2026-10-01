const express = require('express');
const Day = require('../models/Day');
const User = require('../models/User');
const Vocabulary = require('../models/Vocabulary');
const Quote = require('../models/Quote');
const Grammar = require('../models/Grammar');
const DailyChallenge = require('../models/DailyChallenge');
const daysRouter = require('./days');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, adminOnly);

// Days CRUD
router.post('/days', async (req, res) => {
  try {
    const day = await Day.create(req.body);
    res.status(201).json(day);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/days/:id', async (req, res) => {
  try {
    const day = await Day.findByIdAndUpdate(req.params.id, req.body, { new: true });
    daysRouter.bustCache();
    res.json(day);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/days/:id', async (req, res) => {
  try {
    await Day.findByIdAndDelete(req.params.id);
    daysRouter.bustCache();
    res.json({ message: 'Day deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Users management
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Vocabulary CRUD
router.post('/vocabulary', async (req, res) => {
  try {
    const word = await Vocabulary.create(req.body);
    res.status(201).json(word);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/vocabulary/:id', async (req, res) => {
  try {
    const word = await Vocabulary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(word);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/vocabulary/:id', async (req, res) => {
  try {
    await Vocabulary.findByIdAndDelete(req.params.id);
    res.json({ message: 'Word deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Quotes CRUD
router.post('/quotes', async (req, res) => {
  try {
    const quote = await Quote.create(req.body);
    res.status(201).json(quote);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/quotes/:id', async (req, res) => {
  try {
    const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(quote);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/quotes/:id', async (req, res) => {
  try {
    await Quote.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quote deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Grammar CRUD
router.get('/grammar', async (req, res) => {
  try {
    const rules = await Grammar.find().sort({ dayNumber: 1 });
    res.json(rules);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/grammar', async (req, res) => {
  try {
    const rule = await Grammar.create(req.body);
    res.status(201).json(rule);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/grammar/:id', async (req, res) => {
  try {
    const rule = await Grammar.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(rule);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/grammar/:id', async (req, res) => {
  try {
    await Grammar.findByIdAndDelete(req.params.id);
    res.json({ message: 'Grammar rule deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Daily Challenge CRUD
router.get('/challenges', async (req, res) => {
  try {
    const challenges = await DailyChallenge.find().sort({ createdAt: -1 });
    res.json(challenges);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/challenges', async (req, res) => {
  try {
    const challenge = await DailyChallenge.create(req.body);
    res.status(201).json(challenge);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/challenges/:id', async (req, res) => {
  try {
    const challenge = await DailyChallenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(challenge);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/challenges/:id', async (req, res) => {
  try {
    await DailyChallenge.findByIdAndDelete(req.params.id);
    res.json({ message: 'Challenge deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalDays = await Day.countDocuments();
    const totalVocab = await Vocabulary.countDocuments();
    const totalChallenges = await DailyChallenge.countDocuments();
    const totalGrammar = await Grammar.countDocuments();
    res.json({ totalUsers, totalDays, totalVocab, totalChallenges, totalGrammar });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
