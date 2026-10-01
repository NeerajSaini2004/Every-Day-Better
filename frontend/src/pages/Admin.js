import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Spinner from '../components/ui/Spinner';
import { Users, BookOpen, Calendar, Plus, MessageSquare, BarChart2, ExternalLink, Edit, Trash2, Brain } from 'lucide-react';
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
  const [taskForm, setTaskForm] = useState({ type: 'speaking', title: '', description: '', xp: 10, duration: 5, hasTimer: false, hasRecording: false, url: '', urlLabel: '' });
  const [quotes, setQuotes] = useState([]);
  const [vocabList, setVocabList] = useState([]);
  const [grammarList, setGrammarList] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [editingQuoteIndex, setEditingQuoteIndex] = useState(null);
  const [editingVocabIndex, setEditingVocabIndex] = useState(null);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editingGrammarIndex, setEditingGrammarIndex] = useState(null);
  const [editingChallengeIndex, setEditingChallengeIndex] = useState(null);
  const [editingDayInfo, setEditingDayInfo] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [grammarForm, setGrammarForm] = useState({ title: '', rule: '', hindiRule: '', category: 'tense', difficulty: 'beginner', dayNumber: 1, exampleSentence: '', hindiExample: '' });
  const [challengeForm, setChallengeForm] = useState({ question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '', hindiExplanation: '', category: 'grammar', difficulty: 'beginner', dayNumber: 1 }); // { type, index/id }

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, usersRes, daysRes, vocabRes, quotesRes, grammarRes, challengesRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/days'),
          api.get('/vocabulary'),
          api.get('/vocabulary/quotes'),
          api.get('/admin/grammar'),
          api.get('/admin/challenges'),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setDays(daysRes.data);
        setVocabList(vocabRes.data);
        setQuotes(Array.isArray(quotesRes.data) ? quotesRes.data : []);
        setGrammarList(grammarRes.data);
        setChallenges(challengesRes.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addQuote = async (e) => {
    e.preventDefault();
    try {
      if (editingQuoteIndex !== null) {
        await api.put(`/admin/quotes/${quotes[editingQuoteIndex]._id}`, quoteForm);
        toast.success('Quote updated!');
        setQuotes((prev) => prev.map((q, i) => i === editingQuoteIndex ? { ...q, ...quoteForm } : q));
        setEditingQuoteIndex(null);
      } else {
        await api.post('/admin/quotes', quoteForm);
        toast.success('Quote added!');
        const { data } = await api.get('/vocabulary/quotes');
        setQuotes(Array.isArray(data) ? data : []);
      }
      setQuoteForm({ text: '', author: '' });
    } catch { toast.error('Failed'); }
  };

  const handleEditQuote = (index) => {
    setEditingQuoteIndex(index);
    setQuoteForm({ text: quotes[index].text, author: quotes[index].author });
  };

  const handleDeleteQuote = (index) => setConfirmDelete({ type: 'quote', index });

  const deleteActualQuote = async (index) => {
    try {
      await api.delete(`/admin/quotes/${quotes[index]._id}`);
      const { data } = await api.get('/vocabulary/quotes');
      setQuotes(Array.isArray(data) ? data : []);
      toast.success('Quote deleted');
    } catch { toast.error('Failed to delete quote'); }
  };

  const addVocab = async (e) => {
    e.preventDefault();
    try {
      if (editingVocabIndex !== null) {
        await api.put(`/admin/vocabulary/${vocabList[editingVocabIndex]._id}`, vocabForm);
        toast.success('Word updated!');
        setVocabList((prev) => prev.map((v, i) => i === editingVocabIndex ? { ...v, ...vocabForm } : v));
        setEditingVocabIndex(null);
      } else {
        await api.post('/admin/vocabulary', vocabForm);
        toast.success('Word added!');
        const { data } = await api.get('/vocabulary');
        setVocabList(data);
      }
      setVocabForm({ word: '', meaning: '', hindiMeaning: '', pronunciation: '', exampleSentence: '', dayNumber: 1, difficulty: 'beginner' });
    } catch { toast.error('Failed'); }
  };

  const handleEditVocab = (index) => {
    setEditingVocabIndex(index);
    setVocabForm({ ...vocabList[index] });
  };

  const handleDeleteVocab = (index) => setConfirmDelete({ type: 'vocab', index });

  const deleteActualVocab = async (index) => {
    try {
      await api.delete(`/admin/vocabulary/${vocabList[index]._id}`);
      const { data } = await api.get('/vocabulary');
      setVocabList(data);
      toast.success('Word deleted');
    } catch { toast.error('Failed to delete word'); }
  };

  const addTaskToDay = async (e) => {
    e.preventDefault();
    if (!selectedDay) return;
    try {
      const updatedTasks = editingTaskIndex !== null
        ? selectedDay.tasks.map((t, i) => i === editingTaskIndex ? taskForm : t)
        : [...selectedDay.tasks, taskForm];
      const totalXP = updatedTasks.reduce((s, t) => s + Number(t.xp), 0);
      const { data } = await api.put(`/admin/days/${selectedDay._id}`, { tasks: updatedTasks, totalXP });
      setDays((prev) => prev.map((d) => (d._id === data._id ? data : d)));
      setSelectedDay(data);
      toast.success(editingTaskIndex !== null ? 'Task updated!' : 'Task added to day!');
      setTaskForm({ type: 'speaking', title: '', description: '', xp: 10, duration: 5, hasTimer: false, hasRecording: false, url: '', urlLabel: '' });
      setEditingTaskIndex(null);
    } catch { toast.error('Failed to save task'); }
  };

  const handleEditTask = (index) => {
    setEditingTaskIndex(index);
    setTaskForm({ ...selectedDay.tasks[index] });
  };

  const handleDeleteTask = (index) => setConfirmDelete({ type: 'task', index });

  const deleteActualTask = (index) => {
    const updatedTasks = selectedDay.tasks.filter((_, i) => i !== index);
    const totalXP = updatedTasks.reduce((s, t) => s + Number(t.xp), 0);
    api.put(`/admin/days/${selectedDay._id}`, { tasks: updatedTasks, totalXP })
      .then(({ data }) => {
        setDays((prev) => prev.map((d) => (d._id === data._id ? data : d)));
        setSelectedDay(data);
        toast.success('Task deleted');
      })
      .catch(() => toast.error('Failed to delete task'));
  };

  const handleEditUser = (user) => {
    const newRole = user.role === 'user' ? 'admin' : 'user';
    toast.success(`Promoting ${user.name} to ${newRole}...`);
    updateUserInfo(user._id, { role: newRole });
  };

  const handleDeleteUser = (userId) => setConfirmDelete({ type: 'user', id: userId });

  const deleteActualUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete user'); }
  };

  const updateUserInfo = async (userId, updates) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}`, updates);
      setUsers((prev) => prev.map((u) => (u._id === userId ? data : u)));
      toast.success('User updated');
    } catch { toast.error('Failed to update user'); }
  };

  const handleConfirmDelete = () => {
    if (!confirmDelete) return;
    const { type, index, id } = confirmDelete;
    if (type === 'quote') deleteActualQuote(index);
    else if (type === 'vocab') deleteActualVocab(index);
    else if (type === 'task') deleteActualTask(index);
    else if (type === 'user') deleteActualUser(id);
    else if (type === 'grammar') deleteActualGrammar(index);
    else if (type === 'challenge') deleteActualChallenge(index);
    setConfirmDelete(null);
  };

  // Grammar handlers
  const handleEditGrammar = (index) => {
    setEditingGrammarIndex(index);
    setGrammarForm({ ...grammarList[index] });
  };
  const handleDeleteGrammar = (index) => setConfirmDelete({ type: 'grammar', index });
  const deleteActualGrammar = async (index) => {
    try {
      await api.delete(`/admin/grammar/${grammarList[index]._id}`);
      const { data } = await api.get('/admin/grammar');
      setGrammarList(data);
      toast.success('Grammar rule deleted');
    } catch { toast.error('Failed'); }
  };
  const saveGrammar = async (e) => {
    e.preventDefault();
    try {
      if (editingGrammarIndex !== null) {
        await api.put(`/admin/grammar/${grammarList[editingGrammarIndex]._id}`, grammarForm);
        toast.success('Updated!');
        setEditingGrammarIndex(null);
      } else {
        await api.post('/admin/grammar', grammarForm);
        toast.success('Grammar rule added!');
      }
      const { data } = await api.get('/admin/grammar');
      setGrammarList(data);
      setGrammarForm({ title: '', rule: '', hindiRule: '', category: 'tense', difficulty: 'beginner', dayNumber: 1, exampleSentence: '', hindiExample: '' });
    } catch { toast.error('Failed'); }
  };

  // Challenge handlers
  const handleEditChallenge = (index) => {
    setEditingChallengeIndex(index);
    setChallengeForm({ ...challenges[index], options: [...challenges[index].options] });
  };
  const handleDeleteChallenge = (index) => setConfirmDelete({ type: 'challenge', index });
  const deleteActualChallenge = async (index) => {
    try {
      await api.delete(`/admin/challenges/${challenges[index]._id}`);
      const { data } = await api.get('/admin/challenges');
      setChallenges(data);
      toast.success('Challenge deleted');
    } catch { toast.error('Failed'); }
  };
  const saveChallenge = async (e) => {
    e.preventDefault();
    try {
      if (editingChallengeIndex !== null) {
        await api.put(`/admin/challenges/${challenges[editingChallengeIndex]._id}`, challengeForm);
        toast.success('Updated!');
        setEditingChallengeIndex(null);
      } else {
        await api.post('/admin/challenges', challengeForm);
        toast.success('Challenge added!');
      }
      const { data } = await api.get('/admin/challenges');
      setChallenges(data);
      setChallengeForm({ question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '', hindiExplanation: '', category: 'grammar', difficulty: 'beginner', dayNumber: 1 });
    } catch { toast.error('Failed'); }
  };

  // Day info edit
  const saveDayInfo = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/admin/days/${editingDayInfo._id}`, {
        title: editingDayInfo.title,
        description: editingDayInfo.description,
        theme: editingDayInfo.theme,
      });
      setDays((prev) => prev.map((d) => d._id === data._id ? data : d));
      if (selectedDay?._id === data._id) setSelectedDay(data);
      setEditingDayInfo(null);
      toast.success('Day info updated!');
    } catch { toast.error('Failed'); }
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
        {['stats', 'users', 'days', 'quotes', 'vocabulary', 'grammar', 'challenges'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{t}</button>
        ))}
      </div>

      {tab === 'stats' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { icon: Users, label: 'Total Users', value: stats.totalUsers },
            { icon: Calendar, label: 'Total Days', value: stats.totalDays },
            { icon: BookOpen, label: 'Vocabulary', value: stats.totalVocab },
            { icon: Brain, label: 'Challenges', value: stats.totalChallenges },
            { icon: BarChart2, label: 'Grammar Rules', value: stats.totalGrammar },
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
              <div className="flex gap-1">
                <button onClick={() => handleEditUser(u)} className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"><Edit size={14} /></button>
                {u.role !== 'admin' && (
                  <button onClick={() => handleDeleteUser(u._id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"><Trash2 size={14} /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'days' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Day selector */}
          <div className="glass-card space-y-3">
            <h2 className="font-bold text-white">Select Day to Edit</h2>
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-white">Day {selectedDay.dayNumber}: {selectedDay.title}</h2>
                  <p className="text-xs text-gray-500">{selectedDay.tasks.length} tasks · {selectedDay.totalXP} XP total</p>
                </div>
                <button onClick={() => setEditingDayInfo({ ...selectedDay })} className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"><Edit size={14} /></button>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {selectedDay.tasks.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs bg-white/5 rounded-lg px-3 py-2">
                    <span className="text-gray-400 capitalize">{t.type}</span>
                    <span className="text-white flex-1 truncate">{t.title}</span>
                    {t.url && <ExternalLink size={12} className="text-blue-400" title={t.urlLabel || 'Resource link'} />}
                    <span className="text-yellow-400">+{t.xp} XP</span>
                    <button onClick={() => handleEditTask(i)} className="p-1 rounded hover:bg-white/10 text-blue-400"><Edit size={12} /></button>
                    <button onClick={() => handleDeleteTask(i)} className="p-1 rounded hover:bg-white/10 text-red-400"><Trash2 size={12} /></button>
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
                <input placeholder="Resource URL (optional)" className="input-field text-sm py-2" value={taskForm.url} onChange={(e) => setTaskForm({ ...taskForm, url: e.target.value })} />
                <input placeholder="Link label (optional)" className="input-field text-sm py-2" value={taskForm.urlLabel} onChange={(e) => setTaskForm({ ...taskForm, urlLabel: e.target.value })} />
                <div className="flex gap-4 text-sm text-gray-300">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={taskForm.hasTimer} onChange={(e) => setTaskForm({ ...taskForm, hasTimer: e.target.checked })} /> Timer
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={taskForm.hasRecording} onChange={(e) => setTaskForm({ ...taskForm, hasRecording: e.target.checked })} /> Recording
                  </label>
                </div>
                <button type="submit" className="btn-primary flex items-center gap-2 text-sm py-2"><Plus size={14} /> {editingTaskIndex !== null ? 'Update Task' : 'Add Task'}</button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Grammar Tab */}
      {tab === 'grammar' && (
        <div className="space-y-4">
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {grammarList.map((g, i) => (
              <div key={i} className="glass-card flex items-start gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{g.title}</p>
                  <p className="text-xs text-gray-400">{g.category} · Day {g.dayNumber} · {g.difficulty}</p>
                  <p className="text-xs text-gray-500 mt-1 truncate">{g.rule}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleEditGrammar(i)} className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"><Edit size={14} /></button>
                  <button onClick={() => handleDeleteGrammar(i)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card border-t border-white/10">
            <h3 className="font-semibold text-white mb-3">{editingGrammarIndex !== null ? 'Edit Grammar Rule' : 'Add Grammar Rule'}</h3>
            <form onSubmit={saveGrammar} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input required placeholder="Title" className="input-field" value={grammarForm.title} onChange={(e) => setGrammarForm({ ...grammarForm, title: e.target.value })} />
              <div className="flex gap-2">
                <select className="input-field" value={grammarForm.category} onChange={(e) => setGrammarForm({ ...grammarForm, category: e.target.value })}>
                  {['tense', 'preposition', 'article', 'conjunction', 'verb', 'noun', 'adjective', 'other'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="input-field" value={grammarForm.difficulty} onChange={(e) => setGrammarForm({ ...grammarForm, difficulty: e.target.value })}>
                  {['beginner', 'intermediate', 'advanced'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <textarea required placeholder="Rule (English)" className="input-field resize-none h-16" value={grammarForm.rule} onChange={(e) => setGrammarForm({ ...grammarForm, rule: e.target.value })} />
              <textarea required placeholder="Rule (Hindi)" className="input-field resize-none h-16" value={grammarForm.hindiRule} onChange={(e) => setGrammarForm({ ...grammarForm, hindiRule: e.target.value })} />
              <input placeholder="Example sentence" className="input-field" value={grammarForm.exampleSentence} onChange={(e) => setGrammarForm({ ...grammarForm, exampleSentence: e.target.value })} />
              <input placeholder="Hindi example" className="input-field" value={grammarForm.hindiExample} onChange={(e) => setGrammarForm({ ...grammarForm, hindiExample: e.target.value })} />
              <input type="number" min="1" max="60" placeholder="Day #" className="input-field w-24" value={grammarForm.dayNumber} onChange={(e) => setGrammarForm({ ...grammarForm, dayNumber: e.target.value })} />
              <div className="flex gap-2 sm:col-span-2">
                <button type="submit" className="btn-primary flex items-center gap-2"><Plus size={16} /> {editingGrammarIndex !== null ? 'Update Rule' : 'Add Rule'}</button>
                {editingGrammarIndex !== null && <button type="button" onClick={() => { setEditingGrammarIndex(null); setGrammarForm({ title: '', rule: '', hindiRule: '', category: 'tense', difficulty: 'beginner', dayNumber: 1, exampleSentence: '', hindiExample: '' }); }} className="px-4 py-2 rounded-xl bg-white/10 text-gray-400 text-sm">Cancel</button>}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Challenges Tab */}
      {tab === 'challenges' && (
        <div className="space-y-4">
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {challenges.map((c, i) => (
              <div key={i} className="glass-card flex items-start gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{c.question}</p>
                  <p className="text-xs text-gray-400">{c.category} · {c.difficulty} · Correct: Option {c.correctIndex + 1}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {c.options.map((o, oi) => (
                      <span key={oi} className={`text-xs px-2 py-0.5 rounded-full ${oi === c.correctIndex ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-500'}`}>{o}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleEditChallenge(i)} className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"><Edit size={14} /></button>
                  <button onClick={() => handleDeleteChallenge(i)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card">
            <h3 className="font-semibold text-white mb-3">{editingChallengeIndex !== null ? 'Edit Challenge' : 'Add Challenge Question'}</h3>
            <form onSubmit={saveChallenge} className="space-y-3">
              <textarea required placeholder="Question" className="input-field resize-none h-16" value={challengeForm.question} onChange={(e) => setChallengeForm({ ...challengeForm, question: e.target.value })} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {challengeForm.options.map((opt, oi) => (
                  <input key={oi} required placeholder={`Option ${oi + 1}`} className={`input-field text-sm ${challengeForm.correctIndex === oi ? 'border-green-500/50' : ''}`} value={opt} onChange={(e) => { const opts = [...challengeForm.options]; opts[oi] = e.target.value; setChallengeForm({ ...challengeForm, options: opts }); }} />
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Correct Answer</p>
                  <select className="input-field text-sm" value={challengeForm.correctIndex} onChange={(e) => setChallengeForm({ ...challengeForm, correctIndex: Number(e.target.value) })}>
                    {[0,1,2,3].map(i => <option key={i} value={i}>Option {i+1}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Category</p>
                  <select className="input-field text-sm" value={challengeForm.category} onChange={(e) => setChallengeForm({ ...challengeForm, category: e.target.value })}>
                    {['grammar', 'vocabulary', 'tense', 'preposition', 'idiom'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Difficulty</p>
                  <select className="input-field text-sm" value={challengeForm.difficulty} onChange={(e) => setChallengeForm({ ...challengeForm, difficulty: e.target.value })}>
                    {['beginner', 'intermediate', 'advanced'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <input placeholder="Explanation (English)" className="input-field" value={challengeForm.explanation} onChange={(e) => setChallengeForm({ ...challengeForm, explanation: e.target.value })} />
              <input placeholder="Explanation (Hindi)" className="input-field" value={challengeForm.hindiExplanation} onChange={(e) => setChallengeForm({ ...challengeForm, hindiExplanation: e.target.value })} />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex items-center gap-2"><Plus size={16} /> {editingChallengeIndex !== null ? 'Update' : 'Add Challenge'}</button>
                {editingChallengeIndex !== null && <button type="button" onClick={() => { setEditingChallengeIndex(null); setChallengeForm({ question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '', hindiExplanation: '', category: 'grammar', difficulty: 'beginner', dayNumber: 1 }); }} className="px-4 py-2 rounded-xl bg-white/10 text-gray-400 text-sm">Cancel</button>}
              </div>
            </form>
          </div>
        </div>
      )}

      {tab === 'quotes' && (
        <div className="glass-card space-y-4">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2"><MessageSquare size={18} /> Quotes</h2>
          <div className="space-y-2">
            {quotes.map((q, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                <div className="flex-1">
                  <p className="text-white text-sm">"{q.text}"</p>
                  <p className="text-xs text-gray-400 mt-1">— {q.author}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEditQuote(i)} className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"><Edit size={14} /></button>
                  <button onClick={() => handleDeleteQuote(i)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4">
            <h3 className="font-semibold text-white mb-3">Add New Quote</h3>
            <form onSubmit={addQuote} className="space-y-3">
              <textarea required placeholder="Quote text..." className="input-field resize-none h-24" value={quoteForm.text} onChange={(e) => setQuoteForm({ ...quoteForm, text: e.target.value })} />
              <input placeholder="Author name" className="input-field" value={quoteForm.author} onChange={(e) => setQuoteForm({ ...quoteForm, author: e.target.value })} />
              <button type="submit" className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Quote</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'vocabulary' && (
        <div className="glass-card space-y-4">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2"><BookOpen size={18} /> Vocabulary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vocabList.map((v, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                <div className="flex-1">
                  <p className="font-semibold text-white">{v.word}</p>
                  <p className="text-xs text-gray-400">{v.meaning}</p>
                  {v.hindiMeaning && <p className="text-xs text-gray-500">({v.hindiMeaning})</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEditVocab(i)} className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"><Edit size={14} /></button>
                  <button onClick={() => handleDeleteVocab(i)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4">
            <h3 className="font-semibold text-white mb-3">Add New Word</h3>
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
        </div>
      )}


      {/* Day Info Edit Modal */}
      {editingDayInfo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="glass-card max-w-md w-full mx-4 space-y-4">
            <h3 className="font-bold text-white">Edit Day {editingDayInfo.dayNumber} Info</h3>
            <form onSubmit={saveDayInfo} className="space-y-3">
              <input required placeholder="Title" className="input-field" value={editingDayInfo.title} onChange={(e) => setEditingDayInfo({ ...editingDayInfo, title: e.target.value })} />
              <textarea placeholder="Description" className="input-field resize-none h-20" value={editingDayInfo.description || ''} onChange={(e) => setEditingDayInfo({ ...editingDayInfo, description: e.target.value })} />
              <input placeholder="Theme" className="input-field" value={editingDayInfo.theme || ''} onChange={(e) => setEditingDayInfo({ ...editingDayInfo, theme: e.target.value })} />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 btn-primary">Save</button>
                <button type="button" onClick={() => setEditingDayInfo(null)} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl font-semibold transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="glass-card max-w-sm w-full mx-4 space-y-4">
            <p className="text-white font-semibold">Are you sure you want to delete this?</p>
            <p className="text-gray-400 text-sm">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleConfirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-semibold transition">Yes, Delete</button>
              <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl font-semibold transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
