import React from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/UI/Reveal";

export default function Hero() {
  return (
    <section className="relative min-h-[75vh] lg:min-h-[80vh] flex flex-col items-center justify-center pt-32 md:pt-40 pb-16 overflow-hidden text-center">
      {/* Radial Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] aspect-square bg-amber-500/5 blur-[80px] lg:blur-[120px] rounded-full -z-0" />
      
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 py-2 px-4 lg:px-6 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] lg:text-xs font-bold mb-6 lg:mb-8 shadow-xl shadow-amber-500/5 backdrop-blur-sm">
            <Sparkles size={14} className="lg:w-4 lg:h-4" />
            <span>أفضل تصميمات الـ CNC والليزر في مصر</span>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.2] lg:leading-[1.1] mb-6 lg:mb-8 max-w-5xl tracking-tighter">
            أفضل أعمال <span className="text-gradient">ليزر CNC</span> <br className="hidden sm:block" /> 
            وتصميمات الخشب
          </h1>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="text-gray-300 text-sm sm:text-lg md:text-xl lg:text-xl max-w-3xl mb-8 lg:mb-12 leading-relaxed font-medium">
            متخصصون في تحويل التصميمات الهندسية المعقدة إلى قطع فنية خشبية فريدة تضفي لمسة من الفخامة والجمال على مساحتك الخاصة.
          </p>
        </Reveal>

        <Reveal delay={0.6}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-6 sm:px-0">
            <Link
              href="/products"
              aria-label="تصفح المتجر"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-black font-black py-3.5 lg:py-4.5 px-8 lg:px-12 rounded-xl lg:rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-amber-500/30 group text-sm lg:text-lg outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50"
            >
              تصفح المتجر
              <ArrowLeft className="group-hover:-translate-x-2 transition-transform w-4 h-4 lg:w-5 lg:h-5" />
            </Link>
            
            <Link
              href="/about"
              aria-label="تعرف علينا"
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 py-3.5 lg:py-4.5 px-8 lg:px-12 rounded-xl lg:rounded-2xl font-black transition-all backdrop-blur-md text-sm lg:text-lg text-center text-white outline-none focus-visible:ring-4 focus-visible:ring-white/20"
            >
              من نحن؟
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Decorative Orbs - Optimized for mobile performance */}
      <div className="absolute -top-20 -right-20 w-64 lg:w-96 h-64 lg:h-96 bg-amber-500/5 blur-[60px] lg:blur-[100px] rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-64 lg:w-96 h-64 lg:h-96 bg-blue-500/5 blur-[60px] lg:blur-[100px] rounded-full" />
    </section>
  );
}
