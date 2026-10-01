import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { generateQuiz } from '../../utils/grammarQuiz';

const categoryColors = {
  'present-simple': 'bg-blue-500/20 text-blue-400',
  'present-continuous': 'bg-blue-400/20 text-blue-300',
  'present-perfect': 'bg-cyan-500/20 text-cyan-400',
  'present-perfect-continuous': 'bg-cyan-400/20 text-cyan-300',
  'past-simple': 'bg-purple-500/20 text-purple-400',
  'past-continuous': 'bg-purple-400/20 text-purple-300',
  'past-perfect': 'bg-violet-500/20 text-violet-400',
  'past-perfect-continuous': 'bg-violet-400/20 text-violet-300',
  'future-simple': 'bg-green-500/20 text-green-400',
  'future-continuous': 'bg-green-400/20 text-green-300',
  'future-perfect': 'bg-emerald-500/20 text-emerald-400',
  'future-perfect-continuous': 'bg-emerald-400/20 text-emerald-300',
  'articles': 'bg-yellow-500/20 text-yellow-400',
  'prepositions': 'bg-orange-500/20 text-orange-400',
  'conjunctions': 'bg-pink-500/20 text-pink-400',
  'modal-verbs': 'bg-rose-500/20 text-rose-400',
  'conditionals': 'bg-red-500/20 text-red-400',
  'passive-voice': 'bg-teal-500/20 text-teal-400',
  'reported-speech': 'bg-indigo-500/20 text-indigo-400',
  'relative-clauses': 'bg-sky-500/20 text-sky-400',
  'gerunds-infinitives': 'bg-lime-500/20 text-lime-400',
  'adverbs': 'bg-amber-500/20 text-amber-400',
  'subject-verb-agreement': 'bg-fuchsia-500/20 text-fuchsia-400',
  'word-order': 'bg-cyan-600/20 text-cyan-300',
  'parts-of-speech': 'bg-blue-600/20 text-blue-300',
};

const difficultyConfig = {
  beginner: { color: 'bg-green-500/20 text-green-400 border-green-500/30', dot: 'bg-green-400' },
  intermediate: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400' },
  advanced: { color: 'bg-red-500/20 text-red-400 border-red-500/30', dot: 'bg-red-400' },
};

