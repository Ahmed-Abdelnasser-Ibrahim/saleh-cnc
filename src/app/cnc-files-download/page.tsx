import React from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Metadata } from "next";
import Link from "next/link";
import { Download, FileCode, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "تحميل ملفات CNC مجانية | تصميمات DXF و Artcam جاهزة للتشغيل",
  description: "أكبر مكتبة لتحميل ملفات CNC مجاناً. تصميمات ليزر، أويما، وأثاث بصيغ DXF, CDR, و STL جاهزة للتحميل والاستخدام المباشر على ماكيناتك.",
  keywords: ["تحميل ملفات CNC", "تصميمات CNC مجانية", "ملفات DXF خشب", "رسم ليزر جاهز"],
};

export default function CncFilesDownloadPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-4">
        <header className="mb-16 text-center lg:text-right">
          <h1 className="text-4xl md:text-6xl font-black mb-8"><span className="text-amber-500">تحميل ملفات CNC</span> وتصميمات ليزر مجانية</h1>
          <p className="text-gray-400 text-lg max-w-3xl leading-relaxed">
            نشارككم في صالح CNC أفضل <strong>ملفات CNC الجاهزة</strong> التي تساعد أصحاب الورش والمصممين على بدء مشاريعهم بسرعة. مكتبتنا المتجددة تحتوي على <strong>تصميمات DXF</strong> و <strong>ملفات Artcam</strong> مختبرة وجاهزة للعمل.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[
             { title: "تصميمات ساعات ليزر", format: "DXF, CDR", count: "15 ملف", desc: "مجموعة متنوعة من الساعات الكلاسيكية والمودرن." },
             { title: "براويز وديكورات جدران", format: "DXF, SVG", count: "25 ملف", desc: "أشكال هندسية ونقوش إسلامية متميزة." },
             { title: "نماذج أثاث CNC", format: "STL, CRV", count: "10 ملفات", desc: "كراسي، طاولات، ووحدات تخزين بسيطة." },
           ].map((item, i) => (
             <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[32px] hover:border-amber-500/50 transition-all group">
                <FileCode size={40} className="text-amber-500 mb-6" />
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-6">{item.desc}</p>
                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mb-8">
                   <span className="bg-white/5 px-3 py-1 rounded-full border border-white/5">{item.format}</span>
                   <span className="bg-white/5 px-3 py-1 rounded-full border border-white/5">{item.count}</span>
                </div>
                <button className="w-full bg-white/5 group-hover:bg-amber-500 group-hover:text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all">
                   <Download size={18} />
                   طلب التحميل عبر واتساب
                </button>
             </div>
           ))}
        </div>

        <section className="mt-24 p-8 md:p-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-[40px] text-black">
           <div className="max-w-4xl">
              <h2 className="text-3xl md:text-5xl font-black mb-8">كيف تحصل على الملفات؟</h2>
              <div className="space-y-6">
                 {[
                   "اختر القسم الذي يهمك من القائمة أعلاه.",
                   "تواصل معنا عبر الواتساب لتلقي الروابط المباشرة.",
                   "جميع الملفات تم اختبارها على ماكيناتنا الخاصة لضمان الجودة."
                 ].map((step, i) => (
                   <div key={i} className="flex items-start gap-4">
                      <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">{i+1}</div>
                      <p className="text-lg font-bold">{step}</p>
                   </div>
                 ))}
              </div>
              <Link 
                href="https://wa.me/201068256479?text=أهلاً صالح CNC، أريد تحميل ملفات CNC المجانية"
                className="inline-block mt-12 bg-black text-white px-10 py-5 rounded-2xl font-black hover:scale-105 transition-all shadow-2xl"
              >
                اطلب الملفات الآن
              </Link>
           </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
