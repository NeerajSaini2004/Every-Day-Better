import React from 'react';

export default function ProgressBar({ value, color = 'blue', size = 'md', showLabel = false }) {
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  const colors = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-400',
    green: 'bg-gradient-to-r from-green-500 to-green-400',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-400',
    orange: 'bg-gradient-to-r from-orange-500 to-yellow-400',
  };
  return (
    <div className="w-full">
      {showLabel && <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Progress</span><span>{Math.round(value)}%</span></div>}
      <div className={`w-full bg-white/10 rounded-full overflow-hidden ${heights[size]}`}>
        <div className={`${heights[size]} ${colors[color] || colors.blue} rounded-full transition-all duration-700`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}
