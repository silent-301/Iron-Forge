"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  isActive: boolean;
  featured: boolean;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/products?admin=true&limit=100")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
            <div className="h-4 bg-zinc-800 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Products</h2>
        <Link
          href="/admin/products/new"
          className="bg-neon text-black px-4 py-2 rounded text-sm font-bold hover:bg-orange-500 transition-colors"
        >
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-12 text-center">
          <p className="text-zinc-500 mb-4">No products yet</p>
          <Link
            href="/admin/products/new"
            className="text-neon hover:text-orange-400 transition-colors"
          >
            Create your first product
          </Link>
        </div>
      ) : (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-6 py-4 text-zinc-500 font-medium">Name</th>
                <th className="text-left px-6 py-4 text-zinc-500 font-medium">Category</th>
                <th className="text-left px-6 py-4 text-zinc-500 font-medium">Price</th>
                <th className="text-left px-6 py-4 text-zinc-500 font-medium">Stock</th>
                <th className="text-left px-6 py-4 text-zinc-500 font-medium">Status</th>
                <th className="text-left px-6 py-4 text-zinc-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/products/${product._id}`}
                      className="text-white hover:text-neon transition-colors font-medium"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 capitalize">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-white">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        product.stock <= 5
                          ? "text-orange-500"
                          : product.stock <= 0
                          ? "text-red-500"
                          : "text-green-500"
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(product._id, product.isActive)}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        product.isActive
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="text-xs text-red-500 hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
