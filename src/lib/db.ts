import connectDB from "@/lib/mongodb/mongoose";
import Product from "@/lib/mongodb/models/Product";
import Order from "@/lib/mongodb/models/Order";
import Settings from "@/lib/mongodb/models/Settings";
import { products } from "./data";

export async function getDb() {
  await connectDB();
  
  const dbProducts = await Product.find({}).sort({ createdAt: -1 });
  const dbOrders = await Order.find({}).sort({ createdAt: -1 });
  let dbSettings = await Settings.findOne({});

  if (!dbSettings) {
    dbSettings = await Settings.create({
      siteName: "صالح CNC",
      whatsapp: "01068256479",
      email: "info@saleh-cnc.com",
      address: "القاهرة، مصر"
    });
  }

  // If no products in DB, seed with initial data
  if (dbProducts.length === 0) {
    await Product.insertMany(products);
    const refreshedProducts = await Product.find({}).sort({ createdAt: -1 });
    return {
      products: JSON.parse(JSON.stringify(refreshedProducts)),
      orders: JSON.parse(JSON.stringify(dbOrders)),
      settings: JSON.parse(JSON.stringify(dbSettings))
    };
  }

  return {
    products: JSON.parse(JSON.stringify(dbProducts)),
    orders: JSON.parse(JSON.stringify(dbOrders)),
    settings: JSON.parse(JSON.stringify(dbSettings))
  };
}
