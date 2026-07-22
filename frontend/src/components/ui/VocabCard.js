import React from 'react';
import { Volume2 } from 'lucide-react';

export default function VocabCard({ word }) {
  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="glass-card hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.01] flex flex-col h-full p-3 sm:p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-white truncate">{word.word}</h3>
          <p className="text-xs text-gray-500 font-mono truncate">{word.pronunciation}</p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <span className={`badge text-xs px-2 py-1 whitespace-nowrap ${word.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' : word.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
            {word.difficulty}
          </span>
          <button onClick={speak} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all flex-shrink-0">
            <Volume2 size={16} />
          </button>
        </div>
      </div>
      <p className="text-gray-300 text-xs sm:text-sm mb-2 line-clamp-2">{word.meaning}</p>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-lg font-medium truncate">🇮🇳 {word.hindiMeaning}</span>
      </div>
      {word.exampleSentence && (
        <p className="text-xs text-gray-500 italic border-t border-white/5 pt-2 mt-auto">{word.exampleSentence}</p>
      )}
    </div>
  );
}
