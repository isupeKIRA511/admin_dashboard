import React from 'react';
import { useToastStore } from '../../store/useToastStore';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className={`px-4 py-3 rounded-xl border shadow-xl flex items-center gap-3 animate-in slide-in-from-right-4 min-w-[300px] ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
            toast.type === 'error' ? 'bg-red-50 border-red-100 text-red-800' :
            toast.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-800' :
            'bg-indigo-50 border-indigo-100 text-indigo-800'
          }`}
        >
          <div className="shrink-0">
            {toast.type === 'success' && <CheckCircle className="h-5 w-5" />}
            {toast.type === 'error' && <XCircle className="h-5 w-5" />}
            {toast.type === 'warning' && <AlertCircle className="h-5 w-5" />}
            {toast.type === 'info' && <Info className="h-5 w-5" />}
          </div>
          <p className="text-sm font-semibold flex-1">{toast.message}</p>
          <button 
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="h-4 w-4 opacity-50 hover:opacity-100" />
          </button>
        </div>
      ))}
    </div>
  );
};
