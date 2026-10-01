import React, { useState } from 'react';
import { Volume2, ChevronDown, ChevronUp } from 'lucide-react';

export default function DictCard({ data }) {
  const [expanded, setExpanded] = useState(false);

  // Find audio URL from phonetics
  const audioUrl = data.phonetics?.find((p) => p.audio)?.audio || '';
  const phonetic = data.phonetic || data.phonetics?.find((p) => p.text)?.text || '';

  const playAudio = () => {
    if (audioUrl) {
      new Audio(audioUrl).play();
    } else {
      const u = new SpeechSynthesisUtterance(data.word);
      u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    }
  };

  // Collect all meanings
  const meanings = expanded ? data.meanings : data.meanings?.slice(0, 2);

  return (
    <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-5">
        <div>
          <h2 className="text-2xl font-black text-white capitalize">{data.word}</h2>
          {phonetic && <p className="text-sm text-blue-400 font-mono mt-0.5">{phonetic}</p>}
        </div>
        <button
          onClick={playAudio}
          className="p-3 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition shrink-0"
          title={audioUrl ? 'Play audio' : 'Text to speech'}
        >
          <Volume2 size={18} />
        </button>
      </div>

      {/* Meanings */}
      <div className="border-t border-white/10 divide-y divide-white/5">
        {meanings?.map((m, i) => (
          <div key={i} className="p-5">
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full italic">
              {m.partOfSpeech}
            </span>

            <div className="mt-3 space-y-3">
              {m.definitions.slice(0, expanded ? undefined : 2).map((def, j) => (
                <div key={j}>
                  <p className="text-sm text-gray-200">
                    <span className="text-gray-500 mr-2">{j + 1}.</span>
                    {def.definition}
                  </p>
                  {def.example && (
                    <p className="text-xs text-gray-500 italic mt-1 ml-4">"{def.example}"</p>
                  )}
                </div>
              ))}
            </div>

            {/* Synonyms */}
            {m.synonyms?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="text-xs text-gray-500 mr-1">Synonyms:</span>
                {m.synonyms.slice(0, 5).map((s) => (
                  <span key={s} className="text-xs bg-white/5 text-gray-300 px-2 py-0.5 rounded-lg">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show more toggle */}
      {(data.meanings?.length > 2 || data.meanings?.some((m) => m.definitions.length > 2)) && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-full flex items-center justify-center gap-1 py-3 text-xs text-gray-500 hover:text-gray-300 border-t border-white/10 transition"
        >
          {expanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show more</>}
        </button>
      )}
    </div>
  );
}
