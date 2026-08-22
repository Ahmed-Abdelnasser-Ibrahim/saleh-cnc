import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/saleh-cnc";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

// Initialize mock models once
if (!(global as any).mockModels) {
  const { createMockModel } = require("./mockDb");
  (global as any).mockModels = {
    products: createMockModel("products"),
    orders: createMockModel("orders"),
    settings: createMockModel("settings"),
  };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000, // Fail fast in 2 seconds if MongoDB is not running
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("✅ Successfully connected to MongoDB.");
        (global as any).isMockDb = false;
        return mongooseInstance;
      })
      .catch((err) => {
        console.warn("⚠️ MongoDB connection failed. Falling back to local JSON database (data/db.json). Error:", err.message || err);
        (global as any).isMockDb = true;
        // Return mongoose object as dummy connection so calling connectDB doesn't fail
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

