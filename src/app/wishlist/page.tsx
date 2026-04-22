"use client";

import React from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import ProductCard from "@/components/Home/ProductCard";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-24 max-w-7xl">
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 bg-amber-500/10 text-amber-500 px-6 py-3 rounded-full border border-amber-500/20 mb-6"
          >
            <Heart size={24} className="fill-current" />
            <span className="font-bold text-lg">قائمة أمنياتي</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black mb-4">تصميماتك <span className="text-amber-500">المفضلة</span></h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">هنا تجد كافة القطع الفنية التي نالت إعجابك، يمكنك إضافتها للسلة في أي وقت.</p>
        </header>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/5 rounded-[40px] text-center"
          >
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8">
              <ShoppingBag size={48} className="text-gray-700" />
            </div>
            <h2 className="text-3xl font-bold mb-4">قائمتك خالية حالياً</h2>
            <p className="text-gray-500 mb-10 max-w-sm">لم تقم بإضافة أي قطع فنية لمفضلتك بعد. ابدأ باستكشاف متجرنا الآن!</p>
            <Link
              href="/products"
              className="bg-amber-500 hover:bg-amber-600 text-black font-black px-10 py-5 rounded-2xl flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-amber-500/20"
            >
              ابدأ التسوق
              <ArrowLeft size={24} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-8">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
