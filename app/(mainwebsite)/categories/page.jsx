"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "@/components/common/SafeImage";
import { fetchCategories } from "@/services/category.service";

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

  if (loading)
    return <main className="py-32 text-center">Loading categories...</main>;

  if (error)
    return <main className="py-32 text-center text-red-500">{error}</main>;

  return (
    <main>
      {/* HEADER */}
      <section className="bg-bg-section-soft">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-text-heading">
            Shop by Category
          </h1>

          <p className="mt-4 text-text-muted max-w-2xl mx-auto">
            Explore our range of plants, seeds, fertilizers and gardening essentials.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="bg-bg-page">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">

            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/categories/${cat.slug}`}
                className="group bg-bg-page rounded-2xl overflow-hidden border border-border-default shadow-sm hover:shadow-md transition"
              >
                <div className="relative h-56">

                  <Image
                    src={cat.image || "/placeholder.jpg"}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />

                </div>

                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-text-heading">
                    {cat.name}
                  </h3>
                </div>

              </Link>
            ))}

          </div>
        </div>
      </section>
    </main>
  );
}
