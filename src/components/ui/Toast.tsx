import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getBg = () => {
    switch (toast.type) {
      case 'success': return 'bg-slate-900 border-emerald-500/80 text-white';
      case 'error': return 'bg-slate-900 border-rose-500/80 text-white';
      default: return 'bg-slate-900 border-blue-500/80 text-white';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      default: return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
    }
  };

  return (
    <div className={`pointer-events-auto border rounded-xl p-4 shadow-2xl flex items-start gap-3 transition-all animate-slide-up ${getBg()}`}>
      {getIcon()}
      <div className="flex-1 space-y-0.5">
        <h4 className="text-xs font-bold font-serif">{toast.title}</h4>
        <p className="text-[11px] text-slate-300 leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-white p-0.5 rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
