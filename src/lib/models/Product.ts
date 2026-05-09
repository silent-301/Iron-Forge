import { Document } from "../local-db";

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
  createdAt: string;
  updatedAt: string;
}
