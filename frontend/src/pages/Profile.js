import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import BadgeCard from '../components/ui/BadgeCard';
import ProgressBar from '../components/ui/ProgressBar';
import { getLevelName, getXPProgress } from '../utils/constants';
import { Edit2, Save, X, Download, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

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
    canvas.width = 900;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Background
    const grad = ctx.createLinearGradient(0, 0, 900, 600);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 900, 600);

    // Border
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, 860, 560);
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 840, 540);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', 450, 120);

    // Subtitle
    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px Arial';
    ctx.fillText('Every Day Better — 60-Day English Challenge', 450, 165);

    // Divider
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, 190);
    ctx.lineTo(750, 190);
    ctx.stroke();

    // Name
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 36px Arial';
    ctx.fillText('This certifies that', 450, 250);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px Arial';
    ctx.fillText(user?.name || 'Champion', 450, 320);

    // Body
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px Arial';
    ctx.fillText('has successfully completed the 60-Day English Challenge', 450, 380);
    ctx.fillText(`with ${user?.xp || 0} XP earned and a ${user?.longestStreak || 0}-day best streak`, 450, 415);

    // Date
    ctx.fillStyle = '#6b7280';
    ctx.font = '16px Arial';
    ctx.fillText(`Completed on: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, 450, 490);

    // Emoji
    ctx.font = '40px Arial';
    ctx.fillText('🏆', 450, 545);

    const link = document.createElement('a');
    link.download = `EDB-Certificate-${user?.name?.replace(/\s/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
    toast.success('Certificate downloaded! 🎓');
  };

  const levelProgress = getXPProgress(user?.xp || 0, user?.level || 1);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-black text-white">Profile 👤</h1>

      {/* Profile Card */}
      <div className="glass-card">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-black shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="flex gap-2">
                <input value={name} onChange={(e) => setName(e.target.value)} className="input-field text-sm py-2" />
                <button onClick={handleSave} className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"><Save size={16} /></button>
                <button onClick={() => setEditing(false)} className="p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20"><X size={16} /></button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{user?.name}</h2>
                <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300"><Edit2 size={14} /></button>
              </div>
            )}
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge bg-blue-500/20 text-blue-400">Level {user?.level}</span>
              <span className="badge bg-purple-500/20 text-purple-400">{getLevelName(user?.level || 1)}</span>
              {user?.role === 'admin' && <span className="badge bg-red-500/20 text-red-400">Admin</span>}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Level Progress</span>
            <span>{user?.xp || 0} / {(user?.level || 1) * 500} XP</span>
          </div>
          <ProgressBar value={levelProgress} color="purple" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Days Done', value: (user?.completedDays || []).length },
          { label: 'Streak', value: `${user?.streak || 0} 🔥` },
          { label: 'Total XP', value: user?.xp || 0 },
        ].map(({ label, value }) => (
          <div key={label} className="glass-card text-center">
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="glass-card">
        <h2 className="font-bold text-white mb-3">🏅 Badges Earned</h2>
        {(user?.badges || []).length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.badges.map((b) => <BadgeCard key={b} badgeKey={b} />)}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Complete days to earn badges!</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={handleShare} className="btn-secondary flex items-center gap-2 flex-1 justify-center">
          <Share2 size={16} /> Share Progress
        </button>
        {(user?.completedDays || []).length >= 60 ? (
          <button onClick={handleDownloadCertificate} className="btn-primary flex items-center gap-2 flex-1 justify-center">
            <Download size={16} /> Download Certificate
          </button>
        ) : (
          <div className="flex-1 glass-card text-center py-3 border-dashed border-white/20 opacity-60">
            <p className="text-xs text-gray-400">🎓 Certificate unlocks at Day 60</p>
            <p className="text-xs text-gray-600">{60 - (user?.completedDays || []).length} days remaining</p>
          </div>
        )}
      </div>
    </div>
  );
}
