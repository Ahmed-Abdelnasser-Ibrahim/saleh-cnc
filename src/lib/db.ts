import fs from "fs";
import path from "path";
import { DbData, products } from "./data";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

// Initial structure
const INITIAL_DATA: DbData = {
  products: products,
  orders: [],
  settings: {
    siteName: "صالح CNC",
    whatsapp: "01068256479",
    email: "info@saleh-cnc.com",
    facebook: "#",
    instagram: "#",
    address: "القاهرة، مصر"
  }
};

export function getDb(): DbData {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
    }
    const data = fs.readFileSync(DB_PATH, "utf-8");
    const db = JSON.parse(data) as DbData;
    
    // Auto-populate if empty
    if (!db.products || db.products.length === 0) {
      db.products = products;
      saveDb(db);
    }
    
    return db;
  } catch (err) {
    console.error("Database read error:", err);
    return INITIAL_DATA;
  }
}

export function saveDb(data: DbData): void {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Database save error:", err);
  }
}
