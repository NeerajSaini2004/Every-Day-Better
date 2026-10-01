import React, { useEffect, useState, useMemo } from 'react';
import api from '../utils/api';
import GrammarCard from '../components/ui/GrammarCard';
import Spinner from '../components/ui/Spinner';
import { generateQuiz } from '../utils/grammarQuiz';
import { Search, BookOpen, Zap, RotateCcw, CheckCircle, XCircle, Trophy, Sparkles, Send } from 'lucide-react';

const callGemini = async (messages) => {
  const { data } = await api.post('/gemini/chat', { messages });
  return data.content;
};

const localGrammarFallback = (text) => {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();
  const commonErrors = [
    { pattern: /\b(i|she|he|we|they)\s+don't\b/gi, replacement: '$1 do not' },
    { pattern: /\b(i|she|he|we|they)\s+doesn't\b/gi, replacement: '$1 does not' },
    { pattern: /\b(i|we|they|she|he)\s+was\b/gi, replacement: '$1 were' },
    { pattern: /\b(i have went|i has went|i have go)\b/gi, replacement: 'I have gone' },
    { pattern: /\b(he go|she go|they go)\b/gi, replacement: 'he goes' },
    { pattern: /\bmore better\b/gi, replacement: 'better' },
  ];

  let corrected = trimmed;
  let errors = [];

  for (const item of commonErrors) {
    const match = corrected.match(item.pattern);
    if (match) {
      corrected = corrected.replace(item.pattern, item.replacement);
      errors.push({
        wrong: match[0],
        right: item.replacement.replace(/\$1\s+/, '').replace(/\$/g, ''),
        rule: 'Common grammar fix',
        explanation: 'This phrase should follow standard English grammar rules.',
      });
    }
  }

  const hasPast = /\b(yesterday|last week|last night|last year)\b/i.test(lower);
  if (hasPast && !/\b(was|were|went|did|had|ate|saw|played)\b/i.test(lower)) {
    corrected = corrected + ' (consider using past tense)';
    errors.push({
      wrong: trimmed,
      right: trimmed,
      rule: 'Tense',
      explanation: 'Past-time expressions usually match with past-tense verb forms.',
    });
  }

  return {
    isCorrect: errors.length === 0,
    corrected: errors.length === 0 ? trimmed : corrected,
    errors: errors.slice(0, 3),
    hindiTip: errors.length === 0 ? 'Great job! Your sentence looks natural.' : 'Sentence ko thoda aur grammar ke hisaab se improve kar sakte ho.',
    rating: errors.length === 0 ? 9 : 6,
  };
};

const EXAMPLE_SENTENCES = [
  'She don\'t know the answer.',
  'I am having a doubt about this.',
  'He go to school every day.',
  'We was playing cricket yesterday.',
  'I have went to Delhi last week.',
  'She is more better than him.',
];

const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

const getCategories = (rules) => {
  if (!rules || rules.length === 0) return [];
  return ['all', ...[...new Set(rules.map((r) => r.category))].sort()];
};

// ── Quiz Mode Component ──
function QuizMode({ rules }) {
  const quizzes = useMemo(() => {
    return rules
      .map((r) => ({ rule: r, quiz: generateQuiz(r) }))
      .filter((q) => q.quiz !== null);
  }, [rules]);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState([]); // { correct: bool }

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-4xl mb-3">📭</p>
        <p>No quiz questions available. Try loading grammar rules first.</p>
      </div>
    );
  }

  const current = quizzes[idx];
  const total = quizzes.length;
  const progress = Math.round(((idx) / total) * 100);

  const handleSelect = (opt) => {
    if (done) return;
    const correct = opt === current.quiz.correct;
    setSelected(opt);
    setDone(true);
    if (correct) setScore((s) => s + 1);
    setHistory((h) => [...h, { correct }]);
  };

  const handleNext = () => {
    if (idx + 1 >= total) {
      setFinished(true);
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
      setDone(false);
    }
  };

  const restart = () => {
    setIdx(0);
    setSelected(null);
    setDone(false);
    setScore(0);
    setFinished(false);
    setHistory([]);
  };

  if (finished) {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="max-w-md mx-auto text-center py-8 space-y-6">
        <div className="text-6xl">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚'}</div>
        <div>
          <h2 className="text-3xl font-black text-white">{score}/{total}</h2>
          <p className="text-gray-400 mt-1">{pct}% correct</p>
        </div>

        <div className="bg-gray-900 border border-white/10 rounded-2xl p-5 space-y-2">
          <p className="text-sm font-semibold text-white mb-3">Your Performance</p>
          <div className="flex gap-4 justify-center">
            <div className="text-center">
              <p className="text-2xl font-black text-green-400">{score}</p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-black text-red-400">{total - score}</p>
              <p className="text-xs text-gray-500">Wrong</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-black text-blue-400">{total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 mt-3">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <p className="text-sm text-gray-400">
          {pct >= 80 ? 'Excellent! You have mastered these rules! 🎉' :
           pct >= 50 ? 'Good effort! Review the rules you missed and try again.' :
           'Keep practicing! Read the rules carefully and try again.'}
        </p>

        <button onClick={restart} className="btn-primary flex items-center gap-2 mx-auto">
          <RotateCcw size={16} /> Try Again
        </button>
      </div>
    );
  }

  const isCorrect = selected === current.quiz.correct;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Question {idx + 1} of {total}</span>
          <span className="flex items-center gap-1 text-green-400 font-semibold">
            <Trophy size={12} /> {score} correct
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* History dots */}
        <div className="flex gap-1 flex-wrap">
          {history.map((h, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${h.correct ? 'bg-green-400' : 'bg-red-400'}`} />
          ))}
        </div>
      </div>

      {/* Rule context */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-lg capitalize">
          {current.rule.category.replace(/-/g, ' ')}
        </span>
        <span className={`text-xs px-2 py-1 rounded-lg ${
          current.rule.difficulty === 'beginner' ? 'bg-green-500/10 text-green-400' :
          current.rule.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
          'bg-red-500/10 text-red-400'
        }`}>
          {current.rule.difficulty}
        </span>
      </div>

      {/* Question card */}
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-5 space-y-4">
        <p className="text-base font-semibold text-white leading-relaxed whitespace-pre-line">
          {current.quiz.question}
        </p>

        <div className="space-y-2">
          {current.quiz.options.map((opt, i) => {
            let style = 'border-white/10 bg-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 cursor-pointer';
            if (done) {
              if (opt === current.quiz.correct) style = 'border-green-500/60 bg-green-500/10 cursor-default';
              else if (opt === selected) style = 'border-red-500/60 bg-red-500/10 cursor-default';
              else style = 'border-white/5 opacity-40 cursor-default';
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={done}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all ${style}`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  done && opt === current.quiz.correct ? 'bg-green-500 text-white' :
                  done && opt === selected ? 'bg-red-500 text-white' :
                  'bg-white/10 text-gray-400'
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-gray-200 flex-1">{opt}</span>
                {done && opt === current.quiz.correct && <CheckCircle size={16} className="text-green-400 shrink-0" />}
                {done && opt === selected && opt !== current.quiz.correct && <XCircle size={16} className="text-red-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {done && (
          <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${isCorrect ? 'bg-green-500/10 border border-green-500/20 text-green-300' : 'bg-red-500/10 border border-red-500/20 text-red-300'}`}>
            {isCorrect ? '✅ Correct! ' : '❌ Not quite. '}
            <span className="text-gray-300">{current.quiz.explanation}</span>
          </div>
        )}
      </div>

      {done && (
        <button onClick={handleNext} className="btn-primary w-full">
          {idx + 1 >= total ? 'See Results 🏆' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}

// ── AI Grammar Checker Component ──
function GrammarChecker() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const check = async () => {
    if (!text.trim() || text.trim().length < 3) return;
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const raw = await callGemini([
        {
          role: 'system',
          content: `You are an English grammar checker for Indian students. Analyze the sentence and respond ONLY with valid JSON:
{
  "isCorrect": <true or false>,
  "corrected": "<corrected sentence or same if correct>",
  "errors": [{ "wrong": "<wrong part>", "right": "<correct part>", "rule": "<grammar rule name>", "explanation": "<simple explanation in easy English>" }],
  "hindiTip": "<one line tip in Hinglish like: Is sentence mein past tense use karna chahiye>",
  "rating": <1-10>
}
If sentence is correct, errors should be empty array. Keep explanations simple for beginners.`,
        },
        { role: 'user', content: `Check this sentence: "${text}"` },
      ]);
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('parse');
      const parsed = JSON.parse(match[0]);
      setResult(parsed);
      setHistory((h) => [{ text, result: parsed }, ...h].slice(0, 5));
    } catch (err) {
      const fallback = localGrammarFallback(text);
      setResult(fallback);
      setError(err?.response?.data?.message || 'AI grammar service is temporarily unavailable. Showing a local grammar suggestion instead.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setText(''); setResult(null); setError(''); };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-xs text-green-300">
        🤖 <strong>AI Grammar Checker</strong> — Type any English sentence and get instant grammar feedback with Hindi tips. Powered by Google Gemini.
      </div>

      {/* Input */}
      <div className="glass-card space-y-3">
        <label className="text-xs text-gray-400 font-semibold">Type your sentence:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); check(); } }}
          placeholder="e.g. She don't know the answer."
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-green-500/50 transition"
        />
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {EXAMPLE_SENTENCES.slice(0, 3).map((s, i) => (
              <button key={i} onClick={() => { setText(s); setResult(null); setError(''); }}
                className="text-xs bg-white/5 hover:bg-white/10 text-gray-500 hover:text-gray-300 px-2 py-1 rounded-lg transition">
                {s.length > 25 ? s.slice(0, 25) + '...' : s}
              </button>
            ))}
          </div>
          <button
            onClick={check}
            disabled={loading || !text.trim()}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Checking...</>
              : <><Send size={14} /> Check</>}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
          ❌ {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="glass-card space-y-4">
          {/* Verdict */}
          <div className={`flex items-center justify-between rounded-xl px-4 py-3 border ${
            result.isCorrect ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
          }`}>
            <div className="flex items-center gap-2">
              {result.isCorrect
                ? <CheckCircle size={18} className="text-green-400" />
                : <XCircle size={18} className="text-red-400" />}
              <span className={`font-bold text-sm ${result.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {result.isCorrect ? 'Correct! Great sentence.' : 'Needs correction'}
              </span>
            </div>
            <span className={`text-lg font-black ${
              result.rating >= 8 ? 'text-green-400' : result.rating >= 5 ? 'text-yellow-400' : 'text-red-400'
            }`}>{result.rating}/10</span>
          </div>

          {/* Corrected sentence */}
          {!result.isCorrect && result.corrected && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500 mb-1">✅ Corrected sentence:</p>
              <p className="text-sm text-blue-200 font-semibold">"{result.corrected}"</p>
            </div>
          )}

          {/* Errors */}
          {result.errors?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Errors Found</p>
              {result.errors.map((e, i) => (
                <div key={i} className="bg-white/5 rounded-xl px-4 py-3 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-lg line-through">{e.wrong}</span>
                    <span className="text-gray-600 text-xs">→</span>
                    <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-lg font-semibold">{e.right}</span>
                    <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-lg ml-auto">{e.rule}</span>
                  </div>
                  <p className="text-xs text-gray-400">{e.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {/* Hindi tip */}
          {result.hindiTip && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-2.5">
              <p className="text-xs text-orange-300">🇮🇳 {result.hindiTip}</p>
            </div>
          )}

          <button onClick={reset} className="text-xs text-gray-500 hover:text-white flex items-center gap-1.5 transition">
            <RotateCcw size={12} /> Check another sentence
          </button>
        </div>
      )}

      {/* History */}
      {history.length > 0 && !result && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Recent Checks</p>
          {history.map((h, i) => (
            <button key={i} onClick={() => { setText(h.text); setResult(h.result); setError(''); }}
              className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl px-4 py-2.5 text-left transition">
              {h.result.isCorrect
                ? <CheckCircle size={14} className="text-green-400 shrink-0" />
                : <XCircle size={14} className="text-red-400 shrink-0" />}
              <span className="text-xs text-gray-300 truncate">{h.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Grammar Page ──
export default function Grammar() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [category, setCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);
  const [tab, setTab] = useState('rules');

  useEffect(() => {
    const load = async () => {
      try {
        const params = {};
        if (difficulty !== 'all') params.difficulty = difficulty;
        if (category !== 'all') params.category = category;
        const res = await api.get('/grammar', { params });
        setRules(res.data || []);
        setCategories(getCategories(res.data));
      } catch {
        setRules([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [difficulty, category]);

  const filtered = rules.filter((rule) => {
    const s = search.toLowerCase();
    return (
      rule.title.toLowerCase().includes(s) ||
      rule.rule.toLowerCase().includes(s) ||
      (rule.exampleSentence?.toLowerCase().includes(s)) ||
      (rule.examples?.some((ex) => ex.toLowerCase().includes(s))) ||
      rule.hindiRule.toLowerCase().includes(s)
    );
  });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size={40} /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <BookOpen size={22} /> Grammar Master 📖
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          {rules.length} rules · Learn, read examples, and practice with quizzes
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setTab('rules')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === 'rules' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
        >
          <BookOpen size={14} /> Rules
        </button>
        <button
          onClick={() => setTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === 'quiz' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
        >
          <Zap size={14} /> Quiz Mode
        </button>
        <button
          onClick={() => setTab('checker')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === 'checker' ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
        >
          <Sparkles size={14} /> AI Checker
        </button>
      </div>

      {/* ── Rules Tab ── */}
      {tab === 'rules' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              placeholder="Search rules, examples, Hindi..."
              className="input-field pl-9 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Difficulty filter */}
          <div className="flex gap-2 flex-wrap">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${difficulty === d ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                {d === 'all' ? 'All Levels' : d}
              </button>
            ))}
          </div>

          {/* Category filter */}
          {categories.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${category === cat ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  {cat === 'all' ? 'All Categories' : cat.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500">
            Showing <span className="text-white font-semibold">{filtered.length}</span> of <span className="text-white font-semibold">{rules.length}</span> rules
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-sm">No rules found. Try adjusting filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filtered.map((rule) => (
                <GrammarCard key={rule._id} rule={rule} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Quiz Tab ── */}
      {tab === 'quiz' && (
        <div className="space-y-4">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-3 text-xs text-purple-300">
            ⚡ <strong>Quiz Mode</strong> — Test yourself on {rules.length} grammar rules. Each question is generated from the actual rule content.
          </div>
          <QuizMode rules={rules} />
        </div>
      )}

      {/* ── AI Checker Tab ── */}
      {tab === 'checker' && <GrammarChecker />}

    </div>
  );
}
