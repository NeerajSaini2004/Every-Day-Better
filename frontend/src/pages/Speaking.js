import React, { useState } from 'react';
import { Mic, MicOff, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { useRecorder } from '../hooks/useRecorder';
import { useTimer } from '../hooks/useTimer';

const topics = [
  { id: 1, title: 'Introduce Yourself', prompt: 'Tell us your name, where you are from, and what you do. Speak for 2 minutes.', level: 'Beginner', icon: '👋' },
  { id: 2, title: 'My Daily Routine', prompt: 'Describe what you do from morning to night. Use present tense.', level: 'Beginner', icon: '🌅' },
  { id: 3, title: 'My Favorite Food', prompt: 'Talk about your favorite Indian food. Why do you like it? How is it made?', level: 'Beginner', icon: '🍛' },
  { id: 4, title: 'My Dream Job', prompt: 'What is your dream job? Why do you want it? What skills do you need?', level: 'Intermediate', icon: '💼' },
  { id: 5, title: 'A Memorable Day', prompt: 'Tell a story about the most memorable day of your life.', level: 'Intermediate', icon: '📅' },
  { id: 6, title: 'Technology in India', prompt: 'How has technology changed life in India? Give examples.', level: 'Advanced', icon: '💻' },
];

const sentences = [
  'The quick brown fox jumps over the lazy dog.',
  'She sells seashells by the seashore.',
  'How much wood would a woodchuck chuck?',
  'I would like to improve my English speaking skills.',
  'Practice makes a man perfect.',
  'Every day is a new opportunity to learn something new.',
];

const pronunciationCards = [
  { word: 'Comfortable', phonetic: '/ˈkʌmf.tə.bəl/', tip: 'Say: KUMF-ter-bul (3 syllables, not 4)' },
  { word: 'Vegetable', phonetic: '/ˈvedʒ.tə.bəl/', tip: 'Say: VEJ-tuh-bul (3 syllables)' },
  { word: 'Wednesday', phonetic: '/ˈwenz.deɪ/', tip: 'The D is silent: WENZ-day' },
  { word: 'February', phonetic: '/ˈfeb.ru.er.i/', tip: 'Say: FEB-roo-er-ee' },
  { word: 'Pronunciation', phonetic: '/prəˌnʌn.siˈeɪ.ʃən/', tip: 'Note: pro-NUN-see-AY-shun' },
  { word: 'Entrepreneur', phonetic: '/ˌɒn.trə.prəˈnɜːr/', tip: 'Say: on-truh-pruh-NUR' },
];

const todayTopicIdx = new Date().getDay() % topics.length;

export default function Speaking() {
  const [selectedTopic, setSelectedTopic] = useState(topics[todayTopicIdx]);
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const recorder = useRecorder();
  const timer = useTimer(120);

  const speakSentence = (text) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Speaking Practice 🎤</h1>
        <p className="text-gray-400 text-sm mt-1">Build confidence by speaking every day</p>
      </div>

      {/* Pronunciation Practice */}
      <div className="glass-card">
        <h2 className="font-bold text-white mb-4">🗣️ Pronunciation Practice</h2>
        <div className="bg-white/5 rounded-xl p-4 mb-4">
          <p className="text-white text-lg font-medium text-center">{sentences[sentenceIdx]}</p>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => speakSentence(sentences[sentenceIdx])} className="flex items-center gap-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
            <Volume2 size={16} /> Listen
          </button>
          <button onClick={() => setSentenceIdx((i) => (i + 1) % sentences.length)} className="flex items-center gap-2 bg-white/10 text-gray-300 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
            Next Sentence →
          </button>
        </div>
      </div>

      {/* Speaking Timer + Recorder */}
      <div className="glass-card">
        <h2 className="font-bold text-white mb-4">⏱️ Speaking Timer</h2>
        <div className="text-center mb-4">
          <p className="text-6xl font-black font-mono text-white">{timer.format()}</p>
          <p className="text-gray-500 text-sm mt-1">{timer.done ? '✅ Time up!' : 'Speak continuously without stopping'}</p>
        </div>
        <div className="flex gap-3 justify-center mb-4">
          <button onClick={timer.running ? timer.pause : timer.start} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${timer.running ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
            {timer.running ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
          </button>
          <button onClick={timer.reset} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-gray-400 hover:bg-white/20 font-semibold transition-all">
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Voice Recorder */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-300">🎙️ Voice Recorder</p>
            {recorder.recording && <span className="flex items-center gap-1 text-red-400 text-xs animate-pulse"><span className="w-2 h-2 bg-red-400 rounded-full" /> Recording</span>}
          </div>
          <div className="flex gap-3">
            <button onClick={recorder.recording ? recorder.stop : recorder.start} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${recorder.recording ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'}`}>
              {recorder.recording ? <><MicOff size={16} /> Stop</> : <><Mic size={16} /> Record</>}
            </button>
            {recorder.audioURL && (
              <button onClick={recorder.clear} className="px-4 py-2.5 rounded-xl bg-white/10 text-gray-400 hover:bg-white/20 text-sm font-semibold">Clear</button>
            )}
          </div>
          {recorder.audioURL && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Your recording:</p>
              <audio src={recorder.audioURL} controls className="w-full rounded-lg" />
            </div>
          )}
        </div>
      </div>

      {/* Pronunciation Word Cards */}
      <div className="glass-card">
        <h2 className="font-bold text-white mb-4">🅰️ Pronunciation Cards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pronunciationCards.map((card) => (
            <div key={card.word} className="bg-white/5 rounded-xl p-3 flex items-start gap-3">
              <button
                onClick={() => speakSentence(card.word)}
                className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 shrink-0 transition-all"
              >
                <Volume2 size={14} />
              </button>
              <div>
                <p className="font-bold text-white text-sm">{card.word}</p>
                <p className="text-xs text-blue-300 font-mono">{card.phonetic}</p>
                <p className="text-xs text-gray-500 mt-0.5">{card.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Speaking Topics */}
      <div>
        <h2 className="font-bold text-white mb-4">📋 Speaking Topics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topics.map((topic) => (
            <div key={topic.id} onClick={() => setSelectedTopic(selectedTopic?.id === topic.id ? null : topic)} className={`glass-card cursor-pointer transition-all duration-300 hover:scale-[1.02] ${selectedTopic?.id === topic.id ? 'border-blue-500/50 bg-blue-500/5' : 'hover:border-white/20'}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{topic.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white text-sm">{topic.title}</h3>
                    <span className={`badge text-xs ${topic.level === 'Beginner' ? 'bg-green-500/20 text-green-400' : topic.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{topic.level}</span>
                  </div>
                  {selectedTopic?.id === topic.id && (
                    <p className="text-xs text-gray-400 animate-fade-in">{topic.prompt}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
