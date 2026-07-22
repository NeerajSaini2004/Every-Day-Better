import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Spinner from '../components/ui/Spinner';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent!');
      if (data.resetUrl) console.info('Dev reset URL:', data.resetUrl);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Password reset! Welcome back 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired link');
    } finally { setLoading(false); }
  };

  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🔐</div>
            <h1 className="text-3xl font-black text-white">Set New Password</h1>
            <p className="text-gray-400 mt-1">Enter your new password below</p>
          </div>
          <div className="glass-card">
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">New Password</label>
                <div className="relative">
                  <input type={show ? 'text' : 'password'} required minLength={6} placeholder="Min 6 characters" className="input-field pr-10" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
                {loading ? <Spinner size={18} /> : 'Reset Password ✅'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📧</div>
          <h1 className="text-3xl font-black text-white">Forgot Password?</h1>
          <p className="text-gray-400 mt-1">Enter your email to get a reset link</p>
        </div>
        <div className="glass-card">
          {sent ? (
            <div className="text-center py-4">
              <p className="text-4xl mb-3">✅</p>
              <p className="text-white font-bold">Reset link sent!</p>
              <p className="text-gray-400 text-sm mt-1">Check your email inbox. (In dev mode, check console)</p>
              <Link to="/login" className="btn-primary inline-flex mt-4">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                <input type="email" required placeholder="you@example.com" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
                {loading ? <Spinner size={18} /> : 'Send Reset Link 📧'}
              </button>
              <p className="text-center text-sm text-gray-500">
                Remember it? <Link to="/login" className="text-blue-400 hover:text-blue-300">Login</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
