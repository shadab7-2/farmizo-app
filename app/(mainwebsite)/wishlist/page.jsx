"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "@/components/common/SafeImage";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  clearWishlistAsync,
  fetchWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import { addItemToCart } from "@/store/slices/cartSlice";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlistItems, loading } = useSelector((state) => state.wishlist);
  const [movingId, setMovingId] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error(err || "Failed to remove item");
    }
  };

  const handleMoveToCart = async (item) => {
    try {
      setMovingId(String(item._id));
      await dispatch(addItemToCart({ productId: item._id, quantity: 1 })).unwrap();
      await dispatch(removeFromWishlist(item._id)).unwrap();
      toast.success("Moved to cart");
    } catch (err) {
      toast.error(err || "Failed to move item to cart");
    } finally {
      setMovingId("");
    }
  };

  const handleClearAll = async () => {
    try {
      await dispatch(clearWishlistAsync()).unwrap();
      toast.success("Wishlist cleared");
    } catch (err) {
      toast.error(err || "Failed to clear wishlist");
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="bg-bg-page">
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <Heart size={38} className="mx-auto text-red-500" />
          <h1 className="mt-4 text-3xl font-bold text-text-heading">Your Wishlist</h1>
          <p className="mt-3 text-text-muted">Please login to view and manage your wishlist.</p>
          <Link
            href="/login?redirect=/wishlist"
            className="mt-6 inline-block rounded-xl bg-action-primary px-6 py-3 font-semibold text-text-inverse"
          >
            Login to Continue
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-bg-page">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-heading">My Wishlist</h1>
            <p className="mt-1 text-sm text-text-muted">
              {wishlistItems.length} saved item{wishlistItems.length === 1 ? "" : "s"}
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Clear Wishlist
            </button>
          )}
        </div>

        {loading ? (
          <div className="mt-10 text-sm text-text-muted">Loading wishlist...</div>
        ) : wishlistItems.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-text-muted">No items in wishlist yet.</p>
            <Link
              href="/products"
              className="mt-5 inline-block rounded-xl bg-action-primary px-6 py-3 font-semibold text-text-inverse"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlistItems.map((item) => (
              <article
                key={item._id}
                className="overflow-hidden rounded-2xl border border-border-default bg-white shadow-sm"
              >
                <Link href={`/products/${encodeURIComponent(item.slug)}`}>
                  <div className="relative h-52 w-full">
                    <Image
                      src={item.images?.[0] || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <Link
                    href={`/products/${encodeURIComponent(item.slug)}`}
                    className="line-clamp-2 font-semibold text-text-heading hover:text-action-primary"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-2 text-lg font-bold text-action-primary">Rs. {item.price}</p>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemove(item._id)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveToCart(item)}
                      disabled={movingId === String(item._id)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-action-primary px-3 py-2 text-sm font-semibold text-text-inverse disabled:opacity-60"
                    >
                      <ShoppingCart size={15} />
                      {movingId === String(item._id) ? "Moving..." : "Move to Cart"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
