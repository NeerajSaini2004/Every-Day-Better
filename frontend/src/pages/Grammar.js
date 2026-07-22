import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import GrammarCard from '../components/ui/GrammarCard';
import Spinner from '../components/ui/Spinner';
import { Search, BookOpen } from 'lucide-react';

const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

// Extract unique categories from grammar rules
const getCategories = (rules) => {
  if (!rules || rules.length === 0) return [];
  const categories = [...new Set(rules.map(r => r.category))];
  return ['all', ...categories.sort()];
};

export default function Grammar() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [category, setCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);

  useEffect(() => {
    const load = async () => {
      try {
        const params = {};
        if (difficulty !== 'all') params.difficulty = difficulty;
        if (category !== 'all') params.category = category;

        const res = await api.get('/grammar', { params });
        setRules(res.data || []);
        setCategories(getCategories(res.data));
      } catch (err) {
        console.error('Failed to fetch grammar rules:', err);
        setRules([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [difficulty, category]);

  // Filter rules by search term
  const filtered = rules.filter((rule) => {
    const searchLower = search.toLowerCase();
    return (
      rule.title.toLowerCase().includes(searchLower) ||
      rule.rule.toLowerCase().includes(searchLower) ||
      (rule.exampleSentence && rule.exampleSentence.toLowerCase().includes(searchLower)) ||
      (rule.examples && rule.examples.some(ex => ex.toLowerCase().includes(searchLower))) ||
      rule.hindiRule.toLowerCase().includes(searchLower)
    );
  });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size={40} /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-2 flex-wrap">
          <BookOpen size={24} className="sm:w-8 sm:h-8" /> Grammar Master 📖
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">Learn grammar rules with clear explanations, examples, and Hindi translations</p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3 sm:space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            placeholder="Search rules, examples, or explanations..."
            className="input-field pl-9 w-full min-h-[44px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Difficulty Filter */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase">Difficulty Level</p>
          <div className="flex gap-2 flex-wrap">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all min-h-[44px] ${
                  difficulty === d
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {d === 'all' ? 'All Levels' : d}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase">Category</p>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all min-h-[44px] ${
                    category === cat
                      ? 'bg-green-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-xs text-gray-400">
        Showing <span className="text-white font-semibold">{filtered.length}</span> of <span className="text-white font-semibold">{rules.length}</span> grammar rules
      </div>

      {/* Grammar Rules Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 sm:py-16 text-gray-500">
          <p className="text-3xl sm:text-4xl mb-3">📭</p>
          <p className="text-sm sm:text-base">No grammar rules found. Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((rule) => (
            <GrammarCard key={rule._id} rule={rule} />
          ))}
        </div>
      )}

      {/* Study Tips */}
      <div className="glass-card bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">💡 Study Tips</h3>
        <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
          <li>✓ Start with Beginner rules to build a strong foundation</li>
          <li>✓ Read the English rule and Hindi translation together</li>
          <li>✓ Practice writing example sentences with each rule</li>
          <li>✓ Speak example sentences out loud to practice pronunciation</li>
          <li>✓ Review rules regularly to maintain memory</li>
          <li>✓ Use rules in real conversations and writing</li>
        </ul>
      </div>
    </div>
  );
}
