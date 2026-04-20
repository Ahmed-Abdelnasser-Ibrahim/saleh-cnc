import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import { Order } from "@/lib/data";

export async function GET() {
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

    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
      return NextResponse.json({ error: "Order items are required" }, { status: 400 });
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
