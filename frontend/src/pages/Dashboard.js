import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import DayCard from '../components/ui/DayCard';
import StatsBar from '../components/ui/StatsBar';
import Spinner from '../components/ui/Spinner';
import NextActionCard from '../components/ui/NextActionCard';
import { Search, Bell, ChevronDown, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { isUnlocked, getLevelName } from '../utils/constants';

const WEEK_THEMES = ['Foundations', 'Daily Life', 'Communication', 'Work & Career', 'Advanced Skills', 'Fluency', 'Mastery', 'Champion', 'Final Push'];

const STREAK_MESSAGES = ['Start your streak! 🌱', 'Keep it up! 🔥', '3 days strong! 💪', 'One week! ⚡', 'On fire! 🚀', 'Unstoppable! 👑'];

export default function Dashboard() {
  const { user } = useAuth();
  const [days, setDays] = useState([]);
  const [allProgress, setAllProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [collapsedWeeks, setCollapsedWeeks] = useState({});

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [daysRes, progressRes] = await Promise.all([api.get('/days'), api.get('/progress')]);
        if (cancelled) return;
        setDays(daysRes.data);
        setAllProgress(progressRes.data);
        const completedDays = progressRes.data.filter((p) => p.isCompleted).map((p) => p.dayNumber);
        const autoCollapsed = {};
        const weekNums = [...new Set(daysRes.data.map((d) => d.weekNumber))];
        weekNums.forEach((w) => {
          const weekDayNums = daysRes.data.filter((d) => d.weekNumber === w).map((d) => d.dayNumber);
          if (weekDayNums.every((n) => completedDays.includes(n))) autoCollapsed[w] = true;
        });
        setCollapsedWeeks(autoCollapsed);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
    return () => { cancelled = true; };
  }, []);

  const getProgress = (dayId) => allProgress.find((p) => p.day === dayId);
  const unlocked = (dayNum) => isUnlocked(dayNum, user);

  const completedCount = (user?.completedDays || []).length;
  const overallPct = Math.round((completedCount / 60) * 100);
  const streak = user?.streak || 0;
  const streakMsg = STREAK_MESSAGES[Math.min(streak, STREAK_MESSAGES.length - 1)];

  const filtered = days.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      `day ${d.dayNumber}`.includes(search.toLowerCase()) ||
      (WEEK_THEMES[d.weekNumber - 1] || '').toLowerCase().includes(search.toLowerCase());
    if (filter === 'completed') return matchSearch && (user?.completedDays || []).includes(d.dayNumber);
    if (filter === 'inprogress') return matchSearch && !((user?.completedDays || []).includes(d.dayNumber)) && unlocked(d.dayNumber);
    if (filter === 'locked') return matchSearch && !unlocked(d.dayNumber);
    return matchSearch;
  });

  const weeks = [...new Set(days.map((d) => d.weekNumber))].sort((a, b) => a - b);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size={40} /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      {/* ── HERO ── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-gray-950 border border-white/10 p-6">
        {/* background glow blobs */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-1">60-Day Challenge</p>
            <h1 className="text-3xl font-black text-white leading-tight">
              Hey {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-400 text-sm mt-1 mb-4">
              {completedCount === 0
                ? "Let's start your journey today!"
                : completedCount === 60
                ? "You've completed the full challenge! 🏆"
                : `Day ${completedCount + 1} of 60 — ${streakMsg}`}
            </p>

            {/* Progress arc row */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 bg-white/10 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
              <span className="text-sm font-black text-white shrink-0">{overallPct}%</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> {completedCount} done</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> {60 - completedCount} remaining</span>
            </div>
          </div>

          {/* Right side — streak + bell */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col items-center bg-orange-500/10 border border-orange-500/20 rounded-2xl px-4 py-3">
              <span className="text-3xl">{streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : '🌱'}</span>
              <span className="text-2xl font-black text-orange-400">{streak}</span>
              <span className="text-xs text-gray-500">streak</span>
            </div>
            <button
              onClick={() => {
                if ('Notification' in window && Notification.permission === 'granted') {
                  localStorage.setItem('lastNotified', '');
                  toast.success('Reminders enabled! 🔥');
                } else if ('Notification' in window) {
                  Notification.requestPermission().then((p) => {
                    if (p === 'granted') toast.success('Reminders enabled! 🔥');
                    else toast.error('Enable notifications in browser settings.');
                  });
                }
              }}
              className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-orange-500/20 hover:text-orange-400 transition-all"
              title="Enable daily reminders"
            >
              <Bell size={18} />
            </button>
          </div>
        </div>

        {/* Level badge row */}
        <div className="relative mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <span className="text-purple-400 font-black text-sm">Lv.{user?.level || 1}</span>
            <span className="text-xs text-gray-400">{getLevelName(user?.level || 1)}</span>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <span className="text-yellow-400 text-sm">⚡</span>
            <span className="text-yellow-400 font-black text-sm">{user?.xp || 0} XP</span>
          </div>
          {(user?.badges || []).length > 0 && (
            <div className="flex items-center gap-1 ml-auto">
              {(user.badges || []).slice(0, 3).map((b, i) => (
                <span key={i} className="text-lg">{b === 'first_day' ? '🌱' : b === 'week_warrior' ? '⚔️' : b === 'streak_7' ? '🔥' : '🏆'}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── NEXT ACTION ── */}
      {(() => {
        const nextDay = days.find((d) => !((user?.completedDays || []).includes(d.dayNumber)) && unlocked(d.dayNumber));
        const nextProgress = nextDay ? getProgress(nextDay._id) : null;
        return nextDay ? (
          <NextActionCard
            tone="orange"
            status={`Day ${nextDay.dayNumber} — Up Next`}
            title={nextDay.title}
            subtitle={`+${nextDay.totalXP} XP`}
            ctaLabel="Start Day"
            ctaHref={`/day/${nextDay.dayNumber}`}
            locked={false}
            completed={false}
            progress={nextProgress?.completionPercentage || 0}
          />
        ) : (
          <NextActionCard
            tone="green"
            status="All Done!"
            title="You've completed all 60 days 🎉"
            subtitle="Champion"
            ctaLabel="View Progress"
            ctaHref="/progress"
            locked={false}
            completed={true}
          />
        );
      })()}

      {/* ── STATS ── */}
      <StatsBar user={user} />

      {/* ── SEARCH & FILTER ── */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input placeholder="Search days, themes..." className="input-field pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'completed', 'inprogress', 'locked'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
              {f === 'inprogress' ? 'In Progress' : f}
            </button>
          ))}
        </div>
      </div>

      {/* ── DAYS ── */}
      {search || filter !== 'all' ? (
        <div>
          <p className="text-sm text-gray-500 mb-4">{filtered.length} days found</p>
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-400 font-semibold">No days match your search</p>
              <p className="text-gray-600 text-sm mt-1">Try a different filter or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map((day) => (
                <DayCard key={day._id} day={day} progress={getProgress(day._id)} isUnlocked={unlocked(day.dayNumber)} isCompleted={(user?.completedDays || []).includes(day.dayNumber)} />
              ))}
            </div>
          )}
        </div>
      ) : (
        weeks.map((week) => {
          const weekDays = days.filter((d) => d.weekNumber === week);
          const weekDone = weekDays.filter((d) => (user?.completedDays || []).includes(d.dayNumber)).length;
          const weekPct = Math.round((weekDone / weekDays.length) * 100);
          const isCollapsed = !!collapsedWeeks[week];
          const isWeekComplete = weekDone === weekDays.length;

          return (
            <div key={week}>
              <button
                onClick={() => setCollapsedWeeks((prev) => ({ ...prev, [week]: !prev[week] }))}
                className="flex items-center gap-3 mb-3 w-full text-left group"
              >
                {isCollapsed ? <ChevronRight size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                <h2 className="font-bold text-white">Week {week}</h2>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">{WEEK_THEMES[week - 1] || 'Advanced'}</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-white/5 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${isWeekComplete ? 'bg-green-400' : 'bg-blue-500'}`}
                      style={{ width: `${weekPct}%` }}
                    />
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${isWeekComplete ? 'text-green-400 bg-green-500/10' : 'text-gray-500'}`}>
                  {isWeekComplete ? '✅ ' : ''}{weekDone}/{weekDays.length}
                </span>
              </button>
              {!isCollapsed && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-2">
                  {weekDays.map((day) => (
                    <DayCard key={day._id} day={day} progress={getProgress(day._id)} isUnlocked={unlocked(day.dayNumber)} isCompleted={(user?.completedDays || []).includes(day.dayNumber)} />
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
