const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();
const DEFAULT_MODEL = 'gemini-3.8-flash';

const buildContents = (messages = []) => messages
  .filter((message) => message && ['user', 'assistant'].includes(message.role) && typeof message.content === 'string')
  .map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content.trim() }],
  }))
  .filter((message) => message.parts[0].text);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.post('/chat', protect, async (req, res) => {
  const { messages, model = DEFAULT_MODEL } = req.body;
  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ message: 'messages required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ message: 'Google Gemini is not configured. Add GEMINI_API_KEY to backend/.env.' });
  }

  const contents = buildContents(messages);
  if (!contents.length) return res.status(400).json({ message: 'At least one user or assistant message is required.' });

  const systemInstruction = messages.find((message) => message?.role === 'system' && typeof message.content === 'string')?.content?.trim();

  try {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...(systemInstruction ? { systemInstruction: { parts: [{ text: systemInstruction }] } } : {}),
            generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
            contents,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        const content = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
        if (!content) return res.status(502).json({ message: 'Google Gemini returned an empty response. Please try again.' });
        return res.json({ content });
      }

      if (![429, 503].includes(response.status) || attempt === 2) {
        const status = response.status === 429 || response.status === 503 ? 503 : response.status;
        const message = data.error?.message || 'Google Gemini request failed.';
        return res.status(status).json({ message });
      }

      await wait(500 * (2 ** attempt) + Math.floor(Math.random() * 250));
    }
  } catch (err) {
    console.error('Google Gemini request failed:', err.message);
    return res.status(502).json({ message: 'Could not reach Google Gemini. Check the backend connection and try again.' });
  }
});

module.exports = router;
