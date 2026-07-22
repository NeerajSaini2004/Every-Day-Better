import React from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 dark:bg-gray-950">
      <Navbar />
      <main className="pb-20 md:pb-8">{children}</main>
      <BottomNav />
    </div>
  );
}
