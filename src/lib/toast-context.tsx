"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "info";
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  confirm: (options: ConfirmOptions | string) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmData, setConfirmData] = useState<{ 
    options: ConfirmOptions; 
    resolve: (val: boolean) => void 
  } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const confirm = useCallback((input: ConfirmOptions | string) => {
    const options: ConfirmOptions = typeof input === "string" ? { message: input } : input;
    return new Promise<boolean>((resolve) => {
      setConfirmData({ options, resolve });
    });
  }, []);

  const handleConfirm = (value: boolean) => {
    if (confirmData) {
      confirmData.resolve(value);
      setConfirmData(null);
    }
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, confirm }}>
      {children}
      
      {/* Toasts - High-end notifications */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl backdrop-blur-xl border shadow-2xl ${
                toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                toast.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-500" :
                toast.type === "warning" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                "bg-blue-500/10 border-blue-500/20 text-blue-400"
              }`}
            >
              <div className="shrink-0">
                {toast.type === "success" && <CheckCircle size={22} />}
                {toast.type === "error" && <XCircle size={22} />}
                {toast.type === "warning" && <AlertTriangle size={22} />}
                {toast.type === "info" && <Info size={22} />}
              </div>
              
              <span className="flex-1 font-bold text-sm text-white/90 leading-tight">{toast.message}</span>
              
              <button onClick={() => removeToast(toast.id)} className="p-1 hover:bg-white/10 rounded-lg transition-colors group">
                <X size={16} className="text-white/40 group-hover:text-white" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Premium Confirm Modal */}
      <AnimatePresence>
        {confirmData && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => handleConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md p-8 rounded-[40px] bg-slate-900 border border-white/10 shadow-3xl text-center overflow-hidden"
              dir="rtl"
            >
              {/* Decorative Background */}
              <div className={`absolute top-0 inset-x-0 h-1 ${confirmData.options.type === 'danger' ? 'bg-red-500' : 'bg-amber-500'}`} />
              
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 mx-auto ${
                confirmData.options.type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {confirmData.options.type === 'danger' ? <AlertTriangle size={40} /> : <Info size={40} />}
              </div>

              <h3 className="text-2xl font-black text-white mb-3">
                {confirmData.options.title || "تأكيد الإجراء"}
              </h3>
              
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                {confirmData.options.message}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleConfirm(true)}
                  className={`flex-1 py-4 font-black rounded-2xl transition-all shadow-xl active:scale-95 ${
                    confirmData.options.type === 'danger' 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-amber-500 hover:bg-amber-600 text-black'
                  }`}
                >
                  {confirmData.options.confirmText || "تأكيد"}
                </button>
                <button
                  onClick={() => handleConfirm(false)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10 active:scale-95"
                >
                  {confirmData.options.cancelText || "إلغاء"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
