import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Play, Pause, RotateCcw, Volume2, CheckCircle, XCircle, Sparkles, Loader } from 'lucide-react';
import { useRecorder } from '../hooks/useRecorder';
import { useTimer } from '../hooks/useTimer';
import api from '../utils/api';

const topics = [
  { id: 1,  title: 'Introduce Yourself',       prompt: 'Tell your name, hometown, and what you do. Speak for 2 minutes.',                          level: 'Beginner',     icon: '👋' },
  { id: 2,  title: 'My Daily Routine',          prompt: 'Describe what you do from morning to night. Use present tense.',                           level: 'Beginner',     icon: '🌅' },
  { id: 3,  title: 'My Favorite Food',          prompt: 'Talk about your favorite Indian food. Why do you like it? How is it made?',                level: 'Beginner',     icon: '🍛' },
  { id: 4,  title: 'My Family',                 prompt: 'Describe your family members. What do they do? What do you love about them?',              level: 'Beginner',     icon: '👨‍👩‍👧' },
  { id: 5,  title: 'My Hometown',               prompt: 'Describe your city or village. What is special about it? What do you miss?',               level: 'Beginner',     icon: '🏘️' },
  { id: 6,  title: 'My Hobbies',                prompt: 'What do you enjoy doing in free time? How did you start? Why do you like it?',             level: 'Beginner',     icon: '🎨' },
  { id: 7,  title: 'A Typical Weekend',         prompt: 'What do you usually do on Saturdays and Sundays? Describe in detail.',                     level: 'Beginner',     icon: '📅' },
  { id: 8,  title: 'My Favorite Movie',         prompt: 'Talk about a movie you love. What is the story? Why do you recommend it?',                 level: 'Beginner',     icon: '🎬' },
  { id: 9,  title: 'Shopping Experience',       prompt: 'Describe your last shopping trip. Where did you go? What did you buy?',                    level: 'Beginner',     icon: '🛍️' },
  { id: 10, title: 'My School Days',            prompt: 'Talk about your school life. Favorite subject, teacher, or memory.',                       level: 'Beginner',     icon: '🏫' },
  { id: 11, title: 'My Dream Job',              prompt: 'What is your dream job? Why do you want it? What skills do you need?',                     level: 'Intermediate', icon: '💼' },
  { id: 12, title: 'A Memorable Day',           prompt: 'Tell a story about the most memorable day of your life.',                                  level: 'Intermediate', icon: '✨' },
  { id: 13, title: 'Technology in India',       prompt: 'How has technology changed life in India? Give 3 examples.',                               level: 'Intermediate', icon: '💻' },
  { id: 14, title: 'Social Media',              prompt: 'Is social media good or bad for students? Give your opinion with reasons.',                 level: 'Intermediate', icon: '📱' },
  { id: 15, title: 'Indian Festivals',          prompt: 'Describe your favorite festival. How do you celebrate it with family?',                    level: 'Intermediate', icon: '🪔' },
  { id: 16, title: 'Public Transport',          prompt: 'Compare bus, train, and auto in your city. Which is best and why?',                        level: 'Intermediate', icon: '🚌' },
  { id: 17, title: 'Health and Fitness',        prompt: 'How do you stay healthy? Talk about diet, exercise, and sleep habits.',                    level: 'Intermediate', icon: '💪' },
  { id: 18, title: 'A Trip I Took',             prompt: 'Describe a trip you went on. Where, with whom, what happened, what you learned.',          level: 'Intermediate', icon: '✈️' },
  { id: 19, title: 'Online vs Offline Study',   prompt: 'What are the pros and cons of online learning vs classroom learning?',                     level: 'Intermediate', icon: '📚' },
  { id: 20, title: 'My Role Model',             prompt: 'Who is your role model? Why do you admire them? How do they inspire you?',                 level: 'Intermediate', icon: '🌟' },
  { id: 21, title: 'Climate Change',            prompt: 'What is climate change? How is it affecting India? What can we do?',                       level: 'Advanced',     icon: '🌍' },
  { id: 22, title: 'Women Empowerment',         prompt: 'Why is women empowerment important in India? Give examples of progress and challenges.',   level: 'Advanced',     icon: '👩' },
  { id: 23, title: 'Startup Culture',           prompt: 'Why is India becoming a startup hub? What challenges do entrepreneurs face?',              level: 'Advanced',     icon: '🚀' },
  { id: 24, title: 'Education System',          prompt: 'What are the strengths and weaknesses of the Indian education system?',                    level: 'Advanced',     icon: '🎓' },
  { id: 25, title: 'Artificial Intelligence',   prompt: 'How will AI change jobs in India in the next 10 years? Is it a threat or opportunity?',   level: 'Advanced',     icon: '🤖' },
  { id: 26, title: 'Rural vs Urban Life',       prompt: 'Compare life in a village vs a city in India. What are the trade-offs?',                  level: 'Advanced',     icon: '🌾' },
  { id: 27, title: 'Mental Health',             prompt: 'Why is mental health awareness important for Indian youth? What are the barriers?',        level: 'Advanced',     icon: '🧠' },
  { id: 28, title: 'Corruption in India',       prompt: 'What causes corruption? How does it affect common people? What is the solution?',         level: 'Advanced',     icon: '⚖️' },
  { id: 29, title: 'Sports in India',           prompt: 'Why does India underperform in Olympics? What needs to change in sports culture?',         level: 'Advanced',     icon: '🏅' },
  { id: 30, title: 'Future of India',           prompt: 'Where do you see India in 2047? What are your hopes and concerns for the country?',       level: 'Advanced',     icon: '🇮🇳' },
];

