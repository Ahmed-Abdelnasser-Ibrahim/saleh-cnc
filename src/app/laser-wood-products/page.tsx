import React from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import ProductsGrid from "@/components/Home/ProductsGrid";
import { getDb } from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "منتجات ليزر خشب | هدايا وديكورات مقصوصة بالليزر - جودة عالية",
  description: "اكتشف أرقى منتجات ليزر خشب في متجر صالح CNC. ساعات، هدايا مخصصة، وديكورات فريدة تم تصنيعها بأحدث ماكينات الليزر لضمان أعلى مستويات الدقة والجمال.",
  keywords: ["منتجات ليزر خشب", "حفر ليزر على الخشب", "تقطيع ليزر مصر", "هدايا خشب ليزر"],
};

export const dynamic = "force-dynamic";

export default async function LaserWoodProductsPage() {
  const db = await getDb();
  const products = db.products?.filter(p => p.category === "ساعات" || p.category === "هدايا") || [];

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-4">
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-8">منتجات <span className="text-amber-500">ليزر خشب</span> إبداعية</h1>
          <div className="prose prose-invert max-w-4xl text-gray-400 text-lg leading-relaxed">
            <p>
              تتميز <strong>منتجات ليزر خشب</strong> لدينا بالتوازن المثالي بين الدقة التكنولوجية واللمسة الفنية اليدوية. نحن متخصصون في <strong>تقطيع وحفر الليزر</strong> على مختلف أنواع الأخشاب لإنتاج قطع فنية لا تبهت بمرور الزمن.
            </p>
            <p>
              سواء كنت تبحث عن <strong>ساعات حائط ليزر</strong> بتصميمات معقدة أو <strong>هدايا خشبية</strong> محفورة بالأسماء، فإن صالح CNC يوفر لك تشكيلة واسعة تلبي كافة الأذواق والاحتياجات. كل منتج يخرج من ورشتنا هو شهادة على شغفنا بالكمال في أعمال <strong>ليزر CNC</strong>.
            </p>
          </div>
        </header>
        
        <ProductsGrid initialProducts={products} />
      </div>
      <Footer />
    </main>
  );
}
