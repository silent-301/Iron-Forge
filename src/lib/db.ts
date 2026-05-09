import { getCollection } from "./local-db";
import type { IUser } from "./models/User";
import type { IProduct } from "./models/Product";
import type { IOrder } from "./models/Order";
import { seedDatabase } from "./models/seed";

let initialized = false;

export async function connectDB() {
  if (initialized) return;
  initialized = true;
  await seedDatabase();
}

export const User = getCollection<IUser>("users");
export const Product = getCollection<IProduct>("products");
export const Order = getCollection<IOrder>("orders");
