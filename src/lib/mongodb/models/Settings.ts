import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  siteName: string;
  whatsapp: string;
  email: string;
  facebook: string;
  instagram: string;
  address: string;
}

const SettingsSchema: Schema = new Schema({
  siteName: { type: String, default: "صالح CNC" },
  whatsapp: { type: String, default: "01068256479" },
  email: { type: String, default: "info@saleh-cnc.com" },
  facebook: { type: String, default: "#" },
  instagram: { type: String, default: "#" },
  address: { type: String, default: "القاهرة، مصر" },
});

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
