"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/lib/store/cart";
import { useAuth } from "@/lib/store/auth";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  sizes?: string[];
  colors?: string[];
  stock: number;
  rating: number;
  numReviews: number;
  tags: string[];
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        if (data.product?.sizes?.length) setSelectedSize(data.product.sizes[0]);
        if (data.product?.colors?.length) setSelectedColor(data.product.colors[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-zinc-800 rounded-lg" />
          <div className="space-y-4">
            <div className="h-4 bg-zinc-800 rounded w-1/4" />
            <div className="h-8 bg-zinc-800 rounded w-3/4" />
            <div className="h-6 bg-zinc-800 rounded w-1/4" />
            <div className="h-24 bg-zinc-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
        <button
          onClick={() => router.push("/products")}
          className="text-neon hover:text-orange-400"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : 0;

  const handleAddToCart = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-zinc-500 hover:text-white transition-colors mb-8 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="relative aspect-square bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 mb-4">
              {product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-24 w-24 text-zinc-700"
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
                </div>
              )}
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-neon text-black text-sm font-bold px-3 py-1 rounded">
                  -{discount}% OFF
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === selectedImage
                        ? "border-neon"
                        : "border-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-neon font-semibold uppercase tracking-wider">
                {product.category}
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white mt-2">
                {product.name}
              </h1>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-zinc-500 line-through">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-zinc-400 leading-relaxed">
              {product.description}
            </p>

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="text-sm text-zinc-500 mb-3 uppercase tracking-wider">
                  Size
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${
                        selectedSize === size
                          ? "bg-neon text-black border-neon"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-sm text-zinc-500 mb-3 uppercase tracking-wider">
                  Color
                </p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${
                        selectedColor === color
                          ? "bg-neon text-black border-neon"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <p className="text-sm text-zinc-500 uppercase tracking-wider">
                Qty
              </p>
              <div className="flex items-center border border-zinc-800 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-white font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-4 rounded font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                  added
                    ? "bg-green-500 text-white"
                    : product.stock <= 0
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-neon text-black hover:bg-orange-500 neon-glow"
                }`}
              >
                {added ? "Added to Cart!" : product.stock <= 0 ? "Sold Out" : "Add to Cart"}
              </button>
            </div>

            <div className="border-t border-zinc-800 pt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
                Free shipping on orders over $100
              </div>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-zinc-900 text-zinc-500 px-3 py-1 rounded-full border border-zinc-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
