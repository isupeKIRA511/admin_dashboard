import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useToastStore } from '../../store/useToastStore';
import { Building2, Star } from 'lucide-react';
import type { CompanyModel } from '../../types/admin';
import { createCompany, updateCompany } from '../../services/adminService';

interface CompanyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyModel | null;
}

export const CompanyFormModal: React.FC<CompanyFormModalProps> = ({ isOpen, onClose, company }) => {
  const addToast = useToastStore((state) => state.addToast);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<{ name: string; status: boolean; reputationScore?: number }>({
    name: '',
    status: true,
    reputationScore: undefined,
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        status: company.status,
        reputationScore: company.reputationScore ?? undefined,
      });
    } else {
      setFormData({
        name: '',
        status: true,
        reputationScore: undefined,
      });
    }
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (company) {
        // Update - send only the editable fields the endpoint expects
        const payload: Partial<CompanyModel> = {
          name: formData.name,
          status: formData.status,
          ...(typeof formData.reputationScore === 'number' ? { reputationScore: formData.reputationScore } : {}),
        };
        await updateCompany(company.id, payload);
        addToast(`Company ${formData.name} updated successfully.`, 'success');
      } else {
        // Create - send only the fields shown in the API (name, optional reputationScore)
        const payload: Partial<CompanyModel> = {
          name: formData.name,
          ...(typeof formData.reputationScore === 'number' ? { reputationScore: formData.reputationScore } : {}),
        };
        await createCompany(payload);
        addToast(`Company ${formData.name} created successfully.`, 'success');
      }
      onClose();
    } catch (error: any) {
      console.error(error);
      addToast(error.message || `Failed to save company`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={company ? "Edit Company Structure" : "Register Enterprise"}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : (company ? 'Save Configurations' : 'Register Enterprise')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-8 max-h-[65vh] overflow-y-auto px-2 pr-4 scrollbar-hide">

        {/* Section 1: Basic Information */}
        <div className="space-y-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
            <Building2 className="h-24 w-24" />
          </div>

          <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-primary/10 pb-3 flex items-center gap-2">
            <div className="h-5 w-5 bg-primary/10 rounded flex items-center justify-center">
              <Building2 className="h-3 w-3" />
            </div>
            Corporate Identity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                Registered Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Al-Fursan Logistics L.L.C"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                Reputation Score (0-100)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium transition-all"
                  value={formData.reputationScore ?? ''}
                  onChange={(e) => setFormData({ ...formData, reputationScore: e.target.value ? parseInt(e.target.value) : undefined })}
                />
                <Star className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Information (UI Detailed Presentation) */}
        <div className="space-y-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-24 w-24"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
          </div>

          <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest border-b border-emerald-50/50 pb-3 flex items-center gap-2">
            <div className="h-5 w-5 bg-emerald-50 rounded flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            </div>
            Contact & Address
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                Primary Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="contact@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium transition-all"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-3 h-4 w-4 text-slate-400"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                Support Phone Line
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+964 7XX XXX XXXX"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium transition-all"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-3 h-4 w-4 text-slate-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                Headquarters Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Al-Mansour, Baghdad, Iraq"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium transition-all"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-3 h-4 w-4 text-slate-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Legal & Status */}
        <div className="space-y-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-24 w-24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
          </div>

          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest border-b border-amber-50/50 pb-3 flex items-center gap-2">
            <div className="h-5 w-5 bg-amber-50 rounded flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
            </div>
            Legal Documentation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                Commercial Register (CR)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="xxxxxxxxxx"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-sm font-medium transition-all"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-3 h-4 w-4 text-slate-400"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                Tax Identification Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="3000xxxxxxxxx"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-sm font-medium transition-all"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-3 h-4 w-4 text-slate-400"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              </div>
            </div>

            <div className="md:col-span-2 pt-2">
              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${formData.status ? 'bg-green-50/50 border-green-200 hover:bg-green-50' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-green-600 rounded-md border-slate-300 focus:ring-green-500 transition-all"
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                />
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">Operational Status</span>
                    <span className="text-[11px] font-medium text-slate-500">Enable or disable this company's platform access</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${formData.status ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                    {formData.status ? 'Active' : 'Suspended'}
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

      </form>
    </Modal>
  );
};
