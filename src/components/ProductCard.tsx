"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/store/cart";
import { useAuth } from "@/lib/store/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: string[];
    category: string;
    stock: number;
    rating: number;
    bestSeller: boolean;
    limitedEdition: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount =
    product.comparePrice
      ? Math.round(
          ((product.comparePrice - product.price) / product.comparePrice) * 100
        )
      : 0;

  return (
    <Link
      href={`/products/${product._id}`}
      className="group block bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 card-hover"
    >
      <div className="relative aspect-square bg-zinc-800 overflow-hidden">
        {product.images[0] && !imgError ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-zinc-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p className="text-xs text-zinc-600 mt-2">No Image</p>
            </div>
          </div>
        )}

        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-neon text-black text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
        {product.limitedEdition && (
          <span className="absolute top-2 right-2 bg-white text-black text-xs font-bold px-2 py-1 rounded">
            LIMITED
          </span>
        )}
        {product.bestSeller && (
          <span className="absolute bottom-2 left-2 bg-zinc-900/80 text-zinc-200 text-xs px-2 py-1 rounded">
            Best Seller
          </span>
        )}

        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-sm uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`absolute bottom-2 right-2 px-3 py-2 rounded text-xs font-bold transition-all duration-200 ${
            added
              ? "bg-green-500 text-white"
              : "bg-neon text-black opacity-0 group-hover:opacity-100 hover:bg-orange-500"
          }`}
        >
          {added ? "Added!" : product.stock <= 0 ? "Sold Out" : "Quick Add"}
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold text-white group-hover:text-neon transition-colors truncate">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-white">
            ${product.price.toFixed(2)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-zinc-500 line-through">
              ${product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
