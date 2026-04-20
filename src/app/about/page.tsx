"use client";

import React from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Heart, Award } from "lucide-react";

import Image from "next/image";

export default function AboutPage() {
  const features = [
    { title: "دقة متناهية", desc: "نستخدم أحدث تقنيات الليزر العالمية لضمان تنفيذ أدق التفاصيل في تصميماتنا.", icon: Zap },
    { title: "جودة الأخشاب", desc: "نختار بعناية أفضل أنواع الأخشاب الطبيعية والمعالجة لضمان متانة وجمال القطع.", icon: Award },
    { title: "تصميمات حصرية", desc: "نمتلك فريقاً من المصممين المبدعين الذين يبتكرون قطعاً فنية لا تجدها في مكان آخر.", icon: Heart },
    { title: "ضمان الرضا", desc: "نلتزم بتقديم خدمة عملاء ممتازة وضمان جودة المنتج حتى بعد الاستلام.", icon: ShieldCheck },
  ];

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-48 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-8 leading-tight"
          >
            عن متجر <span className="text-amber-500">صالح CNC</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
          >
            نحن لسنا مجرد ورشة للنجارة، بل نحن استوديو فني يدمج التكنولوجيا الحديثة بالحرفية التقليدية لخلق تحف فنية خشبية تروي قصة.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white/[0.01]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-video rounded-[40px] overflow-hidden border border-white/10"
            >
              <Image src="/images/hero-cnc.jpg" alt="Workplace" fill className="w-full h-full object-cover" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-8">قصتنا ورؤيتنا</h2>
              <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                <p>بدأت رحلتنا في &quot;صالح CNC&quot; بشغف كبير بالأخشاب وإيمان بأن التكنولوجيا يمكن أن تفتح آفاقاً جديدة للإبداع. من هنا قررنا التخصص في أعمال الـ CNC والليزر لنقدم حلولاً ديكورية مبتكرة.</p>
                <p>رؤيتنا هي أن نصبح الخيار الأول لكل من يبحث عن التميز والفخامة في منزله أو مكتبه، من خلال تقديم منتجات تجمع بين الدقة الهندسية واللمسة الفنية الإبداعية.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[32px] bg-white/5 border border-white/5 hover:border-amber-500/20 transition-all text-center group"
              >
                <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
