import api from './api';

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

export const getDictionaryEntry = async (rawWord) => {
  const word = String(rawWord || '').trim();
  if (!word) throw new Error('Word is required');

  // 1. Try backend dictionary proxy
  try {
    const res = await api.get(`/dictionary/${encodeURIComponent(word)}`);
    if (res.data && res.data.word && Array.isArray(res.data.meanings)) {
      return res.data;
    }
  } catch (err) {
    // Continue to fallbacks
  }

  // 2. Direct client fetch to Free Dictionary API with short 2.5s timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.word) return data[0];
    }
  } catch {}

  // 3. Datamuse API (fast, high availability, free)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const [defRes, synRes] = await Promise.all([
      fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&md=dp&max=1`, { signal: controller.signal }),
      fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}&max=5`, { signal: controller.signal }),
    ]);
    clearTimeout(timeoutId);

    if (defRes.ok) {
      const defData = await defRes.json();
      const synData = synRes.ok ? await synRes.json() : [];
      const entry = formatFromDatamuse(defData, synData, word);
      if (entry) return entry;
    }
  } catch {}

  // 4. Gemini AI fallback
  try {
    const { data } = await api.post('/gemini/chat', {
      messages: [{
        role: 'user',
        content: `Give dictionary entry for the word "${word}" in this EXACT JSON format, no extra text:
{"word":"${word}","phonetic":"/phonetic/","meanings":[{"partOfSpeech":"noun/verb/adj","definitions":[{"definition":"meaning here","example":"example sentence"}],"synonyms":["syn1","syn2"]}]}`,
      }],
    });
    const jsonMatch = data?.content?.match(/\{[\s\S]*\}/)?.[0];
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch);
      if (parsed?.word && Array.isArray(parsed?.meanings)) return parsed;
    }
  } catch {}

  throw new Error(`No definition found for "${word}"`);
};
