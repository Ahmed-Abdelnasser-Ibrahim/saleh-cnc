"use client";

import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { useCart } from "@/lib/cart-context";
import { ArrowLeft, CheckCircle2, Ticket, MapPin, Phone, User, ShoppingBag, Smartphone, CreditCard, Upload, X, Copy, Check, Info, ShieldCheck, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast-context";
import { orderSchema } from "@/lib/validations";
import { PAYMENT_CONFIG } from "@/config/payment";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash_on_delivery" | "vodafone_cash" | "instapay">("cash_on_delivery");
  const [paymentProof, setPaymentProof] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{id: string} | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    customer: "",
    phone: "",
    address: "",
    city: "القاهرة" as any,
    notes: ""
  });
  
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    showToast("تم النسخ بنجاح", "success");
  };

  const handleApplyCoupon = () => {
    if (coupon === "SALEH10") {
      setDiscount(totalPrice * 0.1);
      showToast("تم تطبيق خصم 10% بنجاح", "success");
    } else {
      showToast("كود الخصم غير صحيح", "error");
    }
  };

  const finalPrice = totalPrice - discount;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("حجم الصورة كبير جداً (الأقصى 5 ميجا)", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result as string);
        showToast("تم رفع إثبات الدفع بنجاح", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (paymentMethod !== "cash_on_delivery" && !paymentProof) {
      showToast("يرجى رفع صورة إثبات التحويل لضمان تأكيد طلبك", "error");
      return;
    }

    const paymentStatus = paymentMethod === "cash_on_delivery" ? "not_required" : "pending_confirmation";
    const orderStatus = paymentMethod === "cash_on_delivery" ? "pending" : "pending_payment_confirmation";

    const orderData = {
      ...formData,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: finalPrice,
      paymentMethod,
      paymentStatus,
      status: orderStatus,
      paymentProof: paymentProof || ""
    };

    const validation = orderSchema.safeParse(orderData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach(issue => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      showToast("يرجى تصحيح الأخطاء في النموذج", "error");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save order");
      }

      setOrderSuccess({ id: data.orderId });
      clearCart();
      showToast("تم تسجيل طلبك بنجاح ✅", "success");
    } catch (err) {
      const error = err as Error;
      showToast(error.message || "حدث خطأ أثناء حفظ الطلب. يرجى المحاولة لاحقاً.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendWhatsAppProof = () => {
    if (!orderSuccess) return;
    const paymentText = PAYMENT_CONFIG.paymentMethods[paymentMethod === 'vodafone_cash' ? 'vodafone' : paymentMethod === 'instapay' ? 'instapay' : 'cod'].label;
    const message = `أهلاً صالح CNC 👋\nلقد قمت بإتمام طلب جديد ورقم الطلب هو: ${orderSuccess.id.slice(-6).toUpperCase()}\n\n👤 العميل: ${formData.customer}\n📞 الهاتف: ${formData.phone}\n💳 طريقة الدفع: ${paymentText}\n💰 الإجمالي: ${finalPrice} ج.م\n\nلقد قمت بإرسال مبلغ التحويل وسأرفق سكرين شوت الدفع الآن.`;
    const whatsappUrl = `https://wa.me/${PAYMENT_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
        <Navbar />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 p-8 sm:p-12 rounded-[40px] border border-emerald-500/20 text-center max-w-2xl w-full shadow-2xl shadow-emerald-500/10">
           <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8"><ShieldCheck size={48} className="text-emerald-500" /></div>
           <h2 className="text-4xl font-black mb-4 text-white">تم استلام طلبك!</h2>
           <p className="text-gray-400 mb-8 text-lg">رقم الطلب الخاص بك هو: <span className="text-amber-500 font-mono font-bold">#{orderSuccess.id.slice(-6).toUpperCase()}</span></p>
           <div className="bg-white/5 rounded-3xl p-6 mb-8 text-right border border-white/5">
              <h4 className="font-bold text-white mb-4 flex items-center justify-end gap-2">الخطوة التالية <Info size={18} className="text-amber-500" /></h4>
              <p className="text-gray-400 text-sm leading-relaxed">{paymentMethod === 'cash_on_delivery' ? "سيقوم فريقنا بمراجعة طلبك وتجهيزه للشحن فوراً. سنتواصل معك هاتفياً لتأكيد موعد التوصيل." : "يرجى إرسال سكرين شوت التحويل عبر الواتساب لتأكيد الدفع وبدء تجهيز الطلب فوراً."}</p>
           </div>
           <div className="grid gap-4">
             {paymentMethod !== 'cash_on_delivery' && <button onClick={sendWhatsAppProof} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-5 rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3">إرسال إثبات الدفع عبر واتساب</button>}
             <button onClick={() => router.push("/")} className="w-full bg-white/5 hover:bg-white/10 text-white px-8 py-5 rounded-2xl font-black transition-all border border-white/10">العودة للرئيسية</button>
           </div>
        </motion.div>
        <Footer />
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
        <Navbar /><div className="bg-white/5 p-12 rounded-[40px] border border-white/5 text-center max-w-md w-full"><ShoppingBag size={80} className="mx-auto mb-6 text-gray-700" /><h2 className="text-3xl font-bold mb-4 text-white">سلة التسوق فارغة</h2><p className="text-gray-400 mb-8">لم تقم بإضافة أي منتجات للسلة بعد.</p><button onClick={() => router.push("/products")} className="w-full bg-amber-500 hover:bg-amber-600 text-black px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-amber-500/20">تصفح المنتجات</button></div><Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-24 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <h1 className="text-4xl font-black mb-8 text-white">إتمام الطلب السريع</h1>
            <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 flex items-center gap-2 pr-2"><User size={16} className="text-amber-500" /> الاسم بالكامل</label>
                  <input required type="text" value={formData.customer} onChange={(e) => handleInputChange('customer', e.target.value)} placeholder="الاسم الثلاثي أو الرباعي" className={`w-full bg-white/5 border rounded-2xl py-4 px-6 outline-none transition-all text-white font-bold ${errors.customer ? 'border-red-500/50' : 'border-white/10 focus:border-amber-500'}`} />
                  {errors.customer && <p className="text-red-500 text-xs mt-1 flex items-center gap-1 pr-2"><AlertTriangle size={12} /> {errors.customer}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 flex items-center gap-2 pr-2"><Phone size={16} className="text-amber-500" /> رقم الهاتف (واتساب)</label>
                  <input required type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="01xxxxxxxxx" className={`w-full bg-white/5 border rounded-2xl py-4 px-6 outline-none transition-all text-left text-white font-bold tracking-widest ${errors.phone ? 'border-red-500/50' : 'border-white/10 focus:border-amber-500'}`} dir="ltr" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1 pr-2"><AlertTriangle size={12} /> {errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 flex items-center gap-2 pr-2"><MapPin size={16} className="text-amber-500" /> العنوان بالتفصيل</label>
                  <input required type="text" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} placeholder="الشارع، المنطقة، رقم المنزل..." className={`w-full bg-white/5 border rounded-2xl py-4 px-6 outline-none transition-all text-white font-bold ${errors.address ? 'border-red-500/50' : 'border-white/10 focus:border-amber-500'}`} />
                  {errors.address && <p className="text-red-500 text-xs mt-1 flex items-center gap-1 pr-2"><AlertTriangle size={12} /> {errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 pr-2">المحافظة</label>
                    <select value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-amber-500 transition-all text-white font-bold appearance-none cursor-pointer">
                      {[ "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم", "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", "السويس", "اسوان", "اسيوط", "بني سويف", "بورسعيد", "دمياط", "الشرقية", "جنوب سيناء", "كفر الشيخ", "مطروح", "الأقصر", "قنا", "شمال سيناء", "سوهاج" ].map(city => (<option key={city} value={city}>{city}</option>))}
                    </select>
                  </div>
                   <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 pr-2">ملاحظات إضافية</label>
                    <input type="text" value={formData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} placeholder="اختياري" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-amber-500 transition-all text-white" />
                  </div>
                </div>
              </div>

              {/* Payment Methods Selection */}
              <div className="space-y-6 pt-6">
                <div className="flex items-center justify-between"><h3 className="text-xl font-black text-white">طريقة الدفع</h3><span className="text-xs text-gray-500 flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-500" /> دفع آمن ومشفر</span></div>
                <div className="grid gap-4">
                  {/* Cards for each method */}
                  {['cash_on_delivery', 'vodafone_cash', 'instapay'].map((method) => (
                    <div key={method} onClick={() => setPaymentMethod(method as any)} className={`group relative p-6 rounded-[28px] border-2 transition-all cursor-pointer overflow-hidden ${paymentMethod === method ? 'bg-amber-500/10 border-amber-500 shadow-xl shadow-amber-500/10' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                      <div className="flex items-center gap-5 relative z-10">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${paymentMethod === method ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' : 'bg-white/5 text-gray-500'}`}>
                          {method === 'cash_on_delivery' ? <CheckCircle2 size={28} /> : method === 'vodafone_cash' ? <Smartphone size={28} /> : <CreditCard size={28} />}
                        </div>
                        <div className="flex-1 text-right">
                          <h4 className="font-black text-lg text-white mb-1">{PAYMENT_CONFIG.paymentMethods[method === 'cash_on_delivery' ? 'cod' : method === 'vodafone_cash' ? 'vodafone' : 'instapay'].label}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">{PAYMENT_CONFIG.paymentMethods[method === 'cash_on_delivery' ? 'cod' : method === 'vodafone_cash' ? 'vodafone' : 'instapay'].description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment Instructions UI */}
                <AnimatePresence>
                  {paymentMethod !== 'cash_on_delivery' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-8">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between bg-amber-500/10 p-6 rounded-2xl border border-amber-500/20">
                          <div className="text-right flex-1"><span className="text-amber-500 text-xs font-bold block mb-1">المبلغ الإجمالي للتحويل</span><span className="text-3xl font-black text-white">{finalPrice} <span className="text-sm">ج.م</span></span></div>
                          <button type="button" onClick={() => handleCopy(finalPrice.toString(), 'amount')} className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all text-white">{copiedField === 'amount' ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}</button>
                        </div>
                        <div className="flex items-center justify-between bg-white/5 p-6 rounded-2xl border border-white/10">
                          <div className="text-right flex-1"><span className="text-gray-500 text-xs font-bold block mb-1">الرقم المخصص للتحويل</span><span className="text-2xl font-black text-white tracking-[0.2em]">01068256479</span></div>
                          <button type="button" onClick={() => handleCopy("01068256479", 'number')} className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all text-white">{copiedField === 'number' ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}</button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 p-3 rounded-xl justify-center text-xs font-bold"><ShieldCheck size={16} /> {PAYMENT_CONFIG.paymentMethods[paymentMethod === 'vodafone_cash' ? 'vodafone' : 'instapay'].trustNote}</div>
                        <div className="relative group">
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <div className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all bg-white/5 ${paymentProof ? 'border-emerald-500/50' : 'border-white/10 hover:border-amber-500/50'}`}>
                            {paymentProof ? (<div className="flex flex-col items-center"><div className="relative w-32 h-32 mb-4 group/preview"><Image src={paymentProof} alt="Proof" fill className="object-cover rounded-2xl shadow-2xl" unoptimized /><button onClick={(e) => { e.preventDefault(); setPaymentProof(""); }} className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"><X size={16} /></button></div><span className="text-sm text-emerald-500 font-bold">تم اختيار إثبات الدفع بنجاح ✅</span></div>) : (<><Upload size={48} className="mx-auto mb-4 text-gray-500 group-hover:text-amber-500 transition-colors" /><p className="text-white font-bold mb-1">ارفع سكرين شوت التحويل</p><p className="text-xs text-gray-500">لضمان سرعة تأكيد الطلب</p></>)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>

          {/* Order Summary Column */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="glass p-10 rounded-[40px] border border-white/5 shadow-2xl sticky top-32">
              <div className="flex items-center justify-between mb-10"><h2 className="text-2xl font-black text-white">ملخص طلبك</h2><span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{cart.length} منتجات</span></div>
              <div className="space-y-6 mb-10 max-h-[350px] overflow-y-auto no-scrollbar pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-5 items-center group">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0 group-hover:scale-105 transition-transform"><Image src={item.image} alt={item.name} fill className="object-cover" /></div>
                    <div className="flex-1 text-right"><h4 className="font-bold text-base text-white mb-1 line-clamp-1">{item.name}</h4><p className="text-gray-500 text-xs">الكمية: {item.quantity} × {item.price} ج.م</p></div>
                    <div className="font-black text-base text-white whitespace-nowrap">{item.price * item.quantity} ج.م</div>
                  </div>
                ))}
              </div>
              <div className="mb-10">
                <div className="flex gap-2 p-2 bg-white/5 border border-white/10 rounded-2xl focus-within:border-amber-500 transition-all">
                  <div className="flex items-center gap-2 px-3 text-gray-500"><Ticket size={20} className="text-amber-500" /></div>
                  <input type="text" placeholder="لديك كود خصم؟" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} className="bg-transparent border-none outline-none flex-1 text-sm font-bold text-white placeholder:text-gray-600" />
                  <button type="button" onClick={handleApplyCoupon} className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-black px-8 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20">تفعيل</button>
                </div>
              </div>
              <div className="space-y-5 mb-10">
                <div className="flex justify-between text-gray-400 font-bold"><span>المجموع الفرعي</span><span>{totalPrice} ج.م</span></div>
                <div className="flex justify-between text-emerald-500 font-bold"><span>الخصم</span><span>-{discount} ج.م</span></div>
                <div className="flex justify-between text-gray-400 font-bold"><span>مصاريف الشحن</span><span className="text-emerald-500 text-sm">شحن مجاني لفترة محدودة</span></div>
                <div className="h-px bg-white/10 my-4" /><div className="flex justify-between items-end"><span className="text-gray-400 font-bold mb-1">الإجمالي النهائي</span><span className="text-5xl font-black text-amber-500 tracking-tighter">{finalPrice} <span className="text-sm font-bold text-white">ج.م</span></span></div>
              </div>
              <button form="checkout-form" type="submit" disabled={isSubmitting} className={`w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-4 transition-all shadow-2xl shadow-emerald-500/30 group text-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {isSubmitting ? (<><div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />جاري تأكيد طلبك...</>) : (<>تأكيد الطلب الآن<ArrowLeft size={28} className="group-hover:-translate-x-3 transition-transform" /></>)}
              </button>
              <div className="flex items-center justify-center gap-4 mt-8 opacity-40 grayscale group-hover:grayscale-0 transition-all"><ShieldCheck size={20} /><span className="text-[10px] font-black uppercase tracking-[0.3em]">Secure Payment Guaranteed</span></div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
