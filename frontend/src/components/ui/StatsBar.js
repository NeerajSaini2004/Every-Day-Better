import React from 'react';
import { Flame, Zap, Trophy, Target } from 'lucide-react';
import { getLevelName, getXPProgress } from '../../utils/constants';

export default function StatsBar({ user }) {
  const levelProgress = getXPProgress(user.xp || 0, user.level || 1);
  const xpInLevel = (user.xp || 0) - ((user.level - 1 || 0) * 500);

  const stats = [
    {
      icon: <Flame size={22} className="text-orange-400" />,
      value: user.streak || 0,
      label: 'Day Streak',
      bg: 'from-orange-500/20 to-red-500/10',
      border: 'border-orange-500/20',
      valueColor: 'text-orange-400',
      pulse: (user.streak || 0) > 0,
    },
    {
      icon: <Zap size={22} className="text-yellow-400" />,
      value: user.xp || 0,
      label: 'Total XP',
      bg: 'from-yellow-500/20 to-orange-500/10',
      border: 'border-yellow-500/20',
      valueColor: 'text-yellow-400',
    },
    {
      icon: <Trophy size={22} className="text-purple-400" />,
      value: `Lv.${user.level || 1}`,
      label: getLevelName(user.level || 1),
      bg: 'from-purple-500/20 to-blue-500/10',
      border: 'border-purple-500/20',
      valueColor: 'text-purple-400',
    },
    {
      icon: <Target size={22} className="text-green-400" />,
      value: (user.completedDays || []).length,
      label: 'Days Done',
      bg: 'from-green-500/20 to-teal-500/10',
      border: 'border-green-500/20',
      valueColor: 'text-green-400',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className={`relative rounded-2xl border bg-gradient-to-br ${s.bg} ${s.border} p-4 flex items-center gap-3 overflow-hidden`}>
            {s.pulse && (
              <span className="absolute inset-0 rounded-2xl border border-orange-400/30 animate-pulse pointer-events-none" />
            )}
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className={`text-2xl font-black ${s.valueColor}`}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* XP Level bar */}
      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-blue-500/5 p-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-purple-300 font-semibold">Level {user.level || 1} — {getLevelName(user.level || 1)}</span>
          <span className="text-gray-400">{Math.max(xpInLevel, 0)} / 500 XP</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 transition-all duration-700"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1.5">{500 - Math.max(xpInLevel, 0)} XP to Level {(user.level || 1) + 1}</p>
      </div>
    </div>
  );
}
