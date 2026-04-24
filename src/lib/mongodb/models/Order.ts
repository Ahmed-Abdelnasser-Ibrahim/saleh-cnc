import mongoose, { Schema, Document } from "mongoose";
import { OrderItem } from "@/lib/data";

export interface IOrder extends Document {
  customer: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod: string;
  paymentProof?: string;
  date: string;
  address: string;
  city: string;
}

const OrderSchema: Schema = new Schema({
  customer: { type: String, required: true },
  phone: { type: String, required: true },
  items: { type: Array, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: "pending" },
  paymentMethod: { type: String, default: "cod" },
  paymentProof: { type: String },
  date: { type: String, default: () => new Date().toISOString() },
  address: { type: String, required: true },
  city: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
