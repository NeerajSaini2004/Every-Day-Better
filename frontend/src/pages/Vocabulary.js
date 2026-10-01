import React, { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import { getDictionaryEntry } from '../utils/dictionary';
import { useAuth } from '../context/AuthContext';
import VocabCard from '../components/ui/VocabCard';
import DictCard from '../components/ui/DictCard';
import Spinner from '../components/ui/Spinner';
import { getDayWords } from '../utils/dailyWords';
import { Search, Calendar, BookOpen, Zap, Volume2, ChevronDown, ChevronUp } from 'lucide-react';

const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

// Compact card for API daily words
function ApiWordCard({ word, data, loading, error }) {
  const [expanded, setExpanded] = useState(false);

  const audioUrl = data?.phonetics?.find((p) => p.audio)?.audio || '';
  const phonetic = data?.phonetic || data?.phonetics?.find((p) => p.text)?.text || '';
  const firstMeaning = data?.meanings?.[0];
  const firstDef = firstMeaning?.definitions?.[0];

  const playAudio = () => {
    if (audioUrl) {
      new Audio(audioUrl).play();
    } else {
      const u = new SpeechSynthesisUtterance(word);
      u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-4 flex items-center gap-3 animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-white/5" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/5 rounded w-24" />
          <div className="h-3 bg-white/5 rounded w-40" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="font-bold text-white capitalize">{word}</p>
          <p className="text-xs text-gray-500 mt-0.5">Definition not available</p>
        </div>
        <button onClick={playAudio} className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition">
          <Volume2 size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden transition-all">
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={playAudio}
          className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 flex items-center justify-center shrink-0 transition"
        >
          <Volume2 size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-black text-white capitalize">{data.word}</h3>
            {phonetic && <span className="text-xs text-blue-400 font-mono">{phonetic}</span>}
            {firstMeaning && (
              <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full italic">
                {firstMeaning.partOfSpeech}
              </span>
            )}
          </div>
          {firstDef && (
            <p className="text-sm text-gray-300 mt-1">{firstDef.definition}</p>
          )}
          {firstDef?.example && (
            <p className="text-xs text-gray-500 italic mt-1">"{firstDef.example}"</p>
          )}
          {firstMeaning?.synonyms?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="text-xs text-gray-600">syn:</span>
              {firstMeaning.synonyms.slice(0, 3).map((s) => (
                <span key={s} className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-lg">{s}</span>
              ))}
            </div>
          )}
        </div>
        {data.meanings?.length > 1 && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="shrink-0 p-1.5 rounded-lg bg-white/5 text-gray-500 hover:text-gray-300 transition"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>

      {expanded && data.meanings?.slice(1).map((m, i) => (
        <div key={i} className="border-t border-white/5 px-4 py-3">
          <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full italic">{m.partOfSpeech}</span>
          {m.definitions.slice(0, 2).map((def, j) => (
            <p key={j} className="text-sm text-gray-400 mt-2">
              <span className="text-gray-600 mr-1">{j + 1}.</span>{def.definition}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Vocabulary() {
  const { user } = useAuth();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [quote, setQuote] = useState(null);
  const [viewMode, setViewMode] = useState('api');
  const [availableDays, setAvailableDays] = useState([]);

  // API daily words state
  const [apiWords, setApiWords] = useState({});   // { word: { data, loading, error } }
  const [apiLoading, setApiLoading] = useState(false);

  // Dictionary lookup state
  const [lookupWord, setLookupWord] = useState('');
  const [dictResult, setDictResult] = useState(null);
  const [dictLoading, setDictLoading] = useState(false);
  const [dictError, setDictError] = useState('');

  // Current day based on user progress
  const currentDay = Math.min((user?.completedDays?.length || 0) + 1, 60);

  // Fetch API words for current day
  const fetchApiWords = useCallback(async (dayNum) => {
    const wordList = getDayWords(dayNum);
    setApiLoading(true);
    // Set all to loading first
    const initial = {};
    wordList.forEach((w) => { initial[w] = { loading: true, data: null, error: false }; });
    setApiWords(initial);

    // Fetch all in parallel
    await Promise.all(
      wordList.map(async (word) => {
        try {
          const entry = await getDictionaryEntry(word);
          setApiWords((prev) => ({ ...prev, [word]: { loading: false, data: entry, error: false } }));
        } catch {
          setApiWords((prev) => ({ ...prev, [word]: { loading: false, data: null, error: true } }));
        }
      })
    );
    setApiLoading(false);
  }, []);

  useEffect(() => {
    if (viewMode === 'api') fetchApiWords(currentDay);
  }, [viewMode, currentDay, fetchApiWords]);

  // Fetch DB vocab + quote
  useEffect(() => {
    api.get('/vocabulary/available-days').then((r) => setAvailableDays(r.data));
  }, []);

  useEffect(() => {
    if (availableDays.length === 0 || viewMode === 'api' || viewMode === 'lookup') return;
    const load = async () => {
      setLoading(true);
      try {
        const params = {};
        if (difficulty !== 'all') params.difficulty = difficulty;
        if (viewMode === 'today') params.day = availableDays[0];
        const [wordsRes, quoteRes] = await Promise.all([
          api.get('/vocabulary', { params }),
          api.get('/vocabulary/daily-quote'),
        ]);
        setWords(wordsRes.data);
        setQuote(quoteRes.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [difficulty, viewMode, availableDays]); // eslint-disable-line react-hooks/exhaustive-deps

  const lookupDictionary = useCallback(async (e) => {
    e.preventDefault();
    const word = lookupWord.trim();
    if (!word) return;
    setDictLoading(true);
    setDictError('');
    setDictResult(null);
    try {
      const data = await getDictionaryEntry(word);
      setDictResult(data);
    } catch {
      setDictError(`No results found for "${word}". Try another word.`);
    } finally {
      setDictLoading(false);
    }
  }, [lookupWord]);

  const filtered = words.filter((w) =>
    w.word.toLowerCase().includes(search.toLowerCase()) ||
    w.meaning.toLowerCase().includes(search.toLowerCase()) ||
    w.hindiMeaning.includes(search)
  );

  const dayWords = getDayWords(currentDay);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Vocabulary Builder 📝</h1>
        <p className="text-gray-400 text-sm mt-1">Learn new words every day</p>
      </div>

      {/* Daily Quote — only on db tabs */}
      {quote && (viewMode === 'today' || viewMode === 'all') && (
        <div className="glass-card bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20">
          <p className="text-sm text-gray-300 italic">"{quote.text}"</p>
          <p className="text-xs text-gray-500 mt-2">— {quote.author}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setViewMode('api')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === 'api' ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
        >
          <Zap size={14} /> Day {currentDay} Words
        </button>
        <button
          onClick={() => setViewMode('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
        >
          <Calendar size={14} className="inline mr-1" />All Words
        </button>
        <button
          onClick={() => setViewMode('lookup')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === 'lookup' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
        >
          <BookOpen size={14} /> Dictionary
        </button>
      </div>

      {/* ── API Daily Words Tab ── */}
      {viewMode === 'api' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-400 font-semibold bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                <Zap size={11} /> Live from Free Dictionary API
              </p>
            </div>
            <p className="text-xs text-gray-500">5 words for Day {currentDay}</p>
          </div>

          <div className="space-y-3">
            {dayWords.map((word) => {
              const entry = apiWords[word];
              return (
                <ApiWordCard
                  key={word}
                  word={word}
                  data={entry?.data}
                  loading={entry?.loading ?? true}
                  error={entry?.error}
                />
              );
            })}
          </div>

          <button
            onClick={() => fetchApiWords(currentDay)}
            disabled={apiLoading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-gray-400 bg-white/5 hover:bg-white/10 transition disabled:opacity-50"
          >
            {apiLoading ? 'Loading...' : '↻ Refresh'}
          </button>
        </div>
      )}

      {/* ── Dictionary Lookup Tab ── */}
      {viewMode === 'lookup' && (
        <div className="space-y-4">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-3 text-xs text-purple-300">
            🔍 Powered by <strong>Free Dictionary API</strong> — search any English word for definitions, phonetics, audio, examples & synonyms.
          </div>

          <form onSubmit={lookupDictionary} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                placeholder="Type any English word..."
                className="input-field pl-9"
                value={lookupWord}
                onChange={(e) => setLookupWord(e.target.value)}
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={!lookupWord.trim() || dictLoading}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm disabled:opacity-50 transition"
            >
              {dictLoading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {dictLoading && <div className="flex justify-center py-10"><Spinner size={36} /></div>}
          {dictError && (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-400 text-sm">{dictError}</p>
            </div>
          )}
          {dictResult && <DictCard data={dictResult} />}

          {!dictResult && !dictLoading && !dictError && (
            <div className="text-center py-12 text-gray-600">
              <p className="text-4xl mb-3">📖</p>
              <p className="text-sm">Search any word to see full definition, pronunciation & examples</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['Eloquent', 'Persevere', 'Ambiguous', 'Diligent', 'Resilient'].map((w) => (
                  <button
                    key={w}
                    onClick={() => setLookupWord(w)}
                    className="text-xs bg-white/5 hover:bg-white/10 text-gray-400 px-3 py-1.5 rounded-lg transition"
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── All Words Tab (DB) ── */}
      {viewMode === 'all' && (
        <>
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input placeholder="Search words..." className="input-field pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {difficulties.map((d) => (
                <button key={d} onClick={() => setDifficulty(d)} className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${difficulty === d ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><Spinner size={36} /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-sm">No words found in database.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-500">{filtered.length} words total</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((word) => <VocabCard key={word._id} word={word} />)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
