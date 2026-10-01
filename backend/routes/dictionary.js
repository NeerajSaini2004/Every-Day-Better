const express = require('express');
const { protect } = require('../middleware/auth');
const Vocabulary = require('../models/Vocabulary');

const router = express.Router();

const formatFromDatamuse = (defData, synData, word) => {
  if (!Array.isArray(defData) || !defData[0] || !defData[0].defs?.length) return null;
  const posMap = { n: 'noun', v: 'verb', adj: 'adjective', adv: 'adverb', u: 'interjection' };
  const meaningsByPos = {};

  const synonyms = Array.isArray(synData) ? synData.map((s) => s.word).filter(Boolean) : [];

  defData[0].defs.forEach((defStr) => {
    const parts = defStr.split('\t');
    const pos = posMap[parts[0]] || parts[0] || 'general';
    const definition = (parts[1] || '').trim();
    if (!meaningsByPos[pos]) meaningsByPos[pos] = [];
    meaningsByPos[pos].push({ definition });
  });

  const meanings = Object.entries(meaningsByPos).map(([partOfSpeech, definitions]) => ({
    partOfSpeech,
    definitions,
    synonyms,
  }));

  return {
    word: defData[0].word || word,
    phonetic: '',
    meanings,
  };
};

const formatFromDbVocab = (v) => ({
  word: v.word,
  phonetic: v.pronunciation || '',
  meanings: [
    {
      partOfSpeech: v.category || 'general',
      definitions: [
        {
          definition: `${v.meaning}${v.hindiMeaning ? ` (${v.hindiMeaning})` : ''}`,
          example: v.exampleSentence || '',
        },
      ],
      synonyms: [],
    },
  ],
});

router.get('/:word', protect, async (req, res) => {
  const word = String(req.params.word || '').trim();
  if (!/^[a-zA-Z\s'-]{1,80}$/.test(word)) {
    return res.status(400).json({ message: 'Enter a valid English word.' });
  }

  // 1. Try Free Dictionary API with short timeout to prevent Cloudflare 522 hangs
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      { signal: AbortSignal.timeout(2500) }
    );
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data[0]?.word) {
        return res.json(data[0]);
      }
    }
  } catch (err) {
    // Timeout or upstream error — gracefully fall through to fast backup providers
  }

  // 2. Try Datamuse API (fast, high-uptime, free definitions & synonyms)
  try {
    const [defRes, synRes] = await Promise.all([
      fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&md=dp&max=1`, { signal: AbortSignal.timeout(3000) }),
      fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}&max=5`, { signal: AbortSignal.timeout(3000) }),
    ]);

    if (defRes.ok) {
      const defData = await defRes.json();
      const synData = synRes.ok ? await synRes.json() : [];
      const entry = formatFromDatamuse(defData, synData, word);
      if (entry) return res.json(entry);
    }
  } catch (err) {
    // Continue to DB fallback
  }

  // 3. Try Local DB Vocabulary
  try {
    const safeRegex = new RegExp(`^${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    const dbVocab = await Vocabulary.findOne({ word: safeRegex });
    if (dbVocab) {
      return res.json(formatFromDbVocab(dbVocab));
    }
  } catch (err) {
    // Continue to next fallback
  }

  // 4. Try Gemini AI if configured
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `Provide dictionary entry for the English word "${word}" in this EXACT JSON format, no extra text:
{"word":"${word}","phonetic":"/phonetic/","meanings":[{"partOfSpeech":"noun/verb/adj","definitions":[{"definition":"clear concise meaning","example":"example sentence"}],"synonyms":["syn1","syn2"]}]}`;

      const aiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
          }),
          signal: AbortSignal.timeout(5000),
        }
      );

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        const text = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/)?.[0];
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch);
          if (parsed?.word && Array.isArray(parsed?.meanings)) {
            return res.json(parsed);
          }
        }
      }
    } catch (err) {
      console.warn('Gemini dictionary fallback failed:', err.message);
    }
  }

  return res.status(404).json({ message: `No dictionary entry found for "${word}".` });
});

module.exports = router;
