import React, { useState } from 'react';
import { PlaneTakeoff, Lock, Phone } from 'lucide-react';
import { adminLogin } from '../lib/apiClient';

export const LoginPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await adminLogin(phoneNumber, password);
      // Store token for this browser session only (cleared when the tab/window is closed)
      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('adminPhone', response.phoneNumber);
      // Redirect to dashboard
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">

        <div className="text-center space-y-2">
          <div className="mx-auto h-16 w-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 ring-8 ring-slate-50">
            <PlaneTakeoff className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Teleport Admin</h1>
          <p className="text-sm text-slate-500 font-medium">Log in to manage the platform</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100 flex items-start gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">Phone Number</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="admin"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 font-medium transition-all"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 font-medium transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 flex items-center justify-center disabled:opacity-70"
          >
            {isLoading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

      </div>
    </div>
  );
};
