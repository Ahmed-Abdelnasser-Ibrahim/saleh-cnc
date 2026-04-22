"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex flex-col items-center justify-center pt-40 md:pt-48 pb-20 overflow-hidden text-center">
      {/* Radial Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square bg-amber-500/5 blur-[80px] lg:blur-[150px] rounded-full -z-0" />
      
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 py-2 px-4 lg:px-6 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] lg:text-sm font-bold mb-6 lg:mb-8 shadow-lg shadow-amber-500/5"
        >
          <Sparkles size={14} className="lg:w-4 lg:h-4" />
          <span>أفضل تصميمات الـ CNC والليزر في مصر</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-[1.2] lg:leading-[1.1] mb-6 lg:mb-8 max-w-5xl tracking-tight"
        >
          اجعل خيالك <span className="text-gradient">واقعاً</span> <br className="hidden sm:block" /> 
          بدقة الليزر
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-400 text-sm sm:text-lg md:text-xl lg:text-2xl max-w-2xl mb-10 lg:mb-12 leading-relaxed"
        >
          متخصصون في تحويل التصميمات الهندسية المعقدة إلى قطع فنية خشبية فريدة تضفي لمسة من الفخامة والجمال على مساحتك الخاصة.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-row items-center justify-center gap-3 sm:gap-6 w-full sm:w-auto px-4 sm:px-0"
        >
          <Link
            href="/products"
            className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 lg:py-5 px-6 lg:px-10 rounded-xl lg:rounded-2xl flex items-center justify-center gap-2 lg:gap-3 transition-all transform hover:scale-105 shadow-xl shadow-amber-500/20 group text-sm lg:text-base"
          >
            تصفح المتجر
            <ArrowLeft className="group-hover:-translate-x-2 transition-transform w-4 h-4 lg:w-5 lg:h-5" />
          </Link>
          
          <Link
            href="/about"
            className="flex-1 sm:flex-none bg-white/5 hover:bg-white/10 border border-white/10 py-4 lg:py-5 px-6 lg:px-10 rounded-xl lg:rounded-2xl font-bold transition-all backdrop-blur-md text-sm lg:text-base text-center"
          >
            من نحن؟
          </Link>
        </motion.div>
      </div>

      {/* Decorative Orbs - Optimized for mobile performance */}
      <div className="absolute -top-20 -right-20 w-64 lg:w-96 h-64 lg:h-96 bg-amber-500/5 blur-[60px] lg:blur-[100px] rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-64 lg:w-96 h-64 lg:h-96 bg-blue-500/5 blur-[60px] lg:blur-[100px] rounded-full" />
    </section>
  );
}
