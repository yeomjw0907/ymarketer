'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const success = useCallback((message: string) => showToast('success', message), [showToast]);
  const error = useCallback((message: string) => showToast('error', message), [showToast]);
  const warning = useCallback((message: string) => showToast('warning', message), [showToast]);
  const info = useCallback((message: string) => showToast('info', message), [showToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const config = {
    success: {
      icon: CheckCircle,
      bg: 'bg-white',
      iconColor: 'text-black',
      border: 'border-black',
    },
    error: {
      icon: XCircle,
      bg: 'bg-white',
      iconColor: 'text-red',
      border: 'border-red',
    },
    warning: {
      icon: AlertCircle,
      bg: 'bg-white',
      iconColor: 'text-gray-600',
      border: 'border-gray-600',
    },
    info: {
      icon: Info,
      bg: 'bg-white',
      iconColor: 'text-black',
      border: 'border-black',
    },
  };

  const { icon: Icon, bg, iconColor, border } = config[toast.type];

  return (
    <div
      className={`${bg} ${border} border shadow-lg px-4 py-3 flex items-center gap-3 min-w-[300px] max-w-md pointer-events-auto animate-slide-in-right`}
    >
      <Icon className={`w-5 h-5 ${iconColor} shrink-0`} />
      <p className="text-sm font-semibold text-black flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="shrink-0 text-gray-400 hover:text-black transition-colors"
        aria-label="닫기"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
