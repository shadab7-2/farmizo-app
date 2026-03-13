"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Star, Trash2 } from "lucide-react";
import {
  deleteAdminReview,
  deleteAdminReviewsBulk,
  getAdminReviews,
} from "@/services/admin.service";

const PAGE_SIZE = 10;

const renderStars = (value) =>
  [1, 2, 3, 4, 5].map((idx) => (
    <Star
      key={idx}
      size={14}
      className={idx <= Number(value || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
    />
  ));

function ConfirmDeleteModal({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  loading = false,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{message}</p>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: PAGE_SIZE,
  });
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingReviewId, setDeletingReviewId] = useState("");
  const [selectedReviewIds, setSelectedReviewIds] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    mode: "",
    reviewId: "",
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, ratingFilter]);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getAdminReviews({
        page,
        limit: PAGE_SIZE,
        q: searchQuery,
        rating: ratingFilter === "all" ? "" : ratingFilter,
      });
      setReviews(result.reviews);
      setPagination(result.pagination);
      setSelectedReviewIds([]);
    } catch (err) {
      setError(err.message || "Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [page, ratingFilter, searchQuery]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const executeSingleDelete = async (reviewId) => {
    setDeletingReviewId(reviewId);
    setError("");
    try {
      await deleteAdminReview(reviewId);
      await loadReviews();
    } catch (err) {
      setError(err.message || "Failed to delete review");
    } finally {
      setDeletingReviewId("");
    }
  };

  const selectedCount = selectedReviewIds.length;
  const allSelectedOnPage =
    reviews.length > 0 &&
    reviews.every((review) => selectedReviewIds.includes(String(review.reviewId)));

  const toggleSelectOne = (reviewId) => {
    const id = String(reviewId);
    setSelectedReviewIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAllOnPage = () => {
    if (allSelectedOnPage) {
      setSelectedReviewIds([]);
      return;
    }
    setSelectedReviewIds(reviews.map((review) => String(review.reviewId)));
  };

  const executeBulkDelete = async () => {
    if (selectedReviewIds.length === 0) return;
    setBulkDeleting(true);
    setError("");
    try {
      await deleteAdminReviewsBulk(selectedReviewIds);
      await loadReviews();
    } catch (err) {
      setError(err.message || "Failed to delete selected reviews");
    } finally {
      setBulkDeleting(false);
    }
  };

  const openSingleDeleteConfirm = (reviewId) => {
    setConfirmModal({
      open: true,
      mode: "single",
      reviewId: String(reviewId),
    });
  };

  const openBulkDeleteConfirm = () => {
    if (selectedReviewIds.length === 0) return;
    setConfirmModal({
      open: true,
      mode: "bulk",
      reviewId: "",
    });
  };

  const closeConfirmModal = () => {
    if (deletingReviewId || bulkDeleting) return;
    setConfirmModal({
      open: false,
      mode: "",
      reviewId: "",
    });
  };

  const handleConfirmDelete = async () => {
    if (confirmModal.mode === "single" && confirmModal.reviewId) {
      await executeSingleDelete(confirmModal.reviewId);
      setConfirmModal({ open: false, mode: "", reviewId: "" });
      return;
    }

    if (confirmModal.mode === "bulk") {
      await executeBulkDelete();
      setConfirmModal({ open: false, mode: "", reviewId: "" });
    }
  };

  const pageNumbers = useMemo(() => {
    const totalPages = Math.max(1, Number(pagination.totalPages || 1));
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    for (let current = start; current <= end; current += 1) {
      pages.push(current);
    }
    return pages;
  }, [page, pagination.totalPages]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-heading">Review Moderation</h1>
        <p className="mt-1 text-sm text-text-muted">
          Inspect and remove inappropriate customer reviews.
        </p>
      </div>

      <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-3">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 md:col-span-2">
          <Search size={16} className="text-gray-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by reviewer, product, or comment..."
            className="w-full text-sm outline-none"
          />
        </div>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={allSelectedOnPage}
            onChange={toggleSelectAllOnPage}
            className="h-4 w-4 rounded border-gray-300"
          />
          Select all on this page
        </label>
        <button
          type="button"
          onClick={openBulkDeleteConfirm}
          disabled={selectedCount === 0 || bulkDeleting}
          className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
        >
          <Trash2 size={14} />
          {bulkDeleting
            ? "Deleting..."
            : selectedCount > 0
              ? `Delete Selected (${selectedCount})`
              : "Delete Selected"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-gray-100 bg-white py-16 text-center text-sm text-gray-500">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-sm text-gray-500">
          No reviews found for current filters.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <article
              key={review.reviewId}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <label className="mb-2 inline-flex items-center gap-2 text-xs text-gray-500">
                    <input
                      type="checkbox"
                      checked={selectedReviewIds.includes(String(review.reviewId))}
                      onChange={() => toggleSelectOne(review.reviewId)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    Select
                  </label>
                  <p className="text-sm text-gray-500">
                    Product:{" "}
                    <Link
                      href={`/products/${encodeURIComponent(review.productSlug)}`}
                      target="_blank"
                      className="font-medium text-green-700 hover:underline"
                    >
                      {review.productName}
                    </Link>
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800">{review.reviewerName}</p>
                  <div className="mt-1 flex items-center gap-1">{renderStars(review.rating)}</div>
                  <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openSingleDeleteConfirm(review.reviewId)}
                  disabled={deletingReviewId === review.reviewId}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  <Trash2 size={14} />
                  {deletingReviewId === review.reviewId ? "Removing..." : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          Showing {(page - 1) * PAGE_SIZE + (reviews.length ? 1 : 0)}-
          {(page - 1) * PAGE_SIZE + reviews.length} of {pagination.totalItems} reviews
        </p>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-50"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
          >
            Previous
          </button>

          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`rounded-md px-3 py-1.5 text-sm ${
                pageNumber === page
                  ? "bg-green-600 text-white"
                  : "border border-gray-200 text-gray-700"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-50"
            onClick={() =>
              setPage((prev) => Math.min(Number(pagination.totalPages || 1), prev + 1))
            }
            disabled={page >= Number(pagination.totalPages || 1)}
          >
            Next
          </button>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={confirmModal.open}
        title={
          confirmModal.mode === "bulk"
            ? "Delete selected reviews?"
            : "Delete this review?"
        }
        message={
          confirmModal.mode === "bulk"
            ? `This will permanently remove ${selectedCount} selected review(s). This action cannot be undone.`
            : "This review will be permanently removed. This action cannot be undone."
        }
        confirmLabel={
          confirmModal.mode === "bulk"
            ? `Delete ${selectedCount} Review(s)`
            : "Delete Review"
        }
        loading={
          confirmModal.mode === "bulk"
            ? bulkDeleting
            : !!deletingReviewId
        }
        onCancel={closeConfirmModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
