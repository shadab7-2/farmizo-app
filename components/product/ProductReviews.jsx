"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BadgeCheck, Star } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  createReview,
  deleteReview,
  getProductReviews,
  updateReview,
} from "@/services/product.service";

const StarRow = ({ value = 0, onPick, size = 18, interactive = false }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((idx) => (
      <button
        key={idx}
        type="button"
        disabled={!interactive}
        onClick={() => onPick?.(idx)}
        className={interactive ? "cursor-pointer" : "cursor-default"}
      >
        <Star
          size={size}
          className={idx <= value ? "fill-status-warning text-status-warning" : "text-border-default"}
        />
      </button>
    ))}
  </div>
);

export default function ProductReviews({ productId, initialRating = 0, initialNumReviews = 0 }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    rating: initialRating,
    numReviews: initialNumReviews,
    reviews: [],
    pagination: { page: 1, pages: 0, limit: 10, total: 0 },
  });
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const myReview = useMemo(
    () =>
      (data.reviews || []).find(
        (review) => String(review.user) === String(user?._id),
      ) || null,
    [data.reviews, user?._id],
  );

  const loadReviews = useCallback(async (targetPage = 1) => {
    try {
      setLoading(true);
      const result = await getProductReviews(productId, { page: targetPage, limit: 10 });
      setData(result);
      setPage(targetPage);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    loadReviews(1);
  }, [productId, loadReviews]);

  useEffect(() => {
    if (myReview) {
      setRating(Number(myReview.rating || 5));
      setComment(myReview.comment || "");
    } else {
      setRating(5);
      setComment("");
    }
  }, [myReview]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to write a review");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please enter review comment");
      return;
    }

    try {
      setSubmitting(true);
      if (myReview) {
        await updateReview(productId, { rating, comment: comment.trim() });
        toast.success("Review updated");
      } else {
        try {
          await createReview(productId, { rating, comment: comment.trim() });
          toast.success("Review added");
        } catch (err) {
          if (err?.response?.status === 409) {
            await updateReview(productId, { rating, comment: comment.trim() });
            toast.success("Review updated");
          } else {
            throw err;
          }
        }
      }
      await loadReviews(1);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to manage reviews");
      return;
    }
    try {
      setSubmitting(true);
      await deleteReview(productId);
      toast.success("Review removed");
      await loadReviews(1);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to delete review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-border-default bg-surface-card p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-text-heading">Customer Reviews</h3>
          <p className="text-sm text-text-muted">
            {Number(data.rating || 0).toFixed(1)} out of 5 ({data.numReviews || 0} reviews)
          </p>
        </div>
        <StarRow value={Math.round(Number(data.rating || 0))} />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <h4 className="text-lg font-semibold text-text-heading">
            {myReview ? "Edit Your Review" : "Write a Review"}
          </h4>
          <p className="mt-1 text-sm text-text-muted">Only verified purchasers can post one review.</p>

          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-heading">Rating</label>
              <StarRow value={rating} onPick={setRating} interactive />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-heading">Comment</label>
              <textarea
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share quality, delivery, and overall experience..."
                className="w-full rounded-lg border border-border-default px-3 py-2 text-sm outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary/30"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                disabled={submitting}
                type="submit"
                className="rounded-lg bg-action-primary px-4 py-2 text-sm font-semibold text-text-inverse hover:bg-action-primary-hover disabled:opacity-60 transition duration-200"
              >
                {submitting ? "Saving..." : myReview ? "Update Review" : "Submit Review"}
              </button>
              {myReview && (
                <button
                  disabled={submitting}
                  type="button"
                  onClick={onDelete}
                  className="rounded-lg border border-status-error/40 px-4 py-2 text-sm font-semibold text-status-error hover:bg-status-error/10 disabled:opacity-60 transition duration-200"
                >
                  Delete Review
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-text-heading">All Reviews</h4>
          {loading ? (
            <div className="mt-4 text-sm text-text-muted">Loading reviews...</div>
          ) : (data.reviews || []).length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-border-default p-4 text-sm text-text-muted">
              No reviews yet. Be the first to review this product.
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {(data.reviews || []).map((review) => (
                <article key={review._id} className="rounded-xl border border-border-default p-4 bg-surface-card">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-text-heading">{review.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <StarRow value={Number(review.rating || 0)} size={16} />
                        <span className="text-xs text-text-muted">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-status-success/10 px-2 py-1 text-xs font-medium text-status-success">
                      <BadgeCheck size={14} />
                      Verified Purchase
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-text-body">{review.comment}</p>
                </article>
              ))}

              {(data.pagination?.pages || 0) > 1 && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => loadReviews(page - 1)}
                    className="rounded border border-border-default px-3 py-1 text-sm disabled:opacity-50 bg-surface-card hover:bg-surface-hover transition duration-200"
                  >
                    Prev
                  </button>
                  <span className="text-sm text-text-muted">
                    Page {page} of {data.pagination.pages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= data.pagination.pages}
                    onClick={() => loadReviews(page + 1)}
                    className="rounded border border-border-default px-3 py-1 text-sm disabled:opacity-50 bg-surface-card hover:bg-surface-hover transition duration-200"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
