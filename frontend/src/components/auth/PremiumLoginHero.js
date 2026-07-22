import React from 'react';
import { Flame, Star, Trophy, Mic, Zap } from 'lucide-react';
import ProgressRing from './ProgressRing';

function ParticleLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-10 left-10 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl animate-pulse-slow" />

      {/* Subtle drifting particles */}
      {Array.from({ length: 18 }).map((_, i) => {
        const left = (i * 7) % 100;
        const top = (i * 13) % 100;
        const delay = (i % 6) * 0.6;
        const size = 6 + (i % 5);
        const opacity = 0.18 + (i % 4) * 0.06;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              opacity,
              filter: 'blur(0.2px)',
              animation: `floaty ${10 + (i % 7)}s linear ${delay}s infinite`,
            }}
          />
        );
      })}

      <style>{`
        @keyframes floaty {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(14px, -18px, 0); }
          100% { transform: translate3d(-6px, -10px, 0); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: translateZ(0) scale(1); opacity: .9; }
          50% { transform: translateZ(0) scale(1.06); opacity: 1; }
        }
        .animate-pulse-slow { animation: pulse-slow 6.8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function AchievementCard({ icon, label, value, tone = 'blue', delay = 0 }) {
  const cls =
    tone === 'amber'
      ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
      : tone === 'purple'
        ? 'border-purple-500/30 bg-purple-500/10 text-purple-200'
        : tone === 'emerald'
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
          : 'border-blue-500/30 bg-blue-500/10 text-blue-200';

  return (
    <div
      className={`glass-card ${cls} border rounded-2xl p-4 backdrop-blur-md`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <div className="text-[11px] font-semibold text-gray-400">{label}</div>
          <div className="text-lg font-black">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default function PremiumLoginHero() {
  return (
    <div className="relative h-full overflow-hidden hidden lg:block">
      <ParticleLayer />

      <div className="relative h-full px-8 py-12">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-blue-200">
            <Flame size={14} className="text-orange-300" />
            60-Day English Challenge
          </div>

          <h2 className="mt-6 text-4xl xl:text-5xl font-black leading-[1.05] tracking-tight text-white">
            Become Fluent in English in Just <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-300 bg-clip-text text-transparent">60 Days</span>
          </h2>
          <p className="mt-4 text-gray-400 text-base leading-relaxed max-w-lg">
            Practice every day, build streaks, earn XP, and speak with confidence.
          </p>

          {/* Animated progress + badges */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <div className="glass-card rounded-3xl p-4 border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-xs font-semibold text-gray-400">Today’s Momentum</div>
                    <div className="mt-1 flex items-center gap-3">
                      <div className="text-2xl font-black">Day 24</div>
                      <div className="badge border border-white/10 bg-white/5">🔥 24 Day Streak</div>
                    </div>
                    <div className="mt-2 text-sm text-gray-300">
                      Your practice is compounding.
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <ProgressRing value={92} label="Completion" sublabel="92%" tone="purple" />
                  </div>
                </div>
                <div className="mt-4 sm:hidden">
                  <ProgressRing value={92} label="Completion" sublabel="92%" tone="purple" />
                </div>
              </div>
            </div>

            <AchievementCard
              icon={<Zap size={18} className="text-blue-300" />}
              label="XP Earned"
              value="3200 XP"
              tone="purple"
              delay={0.1}
            />
            <AchievementCard
              icon={<Trophy size={18} className="text-amber-300" />}
              label="Level"
              value="Level 8 Speaker"
              tone="amber"
              delay={0.25}
            />
            <AchievementCard
              icon={<Star size={18} className="text-emerald-300" />}
              label="Completion"
              value="92%"
              tone="emerald"
              delay={0.35}
            />
            <AchievementCard
              icon={<Mic size={18} className="text-purple-300" />}
              label="Speaking Score"
              value="87%"
              tone="purple"
              delay={0.5}
            />
          </div>

          {/* Testimonials */}
          <div className="mt-8">
            <div className="flex items-center gap-2 text-yellow-300 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>★★★★★</span>
              ))}
            </div>
            <div className="glass-card rounded-3xl p-5">
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                “I finally started speaking English confidently.”
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  — Rahul, Software Engineer
                </div>
                <div className="text-xs font-semibold text-blue-300">
                  60/60 Challenge Ready
                </div>
              </div>
            </div>
          </div>

          {/* Bottom trust stats */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="glass-card rounded-2xl p-4">
              <div className="text-2xl font-black">10,000+</div>
              <div className="text-xs text-gray-500 mt-1">learners</div>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <div className="text-2xl font-black">4.9</div>
              <div className="text-xs text-gray-500 mt-1">rating</div>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <div className="text-2xl font-black">1M+</div>
              <div className="text-xs text-gray-500 mt-1">practice sessions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

