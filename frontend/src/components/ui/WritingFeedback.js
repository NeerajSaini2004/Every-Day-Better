import React, { useState } from 'react';
import { Sparkles, Send, RotateCcw } from 'lucide-react';
import api from '../../utils/api';

const callGemini = async (messages) => {
  const { data } = await api.post('/gemini/chat', { messages });
  return data.content;
};

const localWritingFallback = (text) => ({
  score: 6,
  overall: 'Your writing is clear and understandable. Try to add a little more variety and accuracy.',
  corrections: [{
    wrong: text,
    right: text,
    reason: 'AI service is temporarily unavailable, so a local suggestion is being shown instead.',
  }],
  good: ['Your idea is clear.', 'You have a strong topic sentence.'],
  tip: 'Keep writing regularly and check sentence structure carefully.',
});

const PROMPTS = [
  'Write 3 sentences about what you did today.',
  'Describe your favorite place in India in 4 sentences.',
  'Write about your dream job using future tense.',
  'Describe a person you admire in 3-4 sentences.',
  'Write about a challenge you faced and how you solved it.',
];

export default function WritingFeedback() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [promptIdx] = useState(() => Math.floor(Math.random() * PROMPTS.length));

  const analyze = async () => {
    if (!text.trim() || text.trim().split(' ').length < 5) return;
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const raw = await callGemini([
        {
          role: 'system',
          content: `You are an English teacher for Indian students. Analyze the student's writing and respond ONLY with valid JSON in this exact format:
{
  "score": <number 1-10>,
  "overall": "<one encouraging sentence>",
  "corrections": [{ "wrong": "<original phrase>", "right": "<corrected phrase>", "reason": "<short reason>" }],
  "good": ["<thing done well 1>", "<thing done well 2>"],
  "tip": "<one specific improvement tip>"
}
Keep corrections to max 3. Be encouraging and specific.`,
        },
        { role: 'user', content: `Student wrote: "${text}"` },
      ]);
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) setResult(JSON.parse(jsonMatch[0]));
      else throw new Error('parse');
    } catch (err) {
      const fallback = localWritingFallback(text);
      setError(err?.response?.data?.message || 'AI service is temporarily unavailable. Showing a local writing suggestion instead.');
      setResult(fallback);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setText(''); setResult(null); setError(''); };

  const scoreColor = (s) => s >= 8 ? 'text-green-400' : s >= 5 ? 'text-yellow-400' : 'text-red-400';
  const scoreBg = (s) => s >= 8 ? 'bg-green-500/10 border-green-500/20' : s >= 5 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20';

  return (
    <div className="glass-card border-purple-500/20 bg-purple-500/5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
          <Sparkles size={16} className="text-purple-400" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">AI Writing Feedback</h3>
          <p className="text-xs text-gray-500">Powered by Google Gemini</p>
        </div>
      </div>

      {!result ? (
        <>
          <div className="bg-white/5 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-400 mb-1">✍️ Today's prompt:</p>
            <p className="text-sm text-white font-medium">{PROMPTS[promptIdx]}</p>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your answer here in English..."
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-purple-500/50 transition"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">{text.trim().split(/\s+/).filter(Boolean).length} words</span>
            <button
              onClick={analyze}
              disabled={loading || text.trim().split(' ').length < 5}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
              ) : (
                <><Send size={14} /> Get Feedback</>
              )}
            </button>
          </div>
        </>
      ) : result.error ? (
        <div className="text-center py-4 space-y-2">
          <p className="text-red-400 text-sm font-semibold">❌ Failed to get feedback</p>
          {error && <p className="text-xs text-gray-500 bg-white/5 rounded-lg px-3 py-2">{error}</p>}
          <p className="text-xs text-gray-600">Make sure your Google Gemini API key is correct in backend/.env and restart the dev server.</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto text-sm text-gray-400 hover:text-white transition mt-2">
            <RotateCcw size={14} /> Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Score */}
          <div className={`flex items-center justify-between rounded-xl px-4 py-3 border ${scoreBg(result.score)}`}>
            <p className="text-sm text-gray-300">{result.overall}</p>
            <div className="text-right shrink-0 ml-3">
              <p className={`text-2xl font-black ${scoreColor(result.score)}`}>{result.score}/10</p>
            </div>
          </div>

          {/* Corrections */}
          {result.corrections?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Corrections</p>
              {result.corrections.map((c, i) => (
                <div key={i} className="bg-white/5 rounded-xl px-3 py-2.5 text-xs space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-red-400 line-through">{c.wrong}</span>
                    <span className="text-gray-600">→</span>
                    <span className="text-green-400 font-semibold">{c.right}</span>
                  </div>
                  <p className="text-gray-500">{c.reason}</p>
                </div>
              ))}
            </div>
          )}

          {/* Good points */}
          {result.good?.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">What you did well</p>
              {result.good.map((g, i) => (
                <p key={i} className="text-xs text-green-300 flex items-start gap-1.5">
                  <span className="text-green-500 mt-0.5">✓</span> {g}
                </p>
              ))}
            </div>
          )}

          {/* Tip */}
          {result.tip && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2.5">
              <p className="text-xs text-blue-300">💡 {result.tip}</p>
            </div>
          )}

          <button onClick={reset} className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition">
            <RotateCcw size={13} /> Write another
          </button>
        </div>
      )}
    </div>
  );
}
