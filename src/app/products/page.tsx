import React, { Suspense } from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { getDb } from "@/lib/db";
import ProductsClient from "./ProductsClient";
import { categories as staticCategories } from "@/lib/data";

export const revalidate = 600; // Revalidate every 10 minutes

export default async function ProductsPage() {
  const db = await getDb();
  const allProducts = db.products || [];

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      <Suspense fallback={<div className="pt-48 pb-96 text-center text-white">جاري تحميل المنتجات...</div>}>
        <ProductsClient initialProducts={allProducts} categories={staticCategories} />
      </Suspense>
      <Footer />
    </main>
  );
}
