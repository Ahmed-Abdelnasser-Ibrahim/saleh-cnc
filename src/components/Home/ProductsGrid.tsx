"use client";

import React, { useState, useEffect } from "react";
import { products as initialProducts, categories } from "@/lib/data";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

export default function ProductsGrid() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [allProducts, setAllProducts] = useState(initialProducts);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setAllProducts(data);
        }
      })
      .catch(() => {
        // Fallback to local storage if API fails
        const saved = localStorage.getItem("custom_products");
        if (saved) setAllProducts(JSON.parse(saved));
      });
  }, []);

  const filteredProducts = activeCategory === "الكل" 
    ? allProducts 
    : allProducts.filter(p => p.category === activeCategory);

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-[#050505]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 md:mb-16 gap-6 md:gap-8 text-center lg:text-right">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">اكتشف منتجاتنا</h2>
            <p className="text-gray-400 text-sm md:text-lg max-w-md mx-auto lg:mx-0">تصفح مجموعتنا الواسعة من التصميمات الخشبية المشغولة بدقة واحترافية عالية.</p>
          </div>
          
          {/* Category Filter - Scrollable on mobile */}
          <div className="flex items-center justify-center lg:justify-end gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            <button
              onClick={() => setActiveCategory("الكل")}
              className={`whitespace-nowrap px-5 py-2 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all shrink-0 ${
                activeCategory === "الكل" 
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              الكل
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`whitespace-nowrap px-5 py-2 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all shrink-0 ${
                  activeCategory === cat.name 
                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
