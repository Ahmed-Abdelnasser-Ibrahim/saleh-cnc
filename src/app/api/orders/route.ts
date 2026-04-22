import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import { Order } from "@/lib/data";

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
  } catch (error) {
    console.error("API Error (GET /orders):", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const order = await request.json();

    // Strict Order Validation
    if (!order.customer || order.customer.length < 3) {
      return NextResponse.json({ error: "الاسم مطلوب (على الأقل 3 أحرف)" }, { status: 400 });
    }
    
    const phoneRegex = /^01[0125][0-9]{8}$/;
    if (!order.phone || !phoneRegex.test(order.phone)) {
      return NextResponse.json({ error: "رقم الهاتف غير صحيح (يجب أن يكون رقم مصري صالح)" }, { status: 400 });
    }

    if (!order.address || order.address.length < 5) {
      return NextResponse.json({ error: "العنوان مطلوب بالتفصيل" }, { status: 400 });
    }

    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
      return NextResponse.json({ error: "السلة فارغة، لا يمكن إتمام الطلب" }, { status: 400 });
    }

    const db = getDb();
    const newOrder: Order = {
      ...order,
      id: order.id || `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: order.status || "pending"
    };

    db.orders = [newOrder, ...(db.orders || [])];
    saveDb(db);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("API Error (POST /orders):", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
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
