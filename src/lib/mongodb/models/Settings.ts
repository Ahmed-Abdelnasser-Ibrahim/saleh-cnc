import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  siteName: string;
  whatsapp: string;
  email: string;
  facebook: string;
  instagram: string;
  address: string;
  shippingRates: Record<string, number>;
}

const SettingsSchema: Schema = new Schema({
  siteName: { type: String, default: "صالح CNC" },
  whatsapp: { type: String, default: "01068256479" },
  email: { type: String, default: "info@saleh-cnc.com" },
  facebook: { type: String, default: "#" },
  instagram: { type: String, default: "#" },
  address: { type: String, default: "القاهرة، مصر" },
  shippingRates: {
    type: Map,
    of: Number,
    default: {
      "القاهرة": 50,
      "الجيزة": 50,
      "الإسكندرية": 60,
      "القليوبية": 50,
      "المنوفية": 60,
      "الغربية": 60,
      "الدقهلية": 60,
      "الشرقية": 60,
      "البحيرة": 65,
      "بورسعيد": 70,
      "السويس": 70,
      "الإسماعيلية": 70,
      "الفيوم": 70,
      "بني سويف": 75,
      "المنيا": 80,
      "أسيوط": 85,
      "سوهاج": 90,
      "قنا": 95,
      "الأقصر": 100,
      "أسوان": 110,
      "مطروح": 120,
      "البحر الأحمر": 120,
      "الوادي الجديد": 130,
      "شمال سيناء": 130,
      "جنوب سيناء": 130,
    }
  }
});

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
