import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock } from 'lucide-react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

function LoginModal({ isOpen, onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let res;
      if (isRegister) {
        res = await apiClient.post('/auth/register', { email, password });
      } else {
        const form = new URLSearchParams();
        form.append('username', email);
        form.append('password', password);
        res = await apiClient.post('/auth/login', form, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
      }


      login(res.data);
      onClose();
      navigate('/portal');
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-md">
        {/* Ambient glow behind the modal — same floating-orb language as the
            hero section, just tucked in close, for a soft "watery" backdrop. */}
        <div className="absolute -inset-8 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl" />
        </div>

        <div
          className="glass-card-static relative w-full rounded-3xl p-8 space-y-6 border border-white/10 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Subtle top sheen line for a touch of premium polish */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-400/40 to-transparent" />

          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition">
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2">
            <img src="/favicon.png" alt="Network Design Labs" className="w-25 h-25 rounded-2xl mx-auto mb-3 shadow-lg shadow-blue-500/10" />
            <h2 className="font-display text-2xl font-bold text-white">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-slate-400">
              {isRegister ? 'Join 5,000+ students learning Cisco skills' : 'Sign in to your student portal'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 flex items-center space-x-1.5">
                <Mail className="h-3.5 w-3.5" /><span>Email Address</span>
              </label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/8 focus:border-blue-500/60 rounded-xl px-4 py-3 text-white outline-none transition text-sm placeholder-slate-600"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 flex items-center space-x-1.5">
                <Lock className="h-3.5 w-3.5" /><span>Password</span>
              </label>
              <input
                type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/8 focus:border-blue-500/60 rounded-xl px-4 py-3 text-white outline-none transition text-sm placeholder-slate-600"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In to Portal'}
            </button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-white/6" />
            <span className="mx-4 text-slate-600 text-xs font-bold">OR</span>
            <div className="grow border-t border-white/6" />
          </div>

          <button
            onClick={() => {
              setError('Google login is in setup mode. Please use email & password.');
            }}
            className="w-full py-3 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.68 14.93 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.05 7.34 8.78 5.04 12 5.04z" />
              <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.6-.21-2.25H12v4.26h6.45c-.28 1.47-1.11 2.72-2.36 3.56l3.6 2.8c2.1-1.94 3.81-4.78 3.81-8.37z" />
              <path fill="#FBBC05" d="M5.1 14.7c-.23-.69-.36-1.43-.36-2.2s.13-1.51.36-2.2L1.5 7.5C.54 9.4 0 11.64 0 14s.54 4.6 1.5 6.5l3.6-2.8z" />
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.9l-3.6-2.8c-1.1.74-2.52 1.18-4.36 1.18-3.22 0-5.95-2.3-6.9-5.46l-3.6 2.8C3.4 20.35 7.35 23 12 23z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="text-center">
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-xs text-blue-400 hover:underline">
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up Free"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;