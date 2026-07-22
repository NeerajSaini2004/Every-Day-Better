import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Zap, PenLine, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const tabs = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/vocabulary', icon: BookOpen, label: 'Words' },
  { to: '/daily-challenge', icon: Zap, label: 'Challenge' },
  { to: '/grammar', icon: PenLine, label: 'Grammar' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
];

export default function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 px-1 pb-safe">
      <div className="flex items-center justify-around py-2">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${active ? 'text-blue-400' : 'text-gray-500'}`}>
              <Icon size={20} className={active ? 'scale-110' : ''} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
