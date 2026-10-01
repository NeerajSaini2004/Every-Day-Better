import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import ProgressBar from '../components/ui/ProgressBar';
import BadgeCard from '../components/ui/BadgeCard';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, Zap, Target, Trophy, Calendar } from 'lucide-react';
import { getLevelName, getXPProgress } from '../utils/constants';

// Last 30 days streak calendar
function StreakCalendar({ allProgress }) {
  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    return d;
  });

  // Build a set of completed date strings from progress completedAt
  const completedDates = new Set(
    allProgress
      .filter((p) => p.isCompleted && p.completedAt)
      .map((p) => new Date(p.completedAt).toDateString())
  );

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={16} className="text-orange-400" />
        <h2 className="font-bold text-white text-sm">Activity — Last 30 Days</h2>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayLabels.map((l, i) => (
          <p key={i} className="text-center text-[10px] text-gray-600 font-semibold">{l}</p>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {/* Offset for first day of week */}
        {Array.from({ length: days[0].getDay() }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((d, i) => {
          const isToday = d.toDateString() === today.toDateString();
          const active = completedDates.has(d.toDateString());
          return (
            <div
              key={i}
              title={`${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}${active ? ' ✓' : ''}`}
              className={`aspect-square rounded-md flex items-center justify-center text-[9px] font-bold transition-all
                ${active ? 'bg-orange-500 text-white' : isToday ? 'bg-white/10 text-gray-300 ring-1 ring-blue-500/50' : 'bg-white/5 text-gray-700'}`}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-orange-500" /> Active</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-white/5 ring-1 ring-blue-500/50" /> Today</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-white/5" /> Inactive</div>
      </div>
    </div>
  );
}

export default function Progress() {
  const { user } = useAuth();
  const [allProgress, setAllProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.get('/progress').then((r) => {
      if (!cancelled) { setAllProgress(r.data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size={40} /></div>;

  const completedDays = allProgress.filter((p) => p.isCompleted);
  const totalXP = allProgress.reduce((sum, p) => sum + p.totalXPEarned, 0);
  const overallPct = Math.round((completedDays.length / 60) * 100);
  const daysLeft = 60 - completedDays.length;
  const totalTasks = allProgress.reduce((s, p) => s + p.tasks.filter((t) => t.completed).length, 0);

  const level = user?.level || 1;
  const xp = user?.xp || 0;
  const xpPct = getXPProgress(xp, level);
  const levelStartXP = (level - 1) * 500;
  const xpInLevel = xp - levelStartXP;

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
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">Your Progress 📊</h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">Track your 60-day journey</p>
      </div>

      {/* Overall Progress */}
      <div className="glass-card bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/20 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-4xl font-black text-white">{overallPct}%</p>
            <p className="text-gray-400 text-xs mt-0.5">60-Day Challenge</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-white">{completedDays.length}<span className="text-gray-500 text-lg">/60</span></p>
            <p className="text-gray-400 text-xs mt-0.5">{daysLeft > 0 ? `${daysLeft} days to go 🚀` : '🎉 Challenge Complete!'}</p>
          </div>
        </div>
        <ProgressBar value={overallPct} color="blue" size="lg" />
      </div>

      {/* Level Card */}
      <div className="glass-card bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/20 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center font-black text-white text-lg">
              {level}
            </div>
            <div>
              <p className="font-black text-white">{getLevelName(level)}</p>
              <p className="text-xs text-gray-400">Level {level}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">{xpInLevel} / 500 XP</p>
            <p className="text-xs text-purple-400 font-semibold">{500 - xpInLevel} XP to Level {level + 1}</p>
          </div>
        </div>
        <ProgressBar value={xpPct} color="purple" size="md" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { icon: Flame, label: 'Current Streak', value: `${user?.streak || 0} 🔥`, sub: `Best: ${user?.longestStreak || 0}`, gradient: 'from-orange-900/30 to-red-900/30', border: 'border-orange-500/20' },
          { icon: Zap, label: 'Total XP', value: totalXP.toLocaleString(), sub: `Level ${level}`, gradient: 'from-purple-900/30 to-blue-900/30', border: 'border-purple-500/20' },
          { icon: Target, label: 'Tasks Done', value: totalTasks, sub: `${completedDays.length} days`, gradient: 'from-green-900/30 to-teal-900/30', border: 'border-green-500/20' },
          { icon: Trophy, label: 'Best Streak', value: `${user?.longestStreak || 0} 🏆`, sub: 'All time', gradient: 'from-yellow-900/30 to-orange-900/30', border: 'border-yellow-500/20' },
        ].map(({ icon: Icon, label, value, sub, gradient, border }) => (
          <div key={label} className={`glass-card bg-gradient-to-br ${gradient} ${border} text-center p-3 sm:p-4`}>
            <p className="text-xl sm:text-2xl font-black text-white">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            <p className="text-[10px] text-gray-600 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Streak Calendar */}
      <StreakCalendar allProgress={allProgress} />

      {/* Weekly XP Chart */}
      <div className="glass-card p-3 sm:p-4">
        <h2 className="font-bold text-white mb-4 text-sm">Weekly XP Earned</h2>
        <ResponsiveContainer width="100%" height={180}>
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

      {/* Day Heatmap */}
      <div className="glass-card p-3 sm:p-4">
        <h2 className="font-bold text-white mb-4 text-sm">60-Day Progress Map</h2>
        <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(2rem, 1fr))' }}>
          {Array.from({ length: 60 }, (_, i) => {
            const dayProgress = allProgress.find((p) => p.dayNumber === i + 1);
            const pct = dayProgress?.completionPercentage || 0;
            return (
              <div
                key={i}
                title={`Day ${i + 1}: ${pct}%`}
                className={`aspect-square rounded-md flex items-center justify-center text-[8px] font-bold transition-all
                  ${pct === 100 ? 'bg-green-500 text-white' : pct > 0 ? 'bg-blue-500/50 text-blue-300' : 'bg-white/5 text-gray-600'}`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-500" /> Completed</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-500/50" /> In Progress</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-white/5" /> Not Started</div>
        </div>
      </div>

      {/* Badges */}
      {(user?.badges || []).length > 0 && (
        <div className="glass-card p-3 sm:p-4">
          <h2 className="font-bold text-white mb-3 text-sm">🏅 Your Badges</h2>
          <div className="flex flex-wrap gap-2">
            {user.badges.map((b) => <BadgeCard key={b} badgeKey={b} />)}
          </div>
        </div>
      )}

      {/* Motivational footer */}
      {daysLeft > 0 && (
        <div className="glass-card bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/20 text-center py-4">
          <p className="text-2xl mb-1">💪</p>
          <p className="font-bold text-white text-sm">
            {daysLeft === 1 ? 'Last day! Give it everything!' : `${daysLeft} days left — you've got this!`}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {completedDays.length > 0
              ? `You've completed ${completedDays.length} days. Keep the streak alive! 🔥`
              : 'Start Day 1 today and build your streak!'}
          </p>
        </div>
      )}
    </div>
  );
}
