import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import Hero from "@/components/Home/Hero";
import Categories from "@/components/Home/Categories";
import ProductsGrid from "@/components/Home/ProductsGrid";
import ContactSection from "@/components/Home/ContactSection";
import { getDb } from "@/lib/db";
import { categories as staticCategories } from "@/lib/data";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const db = getDb();
  const products = db.products?.slice(0, 8) || [];
  
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Categories categories={staticCategories} />
      <ProductsGrid initialProducts={products} />
      <ContactSection />
      <Footer />
    </main>
  );
}
