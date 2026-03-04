"use client";

import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <main>

      {/* HEADER */}
      <section className="bg-bg-section-soft">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold text-text-heading">
            Search Products
          </h1>

          {query && (
            <p className="mt-2 text-text-muted">
              Results for <span className="font-semibold">{query}</span>
            </p>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-bg-page">
        <div className="max-w-7xl mx-auto px-6 py-20 space-y-10">

          <SearchBar initialValue={query} />

          <SearchResults query={query} />

        </div>
      </section>

    </main>
  );
}
