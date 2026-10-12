import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useHealthSync } from '../../context/HealthSyncContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useHealthSync();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let colorClasses = 'border-emerald-200 bg-white text-emerald-800 shadow-lg';
        let iconColor = 'text-emerald-500';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClasses = 'border-rose-200 bg-white text-rose-800 shadow-lg';
          iconColor = 'text-rose-500';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          colorClasses = 'border-amber-200 bg-white text-amber-800 shadow-lg';
          iconColor = 'text-amber-500';
        } else if (toast.type === 'info') {
          Icon = Info;
          colorClasses = 'border-indigo-200 bg-white text-indigo-800 shadow-lg';
          iconColor = 'text-indigo-500';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${colorClasses} animate-in slide-in-from-bottom-2 fade-in duration-200`}
            role="alert"
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              {toast.title && <h5 className="text-xs font-bold leading-tight">{toast.title}</h5>}
              <p className="text-xs font-medium text-slate-700 mt-0.5">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
