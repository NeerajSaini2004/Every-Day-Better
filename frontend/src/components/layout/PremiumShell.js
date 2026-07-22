import React, { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

const AUTH_PATHS = ['/login', '/register', '/reset-password', '/forgot-password'];

export default function PremiumShell({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  const isAuthPage = AUTH_PATHS.some(p => location.pathname === p || location.pathname.startsWith(p + '/'));
  const isHomePage = location.pathname === '/';

  if (isAuthPage || isHomePage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <main className="min-h-[calc(100vh-4rem)] pb-24 md:pb-8 pt-6">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

