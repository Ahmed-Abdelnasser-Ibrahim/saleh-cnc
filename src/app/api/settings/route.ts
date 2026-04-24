import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import { settingsSchema } from "@/lib/validations";
import { sanitizeObject } from "@/lib/security";

const isAdmin = (request: Request) => {
  return request.headers.get("x-admin-auth") === "true";
};

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json(db.settings || {});
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const sanitizedBody = sanitizeObject(body);
    const validation = settingsSchema.safeParse(sanitizedBody);

    if (!validation.success) {
      return NextResponse.json({ 
        error: "Validation Failed", 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const settings = validation.data;
    const db = getDb();
    db.settings = { ...db.settings, ...settings };
    saveDb(db);
    return NextResponse.json(db.settings);
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
