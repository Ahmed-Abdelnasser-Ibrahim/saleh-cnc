"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { products as initialProducts, categories } from "@/lib/data";
import ProductCard from "@/components/Home/ProductCard";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        if (data && data.length > 0) {
          setAllProducts(data);
        }
        setError(null);
      } catch {
        const saved = localStorage.getItem("custom_products");
        if (saved) {
          setAllProducts(JSON.parse(saved));
        } else {
          setError("عذراً، فشل تحميل المنتجات. يرجى المحاولة لاحقاً.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter(p => (activeCategory === "الكل" || p.category === activeCategory))
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return 0;
      });
  }, [allProducts, activeCategory, searchTerm, sortBy]);

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-24">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">منتجاتنا</h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
            استكشف مجموعتنا الكاملة من التحف الفنية الخشبية. كل قطعة تم تصميمها بعناية لتلائم ذوقك الرفيع.
          </p>
        </header>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          <div className="relative flex-1 group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
            <input 
              type="text" 
              placeholder="ابحث عن تصميم معين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-6 outline-none focus:border-amber-500 transition-all"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
              <Filter size={18} className="text-amber-500" />
              <select 
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-bold pr-8"
              >
                <option value="الكل">جميع التصنيفات</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
              <SlidersHorizontal size={18} className="text-amber-500" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-bold pr-8"
              >
                <option value="default">الترتيب الافتراضي</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-8 text-gray-500 text-sm">
          عرض {filteredProducts.length} من أصل {allProducts.length} منتج
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-3xl aspect-[4/5] animate-pulse border border-white/5" />
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="py-20 text-center bg-red-500/5 rounded-3xl border border-red-500/10 max-w-2xl mx-auto">
            <p className="text-red-400 font-bold mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-500 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-600 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !error && (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && !error && filteredProducts.length === 0 && (
          <div className="py-32 text-center">
            <Search size={64} className="mx-auto mb-6 text-gray-800" />
            <h3 className="text-2xl font-bold text-gray-500">عذراً، لم نجد ما تبحث عنه.</h3>
            <p className="text-gray-600 mt-2">جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
