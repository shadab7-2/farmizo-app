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
    <main className="bg-bg-page">
      <section className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-600 font-semibold">
                Shop the collection
              </p>
              <h1 className="mt-2 text-3xl lg:text-4xl font-bold text-text-heading">
                Premium Plants & Agri Essentials
              </h1>
              <p className="mt-3 max-w-3xl text-text-muted">
                Curated greens, tools, and agri supplies delivered with care. Filter by category, price, or availability and find your perfect pick.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-muted">
              <span className="px-3 py-1 rounded-full bg-white shadow-sm border border-border-default">
                Showing {loading ? "…" : products.length} of {pagination.totalProducts || products.length} products
              </span>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs uppercase tracking-wide text-text-muted">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setFiltersInUrl({ sort: e.target.value })}
                  className="rounded-full border border-border-default bg-white px-3 py-2 text-sm shadow-sm focus:border-action-primary focus:outline-none"
                >
                  <option value="">Default</option>
                  <option value="low">Price: Low → High</option>
                  <option value="high">Price: High → Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16 grid lg:grid-cols-4 gap-10">
        <aside className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm sticky top-24">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-heading">Filters</h2>
            </div>

            <form onSubmit={onSearchSubmit} className="mt-5 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">Search</label>
              <div className="flex items-center gap-2">
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products"
                  className="w-full rounded-xl border border-border-default px-3 py-2 text-sm focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-action-primary px-3 py-2 text-xs font-semibold text-white shadow hover:bg-action-primary-hover"
                >
                  Go
                </button>
              </div>
            </form>

            <div className="pt-5 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setFiltersInUrl({ category: e.target.value })}
                className="w-full rounded-xl border border-border-default px-3 py-2 text-sm bg-white focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-5 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">Price Range</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setFiltersInUrl({ minPrice: e.target.value })}
                  className="w-full rounded-xl border border-border-default px-3 py-2 text-sm focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setFiltersInUrl({ maxPrice: e.target.value })}
                  className="w-full rounded-xl border border-border-default px-3 py-2 text-sm focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border-default text-action-primary focus:ring-action-primary"
                checked={inStock}
                onChange={(e) => setFiltersInUrl({ inStock: e.target.checked ? "true" : "" })}
                id="in-stock"
              />
              <label htmlFor="in-stock" className="text-text-heading">
                In Stock Only
              </label>
            </div>

            <div className="pt-5 space-y-3 sm:hidden">
              <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">Sort</label>
              <select
                value={sort}
                onChange={(e) => setFiltersInUrl({ sort: e.target.value })}
                className="w-full rounded-xl border border-border-default px-3 py-2 text-sm bg-white focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
              >
                <option value="">Default</option>
                <option value="low">Price: Low → High</option>
                <option value="high">Price: High → Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-8">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-8">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse rounded-2xl border border-border-default bg-white p-4 shadow-sm space-y-3"
                >
                  <div className="h-48 w-full rounded-xl bg-gray-200" />
                  <div className="h-4 w-2/3 rounded bg-gray-200" />
                  <div className="h-3 w-full rounded bg-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                  <div className="h-9 w-full rounded-full bg-gray-200" />
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && products.length === 0 && (
            <p className="text-center text-text-muted">No products found.</p>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-8">
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
      </section>
    </main>
  );
}
