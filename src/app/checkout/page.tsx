"use client";

import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { useCart } from "@/lib/cart-context";
import { ArrowLeft, CheckCircle2, Ticket, MapPin, Phone, User, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast-context";
import { orderSchema } from "@/lib/validations";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "القاهرة",
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

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Strict Validation with Zod
    const validation = orderSchema.safeParse({
      ...formData,
      items: cart,
      total: finalPrice
    });

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
      const message = `طلب جديد من متجر صالح CNC 🚀\n\n` +
        `👤 العميل: ${validation.data.customer}\n` +
        `📞 الهاتف: ${validation.data.phone}\n` +
        `📍 العنوان: ${validation.data.address}, ${validation.data.city}\n` +
        `📝 ملاحظات: ${validation.data.notes || "لا يوجد"}\n\n` +
        `🛒 المنتجات:\n` +
        cart.map(item => `- ${item.name} (x${item.quantity}) = ${item.price * item.quantity} ج.م`).join("\n") +
        `\n\n` +
        `💰 الإجمالي الفرعي: ${totalPrice} ج.م\n` +
        `🎟️ الخصم: ${discount} ج.م\n` +
        `✅ الإجمالي النهائي: ${finalPrice} ج.م`;

      const whatsappUrl = `https://wa.me/201068256479?text=${encodeURIComponent(message)}`;
      
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
            <h1 className="text-4xl font-bold mb-8">إتمام الطلب</h1>
            
            <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <User size={16} /> الاسم بالكامل
                  </label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="أدخل اسمك بالكامل"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-amber-500 transition-all"
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-amber-500 transition-all text-left"
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-amber-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">المحافظة</label>
                    <select 
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-amber-500 transition-all"
                    >
                      <option>القاهرة</option>
                      <option>الجيزة</option>
                      <option>الإسكندرية</option>
                      <option>القليوبية</option>
                    </select>
                  </div>
                   <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">ملاحظات إضافية</label>
                    <input 
                      type="text" 
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="اختياري"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-4">
                <CheckCircle2 className="text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-500 mb-1">الدفع عند الاستلام</h4>
                  <p className="text-xs text-gray-400">سيتم الدفع نقداً للمندوب عند استلام المنتج ومراجعته.</p>
                </div>
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
              <h2 className="text-2xl font-bold mb-8">ملخص الطلب</h2>
              
              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-gray-500 text-xs">الكمية: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-sm whitespace-nowrap">{item.price * item.quantity} ج.م</div>
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
                    className="bg-transparent border-none outline-none flex-1 text-sm font-bold placeholder:font-normal"
                  />
                  <button 
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
                    تأكيد الطلب عبر واتساب
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
