import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Flame, Zap, Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/vocabulary', label: 'Vocabulary' },
  { to: '/grammar', label: 'Grammar & Rules' },
  { to: '/speaking', label: 'Speaking' },
  { to: '/progress', label: 'Progress' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-black text-xl">
          <span className="text-2xl">📚</span>
          <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">Every Day Better</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {user && navLinks.map((l) => (
            <Link key={l.to} to={l.to} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === l.to ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-full text-sm font-bold">
                <Flame size={14} /> {user.streak || 0}
              </div>
              <div className="flex items-center gap-1 bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-full text-sm font-bold">
                <Zap size={14} /> {user.xp || 0} XP
              </div>
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm">
                {user.name?.[0]?.toUpperCase()}
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} className="hidden md:block text-sm text-gray-400 hover:text-white">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-2 px-4">Login</Link>
          )}
          <button className="md:hidden p-2 rounded-lg hover:bg-white/10" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-1">
          {user && navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${location.pathname === l.to ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
              {l.label}
            </Link>
          ))}
          {user && (
            <button onClick={() => { logout(); navigate('/'); setOpen(false); }} className="block w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-white/10">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
