const express = require('express');
const { protect } = require('../middleware/auth');
const { aiRateLimit, aiBurstLimit } = require('../middleware/aiRateLimit');
const { aiChatRules } = require('../middleware/validate');

const router = express.Router();

router.post('/chat', protect, aiRateLimit, aiBurstLimit, aiChatRules, async (req, res) => {
  const { messages, model = 'llama-3.1-8b-instant' } = req.body;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(503).json({ message: 'AI service not configured' });

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, temperature: 0.3, max_tokens: 1024 }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ message: err.error?.message || 'Groq API error' });
    }

    const data = await response.json();
    res.json({ content: data.choices[0]?.message?.content || '' });
  } catch (err) {
    res.status(500).json({ message: 'AI request failed' });
  }
});

module.exports = router;
