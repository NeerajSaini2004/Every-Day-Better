import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

export default function GrammarCard({ rule }) {
  const [expanded, setExpanded] = useState(false);
  const diff = difficultyConfig[rule.difficulty] || difficultyConfig.beginner;
  const catColor = categoryColors[rule.category] || 'bg-white/10 text-gray-400';

  return (
    <div className={`bg-gray-900/60 border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${expanded ? 'border-blue-500/40 shadow-blue-500/10' : 'border-white/10 hover:border-white/20'}`}>

      {/* Card Header — always visible */}
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${diff.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                {rule.difficulty}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${catColor}`}>
                {rule.category.replace(/-/g, ' ')}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-white text-sm sm:text-base leading-snug">{rule.title}</h3>

            {/* Rule preview */}
            <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{rule.rule}</p>
          </div>

          {/* Expand icon */}
          <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${expanded ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-500'}`}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-white/10 divide-y divide-white/5">

          {/* Rule Row */}
          <div className="px-4 sm:px-5 py-3 grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-3 items-start">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pt-0.5">📌 Rule</span>
            <p className="text-sm text-gray-200 leading-relaxed">{rule.rule}</p>
          </div>

          {/* Hindi Rule Row */}
          {rule.hindiRule && (
            <div className="px-4 sm:px-5 py-3 grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-3 items-start bg-orange-500/5">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pt-0.5">🇮🇳 Hindi</span>
              <p className="text-sm text-orange-300 leading-relaxed">{rule.hindiRule}</p>
            </div>
          )}

          {/* Example Sentence Row */}
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
          {rule.examples && rule.examples.length > 0 && (
            <div className="px-4 sm:px-5 py-3">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">📝 More Examples</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {rule.examples.map((ex, i) => (
                  <div key={i} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                    <span className="text-green-400 text-xs mt-0.5 shrink-0">✓</span>
                    <p className="text-xs text-gray-300 leading-relaxed">{ex}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
