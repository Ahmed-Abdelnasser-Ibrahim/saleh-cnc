import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/mongoose";
import SettingsModel from "@/lib/mongodb/models/Settings";
import { settingsSchema } from "@/lib/validations";
import { sanitizeObject } from "@/lib/security";

const isAdmin = (request: Request) => {
  return request.headers.get("x-admin-auth") === "true";
};

export async function GET() {
  try {
    await connectDB();
    let settings = await SettingsModel.findOne({});
    if (!settings) {
      settings = await SettingsModel.create({});
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("API Error (GET /settings):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const sanitizedBody = sanitizeObject(body);
    const validation = settingsSchema.safeParse(sanitizedBody);

    if (!validation.success) {
      return NextResponse.json({ 
        error: "Validation Failed", 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const settingsData = validation.data;
    const settings = await SettingsModel.findOneAndUpdate({}, settingsData, { new: true, upsert: true });
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error("API Error (PUT /settings):", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
