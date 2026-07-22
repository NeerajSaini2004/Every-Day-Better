import React from 'react';

export default function ProgressRing({
  value = 0,
  label,
  sublabel,
  size = 92,
  stroke = 10,
  tone = 'blue',
}) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamped / 100) * circumference;

  const toneMap = {
    blue: {
      ring: 'stroke-blue-400',
      glow: 'drop-shadow-[0_0_10px_rgba(59,130,246,0.55)]',
      text: 'text-blue-200',
      accent: 'text-blue-400',
    },
    purple: {
      ring: 'stroke-purple-400',
      glow: 'drop-shadow-[0_0_10px_rgba(139,92,246,0.55)]',
      text: 'text-purple-200',
      accent: 'text-purple-400',
    },
    emerald: {
      ring: 'stroke-emerald-300',
      glow: 'drop-shadow-[0_0_10px_rgba(16,185,129,0.45)]',
      text: 'text-emerald-100',
      accent: 'text-emerald-300',
    },
    amber: {
      ring: 'stroke-amber-300',
      glow: 'drop-shadow-[0_0_10px_rgba(245,158,11,0.45)]',
      text: 'text-amber-100',
      accent: 'text-amber-300',
    },
  };

  const t = toneMap[tone] || toneMap.blue;

  return (
    <div className="flex items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={stroke}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={stroke}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference - dash}
            className={`${t.ring} ${t.glow} transition-all duration-1000`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ willChange: 'stroke-dashoffset' }}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`font-black text-sm ${t.text}`}>{clamped}%</div>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        {label ? <div className="text-xs font-semibold text-gray-400">{label}</div> : null}
        {sublabel ? <div className={`text-sm font-black ${t.accent}`}>{sublabel}</div> : null}
      </div>
    </div>
  );
}

