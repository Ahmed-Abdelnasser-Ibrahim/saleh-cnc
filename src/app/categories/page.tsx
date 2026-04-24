import React from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { categories } from "@/lib/data";
import { ArrowLeft, Box } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/UI/Reveal";

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-24">
        <header className="mb-12 sm:mb-16 text-center">
          <Reveal>
            <div className="inline-flex p-3 bg-amber-500/10 text-amber-500 rounded-2xl mb-4 sm:mb-6">
              <Box size={32} className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6">أقسام المتجر</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-gray-400 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4">
              تصفح منتجاتنا حسب الفئة لتجد التصميم المثالي الذي تبحث عنه بسهولة وسرعة.
            </p>
          </Reveal>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {categories.map((cat, i) => (
            <Link key={cat.id} href={`/products?category=${encodeURIComponent(cat.name)}`}>
              <Reveal delay={i * 0.1}>
                <div className="group relative h-56 sm:h-[400px] rounded-2xl sm:rounded-[40px] overflow-hidden shadow-2xl border border-white/5 cursor-pointer">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 transition-opacity" />
                  
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-10 sm:right-10 sm:left-10 text-center sm:text-right">
                    <h2 className="text-lg sm:text-3xl font-bold text-white mb-2 sm:mb-4">{cat.name}</h2>
                    <div className="hidden sm:inline-flex items-center gap-2 bg-amber-500 text-black font-bold py-3 px-6 rounded-2xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      اكتشف المنتجات
                      <ArrowLeft size={18} />
                    </div>
                  </div>
                </div>
              </Reveal>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
