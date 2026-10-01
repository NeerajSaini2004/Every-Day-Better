import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, RotateCcw, ChevronRight, Zap } from 'lucide-react';
import { getDayWords } from '../../utils/dailyWords';
import { getDictionaryEntry } from '../../utils/dictionary';
import Spinner from './Spinner';

// Shuffle helper
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// Build MCQ from fetched word data
function buildQuestion(wordData, allData) {
  const correct = wordData?.meanings?.[0]?.definitions?.[0]?.definition;
  if (!correct) return null;

  // Wrong options: definitions from other words
  const wrongs = allData
    .filter((d) => d?.word !== wordData.word)
    .map((d) => d?.meanings?.[0]?.definitions?.[0]?.definition)
    .filter(Boolean)
    .slice(0, 3);

  if (wrongs.length < 2) return null;

  return {
    word: wordData.word,
    phonetic: wordData.phonetic || wordData.phonetics?.find((p) => p.text)?.text || '',
    correct,
    options: shuffle([correct, ...wrongs]),
  };
}

export default function DayQuiz({ dayNumber }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]); // { correct: bool }[]
  const [done, setDone] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const fetchQuiz = async () => {
    setLoading(true);
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setDone(false);
    setRevealed(false);

    const words = getDayWords(dayNumber);
    const results = await Promise.all(
      words.map(async (word) => {
        try {
          return await getDictionaryEntry(word);
        } catch {
          return null;
        }
      })
    );

    const valid = results.filter(Boolean);
    const qs = valid
      .map((d) => buildQuestion(d, valid))
      .filter(Boolean);

    setQuestions(qs);
    setLoading(false);
  };

  useEffect(() => { fetchQuiz(); }, [dayNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (option) => {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);
  };

  const handleNext = () => {
    const isCorrect = selected === questions[current].correct;
    const newAnswers = [...answers, { correct: isCorrect }];
    setAnswers(newAnswers);

    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const score = answers.filter((a) => a.correct).length;
  const total = questions.length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const resultConfig = pct === 100
    ? { emoji: '🏆', label: 'Perfect!', color: 'text-yellow-400', bg: 'from-yellow-900/30 to-orange-900/30', border: 'border-yellow-500/30' }
    : pct >= 60
    ? { emoji: '🎉', label: 'Great job!', color: 'text-green-400', bg: 'from-green-900/30 to-blue-900/30', border: 'border-green-500/30' }
    : { emoji: '💪', label: 'Keep practicing!', color: 'text-blue-400', bg: 'from-blue-900/30 to-purple-900/30', border: 'border-blue-500/30' };

  if (loading) {
    return (
      <div className="glass-card text-center py-8">
        <Spinner size={32} />
        <p className="text-gray-500 text-sm mt-3">Loading quiz...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="glass-card text-center py-8">
        <p className="text-gray-500 text-sm">Quiz unavailable — dictionary API unreachable.</p>
      </div>
    );
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass-card bg-gradient-to-br ${resultConfig.bg} border ${resultConfig.border} text-center`}
      >
        <p className="text-5xl mb-2">{resultConfig.emoji}</p>
        <p className={`text-2xl font-black ${resultConfig.color}`}>{resultConfig.label}</p>
        <p className="text-gray-400 text-sm mt-1">
          You got <span className="text-white font-bold">{score}/{total}</span> correct ({pct}%)
        </p>

        {/* Per-question breakdown */}
        <div className="flex justify-center gap-2 mt-4">
          {answers.map((a, i) => (
            <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${a.correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {a.correct ? '✓' : '✗'}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-yellow-400 font-bold">
          <Zap size={16} />
          <span>+{pct >= 60 ? 20 : 10} Bonus XP earned!</span>
        </div>

        <button
          onClick={fetchQuiz}
          className="mt-4 flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 text-sm font-semibold transition"
        >
          <RotateCcw size={14} /> Retry Quiz
        </button>
      </motion.div>
    );
  }

  const q = questions[current];

  return (
    <div className="glass-card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-yellow-400" />
          <span className="text-sm font-bold text-white">Day {dayNumber} Quiz</span>
        </div>
        <span className="text-xs text-gray-500">{current + 1} / {questions.length}</span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              i < current ? 'bg-green-500' : i === current ? 'bg-blue-500' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-3"
        >
          <div className="text-center py-2">
            <p className="text-xs text-gray-500 mb-1">What does this word mean?</p>
            <p className="text-2xl font-black text-white capitalize">{q.word}</p>
            {q.phonetic && <p className="text-xs text-blue-400 font-mono mt-0.5">{q.phonetic}</p>}
          </div>

          <div className="space-y-2">
            {q.options.map((opt, i) => {
              let style = 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10';
              if (revealed) {
                if (opt === q.correct) style = 'bg-green-500/20 border-green-500/40 text-green-300';
                else if (opt === selected) style = 'bg-red-500/20 border-red-500/40 text-red-300';
                else style = 'bg-white/5 border-white/5 text-gray-600';
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(opt)}
                  disabled={revealed}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${style}`}
                >
                  <span className="font-semibold text-gray-500 mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                  {revealed && opt === q.correct && <CheckCircle size={14} className="inline ml-2 text-green-400" />}
                  {revealed && opt === selected && opt !== q.correct && <XCircle size={14} className="inline ml-2 text-red-400" />}
                </button>
              );
            })}
          </div>

          {revealed && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              {current + 1 < questions.length ? <>Next <ChevronRight size={16} /></> : <>See Results <Trophy size={16} /></>}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
