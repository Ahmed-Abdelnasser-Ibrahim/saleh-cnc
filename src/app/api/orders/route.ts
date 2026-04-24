import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import { Order } from "@/lib/data";
import { orderSchema } from "@/lib/validations";
import { sanitizeObject } from "@/lib/security";

const isAdmin = (request: Request) => {
  return request.headers.get("x-admin-auth") === "true";
};

export async function GET(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    return NextResponse.json(db.orders || []);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Sanitize all inputs
    const sanitizedBody = sanitizeObject(body);
    
    // 2. Validate with Zod
    const validation = orderSchema.safeParse(sanitizedBody);
    
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Validation Failed", 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const order = validation.data;
    const db = getDb();
    
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      status: "pending"
    } as Order;

    db.orders = [newOrder, ...(db.orders || [])];
    saveDb(db);
    
    return NextResponse.json({ 
      success: true, 
      message: "Order created successfully",
      orderId: newOrder.id 
    }, { status: 201 });

  } catch {
    return NextResponse.json({ error: "Failed to process order" }, { status: 500 });
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
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const db = getDb();
    db.orders = db.orders.filter((o: Order) => o.id !== id);
    saveDb(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error (DELETE /orders):", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
