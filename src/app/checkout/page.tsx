"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store/cart";
import { useAuth } from "@/lib/store/auth";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { state, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Pakistan",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Sign in to Checkout</h1>
          <p className="text-zinc-500 mb-8">
            Please sign in or create an account to continue.
          </p>
          <Link
            href="/login"
            className="bg-neon text-black px-8 py-3 rounded font-bold hover:bg-orange-500 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (state.items.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Your Cart is Empty</h1>
          <Link
            href="/products"
            className="bg-neon text-black px-8 py-3 rounded font-bold hover:bg-orange-500 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: state.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
          })),
          shippingAddress: form,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      clearCart();
      setSuccess(true);

      setTimeout(() => {
        router.push(`/profile?order=${data.order._id}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Order Confirmed!
          </h1>
          <p className="text-zinc-500">
            Your order has been placed successfully. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="border-b border-zinc-800 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-black text-white">Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-8"
          >
            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
              <h2 className="text-lg font-bold text-white mb-6">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm text-zinc-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-neon"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-zinc-400 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-neon"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-neon"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-neon"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    required
                    value={form.zipCode}
                    onChange={(e) => updateField("zipCode", e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-neon"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Country
                  </label>
                  <select
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-neon"
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-zinc-400 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-neon"
                  />
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
              <h2 className="text-lg font-bold text-white mb-6">
                Payment Method
              </h2>
              <div className="space-y-3">
                {["credit-card", "paypal"].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center gap-3 p-4 rounded border cursor-pointer transition-colors ${
                      paymentMethod === method
                        ? "border-neon bg-neon/5"
                        : "border-zinc-800 bg-black hover:border-zinc-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-neon focus:ring-neon"
                    />
                    <span className="text-sm text-white capitalize">
                      {method.replace("-", " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-neon text-black font-bold text-sm uppercase tracking-wider rounded hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : `Place Order — ${formatPrice(total, form.country)}`}
            </button>
          </form>

          <div className="lg:col-span-1">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-white mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                {state.items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex justify-between"
                  >
                    <span className="text-zinc-400 truncate max-w-[200px]">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="text-white">
                      {formatPrice(item.price * item.quantity, form.country)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 mt-4 pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal, form.country)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Shipping</span>
                  <span className="text-white">
                    {shipping === 0 ? "FREE" : formatPrice(shipping, form.country)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Tax</span>
                  <span className="text-white">{formatPrice(tax, form.country)}</span>
                </div>
                <div className="border-t border-zinc-800 pt-3 flex justify-between text-base font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-white">{formatPrice(total, form.country)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
