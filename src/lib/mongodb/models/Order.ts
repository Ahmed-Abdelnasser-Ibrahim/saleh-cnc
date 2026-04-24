import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  customer: string;
  phone: string;
  items: any[];
  total: number;
  status: string;
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
  date: { type: String, default: () => new Date().toISOString() },
  address: { type: String, required: true },
  city: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
