//farmizo-app\app\(mainwebsite)\page.jsx

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
      <section className="bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
              Grow Green🪴
              <br />
              Live Better 🌼
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto md:mx-0">
              Discover premium plants, seeds, fertilizers, and gardening
              essentials delivered fresh to your doorstep.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-block text-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition w-full sm:w-auto"
              >
                Shop Plants
              </Link>

              <Link
                href="/categories"
                className="inline-block text-center border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100 w-full sm:w-auto"
              >
                Explore Categories
              </Link>
            </div>

            {/* <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 text-sm text-gray-600 mt-6 justify-center md:justify-start">
              <p>?? 100% Healthy Plants</p>
              <p>?? Free Delivery Above ?499</p>
              <p>? 10,000+ Happy Gardeners</p>
            </div> */}

            {/* <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
              <Link
                href="/categories/plants"
                className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm hover:bg-green-200"
              >
                Indoor Plants
              </Link>
              <Link
                href="/categories/plants"
                className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm hover:bg-green-200"
              >
                Outdoor Plants
              </Link>
              <Link
                href="/categories/seeds"
                className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm hover:bg-green-200"
              >
                Seeds
              </Link>
              <Link
                href="/categories/agriproducts"
                className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm hover:bg-green-200"
              >
                Fertilizers
              </Link>
              <Link
                href="/categories/pots"
                className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm hover:bg-green-200"
              >
                Pots
              </Link>
            </div> */}
          </div>

          {/* RIGHT */}
          <div className="relative order-last md:order-none">
            <Image
              src="https://images.pexels.com/photos/11741418/pexels-photo-11741418.jpeg"
              alt="Fresh plants and gardening supplies"
              width={600}
              height={500}
              priority
              className="rounded-2xl shadow-xl object-cover w-full h-[500px]"
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
 