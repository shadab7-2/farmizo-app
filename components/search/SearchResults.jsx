"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { searchProducts } from "@/services/product.service";

export default function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const search = async () => {
      if (!query || !query.trim()) {
        setResults([]);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await searchProducts({ q: query.trim(), page: 1, limit: 24 });
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to search products");
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [query]);

  if (!query) {
    return (
      <p className="text-center text-text-muted">
        Start typing to search products.
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-center text-text-muted">Searching products...</p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-status-error">{error}</p>
    );
  }

  if (results.length === 0) {
    return (
      <p className="text-center text-text-muted">
        No products found.
      </p>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {results.map((product) => (
        <ProductCard
          key={product._id || product.slug}
          product={product}
        />
      ))}
    </div>
  );
}
