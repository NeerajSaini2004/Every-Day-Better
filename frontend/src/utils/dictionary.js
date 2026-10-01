import api from './api';

export const getDictionaryEntry = async (word) => {
  // Try Free Dictionary API first
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]) return data[0];
    }
  } catch {}

  // Fallback: Groq AI
  const { data } = await api.post('/groq/chat', {
    messages: [{
      role: 'user',
      content: `Give dictionary entry for the word "${word}" in this EXACT JSON format, no extra text:
{"word":"${word}","phonetic":"/phonetic/","meanings":[{"partOfSpeech":"noun/verb/adj","definitions":[{"definition":"meaning here","example":"example sentence"}],"synonyms":["syn1","syn2"]}]}`,
    }],
  });
  try {
    const json = JSON.parse(data.content.match(/\{[\s\S]*\}/)?.[0] || '');
    if (json?.word) return json;
  } catch {}
  throw new Error('Not found');
};
