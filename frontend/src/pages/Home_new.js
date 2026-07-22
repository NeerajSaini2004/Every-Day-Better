import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Zap, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '📚', title: 'Daily Vocabulary', desc: 'Learn 10 new words every day with Hindi meanings and example sentences.' },
  { icon: '✏️', title: 'Grammar Rules', desc: 'Master English grammar through interactive lessons and practice exercises.' },
  { icon: '🎤', title: 'Speaking Practice', desc: 'Record your voice and get instant feedback on pronunciation.' },
  { icon: '🏆', title: 'Track Progress', desc: 'See your improvement with detailed analytics and milestone achievements.' },
  { icon: '🔥', title: 'Streak System', desc: 'Build daily habits and stay motivated with our gamified streak system.' },
  { icon: '⚡', title: 'Earn XP & Levels', desc: 'Complete tasks, earn XP, and unlock badges as you level up.' },
];

const testimonials = [
  { name: 'Rahul Sharma', role: 'Job Seeker, Delhi', text: 'After 30 days, I gave my first English interview confidently. This app changed my life!', avatar: 'R' },
  { name: 'Priya Singh', role: 'Student, UP', text: 'I was scared to speak English. Now I speak in class every day. Thank you Every Day Better!', avatar: 'P' },
  { name: 'Amit Kumar', role: 'Fresher, Bihar', text: 'The streak system kept me going. 60 days completed and I got placed in an MNC!', avatar: 'A' },
];

const faqs = [
  { q: 'Is this free to use?', a: 'Yes! Every Day Better is completely free. Start your 60-day challenge today.' },
  { q: 'How much time do I need daily?', a: 'Just 30-45 minutes per day. Consistency is more important than duration.' },
  { q: 'I am a complete beginner. Can I use this?', a: 'Absolutely! The challenge starts from the very basics and gradually builds up.' },
  { q: 'What if I miss a day?', a: 'No worries! Your streak resets but your progress is saved. Just continue from where you left.' },
  { q: 'Will I become fluent in 60 days?', a: 'You will build a strong foundation and gain confidence to speak English in daily situations.' },
];

