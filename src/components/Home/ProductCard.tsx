"use client";

import React, { useState, memo } from "react";
import Image from "next/image";
import { Product } from "@/lib/data";
import { ShoppingCart, Heart, ChevronDown, ChevronUp, Plus, Minus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { motion, AnimatePresence } from "framer-motion";
import StructuredData from "@/components/SEO/StructuredData";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const ProductCard = memo(({ product, priority = false }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [showDescription, setShowDescription] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const incrementQty = (e: React.MouseEvent) => {
    e.preventDefault();
    setQuantity(prev => prev + 1);
  };

  const decrementQty = (e: React.MouseEvent) => {
    e.preventDefault();
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "50px" }}
      transition={{ duration: 0.4 }}
      className="group bg-[#111111] rounded-xl sm:rounded-3xl overflow-hidden border border-white/[0.05] hover:border-amber-500/20 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-amber-500/5 flex flex-col h-full will-change-transform"
    >
      <StructuredData 
        type="Product" 
        data={{
          name: product.name,
          image: `https://saleh-cnc.com${product.image}`,
          description: product.description || `تصميم ${product.category} فريد من صالح CNC`,
          offers: {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "EGP",
            "availability": "https://schema.org/InStock"
          }
        }} 
      />
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
        />
        
        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          aria-label={isInWishlist(product.id) ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
          className={`absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2.5 rounded-lg sm:rounded-2xl transition-all transform hover:scale-110 border border-white/10 z-10 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
            isInWishlist(product.id) 
              ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
              : "bg-black/50 text-white hover:text-amber-500 hover:bg-black/70"
          }`}
        >
          <Heart size={14} className={`sm:w-5 sm:h-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} aria-hidden="true" />
        </button>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-amber-500 text-black text-[8px] sm:text-[11px] font-bold px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-xl shadow-lg shadow-amber-500/20">
            {product.badge}
          </div>
        )}

        {/* Desktop Hover Overlay Button */}
        <div className="hidden lg:block absolute inset-x-4 bottom-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out space-y-2">
          <div className="flex items-center bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
            <button onClick={decrementQty} className="p-3 hover:bg-white/10 text-white transition-colors"><Minus size={16} /></button>
            <div className="flex-1 text-center text-white font-black">{quantity}</div>
            <button onClick={incrementQty} className="p-3 hover:bg-white/10 text-white transition-colors"><Plus size={16} /></button>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, quantity);
              setQuantity(1);
            }}
            aria-label={`إضافة ${product.name} إلى السلة`}
            className="w-full bg-white text-black hover:bg-amber-500 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <ShoppingCart size={18} aria-hidden="true" />
            أضف للسلة
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-6 flex flex-col flex-1">
        <span className="text-amber-500 text-[8px] sm:text-[11px] font-bold uppercase tracking-wider mb-1 sm:mb-2 block">
          {product.category}
        </span>
        <h3 className="text-[11px] sm:text-lg font-bold text-white mb-2 sm:mb-4 line-clamp-1 group-hover:text-amber-500 transition-colors">
          {product.name}
        </h3>
        
        <AnimatePresence>
          {showDescription && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="text-gray-400 text-[10px] sm:text-sm mb-4 overflow-hidden"
            >
              {product.description || "لا يوجد وصف حالياً."}
            </motion.p>
          )}
        </AnimatePresence>
        
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[14px] sm:text-2xl font-bold text-amber-500 whitespace-nowrap">
              {product.price} <span className="text-[9px] sm:text-sm font-normal text-gray-500 mr-0.5">ج.م</span>
            </div>
            
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden h-9">
              <button onClick={decrementQty} className="px-2.5 h-full hover:bg-white/10 text-gray-400 transition-colors"><Minus size={12} /></button>
              <div className="px-1 text-center text-white font-bold text-xs min-w-[24px]">{quantity}</div>
              <button onClick={incrementQty} className="px-2.5 h-full hover:bg-white/10 text-gray-400 transition-colors"><Plus size={12} /></button>
            </div>

            <button 
              onClick={() => setShowDescription(!showDescription)}
              aria-label={showDescription ? "إخفاء الوصف" : "عرض الوصف"}
              className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${showDescription ? "bg-white/10 text-amber-500" : "text-gray-500 hover:text-white hover:bg-white/5 border border-white/5"}`}
            >
              {showDescription ? <ChevronUp size={14} className="sm:w-5 sm:h-5" aria-hidden="true" /> : <ChevronDown size={14} className="sm:w-5 sm:h-5" aria-hidden="true" />}
            </button>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, quantity);
              setQuantity(1);
            }}
            aria-label={`إضافة ${product.name} إلى السلة`}
            className="lg:hidden w-full bg-amber-500 text-black py-2.5 sm:py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shadow-lg shadow-amber-500/10 text-[10px] sm:text-sm"
          >
            <ShoppingCart size={14} className="sm:w-4 sm:h-4" aria-hidden="true" />
            أضف للسلة
          </button>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = "ProductCard";
export default ProductCard;
