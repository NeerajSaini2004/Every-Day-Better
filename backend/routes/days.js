const express = require('express');
const Day = require('../models/Day');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Days never change after seeding — cache in memory after first load
let cachedDays = null;

// Get all days
router.get('/', protect, async (req, res) => {
  try {
    if (!cachedDays) {
      cachedDays = await Day.find({ isActive: true }).sort({ dayNumber: 1 }).lean();
    }
    res.json(cachedDays);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch days' });
  }
});

// Get single day
router.get('/:dayNumber', protect, async (req, res) => {
  try {
    const dayNum = Number(req.params.dayNumber);
    if (isNaN(dayNum)) return res.status(400).json({ message: 'Invalid day number' });
    const day = await Day.findOne({ dayNumber: dayNum });
    if (!day) return res.status(404).json({ message: 'Day not found' });
    res.json(day);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch day' });
  }
});

// Call this after admin updates a day to bust the cache
router.bustCache = () => { cachedDays = null; };

module.exports = router;
