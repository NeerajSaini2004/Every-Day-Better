import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import { Flame } from 'lucide-react';

const weeklyChallenge = {
  title: 'Speak for 10 Minutes Total',
  desc: 'Complete all speaking tasks this week. Every participant earns a bonus 50 XP!',
  ends: 'Ends Sunday',
  icon: '🎤',
  participants: 128,
};

export default function Leaderboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('xp');

  useEffect(() => {
    api.get('/users/leaderboard').then((r) => { setUsers(r.data); setLoading(false); });
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size={40} /></div>;

  const myRank = users.findIndex((u) => u._id === user?.id) + 1;
  const sortedByStreak = [...users].sort((a, b) => b.streak - a.streak);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Leaderboard 🏆</h1>
        <p className="text-gray-400 text-sm mt-1">Top English learners this month</p>
      </div>

      {/* Community Challenge */}
      <div className="glass-card bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/20">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{weeklyChallenge.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full">Weekly Challenge</span>
              <span className="text-xs text-gray-500">{weeklyChallenge.ends}</span>
            </div>
            <h3 className="font-bold text-white">{weeklyChallenge.title}</h3>
            <p className="text-xs text-gray-400 mt-1">{weeklyChallenge.desc}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span>👥 {weeklyChallenge.participants} participants</span>
              <span className="text-yellow-400 font-bold">+50 XP bonus</span>
            </div>
          </div>
        </div>
      </div>

      {myRank > 0 && (
        <div className="glass-card bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20 flex items-center gap-4">
          <div>
            <p className="text-xs text-gray-400">Your XP Rank</p>
            <p className="text-3xl font-black text-white">#{myRank}</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <p className="text-xs text-gray-400">Your Streak Rank</p>
            <p className="text-3xl font-black text-white">#{sortedByStreak.findIndex((u) => u._id === user?.id) + 1}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[{ key: 'xp', label: '⚡ XP Board' }, { key: 'streak', label: '🔥 Streak Board' }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Top 3 */}
      {(() => {
        const list = tab === 'xp' ? users : sortedByStreak;
        return (
          <>
            <div className="grid grid-cols-3 gap-3">
              {list.slice(0, 3).map((u, i) => (
                <div key={u._id} className={`glass-card text-center ${i === 0 ? 'border-yellow-500/30 bg-yellow-500/5' : i === 1 ? 'border-gray-400/30' : 'border-orange-500/30'}`}>
                  <div className="text-2xl mb-1">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold mx-auto mb-2">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <p className="font-semibold text-white text-xs truncate">{u.name}</p>
                  {tab === 'xp'
                    ? <p className="text-xs text-purple-400 font-bold">{u.xp} XP</p>
                    : <p className="text-xs text-orange-400 font-bold">{u.streak} 🔥</p>
                  }
                </div>
              ))}
            </div>

            {/* Full List */}
            <div className="space-y-2">
              {list.map((u, i) => (
                <div key={u._id} className={`glass-card flex items-center gap-3 transition-all ${u._id === user?.id ? 'border-blue-500/40 bg-blue-500/5' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${i === 0 ? 'bg-yellow-500/20 text-yellow-400' : i === 1 ? 'bg-gray-400/20 text-gray-300' : i === 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-gray-500'}`}>
                    {i + 1}
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">
                      {u.name} {u._id === user?.id && <span className="text-blue-400 text-xs">(You)</span>}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-0.5"><Flame size={10} className="text-orange-400" /> {u.streak} streak</span>
                      <span>{(u.completedDays || []).length} days</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-purple-400 text-sm">{u.xp} XP</p>
                    <p className="text-xs text-gray-500">Lv.{u.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      })()}
    </div>
  );
}
