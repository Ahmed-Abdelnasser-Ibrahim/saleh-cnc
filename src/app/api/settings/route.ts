import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import { Settings } from "@/lib/data";

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json(db.settings || {});
  } catch (error) {
    console.error("API Error (GET /settings):", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const settings: Settings = await request.json();
    
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: "Invalid settings data" }, { status: 400 });
    }

    const db = getDb();
    db.settings = { ...db.settings, ...settings };
    saveDb(db);
    return NextResponse.json(db.settings);
  } catch (error) {
    console.error("API Error (PUT /settings):", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
