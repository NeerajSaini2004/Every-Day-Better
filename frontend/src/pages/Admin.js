import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Spinner from '../components/ui/Spinner';
import { Users, BookOpen, Calendar, Plus, MessageSquare, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [days, setDays] = useState([]);
  const [tab, setTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [quoteForm, setQuoteForm] = useState({ text: '', author: '' });
  const [vocabForm, setVocabForm] = useState({ word: '', meaning: '', hindiMeaning: '', pronunciation: '', exampleSentence: '', dayNumber: 1, difficulty: 'beginner' });
  const [selectedDay, setSelectedDay] = useState(null);
  const [taskForm, setTaskForm] = useState({ type: 'speaking', title: '', description: '', xp: 10, duration: 5, hasTimer: false, hasRecording: false });

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, usersRes, daysRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/days'),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setDays(daysRes.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addQuote = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/quotes', quoteForm);
      toast.success('Quote added!');
      setQuoteForm({ text: '', author: '' });
    } catch { toast.error('Failed'); }
  };

  const addVocab = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/vocabulary', vocabForm);
      toast.success('Word added!');
      setVocabForm({ word: '', meaning: '', hindiMeaning: '', pronunciation: '', exampleSentence: '', dayNumber: 1, difficulty: 'beginner' });
    } catch { toast.error('Failed'); }
  };

  const addTaskToDay = async (e) => {
    e.preventDefault();
    if (!selectedDay) return;
    try {
      const updatedTasks = [...selectedDay.tasks, taskForm];
      const totalXP = updatedTasks.reduce((s, t) => s + Number(t.xp), 0);
      const { data } = await api.put(`/admin/days/${selectedDay._id}`, { tasks: updatedTasks, totalXP });
      setDays((prev) => prev.map((d) => (d._id === data._id ? data : d)));
      setSelectedDay(data);
      toast.success('Task added to day!');
      setTaskForm({ type: 'speaking', title: '', description: '', xp: 10, duration: 5, hasTimer: false, hasRecording: false });
    } catch { toast.error('Failed to add task'); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size={40} /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Admin Panel ⚙️</h1>
        <p className="text-gray-400 text-sm">Manage content and users</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['stats', 'users', 'days', 'quotes', 'vocabulary'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{t}</button>
        ))}
      </div>

      {tab === 'stats' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Total Users', value: stats.totalUsers },
            { icon: Calendar, label: 'Total Days', value: stats.totalDays },
            { icon: BookOpen, label: 'Vocabulary', value: stats.totalVocab },
            { icon: BarChart2, label: 'Active Users', value: users.filter((u) => (u.completedDays || []).length > 0).length },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass-card text-center">
              <p className="text-4xl font-black text-white">{value}</p>
              <p className="text-sm text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u._id} className="glass-card flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
                {u.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{u.name}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
              <div className="text-right text-xs text-gray-400">
                <p>{u.xp} XP · Lv.{u.level}</p>
                <p>{(u.completedDays || []).length} days · {u.streak}🔥</p>
              </div>
              <span className={`badge text-xs ${u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{u.role}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'days' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Day selector */}
          <div className="glass-card space-y-3">
            <h2 className="font-bold text-white">Select Day to Edit Tasks</h2>
            <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
              {days.map((d) => (
                <button key={d._id} onClick={() => setSelectedDay(d)} className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${selectedDay?._id === d._id ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                  Day {d.dayNumber} — {d.title}
                </button>
              ))}
            </div>
          </div>

          {/* Task editor */}
          {selectedDay && (
            <div className="glass-card space-y-3">
              <h2 className="font-bold text-white">Day {selectedDay.dayNumber}: {selectedDay.title}</h2>
              <p className="text-xs text-gray-500">{selectedDay.tasks.length} tasks · {selectedDay.totalXP} XP total</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {selectedDay.tasks.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs bg-white/5 rounded-lg px-3 py-2">
                    <span className="text-gray-400 capitalize">{t.type}</span>
                    <span className="text-white flex-1 truncate">{t.title}</span>
                    <span className="text-yellow-400">+{t.xp} XP</span>
                  </div>
                ))}
              </div>
              <form onSubmit={addTaskToDay} className="space-y-2 border-t border-white/10 pt-3">
                <p className="text-xs font-semibold text-gray-400">Add New Task</p>
                <div className="grid grid-cols-2 gap-2">
                  <select className="input-field text-sm py-2" value={taskForm.type} onChange={(e) => setTaskForm({ ...taskForm, type: e.target.value })}>
                    {['speaking', 'listening', 'reading', 'vocabulary', 'grammar', 'confidence'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <input type="number" placeholder="XP" className="input-field text-sm py-2" value={taskForm.xp} onChange={(e) => setTaskForm({ ...taskForm, xp: Number(e.target.value) })} />
                </div>
                <input required placeholder="Task title" className="input-field text-sm py-2" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
                <textarea required placeholder="Task description" className="input-field text-sm py-2 resize-none h-16" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
                <div className="flex gap-4 text-sm text-gray-300">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={taskForm.hasTimer} onChange={(e) => setTaskForm({ ...taskForm, hasTimer: e.target.checked })} /> Timer
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={taskForm.hasRecording} onChange={(e) => setTaskForm({ ...taskForm, hasRecording: e.target.checked })} /> Recording
                  </label>
                </div>
                <button type="submit" className="btn-primary flex items-center gap-2 text-sm py-2"><Plus size={14} /> Add Task</button>
              </form>
            </div>
          )}
        </div>
      )}

      {tab === 'quotes' && (
        <div className="glass-card">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2"><MessageSquare size={18} /> Add Motivational Quote</h2>
          <form onSubmit={addQuote} className="space-y-3">
            <textarea required placeholder="Quote text..." className="input-field resize-none h-24" value={quoteForm.text} onChange={(e) => setQuoteForm({ ...quoteForm, text: e.target.value })} />
            <input placeholder="Author name" className="input-field" value={quoteForm.author} onChange={(e) => setQuoteForm({ ...quoteForm, author: e.target.value })} />
            <button type="submit" className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Quote</button>
          </form>
        </div>
      )}

      {tab === 'vocabulary' && (
        <div className="glass-card">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2"><BookOpen size={18} /> Add Vocabulary Word</h2>
          <form onSubmit={addVocab} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required placeholder="Word" className="input-field" value={vocabForm.word} onChange={(e) => setVocabForm({ ...vocabForm, word: e.target.value })} />
            <input required placeholder="Meaning (English)" className="input-field" value={vocabForm.meaning} onChange={(e) => setVocabForm({ ...vocabForm, meaning: e.target.value })} />
            <input required placeholder="Hindi Meaning (हिंदी)" className="input-field" value={vocabForm.hindiMeaning} onChange={(e) => setVocabForm({ ...vocabForm, hindiMeaning: e.target.value })} />
            <input placeholder="Pronunciation" className="input-field" value={vocabForm.pronunciation} onChange={(e) => setVocabForm({ ...vocabForm, pronunciation: e.target.value })} />
            <input placeholder="Example sentence" className="input-field sm:col-span-2" value={vocabForm.exampleSentence} onChange={(e) => setVocabForm({ ...vocabForm, exampleSentence: e.target.value })} />
            <div className="flex gap-3">
              <input type="number" min="1" max="60" placeholder="Day #" className="input-field w-24" value={vocabForm.dayNumber} onChange={(e) => setVocabForm({ ...vocabForm, dayNumber: e.target.value })} />
              <select className="input-field" value={vocabForm.difficulty} onChange={(e) => setVocabForm({ ...vocabForm, difficulty: e.target.value })}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <button type="submit" className="btn-primary flex items-center gap-2 sm:col-span-2 w-fit"><Plus size={16} /> Add Word</button>
          </form>
        </div>
      )}
    </div>
  );
}
