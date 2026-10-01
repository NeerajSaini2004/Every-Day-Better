import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, CheckCircle, Play, Star } from 'lucide-react';

export default function DayCard({ day, progress, isUnlocked, isCompleted }) {
  const pct = progress?.completionPercentage || 0;
  const isActive = isUnlocked && !isCompleted;
  const isCurrent = isActive && pct === 0;

  return (
    <Link
      to={isUnlocked ? `/day/${day.dayNumber}` : '#'}
      onClick={(e) => !isUnlocked && e.preventDefault()}
      className={`relative flex flex-col gap-2 rounded-2xl p-3 border transition-all duration-300 group
        ${isCompleted
          ? 'bg-green-500/10 border-green-500/30 hover:border-green-400/60 hover:shadow-lg hover:shadow-green-500/10'
          : isActive
          ? 'bg-blue-500/10 border-blue-500/30 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/15 hover:scale-[1.03]'
          : 'bg-white/3 border-white/5 opacity-45 cursor-not-allowed'
        }`}
    >
      {/* Current day pulse ring */}
      {isCurrent && (
        <span className="absolute inset-0 rounded-2xl border-2 border-blue-400/50 animate-pulse pointer-events-none" />
      )}

      {/* Top row — day number + status icon */}
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0
          ${isCompleted ? 'bg-green-500/25 text-green-400' : isActive ? 'bg-blue-500/25 text-blue-400' : 'bg-gray-700/50 text-gray-600'}`}
        >
          {isCompleted ? <CheckCircle size={16} /> : day.dayNumber}
        </div>
        {isCompleted
          ? <span className="text-xs text-green-400 font-bold">Done</span>
          : !isUnlocked
          ? <Lock size={13} className="text-gray-600" />
          : isCurrent
          ? <Play size={13} className="text-blue-400" />
          : <span className="text-xs text-blue-400 font-semibold">{pct}%</span>
        }
      </div>

      {/* Title */}
      <div>
        <p className="text-xs text-gray-500">Day {day.dayNumber}</p>
        <h3 className={`font-bold text-xs leading-tight line-clamp-2 ${isCompleted ? 'text-green-300' : isActive ? 'text-white' : 'text-gray-600'}`}>
          {day.title}
        </h3>
      </div>

      {/* Progress bar — only show if started */}
      {isUnlocked && pct > 0 && (
        <div className="w-full bg-white/10 rounded-full h-1">
          <div
            className={`h-1 rounded-full transition-all ${isCompleted ? 'bg-green-400' : 'bg-blue-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* XP */}
      <div className="flex items-center gap-1 text-yellow-400/70 mt-auto">
        <Star size={10} />
        <span className="text-xs">{day.totalXP} XP</span>
      </div>
    </Link>
  );
}
