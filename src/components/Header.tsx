"use client";

import Link from "next/link";
import { useAuth } from "@/lib/store/auth";
import { useCart } from "@/lib/store/cart";
import { useState } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const { toggleCart, totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-white">
              IRON
            </span>
            <span className="text-2xl font-black tracking-tighter text-neon">
              FORGE
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/products?category=supplements"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Supplements
            </Link>
            <Link
              href="/products?category=apparel"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Apparel
            </Link>
            <Link
              href="/products?category=equipment"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Equipment
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleCart}
              className="relative p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-neon text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-4">
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-sm text-neon hover:text-orange-400 transition-colors font-medium"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {user.name}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-zinc-500 hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-sm bg-neon text-black px-4 py-2 rounded font-bold hover:bg-orange-500 transition-colors"
                >
                  Join
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-zinc-800 py-4 space-y-3">
            <Link
              href="/products"
              className="block text-sm text-zinc-400 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              Shop All
            </Link>
            <Link
              href="/products?category=supplements"
              className="block text-sm text-zinc-400 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              Supplements
            </Link>
            <Link
              href="/products?category=apparel"
              className="block text-sm text-zinc-400 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              Apparel
            </Link>
            <Link
              href="/products?category=equipment"
              className="block text-sm text-zinc-400 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              Equipment
            </Link>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block text-sm text-zinc-400 hover:text-white py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Profile
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="block text-sm text-neon py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="block text-sm text-red-400 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-sm text-zinc-400 hover:text-white py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block text-sm text-neon py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Join the Movement
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
