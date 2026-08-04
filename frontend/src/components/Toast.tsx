import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/40 bg-emerald-950/40 text-emerald-100';
      case 'error':
        return 'border-rose-500/40 bg-rose-950/40 text-rose-100';
      default:
        return 'border-blue-500/40 bg-blue-950/40 text-blue-100';
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border backdrop-blur-md shadow-2xl flex items-center space-x-3 transition-all animate-fadeIn ${getBorderColor()}`}>
      {getIcon()}
      <span className="text-xs font-semibold">{message}</span>
      <button onClick={onClose} className="p-1 opacity-70 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
