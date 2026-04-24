"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Upload, User, Phone, MessageSquare, Box, Sparkles, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { useToast } from "@/lib/toast-context";

export default function CustomOrderPage() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    category: "ديكور جدران",
    description: "",
    dimensions: "",
    budget: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Prepare WhatsApp message
    const message = `*طلب تصميم خاص جديد* 🎨\n\n` +
      `👤 *الاسم:* ${formData.name}\n` +
      `📞 *الهاتف:* ${formData.phone}\n` +
      `📁 *القسم:* ${formData.category}\n` +
      `📐 *المقاسات:* ${formData.dimensions}\n` +
      `💰 *الميزانية المتوقعة:* ${formData.budget}\n` +
      `📝 *الوصف:* ${formData.description}\n\n` +
      `تم الإرسال من نموذج الطلبات الخاصة في صالح CNC`;

    const whatsappUrl = `https://wa.me/201068256479?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, "_blank");
    setIsSubmitting(false);
    setIsSuccess(true);
    showToast("تم إرسال طلبك بنجاح ✅", "success");
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[#050505]">
        <Navbar />
        <div className="pt-48 pb-32 flex flex-col items-center justify-center container mx-auto px-4 text-center">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-amber-500/20"
          >
            <CheckCircle2 size={48} className="text-black" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">شكراً لثقتك بنا!</h1>
          <p className="text-gray-400 text-lg max-w-xl mb-12 leading-relaxed">
            لقد تم إرسال تفاصيل طلبك بنجاح. سيقوم فريقنا بمراجعة التصميم والتواصل معك عبر الواتساب لمناقشة التفاصيل النهائية والبدء في التنفيذ.
          </p>
          <button 
            onClick={() => window.location.href = "/"}
            className="bg-white/5 hover:bg-white/10 border border-white/10 py-4 px-10 rounded-2xl font-bold transition-all"
          >
            العودة للرئيسية
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      
      <div className="pt-32 md:pt-48 pb-20 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Side: Info & Branding */}
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-bold mb-8">
                  <Sparkles size={16} />
                  <span>خدمة التصميم حسب الطلب</span>
                </div>
                <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1]">
                  حول أفكارك إلى <span className="text-gradient">واقع ملموس</span>
                </h1>
                <p className="text-gray-400 text-lg mb-12 leading-relaxed">
                  سواء كان لديك رسم يدوي، صورة من الإنترنت، أو مجرد فكرة في خيالك، نحن نمتلك الخبرة والماكينات لتحويلها إلى قطعة فنية خشبية بدقة متناهية.
                </p>
                
                <div className="space-y-8">
                  {[
                    { title: "دقة الميليمتر", desc: "نستخدم أحدث ماكينات CNC والليزر لضمان مطابقة التصميم للواقع.", icon: Box },
                    { title: "استشارة فنية", desc: "نساعدك في اختيار نوع الخشب والسمك المناسب لكل تصميم.", icon: MessageSquare },
                    { title: "سرعة في التنفيذ", desc: "نلتزم بمواعيد التسليم المحددة مع الحفاظ على أعلى معايير الجودة.", icon: Sparkles },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                        <item.icon className="text-amber-500" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Side: Form */}
            <div className="order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[60px] rounded-full" />
                
                <h2 className="text-2xl font-bold mb-8 relative z-10">املأ بيانات الطلب</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 mr-2">الاسم بالكامل</label>
                      <div className="relative">
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                          required
                          type="text"
                          placeholder="أحمد محمد..."
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 focus:border-amber-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 mr-2">رقم الواتساب</label>
                      <div className="relative">
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                          required
                          type="tel"
                          placeholder="01xxxxxxxxx"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 focus:border-amber-500 outline-none transition-all text-right"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 mr-2">نوع التصميم</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-amber-500 outline-none transition-all appearance-none"
                    >
                      <option value="ديكور جدران">ديكور جدران</option>
                      <option value="ساعات">ساعات حائط</option>
                      <option value="هدايا">هدايا وتذكارات</option>
                      <option value="إضاءة">وحدات إضاءة</option>
                      <option value="أخرى">أخرى / تصميم خاص</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 mr-2">المقاسات (اختياري)</label>
                      <input 
                        type="text"
                        placeholder="مثلاً 100x70 سم"
                        value={formData.dimensions}
                        onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-amber-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 mr-2">الميزانية المتوقعة (ج.م)</label>
                      <input 
                        type="number"
                        placeholder="مثلاً 500"
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-amber-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 mr-2">وصف التصميم</label>
                    <textarea 
                      required
                      placeholder="اشرح لنا فكرتك بالتفصيل..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-amber-500 outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="p-6 border-2 border-dashed border-white/10 rounded-2xl text-center hover:border-amber-500/50 transition-all cursor-pointer group">
                    <Upload className="mx-auto text-gray-500 group-hover:text-amber-500 mb-2" size={32} />
                    <p className="text-sm text-gray-500 font-bold group-hover:text-gray-300">ارفق صورة التصميم (قريباً)</p>
                    <p className="text-[10px] text-gray-600 mt-1">يمكنك إرسال الصور مباشرة عبر الواتساب في الخطوة التالية</p>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-amber-500/20"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>إرسال الطلب عبر واتساب</span>
                        <Send size={20} />
                      </>
                    )}
                  </button>
                  
                  <p className="text-center text-[10px] text-gray-500">
                    سيتم تحويلك إلى تطبيق واتساب لإتمام المحادثة مع فريقنا الفني.
                  </p>
                </form>
              </motion.div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
