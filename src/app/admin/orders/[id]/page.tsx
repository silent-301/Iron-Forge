"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  _id: string;
  orderNumber: string;
  userId: { _id: string; name: string; email: string };
  items: Array<{
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }>;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data.order);
        setStatus(data.order.status);
        setPaymentStatus(data.order.paymentStatus);
        setTrackingNumber(data.order.trackingNumber || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          paymentStatus,
          trackingNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update order");

      setOrder(data.order);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-zinc-800 rounded w-1/3" />
        <div className="h-64 bg-zinc-800 rounded" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-white mb-4">Order Not Found</h2>
        <Link href="/admin/orders" className="text-neon hover:text-orange-400">
          Back to Orders
        </Link>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: "text-yellow-500 bg-yellow-500/10",
    confirmed: "text-blue-500 bg-blue-500/10",
    processing: "text-orange-500 bg-orange-500/10",
    shipped: "text-purple-500 bg-purple-500/10",
    delivered: "text-green-500 bg-green-500/10",
    cancelled: "text-red-500 bg-red-500/10",
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/orders"
          className="text-sm text-zinc-500 hover:text-white transition-colors"
        >
          &larr; Back
        </Link>
        <h2 className="text-2xl font-bold text-white">
          Order {order.orderNumber}
        </h2>
        <span
          className={`text-xs px-3 py-1 rounded-full capitalize ${
            statusColors[order.status] || "text-zinc-500 bg-zinc-500/10"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Items</h3>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-16 h-16 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    {item.size && (
                      <p className="text-xs text-zinc-500">Size: {item.size}</p>
                    )}
                    <p className="text-sm text-zinc-400">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-800 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-white">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Shipping</span>
                <span className="text-white">
                  {order.shipping === 0 ? "FREE" : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Tax</span>
                <span className="text-white">${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-zinc-800 pt-2 flex justify-between font-bold">
                <span className="text-white">Total</span>
                <span className="text-white">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Shipping Address
            </h3>
            <div className="text-sm text-zinc-300 space-y-1">
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="text-zinc-500">{order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <form
            onSubmit={handleUpdate}
            className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-4"
          >
            <h3 className="text-lg font-bold text-white">Update Order</h3>

            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-neon"
              >
                {[
                  "pending",
                  "confirmed",
                  "processing",
                  "shipped",
                  "delivered",
                  "cancelled",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-neon"
              >
                {["pending", "paid", "failed", "refunded"].map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-neon"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-neon text-black font-bold rounded hover:bg-orange-500 transition-colors disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update Order"}
            </button>
          </form>

          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Customer</h3>
            <div className="text-sm text-zinc-300 space-y-1">
              <p className="font-medium text-white">{order.userId?.name}</p>
              <p className="text-zinc-500">{order.userId?.email}</p>
            </div>
            <p className="text-xs text-zinc-600 mt-4">
              Payment: {order.paymentMethod}
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              Placed: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
