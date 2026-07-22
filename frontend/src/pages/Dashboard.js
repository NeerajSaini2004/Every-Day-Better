import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import DayCard from '../components/ui/DayCard';
import StatsBar from '../components/ui/StatsBar';
import Spinner from '../components/ui/Spinner';
import NextActionCard from '../components/ui/NextActionCard';
import { Search, Bell, Zap } from 'lucide-react';


const WEEK_THEMES = ['Foundations', 'Daily Life', 'Communication', 'Work & Career', 'Advanced Skills', 'Fluency', 'Mastery', 'Champion', 'Final Push'];

export default function Dashboard() {
  const { user } = useAuth();
  const [days, setDays] = useState([]);
  const [allProgress, setAllProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const [daysRes, progressRes] = await Promise.all([api.get('/days'), api.get('/progress')]);
        setDays(daysRes.data);
        setAllProgress(progressRes.data);
      } finally {
        setLoading(false);
      }
    };
    load();
    // Daily reminder — only once per day
    const today = new Date().toDateString();
    const lastNotified = localStorage.getItem('lastNotified');
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    } else if ('Notification' in window && Notification.permission === 'granted' && lastNotified !== today) {
      localStorage.setItem('lastNotified', today);
      new Notification('Every Day Better 📚', {
        body: `Hey ${user?.name?.split(' ')[0]}! Time for your daily English practice. Keep your streak alive! 🔥`,
        icon: '/favicon.ico',
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getProgress = (dayId) => allProgress.find((p) => p.day === dayId);
  const isUnlocked = (dayNum) => user?.role === 'admin' || dayNum === 1 || (user?.completedDays || []).includes(dayNum - 1) || dayNum <= ((user?.completedDays || []).length + 1);

  const filtered = days.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || `day ${d.dayNumber}`.includes(search.toLowerCase());
    if (filter === 'completed') return matchSearch && (user?.completedDays || []).includes(d.dayNumber);
    if (filter === 'inprogress') return matchSearch && !((user?.completedDays || []).includes(d.dayNumber)) && isUnlocked(d.dayNumber);
    if (filter === 'locked') return matchSearch && !isUnlocked(d.dayNumber);
    return matchSearch;
  });

  const weeks = [...new Set(days.map((d) => d.weekNumber))].sort((a, b) => a - b);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size={40} /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">
              Hey {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-400 text-sm mt-1">Keep going! You're on day {(user?.completedDays || []).length + 1} of 60</p>
          </div>
          <button
            onClick={() => {
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Every Day Better 📚', { body: 'Daily reminder set! We\'ll keep you on track. 🔥', icon: '/favicon.ico' });
              } else if ('Notification' in window) {
                Notification.requestPermission();
              }
            }}
            className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-all"
            title="Enable daily reminders"
          >
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Next Action */}
      <NextActionCard
        tone="orange"
        status="Daily Challenge"
        title="Answer today's question"
        subtitle="+15 XP"
        ctaLabel="Open Challenge"
        ctaHref="/daily-challenge"
        locked={false}
        completed={false}
      />


      {/* Stats */}
      <StatsBar user={user} />

      {/* Search & Filter */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input placeholder="Search days..." className="input-field pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['all', 'completed', 'inprogress', 'locked'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
              {f === 'inprogress' ? 'In Progress' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Days by Week */}
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
                <DayCard key={day._id} day={day} progress={getProgress(day._id)} isUnlocked={isUnlocked(day.dayNumber)} isCompleted={(user?.completedDays || []).includes(day.dayNumber)} />
              ))}
            </div>
          )}
        </div>
      ) : (
        weeks.map((week) => {
          const weekDays = days.filter((d) => d.weekNumber === week);
          return (
            <div key={week}>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="font-bold text-white">Week {week}</h2>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">{WEEK_THEMES[week - 1] || 'Advanced'}</span>
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs text-gray-500">{weekDays.filter((d) => (user?.completedDays || []).includes(d.dayNumber)).length}/{weekDays.length} done</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {weekDays.map((day) => (
                  <DayCard key={day._id} day={day} progress={getProgress(day._id)} isUnlocked={isUnlocked(day.dayNumber)} isCompleted={(user?.completedDays || []).includes(day.dayNumber)} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
