import React, { useState, useEffect } from 'react';
import { Save, Loader2, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { fetchApi } from '../lib/api';

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
        const data = await fetchApi('/api/settings');
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
      await fetchApi('/api/settings', 'PUT', settings);
      setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح.' });
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
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-500 font-medium">جاري تحميل إعدادات النظام...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center border border-slate-200">
          <SettingsIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Platform Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Configure global platform parameters and rules</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSave} className="p-6 space-y-6">
          
          {message.text && (
            <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Platform Name</label>
              <input 
                type="text" 
                value={settings.platformName}
                onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Default Commission Rate (%)</label>
              <input 
                type="number" 
                min="0"
                max="100"
                step="0.1"
                value={settings.defaultCommission}
                onChange={(e) => setSettings({...settings, defaultCommission: parseFloat(e.target.value)})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Settlement Frequency</label>
              <select 
                value={settings.settlementFrequency}
                onChange={(e) => setSettings({...settings, settlementFrequency: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.autoApproveVendors}
                onChange={(e) => setSettings({...settings, autoApproveVendors: e.target.checked})}
                className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <div className="text-sm font-semibold text-slate-700">Auto-Approve New Vendors</div>
                <div className="text-xs text-slate-500 mt-0.5">Automatically activate company accounts upon registration.</div>
              </div>
            </label>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};