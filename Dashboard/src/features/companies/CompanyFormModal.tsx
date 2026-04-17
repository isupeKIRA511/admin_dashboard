import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useToastStore } from '../../store/useToastStore';
import { Building2, Star, CheckCircle } from 'lucide-react';
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

  const [formData, setFormData] = useState({
    name: '',
    status: true,
    reputationScore: 80,
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        status: company.status,
        reputationScore: company.reputationScore,
      });
    } else {
      setFormData({
        name: '',
        status: true,
        reputationScore: 80,
      });
    }
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (company) {
        // Update
        const payload: Partial<CompanyModel> = {
          ...formData, // name, status, reputationScore
          id: company.id,
          createdAt: company.createdAt,
          deletedAt: company.deletedAt || "0001-01-01T00:00:00Z"
        };
        await updateCompany(company.id, payload);
        addToast(`Company ${formData.name} updated successfully.`, 'success');
      } else {
        // Create
        const newId = crypto.randomUUID();
        const payload: Partial<CompanyModel> = {
          id: newId,
          name: formData.name,
          status: formData.status,
          reputationScore: formData.reputationScore,
          createdAt: new Date().toISOString(),
          deletedAt: "0001-01-01T00:00:00Z"
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
      title={company ? "Edit Company" : "Add New Company"}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (company ? 'Save Changes' : 'Create Company')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto px-1 pr-3 scrollbar-hide">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building2 className="h-3 w-3" /> Core Company Details
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Company Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Baghdad Express"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Reputation Score (0-100)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                  value={formData.reputationScore}
                  onChange={(e) => setFormData({ ...formData, reputationScore: parseInt(e.target.value) })}
                />
                <Star className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

             <div className="pt-2">
              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                />
                <div className="flex items-center gap-2">
                   <span className="text-xs font-bold text-slate-700">Active Status</span>
                   <CheckCircle className={`h-4 w-4 ${formData.status ? 'text-green-500' : 'text-slate-300'}`} />
                </div>
              </label>
            </div>

          </div>
        </div>
      </form>
    </Modal>
  );
};
