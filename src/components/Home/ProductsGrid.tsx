"use client";
import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProductsGridProps {
  initialProducts: Product[];
}

export default function ProductsGrid({ initialProducts }: ProductsGridProps) {
  const [products] = useState(initialProducts);

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

        <div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 lg:gap-8"
        >
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}
