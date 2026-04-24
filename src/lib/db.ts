import connectDB from "@/lib/mongodb/mongoose";
import ProductModel from "@/lib/mongodb/models/Product";
import OrderModel from "@/lib/mongodb/models/Order";
import SettingsModel from "@/lib/mongodb/models/Settings";
import { products, DbData } from "./data";

export async function getDb(): Promise<DbData> {
  await connectDB();
  
  const dbProducts = await ProductModel.find({}).sort({ createdAt: -1 });
  const dbOrders = await OrderModel.find({}).sort({ createdAt: -1 });
  let dbSettings = await SettingsModel.findOne({});

  if (!dbSettings) {
    dbSettings = await SettingsModel.create({
      siteName: "صالح CNC",
      whatsapp: "01068256479",
      email: "info@saleh-cnc.com",
      address: "القاهرة، مصر"
    });
  }

  // If no products in DB, seed with initial data
  if (dbProducts.length === 0) {
    await ProductModel.insertMany(products.map(p => ({ ...p, _id: undefined })));
    const refreshedProducts = await ProductModel.find({}).sort({ createdAt: -1 });
    return {
      products: JSON.parse(JSON.stringify(refreshedProducts.map(p => ({ ...p.toObject(), id: p._id.toString() })))),
      orders: JSON.parse(JSON.stringify(dbOrders.map(o => ({ ...o.toObject(), id: o._id.toString() })))),
      settings: JSON.parse(JSON.stringify(dbSettings))
    };
  }

  return {
    products: JSON.parse(JSON.stringify(dbProducts.map(p => ({ ...p.toObject(), id: p._id.toString() })))),
    orders: JSON.parse(JSON.stringify(dbOrders.map(o => ({ ...o.toObject(), id: o._id.toString() })))),
    settings: JSON.parse(JSON.stringify(dbSettings))
  };
}
