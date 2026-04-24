import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  category: string;
  image: string;
  badge?: string;
  description?: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  badge: { type: String },
  description: { type: String },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
