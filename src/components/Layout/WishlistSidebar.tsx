"use client";

import React from "react";
import { X, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WishlistSidebar({ isOpen, onClose }: WishlistSidebarProps) {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-slate-950 z-[101] shadow-2xl flex flex-col border-l border-white/5"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                  <Heart size={24} className="fill-current" />
                </div>
                <h2 className="text-xl font-bold text-white">المفضلة</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Heart size={40} className="text-gray-600" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">قائمتك فارغة</h3>
                  <p className="text-gray-500">لم تقم بإضافة أي منتجات للمفضلة بعد.</p>
                </div>
              ) : (
                wishlist.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group relative"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/5 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-bold text-white text-sm mb-1">{item.name}</h4>
                        <p className="text-amber-500 font-bold">{item.price} ج.م</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            addToCart(item);
                            removeFromWishlist(item.id);
                          }}
                          className="flex-1 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
                        >
                          <ShoppingCart size={14} />
                          نقل للسلة
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="p-2 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {wishlist.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                <button
                  onClick={onClose}
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-all"
                >
                  العودة للتسوق
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
