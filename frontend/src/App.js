import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import PremiumShell from './components/layout/PremiumShell';

import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home_new';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import DayChallenge from './pages/DayChallenge';
import DailyChallengePage from './pages/DailyChallengePage';
import Progress from './pages/Progress';
import Vocabulary from './pages/Vocabulary';
import Grammar from './pages/Grammar';
import Speaking from './pages/Speaking';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!user.onboardingDone) return <Navigate to="/onboarding" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

function AppRoutes() {
  return (
    <PremiumShell>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/day/:dayNumber" element={<PrivateRoute><DayChallenge /></PrivateRoute>} />
        <Route path="/daily-challenge" element={<PrivateRoute><DailyChallengePage /></PrivateRoute>} />
        <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
        <Route path="/vocabulary" element={<PrivateRoute><Vocabulary /></PrivateRoute>} />
        <Route path="/grammar" element={<PrivateRoute><Grammar /></PrivateRoute>} />
        <Route path="/speaking" element={<PrivateRoute><Speaking /></PrivateRoute>} />
        <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </PremiumShell>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <AppRoutes />
            <Toaster
            position="top-center"
            toastOptions={{
              style: { background: '#1F2937', color: '#fff', border: '1px solid #374151', borderRadius: '12px' },
              success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
            }}
          />
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
