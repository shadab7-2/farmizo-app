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

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border-default bg-bg-page shadow-sm transition hover:shadow-lg">
      <button
        type="button"
        onClick={handleWishlistToggle}
        className="absolute right-3 top-3 z-10 rounded-full bg-white/95 p-2 shadow hover:bg-white"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={18}
          className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}
        />
      </button>

      <Link href={productHref} className="block">
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={product.images?.[0] || "/public/hero-plants.jpg"}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        <div className="p-5">
          <p className="text-xs uppercase tracking-wide text-text-muted">
            {categoryLabel}
          </p>

          <h3 className="mt-1 text-lg font-semibold text-text-heading">
            {product.name}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm text-text-muted">
            {product.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-action-primary">
              Rs. {product.price}
            </span>

            <span className="text-sm font-semibold text-action-primary transition hover:text-action-primary-hover">
              View &rarr;
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
