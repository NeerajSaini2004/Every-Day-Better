import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/ui/TaskCard';
import ProgressBar from '../components/ui/ProgressBar';
import Spinner from '../components/ui/Spinner';
import WritingFeedback from '../components/ui/WritingFeedback';
import DailyNews from '../components/ui/DailyNews';
import DailyQuote from '../components/ui/DailyQuote';
import DayQuiz from '../components/ui/DayQuiz';
import { ArrowLeft, ArrowRight, CheckCircle, Star, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DayChallenge() {
  const { dayNumber } = useParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [day, setDay] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [celebrating, setCelebrating] = useState(false);
  const [motivationPopup, setMotivationPopup] = useState(null);

  const motivations = [
    { emoji: '🔥', msg: 'You\'re on fire! Keep going!' },
    { emoji: '⚡', msg: 'XP earned! You\'re leveling up!' },
    { emoji: '💪', msg: 'Great job! One step closer!' },
    { emoji: '🌟', msg: 'Brilliant! You\'re unstoppable!' },
    { emoji: '🎯', msg: 'Task crushed! Stay consistent!' },
  ];

  useEffect(() => {
    // Reset state first so old day doesn't flash while new one loads
    setDay(null);
    setProgress(null);
    setLoading(true);
    setCelebrating(false);
    setMotivationPopup(null);

    const load = async () => {
      try {
        const [dayRes, progressRes] = await Promise.all([
          api.get(`/days/${dayNumber}`),
          api.get(`/progress/${dayNumber}`),
        ]);
        setDay(dayRes.data);
        setProgress(progressRes.data);
      } catch {
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [dayNumber, navigate]); // re-run every time dayNumber changes in the URL

  const handleTaskToggle = async (taskId, completed) => {
    try {
      const { data } = await api.put(`/progress/${dayNumber}/task/${taskId}`, { completed });
      setProgress(data.progress);
      updateUser(data.user);

      if (completed) {
        const task = day.tasks.find((t) => t._id === taskId);
        toast.success(`+${task?.xp || 10} XP earned! 🎉`, { icon: '⚡' });
        const m = motivations[Math.floor(Math.random() * motivations.length)];
        setMotivationPopup(m);
        setTimeout(() => setMotivationPopup(null), 2500);
      }

      if (data.progress.isCompleted && !celebrating) {
        setCelebrating(true);
        toast.success('🎊 Day Complete! Amazing work!', { duration: 4000 });
        setTimeout(() => setCelebrating(false), 3000);
      }
    } catch {
      toast.error('Failed to update task');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size={40} /></div>;
  if (!day) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-medium">Day {day.dayNumber} of 60</p>
          <h1 className="text-xl font-black text-white">{day.title}</h1>
        </div>
        {progress?.isCompleted && <CheckCircle size={28} className="text-green-400" />}
      </div>

      {/* Progress Overview */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-3xl font-black text-white">{progress?.completionPercentage || 0}%</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-yellow-400 font-bold">
              <Star size={16} /> {progress?.totalXPEarned || 0} / {day.totalXP} XP
            </div>
            <p className="text-xs text-gray-500">{progress?.tasks?.filter((t) => t.completed).length || 0} / {day.tasks?.length || 0} tasks</p>
          </div>
        </div>
        <ProgressBar value={progress?.completionPercentage || 0} color={progress?.isCompleted ? 'green' : 'blue'} size="lg" />
      </div>

      {/* Motivation Popup */}
      <AnimatePresence>
        {motivationPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 glass-card bg-gradient-to-r from-blue-900/80 to-purple-900/80 border-blue-500/40 text-center px-8 py-4 shadow-2xl"
          >
            <p className="text-4xl mb-1">{motivationPopup.emoji}</p>
            <p className="font-black text-white text-lg">{motivationPopup.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="glass-card bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30 text-center relative"
          >
            <button onClick={() => setCelebrating(false)} className="absolute top-3 right-3 text-gray-500 hover:text-white"><X size={16} /></button>
            <p className="text-5xl mb-2">🎊</p>
            <p className="font-black text-white text-2xl">Day {day.dayNumber} Complete!</p>
            <p className="text-gray-400 text-sm mt-1">You earned {progress?.totalXPEarned} XP today!</p>
            <div className="flex justify-center gap-2 mt-3 text-2xl animate-bounce">
              {'🌟✨🎉🏆🔥'.split('').map((e, i) => <span key={i}>{e}</span>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bonus Section — Live APIs */}
      <div className="space-y-4">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">⚡ Bonus Practice</p>
        <DailyQuote />
        <DailyNews />
        <WritingFeedback />
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        {day.tasks?.map((task) => {
          const taskProgress = progress?.tasks?.find((t) => t.taskId === task._id || t.taskId?.toString() === task._id?.toString());
          return (
            <TaskCard key={task._id} task={task} taskProgress={taskProgress} onToggle={(completed) => handleTaskToggle(task._id, completed)} />
          );
        })}
      </div>

      {/* Day Quiz — shown when day is completed */}
      {progress?.isCompleted && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">🧠 Test Your Knowledge</p>
          <DayQuiz dayNumber={parseInt(dayNumber)} />
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {parseInt(dayNumber) > 1 && (
          <button onClick={() => navigate(`/day/${parseInt(dayNumber) - 1}`)} className="btn-secondary flex items-center gap-2 flex-1 justify-center">
            <ArrowLeft size={16} /> Day {parseInt(dayNumber) - 1}
          </button>
        )}
        {parseInt(dayNumber) < 60 && (
          <button
            onClick={() => progress?.isCompleted && navigate(`/day/${parseInt(dayNumber) + 1}`)}
            disabled={!progress?.isCompleted}
            title={!progress?.isCompleted ? 'Complete this day first to unlock the next' : ''}
            className={`flex items-center gap-2 flex-1 justify-center btn-primary transition-all ${
              !progress?.isCompleted ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            Day {parseInt(dayNumber) + 1} <ArrowRight size={16} />
            {!progress?.isCompleted && <span className="text-xs ml-1">🔒</span>}
          </button>
        )}
      </div>
    </div>
  );
}
