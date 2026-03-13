"use client";

import Image from "@/components/common/SafeImage";
import { Minus, Plus, Truck, ShieldCheck, Leaf, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import api from "@/services/api";
import ProductCard from "@/components/product/ProductCard";
import ProductReviews from "@/components/product/ProductReviews";
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
      : ["/placeholder.jpg"];

  const inStock = product.stock > 0;
  const ratingValue = Number(product.rating || 0);
  const reviewCount = Number(product.numReviews || 0);

  // ================= CART HANDLER =================
  const handleAddToCart = () => {
    if (!inStock) {
      toast.error("This item is out of stock");
      return;
    }

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

  return (
    <main className="bg-bg-page">
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-20">
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

        <div>
          <p className="text-sm uppercase tracking-wide text-text-muted">
            {product.category || "Farmizo"}
          </p>

          <h1 className="mt-2 text-4xl font-bold text-text-heading">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((idx) => (
                <Star
                  key={idx}
                  size={16}
                  className={
                    idx <= Math.round(ratingValue)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <p className="text-sm text-text-muted">
              {ratingValue.toFixed(1)} ({reviewCount} reviews)
            </p>
          </div>

          <p className="mt-4 text-3xl font-bold text-action-primary">
            Rs. {product.price}
          </p>

          <p className="mt-6 text-text-body">{product.description}</p>

          <p
            className={`mt-4 font-medium ${
              inStock ? "text-status-success" : "text-red-500"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </p>

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

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <ProductReviews
          productId={product._id}
          initialRating={ratingValue}
          initialNumReviews={reviewCount}
        />
      </section>
    </main>
  );
}
