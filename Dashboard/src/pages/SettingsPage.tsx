import React, { useState, useEffect } from 'react';
import {
  Save,
  Loader2,
  Settings as SettingsIcon,
  Globe,
  BadgeDollarSign,
  ShieldCheck,
  Clock,
  Layout
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { fetchApi } from '../lib/apiClient';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    platformName: '',
    defaultCommission: 0,
    settlementFrequency: 'weekly',
    autoApproveVendors: false
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchApi<any>('/settings');
        if (data) {
          setSettings({
            platformName: data.platformName || '',
            defaultCommission: data.defaultCommission || 0,
            settlementFrequency: data.settlementFrequency || 'weekly',
            autoApproveVendors: data.autoApproveVendors || false
          });
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        setMessage({ type: 'error', text: 'فشل في جلب الإعدادات من الخادم.' });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await fetchApi('/settings', 'PUT', settings);
      setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage({ type: 'error', text: 'حدث خطأ أثناء حفظ الإعدادات.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-slate-500 font-medium">جاري تحميل إعدادات النظام...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm">
            <SettingsIcon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Controls</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Manage global configurations and business logic</p>
          </div>
        </div>

        {message.text && (
          <div className={`px-5 py-3 rounded-2xl text-xs font-bold border animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
            <span className="flex items-center gap-2">
              {message.type === 'success' ? <ShieldCheck className="h-4 w-4" /> : null}
              {message.text}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Sections */}
        <div className="lg:col-span-2 space-y-8">

          {/* Section: Platform Identity */}
          <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                  <Layout className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Platform Identity</h2>
                  <p className="text-xs text-slate-400 font-medium">Core branding and identification details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Platform Public Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={settings.platformName}
                      onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700"
                      placeholder="e.g. TransPay Enterprise"
                      required
                    />
                    <Globe className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Financial Logic */}
          <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                  <BadgeDollarSign className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Revenue & Payouts</h2>
                  <p className="text-xs text-slate-400 font-medium">Configure commissions and settlement cycles</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Default Commission (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={settings.defaultCommission}
                      onChange={(e) => setSettings({ ...settings, defaultCommission: parseFloat(e.target.value) })}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700"
                      required
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-slate-300">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Settlement Cycle</label>
                  <div className="relative">
                    <select
                      value={settings.settlementFrequency}
                      onChange={(e) => setSettings({ ...settings, settlementFrequency: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700 appearance-none pointer-events-auto"
                    >
                      <option value="daily">Daily Settlements</option>
                      <option value="weekly">Weekly Cycle</option>
                      <option value="monthly">Monthly Accounting</option>
                    </select>
                    <Clock className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Actions & Governance */}
        <div className="space-y-8">

          <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Governance</h2>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => setSettings({ ...settings, autoApproveVendors: !settings.autoApproveVendors })}>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-slate-200" style={{ backgroundColor: settings.autoApproveVendors ? 'hsl(var(--primary))' : 'rgb(226, 232, 240)' }}>
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.autoApproveVendors ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">Auto-Approve Vendors</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">Automatically activate new company registrations without manual review.</p>
                </div>
              </div>
            </div>
          </section>

          <div className="sticky top-24 space-y-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full py-4 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70 group"
            >
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />}
              {isSaving ? 'Synchronizing...' : 'Commit Changes'}
            </Button>

            <p className="text-[10px] text-center text-slate-400 font-medium uppercase tracking-widest">
              Last modified: {new Date().toLocaleDateString()}
            </p>
          </div>

        </div>

      </form>
    </div>
  );
};