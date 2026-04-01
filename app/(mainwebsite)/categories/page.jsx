"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCategories } from "@/services/category.service";
import CategoryCard from "@/components/category/CategoryCard";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (error)
    return <main className="py-32 text-center text-red-500">{error}</main>;

  return (
    <main className="bg-bg-page">
      <section className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-600 font-semibold">
            Shop by category
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-text-heading">
            Curated collections for every grower
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-text-muted">
            Explore plants, seeds, tools, and essentials tailored to your garden and farm.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-10">
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-10">
            {categories.map((cat) => (
              <CategoryCard key={cat._id} category={cat} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
