import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="glass-card p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Terms of Service</h1>
              <p className="text-xs text-gray-400">Last updated: October 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-2">1. Acceptance of Terms</h2>
              <p>By creating an account or using Every Day Better, you agree to comply with and be bound by these Terms of Service. If you disagree with any part, you may discontinue use of the platform.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. Learning Platform & AI Features</h2>
              <p>Every Day Better provides daily English lessons, vocabulary flashcards, speaking practice, and AI-driven feedback. Feedback provided by artificial intelligence is meant for educational enhancement and may not always reflect certified linguistic evaluation.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. User Accounts & Responsibilities</h2>
              <p>You are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. You agree not to attempt unauthorized access, abuse API endpoints, or conduct automated scraping.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. Audio & Microphone Usage</h2>
              <p>Speaking practice utilizes your browser's Web Speech API and MediaRecorder API. Audio recordings are processed in your browser or sent for feedback assessment according to your chosen learning preferences.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">5. Changes & Termination</h2>
              <p>We reserve the right to update, modify, or discontinue features of Every Day Better at any time. Continued use of the platform constitutes acceptance of revised terms.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
