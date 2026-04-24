import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/mongoose";
import OrderModel from "@/lib/mongodb/models/Order";
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
    await connectDB();
    const orders = await OrderModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("API Error (GET /orders):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
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

    const orderData = validation.data;
    const status = orderData.paymentMethod === "cod" ? "pending" : "pending_confirmation";
    
    const newOrder = await OrderModel.create({
      ...orderData,
      status: status
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Order created successfully",
      orderId: newOrder._id 
    }, { status: 201 });

  } catch (error) {
    console.error("API Error (POST /orders):", error);
    return NextResponse.json({ error: "Failed to process order" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const { id, status, paymentStatus } = body;

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("API Error (PUT /orders):", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
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
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    await OrderModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error (DELETE /orders):", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
