import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import VocabCard from '../components/ui/VocabCard';
import Spinner from '../components/ui/Spinner';
import { Search, Calendar } from 'lucide-react';

const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

const getTodayDay = (availableDays) => {
  if (!availableDays || availableDays.length === 0) return 1;
  const start = new Date('2024-01-01');
  const today = new Date();
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return availableDays[diff % availableDays.length];
};

export default function Vocabulary() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [quote, setQuote] = useState(null);
  const [viewMode, setViewMode] = useState('today');
  const [availableDays, setAvailableDays] = useState([]);
  const todayDay = getTodayDay(availableDays);

  // Fetch available days once on mount
  useEffect(() => {
    api.get('/vocabulary/available-days').then((r) => setAvailableDays(r.data));
  }, []);

  useEffect(() => {
    if (availableDays.length === 0) return;
    const load = async () => {
      setLoading(true);
      try {
        const params = {};
        if (difficulty !== 'all') params.difficulty = difficulty;
        if (viewMode === 'today') params.day = todayDay;
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

  const filtered = words.filter((w) =>
    w.word.toLowerCase().includes(search.toLowerCase()) ||
    w.meaning.toLowerCase().includes(search.toLowerCase()) ||
    w.hindiMeaning.includes(search)
  );

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Vocabulary Builder 📝</h1>
        <p className="text-gray-400 text-sm mt-1">Learn new words with Hindi meanings</p>
      </div>

      {/* Daily Quote */}
      {quote && (
        <div className="glass-card bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20">
          <p className="text-sm text-gray-300 italic">"{quote.text}"</p>
          <p className="text-xs text-gray-500 mt-2">— {quote.author}</p>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setViewMode('today')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === 'today' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
        >
          <Calendar size={14} /> Today's Words (Day {todayDay})
        </button>
        <button
          onClick={() => setViewMode('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
        >
          All Words
        </button>
      </div>

      {/* Search & Filter */}
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

      {/* Words Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm">No words found. Try switching to <button onClick={() => setViewMode('all')} className="text-blue-400 underline">All Words</button>.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500">{filtered.length} words {viewMode === 'today' ? `for Day ${todayDay}` : 'total'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((word) => <VocabCard key={word._id} word={word} />)}
          </div>
        </>
      )}
    </div>
  );
}
