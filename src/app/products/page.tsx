"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";

interface Product {
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
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsLoading() {
  return (
    <div className="min-h-screen bg-black">
      <div className="border-b border-zinc-800 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-10 bg-zinc-800 rounded w-1/3 animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-lg border border-zinc-800 animate-pulse">
              <div className="aspect-square bg-zinc-800 rounded-t-lg" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-zinc-800 rounded w-1/3" />
                <div className="h-4 bg-zinc-800 rounded w-2/3" />
                <div className="h-5 bg-zinc-800 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
  });

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "-createdAt";
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    params.set("sort", sort);
    params.set("page", page.toString());

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setPagination(data.pagination || { page: 1, total: 0, pages: 1 });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, search, sort, page]);

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (updates.category !== undefined || updates.search !== undefined || updates.sort !== undefined) {
      params.delete("page");
    }
    router.push(`/products?${params.toString()}`);
  };

  const categories = [
    { value: "", label: "All" },
    { value: "supplements", label: "Supplements" },
    { value: "fat-loss", label: "Fat Loss" },
    { value: "equipment", label: "Equipment" },
    { value: "apparel", label: "Apparel" },
    { value: "recovery", label: "Recovery" },
  ];

  const sortOptions = [
    { value: "-createdAt", label: "Newest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name", label: "Name: A-Z" },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="border-b border-zinc-800 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl sm:text-5xl font-black text-white">
            {category
              ? category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")
              : "ALL PRODUCTS"}
          </h1>
          <p className="text-zinc-500 mt-2">
            {pagination.total} products available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => updateParams({ category: c.value })}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  category === c.value
                    ? "bg-neon text-black"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="sm:ml-auto flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                defaultValue={search}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateParams({ search: (e.target as HTMLInputElement).value });
                  }
                }}
                className="w-full sm:w-48 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-neon"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-neon"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-zinc-900 rounded-lg border border-zinc-800 animate-pulse"
              >
                <div className="aspect-square bg-zinc-800 rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-zinc-800 rounded w-1/3" />
                  <div className="h-4 bg-zinc-800 rounded w-2/3" />
                  <div className="h-5 bg-zinc-800 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg mb-4">No products found</p>
            <button
              onClick={() => router.push("/products")}
              className="text-neon hover:text-orange-400 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => updateParams({ page: p.toString() })}
                      className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
                        page === p
                          ? "bg-neon text-black"
                          : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
