import React, { useState } from 'react';
import { CheckCircle, Circle, Timer, Mic, Play, Pause, RotateCcw, ExternalLink, BookOpen, PenLine } from 'lucide-react';
import { TASK_ICONS, TASK_COLORS } from '../../utils/constants';
import { useTimer } from '../../hooks/useTimer';
import { useRecorder } from '../../hooks/useRecorder';
import { Link } from 'react-router-dom';

const progressTips = [
  { step: '1️⃣', tip: 'Start with English audio + Hindi subtitles' },
  { step: '2️⃣', tip: 'After 2-3 days → English audio + English subtitles' },
  { step: '3️⃣', tip: 'After a week → No subtitles, just listen' },
  { step: '🔄', tip: 'Re-watch movies you already know in English!' },
];

const colorMap = {
  blue: 'border-blue-500/30 bg-blue-500/5',
  purple: 'border-purple-500/30 bg-purple-500/5',
  green: 'border-green-500/30 bg-green-500/5',
  yellow: 'border-yellow-500/30 bg-yellow-500/5',
  pink: 'border-pink-500/30 bg-pink-500/5',
  orange: 'border-orange-500/30 bg-orange-500/5',
};

export default function TaskCard({ task, taskProgress, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  const timer = useTimer(task.duration * 60);
  const recorder = useRecorder();
  const completed = taskProgress?.completed || false;
  const color = TASK_COLORS[task.type] || 'blue';

  const linkLabel = task.urlLabel || (task.type === 'listening' ? 'Open lesson' : 'Open resource');

  return (
    <div className={`border rounded-2xl p-4 transition-all duration-300 ${completed ? 'border-green-500/40 bg-green-500/5' : colorMap[color]}`}>
      <div className="flex items-start gap-3">
        <button onClick={() => onToggle(!completed)} className="mt-0.5 shrink-0 transition-transform active:scale-90">
          {completed ? <CheckCircle size={22} className="text-green-400" /> : <Circle size={22} className="text-gray-500" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{TASK_ICONS[task.type]}</span>
            <h4 className={`font-semibold text-sm ${completed ? 'line-through text-gray-500' : 'text-white'}`}>{task.title}</h4>
            <span className="ml-auto text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full shrink-0">+{task.xp} XP</span>
          </div>
          <p className="text-xs text-gray-400">{task.description}</p>
          {task.url && (
            <a
              href={task.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-blue-300 hover:bg-blue-500/10 hover:text-blue-100 transition"
            >
              <ExternalLink size={14} /> {linkLabel}
            </a>
          )}

          {!completed && (
            <button onClick={() => setExpanded(!expanded)} className="mt-2 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              {expanded ? '▲ Hide tips' : '▼ Show tips & tools'}
            </button>
          )}

          {expanded && !completed && (
            <div className="mt-3 space-y-3 animate-fade-in">

              {/* TIMER — for speaking/reading/confidence tasks */}
              {task.hasTimer && (
                <div className="flex items-center gap-2 bg-white/5 rounded-xl p-3">
                  <Timer size={16} className="text-blue-400" />
                  <span className="font-mono text-lg font-bold text-white">{timer.format()}</span>
                  <div className="ml-auto flex gap-2">
                    <button onClick={timer.running ? timer.pause : timer.start} className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                      {timer.running ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <button onClick={timer.reset} className="p-1.5 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20">
                      <RotateCcw size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* RECORDER */}
              {task.hasRecording && (
                <div className="flex items-center gap-2 bg-white/5 rounded-xl p-3">
                  <Mic size={16} className={recorder.recording ? 'text-red-400 animate-pulse' : 'text-gray-400'} />
                  <span className="text-sm text-gray-300">{recorder.recording ? 'Recording...' : 'Voice Recorder'}</span>
                  <button onClick={recorder.recording ? recorder.stop : recorder.start} className={`ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold ${recorder.recording ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {recorder.recording ? 'Stop' : 'Record'}
                  </button>
                </div>
              )}
              {recorder.error && (
                <p className="text-xs text-red-400 px-1">{recorder.error}</p>
              )}
              {recorder.audioURL && (
                <audio src={recorder.audioURL} controls className="w-full h-8 rounded-lg" />
              )}

              {/* LISTENING TASK */}
              {task.type === 'listening' && (
                <div className="space-y-3">
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-orange-400 mb-2">🎬 Beginner Strategy — Don't Panic!</p>
                    <div className="space-y-1.5">
                      {progressTips.map((t, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                          <span>{t.step}</span>
                          <span>{t.tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 space-y-1.5">
                    <p className="text-xs font-bold text-blue-400">💡 Where to Watch?</p>
                    <p className="text-xs text-gray-300">Search for <strong className="text-white">English learning audio</strong> on YouTube, Spotify, or any podcast app.</p>
                    <p className="text-xs text-gray-300">Search keywords: <span className="text-blue-300">"English for beginners", "slow English podcast", "English conversation practice"</span></p>
                    <p className="text-xs text-gray-300">Already watched a movie in Hindi? <strong className="text-white">Re-watch it in English</strong> — you already know the story, so listening becomes easy!</p>
                  </div>
                </div>
              )}

              {/* VOCABULARY TASK — link to vocab page */}
              {task.type === 'vocabulary' && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 space-y-2">
                  <p className="text-xs font-bold text-yellow-400 flex items-center gap-1"><BookOpen size={13} /> Where to Learn Today's Words?</p>
                  <p className="text-xs text-gray-300">Go to the <strong className="text-white">Vocabulary</strong> section to see today's 10 words with Hindi meanings, pronunciation & examples.</p>
                  <div className="flex flex-col gap-1.5 mt-1">
                    <div className="text-xs text-gray-400">💡 Tips:</div>
                    <div className="text-xs text-gray-300">• Read the word aloud 3 times</div>
                    <div className="text-xs text-gray-300">• Write it in a sentence of your own</div>
                    <div className="text-xs text-gray-300">• Check the Hindi meaning first, then English</div>
                    <div className="text-xs text-gray-300">• Use pronunciation button 🔊 to hear it</div>
                  </div>
                  <Link to="/vocabulary" className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-yellow-400 hover:text-yellow-300 transition-colors">
                    <BookOpen size={13} /> Open Vocabulary Section <ExternalLink size={11} />
                  </Link>
                </div>
              )}

              {/* GRAMMAR TASK — link to grammar page */}
              {task.type === 'grammar' && (
                <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-3 space-y-2">
                  <p className="text-xs font-bold text-pink-400 flex items-center gap-1"><PenLine size={13} /> Grammar Practice Guide</p>
                  <p className="text-xs text-gray-300">Visit the <strong className="text-white">Grammar</strong> section for 56 rules with Hindi explanations and examples.</p>
                  <div className="flex flex-col gap-1.5 mt-1">
                    <div className="text-xs text-gray-400">💡 How to practice:</div>
                    <div className="text-xs text-gray-300">• Read the rule in English, then Hindi</div>
                    <div className="text-xs text-gray-300">• Write 3 sentences using that rule</div>
                    <div className="text-xs text-gray-300">• Speak those sentences aloud</div>
                    <div className="text-xs text-gray-300">• Start with Beginner level → then Intermediate</div>
                  </div>
                  <Link to="/grammar" className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-pink-400 hover:text-pink-300 transition-colors">
                    <PenLine size={13} /> Open Grammar Section <ExternalLink size={11} />
                  </Link>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
