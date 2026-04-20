"use client";

import React from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { categories } from "@/lib/data";
import { motion } from "framer-motion";
import { ArrowLeft, Box } from "lucide-react";
import Link from "next/link";

import Image from "next/image";

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-24">
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex p-3 bg-amber-500/10 text-amber-500 rounded-2xl mb-6"
          >
            <Box size={32} />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">أقسام المتجر</h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            تصفح منتجاتنا حسب الفئة لتجد التصميم المثالي الذي تبحث عنه بسهولة وسرعة.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-[400px] rounded-[40px] overflow-hidden shadow-2xl border border-white/5"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 transition-opacity" />
              
              <div className="absolute bottom-10 right-10 left-10">
                <h2 className="text-3xl font-bold text-white mb-4">{cat.name}</h2>
                <Link 
                  href={`/products?category=${cat.name}`}
                  className="inline-flex items-center gap-2 bg-amber-500 text-black font-bold py-3 px-6 rounded-2xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
                >
                  اكتشف المنتجات
                  <ArrowLeft size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
