"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = [
  { value: "supplements", label: "Supplements" },
  { value: "fat-loss", label: "Fat Loss" },
  { value: "equipment", label: "Equipment" },
  { value: "apparel", label: "Apparel" },
  { value: "recovery", label: "Recovery" },
];

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    category: "supplements",
    stock: "0",
    sizes: "",
    colors: "",
    tags: "",
    featured: false,
    bestSeller: false,
    limitedEdition: false,
    isActive: true,
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        const p = data.product;
        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price?.toString() || "",
          comparePrice: p.comparePrice?.toString() || "",
          category: p.category || "supplements",
          stock: p.stock?.toString() || "0",
          sizes: p.sizes?.join(", ") || "",
          colors: p.colors?.join(", ") || "",
          tags: p.tags?.join(", ") || "",
          featured: p.featured || false,
          bestSeller: p.bestSeller || false,
          limitedEdition: p.limitedEdition || false,
          isActive: p.isActive ?? true,
        });
        setImages(p.images || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) setImages((prev) => [...prev, data.url]);
      else setError(data.error || "Upload failed");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const body = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
        category: form.category,
        stock: parseInt(form.stock),
        images,
        sizes: form.sizes ? form.sizes.split(",").map((s: string) => s.trim()) : undefined,
        colors: form.colors ? form.colors.split(",").map((c: string) => c.trim()) : undefined,
        tags: form.tags ? form.tags.split(",").map((t: string) => t.trim()) : undefined,
        featured: form.featured,
        bestSeller: form.bestSeller,
        limitedEdition: form.limitedEdition,
        isActive: form.isActive,
      };

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product");

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-zinc-800 rounded w-1/3" />
        <div className="h-96 bg-zinc-800 rounded" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="text-sm text-zinc-500 hover:text-white transition-colors"
        >
          &larr; Back
        </Link>
        <h2 className="text-2xl font-bold text-white">Edit Product</h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Basic Info
          </h3>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-neon"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-neon"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Price</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-neon"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Compare Price</label>
              <input
                type="number"
                step="0.01"
                value={form.comparePrice}
                onChange={(e) => updateField("comparePrice", e.target.value)}
                className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-neon"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Category</label>
              <select
                required
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-neon"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Stock</label>
              <input
                type="number"
                required
                min="0"
                value={form.stock}
                onChange={(e) => updateField("stock", e.target.value)}
                className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-neon"
              />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Media
          </h3>
          <div>
            <div className="flex gap-3 flex-wrap mb-3">
              {images.map((url, i) => (
                <div key={i} className="relative w-20 h-20 bg-zinc-800 rounded overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded text-sm cursor-pointer hover:bg-zinc-700 transition-colors">
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
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              {uploading ? "Uploading..." : "Upload Image"}
              <input type="file" accept="image/*" onChange={uploadImage} className="hidden" />
            </label>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Variants & Tags
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Sizes (comma separated)</label>
              <input
                type="text"
                value={form.sizes}
                onChange={(e) => updateField("sizes", e.target.value)}
                placeholder="S, M, L, XL"
                className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-neon"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Colors (comma separated)</label>
              <input
                type="text"
                value={form.colors}
                onChange={(e) => updateField("colors", e.target.value)}
                placeholder="Black, Orange, Gray"
                className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-neon"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              placeholder="premium, new-arrival"
              className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-neon"
            />
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Status & Flags
          </h3>
          <div className="flex gap-6 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => updateField("isActive", e.target.checked)}
                className="text-neon focus:ring-neon bg-black border-zinc-700"
              />
              <span className="text-sm text-zinc-300">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField("featured", e.target.checked)}
                className="text-neon focus:ring-neon bg-black border-zinc-700"
              />
              <span className="text-sm text-zinc-300">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.bestSeller}
                onChange={(e) => updateField("bestSeller", e.target.checked)}
                className="text-neon focus:ring-neon bg-black border-zinc-700"
              />
              <span className="text-sm text-zinc-300">Best Seller</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.limitedEdition}
                onChange={(e) => updateField("limitedEdition", e.target.checked)}
                className="text-neon focus:ring-neon bg-black border-zinc-700"
              />
              <span className="text-sm text-zinc-300">Limited Edition</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-neon text-black font-bold rounded hover:bg-orange-500 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
