import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import BadgeCard from '../components/ui/BadgeCard';
import ProgressBar from '../components/ui/ProgressBar';
import { getLevelName, getXPProgress, BADGES } from '../utils/constants';
import { Edit2, Save, X, Download, Share2, Lock, KeyRound, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const AVATAR_GRADIENTS = [
  'from-blue-500 to-purple-600',
  'from-green-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-pink-500 to-rose-600',
  'from-yellow-500 to-orange-600',
  'from-indigo-500 to-blue-600',
];
const getGradient = (name) => AVATAR_GRADIENTS[(name?.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length];

function ChangePassword() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.next !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.next.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await api.put('/users/change-password', { currentPassword: form.current, newPassword: form.next });
      toast.success('Password changed!');
      setOpen(false);
      setForm({ current: '', next: '', confirm: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
        <KeyRound size={14} /> Change Password
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-white/10">
      <p className="text-sm font-semibold text-white flex items-center gap-2"><KeyRound size={14} /> Change Password</p>
      {['current', 'next', 'confirm'].map((field) => (
        <div key={field} className="relative">
          <input
            type={show ? 'text' : 'password'}
            placeholder={field === 'current' ? 'Current password' : field === 'next' ? 'New password' : 'Confirm new password'}
            value={form[field]}
            onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
            className="input-field pr-10 text-sm"
            required
          />
          {field === 'next' && (
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {show ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          )}
        </div>
      ))}
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn-primary py-2 text-sm flex-1 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Password'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn-secondary py-2 text-sm px-4">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  const handleSave = async () => {
    try {
      const { data } = await api.put('/users/profile', { name });
      updateUser({ name: data.name });
      setEditing(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleShare = () => {
    const text = `I've completed ${(user?.completedDays || []).length} days of the 60-Day English Challenge on Every Day Better! 🔥 My streak: ${user?.streak} days. Join me! #EveryDayBetter #EnglishLearning`;
    if (navigator.share) {
      navigator.share({ title: 'Every Day Better', text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Progress copied to clipboard!');
    }
  };

  const handleDownloadCertificate = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 900; canvas.height = 600;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 900, 600);
    grad.addColorStop(0, '#0f172a'); grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 900, 600);
    ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 6; ctx.strokeRect(20, 20, 860, 560);
    ctx.strokeStyle = '#10B981'; ctx.lineWidth = 2; ctx.strokeRect(30, 30, 840, 540);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 48px Arial'; ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', 450, 120);
    ctx.fillStyle = '#94a3b8'; ctx.font = '22px Arial';
    ctx.fillText('Every Day Better — 60-Day English Challenge', 450, 165);
    ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(150, 190); ctx.lineTo(750, 190); ctx.stroke();
    ctx.fillStyle = '#60a5fa'; ctx.font = 'bold 36px Arial';
    ctx.fillText('This certifies that', 450, 250);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 52px Arial';
    ctx.fillText(user?.name || 'Champion', 450, 320);
    ctx.fillStyle = '#94a3b8'; ctx.font = '20px Arial';
    ctx.fillText('has successfully completed the 60-Day English Challenge', 450, 380);
    ctx.fillText(`with ${user?.xp || 0} XP earned and a ${user?.longestStreak || 0}-day best streak`, 450, 415);
    ctx.fillStyle = '#6b7280'; ctx.font = '16px Arial';
    ctx.fillText(`Completed on: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, 450, 490);
    ctx.font = '40px Arial'; ctx.fillText('🏆', 450, 545);
    const link = document.createElement('a');
    link.download = `EDB-Certificate-${user?.name?.replace(/\s/g, '-')}.png`;
    link.href = canvas.toDataURL(); link.click();
    toast.success('Certificate downloaded! 🎓');
  };

  const level = user?.level || 1;
  const xp = user?.xp || 0;
  const levelProgress = getXPProgress(xp, level);
  const levelStartXP = (level - 1) * 500;
  const xpInLevel = xp - levelStartXP;
  const completedCount = (user?.completedDays || []).length;
  const weeksCompleted = Math.floor(completedCount / 7);
  const earnedBadges = user?.badges || [];
  const lockedBadges = Object.keys(BADGES).filter((k) => !earnedBadges.includes(k));
  const gradient = getGradient(user?.name);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

      {/* Hero Banner */}
      <div className="relative glass-card bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-500/20 overflow-hidden p-6">
        {/* Glow blobs */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-center gap-5">
          {/* Avatar */}
          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center text-3xl font-black text-white shrink-0 shadow-lg`}>
            {user?.name?.[0]?.toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex gap-2 mb-2">
                <input value={name} onChange={(e) => setName(e.target.value)} className="input-field text-sm py-2 flex-1" autoFocus />
                <button onClick={handleSave} className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"><Save size={16} /></button>
                <button onClick={() => { setEditing(false); setName(user?.name || ''); }} className="p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20"><X size={16} /></button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-white truncate">{user?.name}</h2>
                <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300 shrink-0">
                  <Edit2 size={13} />
                </button>
              </div>
            )}
            <p className="text-gray-400 text-sm truncate">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="badge bg-blue-500/20 text-blue-400 border border-blue-500/20">Level {level}</span>
              <span className="badge bg-purple-500/20 text-purple-400 border border-purple-500/20">{getLevelName(level)}</span>
              {user?.role === 'admin' && <span className="badge bg-red-500/20 text-red-400 border border-red-500/20">Admin</span>}
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="relative mt-5">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Level {level} Progress</span>
            <span>{xpInLevel} / 500 XP · {500 - xpInLevel} XP to Level {level + 1}</span>
          </div>
          <ProgressBar value={levelProgress} color="purple" size="md" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {[
          { label: 'Days Done', value: completedCount, sub: 'of 60', color: 'text-blue-400', bg: 'from-blue-900/30 to-blue-900/10', border: 'border-blue-500/20' },
          { label: 'Streak', value: `${user?.streak || 0}🔥`, sub: 'current', color: 'text-orange-400', bg: 'from-orange-900/30 to-orange-900/10', border: 'border-orange-500/20' },
          { label: 'Best Streak', value: user?.longestStreak || 0, sub: 'all time', color: 'text-yellow-400', bg: 'from-yellow-900/30 to-yellow-900/10', border: 'border-yellow-500/20' },
          { label: 'Total XP', value: xp.toLocaleString(), sub: `Lv.${level}`, color: 'text-purple-400', bg: 'from-purple-900/30 to-purple-900/10', border: 'border-purple-500/20' },
          { label: 'Weeks Done', value: weeksCompleted, sub: 'of 9', color: 'text-green-400', bg: 'from-green-900/30 to-green-900/10', border: 'border-green-500/20' },
        ].map(({ label, value, sub, color, bg, border }) => (
          <div key={label} className={`glass-card bg-gradient-to-br ${bg} ${border} text-center p-3`}>
            <p className={`text-xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            <p className="text-[10px] text-gray-600">{sub}</p>
          </div>
        ))}
      </div>

      {/* Journey Progress */}
      <div className="glass-card space-y-3">
        <h2 className="font-bold text-white text-sm">🗺️ Your Journey</h2>
        <div className="grid grid-cols-9 gap-1">
          {Array.from({ length: 9 }, (_, w) => {
            const weekDone = Math.min(completedCount - w * 7, 7);
            const pct = Math.max(0, Math.round((weekDone / 7) * 100));
            return (
              <div key={w} className="text-center">
                <div className={`h-12 rounded-lg flex items-end justify-center pb-1 text-[9px] font-bold transition-all
                  ${pct === 100 ? 'bg-green-500/30 text-green-400' : pct > 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-700'}`}
                  style={{ alignItems: 'flex-end' }}
                >
                  <div className={`w-full rounded-md transition-all ${pct === 100 ? 'bg-green-500' : 'bg-blue-500/60'}`} style={{ height: `${Math.max(pct, 4)}%` }} />
                </div>
                <p className="text-[9px] text-gray-600 mt-1">W{w + 1}</p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 text-center">
          {completedCount === 0 ? 'Start Day 1 to begin your journey! 🚀' : completedCount >= 60 ? '🎉 All 60 days complete! You\'re a champion!' : `${completedCount} days done · ${60 - completedCount} to go`}
        </p>
      </div>

      {/* Badges */}
      <div className="glass-card space-y-3">
        <h2 className="font-bold text-white text-sm">🏅 Badges</h2>
        {earnedBadges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map((b) => <BadgeCard key={b} badgeKey={b} />)}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Complete days to earn your first badge!</p>
        )}

        {lockedBadges.length > 0 && (
          <div className="border-t border-white/5 pt-3">
            <p className="text-xs text-gray-600 mb-2 flex items-center gap-1"><Lock size={11} /> Locked badges</p>
            <div className="flex flex-wrap gap-2">
              {lockedBadges.map((k) => (
                <div key={k} className="badge bg-white/5 text-gray-600 border border-white/5 opacity-50 grayscale">
                  <span>{BADGES[k].icon}</span>
                  <span>{BADGES[k].label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="glass-card space-y-4">
        <h2 className="font-bold text-white text-sm">⚙️ Account</h2>
        <ChangePassword />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={handleShare} className="btn-secondary flex items-center gap-2 flex-1 justify-center">
          <Share2 size={16} /> Share Progress
        </button>
        {completedCount >= 60 ? (
          <button onClick={handleDownloadCertificate} className="btn-primary flex items-center gap-2 flex-1 justify-center">
            <Download size={16} /> Certificate
          </button>
        ) : (
          <div className="flex-1 glass-card text-center py-3 border-dashed border-white/20 opacity-60">
            <p className="text-xs text-gray-400">🎓 Certificate at Day 60</p>
            <p className="text-xs text-gray-600">{60 - completedCount} days left</p>
          </div>
        )}
      </div>
    </div>
  );
}
