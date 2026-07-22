import React from 'react';
import { ArrowRight, CheckCircle2, Lock, Zap } from 'lucide-react';

export default function NextActionCard({
  title,
  subtitle,
  status,
  locked,
  completed,
  ctaLabel,
  onCta,
  ctaHref,
  tone = 'blue',
}) {
  const toneMap = {
    blue: {
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/5',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      ctaBg: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30',
    },
    green: {
      border: 'border-green-500/30',
      bg: 'bg-green-500/5',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400',
      ctaBg: 'bg-green-500/20 text-green-400 hover:bg-green-500/30',
    },
    orange: {
      border: 'border-orange-500/30',
      bg: 'bg-orange-500/5',
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-400',
      ctaBg: 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30',
    },
    purple: {
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/5',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      ctaBg: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30',
    },
  };

  const t = toneMap[tone] || toneMap.blue;

  const StatusIcon = () => {
    if (completed) return <CheckCircle2 size={18} className="text-green-400" />;
    if (locked) return <Lock size={18} className="text-gray-500" />;
    return <Zap size={18} className={t.iconColor} />;
  };

  const CtaButton = () => {
    const className = `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${t.ctaBg} flex items-center gap-2 ${locked ? 'opacity-50 cursor-not-allowed' : ''}`;

    if (ctaHref) {
      return (
        <a
          href={locked ? undefined : ctaHref}
          onClick={(e) => {
            if (locked) e.preventDefault();
          }}
          className={className}
        >
          {ctaLabel}
          <ArrowRight size={16} />
        </a>
      );
    }

    return (
      <button
        type="button"
        disabled={locked}
        onClick={() => {
          if (!locked) onCta?.();
        }}
        className={className}
      >
        {ctaLabel}
        <ArrowRight size={16} />
      </button>
    );
  };

  return (
    <div className={`glass-card ${t.border} ${t.bg} p-4 sm:p-5`}> 
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.iconBg}`}>
          <StatusIcon />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-gray-400 font-semibold">{status}</p>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">{title}</h3>
            </div>
            <span className="shrink-0 text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">
              {subtitle}
            </span>
          </div>
          <div className="mt-3">
            <CtaButton />
          </div>
        </div>
      </div>
    </div>
  );
}

