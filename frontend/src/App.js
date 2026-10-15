import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import PremiumShell from './components/layout/PremiumShell';
import ErrorBoundary from './components/ErrorBoundary';
import Spinner from './components/ui/Spinner';

// Eagerly loaded for instant landing page speed
import Home from './pages/Home_new';

// Code-split chunks loaded on demand
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DayChallenge = lazy(() => import('./pages/DayChallenge'));
const DailyChallengePage = lazy(() => import('./pages/DailyChallengePage'));
const Progress = lazy(() => import('./pages/Progress'));
const Vocabulary = lazy(() => import('./pages/Vocabulary'));
const Grammar = lazy(() => import('./pages/Grammar'));
const Speaking = lazy(() => import('./pages/Speaking'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/Admin'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));

const RouteLoading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner size={36} />
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.onboardingDone === false) return <Navigate to="/onboarding" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

function AppRoutes() {
  return (
    <PremiumShell>
      <Suspense fallback={<RouteLoading />}>
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
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </PremiumShell>
  );
}


export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
    </BrowserRouter>
  );
}
