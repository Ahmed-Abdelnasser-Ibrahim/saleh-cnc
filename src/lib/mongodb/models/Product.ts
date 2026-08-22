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

const mongooseProductModel = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

const handler = {
  get(target: any, prop: string) {
    if ((global as any).isMockDb) {
      const mock = (global as any).mockModels?.products;
      if (mock && prop in mock) {
        return (mock as any)[prop];
      }
    }
    return target[prop];
  }
};

const proxy = new Proxy(mongooseProductModel, handler);
export default proxy;

