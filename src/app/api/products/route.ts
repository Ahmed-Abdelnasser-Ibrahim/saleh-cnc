import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import { Product } from "@/lib/data";
import { productSchema } from "@/lib/validations";
import { sanitizeObject } from "@/lib/security";

// Helper to check admin status
const isAdmin = (request: Request) => {
  return request.headers.get("x-admin-auth") === "true";
};

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json(db.products || []);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const sanitizedBody = sanitizeObject(body);
    const validation = productSchema.safeParse(sanitizedBody);

    if (!validation.success) {
      return NextResponse.json({ 
        error: "Validation Failed", 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const product = validation.data;
    const db = getDb();
    const newProduct: Product = {
      ...product,
      id: Date.now(),
      price: Number(product.price)
    } as Product;

    db.products = [newProduct, ...db.products];
    saveDb(db);
    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const sanitizedBody = sanitizeObject(body);
    const validation = productSchema.safeParse(sanitizedBody);

    if (!validation.success || !body.id) {
      return NextResponse.json({ 
        error: "Validation Failed or Missing ID", 
        details: validation.success ? null : validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const updatedProduct = validation.data;
    const db = getDb();
    const index = db.products.findIndex((p: Product) => p.id === body.id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    db.products[index] = { 
      ...updatedProduct, 
      id: body.id, 
      price: Number(updatedProduct.price) 
    } as Product;
    
    saveDb(db);
    return NextResponse.json(db.products[index]);
  } catch {
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
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
