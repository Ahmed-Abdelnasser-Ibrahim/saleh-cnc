import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/mongoose";
import ProductModel from "@/lib/mongodb/models/Product";
import { productSchema } from "@/lib/validations";
import { sanitizeObject } from "@/lib/security";

// Helper to check admin status
const isAdmin = (request: Request) => {
  return request.headers.get("x-admin-auth") === "true";
};

export async function GET() {
  try {
    await connectDB();
    const products = await ProductModel.find({}).sort({ createdAt: -1 });
    // Ensure every product has an 'id' field for the frontend
    const mappedProducts = products.map(p => ({
      ...p.toObject(),
      id: p._id.toString()
    }));
    return NextResponse.json(mappedProducts);
  } catch (error) {
    console.error("API Error (GET /products):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const sanitizedBody = sanitizeObject(body);
    const validation = productSchema.safeParse(sanitizedBody);

    if (!validation.success) {
      return NextResponse.json({ 
        error: "Validation Failed", 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const productData = validation.data;
    const newProduct = await ProductModel.create({
      ...productData,
      price: Number(productData.price)
    });

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
    await connectDB();
    const body = await request.json();
    const sanitizedBody = sanitizeObject(body);
    const validation = productSchema.safeParse(sanitizedBody);

    if (!validation.success || !body.id) {
      return NextResponse.json({ 
        error: "Validation Failed or Missing ID", 
        details: validation.success ? null : validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      body.id,
      { ...validation.data, price: Number(validation.data.price) },
      { new: true }
    );
    
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
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
    await connectDB();
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error (DELETE /products):", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
