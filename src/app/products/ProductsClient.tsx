"use client";

import React, { useState, useMemo } from "react";
import ProductCard from "@/components/Home/ProductCard";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product } from "@/lib/data";

export interface Category {
  id: number;
  name: string;
  image: string;
}

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const activeCategory = categoryParam || "الكل";
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "الكل") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/products?${params.toString()}`);
  };

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter(p => (activeCategory === "الكل" || p.category === activeCategory))
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return 0;
      });
  }, [initialProducts, activeCategory, searchTerm, sortBy]);

  return (
    <div className="container mx-auto px-4 pt-32 pb-24">
      <header className="mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">منتجاتنا</h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
          استكشف مجموعتنا الكاملة من التحف الفنية الخشبية. كل قطعة تم تصميمها بعناية لتلائم ذوقك الرفيع.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="ابحث عن تصميم معين..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 md:py-4 pr-12 pl-6 outline-none focus:border-amber-500 transition-all text-sm md:text-base"
          />
        </div>
        
        <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 md:px-4 py-2.5 md:py-2">
            <Filter size={16} className="text-amber-500 shrink-0" />
            <select 
              value={activeCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="bg-transparent border-none outline-none text-xs md:text-sm font-bold pr-6 w-full"
            >
              <option value="الكل">جميع الأقسام</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 md:px-4 py-2.5 md:py-2">
            <SlidersHorizontal size={16} className="text-amber-500 shrink-0" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none outline-none text-xs md:text-sm font-bold pr-6 w-full"
            >
              <option value="default">الترتيب</option>
              <option value="price-low">الأرخص</option>
              <option value="price-high">الأغلى</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-8 text-gray-500 text-sm">
        عرض {filteredProducts.length} من أصل {initialProducts.length} منتج
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 lg:gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-32 text-center">
          <Search size={64} className="mx-auto mb-6 text-gray-800" />
          <h3 className="text-2xl font-bold text-gray-500">عذراً، لم نجد ما تبحث عنه.</h3>
          <p className="text-gray-600 mt-2">جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً.</p>
        </div>
      )}
    </div>
  );
}
