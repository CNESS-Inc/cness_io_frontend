import React, { createContext, useContext, useState } from 'react';
import Toast from './Toast';
import NotificationToast from './NotificationToast.tsx'; // We'll create this component

type ToastType = {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'cute' | 'notification';
  duration?: number;
  title?: string; // For notification toasts
};

type ToastContextType = {
  showToast: (toast: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const showToast = (toast: ToastType) => {
    setToasts((prev) => [...prev, toast]);
  };

  const removeToast = (index: number) => {
    setToasts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Regular toasts (top center) */}
      <div className="fixed z-50 w-full pointer-events-none top-0 left-0 flex flex-col items-center">
        {toasts.map((toast, index) => 
          toast.type !== 'notification' && (
            <Toast
              key={index}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(index)}
            />
          )
        )}
      </div>
      
      {/* Notification toasts (left bottom) */}
      <div className="fixed z-50 pointer-events-none bottom-4 left-4 flex flex-col items-start space-y-2">
        {toasts.map((toast, index) => 
          toast.type === 'notification' && (
            <NotificationToast
              key={index}
              message={toast.message}
              title={toast.title}
              duration={toast.duration}
              onClose={() => removeToast(index)}
            />
          )
        )}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};