const shadowingSentences = [
  { text: 'The weather is quite pleasant today.',                     category: 'Daily Life' },
  { text: 'I would like to improve my English speaking skills.',      category: 'Daily Life' },
  { text: 'She went to the market to buy some vegetables.',           category: 'Daily Life' },
  { text: 'I enjoy reading books in my free time.',                   category: 'Daily Life' },
  { text: 'He is working hard to achieve his goals.',                 category: 'Daily Life' },
  { text: 'The train arrives at the station at nine o clock.',        category: 'Travel' },
  { text: 'Could you please tell me the way to the nearest hotel.',   category: 'Travel' },
  { text: 'I would like to book a ticket to Mumbai please.',          category: 'Travel' },
  { text: 'They decided to go for a walk in the park.',               category: 'Travel' },
  { text: 'The flight was delayed by two hours due to bad weather.',  category: 'Travel' },
  { text: 'Please make sure to submit the form before Friday.',       category: 'Office' },
  { text: 'I will send you the report by end of the day.',            category: 'Office' },
  { text: 'Can we schedule a meeting for tomorrow morning.',          category: 'Office' },
  { text: 'She spoke confidently during the presentation.',           category: 'Office' },
  { text: 'The project deadline has been moved to next week.',        category: 'Office' },
  { text: 'Learning a new language takes time and practice.',         category: 'Education' },
  { text: 'The students were excited about the field trip.',          category: 'Education' },
  { text: 'He could not find his keys anywhere in the house.',        category: 'Education' },
  { text: 'We should always be honest and kind to others.',           category: 'Education' },
  { text: 'The doctor advised him to take rest for a week.',          category: 'Health' },
  { text: 'I am looking forward to meeting you tomorrow.',            category: 'Health' },
];

const pronunciationCards = [
  { word: 'Comfortable',   phonetic: '/ˈkʌmf.tə.bəl/',       tip: 'Say: KUMF-ter-bul (3 syllables, not 4)' },
  { word: 'Vegetable',     phonetic: '/ˈvedʒ.tə.bəl/',        tip: 'Say: VEJ-tuh-bul (3 syllables)' },
  { word: 'Wednesday',     phonetic: '/ˈwenz.deɪ/',           tip: 'The D is silent: WENZ-day' },
  { word: 'February',      phonetic: '/ˈfeb.ru.er.i/',        tip: 'Say: FEB-roo-er-ee' },
  { word: 'Pronunciation', phonetic: '/prəˌnʌn.siˈeɪ.ʃən/',  tip: 'Note: pro-NUN-see-AY-shun' },
  { word: 'Entrepreneur',  phonetic: '/ˌɒn.trə.prəˈnɜːr/',   tip: 'Say: on-truh-pruh-NUR' },
  { word: 'Particularly',  phonetic: '/pəˈtɪk.jə.lə.li/',    tip: 'Say: per-TIK-yuh-ler-lee' },
  { word: 'Literally',     phonetic: '/ˈlɪt.ər.ə.li/',       tip: 'Say: LIT-er-uh-lee (4 syllables)' },
];

