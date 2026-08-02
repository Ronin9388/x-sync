import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-xl shadow-2xl border flex items-start space-x-3 transition-all duration-300 animate-slide-in ${
            toast.type === 'success'
              ? 'bg-[#0F1419] border-emerald-500/50 text-emerald-300'
              : toast.type === 'error'
              ? 'bg-[#0F1419] border-red-500/50 text-red-300'
              : 'bg-[#0F1419] border-[#1D9BF0]/50 text-[#1D9BF0]'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#1D9BF0] shrink-0 mt-0.5" />}

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white">{toast.title}</h4>
            {toast.message && <p className="text-[11px] text-[#E7E9EA] mt-0.5">{toast.message}</p>}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-[#71767B] hover:text-white p-1 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
