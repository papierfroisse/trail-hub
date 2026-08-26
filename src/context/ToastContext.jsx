import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: '100%'
      }}>
        {toasts.map(toast => {
          const isError = toast.type === 'error';
          const isInfo = toast.type === 'info';
          return (
            <div
              key={toast.id}
              className="animate-fade-in"
              style={{
                padding: '0.85rem 1.15rem',
                borderRadius: '12px',
                background: isError ? '#7f1d1d' : isInfo ? '#1e3a8a' : '#064e3b',
                color: '#ffffff',
                border: `1px solid ${isError ? '#ef4444' : isInfo ? '#3b82f6' : '#10b981'}`,
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                fontSize: '0.9rem',
                fontWeight: 600,
                backdropFilter: 'blur(12px)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isError ? <AlertCircle size={18} color="#fca5a5" /> : isInfo ? <Info size={18} color="#93c5fd" /> : <CheckCircle2 size={18} color="#6ee7b7" />}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', opacity: 0.7 }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast doit être utilisé au sein de ToastProvider");
  }
  return context;
}
