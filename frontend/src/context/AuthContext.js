import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const parseStoredUser = () => {
  try {
    const saved = localStorage.getItem('user');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    // Validate that parsed user has required fields
    if (parsed && typeof parsed === 'object' && parsed.email) {
      return parsed;
    }
    return null;
  } catch (error) {
    // Silently handle any errors to prevent app crash
    try {
      localStorage.removeItem('user');
    } catch {}
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(parseStoredUser);
  const [loading, setLoading] = useState(false);

  const saveUser = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      saveUser(data.user, data.token);
      toast.success(`Welcome, ${data.user.name}! 🎉`);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      saveUser(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}! 🔥`);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback((silent = false) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    if (!silent) toast.success('Logged out successfully');
  }, []);

  useEffect(() => {
    const handleTokenExpiry = () => {
      logout(true);
      toast.error('Session expired. Please login again.');
    };
    window.addEventListener('auth:logout', handleTokenExpiry);
    return () => window.removeEventListener('auth:logout', handleTokenExpiry);
  }, [logout]);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Re-fetch fresh user data from server (call after profile edits)
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/users/profile');
      updateUser(data);
    } catch {}
  }, [updateUser]);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
