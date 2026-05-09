"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = [
  { value: "supplements", label: "Supplements" },
  { value: "fat-loss", label: "Fat Loss" },
  { value: "equipment", label: "Equipment" },
  { value: "apparel", label: "Apparel" },
  { value: "recovery", label: "Recovery" },
];

export default function NewProductPage() {
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
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.success) {
        setImages((prev) => [...prev, data.data.url]);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const body = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
        category: form.category,
        stock: parseInt(form.stock),
        images,
        sizes: form.sizes
          ? form.sizes.split(",").map((s) => s.trim())
          : undefined,
        colors: form.colors
          ? form.colors.split(",").map((c) => c.trim())
          : undefined,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim())
          : undefined,
        featured: form.featured,
        bestSeller: form.bestSeller,
        limitedEdition: form.limitedEdition,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create product");

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="text-sm text-zinc-500 hover:text-white transition-colors"
        >
          &larr; Back
        </Link>
        <h2 className="text-2xl font-bold text-white">New Product</h2>
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
            <label className="block text-sm text-zinc-400 mb-2">Name *</label>
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
              required
              className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-neon"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Price *</label>
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
              <label className="block text-sm text-zinc-400 mb-2">
                Compare Price
              </label>
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
              <label className="block text-sm text-zinc-400 mb-2">
                Category *
              </label>
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
              <label className="block text-sm text-zinc-400 mb-2">Stock *</label>
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
            <label className="block text-sm text-zinc-400 mb-2">Images</label>
            <div className="flex gap-3 flex-wrap mb-3">
              {images.map((url, i) => (
                <div key={i} className="relative w-20 h-20 bg-zinc-800 rounded overflow-hidden">
                  <img
                    src={url}
                    alt={`Image ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
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
              <input
                type="file"
                accept="image/*"
                onChange={uploadImage}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Variants & Tags
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Sizes (comma separated)
              </label>
              <input
                type="text"
                value={form.sizes}
                onChange={(e) => updateField("sizes", e.target.value)}
                placeholder="S, M, L, XL"
                className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-neon"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Colors (comma separated)
              </label>
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
            <label className="block text-sm text-zinc-400 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              placeholder="premium, new-arrival, limited"
              className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-neon"
            />
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Flags
          </h3>

          <div className="flex gap-6">
            {["featured", "bestSeller", "limitedEdition"].map((flag) => (
              <label
                key={flag}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={(form as any)[flag]}
                  onChange={(e) => updateField(flag, e.target.checked)}
                  className="text-neon focus:ring-neon bg-black border-zinc-700"
                />
                <span className="text-sm text-zinc-300 capitalize">
                  {flag.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-neon text-black font-bold rounded hover:bg-orange-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Product"}
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
