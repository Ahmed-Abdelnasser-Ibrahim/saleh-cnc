"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { products as initialProducts } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProductsGrid() {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data && data.length > 0) {
          setProducts(data.slice(0, 8)); // Show first 8 products on home
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-20 bg-[#050505]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 text-center md:text-right">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">أحدث التصميمات</h2>
            <p className="text-gray-400 text-lg">اكتشف أحدث ما وصل إلينا من قطع فنية مشغولة بعناية.</p>
          </div>
          <Link href="/products" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-3 transition-all group">
            عرض كل المنتجات
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
          </Link>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-3xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 lg:gap-8"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
