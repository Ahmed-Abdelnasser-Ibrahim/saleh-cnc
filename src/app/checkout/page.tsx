"use client";
// Admin Dashboard Payment Logic Update

import React, { useState } from "react";
// Final Payment System Update
import Image from "next/image";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { useCart } from "@/lib/cart-context";
import { ArrowLeft, CheckCircle2, Ticket, MapPin, Phone, User, ShoppingBag, Smartphone, CreditCard, Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast-context";
import { orderSchema } from "@/lib/validations";
import { paymentConfig } from "@/config/payment";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "vodafone" | "instapay">("cod");
  const [paymentProof, setPaymentProof] = useState<string>("");
  const [formData, setFormData] = useState({
    customer: "",
    phone: "",
    address: "",
    city: "القاهرة" as any,
    notes: ""
  });
  
  const router = useRouter();

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

    if (paymentMethod !== "cod" && !paymentProof) {
      showToast("يرجى رفع صورة إثبات التحويل", "error");
      return;
    }

    const orderData = {
      customer: formData.customer,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      notes: formData.notes || "",
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: finalPrice,
      paymentMethod,
      paymentProof: paymentProof || ""
    };

    // Strict Validation with Zod
    const validation = orderSchema.safeParse(orderData);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      showToast(firstError.message, "error");
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

      // Format WhatsApp message
      const paymentText = paymentMethod === "cod" ? "الدفع عند الاستلام" : 
                         paymentMethod === "vodafone" ? "فودافون كاش" : "إنستا باي";
      
      const message = `طلب جديد من متجر صالح CNC 🚀\n\n` +
        `👤 العميل: ${validation.data.customer}\n` +
        `📞 الهاتف: ${validation.data.phone}\n` +
        `📍 العنوان: ${validation.data.address}, ${validation.data.city}\n` +
        `💳 طريقة الدفع: ${paymentText}\n` +
        `📝 ملاحظات: ${validation.data.notes || "لا يوجد"}\n\n` +
        `🛒 المنتجات:\n` +
        cart.map(item => `- ${item.name} (x${item.quantity}) = ${item.price * item.quantity} ج.م`).join("\n") +
        `\n\n` +
        `💰 الإجمالي الفرعي: ${totalPrice} ج.م\n` +
        `🎟️ الخصم: ${discount} ج.م\n` +
        `✅ الإجمالي النهائي: ${finalPrice} ج.م`;

      const whatsappUrl = `https://wa.me/${paymentConfig.whatsapp.number}?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, "_blank");
      
      clearCart();
      showToast("تم إرسال طلبك بنجاح ✅", "success");
      router.push("/");
    } catch (err) {
      const error = err as Error;
      showToast(error.message || "حدث خطأ أثناء حفظ الطلب. يرجى المحاولة لاحقاً.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
        <div className="bg-white/5 p-12 rounded-[40px] border border-white/5 text-center max-w-md w-full">
           <ShoppingBag size={80} className="mx-auto mb-6 text-gray-700" />
           <h2 className="text-3xl font-bold mb-4 text-white">سلة التسوق فارغة</h2>
           <p className="text-gray-400 mb-8">لم تقم بإضافة أي منتجات للسلة بعد.</p>
           <button 
             onClick={() => router.push("/products")} 
             className="w-full bg-amber-500 hover:bg-amber-600 text-black px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-amber-500/20"
           >
             تصفح المنتجات
           </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-24 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <h1 className="text-4xl font-bold mb-8 text-white">إتمام الطلب</h1>
            
            <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <User size={16} /> الاسم بالكامل
                  </label>
                  <input 
                    required
                    type="text" 
                    value={formData.customer}
                    onChange={(e) => setFormData({...formData, customer: e.target.value})}
                    placeholder="أدخل اسمك بالكامل"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-amber-500 transition-all text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Phone size={16} /> رقم الهاتف (واتساب)
                  </label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="01xxxxxxxxx"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-amber-500 transition-all text-left text-white"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <MapPin size={16} /> العنوان بالتفصيل
                  </label>
                  <input 
                    required
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="الشارع، المنطقة، رقم المنزل..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-amber-500 transition-all text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">المحافظة</label>
                    <select 
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-amber-500 transition-all text-white"
                    >
                      <option value="القاهرة">القاهرة</option>
                      <option value="الجيزة">الجيزة</option>
                      <option value="الإسكندرية">الإسكندرية</option>
                      <option value="القليوبية">القليوبية</option>
                    </select>
                  </div>
                   <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">ملاحظات إضافية</label>
                    <input 
                      type="text" 
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="اختياري"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-amber-500 transition-all text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-bold text-white mb-4">اختر طريقة الدفع</h3>
                
                <div className="grid gap-3">
                  {/* COD */}
                  <label className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${paymentMethod === 'cod' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                    <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mt-1 accent-amber-500" />
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        <CheckCircle2 className={paymentMethod === 'cod' ? 'text-amber-500' : 'text-gray-500'} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">الدفع عند الاستلام</h4>
                        <p className="text-xs text-gray-500">ادفع نقداً عند استلام طلبك من المندوب.</p>
                      </div>
                    </div>
                  </label>

                  {/* Vodafone Cash */}
                  <label className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${paymentMethod === 'vodafone' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                    <input type="radio" name="payment" checked={paymentMethod === 'vodafone'} onChange={() => setPaymentMethod('vodafone')} className="mt-1 accent-amber-500" />
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        <Smartphone className={paymentMethod === 'vodafone' ? 'text-amber-500' : 'text-gray-500'} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">فودافون كاش</h4>
                        <p className="text-xs text-gray-500">تحويل سريع ومباشر عبر المحفظة.</p>
                      </div>
                    </div>
                  </label>

                  {/* InstaPay */}
                  <label className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${paymentMethod === 'instapay' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                    <input type="radio" name="payment" checked={paymentMethod === 'instapay'} onChange={() => setPaymentMethod('instapay')} className="mt-1 accent-amber-500" />
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        <CreditCard className={paymentMethod === 'instapay' ? 'text-amber-500' : 'text-gray-500'} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">إنستا باي (InstaPay)</h4>
                        <p className="text-xs text-gray-500">تحويل بنكي لحظي آمن.</p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Payment Instructions & Proof Upload */}
                <AnimatePresence>
                  {paymentMethod !== 'cod' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                          <h5 className="font-bold text-amber-500 mb-2">تعليمات الدفع:</h5>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {paymentMethod === 'vodafone' ? paymentConfig.vodafoneCash.instructions : paymentConfig.instaPay.instructions}
                            <br />
                            الرقم/الحساب: <strong className="text-white text-lg block mt-2 tracking-widest">{paymentMethod === 'vodafone' ? paymentConfig.vodafoneCash.number : paymentConfig.instaPay.address}</strong>
                          </p>
                        </div>

                        <div className="space-y-4">
                          <label className="text-sm font-medium text-gray-400 block">ارفع صورة إثبات التحويل (سكرين شوت)</label>
                          <div className="relative group">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all bg-white/5 ${paymentProof ? 'border-emerald-500/50' : 'border-white/10 hover:border-amber-500/50'}`}>
                              {paymentProof ? (
                                <div className="flex flex-col items-center">
                                  <div className="relative w-24 h-24 mb-2">
                                    <Image src={paymentProof} alt="Proof" fill className="object-cover rounded-xl" unoptimized />
                                    <button onClick={(e) => { e.preventDefault(); setPaymentProof(""); }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg">
                                      <X size={14} />
                                    </button>
                                  </div>
                                  <span className="text-xs text-emerald-500 font-bold">تم اختيار إثبات الدفع ✅</span>
                                </div>
                              ) : (
                                <>
                                  <Upload size={32} className="mx-auto mb-2 text-gray-500 group-hover:text-amber-500 transition-colors" />
                                  <p className="text-sm text-gray-500">اضغط لرفع سكرين شوت التحويل</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="glass p-8 rounded-[32px] border border-white/5 shadow-2xl sticky top-32">
              <h2 className="text-2xl font-bold mb-8 text-white">ملخص الطلب</h2>
              
              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm line-clamp-1 text-white">{item.name}</h4>
                      <p className="text-gray-500 text-xs text-right">الكمية: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-sm whitespace-nowrap text-white">{item.price * item.quantity} ج.م</div>
                  </div>
                ))}
              </div>

              {/* Coupon System */}
              <div className="mb-8">
                <div className="flex gap-2 p-2 bg-white/5 border border-white/10 rounded-2xl focus-within:border-amber-500 transition-all">
                  <div className="flex items-center gap-2 px-3 text-gray-500">
                    <Ticket size={18} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="كود الخصم (SALEH10)" 
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    className="bg-transparent border-none outline-none flex-1 text-sm font-bold text-white placeholder:font-normal"
                  />
                  <button 
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-6 py-2 rounded-xl transition-all"
                  >
                    تطبيق
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400">
                  <span>المجموع الفرعي</span>
                  <span>{totalPrice} ج.م</span>
                </div>
                <div className="flex justify-between text-emerald-500">
                  <span>الخصم</span>
                  <span>-{discount} ج.م</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>الشحن</span>
                  <span className="text-emerald-500">مجاني</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between text-3xl font-black text-white">
                  <span>الإجمالي</span>
                  <span className="text-amber-500">{finalPrice} ج.م</span>
                </div>
              </div>

              <button 
                form="checkout-form"
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-500/20 group ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    جاري معالجة الطلب...
                  </>
                ) : (
                  <>
                    إرسال الطلب وإثبات الدفع
                    <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
                  </>
                )}
              </button>
              
              <p className="text-center text-gray-500 text-xs mt-6">
                بالضغط على تأكيد الطلب، فإنك توافق على سياسة الخصوصية وشروط الاستخدام.
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
