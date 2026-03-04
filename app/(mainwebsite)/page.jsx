"use client";

import Link from "next/link";
import Image from "@/components/common/SafeImage";
import ProductCard from "@/components/product/ProductCard";
import useProducts from "@/hooks/useProducts";
import useCategories from "@/hooks/useCategories";
// import { fetchFromAPI } from "@/utils/apiResponce";

/* ---------------- CATEGORY DATA ---------------- */

const HOME_CATEGORIES = [
  {
    name: "Indoor Plants",
    slug: "plants",
    img: "https://images.pexels.com/photos/14832690/pexels-photo-14832690.jpeg",
  },
  {
    name: "Seeds",
    slug: "seeds",
    img: "https://images.pexels.com/photos/8013848/pexels-photo-8013848.jpeg",
  },
  {
    name: "Fertilizers",
    slug: "agriproducts",
    img: "https://images.pexels.com/photos/3777622/pexels-photo-3777622.jpeg",
  },
  {
    name: "Garden Tools",
    slug: "tools",
    img: "https://images.pexels.com/photos/6231990/pexels-photo-6231990.jpeg",
  },
  {
    name: "Pots & Planters",
    slug: "pots",
    img: "https://images.pexels.com/photos/33238049/pexels-photo-33238049.jpeg",
  },
  {
    name: "Organic Products",
    slug: "organic",
    img: "https://images.pexels.com/photos/6187619/pexels-photo-6187619.jpeg",
  },
];

export default function HomePage() {
  const { products, loading, error } = useProducts({ limit: 6 });
 const {
  categories,
  loading: categoriesLoading,
  error: categoriesError,
} = useCategories();

  // const products = await fetchFromAPI('products') || [];
  // const mostSoldProducts = products.filter(products => product.isMostSold);

  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="bg-bg-section-soft">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-text-heading leading-tight">
              Grow Better.
              <br />
              Live Greener. 🌱
            </h1>

            <p className="mt-6 text-lg text-text-body max-w-xl">
              Discover premium plants, seeds, fertilizers, and gardening
              essentials delivered fresh to your doorstep.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-block bg-action-primary hover:bg-action-primary-hover text-text-inverse px-8 py-4 rounded-xl font-semibold transition shadow-md"
              >
                Shop Plants
              </Link>

              <Link
                href="/categories"
                className="inline-block border border-border-default px-8 py-4 rounded-xl font-semibold hover:bg-bg-page transition"
              >
                Explore Categories
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <Image
              src="https://images.pexels.com/photos/11741418/pexels-photo-11741418.jpeg"
              alt="Fresh plants and gardening supplies"
              width={600}
              height={500}
              priority
              className="rounded-2xl shadow-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="bg-bg-page border-t border-border-default">
        <div className="max-w-7xl mx-auto px-6 py-10 grid sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-semibold text-text-heading">
              🌿 Fresh from nurseries
            </p>
            <p className="text-sm text-text-muted mt-1">
              Direct partner farms & suppliers
            </p>
          </div>

          <div>
            <p className="font-semibold text-text-heading">
              🚚 Fast & safe delivery
            </p>
            <p className="text-sm text-text-muted mt-1">
              Carefully packed plants
            </p>
          </div>

          <div>
            <p className="font-semibold text-text-heading">
              💳 Secure payments
            </p>
            <p className="text-sm text-text-muted mt-1">
              UPI, cards & net banking
            </p>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="bg-bg-page">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-4xl font-bold text-text-heading text-center">
            Shop by Category
          </h2>

          <p className="mt-4 text-text-muted text-center max-w-2xl mx-auto">
            Everything you need for healthy plants and productive farming.
          </p>
          {categoriesLoading && <p>Loading categories...</p>}

          {categoriesError && <p className="text-center text-red-500">{error}</p>}

          {!categoriesLoading && !categoriesError && (
            <div className="mt-16 grid sm:grid-cols-2 md:grid-cols-3 gap-10">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="group bg-bg-section-soft rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={400}
                    height={300}
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-text-heading group-hover:text-action-primary transition">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="bg-bg-section-muted">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-4xl font-bold text-text-heading text-center">
            Featured Products
          </h2>

          <p className="mt-4 text-text-muted text-center max-w-2xl mx-auto">
            Our most loved plants and agri essentials.
          </p>

          {/* STATES */}
          {loading && <p className="text-center mt-16">Loading products...</p>}

          {error && <p className="text-center mt-16 text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="mt-16 grid sm:grid-cols-2 md:grid-cols-3 gap-10">
              {products.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
