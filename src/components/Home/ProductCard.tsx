"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/lib/data";
import { ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-[#111111] rounded-3xl overflow-hidden border border-white/[0.05] hover:border-amber-500/20 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-2xl hover:shadow-amber-500/5 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Wishlist Button */}

        <button className="absolute top-4 right-4 p-2.5 bg-black/50 backdrop-blur-md rounded-2xl text-white hover:text-amber-500 hover:bg-black/70 transition-all transform hover:scale-110 border border-white/10">
          <Heart size={20} />
        </button>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 bg-amber-500 text-black text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg shadow-amber-500/20">
            {product.badge}
          </div>
        )}

        {/* Hover Overlay Button */}
        <div className="absolute inset-x-4 bottom-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="w-full bg-white text-black hover:bg-amber-500 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95"
          >
            <ShoppingCart size={18} />
            إضافة للسلة
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1">
        <span className="text-amber-500 text-[11px] font-bold uppercase tracking-wider mb-2 block">
          {product.category}
        </span>
        <h3 className="text-lg font-bold text-white mb-4 line-clamp-1 group-hover:text-amber-500 transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-amber-500">
            {product.price} <span className="text-sm font-normal text-gray-500 mr-1">ج.م</span>
          </div>
          <button className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
