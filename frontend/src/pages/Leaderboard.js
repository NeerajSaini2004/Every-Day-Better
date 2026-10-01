import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import { Flame, Zap, Calendar } from 'lucide-react';
import { getLevelName } from '../utils/constants';

const AVATAR_GRADIENTS = [
  'from-blue-500 to-purple-600',
  'from-green-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-pink-500 to-rose-600',
  'from-yellow-500 to-orange-600',
  'from-indigo-500 to-blue-600',
  'from-teal-500 to-cyan-600',
  'from-purple-500 to-pink-600',
];

const getGradient = (name) => AVATAR_GRADIENTS[(name?.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length];

const RANK_CONFIG = [
  { bg: 'bg-yellow-500/20', text: 'text-yellow-400', medal: '🥇' },
  { bg: 'bg-gray-400/20', text: 'text-gray-300', medal: '🥈' },
  { bg: 'bg-orange-500/20', text: 'text-orange-400', medal: '🥉' },
];

const weeklyChallenge = {
  title: 'Speak for 10 Minutes Total',
  desc: 'Complete all speaking tasks this week. Every participant earns a bonus 50 XP!',
  ends: 'Ends Sunday',
  icon: '🎤',
  participants: 128,
};

function UserRow({ u, rank, isMe, tab }) {
  const cfg = RANK_CONFIG[rank] || { bg: 'bg-white/5', text: 'text-gray-500', medal: null };
  const value = tab === 'xp' ? `${u.xp} XP` : tab === 'streak' ? `${u.streak} 🔥` : `${(u.completedDays || []).length} days`;
  const valueColor = tab === 'xp' ? 'text-purple-400' : tab === 'streak' ? 'text-orange-400' : 'text-green-400';

  return (
    <div className={`glass-card flex items-center gap-3 transition-all ${isMe ? 'border-blue-500/40 bg-blue-500/5' : ''}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${cfg.bg} ${cfg.text}`}>
        {cfg.medal || rank + 1}
      </div>
      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getGradient(u.name)} flex items-center justify-center font-bold text-sm shrink-0`}>
        {u.name?.[0]?.toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm truncate">
          {u.name} {isMe && <span className="text-blue-400 text-xs">(You)</span>}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="text-purple-400 font-medium">{getLevelName(u.level || 1)}</span>
          <span>·</span>
          <span className="flex items-center gap-0.5"><Flame size={10} className="text-orange-400" /> {u.streak}</span>
          <span>·</span>
          <span>{(u.completedDays || []).length} days</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className={`font-black text-sm ${valueColor}`}>{value}</p>
        <p className="text-xs text-gray-600">Lv.{u.level || 1}</p>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('xp');

  useEffect(() => {
    api.get('/users/leaderboard').then((r) => { setUsers(r.data); setLoading(false); });
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size={40} /></div>;

  const sortedByXP = [...users].sort((a, b) => b.xp - a.xp);
  const sortedByStreak = [...users].sort((a, b) => b.streak - a.streak);
  const sortedByDays = [...users].sort((a, b) => (b.completedDays?.length || 0) - (a.completedDays?.length || 0));

  const listMap = { xp: sortedByXP, streak: sortedByStreak, days: sortedByDays };
  const list = listMap[tab];

  const myRankXP = sortedByXP.findIndex((u) => u._id === user?.id) + 1;
  const myRankStreak = sortedByStreak.findIndex((u) => u._id === user?.id) + 1;
  const myRankDays = sortedByDays.findIndex((u) => u._id === user?.id) + 1;
  const myRankMap = { xp: myRankXP, streak: myRankStreak, days: myRankDays };

  const tabs = [
    { key: 'xp', label: '⚡ XP', icon: Zap },
    { key: 'streak', label: '🔥 Streak', icon: Flame },
    { key: 'days', label: '📅 Days', icon: Calendar },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-black text-white">Leaderboard 🏆</h1>
        <p className="text-gray-400 text-sm mt-1">Top English learners this month</p>
      </div>

      {/* Weekly Challenge */}
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

      {/* Your Rank Card */}
      {myRankXP > 0 && (
        <div className="glass-card bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20">
          <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-widest">Your Rankings</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'XP Rank', rank: myRankXP, color: 'text-purple-400', icon: '⚡' },
              { label: 'Streak Rank', rank: myRankStreak, color: 'text-orange-400', icon: '🔥' },
              { label: 'Days Rank', rank: myRankDays, color: 'text-green-400', icon: '📅' },
            ].map(({ label, rank, color, icon }) => (
              <div key={label} className="text-center">
                <p className={`text-2xl font-black ${color}`}>#{rank}</p>
                <p className="text-xs text-gray-500 mt-0.5">{icon} {label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3">
        {[list[1], list[0], list[2]].map((u, podiumIdx) => {
          if (!u) return <div key={podiumIdx} />;
          const realRank = podiumIdx === 0 ? 1 : podiumIdx === 1 ? 0 : 2;
          const medals = ['🥈', '🥇', '🥉'];
          const isMe = u._id === user?.id;
          return (
            <div key={u._id} className={`glass-card text-center ${isMe ? 'border-blue-500/40' : ''} ${realRank === 0 ? 'border-yellow-500/30 bg-yellow-500/5' : ''}`}>
              <div className="text-2xl mb-1">{medals[podiumIdx]}</div>
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getGradient(u.name)} flex items-center justify-center font-bold mx-auto mb-1`}>
                {u.name?.[0]?.toUpperCase()}
              </div>
              <p className="font-semibold text-white text-xs truncate">{u.name}</p>
              <p className="text-[10px] text-gray-500">{getLevelName(u.level || 1)}</p>
              {tab === 'xp' && <p className="text-xs text-purple-400 font-bold mt-1">{u.xp} XP</p>}
              {tab === 'streak' && <p className="text-xs text-orange-400 font-bold mt-1">{u.streak} 🔥</p>}
              {tab === 'days' && <p className="text-xs text-green-400 font-bold mt-1">{(u.completedDays || []).length} days</p>}
            </div>
          );
        })}
      </div>

      {/* Full List */}
      <div className="space-y-2">
        {list.map((u, i) => (
          <UserRow key={u._id} u={u} rank={i} isMe={u._id === user?.id} tab={tab} />
        ))}
      </div>

      {/* Sticky your position if not in top 10 */}
      {myRankMap[tab] > 10 && (
        <div className="sticky bottom-4">
          <div className="glass-card bg-blue-900/60 border-blue-500/40 backdrop-blur-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/30 text-blue-400 flex items-center justify-center font-black text-sm">
              #{myRankMap[tab]}
            </div>
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getGradient(user?.name)} flex items-center justify-center font-bold text-sm shrink-0`}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">{user?.name} <span className="text-blue-400 text-xs">(You)</span></p>
              <p className="text-xs text-gray-400">{getLevelName(user?.level || 1)} · Keep climbing! 🚀</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
