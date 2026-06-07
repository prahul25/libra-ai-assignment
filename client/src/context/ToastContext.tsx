import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className={`flex items-center gap-2.5 py-3.5 px-5 text-sm font-medium min-w-65 rounded-(--radius-sm) bg-(--bg-card) shadow-(--shadow-lg) animate-[slideUp_0.35s_ease_forwards] border-l-4 ${t.type === 'success' ? 'border-(--success) text-(--success)' : 'border-(--danger) text-(--danger)'}`}>
            <span className={`flex items-center justify-center w-5.5 h-5.5 rounded-full text-[0.75rem] font-bold ${t.type === 'success' ? 'bg-(--success-soft)' : 'bg-[rgba(239,68,68,0.1)]'}`}>
              {t.type === 'success' ? '✓' : '✕'}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
