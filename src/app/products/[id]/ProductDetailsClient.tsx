"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { ShoppingCart, Heart, Plus, Minus, Share2 } from "lucide-react";
import ProductCard from "@/components/Home/ProductCard";

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailsClient({ product, relatedProducts }: ProductDetailsClientProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleToggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("تم نسخ رابط المنتج!");
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Image Section */}
        <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden bg-[#111] border border-white/10 shadow-2xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {product.badge && (
            <div className="absolute top-6 left-6 bg-amber-500 text-black font-bold px-4 py-2 rounded-xl shadow-lg">
              {product.badge}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="flex flex-col">
          <div className="mb-4">
            <span className="text-amber-500 font-bold uppercase tracking-wider text-sm md:text-base">
              {product.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {product.name}
          </h1>

          <div className="text-3xl md:text-4xl font-bold text-amber-500 mb-8">
            {product.price} <span className="text-lg md:text-xl font-normal text-gray-500 mr-2">ج.م</span>
          </div>

          <div className="prose prose-invert max-w-none mb-10">
            <p className="text-gray-300 text-lg leading-relaxed">
              {product.description || "لا يوجد وصف متوفر لهذا المنتج. نتميز في صالح CNC بتقديم أعلى جودة في التصنيع والخامات لنضمن لك قطعة فنية فريدة تعيش طويلاً."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl h-14 w-full sm:w-auto">
              <button onClick={decrementQty} className="px-6 h-full hover:bg-white/10 text-white transition-colors rounded-r-2xl">
                <Minus size={20} />
              </button>
              <div className="flex-1 sm:w-16 text-center text-white font-bold text-xl">{quantity}</div>
              <button onClick={incrementQty} className="px-6 h-full hover:bg-white/10 text-white transition-colors rounded-l-2xl">
                <Plus size={20} />
              </button>
            </div>

            <button
              onClick={() => {
                addToCart(product, quantity);
                setQuantity(1);
              }}
              className="w-full sm:flex-1 h-14 bg-amber-500 text-black hover:bg-amber-400 font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 text-lg shadow-lg shadow-amber-500/20"
            >
              <ShoppingCart size={24} />
              إضافة إلى السلة
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleWishlist}
              className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border transition-all ${
                isInWishlist(product.id)
                  ? "border-amber-500 bg-amber-500/10 text-amber-500"
                  : "border-white/10 hover:border-white/20 text-gray-400 hover:text-white"
              }`}
            >
              <Heart size={20} className={isInWishlist(product.id) ? "fill-current" : ""} />
              {isInWishlist(product.id) ? "محفوظ في المفضلة" : "إضافة للمفضلة"}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all"
              aria-label="مشاركة المنتج"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-32">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-white">منتجات مشابهة</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
