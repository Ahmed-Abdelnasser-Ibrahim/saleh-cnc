"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Mail, ArrowLeft } from "lucide-react";

const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const WhatsAppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

export default function ContactSection() {
  const contactMethods = [
    {
      name: "واتساب",
      icon: WhatsAppIcon,
      value: "01234567890",
      link: "https://wa.me/201234567890",
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white"
    },
    {
      name: "فيسبوك",
      icon: FacebookIcon,
      value: "Saleh CNC Page",
      link: "#",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500 hover:text-white"
    },
    {
      name: "البريد الإلكتروني",
      icon: Mail,
      value: "support@saleh-cnc.com",
      link: "mailto:support@saleh-cnc.com",
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500 hover:text-white"
    }
  ];

  return (
    <section className="py-12 md:py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6">تواصل معنا</h2>
          <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
            فريقنا جاهز للرد على جميع استفساراتكم وتلقي طلباتكم الخاصة على مدار الساعة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {contactMethods.map((method, i) => (
            <motion.a
              key={method.name}
              href={method.link}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 md:p-10 rounded-2xl md:rounded-[32px] border flex flex-col items-center text-center transition-all duration-500 group ${method.color}`}
            >
              <div className="mb-4 md:mb-6 p-3 md:p-4 rounded-2xl bg-white/5 group-hover:bg-white/20 transition-colors">
                <method.icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 text-white">{method.name}</h3>
              <p className="opacity-70 text-sm md:text-base font-medium mb-4 md:mb-6">{method.value}</p>
              <div className="mt-auto flex items-center gap-2 font-bold text-[10px] md:text-sm uppercase tracking-widest">
                تواصل الآن
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-16 md:mt-24 p-6 md:p-12 rounded-2xl md:rounded-[40px] glass border border-white/5 relative overflow-hidden">
          <div className="grid lg:grid-cols-2 items-center gap-8 md:gap-12 relative z-10">
            <div className="text-center lg:text-right">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">هل لديك تصميم خاص؟</h3>
              <p className="text-gray-400 text-sm md:text-lg mb-6 md:mb-8 leading-relaxed">
                نحن لا نبيع المنتجات الجاهزة فقط، بل نحول أفكارك وتصميماتك الخاصة إلى حقيقة بدقة متناهية. تواصل معنا لمناقشة مشروعك القادم.
              </p>
              <button 
                onClick={() => window.location.href = "/custom-order"}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-black font-black py-3 md:py-4 px-8 md:px-10 rounded-xl md:rounded-2xl transition-all shadow-xl shadow-amber-500/20 text-sm md:text-base"
              >
                طلب تصميم خاص
              </button>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/20 blur-[60px] rounded-full" />
              <div className="relative z-10 p-6 border border-white/10 rounded-3xl bg-black/40 backdrop-blur-xl rotate-3">
                <MessageSquare size={100} className="text-amber-500 opacity-50 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
