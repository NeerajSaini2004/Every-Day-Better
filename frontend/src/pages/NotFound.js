import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center space-y-5 max-w-sm">
        <p className="text-7xl">🔍</p>
        <div>
          <h1 className="text-4xl font-black text-white">404</h1>
          <p className="text-gray-400 mt-2">This page doesn't exist.</p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary px-5 py-2.5 text-sm"
          >
            ← Go Back
          </button>
          <button
            onClick={() => navigate(user ? '/dashboard' : '/')}
            className="btn-primary px-5 py-2.5 text-sm"
          >
            {user ? 'Dashboard' : 'Home'}
          </button>
        </div>
      </div>
    </div>
  );
}
