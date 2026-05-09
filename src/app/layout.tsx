import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/store/auth";
import { CartProvider } from "@/lib/store/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "IRON FORGE | Elite Fitness Apparel & Supplements",
  description:
    "Premium fitness apparel, supplements, and equipment for serious athletes. Join the movement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-black text-zinc-100 font-sans">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
