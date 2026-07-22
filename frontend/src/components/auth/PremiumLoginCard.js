import React, { useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';



import { motion } from 'framer-motion';
import Spinner from '../ui/Spinner';



export default function PremiumLoginCard({
  loading,
  onSubmit,
}) {
  const emailId = useId();
  const passwordId = useId();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);

  const canSubmit = useMemo(() => {
    return !!form.email && !!form.password && !loading;
  }, [form.email, form.password, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit?.(form, { remember });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="glass-card rounded-3xl border border-white/10 p-6 sm:p-7"
    >
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600/40 to-purple-600/30 border border-white/10 flex items-center justify-center">
            <span className="text-2xl">📘</span>
          </div>
          <div>
            <div className="text-sm text-gray-400 font-semibold">Every Day Better</div>
            <div className="text-xl font-black leading-tight">Welcome Back 👋</div>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-xs font-semibold text-gray-500">Secure Login</div>
          <div className="text-xs font-bold text-blue-300">Encrypted session</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Login form">
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-300 mb-1.5">
            Email
          </label>
          <input
            id={emailId}
            type="email"
            required
            placeholder="you@example.com"
            className="input-field"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor={passwordId} className="block text-sm font-medium text-gray-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id={passwordId}
              type={show ? 'text' : 'password'}
              required
              placeholder="••••••••"
              className="input-field pr-10"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              className="accent-blue-400"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              aria-label="Remember me"
            />
            Remember Me
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-gray-300 hover:text-white transition"
          >
            Forgot Password?
          </Link>
        </div>

        <motion.button
          type="submit"
          disabled={!canSubmit}
          whileHover={{ scale: canSubmit ? 1.01 : 1 }}
          whileTap={{ scale: 0.99 }}
          className="w-full mt-2 rounded-xl font-semibold py-3.5 text-white relative overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 55%, #10B981 120%)',
          }}
          aria-label="Continue Learning"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 opacity-0 hover:opacity-100 transition"
            style={{
              background:
                'linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0) 70%)',
              transform: 'translateX(-120%)',
              animation: 'sheen 2.2s ease-in-out infinite',
            }}
          />
          <style>{`@keyframes sheen { 0% { transform: translateX(-120%);} 55% {transform: translateX(120%);} 100% {transform: translateX(120%);} }`}</style>

          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? <Spinner size={18} /> : 'Continue Learning →'}
          </span>
        </motion.button>

        {/* OAuth */}
        <div className="pt-2">
          <div className="relative flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-white/10" />
            <div className="text-xs text-gray-500 font-semibold">Or continue with</div>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled
              aria-label="Continue with Google"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-semibold disabled:cursor-not-allowed"
              title="Google OAuth is not configured."
            >
              <span className="inline-flex w-5 h-5 items-center justify-center rounded bg-white/10 border border-white/10 text-sm">G</span>
              Google
            </button>

            <button
              type="button"
              aria-label="Continue with GitHub"
              onClick={() => alert('GitHub OAuth not configured in this environment.')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition"
            >
              <span className="inline-flex w-5 h-5 items-center justify-center rounded bg-white/10 border border-white/10 text-sm">⌂</span>
              GitHub
            </button>
          </div>
        </div>

        <div className="pt-2">
          <div className="text-center text-sm text-gray-500">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold">Sign up free</Link>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500 leading-relaxed">
            By continuing, you agree to{' '}
            <a href="/terms" className="text-gray-300 hover:text-white font-semibold">Terms</a> and{' '}
            <a href="/privacy" className="text-gray-300 hover:text-white font-semibold">Privacy</a>.

          </div>
        </div>
      </form>
    </motion.div>
  );
}

