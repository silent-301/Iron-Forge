import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: "supplements" | "fat-loss" | "equipment" | "apparel" | "recovery";
  subcategory?: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  limitedEdition: boolean;
  isActive: boolean;
  tags: string[];
  rating: number;
  numReviews: number;
}

export const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    comparePrice: { type: Number },
    category: {
      type: String,
      required: true,
      enum: ["supplements", "fat-loss", "equipment", "apparel", "recovery"],
    },
    subcategory: { type: String },
    images: { type: [String], default: [] },
    sizes: { type: [String] },
    colors: { type: [String] },
    stock: { type: Number, required: true, default: 0 },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    limitedEdition: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);
