"use client";

import React from "react";
import Image from "next/image";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { useCart } from "@/lib/cart-context";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast-context";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const { confirm } = useToast();
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-24">
        <h1 className="text-4xl font-bold mb-10 flex items-center gap-4">
          سلة التسوق
          <span className="text-lg font-normal text-gray-500">({totalItems} منتجات)</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass p-6 rounded-3xl border border-white/5 flex flex-col sm:flex-row items-center gap-6"
                  >
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-right">
                      <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                      <p className="text-amber-500 font-bold">{item.price} ج.م</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-amber-500 transition-colors"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-amber-500 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    <div className="text-xl font-bold w-32 text-center sm:text-left">
                      {item.price * item.quantity} ج.م
                    </div>

                    <button 
                      onClick={async () => {
                        const confirmed = await confirm({
                          title: "حذف من السلة",
                          message: `هل أنت متأكد من حذف "${item.name}" من سلة التسوق؟`,
                          confirmText: "نعم، حذف",
                          cancelText: "تراجع",
                          type: "danger"
                        });
                        if (confirmed) removeFromCart(item.id);
                      }}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={22} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center bg-white/[0.02] rounded-3xl border border-dashed border-white/10"
                >
                  <div className="inline-flex p-6 bg-white/5 rounded-full mb-6">
                    <ShoppingBag size={48} className="text-gray-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">سلتك فارغة حالياً</h2>
                  <p className="text-gray-500 mb-8">ابدأ باكتشاف منتجاتنا الرائعة وأضف ما يعجبك للسلة.</p>
                  <Link 
                    href="/products" 
                    className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-8 rounded-xl transition-all"
                  >
                    تصفح المنتجات
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-6">
            <div className="glass p-8 rounded-3xl border border-white/5 shadow-2xl sticky top-32">
              <h2 className="text-2xl font-bold mb-8">ملخص الطلب</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400">
                  <span>المجموع الفرعي</span>
                  <span>{totalPrice} ج.م</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>الشحن</span>
                  <span className="text-emerald-500">مجاني</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between text-2xl font-bold text-white">
                  <span>الإجمالي</span>
                  <span>{totalPrice} ج.م</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all mb-4 shadow-lg shadow-amber-500/10"
              >
                إتمام الطلب
                <ArrowLeft size={20} />
              </button>
              
              <Link 
                href="/products"
                className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors py-2"
              >
                مواصلة التسوق
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
