import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import Hero from "@/components/Home/Hero";
import Categories from "@/components/Home/Categories";
import ProductsGrid from "@/components/Home/ProductsGrid";
import ContactSection from "@/components/Home/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Categories />
      <ProductsGrid />
      <ContactSection />
      <Footer />
    </main>
  );
}
