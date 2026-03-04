import ProductCard from "@/components/product/ProductCard";

export const metadata = {
  title: "Agri Products & Farming Supplies | Farmizo",
  description:
    "Shop fertilizers, soil, tools, seeds, and farming essentials at Farmizo.",
};

const agriProducts = [
  {
    name: "Organic Vermicompost",
    slug: "organic-vermicompost",
    category: "Fertilizer",
    price: 499,
    description: "Natural compost to boost soil fertility.",
    image:
      "https://images.unsplash.com/photo-1582515073490-dc84dbe08c1f?q=80&w=1200",
  },
  {
    name: "Neem Oil Spray",
    slug: "neem-oil-spray",
    category: "Organic Pesticide",
    price: 299,
    description: "Eco-friendly pest control solution for crops.",
    image:
      "https://images.unsplash.com/photo-1598514982845-cc1f1c1bfb4b?q=80&w=1200",
  },
  {
    name: "Garden Tool Set",
    slug: "garden-tool-set",
    category: "Tools",
    price: 899,
    description: "Essential tools for farmers and gardeners.",
    image:
      "https://images.unsplash.com/photo-1590080876206-1dc0c5c85f63?q=80&w=1200",
  },
  {
    name: "Potting Soil Mix",
    slug: "potting-soil-mix",
    category: "Soil",
    price: 349,
    description: "Nutrient-rich soil blend for healthy plants.",
    image:
      "https://images.unsplash.com/photo-1617957743573-4b39c1d0f9f0?q=80&w=1200",
  },
];

export default function AgriProductsPage() {
  return (
    <main>

      {/* ================= HEADER ================= */}
      <section className="bg-bg-section-soft">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">

          <h1 className="text-4xl font-bold text-text-heading">
            Agri Products
          </h1>

          <p className="mt-4 text-text-muted max-w-2xl mx-auto">
            Fertilizers, tools, soil, and organic farming essentials for
            healthy crops.
          </p>

        </div>
      </section>

      {/* ================= GRID ================= */}
      <section className="bg-bg-page">
        <div className="max-w-7xl mx-auto px-6 py-24">

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {agriProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}
