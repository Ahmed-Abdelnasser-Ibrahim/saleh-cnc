"use client";

import React, { useState } from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Search, Package, truck, CheckCircle2, Clock, AlertCircle, ArrowLeft, Smartphone, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_STEPS = [
  { id: "pending", label: "قيد المراجعة", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: "pending_payment_confirmation", label: "مراجعة الدفع", icon: Smartphone, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "processing", label: "جاري التجهيز", icon: Package, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "shipped", label: "تم الشحن", icon: Search, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "delivered", label: "تم التوصيل", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track?q=${query}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "حدث خطأ ما");
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = STATUS_STEPS.findIndex(step => step.id === order?.status);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">تتبع طلبك</h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            أدخل رقم الطلب أو رقم الموبايل الخاص بك لمعرفة حالة أوردرك في ثوانٍ.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrack} className="mb-16">
          <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-2 rounded-[32px] border border-white/10 focus-within:border-amber-500/50 transition-all shadow-2xl">
            <div className="flex-1 flex items-center gap-4 px-6 py-4">
              <Search className="text-amber-500" />
              <input 
                type="text" 
                placeholder="رقم الطلب (مثلاً: 65ad...) أو رقم الموبايل"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-lg font-bold placeholder:text-gray-600"
              />
            </div>
            <button 
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-black font-black px-10 py-5 rounded-[24px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "جاري البحث..." : "تتبع الآن"}
              <ArrowLeft size={20} />
            </button>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl text-red-500 flex items-center gap-4 justify-center"
            >
              <AlertCircle /> {error}
            </motion.div>
          )}

          {order && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Order Info Card */}
              <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] -z-10" />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-bottom border-white/5 pb-8">
                  <div>
                    <span className="text-amber-500 text-sm font-bold block mb-2">رقم الطلب</span>
                    <h3 className="text-2xl md:text-3xl font-black">#{order.id.slice(-6).toUpperCase()}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 text-sm font-bold block mb-2">اسم العميل</span>
                    <h3 className="text-xl font-bold">{order.customer}</h3>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative pt-10 pb-4">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 hidden md:block" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                    {STATUS_STEPS.map((step, index) => {
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;
                      const Icon = step.icon;

                      return (
                        <div key={step.id} className="flex md:flex-col items-center gap-4 text-center">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                            isCompleted ? `${step.bg} ${step.color} shadow-lg ${step.color === 'text-amber-500' ? 'shadow-amber-500/20' : ''}` : 'bg-white/5 text-gray-700'
                          } ${isCurrent ? 'ring-4 ring-white/5 scale-110' : ''}`}>
                            <Icon size={28} />
                          </div>
                          <div className="text-right md:text-center">
                            <span className={`text-sm font-bold block mb-1 ${isCompleted ? 'text-white' : 'text-gray-600'}`}>
                              {step.label}
                            </span>
                            {isCurrent && <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded-full font-black animate-pulse">الحالة الحالية</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-center">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <span className="text-gray-500 text-xs font-bold block mb-2 uppercase tracking-widest">تاريخ الطلب</span>
                  <p className="text-lg font-bold">{new Date(order.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <span className="text-gray-500 text-xs font-bold block mb-2 uppercase tracking-widest">المبلغ الإجمالي</span>
                  <p className="text-lg font-bold text-amber-500">{order.total} ج.م</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
