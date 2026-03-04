import ProductCard from "@/components/product/ProductCard";

export const metadata = {
  title: "Plants for Home & Garden | Farmizo",
  description:
    "Browse indoor and outdoor plants for your home, garden, and farm at Farmizo.",
};

const plantProducts = [
  {
    name: "Aloe Vera Plant",
    slug: "aloe-vera-plant",
    category: "Indoor Plant",
    price: 299,
    description: "Low maintenance medicinal plant perfect for homes.",
    image: "/cat-indoor.jpg",
  },
  {
    name: "Rose Plant",
    slug: "rose-plant",
    category: "Outdoor Plant",
    price: 349,
    description: "Beautiful flowering rose plant for gardens.",
    image: "/hero-plants.jpg",
  },
  {
    name: "Money Plant",
    slug: "money-plant",
    category: "Indoor Plant",
    price: 199,
    description: "Popular air-purifying plant for homes.",
    image: "/cat-indoor.jpg",
  },
  {
    name: "Tulsi Plant",
    slug: "tulsi-plant",
    category: "Medicinal Plant",
    price: 249,
    description: "Sacred medicinal herb with health benefits.",
    image: "/hero-plants.jpg",
  },
];

export default function PlantsCategoryPage() {
  return (
    <main>

      {/* ================= HEADER ================= */}
      <section className="bg-bg-section-soft">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">

          <h1 className="text-4xl font-bold text-text-heading">
            Plants
          </h1>

          <p className="mt-4 text-text-muted max-w-2xl mx-auto">
            Fresh indoor & outdoor plants directly from trusted nurseries.
          </p>

        </div>
      </section>

      {/* ================= GRID ================= */}
      <section className="bg-bg-page">
        <div className="max-w-7xl mx-auto px-6 py-24">

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {plantProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}
