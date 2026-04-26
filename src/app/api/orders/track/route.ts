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
    
    // Clean the query: remove '#' if present at the beginning
    const cleanQuery = query.trim().startsWith("#") ? query.trim().slice(1) : query.trim();

    // Smart Search: Check for exact ID, partial ID (suffix), or Phone
    let order;

    // 1. Try finding by full ID if it's 24 chars
    if (cleanQuery.length === 24) {
      try {
        order = await OrderModel.findById(cleanQuery).lean();
      } catch (e) {
        // Not a valid ObjectId, skip to partial search
      }
    }

    // 2. Try finding by ID suffix (flexible search)
    if (!order) {
      // Use MongoDB aggregation or $expr to match suffix of string ID
      // This is the key for finding orders by the last 6 chars like 'B5D827'
      order = await OrderModel.findOne({
        $expr: {
          $regexMatch: {
            input: { $toString: "$_id" },
            regex: cleanQuery + "$",
            options: "i"
          }
        }
      }).sort({ createdAt: -1 }).lean();
    }
    
    // 3. Try finding by Phone
    if (!order) {
      order = await OrderModel.findOne({ phone: cleanQuery }).sort({ createdAt: -1 }).lean();
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
      createdAt: order.createdAt || order.date,
      total: order.total,
      itemsCount: order.items?.length || 0
    });

  } catch (error) {
    console.error("Tracking API Error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء البحث عن الطلب" }, { status: 500 });
  }
}
