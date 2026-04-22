import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import { Product } from "@/lib/data";

// Helper to check admin status
const isAdmin = (request: Request) => {
  return request.headers.get("x-admin-auth") === "true";
};

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json(db.products || []);
  } catch (error) {
    console.error("API Error (GET /products):", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const product = await request.json();

    // Strict Validation
    if (!product.name || typeof product.name !== 'string' || product.name.length < 3) {
      return NextResponse.json({ error: "اسم المنتج مطلوب (على الأقل 3 أحرف)" }, { status: 400 });
    }
    if (!product.price || isNaN(Number(product.price)) || Number(product.price) <= 0) {
      return NextResponse.json({ error: "سعر المنتج يجب أن يكون رقماً موجباً" }, { status: 400 });
    }
    if (!product.category) {
      return NextResponse.json({ error: "تصنيف المنتج مطلوب" }, { status: 400 });
    }

    const db = getDb();
    const newProduct: Product = {
      ...product,
      id: product.id || Date.now(),
      price: Number(product.price)
    };

    db.products = [newProduct, ...db.products];
    saveDb(db);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("API Error (POST /products):", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedProduct = await request.json();

    if (!updatedProduct.id || !updatedProduct.name) {
      return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
    }

    const db = getDb();
    const index = db.products.findIndex((p: Product) => p.id === updatedProduct.id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    db.products[index] = { ...updatedProduct, price: Number(updatedProduct.price) };
    saveDb(db);
    return NextResponse.json(db.products[index]);
  } catch (error) {
    console.error("API Error (PUT /products):", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const db = getDb();
    const initialLength = db.products.length;
    db.products = db.products.filter((p: Product) => p.id !== id);
    
    if (db.products.length === initialLength) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    saveDb(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error (DELETE /products):", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
