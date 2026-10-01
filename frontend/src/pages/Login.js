import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Flame, Zap, Star, BookOpen, Mic, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const perks = [
  { icon: <BookOpen size={18} />, text: '600+ vocabulary words with Hindi meanings' },
  { icon: <Mic size={18} />, text: 'Voice recording & speaking practice' },
  { icon: <Zap size={18} />, text: 'XP system, streaks & achievement badges' },
  { icon: <Trophy size={18} />, text: 'Leaderboard & 60-day completion certificate' },
];

const stats = [
  { value: '60', label: 'Days' },
  { value: '360+', label: 'Tasks' },
  { value: '10K+', label: 'Learners' },
];

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const ok = await login(form.email, form.password);
    if (ok) navigate('/dashboard');
    else setError('Invalid email or password.');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">

      {/* ── LEFT PANEL (desktop only) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-gray-950 to-purple-900/60" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3 mb-16">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-xl">📘</span>
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Every Day Better
            </span>
          </Link>

          {/* Headline */}
          <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4">
            Master English<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              in 60 Days
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Daily tasks designed for Indian students — vocabulary, grammar, speaking & more.
          </p>

          {/* Perks */}
          <ul className="space-y-4 mb-12">
            {perks.map((p, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300">
                <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  {p.icon}
                </span>
                <span className="text-sm">{p.text}</span>
              </li>
            ))}
          </ul>

          {/* Stats */}
          <div className="flex gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black text-white">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 glass rounded-2xl p-5 border border-white/10">
          <div className="flex gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
          </div>
          <p className="text-sm text-gray-300 italic mb-3">
            "After 30 days, I gave my first English interview confidently. This app changed my life!"
          </p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">R</div>
            <div>
              <p className="text-xs font-semibold text-white">Rahul Sharma</p>
              <p className="text-xs text-gray-500">Job Seeker, Delhi</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Mobile background glows */}
        <div className="lg:hidden absolute -top-32 -left-32 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="lg:hidden absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 mb-4 shadow-lg shadow-blue-500/25">
              <span className="text-2xl">📘</span>
            </div>
            <h1 className="text-2xl font-black text-white">Every Day Better</h1>
            <p className="text-gray-400 text-sm mt-1">Your 60-day English journey</p>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white mb-1">Welcome back 👋</h2>
            <p className="text-gray-400 text-sm">Continue your English learning journey</p>
          </div>

          {/* Streak badge */}
          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-2 mb-6 w-fit">
            <Flame size={14} className="text-orange-400" />
            <span className="text-xs font-semibold text-orange-300">60-Day English Challenge</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!form.email || !form.password || loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
            >
              {loading ? 'Signing in...' : 'Continue Learning →'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition">
              Sign up free
            </Link>
          </p>

          <p className="text-center text-xs text-gray-600 mt-6">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-gray-500 hover:text-gray-400 transition">Terms</a> &amp;{' '}
            <a href="/privacy" className="text-gray-500 hover:text-gray-400 transition">Privacy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
