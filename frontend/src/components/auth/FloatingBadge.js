import React from 'react';

export default function FloatingBadge({
  icon,
  title,
  tone = 'blue',
  className = '',
  animateClass = 'animate-fade-in',
}) {
  const toneMap = {
    blue: 'border-blue-500/30 bg-blue-500/10 text-blue-200',
    purple: 'border-purple-500/30 bg-purple-500/10 text-purple-200',
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  };

  return (
    <div
      className={`glass-card ${toneMap[tone] || toneMap.blue} ${animateClass} ${className} shadow-lg shadow-black/20`}
      aria-label={title}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10">
          <span className="text-xl">{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-gray-400">{title}</p>
          <p className="text-sm font-black">Unlocked</p>
        </div>
      </div>
    </div>
  );
}

