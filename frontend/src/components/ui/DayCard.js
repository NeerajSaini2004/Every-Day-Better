import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import { Lock, CheckCircle, Star } from 'lucide-react';

export default function DayCard({ day, progress, isUnlocked, isCompleted }) {
  const pct = progress?.completionPercentage || 0;

  return (
    <Link
      to={isUnlocked ? `/day/${day.dayNumber}` : '#'}
      className={`glass-card relative flex flex-col gap-3 hover:border-blue-500/50 transition-all duration-300 group ${!isUnlocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10'}`}
    >
      {/* Status badge */}
      <div className="absolute top-3 right-3">
        {isCompleted ? (
          <CheckCircle size={20} className="text-green-400" />
        ) : !isUnlocked ? (
          <Lock size={16} className="text-gray-500" />
        ) : null}
      </div>

      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${isCompleted ? 'bg-green-500/20 text-green-400' : isUnlocked ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-500'}`}>
          {day.dayNumber}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-medium">Day {day.dayNumber}</p>
          <h3 className="font-semibold text-sm text-white truncate">{day.title}</h3>
        </div>
      </div>

      <ProgressBar value={pct} color={isCompleted ? 'green' : 'blue'} size="sm" />

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{pct}% done</span>
        <div className="flex items-center gap-1 text-yellow-400">
          <Star size={11} />
          <span>{day.totalXP} XP</span>
        </div>
      </div>
    </Link>
  );
}
