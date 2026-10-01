import React, { useEffect, useState } from 'react';
import { RefreshCw, Volume2 } from 'lucide-react';
import api from '../../utils/api';

const FALLBACK_QUOTES = [
  { content: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { content: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { content: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
  { content: 'The beautiful thing about learning is that no one can take it away from you.', author: 'B.B. King' },
  { content: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' },
  { content: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela' },
];

export default function DailyQuote() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/vocabulary/daily-quote');
      setQuote({ content: data.text, author: data.author });
    } catch {
      const fb = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      setQuote(fb);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuote(); }, []); // eslint-disable-line

  const speak = () => {
    if (!quote) return;
    const u = new SpeechSynthesisUtterance(`${quote.content} — ${quote.author}`);
    u.lang = 'en-US';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-blue-900/10 px-5 py-4">
      <p className="text-xs text-purple-400 font-semibold mb-3 uppercase tracking-wide">💬 Daily Motivation</p>
      {loading || !quote ? (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-white/5 rounded w-full" />
          <div className="h-4 bg-white/5 rounded w-3/4" />
          <div className="h-3 bg-white/5 rounded w-24 mt-2" />
        </div>
      ) : (
        <>
          <p className="text-base text-white font-medium italic leading-relaxed mb-2">"{quote.content}"</p>
          <p className="text-xs text-gray-500">— {quote.author}</p>
          <div className="flex items-center gap-2 mt-3">
            <button onClick={speak} className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-lg transition">
              <Volume2 size={12} /> Listen
            </button>
            <button onClick={fetchQuote} disabled={loading} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white bg-white/5 px-3 py-1.5 rounded-lg transition disabled:opacity-40">
              <RefreshCw size={12} /> New Quote
            </button>
          </div>
        </>
      )}
    </div>
  );
}
