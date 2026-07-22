import React from 'react';
import { Flame, Zap, Trophy, Target } from 'lucide-react';
import { getLevelName, getXPProgress } from '../../utils/constants';
import ProgressBar from './ProgressBar';

export default function StatsBar({ user }) {
  const levelProgress = getXPProgress(user.xp || 0, user.level || 1);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="glass-card flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
          <Flame size={20} className="text-orange-400" />
        </div>
        <div>
          <p className="text-2xl font-black text-white">{user.streak || 0}</p>
          <p className="text-xs text-gray-500">Day Streak</p>
        </div>
      </div>
      <div className="glass-card flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <Zap size={20} className="text-purple-400" />
        </div>
        <div>
          <p className="text-2xl font-black text-white">{user.xp || 0}</p>
          <p className="text-xs text-gray-500">Total XP</p>
        </div>
      </div>
      <div className="glass-card flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <Trophy size={20} className="text-blue-400" />
        </div>
        <div>
          <p className="text-2xl font-black text-white">Lv.{user.level || 1}</p>
          <p className="text-xs text-gray-500">{getLevelName(user.level || 1)}</p>
        </div>
      </div>
      <div className="glass-card flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
          <Target size={20} className="text-green-400" />
        </div>
        <div>
          <p className="text-2xl font-black text-white">{(user.completedDays || []).length}</p>
          <p className="text-xs text-gray-500">Days Done</p>
        </div>
      </div>
      <div className="col-span-2 md:col-span-4 glass-card">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Level {user.level || 1} — {getLevelName(user.level || 1)}</span>
          <span>{user.xp || 0} / {(user.level || 1) * 500} XP</span>
        </div>
        <ProgressBar value={levelProgress} color="purple" size="md" />
      </div>
    </div>
  );
}
