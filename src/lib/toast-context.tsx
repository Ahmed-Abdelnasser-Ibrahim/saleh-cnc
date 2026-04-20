"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  confirm: (message: string) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmData, setConfirmData] = useState<{ message: string; resolve: (val: boolean) => void } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const confirm = useCallback((message: string) => {
    return new Promise<boolean>((resolve) => {
      setConfirmData({ message, resolve });
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
      
      {/* Toasts */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl glass border shadow-2xl min-w-[300px] ${
                toast.type === "success" ? "border-emerald-500/20 text-emerald-500" :
                toast.type === "error" ? "border-red-500/20 text-red-500" :
                "border-amber-500/20 text-amber-500"
              }`}
            >
              {toast.type === "success" && <CheckCircle size={20} />}
              {toast.type === "error" && <XCircle size={20} />}
              {toast.type === "info" && <Info size={20} />}
              
              <span className="flex-1 font-bold text-sm text-white">{toast.message}</span>
              
              <button onClick={() => removeToast(toast.id)} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmData && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => handleConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md p-8 rounded-[32px] glass border border-white/10 shadow-2xl text-right"
              dir="rtl"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 mx-auto">
                <Info size={32} className="text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">{confirmData.message}</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => handleConfirm(true)}
                  className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-2xl transition-all"
                >
                  تأكيد
                </button>
                <button
                  onClick={() => handleConfirm(false)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10"
                >
                  إلغاء
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