const todayTopicIdx = new Date().getDay() % topics.length;

// Speech Recognition hook
function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [supported] = useState(() => 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  const recogRef = useRef(null);

  const start = useCallback((onResult) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = 'en-US';
    r.interimResults = false;
    r.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      onResult?.(text);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recogRef.current = r;
    r.start();
    setListening(true);
    setTranscript('');
  }, []);

  const stop = useCallback(() => {
    recogRef.current?.stop();
    setListening(false);
  }, []);

  return { transcript, listening, supported, start, stop, setTranscript };
}

// Normalize text for comparison
function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

export default function Speaking() {
  const [selectedTopic, setSelectedTopic] = useState(topics[todayTopicIdx]);
  const [duration, setDuration] = useState(120);
  const [practiceTranscript, setPracticeTranscript] = useState('');
  const [aiFeedback, setAiFeedback] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [shadowIdx, setShadowIdx] = useState(0);
  const [shadowPhase, setShadowPhase] = useState('idle');
  const [shadowTranscript, setShadowTranscript] = useState('');
  const [shadowScores, setShadowScores] = useState([]);
  const recorder = useRecorder();
  const timer = useTimer(duration);
  const practiceSr = useSpeechRecognition();
  const shadowSr = useSpeechRecognition();
  const timerRef = useRef(null);

  // Reset timer when topic changes
  useEffect(() => { timer.reset(); }, [selectedTopic]); // eslint-disable-line

  // Sync timer when duration changes
  useEffect(() => { timer.reset(); }, [duration]); // eslint-disable-line

  // Auto-stop recording when timer finishes
  useEffect(() => {
    if (timer.done && recorder.recording) recorder.stop();
    if (timer.done && practiceSr.listening) practiceSr.stop();
  }, [timer.done]); // eslint-disable-line

  const getAIFeedback = async () => {
    if (!practiceTranscript.trim()) return;
    setAiLoading(true);
    setAiFeedback(null);
    try {
      const topicInfo = selectedTopic ? `Topic: "${selectedTopic.title}" — ${selectedTopic.prompt}` : 'Free speaking practice';
      const { data } = await api.post('/gemini/chat', {
        messages: [{
          role: 'user',
          content: `You are an English speaking coach for Indian students. Analyze this spoken English transcript and give feedback.

${topicInfo}

Transcript: "${practiceTranscript}"

Give feedback in this EXACT format (keep it short and clear):
SCORE: [0-100]
FLUENCY: [1 sentence]
GRAMMAR MISTAKES: [list up to 3 mistakes with corrections, or "None found"]
VOCABULARY: [1 sentence tip]
TIP: [1 actionable improvement tip]`
        }]
      });
      setAiFeedback(data.content);
    } catch {
      setAiFeedback('ERROR: Could not get feedback. Please try again.');
    }
    setAiLoading(false);
  };

  const parseFeedback = (text) => {
    const lines = text.split('\n').filter(Boolean);
    const get = (key) => lines.find(l => l.startsWith(key))?.replace(key, '').trim() || '';
    const score = parseInt(get('SCORE:')) || 0;
    return {
      score,
      fluency: get('FLUENCY:'),
      grammar: get('GRAMMAR MISTAKES:'),
      vocabulary: get('VOCABULARY:'),
      tip: get('TIP:'),
    };
  };

  const speakSentence = (text) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  const handleShadowPlay = () => {
    setShadowTranscript('');
    setShadowPhase('playing');
    const u = new SpeechSynthesisUtterance(shadowingSentences[shadowIdx].text);
    u.lang = 'en-US';
    u.rate = 0.8;
    u.onend = () => {
      setShadowPhase('listening');
      shadowSr.start((t) => {
        setShadowTranscript(t);
        setShadowPhase('result');
      });
    };
    window.speechSynthesis.speak(u);
  };

  const shadowScore = (() => {
    if (!shadowTranscript) return 0;
    const target = normalize(shadowingSentences[shadowIdx].text).split(' ');
    const spoken = normalize(shadowTranscript).split(' ');
    const matched = target.filter(w => spoken.includes(w)).length;
    return Math.round((matched / target.length) * 100);
  })();

  const handleShadowNext = (score) => {
    setShadowScores(prev => [...prev, score ?? shadowScore]);
    setShadowIdx(i => (i + 1) % shadowingSentences.length);
    setShadowPhase('idle');
    setShadowTranscript('');
  };

  // Auto-next when score >= 80
  useEffect(() => {
    if (shadowPhase === 'result' && shadowScore >= 80) {
      const t = setTimeout(() => handleShadowNext(shadowScore), 1500);
      return () => clearTimeout(t);
    }
  }, [shadowPhase, shadowScore]); // eslint-disable-line

  const handleTopicClick = (topic) => {
    const isSame = selectedTopic?.id === topic.id;
    setSelectedTopic(isSame ? null : topic);
    if (!isSame) {
      setTimeout(() => timerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  };

  const handleSpeakNow = () => {
    setAiFeedback(null);
    setPracticeTranscript('');
    timer.reset();
    setTimeout(() => {
      timer.start();
      recorder.start();
      if (practiceSr.supported) {
        practiceSr.start((t) => setPracticeTranscript(prev => prev ? prev + ' ' + t : t));
      }
    }, 50);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Speaking Practice 🎤</h1>
        <p className="text-gray-400 text-sm mt-1">Build confidence by speaking every day</p>
      </div>

      {/* Shadowing Mode */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-white">🪞 Shadowing Mode</h2>
          {shadowScores.length > 0 && (
            <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
              Avg: {Math.round(shadowScores.reduce((a, b) => a + b, 0) / shadowScores.length)}% • {shadowScores.length} done
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-4">Listen → Repeat exactly → Get score. Score 80%+ = auto next ⚡</p>

        {/* Sentence display */}
        <div className="bg-white/5 rounded-xl p-4 mb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{shadowingSentences[shadowIdx].category}</span>
            <span className="text-xs text-gray-500">{shadowIdx + 1} / {shadowingSentences.length}</span>
          </div>
          {shadowPhase === 'playing'
            ? <p className="text-white text-base font-medium animate-pulse">🔊 Listen carefully...</p>
            : <p className="text-white text-base font-medium">{shadowingSentences[shadowIdx].text}</p>
          }
        </div>

        {shadowPhase === 'idle' && (
          <div className="text-center">
            <button onClick={handleShadowPlay} className="flex items-center gap-2 mx-auto bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-6 py-3 rounded-xl font-semibold transition-all">
              <Volume2 size={18} /> Play & Shadow
            </button>
          </div>
        )}

        {shadowPhase === 'playing' && (
          <p className="text-center text-sm text-gray-400 animate-pulse">🎧 Listening... get ready to repeat</p>
        )}

        {shadowPhase === 'listening' && (
          <div className="text-center space-y-2">
            <p className="text-sm text-red-400 font-semibold animate-pulse">🎤 Now repeat the sentence!</p>
            <p className="text-xs text-gray-500">Speak clearly and naturally</p>
          </div>
        )}

        {shadowPhase === 'result' && (
          <div className="space-y-3">
            <div className="bg-white/5 rounded-xl px-4 py-2">
              <p className="text-xs text-gray-500 mb-1">You said:</p>
              <p className="text-xs text-gray-300 italic">"{shadowTranscript}"</p>
            </div>
            <div className="flex items-center gap-3">
              {shadowScore >= 80
                ? <CheckCircle size={18} className="text-green-400 shrink-0" />
                : <XCircle size={18} className="text-red-400 shrink-0" />}
              <div className="flex-1 bg-white/10 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all ${
                  shadowScore >= 80 ? 'bg-green-400' : shadowScore >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                }`} style={{ width: `${shadowScore}%` }} />
              </div>
              <span className={`text-sm font-black ${
                shadowScore >= 80 ? 'text-green-400' : shadowScore >= 50 ? 'text-yellow-400' : 'text-red-400'
              }`}>{shadowScore}%</span>
            </div>
            <p className="text-xs text-center text-gray-500">
              {shadowScore >= 80 ? '🎉 Excellent! Moving to next...' : shadowScore >= 50 ? '👍 Good try!' : '💪 Try again!'}
            </p>
            {shadowScore < 80 && (
              <div className="flex gap-2 justify-center">
                <button onClick={() => setShadowPhase('idle')} className="px-4 py-2 rounded-xl bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 text-sm font-semibold transition-all">
                  🔄 Try Again
                </button>
                <button onClick={() => handleShadowNext(shadowScore)} className="px-4 py-2 rounded-xl bg-white/10 text-gray-400 hover:bg-white/20 text-sm font-semibold transition-all">
                  Skip →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Speaking Timer + Recorder */}
      <div className="glass-card" ref={timerRef}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white">⏱️ Speaking Timer</h2>
          {selectedTopic && (
            <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">{selectedTopic.icon} {selectedTopic.title}</span>
          )}
        </div>

        {selectedTopic && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 mb-4 flex items-start justify-between gap-3">
            <p className="text-sm text-blue-200">{selectedTopic.prompt}</p>
            {(!timer.running && !timer.done) && (
              <button onClick={handleSpeakNow} className="shrink-0 bg-green-500/20 text-green-400 hover:bg-green-500/30 text-xs font-bold px-3 py-1.5 rounded-lg transition-all">
                Speak Now ▶
              </button>
            )}
          </div>
        )}

        {/* Live transcript while speaking */}
        {timer.running && practiceTranscript && (
          <div className="bg-white/5 rounded-xl px-4 py-2 mb-3">
            <p className="text-xs text-gray-500 mb-1">📝 Live transcript:</p>
            <p className="text-xs text-gray-300 italic">"{practiceTranscript}"</p>
          </div>
        )}

        {/* Duration selector */}
        <div className="flex items-center gap-2 mb-4 justify-center">
          <span className="text-xs text-gray-500">Duration:</span>
          {[60, 120, 180, 300].map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                duration === d ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {d === 60 ? '1 min' : d === 120 ? '2 min' : d === 180 ? '3 min' : '5 min'}
            </button>
          ))}
        </div>

        {/* Timer display */}
        <div className="text-center mb-3">
          <p className={`text-6xl font-black font-mono transition-colors ${
            timer.done ? 'text-green-400' : timer.seconds <= 10 && timer.running ? 'text-red-400 animate-pulse' : 'text-white'
          }`}>
            {timer.format()}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {timer.done ? '🎉 Great job! You spoke for the full time!' : timer.running ? 'Keep speaking — don\'t stop!' : 'Press Start when ready'}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/10 rounded-full h-2 mb-4">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              timer.done ? 'bg-green-400' : timer.seconds <= 10 ? 'bg-red-400' : 'bg-blue-500'
            }`}
            style={{ width: `${(timer.seconds / duration) * 100}%` }}
          />
        </div>

        <div className="flex gap-3 justify-center mb-4">
          <button
            onClick={() => {
              if (timer.running) {
                timer.pause();
                if (recorder.recording) recorder.stop();
              } else {
                timer.start();
                if (!recorder.recording) recorder.start();
              }
            }}
            disabled={timer.done}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-40 ${
              timer.running ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
            }`}
          >
            {timer.running ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
          </button>
          <button
            onClick={() => { timer.reset(); if (recorder.recording) recorder.stop(); }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-gray-400 hover:bg-white/20 font-semibold transition-all"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* AI Feedback Button + Result */}
        {(timer.done || practiceTranscript) && !timer.running && (
          <div className="border-t border-white/10 pt-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-300">🤖 AI Pronunciation Feedback</p>
              {practiceTranscript && (
                <button
                  onClick={getAIFeedback}
                  disabled={aiLoading || !practiceTranscript.trim()}
                  className="flex items-center gap-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 disabled:opacity-50 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                >
                  {aiLoading ? <><Loader size={14} className="animate-spin" /> Analyzing...</> : <><Sparkles size={14} /> Get Feedback</>}
                </button>
              )}
            </div>

            {!practiceTranscript && (
              <p className="text-xs text-gray-500">💡 Press "Speak Now ▶" above to start — your speech will be captured automatically</p>
            )}

            {practiceTranscript && !aiFeedback && !aiLoading && (
              <div className="bg-white/5 rounded-xl px-4 py-2">
                <p className="text-xs text-gray-500 mb-1">Your speech captured:</p>
                <p className="text-xs text-gray-300 italic">"{practiceTranscript}"</p>
              </div>
            )}

            {aiFeedback && (() => {
              if (aiFeedback.startsWith('ERROR:')) return <p className="text-xs text-red-400">{aiFeedback}</p>;
              const fb = parseFeedback(aiFeedback);
              return (
                <div className="space-y-3">
                  {/* Score */}
                  <div className="flex items-center gap-3">
                    <div className={`text-3xl font-black ${
                      fb.score >= 80 ? 'text-green-400' : fb.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>{fb.score}<span className="text-sm font-normal text-gray-500">/100</span></div>
                    <div className="flex-1">
                      <div className="bg-white/10 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all ${
                          fb.score >= 80 ? 'bg-green-400' : fb.score >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                        }`} style={{ width: `${fb.score}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {fb.score >= 80 ? '🎉 Excellent!' : fb.score >= 60 ? '👍 Good, keep improving' : '💪 Keep practicing!'}
                      </p>
                    </div>
                  </div>
                  {/* Details */}
                  <div className="grid grid-cols-1 gap-2">
                    {fb.fluency && (
                      <div className="bg-blue-500/10 rounded-xl px-3 py-2">
                        <p className="text-xs text-blue-400 font-semibold mb-0.5">🗣️ Fluency</p>
                        <p className="text-xs text-gray-300">{fb.fluency}</p>
                      </div>
                    )}
                    {fb.grammar && (
                      <div className="bg-red-500/10 rounded-xl px-3 py-2">
                        <p className="text-xs text-red-400 font-semibold mb-0.5">✏️ Grammar</p>
                        <p className="text-xs text-gray-300">{fb.grammar}</p>
                      </div>
                    )}
                    {fb.vocabulary && (
                      <div className="bg-yellow-500/10 rounded-xl px-3 py-2">
                        <p className="text-xs text-yellow-400 font-semibold mb-0.5">📚 Vocabulary</p>
                        <p className="text-xs text-gray-300">{fb.vocabulary}</p>
                      </div>
                    )}
                    {fb.tip && (
                      <div className="bg-green-500/10 rounded-xl px-3 py-2">
                        <p className="text-xs text-green-400 font-semibold mb-0.5">💡 Tip</p>
                        <p className="text-xs text-gray-300">{fb.tip}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

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
          {recorder.error && <p className="mt-2 text-xs text-red-400">{recorder.error}</p>}
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
              <button onClick={() => speakSentence(card.word)} className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 shrink-0 transition-all">
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
        <h2 className="font-bold text-white mb-4">📋 Speaking Topics <span className="text-xs text-gray-500 font-normal ml-1">{topics.length} topics</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topics.map((topic, idx) => (
            <div
              key={topic.id}
              onClick={() => handleTopicClick(topic)}
              className={`glass-card cursor-pointer transition-all duration-300 hover:scale-[1.02] ${selectedTopic?.id === topic.id ? 'border-blue-500/50 bg-blue-500/5' : 'hover:border-white/20'}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{topic.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-white text-sm">{topic.title}</h3>
                    <span className={`badge text-xs ${topic.level === 'Beginner' ? 'bg-green-500/20 text-green-400' : topic.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{topic.level}</span>
                    {idx === todayTopicIdx && <span className="badge text-xs bg-purple-500/20 text-purple-400">📌 Today</span>}
                  </div>
                  {selectedTopic?.id === topic.id && (
                    <p className="text-xs text-gray-400">{topic.prompt}</p>
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
