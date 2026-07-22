import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import ProgressBar from '../components/ui/ProgressBar';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, Zap, Target, Trophy } from 'lucide-react';
import BadgeCard from '../components/ui/BadgeCard';

export default function Progress() {
  const { user } = useAuth();
  const [allProgress, setAllProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/progress').then((r) => { setAllProgress(r.data); setLoading(false); });
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size={40} /></div>;

  const completedDays = allProgress.filter((p) => p.isCompleted);
  const totalXP = allProgress.reduce((sum, p) => sum + p.totalXPEarned, 0);
  const overallPct = Math.round((completedDays.length / 60) * 100);

  // Weekly chart data
  const weeklyData = Array.from({ length: 9 }, (_, i) => {
    const weekDays = allProgress.filter((p) => Math.ceil(p.dayNumber / 7) === i + 1);
    return {
      week: `W${i + 1}`,
      xp: weekDays.reduce((sum, p) => sum + p.totalXPEarned, 0),
      days: weekDays.filter((p) => p.isCompleted).length,
    };
  });

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">Your Progress 📊</h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">Track your 60-day journey</p>
      </div>

      {/* Overall Progress */}
      <div className="glass-card bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/20 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <div>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">{overallPct}%</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">60-Day Challenge Complete</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">{completedDays.length}/60</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Days Completed</p>
          </div>
        </div>
        <ProgressBar value={overallPct} color="blue" size="lg" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {[
          { icon: Flame, label: 'Current Streak', value: `${user?.streak || 0} 🔥`, color: 'orange' },
          { icon: Zap, label: 'Total XP', value: totalXP, color: 'purple' },
          { icon: Target, label: 'Tasks Done', value: allProgress.reduce((s, p) => s + p.tasks.filter((t) => t.completed).length, 0), color: 'green' },
          { icon: Trophy, label: 'Best Streak', value: user?.longestStreak || 0, color: 'yellow' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass-card text-center p-3 sm:p-4 min-h-[100px] sm:min-h-auto flex flex-col items-center justify-center">
            <p className="text-xl sm:text-2xl lg:text-3xl font-black text-white break-words">{value}</p>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{label}</p>
          </div>
        ))}
      </div>

      {/* Weekly XP Chart */}
      <div className="glass-card p-3 sm:p-4 overflow-x-auto">
        <h2 className="font-bold text-white mb-4 text-sm sm:text-base">Weekly XP Earned</h2>
        <div className="min-w-full w-full">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }} />
              <Area type="monotone" dataKey="xp" stroke="#3B82F6" fill="url(#xpGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Day Heatmap */}
      <div className="glass-card p-3 sm:p-4">
        <h2 className="font-bold text-white mb-4 text-sm sm:text-base">60-Day Progress Map</h2>
        <div className="grid gap-1 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(2rem, 1fr))' }}>
          {Array.from({ length: 60 }, (_, i) => {
            const dayProgress = allProgress.find((p) => p.dayNumber === i + 1);
            const pct = dayProgress?.completionPercentage || 0;
            return (
              <div key={i} title={`Day ${i + 1}: ${pct}%`} className={`aspect-square rounded-md flex items-center justify-center text-[7px] sm:text-[8px] font-bold transition-all min-h-[2rem] ${pct === 100 ? 'bg-green-500 text-white' : pct > 0 ? 'bg-blue-500/50 text-blue-300' : 'bg-white/5 text-gray-600'}`}>
                {i + 1}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 sm:gap-4 mt-3 text-xs text-gray-500 flex-wrap">
          <div className="flex items-center gap-1"><div className="w-2 sm:w-3 h-2 sm:h-3 rounded bg-green-500" /> <span className="text-xs">Completed</span></div>
          <div className="flex items-center gap-1"><div className="w-2 sm:w-3 h-2 sm:h-3 rounded bg-blue-500/50" /> <span className="text-xs">In Progress</span></div>
          <div className="flex items-center gap-1"><div className="w-2 sm:w-3 h-2 sm:h-3 rounded bg-white/5" /> <span className="text-xs">Not Started</span></div>
        </div>
      </div>

      {/* Badges */}
      {(user?.badges || []).length > 0 && (
        <div className="glass-card p-3 sm:p-4">
          <h2 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">🏅 Your Badges</h2>
          <div className="flex flex-wrap gap-2">
            {user.badges.map((b) => <BadgeCard key={b} badgeKey={b} />)}
          </div>
        </div>
      )}
    </div>
  );
}
