import ProductCard from "@/components/product/ProductCard";

// Phase-1 mock search pool
const ALL_PRODUCTS = [
  {
    name: "Aloe Vera Plant",
    slug: "aloe-vera-plant",
    price: 299,
    image: "/cat-indoor.jpg",
  },
  {
    name: "Neem Oil Spray",
    slug: "neem-oil-spray",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1598514982845-cc1f1c1bfb4b?q=80&w=1200",
  },
  {
    name: "Garden Tool Set",
    slug: "garden-tool-set",
    price: 899,
    image:
      "https://images.unsplash.com/photo-1590080876206-1dc0c5c85f63?q=80&w=1200",
  },
];

export default function SearchResults({ query }) {
  if (!query) {
    return (
      <p className="text-center text-text-muted">
        Start typing to search products 🌱
      </p>
    );
  }

  const results = ALL_PRODUCTS.filter((product) =>
    product.name
      .toLowerCase()
      .includes(query.toLowerCase())
  );

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
          key={product.slug}
          product={product}
        />
      ))}
    </div>
  );
}