export default function Home() {
  const { user: storedUser } = useAuth();
  
  const [openFaq, setOpenFaq] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCount((c) => (c < 60 ? c + 1 : c)), 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Flame size={14} className="text-orange-400" /> 60-Day English Challenge
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight mb-4 sm:mb-6">
            Master English{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              in 60 Days
            </span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Learn vocabulary, grammar, and speaking skills with daily tasks designed for Indian students.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-2">
            <Link to={storedUser ? '/dashboard' : '/register'} className="btn-primary flex items-center justify-center gap-2 text-base sm:text-lg font-semibold py-3 sm:py-4 px-6 sm:px-8 w-full sm:w-auto">
              {storedUser ? 'Go to Dashboard' : 'Start Learning Free'} <ArrowRight size={18} />
            </Link>
            {!storedUser && (
              <Link to="/login" className="btn-secondary flex items-center justify-center gap-2 text-base sm:text-lg font-semibold py-3 sm:py-4 px-6 sm:px-8 w-full sm:w-auto">
                Login
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10 sm:mb-16">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-black text-white">{count}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Days of Content</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-black text-white">360+</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Daily Tasks</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-black text-white">56</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Grammar Rules</p>
            </div>
          </div>

          {/* Progress Demo Card */}
          <div className="max-w-sm mx-auto glass rounded-2xl p-4 sm:p-6 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-black">✓</div>
                <span className="text-sm font-semibold text-white">Introduction & Basics</span>
              </div>
              <span className="text-xs text-green-400 font-bold">Done</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-3">
              <div className="h-2 bg-gradient-to-r from-green-500 to-green-400 rounded-full animate-pulse" style={{ width: '100%' }} />
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-black">2</div>
                <span className="text-sm font-semibold text-white">Daily Greetings</span>
              </div>
              <span className="text-xs text-blue-400 font-bold">67%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-3">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000" style={{ width: `${count > 30 ? 67 : count * 2}%` }} />
            </div>
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Flame size={12} className="text-orange-400" />
                <span className="text-orange-400 font-bold">12 day streak</span>
              </div>
              <span className="text-gray-600">·</span>
              <div className="flex items-center gap-1">
                <Zap size={12} className="text-purple-400" />
                <span className="text-purple-400 font-bold">340 XP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">Everything You Need</h2>
            <p className="text-gray-400 text-sm sm:text-base">A complete system to build English confidence</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass-card hover:border-blue-500/50 transition-all duration-300 hover:scale-105 group">
                <div className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                <h3 className="font-bold text-white mb-2 text-base sm:text-lg">{f.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">How It Works 🚀</h2>
          <p className="text-gray-400 text-sm sm:text-base">3 simple steps to fluent English</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { step: '01', icon: '📝', title: 'Sign Up Free', desc: 'Create your account in 30 seconds. No credit card needed.' },
            { step: '02', icon: '📅', title: 'Do Daily Tasks', desc: 'Complete 6 tasks every day — speaking, reading, vocabulary & more.' },
            { step: '03', icon: '🏆', title: 'Track & Win', desc: 'Earn XP, maintain streaks, unlock badges and download your certificate.' },
          ].map((s) => (
            <div key={s.step} className="glass-card text-center relative overflow-hidden hover:border-purple-500/30 transition-all duration-300">
              <div className="absolute top-2 right-2 text-4xl font-black text-white/5">{s.step}</div>
              <div className="text-4xl sm:text-5xl mb-3">{s.icon}</div>
              <h3 className="font-bold text-white mb-2">{s.title}</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Logged-in user stats */}
      {storedUser && (
        <section className="px-4 sm:px-6 py-12 sm:py-16 bg-gradient-to-r from-purple-900/10 to-blue-900/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">Welcome back, {storedUser.name?.split(' ')[0]}! 👋</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link to="/progress" className="glass-card hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-xl">🔥</div>
                  <div>
                    <p className="text-xs text-gray-500">Current Streak</p>
                    <p className="text-2xl font-black text-white">{storedUser.streak || 0} Days</p>
                  </div>
                </div>
              </Link>
              <Link to="/progress" className="glass-card hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-xl">⚡</div>
                  <div>
                    <p className="text-xs text-gray-500">Total XP</p>
                    <p className="text-2xl font-black text-white">{storedUser.xp || 0} XP</p>
                  </div>
                </div>
              </Link>
              <Link to="/dashboard" className="glass-card hover:border-green-500/50 transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-xl">📋</div>
                  <div>
                    <p className="text-xs text-gray-500">Days Done</p>
                    <p className="text-2xl font-black text-white">{(storedUser.completedDays || []).length}/60</p>
                  </div>
                </div>
              </Link>
            </div>
            <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2 text-base font-semibold py-3 px-8 mt-6">
              Continue Challenge <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}

      {/* Streak Preview */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 bg-gradient-to-r from-orange-900/10 to-yellow-900/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">🔥 Build Your Streak</h2>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">Come back every day and watch your streak grow!</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {Array.from({ length: 30 }, (_, i) => (
              <div key={i} className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all hover:scale-110 ${i < 12 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : i === 12 ? 'bg-orange-500/50 text-orange-300 animate-pulse' : 'bg-white/5 text-gray-600'}`}>
                {i < 12 ? '🔥' : i + 1}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Real Stories 💬</h2>
          <p className="text-gray-400 text-sm sm:text-base">Students who transformed their English</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card hover:border-blue-500/30 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm">{t.avatar}</div>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-xs sm:text-sm text-gray-300 italic leading-relaxed">"{t.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-center text-white mb-8">FAQ</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card cursor-pointer hover:border-blue-500/30 transition-all duration-300" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-white text-sm sm:text-base flex-1">{faq.q}</p>
                {openFaq === i ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
              </div>
              {openFaq === i && <p className="mt-3 text-xs sm:text-sm text-gray-400 animate-fade-in leading-relaxed">{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 text-center">
        <div className="max-w-2xl mx-auto glass-card bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/20 py-8 sm:py-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Ready to Start? 🚀</h2>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">Join thousands of students improving their English every day.</p>
          <Link to={storedUser ? '/dashboard' : '/register'} className="btn-primary inline-flex items-center justify-center gap-2 text-base sm:text-lg font-semibold py-3 sm:py-4 px-8 sm:px-10 w-full sm:w-auto">
            {storedUser ? 'Continue Challenge' : 'Start for Free'} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
