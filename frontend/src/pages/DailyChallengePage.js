import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import { Zap, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function DailyChallengePage() {
  const { updateUser } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/challenge/today')
      .then((r) => setChallenge(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setSubmitting(true);
    try {
      const { data } = await api.post('/challenge/submit', {
        challengeId: challenge._id,
        selectedIndex: idx,
      });
      setResult(data);
      if (data.xpEarned > 0 && data.user) {
        updateUser({ xp: data.user?.xp });
        toast.success(`+${data.xpEarned} XP earned! 🎉`, { icon: '⚡' });
      } else if (data.xpEarned > 0) {
        toast.success(`+${data.xpEarned} XP earned! 🎉`, { icon: '⚡' });
      }
    } catch { toast.error('Failed to submit'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size={40} /></div>;

  if (!challenge) return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <p className="text-4xl mb-3">📭</p>
      <p className="text-gray-400">No challenge available today. Check back tomorrow!</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Daily Challenge ⚡</h1>
        <p className="text-gray-400 text-sm mt-1">One question every day — earn 15 XP for correct answer</p>
      </div>

      {/* Reward banner */}
      <div className="glass-card bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-xl shrink-0">⚡</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-white">+15 XP Reward</p>
              <span className="text-xs font-bold text-yellow-400 bg-yellow-500/20 px-2 py-0.5 rounded-full capitalize">{challenge.category}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${
                challenge.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                challenge.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>{challenge.difficulty}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Answer correctly to earn XP. New question every day!</p>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="glass-card">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-6 leading-relaxed">{challenge.question}</h2>

        <div className="space-y-3">
          {challenge.options.map((opt, idx) => {
            let style = 'border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 cursor-pointer';
            if (selected !== null) {
              if (idx === challenge.correctIndex) style = 'border-green-500/60 bg-green-500/10';
              else if (idx === selected && selected !== challenge.correctIndex) style = 'border-red-500/60 bg-red-500/10';
              else style = 'border-white/5 bg-white/3 opacity-50';
            }
            return (
              <motion.button
                key={idx}
                whileHover={selected === null ? { scale: 1.01 } : {}}
                whileTap={selected === null ? { scale: 0.99 } : {}}
                onClick={() => handleSubmit(idx)}
                disabled={selected !== null || submitting}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${style}`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                  selected !== null && idx === challenge.correctIndex ? 'bg-green-500 text-white' :
                  selected !== null && idx === selected ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-white font-medium">{opt}</span>
                {selected !== null && idx === challenge.correctIndex && <CheckCircle size={18} className="ml-auto text-green-400 shrink-0" />}
                {selected !== null && idx === selected && selected !== challenge.correctIndex && <XCircle size={18} className="ml-auto text-red-400 shrink-0" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card ${result.correct ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{result.correct ? '🎉' : '😅'}</span>
              <div>
                <p className="font-bold text-white text-lg">{result.correct ? 'Correct! Well done!' : 'Not quite right'}</p>
                {result.alreadyDone && <p className="text-xs text-gray-400">You already answered today — no XP this time</p>}
                {result.xpEarned > 0 && (
                  <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                    <Zap size={14} /> +{result.xpEarned} XP earned!
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 space-y-1">
              <p className="text-sm text-white font-semibold">📌 Explanation:</p>
              <p className="text-sm text-gray-300">{result.explanation}</p>
              {result.hindiExplanation && (
                <p className="text-sm text-orange-300">🇮🇳 {result.hindiExplanation}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
