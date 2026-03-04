"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";

import { fetchCategoryBySlug } from "@/services/category.service";
import { fetchProducts } from "@/services/product.service";

export default function CategoryPage() {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // Filters
  const [selectedTypes, setSelectedTypes] = useState([]);

  const [maxPrice, setMaxPrice] = useState(2000);

  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    if (!slug) return;

    const loadCategory = async () => {
      try {
        setLoading(true);
        const cat = await fetchCategoryBySlug(slug);
        setCategory(cat);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [slug]);

 useEffect(() => {
  if (!slug) return;

  const loadProducts = async () => {
    try {
      setLoading(true);

      const params = {
        category: slug,
        type: selectedTypes.join(","),
        maxPrice,
        sort: sortBy,
      };

      const prods = await fetchProducts(params);
      setProducts(prods || []);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  loadProducts();
}, [slug, selectedTypes, maxPrice, sortBy]);


  if (loading)
    return <main className="py-32 text-center">Loading category...</main>;

  if (error)
    return <main className="py-32 text-center text-red-500">{error}</main>;

  if (!category)
    return <main className="py-32 text-center">Category not found</main>;

  return (
    <main>
      {/* ================= HEADER ================= */}
      <section className="bg-bg-section-soft">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-text-heading">
            {category.name}
          </h1>

          <p className="mt-4 text-text-muted max-w-2xl mx-auto">
            {category.description}
          </p>
        </div>
      </section>

      {/* ================= LAYOUT ================= */}
      <section className="bg-bg-page">
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-4 gap-14">
          {/* SIDEBAR — stays for now */}
          <aside className="lg:col-span-1 bg-bg-section-muted p-6 rounded-2xl border border-border-default h-fit">
            <h3 className="text-lg font-semibold text-text-heading">Filters</h3>

            {/* TYPE */}
            <div className="mt-6 space-y-3">
              <p className="text-sm font-medium">Type</p>

              {Array.isArray(category.types) && category.types.map((type) => (
                <label key={type} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={(e) => {
                      setSelectedTypes((prev) =>
                        e.target.checked
                          ? [...prev, type]
                          : prev.filter((t) => t !== type),
                      );
                    }}
                  />
                  {type}
                </label>
              ))}
            </div>

            {/* PRICE */}
            <div className="mt-8">
              <p className="text-sm font-medium">Max Price ₹{maxPrice}</p>
              <input
                type="range"
                min="0"
                max="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>

            {/* SORT */}
            <div className="mt-8">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Default</option>
                <option value="low">Price Low → High</option>
                <option value="high">Price High → Low</option>
              </select>
            </div>
          </aside>

          {/* PRODUCTS */}
          <div className="lg:col-span-3">
            {!products || products.length === 0 ? (
              <p className="text-center text-text-muted">No products found.</p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useParams } from "next/navigation";
// import ProductCard from "@/components/product/ProductCard";
// import api from "@/services/api";

// /* ---------------- CATEGORY META (UI ONLY) ---------------- */

// const CATEGORY_CONFIG = {
//   plants: {
//     title: "Plants",
//     description:
//       "Fresh indoor & outdoor plants directly from trusted nurseries.",
//     filters: ["Indoor", "Outdoor", "Medicinal"],
//   },

//   seeds: {
//     title: "Seeds",
//     description:
//       "High-quality seeds for healthy crop growth and gardening.",
//     filters: ["Vegetable", "Flower", "Herb"],
//   },

//   fertilizers: {
//     title: "Fertilizers",
//     description:
//       "Organic & chemical fertilizers to boost soil health.",
//     filters: ["Organic", "Chemical", "Compost"],
//   },

//   agriproducts: {
//     title: "Agri Products",
//     description:
//       "Tools, soil, pesticides and organic farming essentials.",
//     filters: ["Fertilizer", "Pesticide", "Tools", "Soil"],
//   },

//   tools: {
//     title: "Garden Tools",
//     description:
//       "Professional gardening tools for every grower.",
//     filters: ["Hand Tools", "Power Tools", "Accessories"],
//   },

//   pots: {
//     title: "Pots & Planters",
//     description:
//       "Decorative and functional planters for your plants.",
//     filters: ["Plastic", "Ceramic", "Clay", "Hanging"],
//   },

//   organic: {
//     title: "Organic Products",
//     description:
//       "Eco-friendly inputs for sustainable farming.",
//     filters: ["Manure", "Bio Fertilizer", "Compost"],
//   },
// };

// export default function CategoryPage() {
//   const { slug } = useParams();

//   const category = CATEGORY_CONFIG[slug];

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   /* ---------------- FILTER STATES ---------------- */

//   const [selectedTypes, setSelectedTypes] = useState([]);
//   // const [maxPrice, setMaxPrice] =
//   // useState(2000);
//   const [minPrice, setMinPrice] = useState(0);
//   const [maxPrice, setMaxPrice] = useState(2000);

//   const [inStockOnly, setInStockOnly] = useState(false);

//   const [sortBy, setSortBy] = useState("");

//   /* ---------------- FETCH FROM API ---------------- */

//   useEffect(() => {
//     if (!slug) return;

//     const loadProducts = async () => {
//       try {
//         setLoading(true);

//         const res = await api.get(`/products?category=${slug}`);

//         setProducts(res.data.data);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to load products");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProducts();
//   }, [slug]);

//   /* ---------------- FILTER LOGIC ---------------- */

//   const filteredProducts = useMemo(() => {
//     let result = [...products];

//     if (selectedTypes.length > 0) {
//       result = result.filter((p) =>
//         selectedTypes.includes(p.subCategory || p.type),
//       );
//     }

//     // result = result.filter((p) => p.price <= maxPrice);
//     result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

//     if (inStockOnly) {
//       result = result.filter((p) => p.stock > 0);
//     }

//     if (sortBy === "low") {
//       result = [...result].sort((a, b) => a.price - b.price);
//     }

//     if (sortBy === "high") {
//       result = [...result].sort((a, b) => b.price - a.price);
//     }

//     return result;
//   }, [products, selectedTypes, maxPrice, sortBy]);

//   /* ---------------- GUARDS ---------------- */

//   if (!category) {
//     return (
//       <main className="py-32 text-center">
//         <h1 className="text-3xl font-bold">Category Not Found</h1>
//       </main>
//     );
//   }

//   /* ---------------- UI ---------------- */

//   return (
//     <main>
//       {/* ================= HEADER ================= */}
//       <section className="bg-bg-section-soft">
//         <div className="max-w-7xl mx-auto px-6 py-20 text-center">
//           <h1 className="text-4xl font-bold text-text-heading">
//             {category.title}
//           </h1>

//           <p className="mt-4 text-text-muted max-w-2xl mx-auto">
//             {category.description}
//           </p>
//         </div>
//       </section>

//       {/* ================= LAYOUT ================= */}
//       <section className="bg-bg-page">
//         <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-4 gap-14">
//           {/* ===== SIDEBAR ===== */}
//           <aside className="lg:col-span-1 bg-bg-section-muted p-6 rounded-2xl border border-border-default h-fit">
//             <h3 className="text-lg font-semibold text-text-heading">Filters</h3>

//             {/* TYPE FILTER */}
//             <div className="mt-6 space-y-3">
//               <p className="text-sm font-medium">Product Type</p>

//               {category.filters.map((type) => (
//                 <label
//                   key={type}
//                   className="flex items-center gap-2 text-sm cursor-pointer"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedTypes.includes(type)}
//                     onChange={(e) => {
//                       setSelectedTypes((prev) =>
//                         e.target.checked
//                           ? [...prev, type]
//                           : prev.filter((t) => t !== type),
//                       );
//                     }}
//                   />
//                   {type}
//                 </label>
//               ))}
//             </div>

//             {/* PRICE RANGE */}
//             <div className="mt-8 space-y-3">
//               <p className="text-sm font-medium">Price Range (₹)</p>

//               <div className="flex gap-3">
//                 <input
//                   type="number"
//                   min="0"
//                   value={minPrice}
//                   onChange={(e) => setMinPrice(Number(e.target.value))}
//                   className="w-1/2 border border-border-default rounded-lg px-3 py-2"
//                   placeholder="Min"
//                 />

//                 <input
//                   type="number"
//                   min="0"
//                   value={maxPrice}
//                   onChange={(e) => setMaxPrice(Number(e.target.value))}
//                   className="w-1/2 border border-border-default rounded-lg px-3 py-2"
//                   placeholder="Max"
//                 />
//               </div>
//             </div>

//             {/* IN STOCK */}
//             <div className="mt-8">
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={inStockOnly}
//                   onChange={(e) => setInStockOnly(e.target.checked)}
//                 />
//                 In stock only
//               </label>
//             </div>

//             {/* SORT */}
//             <div className="mt-8">
//               <p className="text-sm font-medium mb-2">Sort By</p>

//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="w-full border border-border-default rounded-lg px-3 py-2"
//               >
//                 <option value="">Default</option>
//                 <option value="low">Price: Low → High</option>
//                 <option value="high">Price: High → Low</option>
//               </select>
//             </div>

//             {/* RESET */}
//             <button
//               onClick={() => {
//                 setSelectedTypes([]);
//                 setMinPrice(0);
//                 setMaxPrice(2000);
//                 setInStockOnly(false);
//                 setSortBy("");
//               }}
//               className="mt-8 w-full border border-border-default py-2 rounded-lg hover:bg-bg-page transition"
//             >
//               Reset Filters
//             </button>
//           </aside>

//           {/* ===== PRODUCTS ===== */}
//           <div className="lg:col-span-3">
//             {loading && <p className="text-center">Loading products...</p>}

//             {error && <p className="text-center text-red-500">{error}</p>}

//             {!loading && !error && filteredProducts.length === 0 && (
//               <p className="text-center text-text-muted">
//                 No matching products found.
//               </p>
//             )}

//             {!loading && !error && (
//               <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
//                 {filteredProducts.map((product) => (
//                   <ProductCard key={product._id} product={product} />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }
