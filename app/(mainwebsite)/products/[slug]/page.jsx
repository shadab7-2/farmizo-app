"use client";

import Image from "@/components/common/SafeImage";
import { Minus, Plus, Truck, ShieldCheck, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import api from "@/services/api";
import ProductCard from "@/components/product/ProductCard";
import { addToCartOptimistic, addItemToCart } from "@/store/slices/cartSlice";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [related, setRelated] = useState([]);

  const [qty, setQty] = useState(1);

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const safeSlug = decodeURIComponent(String(slug || ""))
          .trim()
          .toLowerCase();

        if (!safeSlug) {
          setError("Invalid product URL");
          setProduct(null);
          return;
        }

        const res = await api.get(`/products/${safeSlug}`);
        const productData = res.data?.data ?? res.data ?? null;

        setProduct(productData);
        const relatedRes = await api.get(`/products/${slug}/related`);

        setRelated(relatedRes.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadProduct();
  }, [slug]);

  // ================= LOADING =================
  if (loading)
    return (
      <p className="text-center py-20 text-text-muted">Loading product...</p>
    );

  // ================= ERROR =================
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;

  if (!product) return <p className="text-center py-20">Product not found</p>;

  // ================= SAFE DATA =================
  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["/placeholder.jpg"]; // put placeholder in public folder

  const inStock = product.stock > 0;

  // ================= CART HANDLER =================
  const handleAddToCart = () => {
    if (!inStock) {
      toast.error("This item is out of stock");
      return;
    }
    // 1 Instant Ui updates
    dispatch(
      addToCartOptimistic({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: images[0],
        quantity: qty,
      }),
    );
    toast.success(
      `${qty} item${qty > 1 ? "s" : ""} added to cart successfully`,
    );

    // 2 Sync with backend only for logged-in users
    if (isAuthenticated) {
      dispatch(
        addItemToCart({
          productId: product._id,
          quantity: qty,
        }),
      )
        .unwrap()
        .catch(() => {
          toast.error("Could not sync cart with server");
        });
    }
  };

  // ================= UI =================
  return (
    <main className="bg-bg-page">
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-20">
        {/* ================= IMAGE GALLERY ================= */}
        <div className="space-y-6">
          <div className="relative h-[420px] rounded-2xl overflow-hidden border border-border-default">
            <Image
              src={images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* THUMBNAILS */}
          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-28 rounded-xl overflow-hidden border border-border-default"
                >
                  <Image
                    src={img}
                    alt={`${product.name}-${idx}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= INFO ================= */}
        <div>
          <p className="text-sm uppercase tracking-wide text-text-muted">
            {product.category || "Farmizo"}
          </p>

          <h1 className="mt-2 text-4xl font-bold text-text-heading">
            {product.name}
          </h1>

          <p className="mt-4 text-3xl font-bold text-action-primary">
            ₹{product.price}
          </p>

          <p className="mt-6 text-text-body">{product.description}</p>

          {/* STOCK */}
          <p
            className={`mt-4 font-medium ${
              inStock ? "text-status-success" : "text-red-500"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </p>

          {/* ================= QTY ================= */}
          {inStock && (
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-3 rounded-lg border border-border-default hover:bg-bg-section-muted transition"
              >
                <Minus size={16} />
              </button>

              <span className="text-lg font-medium">{qty}</span>

              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="p-3 rounded-lg border border-border-default hover:bg-bg-section-muted transition"
              >
                <Plus size={16} />
              </button>
            </div>
          )}

          {/* ================= CTA ================= */}
          <button
            disabled={!inStock}
            onClick={handleAddToCart}
            className={`mt-8 w-full py-4 rounded-xl font-semibold transition
              ${
                inStock
                  ? "bg-action-primary hover:bg-action-primary-hover text-text-inverse"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>

          {/* ================= TRUST ================= */}
          <div className="mt-10 grid sm:grid-cols-3 gap-6 text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <Truck size={18} /> Fast delivery
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck size={18} /> Secure payment
            </div>

            <div className="flex items-center gap-2">
              <Leaf size={18} /> Eco friendly
            </div>
          </div>
        </div>
      </section>
      {/* ================= RELATED PRODUCTS ================= */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <h2 className="text-3xl font-bold text-text-heading mb-10">
            Related Products
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {related.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
