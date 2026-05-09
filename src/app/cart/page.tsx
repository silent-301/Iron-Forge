"use client";

import Link from "next/link";
import { useCart } from "@/lib/store/cart";
import Image from "next/image";

export default function CartPage() {
  const { state, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 mx-auto text-zinc-700 mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h1>
          <p className="text-zinc-500 mb-8">
            Looks like you haven&apos;t added any gear yet.
          </p>
          <Link
            href="/products"
            className="inline-block bg-neon text-black px-8 py-3 rounded font-bold hover:bg-orange-500 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="border-b border-zinc-800 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-black text-white">Shopping Cart</h1>
          <p className="text-zinc-500 mt-2">{totalItems} items</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex gap-4 bg-zinc-900 rounded-lg border border-zinc-800 p-4"
              >
                <div className="relative w-24 h-24 bg-zinc-800 rounded-md overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-zinc-700"
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
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.productId}`}
                    className="text-sm font-semibold text-white hover:text-neon transition-colors"
                  >
                    {item.name}
                  </Link>
                  {item.size && (
                    <p className="text-xs text-zinc-500 mt-1">
                      Size: {item.size}
                    </p>
                  )}
                  <p className="text-sm text-neon font-bold mt-1">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-zinc-800 rounded">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1, item.size)
                        }
                        className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1, item.size)
                        }
                        className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-white mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Shipping</span>
                  <span className="text-white">
                    {shipping === 0 ? (
                      <span className="text-green-500">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Tax (8%)</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-zinc-800 pt-3 flex justify-between text-base font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-white">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-neon text-black text-center py-3 rounded font-bold hover:bg-orange-500 transition-colors mt-6"
              >
                Proceed to Checkout
              </Link>

              {subtotal < 100 && subtotal > 0 && (
                <p className="text-xs text-zinc-500 text-center mt-3">
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
