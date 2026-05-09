import mongoose from "mongoose";
import { UserSchema } from "./models/User";
import { ProductSchema } from "./models/Product";
import { OrderSchema } from "./models/Order";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
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

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