function QuizSection({ rule }) {
  const quiz = useMemo(() => generateQuiz(rule), [rule]);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  if (!quiz) return null;

  const isCorrect = selected === quiz.correct;

  const handleSelect = (opt) => {
    if (done) return;
    setSelected(opt);
    setDone(true);
  };

  const reset = () => { setSelected(null); setDone(false); };

  return (
    <div className="border-t border-white/10 p-4 sm:p-5 bg-gradient-to-br from-blue-950/30 to-purple-950/20">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
          ⚡ Quick Practice
        </p>
        {done && (
          <button onClick={reset} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition">
            <RotateCcw size={11} /> Try again
          </button>
        )}
      </div>

      <p className="text-sm text-white font-medium mb-3 leading-relaxed whitespace-pre-line">
        {quiz.question}
      </p>

      <div className="space-y-2">
        {quiz.options.map((opt, i) => {
          let style = 'border-white/10 bg-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 cursor-pointer';
          if (done) {
            if (opt === quiz.correct) style = 'border-green-500/60 bg-green-500/10 cursor-default';
            else if (opt === selected) style = 'border-red-500/60 bg-red-500/10 cursor-default';
            else style = 'border-white/5 bg-white/3 opacity-40 cursor-default';
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={done}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left text-sm transition-all ${style}`}
            >
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                done && opt === quiz.correct ? 'bg-green-500 text-white' :
                done && opt === selected ? 'bg-red-500 text-white' :
                'bg-white/10 text-gray-400'
              }`}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-gray-200 flex-1">{opt}</span>
              {done && opt === quiz.correct && <CheckCircle size={15} className="text-green-400 shrink-0" />}
              {done && opt === selected && opt !== quiz.correct && <XCircle size={15} className="text-red-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {done && (
        <div className={`mt-3 px-3 py-2.5 rounded-xl text-xs leading-relaxed ${isCorrect ? 'bg-green-500/10 border border-green-500/20 text-green-300' : 'bg-red-500/10 border border-red-500/20 text-red-300'}`}>
          {isCorrect ? '✅ Correct! ' : '❌ Not quite. '}
          <span className="text-gray-300">{quiz.explanation}</span>
        </div>
      )}
    </div>
  );
}

export default function GrammarCard({ rule }) {
  const [expanded, setExpanded] = useState(false);
  const diff = difficultyConfig[rule.difficulty] || difficultyConfig.beginner;
  const catColor = categoryColors[rule.category] || 'bg-white/10 text-gray-400';

  return (
    <div className={`bg-gray-900/60 border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${expanded ? 'border-blue-500/40 shadow-blue-500/10' : 'border-white/10 hover:border-white/20'}`}>

      {/* Header */}
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${diff.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                {rule.difficulty}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${catColor}`}>
                {rule.category.replace(/-/g, ' ')}
              </span>
              <span className="text-[10px] text-blue-400/60 bg-blue-500/5 px-2 py-0.5 rounded-full">
                ⚡ quiz
              </span>
            </div>
            <h3 className="font-bold text-white text-sm sm:text-base leading-snug">{rule.title}</h3>
            <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{rule.rule}</p>
          </div>
          <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${expanded ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-500'}`}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-white/10 divide-y divide-white/5">

          {/* Rule */}
          <div className="px-4 sm:px-5 py-3 grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-3 items-start">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pt-0.5">📌 Rule</span>
            <p className="text-sm text-gray-200 leading-relaxed">{rule.rule}</p>
          </div>

          {/* Hindi */}
          {rule.hindiRule && (
            <div className="px-4 sm:px-5 py-3 grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-3 items-start bg-orange-500/5">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pt-0.5">🇮🇳 Hindi</span>
              <p className="text-sm text-orange-300 leading-relaxed">{rule.hindiRule}</p>
            </div>
          )}

          {/* Example */}
          {rule.exampleSentence && (
            <div className="px-4 sm:px-5 py-3 grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-3 items-start bg-blue-500/5">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pt-0.5">✏️ Example</span>
              <div>
                <p className="text-sm text-blue-300 font-medium leading-relaxed">"{rule.exampleSentence}"</p>
                {rule.hindiExample && (
                  <p className="text-xs text-orange-300/80 mt-1 leading-relaxed">🇮🇳 "{rule.hindiExample}"</p>
                )}
              </div>
            </div>
          )}

          {/* More Examples */}
          {rule.examples?.filter((e) => !e.startsWith('WRONG:') && !e.startsWith('RIGHT:')).length > 0 && (
            <div className="px-4 sm:px-5 py-3">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">📝 More Examples</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {rule.examples
                  .filter((e) => !e.startsWith('WRONG:') && !e.startsWith('RIGHT:'))
                  .map((ex, i) => (
                    <div key={i} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                      <span className="text-green-400 text-xs mt-0.5 shrink-0">✓</span>
                      <p className="text-xs text-gray-300 leading-relaxed">{ex}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Wrong vs Right (if present) */}
          {rule.examples?.some((e) => e.startsWith('WRONG:')) && (
            <div className="px-4 sm:px-5 py-3">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">⚠️ Common Mistakes</p>
              <div className="space-y-1.5">
                {rule.examples
                  .filter((e) => e.startsWith('WRONG:') || e.startsWith('RIGHT:'))
                  .map((ex, i) => (
                    <div key={i} className={`flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${ex.startsWith('WRONG:') ? 'bg-red-500/10 text-red-300' : 'bg-green-500/10 text-green-300'}`}>
                      <span className="shrink-0">{ex.startsWith('WRONG:') ? '✗' : '✓'}</span>
                      <span>{ex.replace(/^(WRONG:|RIGHT:)\s*/, '')}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Quiz */}
          <QuizSection rule={rule} />
        </div>
      )}
    </div>
  );
}
