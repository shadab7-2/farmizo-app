"use client";

import Image from "@/components/common/SafeImage";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import { Star, Eye } from "lucide-react";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems || []);

  const productId = String(product?._id || "");
  const isWishlisted = wishlistItems.some((item) => String(item._id) === productId);

  const productHref = product?.slug
    ? `/products/${encodeURIComponent(product.slug)}`
    : "/products";

  const categoryLabel =
    product?.categoryName ||
    product?.categoryId?.name ||
    product?.category ||
    "Uncategorized";

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to use wishlist");
      router.push(`/login?redirect=${encodeURIComponent(productHref)}`);
      return;
    }

    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(productId)).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error(err || "Failed to update wishlist");
    }
  };

  const ratingValue = Number(product?.rating || product?.avgRating || 4.5).toFixed(1);
  const price = Number(product?.price || 0).toFixed(2);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border-default bg-surface-card shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <button
        type="button"
        onClick={handleWishlistToggle}
        className="absolute right-4 top-4 z-10 rounded-full bg-surface-card/95 p-2 shadow-md ring-1 ring-border-default/60 hover:bg-surface-hover transition duration-200"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={18}
          className={isWishlisted ? "fill-status-error text-status-error" : "text-text-muted"}
        />
      </button>

      <Link href={productHref} className="block">
        <div className="relative h-72 w-full overflow-hidden bg-gradient-to-br from-bg-section-soft to-surface-card">
          <Image
            src={product.images?.[0] || "/public/hero-plants.jpg"}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />

          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-text-heading/80 px-3 py-1 text-xs font-semibold text-text-inverse backdrop-blur">
            {categoryLabel}
          </span>

          <div className="absolute bottom-4 left-4 inline-flex items-center gap-1 rounded-full bg-surface-card/90 px-3 py-1 text-xs font-semibold text-status-warning shadow-sm">
            <Star size={14} className="fill-status-warning text-status-warning" />
            {ratingValue}
          </div>
        </div>

        <div className="p-5 space-y-3">
          <h3 className="text-lg font-semibold text-text-heading line-clamp-1">
            {product.name}
          </h3>

          <p className="line-clamp-2 text-sm text-text-muted">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-action-primary">
              ₹ {price}
            </span>

            <span className="text-xs font-medium text-text-muted">
              {product?.stock > 0 ? "In Stock" : "Out of stock"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border-default px-4 py-2 text-sm font-semibold text-text-heading transition hover:border-action-primary hover:text-action-primary"
            >
              <Eye size={16} />
              View Product
            </button>
            <span className="ml-auto text-sm font-semibold text-action-primary transition group-hover:translate-x-1">
              Details →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
