const express = require('express');
const Grammar = require('../models/Grammar');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all grammar rules with filters
router.get('/', protect, async (req, res) => {
  try {
    const { category, difficulty, day } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (day) filter.dayNumber = day;
    
    const rules = await Grammar.find(filter).limit(50);
    res.json(rules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single grammar rule
router.get('/:id', protect, async (req, res) => {
  try {
    const rule = await Grammar.findById(req.params.id);
    if (!rule) return res.status(404).json({ message: 'Grammar rule not found' });
    res.json(rule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get rules by category
router.get('/category/:category', protect, async (req, res) => {
  try {
    const rules = await Grammar.find({ category: req.params.category }).limit(20);
    res.json(rules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
