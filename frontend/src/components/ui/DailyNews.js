import React, { useEffect, useState } from 'react';
import { ExternalLink, RefreshCw, Newspaper } from 'lucide-react';
import api from '../../utils/api';

// Fallback articles when API key not set or limit hit
const FALLBACK = [
  {
    title: 'India Becomes Third Largest Economy in the World',
    description: 'India has overtaken Japan to become the third largest economy globally, driven by strong growth in technology, manufacturing, and services sectors.',
    source: 'BBC News',
    url: 'https://www.bbc.com/news',
  },
  {
    title: 'Scientists Discover New Species of Bird in Northeast India',
    description: 'Researchers from the Zoological Survey of India have identified a previously unknown bird species in the forests of Arunachal Pradesh.',
    source: 'The Hindu',
    url: 'https://www.thehindu.com',
  },
  {
    title: 'Indian Students Win International Science Olympiad',
    description: 'A team of six students from India secured gold medals at the International Science Olympiad held in Singapore, competing against 80 countries.',
    source: 'Times of India',
    url: 'https://timesofindia.com',
  },
  {
    title: 'New High-Speed Rail Line to Connect Mumbai and Pune',
    description: 'The government has approved a new high-speed rail corridor that will reduce travel time between Mumbai and Pune to just 25 minutes.',
    source: 'NDTV',
    url: 'https://www.ndtv.com',
  },
  {
    title: 'India Launches Mission to Study the Sun',
    description: "ISRO's Aditya-L1 spacecraft has successfully reached its destination and is now sending back valuable data about solar activity and space weather.",
    source: 'ISRO',
    url: 'https://www.isro.gov.in',
  },
];

const QUESTIONS = [
  'What is the main topic of this article?',
  'What new information did you learn from this?',
  'Find one word you did not know. What does it mean?',
  'Write one sentence summarizing this article in your own words.',
];

export default function DailyNews() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fallbackIdx] = useState(() => Math.floor(Math.random() * FALLBACK.length));
  const [questionIdx] = useState(() => Math.floor(Math.random() * QUESTIONS.length));
  const [answer, setAnswer] = useState('');
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await api.get('/news/today');
        if (data.length > 0) {
          setArticle(data[Math.floor(Math.random() * data.length)]);
        } else {
          setArticle(FALLBACK[fallbackIdx]);
        }
      } catch {
        setArticle(FALLBACK[fallbackIdx]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [fallbackIdx]);

  if (loading) {
    return (
      <div className="glass-card border-blue-500/20 bg-blue-500/5 animate-pulse">
        <div className="h-4 bg-white/5 rounded w-32 mb-3" />
        <div className="h-5 bg-white/5 rounded w-full mb-2" />
        <div className="h-4 bg-white/5 rounded w-3/4" />
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="glass-card border-blue-500/20 bg-blue-500/5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Newspaper size={16} className="text-blue-400" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">Today's Reading</h3>
          <p className="text-xs text-gray-500">Today's news · {article.source?.name || article.source}</p>
        </div>
      </div>

      {/* Article */}
      <div className="bg-white/5 rounded-xl p-4 space-y-2">
        <h4 className="font-bold text-white text-sm leading-snug">{article.title}</h4>
        <p className="text-xs text-gray-400 leading-relaxed">{article.description}</p>
        {article.url && (
          <a href={article.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition mt-1">
            Read full article <ExternalLink size={11} />
          </a>
        )}
      </div>

      {/* Comprehension question */}
      <div className="space-y-2">
        <p className="text-xs text-gray-400 font-semibold">📝 Quick question:</p>
        <p className="text-sm text-white">{QUESTIONS[questionIdx]}</p>
        {!answered ? (
          <>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer..."
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500/50 transition"
            />
            <button
              onClick={() => answer.trim() && setAnswered(true)}
              disabled={!answer.trim()}
              className="text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Submit Answer
            </button>
          </>
        ) : (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">
            <p className="text-xs text-green-400 font-semibold mb-1">✅ Great effort!</p>
            <p className="text-xs text-gray-400 italic">"{answer}"</p>
            <button onClick={() => { setAnswer(''); setAnswered(false); }} className="text-xs text-gray-500 hover:text-white mt-2 flex items-center gap-1 transition">
              <RefreshCw size={11} /> Try another answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
