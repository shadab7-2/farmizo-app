//farmizo-app\app\(mainwebsite)\page.jsx

"use client";

import Link from "next/link";
import Image from "@/components/common/SafeImage";
import ProductCard from "@/components/product/ProductCard";
import useProducts from "@/hooks/useProducts";
import useCategories from "@/hooks/useCategories";
import {
  Leaf,
  ShieldCheck,
  Truck,
  Wallet,
  Sprout,
  Wrench,
  Flower,
  Recycle,
  Star,
} from "lucide-react";

export default function HomePage() {
  const { products, loading, error } = useProducts({ limit: 6 });
  const {
    categories,
    loading: categoriesLoading,
  } = useCategories();

  return (
    <main className="bg-bg-page">
      {/* HERO */}
      <section className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-600 font-semibold">
              Grow Green • Live Better
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-text-heading">
              Premium plants, seeds & garden essentials delivered fresh.
            </h1>
            <p className="text-lg text-text-muted max-w-xl mx-auto md:mx-0">
              Discover curated collections from trusted nurseries, eco-friendly supplies, and guidance from garden experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/products"
                className="rounded-full bg-action-primary px-6 py-3 text-white text-sm font-semibold shadow-lg shadow-action-primary/30 hover:bg-action-primary-hover transition"
              >
                Shop Plants
              </Link>
              <Link
                href="/categories"
                className="rounded-full border border-border-default px-6 py-3 text-sm font-semibold text-text-heading hover:border-action-primary hover:text-action-primary transition"
              >
                Explore Categories
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-text-muted justify-center md:justify-start">
              <span className="rounded-full bg-white px-3 py-1 shadow-sm border border-border-default">
                500+ plants in stock
              </span>
              <span className="rounded-full bg-white px-3 py-1 shadow-sm border border-border-default">
                Safe delivery
              </span>
              <span className="rounded-full bg-white px-3 py-1 shadow-sm border border-border-default">
                Expert support
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-emerald-200 blur-3xl opacity-60" />
            <div className="absolute right-0 -bottom-8 h-32 w-32 rounded-full bg-green-100 blur-3xl opacity-60" />
            <Image
              src="https://images.pexels.com/photos/11741418/pexels-photo-11741418.jpeg"
              alt="Fresh plants and gardening supplies"
              width={620}
              height={520}
              priority
              className="relative rounded-3xl shadow-2xl object-cover w-full h-[520px]"
            />
          </div>
        </div>
      </section>

      {/* TRUST / BENEFITS */}
      <section className="border-y border-border-default bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Leaf, title: "Fresh from Nurseries", desc: "Handpicked healthy plants" },
            { icon: Truck, title: "Fast & Safe Delivery", desc: "Protective, eco packs" },
            { icon: Wallet, title: "Secure Payments", desc: "Cards, UPI & wallets" },
            { icon: Recycle, title: "Eco Friendly", desc: "Sustainable materials" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border-default bg-bg-section-soft px-4 py-5 shadow-sm"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <item.icon size={20} />
              </div>
              <p className="mt-3 font-semibold text-text-heading">{item.title}</p>
              <p className="text-sm text-text-muted mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-600 font-semibold">
            Shop by Category
          </p>
          <h2 className="mt-2 text-3xl lg:text-4xl font-bold text-text-heading">Find your perfect fit</h2>
          <p className="mt-3 text-text-muted max-w-2xl mx-auto">
            Plants, seeds, tools, fertilizers, and more — curated for homes, farms, and balconies.
          </p>
        </div>

        {categoriesLoading && (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-8">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-2xl border border-border-default bg-white p-4 shadow-sm space-y-4"
              >
                <div className="h-44 w-full rounded-xl bg-gray-200" />
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {!categoriesLoading && categories?.length > 0 && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-8">
            {categories.slice(0, 8).map((cat) => {
              const Icon =
                cat.slug?.includes("seed") ? Sprout :
                cat.slug?.includes("tool") ? Wrench :
                cat.slug?.includes("pot") ? Flower :
                Leaf;
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-border-default bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                <div className="relative h-56 overflow-hidden">
                    <Image
                      src={cat.image || "/placeholder.jpg"}
                      alt={cat.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow">
                      <Icon size={14} />
                      Category
                    </div>
                  </div>
                  <div className="p-5 space-y-1">
                    <h3 className="text-lg font-semibold text-text-heading">{cat.name}</h3>
                    <p className="text-sm text-text-muted">
                      {Number.isFinite(cat.productCount) ? `${cat.productCount} products` : "Explore curated picks"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!categoriesLoading && (!categories || categories.length === 0) && (
          <p className="mt-8 text-center text-text-muted">Categories will be available soon.</p>
        )}
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-bg-section-muted">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-600 font-semibold">
              Featured
            </p>
            <h2 className="mt-2 text-3xl lg:text-4xl font-bold text-text-heading">Editor’s picks</h2>
            <p className="mt-3 text-text-muted max-w-2xl mx-auto">
              Hand-selected greens and agri-essentials our customers love right now.
            </p>
          </div>

          {loading && <p className="text-center mt-10 text-text-muted">Loading products...</p>}
          {error && <p className="text-center mt-10 text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-8">
              {products.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-600 font-semibold">
            Why Farmizo
          </p>
          <h2 className="mt-2 text-3xl lg:text-4xl font-bold text-text-heading">Your garden, our passion</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Sprout, title: "500+ Live Plants", desc: "Wide variety for any space" },
            { icon: Recycle, title: "Eco-Friendly", desc: "Sustainable sourcing & packing" },
            { icon: Truck, title: "Fast Delivery", desc: "Carefully packed, doorstep ready" },
            { icon: ShieldCheck, title: "Garden Experts", desc: "Personalized plant advice" },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border-default bg-white p-5 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <item.icon size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text-heading">{item.title}</h3>
              <p className="mt-2 text-sm text-text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="bg-bg-section-soft">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-600 font-semibold">
                Best Sellers
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-text-heading">Customer favorites</h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-border-default px-5 py-2 text-sm font-semibold text-text-heading hover:border-action-primary hover:text-action-primary transition"
            >
              View all products →
            </Link>
          </div>

          {!loading && !error && (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-8">
              {(products || []).slice(0, 3).map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-600 font-semibold">
            Customer Love
          </p>
          <h2 className="mt-2 text-3xl lg:text-4xl font-bold text-text-heading">What gardeners say</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { quote: "Plants arrived fresh and thriving. Excellent packaging!", name: "Aarav M.", location: "Mumbai" },
            { quote: "Loved the curated tools set—solid quality and fast delivery.", name: "Priya S.", location: "Bengaluru" },
            { quote: "Customer support helped me pick the right indoor plants.", name: "Rohan D.", location: "Pune" },
          ].map((review) => (
            <div key={review.name} className="rounded-2xl border border-border-default bg-white p-6 shadow-sm">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="mt-3 text-text-heading font-semibold leading-relaxed">“{review.quote}”</p>
              <p className="mt-4 text-sm text-text-muted">
                {review.name} • {review.location}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-3xl bg-emerald-50 border border-emerald-100 p-10 text-center shadow-sm">
          <h3 className="text-2xl font-bold text-text-heading">Join the Farmizo Garden Club 🌿</h3>
          <p className="mt-2 text-text-muted">
            Get plant care tips, gardening inspiration, and exclusive offers.
          </p>
          <form className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full sm:w-2/3 rounded-full border border-border-default bg-white px-4 py-3 text-sm focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
            />
            <button
              type="submit"
              className="rounded-full bg-action-primary px-6 py-3 text-white text-sm font-semibold shadow hover:bg-action-primary-hover transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
