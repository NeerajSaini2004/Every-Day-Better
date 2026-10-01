const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/today', protect, async (req, res) => {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return res.status(503).json({ message: 'News service not configured' });

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=in&language=en&pageSize=10&apiKey=${apiKey}`
    );
    const data = await response.json();
    const articles = (data.articles || []).filter(
      (a) => a.description && a.title && !a.title.includes('[Removed]')
    );
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch news' });
  }
});

module.exports = router;
