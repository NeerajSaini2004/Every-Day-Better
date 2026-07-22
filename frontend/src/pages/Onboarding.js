import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'What is your English level?',
    subtitle: 'We will customize your learning path',
    field: 'englishLevel',
    options: [
      { value: 'beginner', label: 'Beginner', emoji: '🌱', desc: 'I know very little English' },
      { value: 'basic', label: 'Basic', emoji: '📚', desc: 'I know some words and sentences' },
      { value: 'intermediate', label: 'Intermediate', emoji: '🗣️', desc: 'I can have simple conversations' },
    ],
  },
  {
    id: 2,
    title: 'What is your goal?',
    subtitle: 'We will focus on what matters most to you',
    field: 'goal',
    options: [
      { value: 'job', label: 'Get a Job', emoji: '💼', desc: 'Interview prep, professional English' },
      { value: 'exam', label: 'Pass an Exam', emoji: '📝', desc: 'Grammar, vocabulary, writing' },
      { value: 'speaking', label: 'Speak Confidently', emoji: '🎤', desc: 'Speaking practice and pronunciation' },
      { value: 'general', label: 'General Improvement', emoji: '⭐', desc: 'All-round English improvement' },
    ],
  },
  {
    id: 3,
    title: 'How much time daily?',
    subtitle: 'Consistency beats perfection',
    field: 'dailyTime',
    options: [
      { value: 15, label: '15 minutes', emoji: '⚡', desc: 'Quick daily practice' },
      { value: 30, label: '30 minutes', emoji: '🎯', desc: 'Recommended for best results' },
      { value: 45, label: '45 minutes', emoji: '🔥', desc: 'Serious learner mode' },
    ],
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ englishLevel: '', goal: '', dailyTime: '' });
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const current = steps[step];

  const select = (value) => setAnswers({ ...answers, [current.field]: value });
  const selected = answers[current.field];

  const handleNext = async () => {
    if (!selected) return toast.error('Please select an option');
    if (step < steps.length - 1) { setStep(step + 1); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/onboarding', answers);
      updateUser(data.user);
      toast.success('Setup complete! Let\'s begin 🚀');
      navigate('/dashboard');
    } catch { toast.error('Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {steps.map((s, i) => (
            <div key={s.id} className={`h-2 rounded-full transition-all duration-500 ${i <= step ? 'bg-blue-500 w-16' : 'bg-white/10 w-8'}`} />
          ))}
        </div>

        <div className="text-center mb-8">
          <p className="text-blue-400 text-sm font-semibold mb-2">Step {step + 1} of {steps.length}</p>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{current.title}</h1>
          <p className="text-gray-400 text-sm">{current.subtitle}</p>
        </div>

        <div className="space-y-3 mb-8">
          {current.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => select(opt.value)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left ${
                selected === opt.value
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <span className="text-3xl">{opt.emoji}</span>
              <div>
                <p className="font-bold text-white">{opt.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
              </div>
              {selected === opt.value && (
                <div className="ml-auto w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="btn-secondary flex items-center gap-2 px-5">
              <ArrowLeft size={16} /> Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!selected || loading}
            className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Setting up...' : step === steps.length - 1 ? 'Start Learning 🚀' : 'Next'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
