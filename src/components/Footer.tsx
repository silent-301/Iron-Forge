import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-black tracking-tighter text-white">
                IRON
              </span>
              <span className="text-xl font-black tracking-tighter text-neon">
                FORGE
              </span>
            </div>
            <p className="text-sm text-zinc-500">
              Elite fitness apparel, supplements, and equipment for serious
              athletes. Forge your legacy.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Shop
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products?category=supplements"
                  className="text-sm text-zinc-500 hover:text-neon transition-colors"
                >
                  Supplements
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=apparel"
                  className="text-sm text-zinc-500 hover:text-neon transition-colors"
                >
                  Apparel
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=equipment"
                  className="text-sm text-zinc-500 hover:text-neon transition-colors"
                >
                  Equipment
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=recovery"
                  className="text-sm text-zinc-500 hover:text-neon transition-colors"
                >
                  Recovery
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-zinc-500 hover:text-neon transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-zinc-500 hover:text-neon transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-zinc-500 hover:text-neon transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Connect
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-zinc-500 hover:text-neon transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-zinc-500 hover:text-neon transition-colors"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-zinc-500 hover:text-neon transition-colors"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} IRON FORGE. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-zinc-600">
            <a href="#" className="hover:text-zinc-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-zinc-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
