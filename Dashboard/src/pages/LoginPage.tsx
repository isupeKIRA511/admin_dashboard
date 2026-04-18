import React, { useState } from 'react';
import { PlaneTakeoff, Lock, Phone, ArrowRight } from 'lucide-react';
import { adminLogin } from '../lib/apiClient';

export const LoginPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const APP_NAME = "TransPay";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await adminLogin(phoneNumber, password);
      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('adminPhone', response.phoneNumber);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-primary/30">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 p-10 space-y-10 animate-in fade-in zoom-in-95 duration-700">

        <div className="text-center space-y-4">
          <div className="mx-auto h-20 w-20 bg-primary/20 rounded-3xl flex items-center justify-center mb-6 ring-8 ring-slate-50 shadow-inner group transition-all duration-500 hover:scale-110">
            <PlaneTakeoff className="h-10 w-10 text-primary group-hover:rotate-12 transition-transform" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter">{APP_NAME}</h1>
            <p className="text-slate-500 font-semibold tracking-wide uppercase text-[10px]">Secure Admin Portal</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3 animate-shake">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="login-phone" className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] block ml-1">
              Phone Identity
            </label>
            <div className="relative group">
              <input
                id="login-phone"
                type="text"
                required
                placeholder="09XXXXXXXX"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none text-slate-700 font-bold transition-all placeholder:text-slate-300"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="login-password" className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] block ml-1">
              Access Password
            </label>
            <div className="relative group">
              <input
                id="login-password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none text-slate-700 font-bold transition-all placeholder:text-slate-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <span className="h-5 w-5 border-3 border-current border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Launch Dashboard</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 text-center">
            <p className="text-[10px] text-slate-400 font-medium">© {new Date().getFullYear()} {APP_NAME} Infrastructure. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
};
