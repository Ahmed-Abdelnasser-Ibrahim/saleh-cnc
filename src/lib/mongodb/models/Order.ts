import mongoose, { Schema, Document } from "mongoose";
import { OrderItem } from "@/lib/data";

export interface IOrder extends Document {
  customer: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "pending_payment_confirmation" | "paid" | "processing" | "completed" | "cancelled" | "payment_rejected";
  paymentMethod: "cash_on_delivery" | "vodafone_cash" | "instapay";
  paymentStatus: "not_required" | "pending_confirmation" | "paid" | "rejected";
  paymentProof?: string;
  paymentReference?: string;
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
  paymentMethod: { type: String, default: "cash_on_delivery" },
  paymentStatus: { type: String, default: "not_required" },
  paymentProof: { type: String },
  paymentReference: { type: String },
  date: { type: String, default: () => new Date().toISOString() },
  address: { type: String, required: true },
  city: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
