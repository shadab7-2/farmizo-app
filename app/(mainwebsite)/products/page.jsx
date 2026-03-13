"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import ProductPagination from "@/components/product/ProductPagination";
import { fetchProductsWithPagination } from "@/services/product.service";
import { fetchCategories } from "@/services/category.service";

const buildParamsObject = (searchParams) => {
  const params = {};

  ["category", "q", "minPrice", "maxPrice", "inStock", "sort", "page", "limit"].forEach(
    (key) => {
      const value = searchParams.get(key);
      if (value !== null && value !== "") {
        params[key] = value;
      }
    },
  );

  return params;
};

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [pagination, setPagination] = useState({
    totalProducts: 0,
    totalPages: 0,
    currentPage: 1,
  });

  const selectedCategory = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const inStock = searchParams.get("inStock") === "true";
  const sort = searchParams.get("sort") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const apiParams = useMemo(() => buildParamsObject(searchParams), [searchParams]);

  const setFiltersInUrl = (updates = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      const shouldDelete =
        value === undefined ||
        value === null ||
        value === "" ||
        value === false;

      if (shouldDelete) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    if (updates.page === undefined) {
      params.delete("page");
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    setSearchInput(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchProductsWithPagination(apiParams);
        setProducts(Array.isArray(response.products) ? response.products : []);
        setPagination(
          response.pagination || {
            totalProducts: 0,
            totalPages: 0,
            currentPage,
          },
        );
      } catch (err) {
        setError(err.message || "Failed to load products");
        setPagination({
          totalProducts: 0,
          totalPages: 0,
          currentPage,
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [apiParams, currentPage]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setFiltersInUrl({ q: searchInput.trim() });
  };

  const onPageChange = (page) => {
    setFiltersInUrl({ page });
  };

  return (
    <main>
      <section className="bg-bg-section-soft">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-text-heading">Shop Products</h1>

          <p className="mt-4 text-text-muted max-w-2xl mx-auto">
            Explore our collection of plants and agri essentials.
          </p>
        </div>
      </section>

      <section className="bg-bg-page">
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-4 gap-12">
          <aside className="lg:col-span-1 bg-bg-section-muted p-6 rounded-2xl border border-border-default h-fit space-y-5">
            <h2 className="text-lg font-semibold text-text-heading">Filters</h2>

            <form onSubmit={onSearchSubmit} className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products"
                className="w-full border rounded-lg px-3 py-2"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-action-primary text-white py-2 text-sm"
              >
                Apply Search
              </button>
            </form>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setFiltersInUrl({ category: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setFiltersInUrl({ minPrice: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setFiltersInUrl({ maxPrice: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setFiltersInUrl({ inStock: e.target.checked ? "true" : "" })}
              />
              In Stock Only
            </label>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort</label>
              <select
                value={sort}
                onChange={(e) => setFiltersInUrl({ sort: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Default</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </aside>

          <div className="lg:col-span-3">
            {loading && (
              <p className="text-center text-text-muted">Loading products...</p>
            )}

            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && products.length === 0 && (
              <p className="text-center text-text-muted">No products found.</p>
            )}

            {!loading && !error && products.length > 0 && (
              <>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                <ProductPagination
                  currentPage={pagination.currentPage || currentPage}
                  totalPages={pagination.totalPages || 1}
                  loading={loading}
                  onPageChange={onPageChange}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
