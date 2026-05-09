"use client";

import { useAuth } from "@/lib/store/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => setOrders(data.orders || []))
        .catch(console.error)
        .finally(() => setOrdersLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-neon" />
      </div>
    );
  }

  if (!user) return null;

  const statusColors: Record<string, string> = {
    pending: "text-yellow-500 bg-yellow-500/10",
    confirmed: "text-blue-500 bg-blue-500/10",
    processing: "text-orange-500 bg-orange-500/10",
    shipped: "text-purple-500 bg-purple-500/10",
    delivered: "text-green-500 bg-green-500/10",
    cancelled: "text-red-500 bg-red-500/10",
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="border-b border-zinc-800 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-black text-white">My Account</h1>
          <p className="text-zinc-500 mt-2">
            Welcome back, {user.name}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
              <div className="w-16 h-16 bg-neon/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-neon">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">{user.name}</h2>
              <p className="text-sm text-zinc-500">{user.email}</p>
              <span className="inline-block mt-3 text-xs bg-neon/10 text-neon px-3 py-1 rounded-full capitalize">
                {user.role}
              </span>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-white mb-6">
              Order History
            </h2>

            {ordersLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 animate-pulse"
                  >
                    <div className="h-4 bg-zinc-800 rounded w-1/3 mb-3" />
                    <div className="h-3 bg-zinc-800 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-12 text-center">
                <p className="text-zinc-500 mb-4">No orders yet</p>
                <Link
                  href="/products"
                  className="text-neon hover:text-orange-400 transition-colors font-medium"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-zinc-900 rounded-lg border border-zinc-800 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">
                          ${order.total.toFixed(2)}
                        </p>
                        <span
                          className={`inline-block text-xs px-3 py-1 rounded-full mt-1 capitalize ${
                            statusColors[order.status] || "text-zinc-500 bg-zinc-500/10"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-zinc-400">
                            {item.name} x{item.quantity}
                          </span>
                          <span className="text-zinc-300">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={`/profile?order=${order._id}`}
                      className="inline-block mt-4 text-xs text-neon hover:text-orange-400 transition-colors"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
