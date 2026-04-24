import React from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import ProductsGrid from "@/components/Home/ProductsGrid";
import { getDb } from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تصميمات CNC خشب | أحدث موديلات الحفر والتقطيع لعام 2026",
  description: "استعرض مجموعة حصرية من تصميمات CNC خشب المبتكرة. نقدم أرقى موديلات ديكورات الجدران، الأسقف، والأثاث المشغول بدقة متناهية.",
  keywords: ["تصميمات CNC خشب", "حفر خشب مودرن", "ديكورات CNC", "نماذج خشبية CNC"],
};

export default async function WoodCncDesignsPage() {
  const db = await getDb();
  const products = db.products?.filter(p => p.category === "ديكور جدران") || [];

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-4">
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-8">تصميمات <span className="text-amber-500">CNC خشب</span> مودرن</h1>
          <div className="prose prose-invert max-w-4xl text-gray-400 text-lg leading-relaxed">
            <p>
              تعد <strong>تصميمات CNC خشب</strong> الحل الأمثل لإضافة لمسة فنية فريدة لمنزلك أو مكتبك. في صالح CNC، نستخدم أحدث التكنولوجيات لتحويل كتل الخشب الجامدة إلى قطع فنية تنبض بالحياة. 
              سواء كنت تبحث عن براويز جدارية، قواطيع خشبية، أو تصميمات أثاث معقدة، فإن خبرتنا في <strong>أعمال الـ CNC</strong> تضمن لك الدقة والجودة.
            </p>
            <p>
              نحن نهتم بأدق التفاصيل في كل <strong>تصميم خشب CNC</strong> نقوم بتنفيذه، مما يجعلنا الوجهة المفضلة للمصممين وأصحاب الذوق الرفيع في مصر.
            </p>
          </div>
        </header>
        
        <ProductsGrid initialProducts={products} />
        
        <section className="mt-24 p-8 md:p-12 bg-white/5 border border-white/10 rounded-[40px]">
          <h2 className="text-3xl font-bold mb-6">لماذا تختار تصميمات الأخشاب لدينا؟</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
               <h3 className="text-xl font-bold text-amber-500 mb-2">دقة متناهية</h3>
               <p className="text-gray-400">نستخدم أدوات قطع عالية الجودة لضمان حواف نظيفة وتفاصيل دقيقة في كل قطعة.</p>
            </div>
            <div>
               <h3 className="text-xl font-bold text-amber-500 mb-2">خامات ممتازة</h3>
               <p className="text-gray-400">نختار أفضل أنواع الأخشاب التي تتحمل العوامل الجوية وتدوم طويلاً.</p>
            </div>
            <div>
               <h3 className="text-xl font-bold text-amber-500 mb-2">ابتكار مستمر</h3>
               <p className="text-gray-400">نتابع أحدث خطوط الموضة العالمية في عالم الديكور لنقدم لك دائماً كل ما هو جديد.</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
