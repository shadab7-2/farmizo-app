"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import api from "@/services/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        console.log( "product loading")
        const res = await api.get("/products");

        console.log( " this is the responce :",res)

        setProducts(res.data.data);
      } catch (err) {
        console.log(err)
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);


  return (
    <main>
      {/* ================= HEADER ================= */}
      <section className="bg-bg-section-soft">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-text-heading">
            Shop Products
          </h1>

          <p className="mt-4 text-text-muted max-w-2xl mx-auto">
            Explore our collection of plants and agri essentials.
          </p>
        </div>
      </section>

      {/* ================= GRID ================= */}
      <section className="bg-bg-page">
        <div className="max-w-7xl mx-auto px-6 py-24">
          {/* Loading */}
          {loading && (
            <p className="text-center text-text-muted">Loading products...</p>
          )}

          {/* Error */}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* Grid */}
          {!loading && !error && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
