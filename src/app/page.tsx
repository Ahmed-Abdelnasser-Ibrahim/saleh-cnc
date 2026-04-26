import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import Link from "next/link";
import nextDynamic from "next/dynamic";
import { CategorySkeleton, ProductSkeleton, Skeleton } from "@/components/UI/Skeleton";
import Hero from "@/components/Home/Hero";
import { getDb } from "@/lib/db";
import { categories as staticCategories } from "@/lib/data";

const Categories = nextDynamic(() => import("@/components/Home/Categories"), {
  loading: () => (
    <div className="container mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-6 py-12">
      {[...Array(4)].map((_, i) => <CategorySkeleton key={i} />)}
    </div>
  )
});
const ProductsGrid = nextDynamic(() => import("@/components/Home/ProductsGrid"), {
  loading: () => (
    <div className="container mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-6 py-20">
      {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
    </div>
  )
});
const ContactSection = nextDynamic(() => import("@/components/Home/ContactSection"), {
  loading: () => <Skeleton className="h-[500px] m-8" />
});

export const revalidate = 3600; // Revalidate every hour

export const dynamic = "force-dynamic";

export default async function Home() {
  const db = await getDb();
  const products = db.products?.slice(0, 8) || [];
  
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Categories categories={staticCategories} />
      <ProductsGrid initialProducts={products} />
      <ContactSection />
      
      {/* SEO Content Section */}
      <section className="py-20 bg-slate-950/50">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-8">صالح CNC: رواد <span className="text-amber-500">نجارة CNC</span> وحفر الليزر في مصر</h2>
          <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed text-lg">
            <p className="mb-6">
              إذا كنت تبحث عن التميز في عالم <strong>أعمال الخشب والديكور</strong>، فإن صالح CNC هو خيارك الأمثل. نحن نوفر تشكيلة واسعة من <strong>تصميمات CNC خشب</strong> التي تناسب المنازل العصرية والمكاتب الفخمة. 
              تعتمد ورشتنا على أحدث ماكينات <strong>ليزر CNC</strong> لضمان أعلى مستويات الدقة في تقطيع وحفر الأخشاب، مما ينتج قطعاً فنية فريدة تعكس ذوقك الخاص.
            </p>
            <p className="mb-6">
              خدماتنا تشمل <strong>حفر ليزر</strong> على الأخشاب الطبيعية والصناعية، تصنيع <strong>ساعات حائط خشبية</strong> مبتكرة، وتنفيذ هدايا تذكارية مخصصة. 
              نحن نفخر بكوننا من أفضل ورش <strong>الـ CNC في مصر</strong>، حيث نجمع بين الخبرة الحرفية الطويلة والتقنيات الرقمية الحديثة لنقدم لعملائنا منتجات تفوق التوقعات.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link href="/wood-cnc-designs" className="text-amber-500 hover:underline font-bold">تصميمات CNC خشب</Link>
              <span className="text-gray-700">|</span>
              <Link href="/laser-wood-products" className="text-amber-500 hover:underline font-bold">منتجات ليزر خشب</Link>
              <span className="text-gray-700">|</span>
              <Link href="/track-order" className="text-white hover:text-amber-500 font-black bg-white/5 px-4 py-1 rounded-full border border-white/10 transition-all">تتبع طلبك الآن 🔍</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
