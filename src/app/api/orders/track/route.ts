import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/mongoose";
import OrderModel from "@/lib/mongodb/models/Order";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q"); // Order ID or Phone

  if (!query) {
    return NextResponse.json({ error: "يرجى إدخال رقم الطلب أو رقم الهاتف" }, { status: 400 });
  }

  try {
    await connectDB();
    
    // Search by ID (if it looks like a MongoID) or by Phone
    let order;
    if (query.length >= 24) {
      order = await OrderModel.findById(query).lean();
    }
    
    if (!order) {
      order = await OrderModel.findOne({ phone: query }).sort({ createdAt: -1 }).lean();
    }

    if (!order) {
      return NextResponse.json({ error: "لم يتم العثور على طلب بهذه البيانات" }, { status: 404 });
    }

    // Return only necessary tracking info (Security)
    return NextResponse.json({
      id: order._id.toString(),
      customer: order.customer,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      total: order.total,
      itemsCount: order.items.length
    });

  } catch (error) {
    console.error("Tracking API Error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء البحث عن الطلب" }, { status: 500 });
  }
}
