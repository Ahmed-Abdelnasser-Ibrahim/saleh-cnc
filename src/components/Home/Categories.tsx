"use client";

import React from "react";
import { categories } from "@/lib/data";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Categories() {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 md:mb-16 gap-4 md:gap-6 text-center md:text-right">
          <div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">تصنيفات التصميم</h2>
            <p className="text-gray-400 text-sm md:text-lg">اختر القسم الذي يناسب احتياجاتك من بين تشكيلتنا المتنوعة.</p>
          </div>
          <Link href="/categories" className="text-amber-500 hover:text-amber-400 flex items-center gap-2 font-bold text-base md:text-lg transition-colors group">
            عرض كل الأقسام
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {categories.map((cat, i) => (
            <Link 
              key={cat.id} 
              href={`/products?category=${encodeURIComponent(cat.name)}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-48 sm:h-64 md:h-80 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-white/5"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 flex flex-col items-center justify-end md:justify-center p-4 md:p-6 text-center">
                  <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white mb-1 md:mb-3">{cat.name}</h3>
                  <div className="w-8 md:w-12 h-0.5 md:h-1 bg-amber-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
