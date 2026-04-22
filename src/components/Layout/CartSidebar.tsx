"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  const handleCheckout = () => {
    onClose();
    window.location.href = "/checkout";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-slate-950 z-[110] flex flex-col shadow-2xl border-l border-white/5"
          >
            <div className="p-5 sm:p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/10 p-2 rounded-lg">
                  <ShoppingBag className="text-amber-500" size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">سلة التسوق</h2>
                <span className="bg-white/5 px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-400">{totalItems}</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 custom-scrollbar">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-amber-500/20 transition-all group"
                  >
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-white/10">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm sm:text-base mb-0.5 truncate">{item.name}</h4>
                        <p className="text-amber-500 font-bold text-xs sm:text-sm">{item.price} ج.م</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 sm:gap-3 bg-black/40 p-1 rounded-lg border border-white/5">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                            className="w-8 h-8 flex items-center justify-center hover:text-amber-500 transition-colors bg-white/5 rounded-md active:scale-90"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                            className="w-8 h-8 flex items-center justify-center hover:text-amber-500 transition-colors bg-white/5 rounded-md active:scale-90"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="p-2 text-gray-500 hover:text-red-500 transition-colors active:scale-90"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingBag size={64} className="mb-4" />
                  <p className="text-lg">سلتك فارغة حالياً</p>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 sm:p-8 border-t border-white/5 bg-white/[0.01]">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <span className="text-gray-400 font-medium">الإجمالي</span>
                  <span className="text-xl sm:text-2xl font-bold text-amber-500">{totalPrice} ج.م</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/10 mb-4 active:scale-95 group"
                >
                  إتمام الطلب
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>

                <Link 
                  href="/cart" 
                  onClick={onClose}
                  className="w-full flex items-center justify-center py-2 text-gray-500 hover:text-white transition-colors text-xs sm:text-sm"
                >
                  عرض السلة بالكامل
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
