import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="hero-gradient relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,107,0,0.15),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,107,0,0.08),_transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-3xl">
            <p className="text-neon font-semibold text-sm tracking-[0.2em] uppercase mb-6">
              Elite Performance Brand
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9] mb-6">
              FORGE YOUR
              <br />
              <span className="text-gradient">LEGACY</span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mb-10 leading-relaxed">
              Premium activewear, elite supplements, and pro-grade equipment.
              Built for the relentless. Join the movement of serious athletes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-neon text-black font-bold text-sm uppercase tracking-wider rounded hover:bg-orange-500 transition-all duration-300 neon-glow"
              >
                Shop Now
              </Link>
              <Link
                href="/products?category=supplements"
                className="inline-flex items-center justify-center px-8 py-4 border border-zinc-700 text-zinc-300 font-medium text-sm uppercase tracking-wider rounded hover:bg-zinc-800 transition-all duration-300"
              >
                View Supplements
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CategoriesSection />
      <FeaturedProducts />
      <BestSellersSection />
      <BrandValueSection />
      <NewsletterSection />
    </div>
  );
}

async function CategoriesSection() {
  const categories = [
    {
      name: "Supplements",
      slug: "supplements",
      desc: "Premium nutrition for peak performance",
      gradient: "from-orange-900/40 to-black",
    },
    {
      name: "Apparel",
      slug: "apparel",
      desc: "Engineered training gear",
      gradient: "from-zinc-800/40 to-black",
    },
    {
      name: "Equipment",
      slug: "equipment",
      desc: "Pro-grade training tools",
      gradient: "from-neutral-800/40 to-black",
    },
    {
      name: "Recovery",
      slug: "recovery",
      desc: "Optimize your recovery",
      gradient: "from-amber-900/30 to-black",
    },
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-neon text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Categories
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            EXPLORE BY{" "}
            <span className="text-gradient">CATEGORY</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className={`group relative h-64 rounded-lg overflow-hidden bg-gradient-to-br ${cat.gradient} border border-zinc-800 card-hover`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative z-10 p-6 flex flex-col justify-end h-full">
                <h3 className="text-xl font-bold text-white group-hover:text-neon transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-zinc-400 mt-1">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

async function FeaturedProducts() {
  let products = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/products?featured=true&limit=4`,
      { cache: "no-store" }
    );
    const data = await res.json();
    products = data.products || [];
  } catch {
    products = [];
  }

  return (
    <section className="py-20 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-neon text-sm font-semibold tracking-[0.2em] uppercase mb-3">
              Featured
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              FEATURED{" "}
              <span className="text-gradient">COLLECTION</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex text-sm text-zinc-400 hover:text-neon transition-colors"
          >
            View All &rarr;
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCardItem key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 text-center"
              >
                <div className="aspect-square bg-zinc-800 rounded mb-4 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-zinc-700"
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
                <p className="text-zinc-600 text-sm">
                  Add products in admin panel
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/products"
            className="text-sm text-zinc-400 hover:text-neon transition-colors"
          >
            View All &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

async function BestSellersSection() {
  let products = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/products?bestSeller=true&limit=4`,
      { cache: "no-store" }
    );
    const data = await res.json();
    products = data.products || [];
  } catch {
    products = [];
  }

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-neon text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Best Sellers
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            MOST WANTED{" "}
            <span className="text-gradient">GEAR</span>
          </h2>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCardItem key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-500">
              No best sellers yet. Add products in the admin panel.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCardItem({ product }: { product: any }) {
  return (
    <Link
      href={`/products/${product._id}`}
      className="group block bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 card-hover"
    >
      <div className="aspect-square bg-zinc-800 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-zinc-700"
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
      <div className="p-4">
        <p className="text-xs text-zinc-500 uppercase">{product.category}</p>
        <h3 className="text-sm font-semibold text-white group-hover:text-neon transition-colors mt-1">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-white mt-2">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}

function BrandValueSection() {
  return (
    <section className="py-20 bg-dark border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 border border-zinc-800 rounded-lg bg-zinc-900/50">
            <div className="w-16 h-16 bg-neon/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-neon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Premium Quality
            </h3>
            <p className="text-sm text-zinc-500">
              Every product tested and approved by elite athletes. No
              compromises.
            </p>
          </div>
          <div className="text-center p-8 border border-zinc-800 rounded-lg bg-zinc-900/50">
            <div className="w-16 h-16 bg-neon/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-neon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Fast Shipping
            </h3>
            <p className="text-sm text-zinc-500">
              Free shipping on orders over $100. Tracked delivery worldwide.
            </p>
          </div>
          <div className="text-center p-8 border border-zinc-800 rounded-lg bg-zinc-900/50">
            <div className="w-16 h-16 bg-neon/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-neon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Community Driven
            </h3>
            <p className="text-sm text-zinc-500">
              Join thousands of athletes transforming their bodies and lives.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="py-20 bg-black border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-neon text-sm font-semibold tracking-[0.2em] uppercase mb-3">
          Stay Connected
        </p>
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
          JOIN THE{" "}
          <span className="text-gradient">MOVEMENT</span>
        </h2>
        <p className="text-zinc-400 max-w-lg mx-auto mb-8">
          Get exclusive access to limited drops, training programs, and member-only
          pricing.
        </p>
        <form className="max-w-md mx-auto flex gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-neon transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-neon text-black font-bold rounded hover:bg-orange-500 transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
