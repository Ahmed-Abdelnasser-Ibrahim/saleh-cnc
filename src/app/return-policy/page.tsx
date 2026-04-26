"use client";

import React from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { motion } from "framer-motion";
import { ShieldCheck, RefreshCcw, AlertTriangle, CheckCircle2, Truck, HelpCircle } from "lucide-react";

export default function ReturnPolicyPage() {
  const policies = [
    {
      title: "فترة الاسترجاع والاستبدال",
      description: "يمكنكم استبدال أو استرجاع المنتجات خلال 14 يوماً من تاريخ استلام الطلب، بشرط أن يكون المنتج بحالته الأصلية ولم يتم استخدامه.",
      icon: RefreshCcw,
      color: "text-blue-500"
    },
    {
      title: "المنتجات المخصصة (Laser Engraving)",
      description: "نظراً لطبيعة أعمالنا في صالح CNC، فإن المنتجات التي يتم تنفيذها بناءً على طلب خاص (مثل حفر الأسماء أو الصور الخاصة) لا يمكن استرجاعها إلا في حالة وجود عيب صناعة واضح.",
      icon: AlertTriangle,
      color: "text-amber-500"
    },
    {
      title: "تكاليف الشحن",
      description: "في حالة وجود عيب صناعة، نتحمل نحن كافة تكاليف الشحن. أما في حالة الرغبة في التبديل لسبب شخصي، يتحمل العميل تكلفة مصاريف الشحن.",
      icon: Truck,
      color: "text-emerald-500"
    }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent z-0" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-amber-500/20"
          >
            <ShieldCheck size={16} /> ضمان صالح CNC
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tighter"
          >
            سياسة الاستبدال <span className="text-amber-500">والاسترجاع</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            نحن نهتم برضاكم التام عن كل قطعة ننتجها في ورشتنا. إليكم كافة التفاصيل لضمان تجربة شراء آمنة وموثوقة.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {policies.map((policy, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/50 p-8 rounded-[40px] border border-white/5 hover:border-amber-500/20 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${policy.color}`}>
                  <policy.icon size={28} />
                </div>
                <h3 className="text-xl font-black mb-4">{policy.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{policy.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto space-y-12 bg-slate-900/30 p-8 md:p-12 rounded-[50px] border border-white/5">
            <div>
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <CheckCircle2 className="text-emerald-500" /> شروط الاسترجاع
              </h2>
              <ul className="space-y-4 text-gray-400">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span>يجب أن يكون المنتج في عبوته الأصلية وبنفس الحالة التي تم استلامه بها.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span>ارفاق فاتورة الشراء أو رقم الطلب الذي وصلكم عبر الموقع.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span>في حال استلام منتج تالف أو مكسور بسبب الشحن، يرجى إبلاغنا خلال 24 ساعة كحد أقصى.</span>
                </li>
              </ul>
            </div>

            <div className="h-px bg-white/5" />

            <div>
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <HelpCircle className="text-blue-500" /> كيف أطلب استرجاع؟
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                الأمر بسيط جداً، كل ما عليك هو التواصل معنا عبر الواتساب وإرسال رقم الطلب وصورة المنتج، وسيقوم فريق الدعم بمراجعة طلبك خلال 24 ساعة وتنسيق موعد مع شركة الشحن لاستلام المرتجع.
              </p>
              <a 
                href="https://wa.me/201068256479" 
                className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba5a] text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-green-500/20"
              >
                تواصل معنا عبر الواتساب الآن
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
