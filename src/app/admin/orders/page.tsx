"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Order {
  _id: string;
  orderNumber: string;
  userId: { name: string; email: string } | null;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ admin: "true", limit: "100" });
    if (statusFilter) params.set("status", statusFilter);

    fetch(`/api/orders?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const statusColors: Record<string, string> = {
    pending: "text-yellow-500 bg-yellow-500/10",
    confirmed: "text-blue-500 bg-blue-500/10",
    processing: "text-orange-500 bg-orange-500/10",
    shipped: "text-purple-500 bg-purple-500/10",
    delivered: "text-green-500 bg-green-500/10",
    cancelled: "text-red-500 bg-red-500/10",
  };

  const paymentColors: Record<string, string> = {
    pending: "text-yellow-500",
    paid: "text-green-500",
    failed: "text-red-500",
    refunded: "text-purple-500",
  };

  const statuses = [
    "",
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Orders</h2>

      <div className="flex gap-2 flex-wrap mb-6">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              statusFilter === s
                ? "bg-neon text-black"
                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800"
            }`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
              <div className="h-4 bg-zinc-800 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-12 text-center">
          <p className="text-zinc-500">No orders found</p>
        </div>
      ) : (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-6 py-4 text-zinc-500 font-medium">Order</th>
                <th className="text-left px-6 py-4 text-zinc-500 font-medium">Customer</th>
                <th className="text-left px-6 py-4 text-zinc-500 font-medium">Total</th>
                <th className="text-left px-6 py-4 text-zinc-500 font-medium">Status</th>
                <th className="text-left px-6 py-4 text-zinc-500 font-medium">Payment</th>
                <th className="text-left px-6 py-4 text-zinc-500 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="text-neon hover:text-orange-400 transition-colors font-medium"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-zinc-300">
                    {order.userId?.name || "N/A"}
                    <br />
                    <span className="text-xs text-zinc-600">
                      {order.userId?.email || ""}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    ${order.total?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block text-xs px-3 py-1 rounded-full capitalize ${
                        statusColors[order.status] || "text-zinc-500 bg-zinc-500/10"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs capitalize ${
                        paymentColors[order.paymentStatus] || "text-zinc-500"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString()}
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
