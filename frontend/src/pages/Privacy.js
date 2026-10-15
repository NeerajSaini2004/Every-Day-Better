import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="glass-card p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <Lock size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Privacy Policy</h1>
              <p className="text-xs text-gray-400">Last updated: October 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-2">1. Information We Collect</h2>
              <p>We collect information you provide directly to us: your name, email address, password hash, learning preferences (level, goals, daily target), and your challenge/task progress and streaks.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. How We Use Your Data</h2>
              <p>Your data is used exclusively to personalise your 60-day learning journey, track your daily streaks and badges, compute leaderboard rankings, and deliver AI-powered speaking and grammar feedback.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. Speech & Voice Data</h2>
              <p>Speech recognition is executed locally via your browser's Web Speech API. Voice recordings captured during speaking exercises are processed only for the duration needed to analyze your pronunciation and are never sold to third parties.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. Data Security</h2>
              <p>We enforce industry-standard security practices, including salted bcrypt password hashing, encrypted JWT tokens, strict rate limits, and secure HTTPS connections.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">5. Your Rights</h2>
              <p>You can request to inspect, update, or delete your account information at any time from your profile settings or by contacting administrator support.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
