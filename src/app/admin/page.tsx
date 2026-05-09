"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStock: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products?admin=true&limit=1").then((r) => r.json()),
      fetch("/api/orders?admin=true&limit=5").then((r) => r.json()),
    ])
      .then(([productsData, ordersData]) => {
        setStats({
          totalProducts: productsData.pagination?.total || 0,
          totalOrders: ordersData.pagination?.total || 0,
          totalRevenue: ordersData.orders?.reduce(
            (sum: number, o: any) => sum + (o.status !== "cancelled" ? o.total : 0),
            0
          ) || 0,
          lowStock: 0,
        });
        setRecentOrders(ordersData.orders || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
            <div className="h-4 bg-zinc-800 rounded w-1/2 mb-3" />
            <div className="h-8 bg-zinc-800 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      href: "/admin/products",
      color: "text-blue-500",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      href: "/admin/orders",
      color: "text-purple-500",
    },
    {
      label: "Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      href: "/admin/orders",
      color: "text-green-500",
    },
    {
      label: "Low Stock Items",
      value: stats.lowStock,
      href: "/admin/products",
      color: "text-orange-500",
    },
  ];

  const statusColors: Record<string, string> = {
    pending: "text-yellow-500",
    confirmed: "text-blue-500",
    processing: "text-orange-500",
    shipped: "text-purple-500",
    delivered: "text-green-500",
    cancelled: "text-red-500",
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 card-hover"
            >
              <p className="text-sm text-zinc-500 mb-2">{card.label}</p>
              <p className={`text-3xl font-black ${card.color}`}>
                {card.value}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-neon hover:text-orange-400 transition-colors"
          >
            View All &rarr;
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-12 text-center">
            <p className="text-zinc-500">No orders yet</p>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium">
                    Order
                  </th>
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium">
                    Customer
                  </th>
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium">
                    Total
                  </th>
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr
                    key={order._id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="text-neon hover:text-orange-400 transition-colors"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      {order.userId?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      ${order.total?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs capitalize ${
                          statusColors[order.status] || "text-zinc-500"
                        }`}
                      >
                        {order.status}
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
    </div>
  );
}
