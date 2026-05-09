"use client";

import { useCart } from "@/lib/store/cart";
import Link from "next/link";
import Image from "next/image";

export default function CartDrawer() {
  const { state, toggleCart, removeItem, updateQuantity, subtotal, totalItems } =
    useCart();

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={toggleCart}
      />
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-zinc-900 shadow-2xl border-l border-zinc-800">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <div>
              <h2 className="text-lg font-bold text-white">Cart</h2>
              <p className="text-sm text-zinc-500">{totalItems} items</p>
            </div>
            <button
              onClick={toggleCart}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-500 mb-4">Your cart is empty</p>
                <Link
                  href="/products"
                  onClick={toggleCart}
                  className="inline-block bg-neon text-black px-6 py-3 rounded font-bold hover:bg-orange-500 transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            ) : (
              state.items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-4 bg-zinc-800/50 rounded-lg p-3"
                >
                  <div className="relative w-20 h-20 bg-zinc-800 rounded-md overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">
                      {item.name}
                    </h3>
                    {item.size && (
                      <p className="text-xs text-zinc-500">Size: {item.size}</p>
                    )}
                    <p className="text-sm text-neon font-bold mt-1">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1, item.size)
                        }
                        className="w-7 h-7 flex items-center justify-center rounded bg-zinc-700 text-zinc-300 hover:bg-zinc-600 text-sm"
                      >
                        -
                      </button>
                      <span className="text-sm text-white w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1, item.size)
                        }
                        className="w-7 h-7 flex items-center justify-center rounded bg-zinc-700 text-zinc-300 hover:bg-zinc-600 text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.productId, item.size)}
                        className="ml-auto text-zinc-500 hover:text-red-400 transition-colors"
                      >
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
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {state.items.length > 0 && (
            <div className="border-t border-zinc-800 p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-white font-medium">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Shipping & taxes calculated at checkout
              </p>
              <Link
                href="/checkout"
                onClick={toggleCart}
                className="block w-full bg-neon text-black text-center py-3 rounded font-bold hover:bg-orange-500 transition-colors"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={toggleCart}
                className="block w-full border border-zinc-700 text-zinc-300 text-center py-3 rounded font-medium hover:bg-zinc-800 transition-colors"
              >
                View Cart
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
