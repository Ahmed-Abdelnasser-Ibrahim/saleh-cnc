import React from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { getDb } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient";
import { Metadata } from "next";

export const revalidate = 600;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const db = await getDb();
  const product = db.products.find(p => p.id.toString() === id);

  if (!product) {
    return {
      title: "المنتج غير موجود | صالح CNC",
    };
  }

  return {
    title: `${product.name} | صالح CNC`,
    description: product.description || `تصميم ${product.category} فريد من صالح CNC. ${product.name} بجودة عالية.`,
    openGraph: {
      title: `${product.name} | صالح CNC`,
      description: product.description || `تصميم ${product.category} فريد من صالح CNC.`,
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const db = await getDb();
  const product = db.products.find(p => p.id.toString() === id);

  if (!product) {
    notFound();
  }

  const relatedProducts = db.products
    .filter(p => p.category === product.category && p.id.toString() !== product.id.toString())
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      <div className="pt-32 pb-20">
        <ProductDetailsClient product={product} relatedProducts={relatedProducts} />
      </div>
      <Footer />
    </main>
  );
}
